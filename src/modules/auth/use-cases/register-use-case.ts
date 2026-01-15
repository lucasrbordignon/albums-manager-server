import { AppError } from '../../../shared/errors/AppError';
import { IUserRepository } from '../../../shared/interfaces/IUserRepository';
import { hashPassword } from '../../../shared/utils/hash';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const passwordHash = await hashPassword(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return { user };
  }
}
