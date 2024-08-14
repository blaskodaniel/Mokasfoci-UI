import { LoginButton } from "@ui/login/login.style";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <LoginButton type="submit" disabled={pending}>
      {pending ? "Loading..." : "Login"}
    </LoginButton>
  );
}

export default SubmitButton;
