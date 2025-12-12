import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Pencil, Trash2, PlusCircle, MapPin, Clock, CalendarDays } from "lucide-react"; // icons

const InvolvementTab = ({ employeeId }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [involvements, setInvolvements] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name_org: "",
    address_org: "",
    date_from: "",
    date_to: "",
    hours_no: 0,
    position: "",
  });

  const fetchInvolvements = async () => {
    try {
      const res = await axios.get(`${API_URL}/involvement/${employeeId}`);
      setInvolvements(res.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (employeeId) fetchInvolvements();
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormData({
      name_org: "",
      address_org: "",
      date_from: "",
      date_to: "",
      hours_no: 0,
      position: "",
    });
    setIsEditing(false);
    setEditingId(null);
    setOpenDialog(true);
  };

  const handleEditClick = (item) => {
    setFormData(item);
    setIsEditing(true);
    setEditingId(item.id);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/involvement/${editingId}`, {
          ...formData,
          employee_id: employeeId,
          hours_no: Number(formData.hours_no),
        });
      } else {
        await axios.post(`${API_URL}/involvement`, {
          ...formData,
          employee_id: employeeId,
          hours_no: Number(formData.hours_no),
        });
      }

      fetchInvolvements();
      setOpenDialog(false);
      setFormData({
        name_org: "",
        address_org: "",
        date_from: "",
        date_to: "",
        hours_no: 0,
        position: "",
      });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this involvement?")) return;
    try {
      await axios.delete(`${API_URL}/involvement/${id}`);
      fetchInvolvements();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center pb-2">
        <h2 className="text-xl font-bold tracking-tight">Involvements</h2>
        <Button onClick={handleAddClick} className="flex items-center gap-2">
          <PlusCircle size={18} /> Add Involvement
        </Button>
      </div>

      {/* List */}
      {involvements.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {involvements.map((item) => (
            <Card
              key={item.id}
              className="border rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <CardTitle className="text-lg font-semibold">{item.name_org}</CardTitle>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEditClick(item)}
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
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p><strong>Address:</strong> {item.address_org}</p>
                </div>

                <div className="flex items-start gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <p><strong>Date:</strong> {item.date_from} → {item.date_to}</p>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <p><strong>Total Hours:</strong> {item.hours_no}</p>
                </div>

                <div className="flex items-start gap-2">
                  <p><strong>Position:</strong> {item.position}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No involvements found.</p>
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {isEditing ? "Edit Involvement" : "Add New Involvement"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <Label>Organization Name</Label>
              <Input name="name_org" value={formData.name_org} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Address</Label>
              <Input name="address_org" value={formData.address_org} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Position</Label>
              <Input name="position" value={formData.position} onChange={handleInputChange} />
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

            <div>
              <Label>Total Hours</Label>
              <Input type="number" name="hours_no" value={formData.hours_no} onChange={handleInputChange} />
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

export default InvolvementTab;
