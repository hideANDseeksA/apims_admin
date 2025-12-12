import React, { useState, useEffect } from "react";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@mantine/core";
import axios from "axios";

const EditContract = ({
  open,
  onOpenChange,
  contract,
  positions,
  workstations,
  fetchContracts,
  API_URL,
}) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    position_id: "",
    workstation: "",
    status: "",
    salary: "",
    start_date: "",
    end_date: "",
    id: null,
    file_path: "",
    file: null,
  });
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedWorkstation, setSelectedWorkstation] = useState("");

  useEffect(() => {
    if (contract) {
      setFormData({
        employee_id: contract.employer_id || "",
        employee_name: `${contract.f_name} ${contract.m_name || ""} ${contract.l_name}`.trim(),
        position_id: contract.position || "",
        workstation: contract.workstation || "",
        status: contract.status || "",
        salary: contract.salary || "",
        start_date: contract.start_date || "",
        end_date: contract.end_date || "",
        id: contract.employee_id || "",
        file_path: contract.file_path || "",
        file: null,
      });
      setSelectedPosition(contract.position_id || "");
      setSelectedWorkstation(contract.workstation_id || "");
    }
  }, [contract]);

  const handleEditContract = async () => {
    try {
      const fd = new FormData();
      fd.append("contract_id", contract.id);
      fd.append("employee_id", formData.id);
      fd.append("position_id", formData.position_id);
      fd.append("workstation", formData.workstation);
      fd.append("status", formData.status);
      fd.append("salary", formData.salary);
      fd.append("start_date", formData.start_date);
      fd.append("end_date", formData.end_date);
      fd.append("file_path", formData.file_path);
      if (formData.file) {
        fd.append("file", formData.file);
      }
      await axios.put(`${API_URL}/contracts/${contract.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onOpenChange(false);
      fetchContracts();
    } catch (err) {
      console.log("Error editing contract:", err);
    }
  };

  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Contract</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label>Employee ID</Label>
          <Input className="border rounded p-2 w-full" value={formData.employee_id} disabled />
        </div>
        <div>
          <Label>Employee Name</Label>
          <Input className="border rounded p-2 w-full bg-gray-100" value={formData.employee_name} disabled />
        </div>
        <div>
          <Label>Position</Label>
          <SearchableDropdown
            items={positions}
            value={formData.position_id}
            onChange={(value) => {
              setSelectedPosition(value);
              setFormData((prev) => ({ ...prev, position_id: value }));
            }}
          />
        </div>
        <div>
          <Label>Workstation</Label>
          <SearchableDropdown
            items={workstations}
            value={formData.workstation}
            onChange={(value) => {
              setSelectedWorkstation(value);
              setFormData((contract) => ({ ...contract, workstation: value }));
            }}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Input
            className="border rounded p-2 w-full"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </div>
        <div>
          <Label>Salary</Label>
          <Input
            className="border rounded p-2 w-full"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />
        </div>
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            className="border rounded p-2 w-full"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            className="border rounded p-2 w-full"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
        <div>
          <Label>File Upload</Label>
          <Input
            type="file"
            className="w-full"
            onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleEditContract}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditContract;