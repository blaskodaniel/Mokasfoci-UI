import Card from "@ui/dashboard/card/card";
import Chart from "@ui/dashboard/chart/chart";
import { Container, Section } from "@ui/dashboard/dashboard.style";
import LatestTable from "@ui/dashboard/transactions/page";

const DashboardPage = () => {
  return (
    <Container>
      <Section gap="20px">
        <Card />
        <Card />
        <Card />
      </Section>
      <Section>
        <LatestTable />
        <Chart />
      </Section>
      <Section>
        <Chart />
      </Section>
    </Container>
  );
};

export default DashboardPage;
