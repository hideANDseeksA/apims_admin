import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";

import AddServiceRecords from "./AddServiceRecord";
import EditServiceRecords from "./EditServiceRecord";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";
import API from "@/api/axios";


const EmpServiceRecord = () => {
  const { employee_id } = useParams();
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [selectedServiceRecord, setSelectedServiceRecord] = useState(null);

  // Load service records
  const loadRecords = async () => {
    try {
      const response = await API.get(`/service_records/employee/${employee_id}`);
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("❌ Failed to fetch service records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [employee_id]);

  // Open edit modal with selected record
  const handleEdit = (record) => {
    setSelectedServiceRecord(record);
    setEditOpened(true);
  };

  // Delete record
  const handleDelete = async (service_id) => {
    const confirm = await showConfirm("Are you sure to delete this Service Record?");
    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/service_records/delete/${service_id}`);
      loadRecords();
      await showSuccess("Service Record added successfully.");
    } catch (err) {
      console.error("❌ Failed to delete service record:", err);
    }
  };

  if (loading) return <div className="p-6">Loading service records...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(`/employees/${employee_id}`)}>
          ← Back to Overview
        </Button>
        <Button onClick={() => setAddOpened(true)}>+ Add Service Record</Button>
      </div>

      {/* Service records table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-gray-500">No service records found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date From</TableHead>
                  <TableHead>Date To</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Cause</TableHead>
                  <TableHead>Service Record</TableHead>
                  <TableHead>Workstation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Leave Pay</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r, idx) => (
                  <TableRow key={r.service_id || idx}>
                    <TableCell>{r.date_from || "—"}</TableCell>
                    <TableCell>{r.date_to || "Present"}</TableCell>
                    <TableCell>{r.salary || "—"}</TableCell>
                    <TableCell>{r.branch || "—"}</TableCell>
                    <TableCell>{r.cause || "—"}</TableCell>
                    <TableCell>{r.position_name || "—"}</TableCell>
                    <TableCell>{r.workstation_name || "—"}</TableCell>
                    <TableCell>{r.employment_status || "—"}</TableCell>
                    <TableCell>{r.leave_pay || "—"}</TableCell>
                    <TableCell>{r.position_classification || "—"}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(r)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(r.service_id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Service Record Modal */}
      <Dialog open={addOpened} onOpenChange={setAddOpened}>
        <AddServiceRecords
          open={addOpened}
          employees_id={employee_id}
          onOpenChange={setAddOpened}
          reloadRecords={loadRecords} // so table refreshes after adding
        />
      </Dialog>

      {/* Edit Service Record Modal */}
      <Dialog open={editOpened} onOpenChange={setEditOpened}>
        <EditServiceRecords
          open={editOpened}
          onOpenChange={setEditOpened}
          servicerecord={selectedServiceRecord}
          reloadRecords={loadRecords} // refresh table after editing
        />
      </Dialog>
    </div>
  );
};

export default EmpServiceRecord;
