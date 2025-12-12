import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import API from "@/api/axios";

const API_URL = import.meta.env.VITE_API_URL;



const EditAppointmentModal = ({ opened, onClose, appointment, onUpdated }) => {
  const [workstations, setWorkstations] = useState([]);
  const [workstationTypes, setWorkstationTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filteredWorkstations, setFilteredWorkstations] = useState([]);
  const [items, setItems] = useState([]);
const [lastSearchedId, setLastSearchedId] = useState("");
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    item_no: "",
    position: "",
    salary_grade: "",
    status: "",
    nature: "",
    start_date: "",
    end_date: "",
    workstation: "",
    workstation_type: "",
    file: null,
    id: null,
  });

  useEffect(() => {
    if (appointment) {
      const selectedItem = items.find(i => i.value === appointment.item_no);
      const selectedWs = workstations.find(ws => ws.workstation_id === appointment.workstation);

      setFormData({
        appointment_id: appointment.id,
        employee_id: appointment.employer_id || "",
        employee_name: appointment.name || "",
        item_no: appointment.item_no || "",
        position: selectedItem?.position?.position || appointment.position || "",
        salary_grade: selectedItem?.position?.tranche?.salary_grade || appointment.salary_grade || "",
        status: appointment.status || "",
        nature: appointment.nature || "",
        start_date: appointment.start_date || "",
        end_date: appointment.end_date || "",
        workstation: appointment.workstation || "",
        workstation_type: appointment.workstation_type || "",
        school: selectedWs?.beis_school_id || "",
        file: null,
        id: appointment.employee_id || null,
      });
      setSelectedType(appointment.workstation_type || "");
    }
  }, [appointment]);

  // Fetch workstations
  useEffect(() => {
    const fetchWorkstations = async () => {
      try {
        const res = await API.get(`/workstation/all`);
        const data = res.data.data || [];
        setWorkstations(data);

        const types = [...new Set(data.map(ws => ws.workstation_type))];
        setWorkstationTypes(types.map(type => ({ value: type, label: type })));
      } catch (error) {
        console.error("Error fetching workstations:", error);
      }
    };
    fetchWorkstations();
  }, []);

  useEffect(() => {
    fetchItems("all");
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

  const fetchItems = async (mode) => {
    try {
      let endpoint;

      if (mode === "all") {
        endpoint = `${API_URL}/ItemTable/all`;
      } else if (mode === "substitute") {
        endpoint = `${API_URL}/ItemTable/subtitute_items`;
      } else if (mode === "available") {
        endpoint = `${API_URL}/ItemTable/available_items`;
      }

      const { data } = await API.get(endpoint);

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


  // refetch whenever status changes

  const resetForm = () => {
  setFormData({
    employee_id: "",
    employee_name: "",
    item_no: "",
    position: "",
    salary_grade: "",
    status: "",
    nature: "",
    start_date: "",
    end_date: "",
    workstation: "",
    workstation_type: "",
    school: "",
    file: null,
    id: null,
  });
  setSelectedType("");
  setFilteredWorkstations([]);
};

const handleEmployeeIdBlur = async (e) => {
  const employeeId = e.target.value.trim();

  // 🚫 Prevent spam: don't refetch if value hasn't changed
  if (!employeeId || employeeId === lastSearchedId) return;

  setLastSearchedId(employeeId);

  try {
    const res = await API.get(`/employee/names?employer_id=${employeeId}`);

    if (res.data && res.data.length > 0) {
      const eData = res.data[0];
      const fullName = `${eData.f_name} ${eData.m_name || ""} ${eData.l_name}`.trim();

      setFormData(prev => ({
        ...prev,
        employee_name: fullName,
        id: eData.id,
      }));
    } else {
      setFormData(prev => ({ ...prev, employee_name: "Not Found" }));
    }

  } catch (error) {
    console.error("Lookup error:", error);
  }
};


  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("appointment_id", formData.appointment_id);
      fd.append("employee_id", formData.id || formData.employee_id); // UUID
      fd.append("item_no", formData.item_no);
      fd.append("status", formData.status);
      fd.append("nature", formData.nature);
      fd.append("start_date", formData.start_date);
      fd.append("end_date", formData.end_date || "");
      fd.append("workstation", formData.workstation);

      if (formData.file) fd.append("file", formData.file);

      await axios.put(`${API_URL}/appointment/${formData.appointment_id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onClose();
      onUpdated();
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
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
                setFormData({ ...formData, workstation_type: value, workstation: "" });
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
                onValueChange={(value) => {
                  setFormData({ ...formData, status: value, item_no: "" });

                  // 🔥 Fetch items IMMEDIATELY when status changes
                  if (value === "Substitute") {
                    fetchItems("substitute");
                  } else if (value === "Temporary" || value === "Permanent") {
                    fetchItems("available");
                  } else {
                    fetchItems("all");
                  }
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

      <div className="flex justify-end gap-3 mt-4">
  <Button variant="outline" 
    onClick={() => {
      resetForm();
      onClose();
    }}
  >
    Close
  </Button>

  <Button onClick={handleSubmit}>
    Save Changes
  </Button>
</div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentModal;