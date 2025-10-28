import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/models/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUser(username: string): Promise<any> {
    try {
      const user = {
        id: 1,
        username: username,
        password:
          '$2b$10$LQuAHtEUVWxB7F2yISgV4O3Wg7JKH52rxftDurRQuhRFqp3Q0r4B.',
      }; // Mocked user, TODO: replace with real DB call
      return user;
    } catch (error) {
      return null;
    }
  }

  async createUser(username: string, pass: string): Promise<any> {
    try {
      let encrypted_password = await bcrypt.hash(pass, 10);
      const user = {
        id: 1,
        username: username,
        password: encrypted_password,
      }; // Mocked user, TODO: replace with real DB call
      return user;
    } catch (error) {
      return null;
    }
  }
}
