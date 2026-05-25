export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  _id?: string;
  full_name: string;
  email: string;
  country_code?: string;
  phone_number?: string;
  profile_picture?: string;
  role?: UserRole;
  is_verified?: boolean;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  password: string;
  profile_picture?: string;
  role: UserRole;
}

export interface UploadProfilePictureResponse {
  success: boolean;
  message: string;
  imageUrl: string;
  data: {
    imageUrl: string;
    publicId: string;
  };
}

export interface RegisterFormValues {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type LoginMethod = 'email' | 'phone';

export interface LoginPayload {
  email?: string;
  phone_number?: string;
  password: string;
}

export interface LoginMutationArg extends LoginPayload {
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: AuthUser;
}

export interface LoginFormValues {
  loginMethod: LoginMethod;
  email: string;
  phone: string;
  password: string;
  rememberMe: boolean;
}
