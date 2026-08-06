"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuth = optionalAuth;
exports.requireRole = requireRole;
async function authenticate(request, reply) {
    try {
        await request.jwtVerify();
        // user is already set by jwtVerify via @fastify/jwt
    }
    catch (err) {
        return reply.status(401).send({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
                statusCode: 401,
            },
        });
    }
}
async function optionalAuth(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch {
        // Ignore - user stays undefined
    }
}
function requireRole(roles) {
    return async function (request, reply) {
        if (!request.user) {
            return reply.status(401).send({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                    statusCode: 401,
                },
            });
        }
        const hasRole = roles.some((role) => request.user.roles.includes(role));
        if (!hasRole) {
            return reply.status(403).send({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions',
                    statusCode: 403,
                },
            });
        }
    };
}
