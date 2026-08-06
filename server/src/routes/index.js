"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const auth_1 = require("./auth");
const catalog_1 = require("./catalog");
const services_1 = require("./services");
const projects_1 = require("./projects");
const deployments_1 = require("./deployments");
const backups_1 = require("./backups");
const audit_1 = require("./audit");
const health_1 = require("./health");
const registerRoutes = async (app) => {
    await app.register(async (fastify) => {
        fastify.prefix('/api/v1');
        // Public routes
        fastify.register(auth_1.authRoutes, { prefix: '/auth' });
        fastify.register(catalog_1.catalogRoutes, { prefix: '/catalog' });
        fastify.register(health_1.healthRoutes, { prefix: '/health' });
        // Protected routes (require auth)
        fastify.register(async (protectedFastify) => {
            protectedFastify.addHook('onRequest', async (request, reply) => {
                await fastify.authenticate(request, reply);
            });
            protectedFastify.register(projects_1.projectRoutes, { prefix: '/projects' });
            protectedFastify.register(services_1.serviceRoutes, { prefix: '/services' });
            protectedFastify.register(deployments_1.deploymentRoutes, { prefix: '/deployments' });
            protectedFastify.register(backups_1.backupRoutes, { prefix: '/backups' });
            protectedFastify.register(audit_1.auditRoutes, { prefix: '/audit' });
        });
    });
};
exports.registerRoutes = registerRoutes;
