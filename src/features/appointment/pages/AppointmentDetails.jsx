import { useEffect, useState } from "react";
import axios from "axios";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AppointmentDetails() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with your actual employee ID
  const employeeId = "0245ec8c-c5c6-4dac-9bbd-0d1ff511cbfe";
 const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/appointment/${employeeId}/appointments`
        );

        // API returns:
        // { count: X, data: [...] }
        setAppointments(res.data.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="space-y-4 bg-[#F7F9F7]">
      <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">
          Position Management
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Manage and Review Appointments
        </p>
      </div>

      <div className="p-6">
        <div className="rounded-lg border">

          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Nature</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Item No</TableHead>
                  <TableHead>Workstation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {appointments.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.start_date}</TableCell>
                    <TableCell>{row.nature}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.status}</Badge>
                    </TableCell>
                    <TableCell>{row.item_no}</TableCell>
                    <TableCell>{row.workstation}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
        </div>
      </div>
    </div>
  );
}
