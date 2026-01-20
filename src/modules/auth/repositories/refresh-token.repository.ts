import { prisma } from "../../../lib/prisma";

export class RefreshTokenRepository {
  async create(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async deleteById(id: string) {
    return prisma.refreshToken.delete({ where: { id } });
  }
}
