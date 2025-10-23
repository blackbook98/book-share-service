import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async findOne(username: string): Promise<any> {
    const user = { id: 1, username: username, password: 'hashedpassword' }; // Mocked user
    return user;
  }
}
