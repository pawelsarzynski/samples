import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { Auth } from 'auth/auth.decorator';
import { User } from './../shared/decorators/user.decorator';
import { PhraseUserFilterDto, CreateUserDto } from './dto';
import { UsersService } from './users.service';
import { UsersMapper } from './users.mapper';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly usersMapper: UsersMapper) {}

  @Post()
  create(@Body() user: CreateUserDto) {
    const userDto = this.usersMapper.fromDtoToDomain(user);
    const newUser = this.usersService.create(userDto);

    return  this.usersMapper.fromDtoToDomain(newUser)
  }

  @Auth()
  @Post('/filtered')
  @HttpCode(200)
  findUser(@Body() { phrase }: PhraseUserFilterDto, @User() userId: string) {
    const users = this.usersService.filtered(phrase, userId);
    
    return users.map(u => this.usersMapper.fromDomainToDto(u))
  }
}
