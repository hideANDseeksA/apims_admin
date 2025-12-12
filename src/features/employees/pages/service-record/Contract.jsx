import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contract() {

    const mockContracts = [
  {
    id: "1",
    employee_id: "E-001",
    date_from: "2025-01-01",
    date_to: "2025-06-30",
    salary: 25000,
    leave_pay: "With Pay",
    last_increase_date: "2025-03-01",
    date: "2025-01-01",
    cause: "Contract Renewal",
    branch: "Main Office",
    active: true,
    appointment_id: "A-001",
    contracts_id: "C-001"
  },
  {
    id: "2",
    employee_id: "E-001",
    date_from: "2024-06-01",
    date_to: "2024-12-31",
    salary: 24000,
    leave_pay: "With Pay",
    last_increase_date: "2024-06-01",
    date: "2024-06-01",
    cause: "Salary Adjustment",
    branch: "Main Office",
    active: false,
    appointment_id: "A-002",
    contracts_id: "C-002"
  }
];

  return (
    <div className="space-y-4">
      {mockContracts.map((c) => (
        <Card key={c.id} className="rounded-2xl shadow-sm border">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg font-semibold">
              Contract Period: {c.date_from} → {c.date_to}
            </CardTitle>

            <Badge variant={c.active ? "default" : "secondary"}>
              {c.active ? "Active" : "Inactive"}
            </Badge>
          </CardHeader>

          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold">Salary</p>
              <p>₱{c.salary.toLocaleString()}</p>
            </div>

            <div>
              <p className="font-semibold">Leave Pay</p>
              <p>{c.leave_pay}</p>
            </div>

            <div>
              <p className="font-semibold">Last Increase</p>
              <p>{c.last_increase_date}</p>
            </div>

            <div>
              <p className="font-semibold">Cause</p>
              <p>{c.cause}</p>
            </div>

            <div>
              <p className="font-semibold">Branch</p>
              <p>{c.branch}</p>
            </div>

            <div>
              <p className="font-semibold">Appointment ID</p>
              <p>{c.appointment_id}</p>
            </div>
          </CardContent>

          <div className="px-6 pb-4 flex justify-end">
            <Button variant="outline">View Documents</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
