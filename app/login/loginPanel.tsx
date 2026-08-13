"use client";

import { LoginForm, LoginInput, LoginTitle, LoginError, LoginLabel } from "@ui/login/login.style";
import { loginAction } from "./actions";
import { useFormState } from "react-dom";
import SubmitButton from "./submitBtn";

const LoginPanel = () => {
  const [state, action, pending] = useFormState(loginAction, undefined);
  return (
    <form className={LoginForm} action={action}>
      <h1 className={LoginTitle}>Login</h1>
      <label className={LoginLabel}>Username</label>
      <input className={LoginInput} name="username" type="text" placeholder="Username" autoComplete="off" />
      {(state?.errors as { username: string[] })?.username && (
        <p className={LoginError}>{(state?.errors as { username: string[] }).username}</p>
      )}
      <label className={LoginLabel}>Password</label>
      <input className={LoginInput} name="password" type="password" placeholder="Password" autoComplete="off" />
      {(state?.errors as { password: string[] })?.password && (
        <p className={LoginError}>{(state?.errors as { password: string[] }).password}</p>
      )}

      <SubmitButton />
      {(state?.errors as { form: string })?.form && (
        <p className={`${LoginError} mt-2.5 text-center`}>{(state?.errors as { form: string }).form}</p>
      )}
      {pending && <p>Loading...</p>}
    </form>
  );
};

export default LoginPanel;
