import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt';

describe('Auth service', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should sign in', async () => {
    const userDB = {
      id: 1,
      hashPass: '',
    };
    const body = {
      email: 'test@test.com',
      password: '123456@Lc',
    };

    jest.spyOn(service, 'comparePassword').mockResolvedValue(true);

    const result = await service.signIn(
      body.email,
      body.password,
      userDB.hashPass,
      userDB.id,
    );
    expect(result.access_token).toBeDefined();
  });
});
