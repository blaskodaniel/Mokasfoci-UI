import { FaEye, FaEyeSlash, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineTimer, MdPriceCheck } from "react-icons/md";

const Legend = () => {
  return (
    <div className="flex w-fit border border-gray-500/30 rounded py-1 divide-x divide-gray-500/30 items-center">
      <div className="flex items-center gap-2 px-3">
        <FaRegCheckCircle className="text-green-500" size={13} /> - <span className="text-xs">Vége</span>
      </div>
      <div className="flex items-center gap-2 px-3">
        <FaEye size={13} /> - <span className="text-xs">Publikus</span>
      </div>
      <div className="flex items-center gap-2 px-3">
        <FaEyeSlash size={13} /> - <span className="text-xs">Rejtett</span>
      </div>
      <div className="flex items-center gap-2 px-3">
        <MdOutlineTimer className="text-orange-400" size={13} /> - <span className="text-xs">Időzített</span>
      </div>
      <div className="flex items-center gap-2 px-3">
        <MdPriceCheck className="text-green-500" /> - <span className="text-xs">Kalkulált</span>
      </div>
    </div>
  );
};

export default Legend;
