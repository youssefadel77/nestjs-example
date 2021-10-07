import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from './user.model';
import { ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<User> {
    return this.userService.findOne(params.id);
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() user: User): Promise<User> {
    return this.userService.update(params.id, user);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.userService.remove(params.id);
  }
}
