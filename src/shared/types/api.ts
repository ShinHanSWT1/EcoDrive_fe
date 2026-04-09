export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface UserMe {
  id: number;
  email: string | null;
  nickname: string;
  profileImageUrl: string | null;
  role: string;
  isOnboardingCompleted: boolean;
  age: number | null;
}
