import bcrypt from "bcrypt";
import { AppDataSource } from "../database/dataSource";
import { User } from "../entities/User";
import { AppError } from "../utils/AppError";
import { signAccessToken } from "../utils/jwt";

const SALT_ROUNDS = 12;

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

function toPublicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export const AuthService = {
  async register(input: RegisterInput) {
    const userRepository = AppDataSource.getRepository(User);
    const email = input.email.trim().toLowerCase();
    const existingUser = await userRepository.findOneBy({ email });

    if (existingUser) {
      throw new AppError(409, "EMAIL_ALREADY_REGISTERED", "An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = userRepository.create({
      name: input.name.trim(),
      email,
      passwordHash,
    });
    const savedUser = await userRepository.save(user);

    return {
      user: toPublicUser(savedUser),
      accessToken: signAccessToken(savedUser.id),
    };
  },

  async login(input: LoginInput) {
    const userRepository = AppDataSource.getRepository(User);
    const email = input.email.trim().toLowerCase();
    const user = await userRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }

    return {
      user: toPublicUser(user),
      accessToken: signAccessToken(user.id),
    };
  },

  async getCurrentUser(userId: string) {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });

    if (!user) {
      throw new AppError(401, "INVALID_TOKEN", "The authenticated user no longer exists.");
    }

    return toPublicUser(user);
  },
};
