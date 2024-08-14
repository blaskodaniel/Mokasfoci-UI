"use server";

import { AxiosError } from "axios";
import { LoginFormSchema } from "lib/definitions";
import { redirect } from "next/navigation";
import { authService } from "services/auth-service";
import { setUserTokenToCookie } from "util/commons";

export async function loginAction(state: unknown, formData: FormData) {
  const validationResult = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return { errors: validationResult.error.flatten().fieldErrors };
  }

  const { username, password } = validationResult.data;

  try {
    const response = await authService.login(
      username as string,
      password as string
    );

    setUserTokenToCookie(response?.data?.token);
  } catch (error: unknown) {
    const errorMsg =
      ((error as AxiosError)?.response?.data as { message: string })?.message ||
      "Login error";
    return { errors: { form: errorMsg } };
  }

  redirect("/dashboard");
}
