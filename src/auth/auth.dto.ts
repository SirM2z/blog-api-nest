export interface RegisterDTO {
  username: string;
  password: string;
  roles?: string[];
}

export interface LoginDTO {
  username: string;
  password: string;
}
