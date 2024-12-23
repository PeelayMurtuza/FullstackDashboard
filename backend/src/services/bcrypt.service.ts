import {injectable, BindingScope} from '@loopback/core';
import * as bcrypt from 'bcrypt';

@injectable({scope: BindingScope.TRANSIENT})
export class BcryptService {
  private saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

