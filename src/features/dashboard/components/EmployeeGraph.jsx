"use client";

import React, { useEffect, useState } from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
import API from "@/api/axios";


// 💡 Chart config for colors/labels
const chartConfig = {
  appointed: {
    label: "Appointed",
    color: "var(--chart-2)",
  },
  contract: {
    label: "Contract",
    color: "var(--chart-1)",
  },
}



function EmployeeGraph() {
  const [mode, setMode] = useState("yearly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const params =
        mode === "yearly" ? { mode } : { mode, year: selectedYear };

      const res = await API.get(`/analytics/analytics`, { params });

      const apiData = res.data?.data?.data ?? [];

      let transformed = apiData.map((item) => ({
        label: mode === "yearly" ? item.year : item.month_short,
        appointed: item.appointed_count,
        contract: item.contract_count,
      }));

      // 🔄 Reverse alignment for yearly
      if (mode === "yearly") transformed = transformed.reverse();

      setData(transformed);

      // Update year list only once
      if (mode === "yearly") {
        const yearList = apiData.map((y) => y.year);
        setYears(yearList);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [mode, selectedYear]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Service Record Analytics</CardTitle>
          <CardDescription>
            {mode === "yearly"
              ? "Summary of appointed and contract service records per year"
              : `Monthly breakdown for ${selectedYear}`}
          </CardDescription>
        </div>

        {/* MODE SELECTOR */}
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>

        {/* YEAR SELECTOR – only show when monthly */}
        {mode === "monthly" && (
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((yr) => (
                <SelectItem key={yr} value={String(yr)}>
                  {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
       <ChartContainer
  config={chartConfig}
  className="aspect-auto h-[250px] w-full"
>
  <AreaChart data={data}>
    <defs>
      <linearGradient id="fillAppointed" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="5%"
          stopColor="var(--color-appointed)"
          stopOpacity={0.8}
        />
        <stop
          offset="95%"
          stopColor="var(--color-appointed)"
          stopOpacity={0.1}
        />
      </linearGradient>

      <linearGradient id="fillContract" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="5%"
          stopColor="var(--color-contract)"
          stopOpacity={0.8}
        />
        <stop
          offset="95%"
          stopColor="var(--color-contract)"
          stopOpacity={0.1}
        />
      </linearGradient>
    </defs>

    <CartesianGrid vertical={false} />

    <XAxis
      dataKey="label"
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      minTickGap={32}
    />

    <ChartTooltip
      cursor={false}
      content={<ChartTooltipContent indicator="dot" />}

    />

       <Area
      dataKey="contract"
      type="natural"
      fill="url(#fillContract)"
      stroke="var(--color-contract)"
    />

    <Area
      dataKey="appointed"
      type="natural"
      fill="url(#fillAppointed)"
      stroke="var(--color-appointed)"
    />

    <ChartLegend content={<ChartLegendContent />} />
  </AreaChart>
</ChartContainer>

      </CardContent>
    </Card>
  );
}

export default EmployeeGraph;
