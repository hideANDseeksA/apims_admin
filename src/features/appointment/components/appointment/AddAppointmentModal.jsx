import { useEffect, useState } from "react";
import axios from "axios";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL;

const AddAppointmentModal = ({ opened, onClose, onAdded }) => {
  const [workstations, setWorkstations] = useState([]);
  const [workstationTypes, setWorkstationTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filteredWorkstations, setFilteredWorkstations] = useState([]);
  const [items, setItems] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    item_no: "",
    status: "",
    nature: "",
    start_date: "",
    end_date: "",
    workstation: "",
    file: null,
    id: null,
  });

  // Fetch workstations
  useEffect(() => {
    const fetchWorkstations = async () => {
      try {
        const res = await axios.get(`${API_URL}/workstation/all`);
        const data = res.data.data || [];
        setWorkstations(data);

        const types = [...new Set(data.map(ws => ws.workstation_type))];
        setWorkstationTypes(types.map(type => ({
          value: type,
          label: type
        })));
      } catch (error) {
        console.error("Error fetching workstations:", error);
      }
    };
    fetchWorkstations();
  }, []);

  // Filter workstations by type
  useEffect(() => {
    if (selectedType) {
      const filtered = workstations
        .filter(ws => ws.workstation_type === selectedType)
        .map(ws => ({
          value: ws.workstation_id,
          label: ws.workstation_name,
          school: ws.beis_school_id,
          ...ws,
        }));
      setFilteredWorkstations(filtered);
    } else {
      setFilteredWorkstations([]);
    }
  }, [selectedType, workstations]);

  const selectedWs = workstations.find(
    (ws) => ws.workstation_id === formData.workstation_id
  );
  const workstationType = selectedWs?.workstation_type || "";

// Fetch items depending on selected status
useEffect(() => {
  if (!formData.status) return;

  const fetchItems = async () => {
    try {
      const endpoint =
        formData.status === "Substitute"
          ? `${API_URL}/ItemTable/subtitute_items`
          : `${API_URL}/ItemTable/available_items`;

      const { data } = await axios.get(endpoint);

      const formatted = data.map(item => ({
        value: item.id,
        label: item.item_id,
        position: item.position,
        salary_grade: item.salary_grade,
      }));

      setItems(formatted);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  fetchItems();
}, [formData.status]); // refetch whenever status changes


  const handleEmployeeIdBlur = async () => {
    if (!formData.employee_id) return;

    try {
      const res = await axios.get(`${API_URL}/employee/names?employer_id=${formData.employee_id}`);
      if (res.data && res.data.length > 0) {
        const e = res.data[0];
        const fullName = `${e.f_name} ${e.m_name || ""} ${e.l_name}`.trim();
        formData.id = e.id;
        setFormData(prev => ({ ...prev, employee_name: fullName }));
      } else {
        setFormData(prev => ({ ...prev, employee_name: "Not Found" }));
      }
    } catch (error) {
      console.error("Name lookup error:", error);
      setFormData(prev => ({ ...prev, employee_name: "Error" }));
    }
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("employee_id", formData.id); // UUID
      fd.append("item_no", formData.item_no);         // UUID
      fd.append("status", formData.status);
      fd.append("nature", formData.nature);
      fd.append("start_date", formData.start_date);
      fd.append("end_date", formData.end_date || ""); // allow null/empty
      fd.append("workstation", formData.workstation); // UUID
      fd.append("file", formData.file);               // binary

      await axios.post(`${API_URL}/appointment/upload_and_create`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({
        employee_id: "",
        item_no: "",
        status: "",
        nature: "",
        start_date: "",
        end_date: "",
        workstation: "",
        file: null,
      });

      onClose();
      onAdded();
    } catch (err) {
      console.error("Error adding appointment:", err);
    }
  };

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Appointment</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* Employee ID */}
          <div>
            <Label>Employee ID</Label>
            <Input
              value={formData.employee_id}
              onChange={e => setFormData({ ...formData, employee_id: e.target.value })}
              onBlur={handleEmployeeIdBlur}
            />
          </div>

          <div>
            <Label>Employee Name</Label>
            <Input value={formData.employee_name} readOnly />
          </div>

          {/* Workstation Type */}
          <div>
            <Label>Workstation Type</Label>
            <Select
              value={selectedType}
              onValueChange={value => {
                setSelectedType(value);
                setFormData({ ...formData, workstation_type: value, workstation_id: "" });
              }}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Select workstation type" />
              </SelectTrigger>
              <SelectContent>
                {workstationTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workstation Name */}
          <SearchableDropdown
            items={filteredWorkstations}
            value={formData.workstation}
            onChange={value => setFormData({ ...formData, workstation: value, school: filteredWorkstations.find(ws => ws.value === value)?.school || "" })}
            placeholder="Select workstation"
          />

          {selectedType === "school" && (
            <>
              <Label>School ID</Label>
              <Input value={formData.school || ""} readOnly />
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <Label>Status</Label>
             <Select
                value={formData.status}
                onValueChange={value => {
                  setFormData({ ...formData, status: value, item_no: "" });
                }}
              >

                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                  <SelectItem value="Substitute">Substitute</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nature */}
            <div>
              <Label>Nature</Label>
              <Select
                value={formData.nature}
                onValueChange={value => setFormData({ ...formData, nature: value })}
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select nature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reclassification">Reclassification</SelectItem>
                  <SelectItem value="Original">Original</SelectItem>
                  <SelectItem value="Promotion">Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Item No */}
          <div>
            <Label>Item No.</Label>
            <Select
              value={formData.item_no}
              onValueChange={value => {
                const selectedItem = items.find(item => item.value === value);
                setFormData({
                  ...formData,
                  item_no: value,
                  position: selectedItem?.position?.position || "",
                  salary_grade: selectedItem?.position?.tranche?.salary_grade || "",
                });
              }}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Select Item No." />
              </SelectTrigger>
              <SelectContent>
                {items.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Position & Salary Grade */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Position" value={formData.position} readOnly />
            <Input label="Salary Grade" value={formData.salary_grade ? "SG " + formData.salary_grade : ""} readOnly />

          </div>
          {/* gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
uvicorn main:app --host 0.0.0.0 --port $PORT */}
          {/* Dates */}
          <Input
            type="date"
            label="Start Date"
            value={formData.start_date}
            onChange={e => setFormData({ ...formData, start_date: e.target.value })}
          />
          <Input
            type="date"
            label="End Date"
            value={formData.end_date}
            onChange={e => setFormData({ ...formData, end_date: e.target.value })}
          />

          {/* File Upload */}
          <input
            type="file"
            onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
          />

          <Button onClick={handleSubmit} className="mt-4">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentModal;
