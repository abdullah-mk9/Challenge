import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserDto {
  name: string;
  email: string;
  password?: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User Name',
    example: 'Kaf',
    type: String,
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User Email',
    example: 'Kaf@corpo.com',
    type: String,
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User Password',
    example: 'password',
    type: String,
    required: true,
  })
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User Email',
    example: 'Kaf@corpo.com',
    type: String,
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User Password',
    example: 'password',
    type: String,
    required: true,
  })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User Name',
    example: 'Kaf',
    type: String,
    required: false,
  })
  name: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'User Email',
    example: 'Kaf@corpo.com',
    type: String,
    required: false,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User Password',
    example: 'password',
    type: String,
    required: false,
  })
  password: string;
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Event Title',
    example: 'Biban24',
    type: String,
    required: true,
  })
  title: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'Category Name and Type',
    example: { name: 'Tech', type: 'Tech' },
    type: Object,
    required: true,
  })
  category: {
    name: string;
    type?: string;
  };

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Event Description',
    example: 'Global Destination for Opportunities',
    type: String,
    required: true,
  })
  description: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Event Start Date',
    example: '01-01-2025',
    type: String,
    format: 'date-time',
  })
  date: Date;
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Event Title',
    example: 'Biban25',
    type: String,
    required: false,
  })
  title: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'Category Name and Type',
    example: { name: 'Tech', type: 'Tech' },
    type: Object,
    required: true,
  })
  category: {
    name: string;
    type?: string;
  };

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Event Description',
    example: 'Global Destination for Opportunities',
    type: String,
    required: false,
  })
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Event Start Date',
    example: '01-01-2025',
    type: String,
    format: 'date-time',
  })
  date: Date;
}
