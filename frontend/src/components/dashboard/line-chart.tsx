"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A line chart"

interface LineChartProps {
  data: {
    month: string;
    rate: number;
  }[];
}

const chartConfig = {
  rate: {
    label: "Taxa de Ocupação (%)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartLineDefault({ data }: LineChartProps) {
  // Arredondando as taxas para remover as casas decimais antes de jogar no gráfico
  const formattedData = data?.map(item => ({
    ...item,
    rate: Math.round(item.rate)
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ocupação Mensal</CardTitle>
        <CardDescription>Taxa de ocupação da pousada neste ano</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} >
          <LineChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="rate"
              type="linear"
              stroke="var(--color-rate)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando a taxa de ocupação para os 12 meses do ano
        </div>
      </CardFooter> */}
    </Card>
  )
}
