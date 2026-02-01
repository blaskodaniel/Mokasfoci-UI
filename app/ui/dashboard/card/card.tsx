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
        <DataInfo>{description || ""}</DataInfo>
      </DataPart>
    </Container>
  );
};

export default Card;
