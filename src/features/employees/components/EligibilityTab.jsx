import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import { Pencil, Trash2, PlusCircle, CalendarDays, MapPin, IdCard } from "lucide-react";
import APIV2 from "@/api/axiosv2";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";
const EligibilityTab = ({ employeeId }) => {
  const [eligibilityData, setEligibilityData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
 const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    career_service: "",
    rating: "",
    date_exam: "",
    place_exam: "",
    license_no: "",
    date_valid: "",
  });

  const fetchEligibility = async () => {
    try {
      setLoading(true)
      const res = await APIV2.get(`/elegibility/${employeeId}`);
      setEligibilityData(res.data || []);
         setLoading(false)
    } catch (err) {
      console.error("Fetch error:", err);
         setEligibilityData([]);
            setLoading(false)
    }
  };

  useEffect(() => {
    if (employeeId) fetchEligibility();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      career_service: "",
      rating: "",
      date_exam: "",
      place_exam: "",
      license_no: "",
      date_valid: "",
    });
    setOpenDialog(true);
  };

  const openEdit = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData(item);
    setOpenDialog(true);
  };

  const handleSave = async () => {
          setOpenDialog(false);
    const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;

    try {
      if (isEditing) {
        await API.put(`/elegibility/update/${editingId}`, {
          ...formData,
          employee_id: employeeId,
        });
      } else {
        await API.post(`/elegibility/add`, {
          ...formData,
          employee_id: employeeId,
        });
      }
      await showSuccess();
      fetchEligibility();

    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
       const confirm = await showConfirm("Are you sure to delete this data?");
    if (!confirm.isConfirmed) return;


    try {
      await API.delete(`/elegibility/delete/${id}`);
      fetchEligibility();
      await showSuccess();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
if (loading)
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

        {/* Loading text */}
        <span className="text-gray-600 font-medium">Loading elegibility data...</span>
      </div>
    </div>
  );
  return (
    <div className="space-y-4">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center pb-2">
        <h2 className="text-xl font-bold tracking-tight">Eligibility Information</h2>

        <Button onClick={openAdd} className="flex items-center gap-2">
          <PlusCircle size={18} /> Add Eligibility
        </Button>
      </div>

      {/* Cards */}
      {eligibilityData.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {eligibilityData.map((item) => (
            <Card
              key={item.id}
              className="border rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <CardTitle className="text-lg font-semibold">
                  {item.career_service}
                </CardTitle>

                {/* Edit/Delete Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openEdit(item)}
                    className="h-8 w-8"
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <IdCard className="w-4 h-4 text-muted-foreground" />
                  <p>
                    <strong>Rating:</strong> {item.rating}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <p>
                    <strong>Date of Exam:</strong> {item.date_exam}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p>
                    <strong>Place of Exam:</strong> {item.place_exam}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <p>
                    <strong>License No:</strong> {item.license_no}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <p>
                    <strong>Valid Until:</strong> {item.date_valid}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No eligibility records found.</p>
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {isEditing ? "Edit Eligibility" : "Add Eligibility"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <Label>Career Service</Label>
              <Input
                name="career_service"
                value={formData.career_service}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Rating</Label>
              <Input
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Date of Exam</Label>
              <Input
                type="date"
                name="date_exam"
                value={formData.date_exam}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Place of Exam</Label>
              <Input
                name="place_exam"
                value={formData.place_exam}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>License No.</Label>
              <Input
                name="license_no"
                value={formData.license_no}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Validity Date</Label>
              <Input
                type="date"
                name="date_valid"
                value={formData.date_valid}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>

            <Button onClick={handleSave}>
              {isEditing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EligibilityTab;
