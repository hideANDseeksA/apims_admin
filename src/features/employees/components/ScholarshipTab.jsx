import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";
import APIV2 from "@/api/axiosv2";

const ScholarshipTab = ({ employeeId }) => {
  const [scholarships, setScholarships] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ title: "", sponsor: "", date_from: "", date_to: "" });

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const res = await APIV2.get(`/schoolarship/${employeeId}`);
      setScholarships(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setScholarships([]);
      setLoading(false);
    }
  };

  useEffect(() => { if (employeeId) fetchScholarships(); }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setFormData({ title: "", sponsor: "", date_from: "", date_to: "" });
    setIsEditing(false);
    setEditingId(null);
    setOpenDialog(true);
  };

  const openEditDialog = (scholarship) => {
    setFormData({ title: scholarship.title, sponsor: scholarship.sponsor, date_from: scholarship.date_from, date_to: scholarship.date_to });
    setIsEditing(true);
    setEditingId(scholarship.id);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    setOpenDialog(false);
    const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;


    try {
      if (isEditing && editingId) {
        await API.put(`/schoolarship/${editingId}`, { ...formData, employee_id: employeeId });
      } else {
        await API.post(`/schoolarship`, { ...formData, employee_id: employeeId });
      }

      fetchScholarships();
      setFormData({ title: "", sponsor: "", date_from: "", date_to: "" });
      setIsEditing(false);
      setEditingId(null);

      await showSuccess();
    } catch (error) {
      console.error("Error saving scholarship:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await showConfirm("Are you sure to delete this data?");
    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/schoolarship/${id}`);
      fetchScholarships();
      await showSuccess("Deleted!");
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
          <span className="text-gray-600 font-medium">Loading schoolarship data...</span>
        </div>
      </div>
    );


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">Scholarships</h2>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <PlusCircle size={18} /> Add Scholarship
        </Button>
      </div>

      {/* Responsive Grid (3 columns on large screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scholarships.length > 0 ? (
          scholarships.map((sch) => (
            <Card key={sch.id} className="shadow-md rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle className="text-lg font-semibold truncate">{sch.title}</CardTitle>
                <div className="flex space-x-2">
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => openEditDialog(sch)}>
                    <Edit size={16} />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(sch.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div>
                  <Label className="font-medium">Sponsor</Label>
                  <p className="text-gray-700">{sch.sponsor}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="font-medium">Date From</Label>
                    <p>{sch.date_from}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Date To</Label>
                    <p>{sch.date_to}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No scholarships found.</p>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Scholarship" : "Add Scholarship"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label>Title</Label>
              <Input name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Sponsor</Label>
              <Input name="sponsor" value={formData.sponsor} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date From</Label>
                <Input type="date" name="date_from" value={formData.date_from} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Date To</Label>
                <Input type="date" name="date_to" value={formData.date_to} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{isEditing ? "Update" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScholarshipTab;