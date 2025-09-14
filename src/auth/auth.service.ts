/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRES_IN = '15m';
  private readonly REFRESH_TOKEN_EXPIRES_IN = '7d';

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  private signToken(payload: any, secret: string, expiresIn: string) {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        status: true,
      },
    });

    if (!user || !user.password || !user.status) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.signToken(
      payload,
      process.env.JWT_SECRET!,
      this.ACCESS_TOKEN_EXPIRES_IN,
    );

    const refreshToken = this.signToken(
      payload,
      process.env.JWT_REFRESH_SECRET!,
      this.REFRESH_TOKEN_EXPIRES_IN,
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('User already registered with this email');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        first_name: dto.first_name,
        last_name: dto.last_name,
        status: dto.status ?? true,
      },
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    const accessToken = this.signToken(
      payload,
      process.env.JWT_SECRET!,
      this.ACCESS_TOKEN_EXPIRES_IN,
    );

    const refreshToken = this.signToken(
      payload,
      process.env.JWT_REFRESH_SECRET!,
      this.REFRESH_TOKEN_EXPIRES_IN,
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await this.prisma.user.update({
      where: { id: newUser.id },
      data: { refreshTokenHash },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.signToken(
        newPayload,
        process.env.JWT_SECRET!,
        this.ACCESS_TOKEN_EXPIRES_IN,
      );

      const newRefreshToken = this.signToken(
        newPayload,
        process.env.JWT_REFRESH_SECRET!,
        this.REFRESH_TOKEN_EXPIRES_IN,
      );

      const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: newRefreshTokenHash },
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async revokeRefreshTokens(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: { increment: 1 },
        refreshTokenHash: null,
      },
    });
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        first_name: true,
        last_name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
