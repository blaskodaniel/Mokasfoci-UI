import { MdSupervisedUserCircle } from "react-icons/md";
import { Container, DataInfo, DataPart, DataTitle, DataValue } from "./card.style";
import { FC } from "react";
import { CardProps } from "./type";

const Card: FC<CardProps> = ({ title, value, icon, description }) => {
  return (
    <div className={Container}>
      {icon && icon}
      <div className={DataPart}>
        <div className={DataTitle}>{title || ""}</div>
        <div className={DataValue}>{value || "-"}</div>
        <div className={`${DataInfo} text-sm text-gray-300`}>{description || ""}</div>
      </div>
    </div>
  );
};

export default Card;
