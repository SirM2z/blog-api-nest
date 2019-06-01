import { Document } from 'mongoose';

export interface User extends Document {
  username: string;
  readonly password: string;
  roles: string[];
  created: Date;
}
