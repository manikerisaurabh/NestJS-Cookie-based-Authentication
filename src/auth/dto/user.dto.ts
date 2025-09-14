/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePass123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'ADMIN', enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    example: 'uuid-of-hospital',
    description: 'Hospital ID to assign to user',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  hospitalId: string;

  @ApiProperty({
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status: boolean;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePass123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
