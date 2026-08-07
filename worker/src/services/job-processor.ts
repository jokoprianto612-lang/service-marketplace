// ─────────────────────────────────────────────
// Job Processor - Cloudflare Worker
// ─────────────────────────────────────────────
import type { Env } from '../types';
import { jobQueue } from './job-queue';

export async function processPendingJobs(env: Env): Promise<void> {
  try {
    // Process up to 10 jobs per cron trigger
    for (let i = 0; i < 10; i++) {
      const job = await jobQueue.dequeue(env);
      if (!job) break;
      
      try {
        await processJob(job, env);
        await jobQueue.complete(env, job.id);
      } catch (err) {
        console.error(`Job ${job.id} failed:`, err);
        await jobQueue.fail(env, job.id, String(err));
      }
    }
  } catch (err) {
    console.error('Job processor error:', err);
  }
}

async function processJob(job: { id: string; type: string; payload: any }, env: Env): Promise<void> {
  switch (job.type) {
    case 'deploy':
      await processDeployment(job.payload, env);
      break;
    case 'sync':
      await processSync(job.payload, env);
      break;
    case 'cleanup':
      await processCleanup(job.payload, env);
      break;
    default:
      console.warn(`Unknown job type: ${job.type}`);
  }
}

async function processDeployment(payload: any, env: Env): Promise<void> {
  const { deploymentId, serviceId, projectId, config } = payload;
  
  // Update deployment status to in_progress
  await env.DB.prepare(
    'UPDATE deployments SET status = ?, started_at = ? WHERE id = ?'
  ).bind('in_progress', new Date().toISOString(), deploymentId).run();
  
  try {
    // TODO: Actual deployment logic - generate docker-compose, deploy to VPS, etc.
    // For now, simulate deployment
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Generate deployment outputs
    const outputs = {
      url: `https://${serviceId}.${projectId}.svcmarket.local`,
      credentials: {
        username: 'admin',
        password: 'generated-password',
      },
      endpoints: ['http', 'https'],
    };
    
    // Update deployment as completed
    await env.DB.prepare(
      'UPDATE deployments SET status = ?, outputs = ?, completed_at = ? WHERE id = ?'
    ).bind('completed', JSON.stringify(outputs), new Date().toISOString(), deploymentId).run();
    
  } catch (err) {
    // Update deployment as failed
    await env.DB.prepare(
      'UPDATE deployments SET status = ?, error = ?, completed_at = ? WHERE id = ?'
    ).bind('failed', String(err), new Date().toISOString(), deploymentId).run();
    throw err;
  }
}

async function processSync(payload: any, env: Env): Promise<void> {
  const { catalogUrl } = payload;
  
  // TODO: Fetch catalog from Git repo and update KV
  console.log(`Syncing catalog from ${catalogUrl}`);
  
  // Mock sync - in production, fetch from Git and store in KV
  await env.JOBS_KV.put('catalog:last-synced', new Date().toISOString());
}

async function processCleanup(payload: any, env: Env): Promise<void> {
  const { olderThanDays = 30 } = payload;
  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();
  
  // Clean up old completed/failed deployments
  await env.DB.prepare(
    'DELETE FROM deployments WHERE status IN (?, ?) AND completed_at < ?'
  ).bind('completed', 'failed', cutoff).run();
  
  // Clean up old job records
  await env.DB.prepare(
    'DELETE FROM jobs WHERE status IN (?, ?) AND completed_at < ?'
  ).bind('completed', 'failed', cutoff).run();
}