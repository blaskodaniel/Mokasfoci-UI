import { Container } from "@ui/global.style";
import { Avatart, Table } from "./transactions.style";
import { TransactionType } from "enums/transactions";
import Tag from "@ui/global/Tag";
import { Title } from "@ui/global/CommonStyles";

const LatestTable = () => {
  return (
    <Container>
      <Title>Latest transactions</Title>
      <Table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Action</td>
            <td>Amount</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="name">
                <Avatart src="/avatar.png" alt="" width={40} height={40} />
                John Doe
              </div>
            </td>
            <td>
              <Tag type={TransactionType.create}>Bet</Tag>
            </td>
            <td>123.12</td>
            <td>2024-03-12 22:30</td>
          </tr>
          <tr>
            <td>
              <div className="name">
                <Avatart src="/avatar.png" alt="" width={40} height={40} />
                Jóska Pista
              </div>
            </td>
            <td>
              <Tag type={TransactionType.create}>Bet</Tag>
            </td>
            <td>123.12</td>
            <td>2024-03-12 22:30</td>
          </tr>
          <tr>
            <td>
              <div className="name">
                <Avatart src="/avatar.png" alt="" width={40} height={40} />
                AI
              </div>
            </td>
            <td>
              <Tag type={TransactionType.modify}>Change bet</Tag>
            </td>
            <td>200</td>
            <td>2024-03-12 22:30</td>
          </tr>
          <tr>
            <td>
              <div className="name">
                <Avatart src="/avatar.png" alt="" width={40} height={40} />
                Test Anuka
              </div>
            </td>
            <td>
              <Tag type={TransactionType.remove}>Remove bet</Tag>
            </td>
            <td>1200</td>
            <td>2024-05-08 12:30</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default LatestTable;
