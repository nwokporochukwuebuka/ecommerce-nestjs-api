import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utitlity/decorators/current-user.decorator';
import { AuthentcationGuard } from 'src/utitlity/guards/authentication.guards';
import { Roles } from 'src/utitlity/common/user-roles.enum';
import { AuthorizeGuard } from 'src/utitlity/guards/authorization.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() body: UserSignUpDto): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signUp(body) };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() userSignInDto: UserSignInDto): Promise<{
    user: UserEntity;
    accessToken: string;
  }> {
    const user = await this.usersService.signIn(userSignInDto);
    const accessToken = await this.usersService.generateAuthToken(user);
    return { user, accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthentcationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('all')
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthentcationGuard)
  @Get('me')
  async getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
