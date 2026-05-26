export type UserRole = 'USER' | 'ADMIN' | 'OPERATOR';

export type AuthProvider = 'LOCAL' | 'GOOGLE';

export interface UserPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
}

export interface AuthUser {
  _id?: string;
  full_name: string;
  email: string;
  country_code?: string;
  phone_number?: string;
  profile_picture?: string | null;
  role?: UserRole;
  auth_provider?: AuthProvider;
  is_verified?: boolean;
  is_active?: boolean;
  wallet_balance?: number;
  reward_points?: number;
  last_login_at?: string;
  preferences?: UserPreferences;
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
