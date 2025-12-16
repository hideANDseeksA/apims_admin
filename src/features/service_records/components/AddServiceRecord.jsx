import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API from "@/api/axios";
import APIV2 from "@/api/axiosv2";
import { showSuccess, showError, showConfirm, showAutoClose } from "@/utils/alerts";
const AddServiceRecords = ({
  open,
  onOpenChange,
  positions,
  workstations,
  fetchContracts,
  API_URL,
}) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    id: null,
    active: true,
    last_increase_date: null,
    position_id: "",
    workstation: "",
    salary: "",
    status: "",
    leave_pay: "",
    cause: "",
    branch: "",
    date_from: "",
    date_to: null,
    date:null,
    appointment_id: null,
    contracts_id: null,
  });

  const [sourceType, setSourceType] = useState(""); // "Appointment" or "Contract"
  const [sourceRecords, setSourceRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState("");

  const findPositionNameById = (positionsList = [], id) => {
    const p = positionsList.find(
      (x) => x.value === id || x.id === id || x.position_id === id
    );
    return p ? p.label || p.position_name || p.name || "" : "";
  };

  const handleEmployeeIdBlur = async () => {
    if (!formData.employee_id) return;
    try {
      const res = await APIV2.get(
        `/employee/names?employer_id=${formData.employee_id}`
      );
      if (res.data?.length > 0) {
        const e = res.data[0];
        const fullName = `${e.f_name} ${e.m_name || ""} ${e.l_name}`.trim();
        setFormData((prev) => ({ ...prev, employee_name: fullName, id: e.id }));
      } else {
        setFormData((prev) => ({ ...prev, employee_name: "Not Found", id: null }));
        setSourceRecords([]);
      }
    } catch (error) {
      console.error(error);
      setFormData((prev) => ({ ...prev, employee_name: "Error", id: null }));
      setSourceRecords([]);
    }
  };
const validateForm = () => {
  const requiredFields = [
    "employee_id",
    "employee_name",
    "status",
    "salary",
    "date_from",
    "branch",
    "leave_pay",
  ];

  for (const field of requiredFields) {
    if (!formData[field]) {
      return false;
    }
  }

  if (!sourceType || !selectedRecordId) return false;

  return true;
};

  const fetchAutoData = async (srcType) => {
    if (!formData.id) return;
    try {
      const url =
        srcType === "Contract"
          ? `/contracts/employee/${formData.id}`
          : `/appointment/employee/${formData.id}`;
      const res = await API.get(url);
      if (res.data?.results?.length > 0) {
        setSourceRecords(res.data.results);
        // auto-fill first record
        applyRecordToForm(res.data.results[0], srcType);
        setSelectedRecordId(res.data.results[0].id);
      } else {
        setSourceRecords([]);
        setSelectedRecordId("");
      }
    } catch (err) {
      console.error(err);
      setSourceRecords([]);
      setSelectedRecordId("");
    }
  };

  const applyRecordToForm = (r, srcType) => {
    if (!r) return;
    setFormData((prev) => ({
      ...prev,
      position_id: r.position || r.item_no || "",
      workstation: r.workstation || "",
      salary: r.salary || r.step1,
      status: r.status || "",
      date_from: r.start_date || r.date_from || "",
      date_to: r.end_date || r.date_to || "",
      appointment_id: srcType === "Appointment" ? r.id : null,
      contracts_id: srcType === "Contract" ? r.id : null,
    }));
  };

  useEffect(() => {
    if (sourceType) fetchAutoData(sourceType);
  }, [sourceType, formData.id]);

  const formattedRecords = sourceRecords.map((r) => {
    const posLabel =
      r.position_name ||
      (r.position && findPositionNameById(positions, r.position)) ||
      r.item_no ||
      "Unknown position";
    const start = r.start_date || r.date_from || "";
    return { value: r.id, label: `${posLabel} — ${start}`, raw: r };
  });

  const handleRecordSelect = (recordId) => {
    const record = sourceRecords.find((r) => r.id === recordId);
    if (record) applyRecordToForm(record, sourceType);
    setSelectedRecordId(recordId);
  };

  const handleAddServiceRecords = async () => {

    
  if (!validateForm()) {
    await showAutoClose("Please fill in all required fields.","warning");
    return;
  }
    onOpenChange(false);
    const confirm = await showConfirm("Are you sure to save this records?");
    if (!confirm.isConfirmed) return;
    try {
      const payload = {
        employee_id: formData.id || formData.employee_id,
        status: formData.status,
        salary: formData.salary,
        date_from: formData.date_from,
        date_to: formData.date_to,
        branch: formData.branch,
        leave_pay: formData.leave_pay,
        cause: formData.cause,
        active: formData.active,
        last_increase_date: formData.last_increase_date,
        date:null,
        appointment_id: formData.appointment_id,
        contracts_id: formData.contracts_id,
      };

      await API.post(`/service_records/add`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // reset
      setFormData({
        employee_id: "",
        employee_name: "",
        id: null,
        active: true,
        last_increase_date: null,
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
      setSourceRecords([]);
      setSelectedRecordId("");
      setSourceType("");
      await showSuccess("Added!");

      fetchContracts && fetchContracts();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Service / Contract</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label>Employee ID</Label>
          <Input
             required
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
            onBlur={handleEmployeeIdBlur}
            placeholder="Type employee ID then click outside"
         

          />
        </div>

        <div>
          <Label>Employee Name</Label>
          <Input value={formData.employee_name} readOnly />
        </div>

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
          <div className="mt-4">
            <Label>{sourceType === "Appointment" ? "Appointment Records" : "Contract Records"}</Label>
            <SearchableDropdown
              items={formattedRecords}
              value={selectedRecordId}
              onChange={handleRecordSelect}
            />
          </div>
        )}

        <div>
          <Label>Status</Label>
          <Input required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value }) } />
        </div>

        <div>
          <Label>Salary</Label>
          <Input value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
        </div>

        <div>
          <Label>Start Date</Label>
          <Input type="date" value={formData.date_from} onChange={(e) => setFormData({ ...formData, date_from: e.target.value })} />
        </div>

        <div>
          <Label>End Date</Label>
          <Input type="date" value={formData.date_to} onChange={(e) => setFormData({ ...formData, date_to: e.target.value })} />
        </div>

        <div>
          <Label>Branch</Label>
          <Input value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
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
          <Input value={formData.cause || ""} onChange={(e) => setFormData({ ...formData, cause: e.target.value })} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={handleAddServiceRecords}>Submit</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddServiceRecords;
