import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async findOne(username: string): Promise<any> {
    const user = {
      id: 1,
      username: username,
      password: '$2b$10$LQuAHtEUVWxB7F2yISgV4O3Wg7JKH52rxftDurRQuhRFqp3Q0r4B.',
    }; // Mocked user, TODO: replace with real DB call
    return user;
  }
}
