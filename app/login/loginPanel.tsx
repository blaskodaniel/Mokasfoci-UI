"use client";

import {
  LoginForm,
  LoginInput,
  LoginTitle,
  LoginError,
  LoginLabel,
} from "@ui/login/login.style";
import { loginAction } from "./actions";
import { useFormState } from "react-dom";
import SubmitButton from "./submitBtn";

const LoginPanel = () => {
  const [state, action, pending] = useFormState(loginAction, undefined);
  return (
    <LoginForm action={action}>
      <LoginTitle>Login</LoginTitle>
      <LoginLabel>Username</LoginLabel>
      <LoginInput
        name="username"
        type="text"
        placeholder="Username"
        autoComplete="off"
      />
      {(state?.errors as { username: string[] })?.username && (
        <LoginError>
          {(state?.errors as { username: string[] }).username}
        </LoginError>
      )}
      <LoginLabel>Password</LoginLabel>
      <LoginInput
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="off"
      />
      {(state?.errors as { password: string[] })?.password && (
        <LoginError>
          {(state?.errors as { password: string[] }).password}
        </LoginError>
      )}

      <SubmitButton />
      {(state?.errors as { form: string })?.form && (
        <LoginError margintop={10} textcenter={true}>
          {(state?.errors as { form: string }).form}
        </LoginError>
      )}
      {pending && <p>Loading...</p>}
    </LoginForm>
  );
};

export default LoginPanel;
