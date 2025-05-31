import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt'); // bcrypt modülünü mockla
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>; // Mocklanmış modüle erişim

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { // UsersService için mock obje
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { // JwtService için mock obje
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Her testten önce bcrypt mocklarını temizle
    mockedBcrypt.compare.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return the user if validation is successful', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockImplementation((password, hash) => Promise.resolve(true));

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(undefined);

      const result = await service.validateUser('notfound@example.com', 'password');

      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledWith('notfound@example.com');
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null if password does not match', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockImplementation((password, hash) => Promise.resolve(false));

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    });
  });

  describe('login', () => {
    it('should return an access_token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockToken = 'mock-jwt-token';

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await service.login(mockUser as any);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });
  });
});
