import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  username: String,
  password: {
    type: String,
    select: false,
  },
  roles: {
    type: Array,
    default: [],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function(next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    /* tslint:disable */
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    /* tslint:enable */
  } catch (error) {
    return next(error);
  }
});
