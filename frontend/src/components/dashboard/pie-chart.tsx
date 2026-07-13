"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A simple pie chart"

interface PopularRoom {
  roomTypeName: string;
  reservationCount: number;
}

interface PieChartProps {
  data: PopularRoom[];
}

// Cores baseadas no CSS Variables do tema
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ChartPiePopularRooms({ data }: PieChartProps) {
  // Configuração dinâmica para as legendas
  const dynamicConfig = data?.reduce((acc, curr, index) => {
    acc[curr.roomTypeName] = {
      label: curr.roomTypeName,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as ChartConfig) || {};

  // Adicionando a cor correta a cada fatia
  const chartData = data?.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  })) || [];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Quartos Populares</CardTitle>
        <CardDescription>Baseado no total de reservas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicConfig}
          className="mx-auto aspect-square min-h-[200px] max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="reservationCount" nameKey="roomTypeName" strokeWidth={5} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-4">
        <div className="leading-none text-muted-foreground text-center">
          Distribuição de escolha dos hóspedes
        </div>
      </CardFooter>
    </Card>
  )
}
