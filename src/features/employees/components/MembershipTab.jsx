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

import { Plus, Edit, Trash2 } from "lucide-react";
import APIV2 from "@/api/axiosv2";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";

const MembershipTab = ({ employeeId }) => {
  const [records, setRecords] = useState([]);
  const [membership, setMembership] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit handling
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await APIV2.get(
        `/skills-membership/employee/${employeeId}/membership`
      );
      setRecords(res.data.memberships || []);
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
          setOpen(false);
    const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;
    const payload = {
      skills: null,
      membership: membership || null,
      employee_id: employeeId,
    };

    try {
      if (isEditing && editingId) {
        await API.put(`/skills-membership/${editingId}`, payload);
      } else {
        await API.post(`/skills-membership/`, payload);
      }

      setMembership("");
      setIsEditing(false);
      setEditingId(null);
      fetchData();
      await showSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await showConfirm("Are you sure to delete this data?");
    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/skills-membership/${id}`);
      fetchData();
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
        <span className="text-gray-600 font-medium">Loading membership data...</span>
      </div>
    </div>
  );

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
