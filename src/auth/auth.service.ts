import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { RefreshToken } from './refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto, TokenResponseDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user && (await user.comparePassword(password))) {
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 기존 Refresh Token들을 무효화
    await this.refreshTokenRepository.update(
      { userId: user.id, isRevoked: false },
      { isRevoked: true }
    );

    // 새로운 토큰들 생성
    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto> {
    const { refreshToken: token } = refreshTokenDto;

    // Refresh Token 검증
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token, isRevoked: false },
      relations: ['user'],
    });

    if (!storedToken || storedToken.isExpired()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Refresh Token 무효화 (한 번 사용된 토큰은 재사용 불가)
    storedToken.isRevoked = true;
    await this.refreshTokenRepository.save(storedToken);

    // 새로운 토큰들 생성
    const tokens = await this.generateTokens(storedToken.user);

    return tokens;
  }

  private async generateTokens(user: User): Promise<TokenResponseDto> {
    const payload = { email: user.email, sub: user.id };

    // Access Token 생성 (짧은 만료시간)
    const access_token = this.jwtService.sign(payload as any, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    } as any);

    // Refresh Token 생성 (긴 만료시간)
    const refresh_token = this.jwtService.sign(
      { sub: user.id, type: 'refresh' } as any,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as any
    );

    // Refresh Token DB 저장
    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refresh_token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async logout(userId: number): Promise<void> {
    // 사용자의 모든 Refresh Token 무효화
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  async revokeToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token },
      { isRevoked: true }
    );
  }
}
