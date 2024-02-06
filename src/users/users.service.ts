import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import { compare, hash } from 'bcryptjs';
import { config } from 'dotenv';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';
config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async signUp(body: UserSignUpDto): Promise<UserEntity> {
    const existingUser = await this.findUserByEmail(body.email);
    if (!!existingUser) throw new BadRequestException('Email already exists');

    // hashing the password
    body.password = await hash(body.password, +process.env.PASWORD_HASH_SALT);
    let user = this.userRepo.create(body);
    user = await this.userRepo.save(user);
    delete user.password;
    return user;
  }

  async signIn(userSignIn: UserSignInDto): Promise<UserEntity> {
    const user = await this.userRepo
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignIn.email })
      .getOne();

    if (!user) throw new BadRequestException('Invalid Email/Password');

    const checkPassword = compare(userSignIn.password, user.password);

    if (!checkPassword) throw new BadRequestException('Invalid Email/Password');

    delete user.password;

    return user;
  }

  async generateAuthToken(user: UserEntity): Promise<string> {
    return sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME },
    );
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepo.find();
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email: email } });
  }

  async findOne(id: number) {
    console.log('This is the returning id', id);
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }
}
