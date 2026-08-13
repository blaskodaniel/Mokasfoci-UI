"use client";

import Card from "@ui/dashboard/card/card";
import { Container, Section } from "@ui/dashboard/dashboard.style";
import LatestTable from "@ui/dashboard/latestTable";
import { formatRelative } from "date-fns";
import { hu } from "date-fns/locale";
import { useGetDasboardStats } from "hooks/useDashboard";
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
    <div className={Container}>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
        <Card
          title="Error logok"
          value={stats?.errorLogsCount.toString()}
          description={`Utolsó: ${stats?.lastErrorLogDate ? formatRelative(new Date(stats.lastErrorLogDate), new Date(), { locale: hu }) : "-"}`}
        />
        <Card title="Aktív fogadások" value={stats?.activeCoupons.toString()} description="játékban lévő fogadások" />
        <Card
          title="Össz felhasználható"
          value={formatNumber(stats?.totalSystemBalance, false)}
          description="összess felhasználható pont"
        />
        <Card title="Össz profit" value={formatNumber(stats?.totalSystemProfit)} description="összess profit pont" />
        <Card
          title="Játékosok száma"
          value={stats?.totalPlayers.toString()}
          description={`Utolsó: ${stats?.lastRegistrationDate ? formatRelative(new Date(stats.lastRegistrationDate), new Date(), { locale: hu }) : "-"}`}
        />
        <Card title="Csapatok száma" value={stats?.teamsCount.toString()} description="csapatok száma" />
        <Card title="Mérkőzések száma" value={stats?.matchesCount.toString()} description="mérkőzések száma" />
      </div>

      <div className={Section}>
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
            { header: "Dátum", render: (row) => formatRelative(new Date(row.date), new Date(), { locale: hu }) },
          ]}
          data={stats.recentTransactions}
        />
        {/* <Chart /> */}
      </div>
      <div className={Section}>{/* <Chart /> */}</div>
    </div>
  );
};

export default DashboardPage;
