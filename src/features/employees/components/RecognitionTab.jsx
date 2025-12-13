import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import APIV2 from "@/api/axiosv2";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";

const RecognitionTab = ({ employeeId }) => {
  const [recognition, setRecognition] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ award: "", award_body: "", date_awarded: "", award_level: "" });

  const fetchRecognition = async () => {
    try {
      setLoading(true);
      const res = await APIV2.get(`/recognition/${employeeId}`);
      setRecognition(res.data || []);
            setLoading(false);
    } catch (error) {
      console.error("Error fetching recognition:", error);
            setRecognition( []);
            setLoading(false);
    }
  };

  useEffect(() => { if (employeeId) fetchRecognition(); }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setFormData({ award: "", award_body: "", date_awarded: "", award_level: "" });
    setIsEditing(false);
    setEditingId(null);
    setOpenDialog(true);
  };

  const openEditDialog = (award) => {
    setFormData({ award: award.award, award_body: award.award_body, date_awarded: award.date_awarded, award_level: award.award_level });
    setIsEditing(true);
    setEditingId(award.id);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
     setOpenDialog(false);
    const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;



    try {
      if (isEditing && editingId) {
        await API.put(`/recognition/${editingId}`, { ...formData, employee_id: employeeId });
      } else {
        await API.post(`/recognition`, { ...formData, employee_id: employeeId });
      }

      fetchRecognition();
      setFormData({ award: "", award_body: "", date_awarded: "", award_level: "" });
      setIsEditing(false);
      setEditingId(null);
      await showSuccess();
    } catch (error) {
      console.error("Error saving award:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await showConfirm("Are you sure to delete this data?");
    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/recognition/${id}`);
      fetchRecognition();
       await showSuccess("Deleted");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  
if (loading)
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

        {/* Loading text */}
        <span className="text-gray-600 font-medium">Loading Awards & Recognition data...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">Awards & Recognition</h2>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <PlusCircle size={18} /> Add Award
        </Button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recognition.length > 0 ? (
          recognition.map((a) => (
            <Card key={a.id} className="shadow-md rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle className="text-lg font-semibold truncate">{a.award}</CardTitle>
                <div className="flex space-x-2">
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => openEditDialog(a)}>
                    <Edit size={16} />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(a.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div>
                  <Label className="font-medium">Awarding Body</Label>
                  <p className="text-gray-700">{a.award_body}</p>
                </div>
                <div>
                  <Label className="font-medium">Award Level</Label>
                  <p className="text-gray-700">{a.award_level}</p>
                </div>
                <div>
                  <Label className="font-medium">Date Awarded</Label>
                  <p>{a.date_awarded}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No awards found.</p>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Award" : "Add Award"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label>Award</Label>
              <Input name="award" value={formData.award} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Awarding Body</Label>
              <Input name="award_body" value={formData.award_body} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Award Level</Label>
              <Input name="award_level" value={formData.award_level} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Date Awarded</Label>
              <Input type="date" name="date_awarded" value={formData.date_awarded} onChange={handleInputChange} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{isEditing ? "Update" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecognitionTab;