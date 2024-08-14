import { AxiosError } from "axios";

export default function ErrorHandler(error: unknown) {
  const AxError = error as AxiosError;
  const errorMsg =
    `${AxError.message}, path: ${AxError.request?.path}` ||
    "Error fetching data";
  console.error(errorMsg);
  return errorMsg;
}
