import { Column, Table, Model } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class User extends Model {
  @Column
  @ApiProperty()
  name: string;
  @Column
  @ApiProperty()
  email: string;
  @Column
  @ApiProperty()
  password: string;
}
