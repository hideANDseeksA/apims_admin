import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mantine/core";

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import API from "@/api/axios";

const EditServiceRecords = ({
  open,
  onOpenChange,
  servicerecord,
  reloadRecords,
  API_URL,
  employee_id,
}) => {
  const [formData, setFormData] = useState({
    service_record_id: null,
    employee_id: "",
    employee_pk: employee_id,

    position_id: "",
    workstation: "",
    salary: "",
    status: "",
    leave_pay: "",
    cause: "",
    branch: "",
    date_from: "",
    date_to: "",

    appointment_id: null,
    contracts_id: null,
  });

  const [sourceType, setSourceType] = useState("");
  const [sourceRecords, setSourceRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState("");

  /* -------------------- LOAD EXISTING DATA -------------------- */
  useEffect(() => {
    if (!servicerecord || !open) return;

    setFormData({
      service_record_id: servicerecord.service_id,
      employee_id: servicerecord.employer_id,
      employee_pk: servicerecord.employee_id,

      position_id: servicerecord.position_id,
      workstation: servicerecord.workstation_name,
      salary: servicerecord.salary,
      status: servicerecord.employment_status,
      leave_pay: servicerecord.leave_pay,
      cause: servicerecord.cause || "",
      branch: servicerecord.branch || "",
      date_from: servicerecord.date_from,
      date_to: servicerecord.date_to || null,

      appointment_id: servicerecord.appointment_id || null,
      contracts_id: servicerecord.contracts_id || null,
    });

    if (servicerecord.appointment_id) {
      setSourceType("Appointment");
      setSelectedRecordId(servicerecord.appointment_id);
    }

    if (servicerecord.contracts_id) {
      setSourceType("Contract");
      setSelectedRecordId(servicerecord.contracts_id);
    }
  }, [servicerecord, open]);

 
  useEffect(() => {
    if (!sourceType || !formData.employee_pk) return;

    const fetchSource = async () => {
      try {
        const url =
          sourceType === "Contract"
            ? `/contracts/employee/${formData.employee_pk}`
            : `/appointment/employee/${formData.employee_pk}`;

        const res = await API.get(url);
        setSourceRecords(res.data?.results || []);
      } catch (err) {
        console.error(err);
        setSourceRecords([]);
      }
    };

    fetchSource();
  }, [sourceType, formData.employee_pk]);

  const formattedRecords = sourceRecords.map((r) => ({
    value: r.id,
    label: `${r.position_name || r.item_no || "Unknown"} — ${r.start_date || r.date_from}`,
    raw: r,
  }));

  const handleRecordSelect = (id) => {
    const r = sourceRecords.find((x) => x.id === id);
    if (!r) return;

    setSelectedRecordId(id);
    setFormData((prev) => ({
      ...prev,
      position_id: r.position || r.position_id || "",
      workstation: r.workstation || "",
      salary: r.salary || r.step1,
      status: r.status || "",
      date_from: r.start_date || r.date_from || "",
      date_to: r.end_date || r.date_to || null,
      appointment_id: sourceType === "Appointment" ? r.id : null,
      contracts_id: sourceType === "Contract" ? r.id : null,
    }));
  };

  /* -------------------- UPDATE -------------------- */
  const handleUpdate = async () => {
     onOpenChange(false);
    const confirm = await showConfirm("Are you sure to updated this Service Record?");
    if (!confirm.isConfirmed) return;

    try {
      await API.put(
        `/service_records/update/${formData.service_record_id}`,
        {
          employee_id: formData.employee_pk,
          salary: formData.salary,
          active: true,
          date: null,
          last_increase_date: null,

          date_from: formData.date_from,
          date_to: formData.date_to,
          branch: formData.branch,
          leave_pay: formData.leave_pay,
          cause: formData.cause,
          appointment_id: formData.appointment_id,
          contracts_id: formData.contracts_id,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      await showSuccess("Service Record updated successfully.");
 
      reloadRecords?.();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  
  /* -------------------- UI -------------------- */
  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Service Record</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label>Source Type</Label>
          <Select value={sourceType} onValueChange={setSourceType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Source Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Appointment">Appointment</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sourceType && (
          <div>
            <Label>{sourceType} Records</Label>
            <SearchableDropdown
              items={formattedRecords}
              value={selectedRecordId}
              onChange={handleRecordSelect}
            />
          </div>
        )}

        <div>
          <Label>Status</Label>
          <Input label="Status" value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
        </div>

        <div>
          <Label>Salary</Label>
          <Input label="Salary" value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
        </div>


        <div>
          <Label>Start Date</Label>
          <Input type="date"  value={formData.date_from}
            onChange={(e) => setFormData({ ...formData, date_from: e.target.value })} />
        </div>

        <div>
          <Label>End Date</Label>


          <Input type="date"  value={formData.date_to}
            onChange={(e) => setFormData({ ...formData, date_to: e.target.value })} />
        </div>

        <div>
          <Label>Branch</Label>

          <Input label="Branch" value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
        </div>
        <div>
          <Label>Leave</Label>
          <Select value={formData.leave_pay} onValueChange={(val) => setFormData({ ...formData, leave_pay: val })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Leave w/pay">Leave w/pay</SelectItem>
              <SelectItem value="Leave w/o pay">Leave w/o pay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Cause</Label>
          <Input label="Cause" value={formData.cause}
            onChange={(e) => setFormData({ ...formData, cause: e.target.value })} />
        </div>

      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditServiceRecords;
