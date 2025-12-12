import React, { useState } from "react";
import { Button } from "@mantine/core";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import axios from "axios";

const AddContract = ({
  open,
  onOpenChange,
  positions,
  workstations,
  fetchContracts,
  fetchPositions,
  fetchWorkstations,
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
    file: null,
  });
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedWorkstation, setSelectedWorkstation] = useState("");

  const handleEmployeeIdBlur = async () => {
    if (!formData.employee_id) return;
    try {
      const res = await axios.get(
        `${API_URL}/employee/names?employer_id=${formData.employee_id}`
      );
      if (res.data && res.data.length > 0) {
        const e = res.data[0];
        const fullName = `${e.f_name} ${e.m_name || ""} ${e.l_name}`.trim();
        formData.id = e.id;
        setFormData((prev) => ({ ...prev, employee_name: fullName }));
      } else {
        setFormData((prev) => ({ ...prev, employee_name: "Not Found" }));
      }
    } catch (error) {
      setFormData((prev) => ({ ...prev, employee_name: "Error" }));
    }
  };

  const handleAddContract = async () => {
    try {
      const fd = new FormData();
      fd.append("employee_id", formData.id);
      fd.append("position_id", formData.position_id);
      fd.append("workstation", formData.workstation);
      fd.append("status", formData.status);
      fd.append("salary", formData.salary);
      fd.append("start_date", formData.start_date);
      fd.append("end_date", formData.end_date);
      fd.append("file", formData.file);

      await axios.post(`${API_URL}/contracts/upload_and_create`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onOpenChange(false);
      setFormData({
        employee_id: "",
        employee_name: "",
        position_id: "",
        workstation: "",
        status: "",
        salary: "",
        start_date: "",
        end_date: "",
        file: null,
      });
      setSelectedPosition("");
      setSelectedWorkstation("");
      fetchContracts();
      fetchPositions();
      fetchWorkstations();
    } catch (err) {
      // handle error
    }
  };

  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Contract</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label>Employee ID</Label>
          <Input
            className="border rounded p-2 w-full"
            value={formData.employee_id}
            onChange={(e) =>
              setFormData({ ...formData, employee_id: e.target.value })
            }
            onBlur={handleEmployeeIdBlur}
          />
        </div>
        <div>
          <Label>Employee Name</Label>
          <Input
            className="border rounded p-2 w-full bg-gray-100"
            value={formData.employee_name}
            disabled
          />
        </div>
        <div>
          <Label>Position</Label>
          <SearchableDropdown
            items={positions}
            value={selectedPosition}
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
            value={selectedWorkstation}
            onChange={(value) => {
              setSelectedWorkstation(value);
              setFormData((prev) => ({ ...prev, workstation: value }));
            }}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Input
            className="border rounded p-2 w-full"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Salary</Label>
          <Input
            className="border rounded p-2 w-full"
            value={formData.salary}
            onChange={(e) =>
              setFormData({ ...formData, salary: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            className="border rounded p-2 w-full"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            className="border rounded p-2 w-full"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
          />
        </div>
        <div>
          <Label>File Upload</Label>
          <Input
            type="file"
            className="w-full"
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files[0] })
            }
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleAddContract}>Submit</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddContract;