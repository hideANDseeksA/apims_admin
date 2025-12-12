import React, { useState, useEffect } from "react";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Plus, Edit, Trash2 } from "lucide-react";

const MembershipTab = ({ employeeId }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [records, setRecords] = useState([]);
  const [membership, setMembership] = useState("");
  const [open, setOpen] = useState(false);

  // Edit handling
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/skills-membership/employee/${employeeId}/membership`
      );
      setRecords(res.data.memberships || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setMembership("");
    setIsEditing(false);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (item) => {
    setMembership(item.membership);
    setIsEditing(true);
    setEditingId(item.id);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      skills: null,
      membership: membership || null,
      employee_id: employeeId,
    };

    try {
      if (isEditing && editingId) {
        await axios.put(`${API_URL}/skills-membership/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/skills-membership/`, payload);
      }

      setMembership("");
      setIsEditing(false);
      setEditingId(null);
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this membership?")) return;

    try {
      await axios.delete(`${API_URL}/skills-membership/${id}`);
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Memberships
          </CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} className="flex items-center gap-2">
                <Plus size={16} /> Add New
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Edit Membership" : "Add Membership"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the selected membership."
                    : "Enter a new membership record."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div>
                  <Label>Membership</Label>
                  <Input
                    value={membership}
                    onChange={(e) => setMembership(e.target.value)}
                    placeholder="Enter membership"
                  />
                </div>

                <Button type="submit" className="w-full">
                  {isEditing ? "Update" : "Save"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {records.length === 0 ? (
            <p className="text-sm text-gray-500">No records found.</p>
          ) : (
            <div
              className="
                grid 
                gap-4 
                grid-cols-1
                sm:grid-cols-2 
                lg:grid-cols-3 
                xl:grid-cols-4
              "
            >
              {records.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <p className="font-medium text-gray-800">{item.membership}</p>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => openEdit(item)}
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipTab;
