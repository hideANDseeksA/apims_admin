import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";

const HR_ROLES = ["super_admin", "admin", "user", "hr"]; // Enum values

const EditWorkstationModal = ({ opened, onClose, user, onUpdated }) => {
  const [workstations, setWorkstations] = useState([]);
  const [workstationTypes, setWorkstationTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  const [filteredWorkstations, setFilteredWorkstations] = useState([]);

  const [formData, setFormData] = useState({
    workstation_hold: null,
    hr_role: "user",
    school: "",
  });

  // Initialize form with user data once workstations loaded
  useEffect(() => {
    if (user && workstations.length > 0) {
      const selectedWs = workstations.find(
        ws => ws.workstation_id === user.workstation_hold
      );

      setSelectedType(selectedWs?.workstation_type || "");

      setFormData({
        workstation_hold: user.workstation_hold ?? null,
        hr_role: user.hr_role || "user",
        school: selectedWs?.beis_school_id || "",
      });
    }
  }, [user, workstations]);

  // Fetch all workstations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/workstation/all`);
        const data = res.data.data || [];
        setWorkstations(data);

        const types = [...new Set(data.map(ws => ws.workstation_type))];
        const typeOptions = types.map(type => ({ value: type, label: type }));

        // Add NONE option at top
        setWorkstationTypes([{ value: "none", label: "None" }, ...typeOptions]);
      } catch (error) {
        console.error("Error fetching workstations:", error);
      }
    };

    fetchData();
  }, []);

  // Filter workstations by selected type
  useEffect(() => {
    if (selectedType && selectedType !== "none") {
      const filtered = workstations
        .filter(ws => ws.workstation_type === selectedType)
        .map(ws => ({
          value: ws.workstation_id,
          label: ws.workstation_name,
          school: ws.beis_school_id,
        }));

      setFilteredWorkstations(filtered);
    } else {
      setFilteredWorkstations([]);
      setFormData(prev => ({
        ...prev,
        workstation_hold: null,
        school: "",
      }));
    }
  }, [selectedType, workstations]);

  const handleSubmit = async () => {
    onClose();
    const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;

    try {
      const payload = {
        workstation_hold: formData.workstation_hold, // null if none
        hr_role: formData.hr_role,
      };

      await API.put(`auth/user/${user.user_id}`, payload);
            await showSuccess("Updated Successfully!");
      onUpdated();

    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Workstation</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">

          {/* Workstation Type */}
          <div>
            <Label>Workstation Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value);

                if (value === "none") {
                  setFormData({
                    ...formData,
                    workstation_hold: null,
                    school: "",
                  });
                } else {
                  setFormData({
                    ...formData,
                    workstation_hold: "",
                    school: "",
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
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

          {/* Workstation Dropdown */}
          {selectedType !== "none" && selectedType !== "" && (
            <div>
              <Label>Workstation</Label>
              <SearchableDropdown
                items={filteredWorkstations}
                value={formData.workstation_hold}
                onChange={(value) => {
                  const selectedWs = filteredWorkstations.find(ws => ws.value === value);
                  setFormData({
                    ...formData,
                    workstation_hold: value,
                    school: selectedWs?.school || "",
                  });
                }}
                placeholder="Select workstation"
              />
            </div>
          )}

          {/* Selected Type */}
          {selectedType !== "none" && selectedType !== "" && (
            <div>
              <Label>Selected Type</Label>
              <input
                value={selectedType}
                readOnly
                className="w-full border rounded p-2"
              />
            </div>
          )}

          {/* School ID */}
          {selectedType === "school" && (
            <div>
              <Label>School ID</Label>
              <input
                value={formData.school || ""}
                readOnly
                className="w-full border rounded p-2"
              />
            </div>
          )}

          {/* HR Role Dropdown */}
          <div>
            <Label>HR Role</Label>
            <Select
              value={formData.hr_role}
              onValueChange={(value) => setFormData({ ...formData, hr_role: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select HR Role" />
              </SelectTrigger>
              <SelectContent>
                {HR_ROLES.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkstationModal;
