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

  async findUser(data: Partial<User>): Promise<any> {
    try {
      let userdata = await this.userRepository.findOne({
        where: { username: data.username },
      });

      if (userdata) {
        return userdata;
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error in finding user', error);
      return null;
    }
  }

  async createUser(data: Partial<User>): Promise<any> {
    try {
      let { password: pass } = data;
      let encrypted_password = await bcrypt.hash(pass, 10);

      //TODO: Add BE Validations
      let userdata = this.userRepository.create({
        ...data,
        password: encrypted_password,
      });
      return await this.userRepository.save(userdata);
    } catch (error) {
      console.error('Error in creating user', error);
      return null;
    }
  }
}
