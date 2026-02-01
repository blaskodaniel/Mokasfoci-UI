"use client";

import Card from "@ui/dashboard/card/card";
import Chart from "@ui/dashboard/chart/chart";
import { Container, Section } from "@ui/dashboard/dashboard.style";
import LatestTable from "@ui/dashboard/latestTable";
import { format } from "date-fns";
import { useGetDasboardStats } from "hooks/useDashboard";
import { Tag } from "lucide-react";
import { useEffect, useMemo } from "react";
import { formatNumber } from "util/commons";

const DashboardPage = () => {
  const { data, isLoading, refetch } = useGetDasboardStats();
  const stats = useMemo(() => data?.data, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  if (!stats) {
    return <div>Valami hiba történt</div>;
  }

  return (
    <Container>
      <Section gap="20px">
        <Card
          title="Játékosok száma"
          value={stats?.totalPlayers.toString()}
          description="regisztrált játékosok száma"
        />
        <Card title="Error logok" value={stats?.errorLogsCount.toString()} description="" />
        <Card title="Aktív fogadások" value={stats?.activeCoupons.toString()} description="játékban lévő fogadások" />
        <Card
          title="Össz felhasználható"
          value={formatNumber(stats?.totalSystemBalance, false)}
          description="összess felhasználható pont"
        />
        <Card title="Össz profit" value={formatNumber(stats?.totalSystemProfit)} description="összess profit pont" />
      </Section>
      <Section>
        <LatestTable
          title="Legutóbbi 24h tranzakciói"
          columns={[
            { header: "Név", render: (row) => row.userid.username },
            {
              header: "Mérkőzés",
              render: (row) => (row.matchid ? `${row.matchid?.teamA?.name} - ${row.matchid?.teamB?.name}` : "-"),
            },
            { header: "Típus", render: (row) => row.type },
            { header: "Összeg", render: (row) => formatNumber(row.amount) },
            { header: "Dátum", render: (row) => format(new Date(row.date), "eee HH:mm") },
          ]}
          data={stats.recentTransactions}
        />
        {/* <Chart /> */}
      </Section>
      <Section>{/* <Chart /> */}</Section>
    </Container>
  );
};

export default DashboardPage;
