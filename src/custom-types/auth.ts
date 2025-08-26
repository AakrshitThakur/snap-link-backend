interface SignupUser {
  username: string;
  email: string;
  password: string;
}

type SigninUser = Pick<SignupUser, "email" | "password">;

export type { SignupUser, SigninUser };
