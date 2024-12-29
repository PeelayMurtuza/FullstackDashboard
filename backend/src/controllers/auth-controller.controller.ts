import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, get, requestBody, HttpErrors, param} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {BcryptService} from '../services/bcrypt.service';
import {TokenService, TokenPayload} from '../services/token.service';

export class UserController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @service(TokenService) private tokenService: TokenService,
    @service(BcryptService) private bcryptService: BcryptService,
  ) {}

  @post('/signup')
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
              role: {type: 'string', enum: ['user', 'admin'], default: 'user'},
            },
          },
        },
      },
    })
    userData: {email: string; password: string; role?: string},
  ) {
    const existingUser = await this.userRepository.findOne({
      where: {email: userData.email},
    });

    if (existingUser) {
      throw new HttpErrors.BadRequest('Email already registered.');
    }

    // Hash the password
    const hashedPassword = await this.bcryptService.hashPassword(userData.password);

    const savedUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return {message: 'User signed up successfully', user: savedUser};
  }

  @post('/signin')
  async signin(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    credentials: {email: string; password: string},
  ) {
    const user = await this.userRepository.findOne({
      where: {email: credentials.email},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }

    // Compare passwords
    const isPasswordValid = await this.bcryptService.comparePassword(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }

    // Generate JWT token
    const token = this.tokenService.generateToken({
      id: user.id,
      role: user.role,
      email: user.email, 
      time: new Date().toISOString(),
    });

    return {message: 'SignIn successful', token};
  }

  @get('/users')
  async findUsers(@param.header.string('Authorization') token: string) {
    if (!token) {
      throw new HttpErrors.Unauthorized('Authorization header is missing.');
    }

    let decoded: TokenPayload;
    try {
      decoded = this.tokenService.verifyToken(token);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid or expired token.');
    }

    if (decoded.role !== 'admin') {
      throw new HttpErrors.Forbidden('Access denied. Admin role required.');
    }

    return this.userRepository.find();
  }
}
