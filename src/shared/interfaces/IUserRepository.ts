export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>;
  create(userData: { name: string; email: string; password: string }): Promise<any>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}
