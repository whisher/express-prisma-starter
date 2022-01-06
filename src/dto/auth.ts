export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  expirationEpochSeconds: number;
  token: string;
};

export type SignInRequestDto = {
  email: string;
  password: string;
  passwordConfirm: string;
  acceptPrivacyPolicy: boolean;
};

export type SignInResponseDto = {
  email: string;
};
