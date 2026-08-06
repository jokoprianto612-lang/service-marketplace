"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = healthRoutes;
async function healthRoutes(app) {
    // GET /health - Basic health check
    app.get('/health', async () => ({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    }));
    // GET /health/ready - Readiness check (DB connectivity)
    app.get('/health/ready', async (request, reply) => {
        const prisma = request.server.prisma;
        try {
            await prisma.$queryRaw `SELECT 1`;
            return { status: 'ready', timestamp: new Date().toISOString() };
        }
        catch (err) {
            reply.status(503);
            return { status: 'not ready', timestamp: new Date().toISOString(), error: String(err) };
        }
    });
    // GET /health/live - Liveness check
    app.get('/health/live', async () => ({
        status: 'alive',
        timestamp: new Date().toISOString(),
    }));
}
