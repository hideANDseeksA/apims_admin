import React, { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import APIV2 from "@/api/axiosv2";

import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";


const SkillsTab = ({ employeeId }) => {
  const [records, setRecords] = useState([]);
  const [skill, setSkill] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // For editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch existing data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await APIV2.get(
        `/skills-membership/employee/${employeeId}/skills`
      );
      setRecords(res.data.skills || []);
          setLoading(false);
    } catch (err) {
      console.error(err);
           setRecords( []);
          setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Add Dialog
  const openAdd = () => {
    setSkill("");
    setIsEditing(false);
    setEditingId(null);
    setOpen(true);
  };

  // Open Edit Dialog
  const openEdit = (item) => {
    setSkill(item.skill);
    setIsEditing(true);
    setEditingId(item.id);
    setOpen(true);
  };

  // Submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
      setOpen(false);
        const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;
    const payload = {
      skills: skill,
      membership:null,
      employee_id: employeeId,
    };

    try {
      if (isEditing && editingId) {
        // PUT update
        await API.put(`/skills-membership/${editingId}`, payload);
      } else {
        // POST create
        await API.post(`/skills-membership/`, payload);
      }

      setSkill("");
      setIsEditing(false);
      setEditingId(null);
      fetchData(); // Refresh list

      await showSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };
     const handleDelete = async (employeeId) => {
       const confirm = await showConfirm("Are you sure to delete this data?");
    if (!confirm.isConfirmed) return;
      
        try {
          await APIV2.delete(`/skills-membership/${employeeId}`);
          fetchData(); // refresh table after deletion
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
        <span className="text-gray-600 font-medium">Loading skills data...</span>
      </div>
    </div>
  );
return (
<div className="space-y-4">
<Card>
<CardHeader className="flex justify-between items-center">
<CardTitle className="text-xl font-semibold">Skills</CardTitle>


<Dialog open={open} onOpenChange={setOpen}>
<DialogTrigger asChild>
<Button onClick={openAdd} className="flex items-center gap-2">
<Plus className="w-4 h-4" /> Add New
</Button>
</DialogTrigger>


<DialogContent>
<DialogHeader>
<DialogTitle>{isEditing ? "Edit Skill" : "Add Skill"}</DialogTitle>
<DialogDescription>
{isEditing ? "Update this skill." : "Enter a new skill."}
</DialogDescription>
</DialogHeader>


<form onSubmit={handleSubmit} className="space-y-4">
<div>
<Label>Skill</Label>
<Input
value={skill}
onChange={(e) => setSkill(e.target.value)}
placeholder="Enter skill"
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
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{records.map((item, index) => (
<Card key={index} className="p-4 shadow-sm border rounded-xl">
<div className="flex flex-col gap-3 h-full justify-between">
<p className="font-medium text-gray-700">{item.skill}</p>


<div className="flex justify-between mt-2">
<Button
size="sm"
variant="outline"
className="flex items-center gap-1"
onClick={() => openEdit(item)}
>
<Pencil className="w-4 h-4" /> Edit
</Button>


<Button
size="sm"
variant="destructive"
className="flex items-center gap-1"
onClick={() => handleDelete(item.id)}
>
<Trash2 className="w-4 h-4" /> Delete
</Button>
</div>
</div>
</Card>
))}
</div>
)}
</CardContent>
</Card>
</div>
);
};

export default SkillsTab;
