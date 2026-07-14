import { ChartLineDefault } from "@/components/dashboard/line-chart";
import { ChartPiePopularRooms } from "@/components/dashboard/pie-chart";
import { FuncionariosSection } from "@/components/FuncionariosSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);


  const fetchDashboardStats = () => {
    api.get("/dashboard")
      .then((resposta) => {
        setDashboardStats(resposta.data);
        // O log precisa ser com resposta.data, pois o setState é assíncrono!
        console.log("Dados recebidos da API:", resposta.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Painel de Administração</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo de volta, Administrador.</p>
      </header>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardStats ? (
              <ChartLineDefault data={dashboardStats.occupancyRates} />
            ) : (
              <Card className="flex items-center justify-center min-h-[300px]">
                <span className="text-muted-foreground animate-pulse">Carregando gráfico...</span>
              </Card>
            )}

            {dashboardStats ? (
              <ChartPiePopularRooms data={dashboardStats.popularRooms} />
            ) : (
              <Card className="flex items-center justify-center min-h-[300px]">
                <span className="text-muted-foreground animate-pulse">Carregando gráfico...</span>
              </Card>
            )}

            <Card className="flex flex-col justify-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-muted-foreground">Receita do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{dashboardStats ? `R$ ${dashboardStats.dailyRevenue}` : "..."}</p>
              </CardContent>
            </Card>

            {/* <Card className="flex flex-col justify-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-muted-foreground">Quartos Ocupados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">8/20</p>
              </CardContent>
            </Card> */}


          </div>
        </TabsContent>

        <TabsContent value="funcionarios">
          <FuncionariosSection />
        </TabsContent>
      </Tabs>
    </>
  );
}
