"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
exports.verifyRefreshToken = verifyRefreshToken;
const config_1 = require("../config");
function generateTokens(fastify, user) {
    const accessToken = fastify.jwt.sign({ sub: user.id, email: user.email, roles: user.roles, projectId: user.projectId }, { expiresIn: config_1.config.JWT_EXPIRES_IN });
    const refreshToken = fastify.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn: config_1.config.REFRESH_TOKEN_EXPIRES_IN });
    return { accessToken, refreshToken };
}
function verifyRefreshToken(fastify, token) {
    return fastify.jwt.verify(token);
}
