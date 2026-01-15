import { prisma } from "../../../lib/prisma";
import { IUserRepository } from '../../../shared/interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async create(data: { name: string; email: string; password: string }) {
    return await prisma.user.create({ data });
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
}

}
