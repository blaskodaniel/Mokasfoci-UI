import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin" size={40} />
    </div>
  );
};

export default Loading;
