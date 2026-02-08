export class LoginModel {
  email!: string;
  password!: string;
}

export class LoginResponse {
  id?: number;
  email!: string;
  role!: string; 
  name?: string;
  token?: string;
}

export class User {
  id?: number;
  email!: string;
  role!: string;
  name?: string;
}
