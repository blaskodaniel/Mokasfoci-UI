import { MdSupervisedUserCircle } from "react-icons/md";
import {
  Container,
  DataInfo,
  DataPart,
  DataTitle,
  DataValue,
} from "./card.style";

const Card = () => {
  return (
    <Container>
      <MdSupervisedUserCircle size={24} />
      <DataPart>
        <DataTitle>Total users</DataTitle>
        <DataValue>10.125</DataValue>
        <DataInfo>Lorem ipsum dolor, sit</DataInfo>
      </DataPart>
    </Container>
  );
};

export default Card;
