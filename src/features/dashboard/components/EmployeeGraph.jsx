import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'

import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from "recharts";

const EmployeeGraph = () => {
    const [selectedYear, setSelectedYear] = useState('2023');

    const employeeCountData = selectedYear === "2024"
    ? [
        { month: "Jan", employees: 45 },
        { month: "Feb", employees: 50 },
        { month: "Mar", employees: 57 },
        { month: "Apr", employees: 61 },
        { month: "May", employees: 68 },
        { month: "Jun", employees: 74 },
        { month: "Jul", employees: 80 },
        { month: "Aug", employees: 83 },
        { month: "Sep", employees: 87 },
        { month: "Oct", employees: 91 },
        { month: "Nov", employees: 94 },
        { month: "Dec", employees: 98 },
      ]
    : [
        { month: "Jan", employees: 35 },
        { month: "Feb", employees: 38 },
        { month: "Mar", employees: 42 },
        { month: "Apr", employees: 46 },
        { month: "May", employees: 50 },
        { month: "Jun", employees: 55 },
        { month: "Jul", employees: 59 },
        { month: "Aug", employees: 62 },
        { month: "Sep", employees: 65 },
        { month: "Oct", employees: 69 },
        { month: "Nov", employees: 71 },
        { month: "Dec", employees: 74 },
      ];

  return (
    <div>
        <Card className="shadow-lg border-0">
            <CardHeader>
                <div className='flex  justify-between'>
                    <CardTitle>Employee Growth</CardTitle>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder = "2023"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Year</SelectLabel>
                                <SelectItem value="2021">2023</SelectItem>
                                <SelectItem value="2022">2024</SelectItem>
                                <SelectItem value="2023">2025</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>
                
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={employeeCountData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8f0e8" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#1a3a1a" }}
              className="md:text-xs"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#1a3a1a" }}
              className="md:text-xs"
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="employees"
              stroke="#2d5a2d"
              strokeWidth={2}
              dot={{ fill: "#2d5a2d", r: 3 }}
              activeDot={{ r: 5 }}
              name="Total Employees"
            />
          </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  )
}

export default EmployeeGraph