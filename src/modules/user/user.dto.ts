import { IsNotEmpty } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  roles?: string;
}

export class UserRo {
  id: string;
  username: string;
  created: string;
  roles: string;
  token?: string;
}

export class UserPaginateRo {
  data: UserRo[];
  pagination: {
    total: number;
  };
}
