// Enhanced version of ResearchInnovationTab with responsive grid, icons, and improved UI

import React, { useEffect, useState } from "react";
import axios from "axios";
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

const ResearchInnovationTab = ({ employeeId }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [innovations, setInnovations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    date_from: "",
    date_to: "",
    abstract_summary: "",
  });

  const fetchInnovations = async () => {
    try {
      const res = await axios.get(`${API_URL}/research-innovation/${employeeId}`);
      setInnovations(res.data || []);
    } catch (error) {
      console.error("Error fetching research innovations:", error);
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
    try {
      if (isEditing && editingId) {
        await axios.put(`${API_URL}/research-innovation/${editingId}`, {
          ...formData,
          employee_id: employeeId,
        });
      } else {
        await axios.post(`${API_URL}/research-innovation`, {
          ...formData,
          employee_id: employeeId,
        });
      }

      fetchInnovations();
      setOpenDialog(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({ title: "", date_from: "", date_to: "", abstract_summary: "" });
    } catch (error) {
      console.error("Error saving research innovation:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`${API_URL}/research-innovation/${id}`);
      setInnovations((prev) => prev.filter((rec) => rec.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

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