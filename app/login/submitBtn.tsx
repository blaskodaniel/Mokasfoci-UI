import { LoginButton } from "@ui/login/login.style";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className={LoginButton} type="submit" disabled={pending}>
      {pending ? "Loading..." : "Login"}
    </button>
  );
}

export default SubmitButton;
