export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }
  
  export interface AuthResponse {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    roles: string[];
    success: boolean;
    errors: string[];
  }
  
  export interface RegisterResponse {
    message: string;
    errors?: string[];
  }