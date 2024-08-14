import { LoginWrapper } from "@ui/login/login.style";
import LoginPanel from "./loginPanel";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME } from "util/config";

const LoginPage = () => {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);

  if (tokenCookie?.value) redirect("/dashboard");

  return (
    <LoginWrapper>
      <LoginPanel />
    </LoginWrapper>
  );
};

export default LoginPage;
