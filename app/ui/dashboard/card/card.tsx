import { MdSupervisedUserCircle } from "react-icons/md";
import { Container, DataInfo, DataPart, DataTitle, DataValue } from "./card.style";
import { FC } from "react";
import { CardProps } from "./type";

const Card: FC<CardProps> = ({ title, value, icon, description }) => {
  return (
    <Container>
      {icon && icon}
      <DataPart>
        <DataTitle>{title || ""}</DataTitle>
        <DataValue>{value || "-"}</DataValue>
        <DataInfo className="text-sm font-thin text-gray-300">{description || ""}</DataInfo>
      </DataPart>
    </Container>
  );
};

export default Card;
