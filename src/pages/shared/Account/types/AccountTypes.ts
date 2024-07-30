export interface EmailFormValues {
    email: string | undefined;
  }
  
  export interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }
  
  export interface UserData {
    id: number;
    email: string;
  }
  
  export interface ChangeEmailData {
    id: number;
    email: string;
  }
  
  export interface ChangePasswordData {
    id: number;
    password: string;
    newPassword: string;
  }