// ─────────────────────────────────────────────
// Docker Service - Deployment Engine
// ─────────────────────────────────────────────
import Docker from 'dockerode';
import { FastifyInstance } from 'fastify';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';

let dockerClient: Docker | null = null;

export function getDockerClient(fastify: FastifyInstance): Docker {
  if (!dockerClient) {
    dockerClient = new Docker({
      socketPath: config.DOCKER_HOST.replace('unix://', ''),
    });
  }
  return dockerClient;
}

export async function deployService(
  fastify: FastifyInstance,
  instanceId: string,
  composeContent: string,
  config: Record<string, any>
): Promise<{ containers: any[]; projectName: string }> {
  const docker = getDockerClient(fastify);
  const projectName = `svcmarket-${instanceId}`;

  // TODO: Parse docker-compose and deploy containers
  // This is a simplified implementation - in production use docker-compose library or compose-spec

  const prisma = fastify.prisma;

  // For now, simulate deployment
  const containers: any[] = [];

  // In a real implementation:
  // 1. Parse docker-compose.yml
  // 2. Substitute environment variables from config
  // 3. Create networks
  // 4. Create volumes
  // 5. Pull images
  // 6. Create and start containers
  // 7. Configure networking (Traefik labels for auto-TLS)
  // 8. Run health checks

  return { containers, projectName };
}

export async function startService(fastify: FastifyInstance, instanceId: string): Promise<void> {
  const docker = getDockerClient(fastify);
  const projectName = `svcmarket-${instanceId}`;

  // Find and start containers with the project label
  const containers = await docker.listContainers({
    all: true,
    filters: { label: [`com.docker.compose.project=${projectName}`] },
  });

  for (const containerInfo of containers) {
    const container = docker.getContainer(containerInfo.Id);
    await container.start();
  }
}

export async function stopService(fastify: FastifyInstance, instanceId: string): Promise<void> {
  const docker = getDockerClient(fastify);
  const projectName = `svcmarket-${instanceId}`;

  const containers = await docker.listContainers({
    all: true,
    filters: { label: [`com.docker.compose.project=${projectName}`] },
  });

  for (const containerInfo of containers) {
    const container = docker.getContainer(containerInfo.Id);
    await container.stop();
  }
}

export async function restartService(fastify: FastifyInstance, instanceId: string): Promise<void> {
  await stopService(fastify, instanceId);
  await sleep(2000);
  await startService(fastify, instanceId);
}

export async function scaleService(fastify: FastifyInstance, instanceId: string, serviceName: string, replicas: number): Promise<void> {
  const docker = getDockerClient(fastify);
  const projectName = `svcmarket-${instanceId}`;

  // Docker Compose scale is complex - would need to use docker-compose CLI or library
  // For now, this is a placeholder
  fastify.log.info({ instanceId, serviceName, replicas }, 'Scaling service');
}

export async function removeService(fastify: FastifyInstance, instanceId: string): Promise<void> {
  const docker = getDockerClient(fastify);
  const projectName = `svcmarket-${instanceId}`;

  const containers = await docker.listContainers({
    all: true,
    filters: { label: [`com.docker.compose.project=${projectName}`] },
  });

  for (const containerInfo of containers) {
    const container = docker.getContainer(containerInfo.Id);
    await container.stop();
    await container.remove({ v: true }); // Remove volumes
  }

  // Remove networks
  const networks = await docker.listNetworks({
    filters: { label: [`com.docker.compose.project=${projectName}`] },
  });

  for (const network of networks) {
    try {
      const net = docker.getNetwork(network.Id);
      await net.remove();
    } catch {
      // Network might be in use
    }
  }
}

export async function getServiceLogs(fastify: FastifyInstance, instanceId: string, containerName: string, tail: number = 100): Promise<string[]> {
  const docker = getDockerClient(fastify);
  const projectName = `svcmarket-${instanceId}`;

  const containers = await docker.listContainers({
    all: true,
    filters: { label: [`com.docker.compose.project=${projectName}`] },
  });

  const containerInfo = containers.find(c => c.Names.some(n => n.includes(containerName)));
  if (!containerInfo) return [];

  const container = docker.getContainer(containerInfo.Id);
  const stream = await container.logs({ follow: false, stdout: true, stderr: true, tail });
  
  // Parse Docker log stream (it has 8-byte headers)
  const logs: string[] = [];
  let offset = 0;
  while (offset < stream.length) {
    const header = stream.slice(offset, offset + 8);
    const length = header.readUInt32BE(4);
    offset += 8;
    const message = stream.slice(offset, offset + length).toString('utf8');
    logs.push(message);
    offset += length;
  }

  return logs;
}

export async function getServiceStats(fastify: FastifyInstance, instanceId: string): Promise<any[]> {
  const docker = getDockerClient(fastify);
  const projectName = `svcmarket-${instanceId}`;

  const containers = await docker.listContainers({
    all: true,
    filters: { label: [`com.docker.compose.project=${projectName}`] },
  });

  const stats = [];
  for (const containerInfo of containers) {
    const container = docker.getContainer(containerInfo.Id);
    const stream = await container.stats({ stream: false });
    stats.push({
      id: containerInfo.Id,
      name: containerInfo.Names[0],
      cpu: calculateCpuPercent(stream),
      memory: stream.memory_stats.usage,
      memoryLimit: stream.memory_stats.limit,
      network: {
        rx: (stream as any).networks?.rx_bytes || (stream as any).network_stats?.rx_bytes || 0,
        tx: (stream as any).networks?.tx_bytes || (stream as any).network_stats?.tx_bytes || 0,
      },
    });
  }

  return stats;
}

function calculateCpuPercent(stats: any): number {
  const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const onlineCpus = stats.cpu_stats.online_cpus || 1;
  
  if (systemDelta > 0 && cpuDelta > 0) {
    return (cpuDelta / systemDelta) * onlineCpus * 100;
  }
  return 0;
}

export async function checkDockerHealth(fastify: FastifyInstance): Promise<boolean> {
  try {
    const docker = getDockerClient(fastify);
    await docker.ping();
    return true;
  } catch {
    return false;
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}