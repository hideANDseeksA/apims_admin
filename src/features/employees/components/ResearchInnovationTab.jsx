// Enhanced version of ResearchInnovationTab with responsive grid, icons, and improved UI

import React, { useEffect, useState } from "react";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import APIV2 from "@/api/axiosv2";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";


const ResearchInnovationTab = ({ employeeId }) => {
  const [innovations, setInnovations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date_from: "",
    date_to: "",
    abstract_summary: "",
  });

  const fetchInnovations = async () => {
    try {
      setLoading(true);
      const res = await APIV2.get(`/research-innovation/${employeeId}`);
      setInnovations(res.data || []);
        setLoading(false);
    } catch (error) {
      console.error("Error fetching research innovations:", error);
           setInnovations([]);
        setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchInnovations();
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setFormData({ title: "", date_from: "", date_to: "", abstract_summary: "" });
    setIsEditing(false);
    setEditingId(null);
    setOpenDialog(true);
  };

  const openEditDialog = (record) => {
    setFormData({
      title: record.title,
      date_from: record.date_from,
      date_to: record.date_to,
      abstract_summary: record.abstract_summary,
    });
    setIsEditing(true);
    setEditingId(record.id);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {

      setOpenDialog(false);
          const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;
    try {
      if (isEditing && editingId) {
        await API.put(`/research-innovation/${editingId}`, {
          ...formData,
          employee_id: employeeId,
        });
      } else {
        await API.post(`/research-innovation`, {
          ...formData,
          employee_id: employeeId,
        });
      }

      fetchInnovations();
      setIsEditing(false);
      setEditingId(null);
      setFormData({ title: "", date_from: "", date_to: "", abstract_summary: "" });
            await showSuccess();
    } catch (error) {
      console.error("Error saving research innovation:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await showConfirm("Are you sure to delete this data?");
    if (!confirm.isConfirmed) return;


    try {
      await API.delete(`/research-innovation/${id}`);
      setInnovations((prev) => prev.filter((rec) => rec.id !== id));
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
        <span className="text-gray-600 font-medium">Loading Research & Innovation data...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Research & Innovation</h2>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus size={18} /> Add Research/Innovation
        </Button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {innovations.length > 0 ? (
          innovations.map((rec) => (
            <Card key={rec.id} className="shadow-sm hover:shadow-md transition rounded-xl border">
              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle className="text-base font-semibold">{rec.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(rec)}
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleDelete(rec.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div>
                  <Label>Date From:</Label>
                  <p>{rec.date_from}</p>
                </div>
                <div>
                  <Label>Date To:</Label>
                  <p>{rec.date_to}</p>
                </div>
                <div>
                  <Label>Abstract/Summary:</Label>
                  <p className="line-clamp-3">{rec.abstract_summary}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No research or innovation records found.</p>
        )}
      </div>

      {/* ADD / EDIT DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Record" : "Add Research/Innovation"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <Label>Title</Label>
              <Input name="title" value={formData.title} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Date From</Label>
              <Input type="date" name="date_from" value={formData.date_from} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Date To</Label>
              <Input type="date" name="date_to" value={formData.date_to} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Abstract / Summary</Label>
              <Input name="abstract_summary" value={formData.abstract_summary} onChange={handleInputChange} />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{isEditing ? "Update" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResearchInnovationTab;