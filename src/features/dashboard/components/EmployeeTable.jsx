"use client"

import React, { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    ResponsiveContainer,
} from "recharts"

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
} from "@/components/ui/chart"

import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@/components/ui/table"

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"

import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import API from "@/api/axios"


/* =======================
   CHART CONFIG
======================= */
const chartConfig = {
    count: {
        label: "Employees",
        color: "var(--chart-1)",
    },
};

export default function EmployeeTable() {
    /* =======================
       STATE
    ======================= */
    const [mode, setMode] = useState("school") // school | office
    const [rawData, setRawData] = useState([])
    const [chartData, setChartData] = useState([])

    const [groups, setGroups] = useState([]) // districts or sections
    const [selectedGroup, setSelectedGroup] = useState("")

    /* =======================
       LABELS (STRICT)
    ======================= */
    const isSchool = mode === "school"
    const groupLabel = isSchool ? "District" : "Section"
    const groupLabelPlural = isSchool ? "Districts" : "Sections"

    /* =======================
       LOAD DATA
    ======================= */
    useEffect(() => {
        async function load() {
            try {
                const res = await API.get(`/analytics/workstation?p_mode=${mode}`
                )

                const data = res.data?.data?.data || []
                setRawData(data)

                // Extract unique districts/sections
                const unique = [...new Set(data.map(d => d.district_name))]
                setGroups(unique)

                // Reset filter on mode change
                setSelectedGroup("")
            } catch (err) {
                console.error(err)
            }
        }

        load()
    }, [mode])

    /* =======================
       FILTER DATA
    ======================= */
    useEffect(() => {
        const filtered =
            selectedGroup === ""
                ? rawData
                : rawData.filter(
                    item => item.district_name === selectedGroup
                )

        setChartData(
            filtered.map(item => ({
                // if no group selected, show district/section; otherwise show workstation
                xLabel: selectedGroup === "" ? item.district_name : item.workstation_name,
                count: item.employee_count,
            }))
        )
    }, [rawData, selectedGroup])


    /* =======================
       RENDER
    ======================= */
    return (
        <Card className="p-4">
            {/* HEADER */}
            {/* HEADER */}
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Employee Analytics</CardTitle>
                    <CardDescription>
                        View employee counts per {mode} by{" "}
                        {groupLabel.toLowerCase()}
                    </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* MODE SELECT */}
                    <Select value={mode} onValueChange={setMode}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="school">School</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* GROUP FILTER */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="border rounded-md px-4 py-2 w-full sm:w-[200px] text-left">
                                {selectedGroup === ""
                                    ? `All ${groupLabelPlural}`
                                    : selectedGroup}
                            </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[260px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder={`Search ${groupLabel.toLowerCase()}...`}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        No matching {groupLabel.toLowerCase()}.
                                    </CommandEmpty>

                                    <CommandGroup>
                                        <CommandItem
                                            onSelect={() => setSelectedGroup("")}
                                        >
                                            All {groupLabelPlural}
                                        </CommandItem>

                                        {groups.map((g, i) => (
                                            <CommandItem
                                                key={i}
                                                value={g}
                                                onSelect={() => setSelectedGroup(g)}
                                            >
                                                {g}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </CardHeader>

            {/* CHART */}
            <CardContent className="pb-6 overflow-hidden relative">
                <div className="w-full h-[390px] flex justify-center items-center">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="xLabel"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar
                                    dataKey="count"
                                    fill={chartConfig.count.color}
                                    radius={8}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>



            {/* FOOTER */}
            <CardFooter className="flex-col items-start gap-2 text-sm ">
                <div className="flex gap-2 font-medium">
                    Employee distribution{" "}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground">
                    Based on active service records
                </div>
            </CardFooter>

            {/* TABLE */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Data Table</CardTitle>
                    <CardDescription>Summary</CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Workstation</TableHead>
                                <TableHead>Employee Count</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {chartData.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row.xLabel}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Card>
    )
}

