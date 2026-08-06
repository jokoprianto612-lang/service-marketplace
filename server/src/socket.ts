// ─────────────────────────────────────────────
// Socket.io Setup - Real-time features
// ─────────────────────────────────────────────
import { Server as SocketIOServer, Socket } from 'socket.io';
import { FastifyInstance } from 'fastify';
import { Server as HttpServer } from 'http';
import { verify } from 'jsonwebtoken';
import { config } from '@/config';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    roles: string[];
    projectId?: string;
  };
}

let io: SocketIOServer | null = null;

export function setupSocketIO(app: FastifyInstance) {
  const httpServer = app.server as HttpServer;

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.FRONTEND_URL,
      credentials: true,
    },
    path: '/ws',
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = verify(token, config.JWT_SECRET) as { sub: string; email: string; roles: string[]; projectId?: string };
      socket.user = {
        id: decoded.sub,
        email: decoded.email,
        roles: decoded.roles,
        projectId: decoded.projectId,
      };
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.user!;
    const projectRoom = `project:${user.projectId}`;

    // Join project room
    socket.join(projectRoom);

    // Join user room
    socket.join(`user:${user.id}`);

    app.log.info({ userId: user.id, socketId: socket.id }, 'Socket connected');

    // Subscribe to service logs
    socket.on('subscribe:logs', ({ instanceId }) => {
      socket.join(`logs:${instanceId}`);
      app.log.debug({ socketId: socket.id, instanceId }, 'Subscribed to logs');
    });

    // Unsubscribe from service logs
    socket.on('unsubscribe:logs', ({ instanceId }) => {
      socket.leave(`logs:${instanceId}`);
    });

    // Subscribe to service metrics
    socket.on('subscribe:metrics', ({ instanceId }) => {
      socket.join(`metrics:${instanceId}`);
    });

    // Unsubscribe from service metrics
    socket.on('unsubscribe:metrics', ({ instanceId }) => {
      socket.leave(`metrics:${instanceId}`);
    });

    // Subscribe to deployment progress
    socket.on('subscribe:deployment', ({ deploymentId }) => {
      socket.join(`deployment:${deploymentId}`);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      app.log.info({ userId: user.id, socketId: socket.id, reason }, 'Socket disconnected');
    });

    // Handle errors
    socket.on('error', (err) => {
      app.log.error({ userId: user.id, socketId: socket.id, error: err }, 'Socket error');
    });
  });

  // Store io instance on fastify for use in routes/services
  app.decorate('io', io);

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

// Emit helpers for use in services
export function emitLog(instanceId: string, log: { timestamp: string; level: string; message: string; container: string; metadata?: any }) {
  io?.to(`logs:${instanceId}`).emit('log:entry', log);
}

export function emitMetrics(instanceId: string, metrics: { cpu: any[]; memory: any[]; network: { rx: any[]; tx: any[] } }) {
  io?.to(`metrics:${instanceId}`).emit('metrics:update', metrics);
}

export function emitDeploymentProgress(deploymentId: string, progress: { progress: number; message: string; status: string }) {
  io?.to(`deployment:${deploymentId}`).emit('deployment:progress', progress);
}

export function emitServiceStatusChange(instanceId: string, status: string, health?: any) {
  io?.to(`project:*`).emit('service:status_change', { instanceId, status, health });
}

export function emitToProject(projectId: string, event: string, data: any) {
  io?.to(`project:${projectId}`).emit(event, data);
}

export function emitToUser(userId: string, event: string, data: any) {
  io?.to(`user:${userId}`).emit(event, data);
}