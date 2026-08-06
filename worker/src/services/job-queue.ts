// ─────────────────────────────────────────────
// Job Queue Service (using BullMQ with Redis/KV)
// ─────────────────────────────────────────────
import { Queue, Worker, Job } from 'bullmq';
import type { Env } from '../worker';

interface DeploymentJobData {
  instanceId: string;
  definitionId: string;
  projectId: string;
  userId: string;
  mode: 'quick' | 'custom' | 'stack';
  config?: Record<string, any>;
}

interface JobQueue {
  add: (name: string, data: any, opts?: any) => Promise<any>;
  getJob: (id: string) => Promise<any>;
  getWaiting: () => Promise<any[]>;
  getActive: () => Promise<any[]>;
  getCompleted: () => Promise<any[]>;
  getFailed: () => Promise<any[]>;
}

export function createJobQueue(env: Env): JobQueue {
  // In production, use Redis connection
  // For Cloudflare Workers, use KV as a simple queue
  const queueName = 'svcmarket:jobs';
  
  return {
    async add(name: string, data: any, opts = {}) {
      const jobId = `${name}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
      const job = {
        id: jobId,
        name,
        data,
        opts,
        status: 'waiting',
        createdAt: new Date().toISOString(),
      };
      
      await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job), { expirationTtl: 86400 });
      
      // Add to queue list
      const queueKey = `queue:${queueName}:waiting`;
      const waiting = await env.JOBS_KV.get(queueKey, 'json') as string[] || [];
      waiting.push(jobId);
      await env.JOBS_KV.put(queueKey, JSON.stringify(waiting));
      
      return job;
    },

    async getJob(id: string) {
      return env.JOBS_KV.get(`job:${id}`, 'json');
    },

    async getWaiting() {
      const queueKey = `queue:${queueName}:waiting`;
      const waiting = await env.JOBS_KV.get(queueKey, 'json') as string[] || [];
      const jobs = [];
      for (const id of waiting) {
        const job = await env.JOBS_KV.get(`job:${id}`, 'json');
        if (job) jobs.push(job);
      }
      return jobs;
    },

    async getActive() {
      const queueKey = `queue:${queueName}:active`;
      const active = await env.JOBS_KV.get(queueKey, 'json') as string[] || [];
      const jobs = [];
      for (const id of active) {
        const job = await env.JOBS_KV.get(`job:${id}`, 'json');
        if (job) jobs.push(job);
      }
      return jobs;
    },

    async getCompleted() {
      const queueKey = `queue:${queueName}:completed`;
      const completed = await env.JOBS_KV.get(queueKey, 'json') as string[] || [];
      const jobs = [];
      for (const id of completed) {
        const job = await env.JOBS_KV.get(`job:${id}`, 'json');
        if (job) jobs.push(job);
      }
      return jobs;
    },

    async getFailed() {
      const queueKey = `queue:${queueName}:failed`;
      const failed = await env.JOBS_KV.get(queueKey, 'json') as string[] || [];
      const jobs = [];
      for (const id of failed) {
        const job = await env.JOBS_KV.get(`job:${id}`, 'json');
        if (job) jobs.push(job);
      }
      return jobs;
    },
  };
}

export async function queueDeployment(env: Env, data: DeploymentJobData) {
  const queue = createJobQueue(env);
  return queue.add('deploy', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  });
}

export async function queueServiceAction(env: Env, instanceId: string, action: string, params: any) {
  const queue = createJobQueue(env);
  return queue.add(action, { instanceId, ...params });
}

export async function processJob(env: Env, jobId: string) {
  const jobData = await env.JOBS_KV.get(`job:${jobId}`, 'json') as any;
  if (!jobData) return false;

  // Move to active
  const waitingKey = `queue:svcmarket:jobs:waiting`;
  const activeKey = `queue:svcmarket:jobs:active`;
  
  let waiting = await env.JOBS_KV.get(waitingKey, 'json') as string[] || [];
  waiting = waiting.filter(id => id !== jobId);
  await env.JOBS_KV.put(waitingKey, JSON.stringify(waiting));

  let active = await env.JOBS_KV.get(activeKey, 'json') as string[] || [];
  active.push(jobId);
  await env.JOBS_KV.put(activeKey, JSON.stringify(active));

  // Update job status
  jobData.status = 'active';
  jobData.startedAt = new Date().toISOString();
  await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(jobData));

  try {
    // Process based on job type
    await processJobByType(env, jobData);
    
    // Mark completed
    jobData.status = 'completed';
    jobData.completedAt = new Date().toISOString();
    jobData.progress = 100;
    
    // Move to completed
    active = active.filter(id => id !== jobId);
    await env.JOBS_KV.put(activeKey, JSON.stringify(active));
    
    const completedKey = `queue:svcmarket:jobs:completed`;
    let completed = await env.JOBS_KV.get(completedKey, 'json') as string[] || [];
    completed.push(jobId);
    await env.JOBS_KV.put(completedKey, JSON.stringify(completed));
    
  } catch (err) {
    // Mark failed
    jobData.status = 'failed';
    jobData.error = String(err);
    jobData.failedAt = new Date().toISOString();
    
    active = active.filter(id => id !== jobId);
    await env.JOBS_KV.put(activeKey, JSON.stringify(active));
    
    const failedKey = `queue:svcmarket:jobs:failed`;
    let failed = await env.JOBS_KV.get(failedKey, 'json') as string[] || [];
    failed.push(jobId);
    await env.JOBS_KV.put(failedKey, JSON.stringify(failed));
  }

  await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(jobData));
  return true;
}

async function processJobByType(env: Env, jobData: any) {
  switch (jobData.name) {
    case 'deploy':
      await processDeployment(env, jobData.data);
      break;
    case 'start':
    case 'stop':
    case 'restart':
    case 'scale':
      await processServiceAction(env, jobData.name, jobData.data);
      break;
    case 'backup':
      await processBackup(env, jobData.data);
      break;
    default:
      throw new Error(`Unknown job type: ${jobData.name}`);
  }
}

async function processDeployment(env: Env, data: DeploymentJobData) {
  // Simulate deployment steps
  const steps = [
    { progress: 10, message: 'Validating configuration' },
    { progress: 25, message: 'Pulling Docker images' },
    { progress: 50, message: 'Creating containers' },
    { progress: 75, message: 'Running health checks' },
    { progress: 90, message: 'Configuring networking' },
    { progress: 100, message: 'Deployment completed' },
  ];

  for (const step of steps) {
    const job = await env.JOBS_KV.get(`job:${jobData.instanceId}`, 'json') as any;
    if (job) {
      job.progress = step.progress;
      job.currentStep = step.message;
      await env.JOBS_KV.put(`job:${jobData.instanceId}`, JSON.stringify(job));
    }
    // Simulate work
    await new Promise(r => setTimeout(r, 1000));
  }
}

async function processServiceAction(env: Env, action: string, data: any) {
  // Simulate action
  await new Promise(r => setTimeout(r, 2000));
}

async function processBackup(env: Env, data: any) {
  // Simulate backup
  await new Promise(r => setTimeout(r, 5000));
}