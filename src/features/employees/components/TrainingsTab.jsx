import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import APIV2 from "@/api/axiosv2";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";

const TrainingsTab = ({ employeeId }) => {
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    from_date: "",
    to_date: "",
    hours: "",
    sponsor: "",
    participant_type: "",
    level: "",
    file: null,
  });

  // Fetch trainings
  const fetchTrainings = async () => {
    try {
      setLoading(true)
      const res = await APIV2.get(`/trainings/${employeeId}`);
      setTrainings(res.data.data || []);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching trainings:", error);
      setTrainings([]);
      setLoading(false)
    }
  };

  useEffect(() => {
    if (employeeId) fetchTrainings();
  }, [employeeId]);

  // Handle Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  // Add dialog
  const openAddDialog = () => {
    setFormData({
      title: "",
      from_date: "",
      to_date: "",
      hours: "",
      sponsor: "",
      participant_type: "",
      level: "",
      file: null,
    });
    setIsEditing(false);
    setEditingId(null);
    setOpenDialog(true);
  };

  // Edit dialog
  const openEditDialog = (rec) => {
    setFormData({
      title: rec.title,
      from_date: rec.from_date,
      to_date: rec.to_date,
      hours: rec.hours,
      sponsor: rec.sponsor,
      participant_type: rec.participant_type,
      level: rec.level,
      file: null,
    });
    setIsEditing(true);
    setEditingId(rec.id);
    setOpenDialog(true);
  };

  // Submit
  const handleSubmit = async () => {
    setOpenDialog(false);


    const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) dataToSend.append(key, value);
      });

      dataToSend.append("employee_id", employeeId);

      if (isEditing && editingId) {
        await API.put(`/trainings/${editingId}`, dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post(`/trainings/upload_and_create`, dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchTrainings();
      await showSuccess();
    } catch (error) {
      console.error("Error saving training:", error);
    }
  };

  // Delete
  const handleDelete = async (id) => {

    const confirm = await showConfirm("Are you sure to delete this data?");
    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/trainings/${id}`);
      fetchTrainings();
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          {/* Spinner */}
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

          {/* Loading text */}
          <span className="text-gray-600 font-medium">Loading trainings data...</span>
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#1A3A1A]">Trainings</h2>
        <Button onClick={openAddDialog}>Add Training</Button>
      </div>

      {/* TRAININGS GRID */}
      {trainings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainings.map((rec) => (
            <Card
              key={rec.id}
              className="shadow-md hover:shadow-xl transition-all border border-gray-200 rounded-xl hover:scale-[1.02]"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-semibold text-[#1A3A1A] leading-tight">
                    {rec.title}
                  </CardTitle>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 rounded-lg"
                      onClick={() => openEditDialog(rec)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 px-3 rounded-lg"
                      onClick={() => handleDelete(rec.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm py-2">
                {/* DATE */}
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 mt-[2px]">📅</span>
                  <div>
                    <Label className="text-gray-600">Date</Label>
                    <p className="font-medium">
                      {rec.from_date} → {rec.to_date}
                    </p>
                  </div>
                </div>

                {/* HOURS */}
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 mt-[2px]">⏱️</span>
                  <div>
                    <Label className="text-gray-600">Hours</Label>
                    <p className="font-medium">{rec.hours}</p>
                  </div>
                </div>

                {/* SPONSOR */}
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 mt-[2px]">🏢</span>
                  <div>
                    <Label className="text-gray-600">Sponsor</Label>
                    <p className="font-medium">{rec.sponsor}</p>
                  </div>
                </div>

                {/* LEVEL */}
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 mt-[2px]">🎓</span>
                  <div>
                    <Label className="text-gray-600">Level</Label>
                    <p className="font-medium">{rec.level}</p>
                  </div>
                </div>

                {/* PARTICIPANT TYPE */}
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 mt-[2px]">👤</span>
                  <div>
                    <Label className="text-gray-600">Participant Type</Label>
                    <p className="font-medium">{rec.participant_type}</p>
                  </div>
                </div>

                {/* CERTIFICATE LINK */}
                {rec.signed_url && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 mt-[2px]">📄</span>
                    <div>
                      <Label className="text-gray-600">Certificate</Label>
                      <a
                        href={rec.signed_url}
                        target="_blank"
                        className="text-blue-600 underline font-medium hover:text-blue-800"
                      >
                        View Certificate
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No training records found.</p>
      )}

      {/* DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Training" : "Add Training"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {[
              ["Title", "title"],
              ["From Date", "from_date", "date"],
              ["To Date", "to_date", "date"],
              ["Hours", "hours", "number"],
              ["Sponsor", "sponsor"],
              ["Participant Type", "participant_type"],
              ["Level", "level"],
            ].map(([label, name, type = "text"]) => (
              <div key={name}>
                <Label>{label}</Label>
                <Input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            <div>
              <Label>Certificate File</Label>
              <Input type="file" onChange={handleFileChange} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingsTab;
