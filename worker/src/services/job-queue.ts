// ─────────────────────────────────────────────
// Job Queue Service (using BullMQ with Redis/KV)
// ─────────────────────────────────────────────
import { Queue, Worker, Job } from 'bullmq';
import type { Env } from '../types';

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

export const jobQueue = {
  async enqueue(env: Env, name: string, data: any, opts = {}) {
    const queue = createJobQueue(env);
    return queue.add(name, data, opts);
  },

  async dequeue(env: Env) {
    const queue = createJobQueue(env);
    const waiting = await queue.getWaiting();
    if (waiting.length === 0) return null;
    const job = waiting[0];
    return { id: job.id, type: job.name, payload: job.data };
  },

  async complete(env: Env, jobId: string) {
    const queue = createJobQueue(env);
    const job = await queue.getJob(jobId);
    if (job) {
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job));
    }
  },

  async fail(env: Env, jobId: string, error: string) {
    const queue = createJobQueue(env);
    const job = await queue.getJob(jobId);
    if (job) {
      job.status = 'failed';
      job.error = error;
      job.failedAt = new Date().toISOString();
      await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job));
    }
  },
};

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