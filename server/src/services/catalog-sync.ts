// ─────────────────────────────────────────────
// Catalog Sync Service - Git-based catalog
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface ServiceDefinitionFile {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  icon: string;
  version: string;
  maintainer: string;
  repository: string;
  documentation: string;
  license: string;
  dockerCompose: string;
  defaultConfig: Record<string, any>;
  configSchema: Record<string, any>;
  minMemory: number;
  minCpu: number;
  minDisk: number;
  requiresGpu: boolean;
  supportedArchitectures: string[];
  tags: string[];
  pricing: string;
  maturity: string;
}

export async function syncCatalog(fastify: FastifyInstance, options?: {
  repoUrl?: string;
  branch?: string;
  token?: string;
}): Promise<{ synced: number; updated: number; errors: string[] }> {
  const prisma = fastify.prisma;
  
  if (!options?.repoUrl) {
    return { synced: 0, updated: 0, errors: ['repoUrl is required for sync'] };
  }
  
  const { repoUrl, branch = 'main', token } = options;
  const catalogPath = await cloneOrPullRepo(fastify, { repoUrl, branch, token });

  const errors: string[] = [];
  let synced = 0;
  let updated = 0;

  try {
    const entries = await fs.readdir(catalogPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const serviceDir = path.join(catalogPath, entry.name);
      const definitionFile = path.join(serviceDir, 'service.yaml');

      try {
        const content = await fs.readFile(definitionFile, 'utf8');
        const definition = yaml.load(content) as ServiceDefinitionFile;

        // Validate required fields
        if (!definition.id || !definition.name || !definition.dockerCompose) {
          errors.push(`${entry.name}: Missing required fields`);
          continue;
        }

        // Upsert service definition
        const existing = await prisma.serviceDefinition.findUnique({ where: { id: definition.id } });

        const data = {
          name: definition.name,
          slug: definition.id,
          description: definition.description,
          longDescription: definition.longDescription || definition.description,
          category: definition.category.toUpperCase(),
          icon: definition.icon,
          version: definition.version,
          maintainer: definition.maintainer,
          repository: definition.repository,
          documentation: definition.documentation,
          license: definition.license,
          dockerCompose: definition.dockerCompose,
          defaultConfig: definition.defaultConfig || {},
          configSchema: definition.configSchema || {},
          minMemory: definition.minMemory || 128,
          minCpu: definition.minCpu || 100,
          minDisk: definition.minDisk || 1024,
          requiresGpu: definition.requiresGpu || false,
          supportedArchitectures: definition.supportedArchitectures || ['amd64'],
          tags: definition.tags || [],
          pricing: (definition.pricing || 'FREE').toUpperCase(),
          maturity: (definition.maturity || 'ALPHA').toUpperCase(),
          isActive: true,
        };

        if (existing) {
          await prisma.serviceDefinition.update({
            where: { id: definition.id },
            data,
          });
          updated++;
        } else {
          await prisma.serviceDefinition.create({ data });
          synced++;
        }
      } catch (err) {
        errors.push(`${entry.name}: ${err}`);
      }
    }

    // Log sync
    await prisma.catalogSync.create({
      data: {
        status: errors.length > 0 ? 'partial' : 'completed',
        source: options?.repoUrl || 'local',
        branch: options?.branch || 'main',
        services: synced + updated,
        error: errors.length > 0 ? errors.join('; ') : null,
        completedAt: new Date(),
      },
    });

    return { synced, updated, errors };
  } catch (err) {
    await prisma.catalogSync.create({
      data: {
        status: 'failed',
        source: options?.repoUrl || 'local',
        branch: options?.branch || 'main',
        services: 0,
        error: String(err),
        completedAt: new Date(),
      },
    });
    throw err;
  }
}

async function cloneOrPullRepo(fastify: FastifyInstance, options: { repoUrl: string; branch?: string; token?: string }): Promise<string> {
  const { repoUrl, branch = 'main', token } = options;
  const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'catalog';
  const localPath = path.join(config.CATALOG_PATH, '..', repoName);

  // Use simple git commands via child_process
  const { execSync } = await import('child_process');

  try {
    // Check if repo exists
    try {
      await fs.access(path.join(localPath, '.git'));
      // Pull latest
      execSync(`git -C "${localPath}" fetch origin ${branch}`, { stdio: 'ignore' });
      execSync(`git -C "${localPath}" reset --hard origin/${branch}`, { stdio: 'ignore' });
    } catch {
      // Clone
      const authUrl = token ? repoUrl.replace('https://', `https://${token}@`) : repoUrl;
      execSync(`git clone --branch ${branch} --depth 1 "${authUrl}" "${localPath}"`, { stdio: 'ignore' });
    }
  } catch (err) {
    throw new Error(`Git operation failed: ${err}`);
  }

  return localPath;
}

export async function getCatalogSyncStatus(fastify: FastifyInstance) {
  const prisma = fastify.prisma;
  return prisma.catalogSync.findMany({
    orderBy: { startedAt: 'desc' },
    take: 10,
  });
}