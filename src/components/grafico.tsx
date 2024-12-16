import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export interface TemperatureData {
  hour: string;
  temperature: string;
}

export interface GraficoProps {
  chartData: TemperatureData[];
}

export const Grafico = ({ chartData }: GraficoProps) => {
  const [selectedDay, setSelectedDay] = React.useState("all");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.hour);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(today);
    let startDate: Date | null = null;

    if (selectedDay === "twoDays") {
      targetDate.setDate(today.getDate() + 3);
      startDate = new Date(today);
    } else if (selectedDay === "threeDays") {
      targetDate.setDate(today.getDate() + 4);
      startDate = new Date(today);
    } else if (selectedDay === "all") {
      return true; // Show all data
    }

    // If a start date is defined, filter by the range
    if (startDate) {
      return date >= startDate && date < targetDate;
    }

    // Default case: only today
    return date.toDateString() === targetDate.toDateString();
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Temperature</CardTitle>
        </div>
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger
            className="w-[200px] rounded-lg sm:ml-auto"
            aria-label="Select a day"
          >
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              All Data
            </SelectItem>
            <SelectItem value="twoDays" className="rounded-lg">
              Next Two Days
            </SelectItem>
            <SelectItem value="threeDays" className="rounded-lg">
              Next Three Days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-temperature)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-temperature)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleTimeString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="temperature"
              type="natural"
              fill="url(#fillTemperature)"
              stroke="var(--color-temperature)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
