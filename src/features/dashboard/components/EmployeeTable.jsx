import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const EmployeeTable = () => {

    const employees = [
  { name: "Sarah Chen", team: "Engineering", score: 4.8},
  { name: "Marcus Rodriguez", team: "Design", score: 4.6 },
  { name: "Emma Thompson", team: "Marketing", score: 4.2 },
  { name: "Lisa Wang", team: "Sales", score: 4.9},
  { name: "James Wilson", team: "Operations", score: 4.1 },
];
  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Employee Per Department</CardTitle>
            </CardHeader>
            <CardContent className="md:h-[400px] h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={employees}>
                        <CartesianGrid/>
                            <XAxis dataKey="team" tick={{ fontSize: 15, fill: '#1a3a1a' }} angle={-45} textAnchor="end" height={80} className="md:text-sm" />
                            <YAxis domain={[0, 5]} tick={{ fontSize: 15, fill: '#1a3a1a' }} className="md:text-sm" />
                            <Tooltip/>
                            <Bar dataKey="score" fill="#2d5a2d" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  )
}

export default EmployeeTable