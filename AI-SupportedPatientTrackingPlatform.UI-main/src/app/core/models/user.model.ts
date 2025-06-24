export enum UserRole {
    Admin = 'Admin',
    Doctor = 'Doctor'
  }
  
  export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    fullName?: string;
    created: Date;
    lastModified?: Date;
  }
  
  export interface CreateUpdateUserDto {
    username: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }