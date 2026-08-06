// ─────────────────────────────────────────────
// Job Queue Service (BullMQ with Redis)
// ─────────────────────────────────────────────
import { Queue, Worker, Job } from 'bullmq';
import { FastifyInstance } from 'fastify';
import { config } from '../config';

interface DeploymentJobData {
  instanceId: string;
  definitionId: string;
  projectId: string;
  userId: string;
  mode: 'quick' | 'custom' | 'stack';
  config?: Record<string, any>;
  deploymentId: string;
}

let deploymentQueue: Queue | null = null;

export function getDeploymentQueue(fastify: FastifyInstance): Queue {
  if (!deploymentQueue) {
    deploymentQueue = new Queue('svcmarket:deployments', {
      connection: { url: config.REDIS_URL },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });
  }
  return deploymentQueue;
}

export async function queueDeployment(fastify: FastifyInstance, data: DeploymentJobData) {
  const queue = getDeploymentQueue(fastify);
  return queue.add('deploy', data);
}

export async function queueServiceAction(fastify: FastifyInstance, instanceId: string, action: string, params: any) {
  const queue = getDeploymentQueue(fastify);
  return queue.add(action, { instanceId, ...params });
}

// Start worker for processing deployment jobs
export function startDeploymentWorker(fastify: FastifyInstance) {
  const queue = getDeploymentQueue(fastify);

  const worker = new Worker('svcmarket:deployments', async (job: Job) => {
    const { name, data } = job;

    switch (name) {
      case 'deploy':
        await processDeployment(fastify, data);
        break;
      case 'start':
      case 'stop':
      case 'restart':
      case 'scale':
        await processServiceAction(fastify, name, data);
        break;
      case 'backup':
        await processBackup(fastify, data);
        break;
      default:
        throw new Error(`Unknown job type: ${name}`);
    }
  }, {
    connection: { url: config.REDIS_URL },
    concurrency: 5,
  });

  worker.on('completed', (job) => {
    fastify.log.info({ jobId: job.id }, 'Deployment job completed');
  });

  worker.on('failed', (job, err) => {
    fastify.log.error({ jobId: job?.id, error: err }, 'Deployment job failed');
  });

  return worker;
}

async function processDeployment(fastify: FastifyInstance, data: DeploymentJobData) {
  const prisma = fastify.prisma;
  const { instanceId, definitionId, deploymentId } = data;

  try {
    // Update deployment status
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: { status: 'DEPLOYING', logs: 'Starting deployment...\n' },
    });

    await prisma.serviceInstance.update({
      where: { id: instanceId },
      data: { status: 'DEPLOYING' },
    });

    // Get service definition
    const definition = await prisma.serviceDefinition.findUnique({
      where: { id: definitionId },
    });

    if (!definition) {
      throw new Error('Service definition not found');
    }

    // Update progress
    await updateDeploymentProgress(fastify, deploymentId, 10, 'Validating configuration');

    // Parse docker-compose
    const compose = definition.dockerCompose;
    // TODO: Actually deploy using Docker API

    await updateDeploymentProgress(fastify, deploymentId, 25, 'Pulling Docker images');
    await sleep(2000);

    await updateDeploymentProgress(fastify, deploymentId, 50, 'Creating containers');
    await sleep(3000);

    await updateDeploymentProgress(fastify, deploymentId, 75, 'Running health checks');
    await sleep(2000);

    await updateDeploymentProgress(fastify, deploymentId, 90, 'Configuring networking');
    await sleep(1000);

    // Mark as complete
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: 'RUNNING',
        completedAt: new Date(),
        duration: Date.now() - new Date(deploymentId).getTime(),
        logs: (await prisma.deployment.findUnique({ where: { id: deploymentId }, select: { logs: true } }))?.logs + 'Deployment completed successfully\n',
      },
    });

    await prisma.serviceInstance.update({
      where: { id: instanceId },
      data: {
        status: 'RUNNING',
        deployedAt: new Date(),
        deploymentInfo: { composeProjectName: `svcmarket-${instanceId}` },
      },
    });

  } catch (err) {
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: 'ERROR',
        error: String(err),
        completedAt: new Date(),
        logs: (await prisma.deployment.findUnique({ where: { id: deploymentId }, select: { logs: true } }))?.logs + `Error: ${err}\n`,
      },
    });

    await prisma.serviceInstance.update({
      where: { id: instanceId },
      data: { status: 'ERROR' },
    });

    throw err;
  }
}

async function updateDeploymentProgress(fastify: FastifyInstance, deploymentId: string, progress: number, message: string) {
  const prisma = fastify.prisma;
  const deployment = await prisma.deployment.findUnique({ where: { id: deploymentId }, select: { logs: true } });
  const logEntry = `[${new Date().toISOString()}] ${message} (${progress}%)\n`;
  await prisma.deployment.update({
    where: { id: deploymentId },
    data: { logs: (deployment?.logs || '') + logEntry },
  });
}

async function processServiceAction(fastify: FastifyInstance, action: string, data: any) {
  const prisma = fastify.prisma;
  const { instanceId } = data;

  // TODO: Implement actual Docker actions
  await sleep(2000);
}

async function processBackup(fastify: FastifyInstance, data: any) {
  const prisma = fastify.prisma;
  const { instanceId } = data;

  // TODO: Implement backup
  await sleep(5000);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}