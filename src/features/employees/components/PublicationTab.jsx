import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from "lucide-react";
import APIV2 from '@/api/axiosv2';

import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";

const PublicationTab = ({ employeeId }) => {
  const [publicationData, setPublicationData] = useState([]);
  const [editForm, setEditForm] = useState({ title: '', date: '' });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
const [loading, setLoading] = useState(false);
  const fetchPublicationData = async () => {
    try {
      setLoading(true);
      const response = await APIV2.get(`/publication/${employeeId}`);
      setPublicationData(response.data || []);
       setLoading(false);
    } catch (error) {
      console.error('Error fetching publication data:', error);
          setPublicationData( []);
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicationData();
  }, [employeeId]);

  const handleAdd = () => {
    setSelectedRecord(null);
    setEditForm({ title: '', date: '' });
    setOpenDialog(true);
  };

  const handleEdit = (item) => {
    setSelectedRecord(item);
    setEditForm({
      title: item.title || '',
      date: item.date || '',
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
         setOpenDialog(false);

    const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;

    try {
      const payload = {
        title: editForm.title,
        date: editForm.date,
        employee_id: employeeId,
      };

      if (selectedRecord) {
        await API.put(`/publication/update/${selectedRecord.id}`, payload);
      } else {
        await API.post(`/publication/add`, payload);
      }

      fetchPublicationData();
      setEditForm({ title: '', date: '' });
      setSelectedRecord(null);
       await showSuccess();
 
    } catch (error) {
      console.error('Error saving publication data:', error);
    }
  };

  const handleDelete = async (id) => {
   const confirm = await showConfirm("Are you sure to delete this data?");
    if (!confirm.isConfirmed) return;


    try {
      await API.delete(`/publication/delete/${id}`);
      fetchPublicationData();
      await showSuccess("Delete!");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

if (loading)
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

        {/* Loading text */}
        <span className="text-gray-600 font-medium">Loading publication data...</span>
      </div>
    </div>
  );

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between border-b pb-1 mb-3">
        <h2 className="text-lg font-semibold text-[#1A3A1A]">Publication Information</h2>

        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={16} /> Add Publication
        </Button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {publicationData.length > 0 ? (
          publicationData.map((item) => (
            <Card key={item.id} className="shadow-sm hover:shadow-md transition rounded-xl">
              <CardContent className="space-y-3 pt-4">
                
                <div>
                  <Label className="text-gray-600">Title</Label>
                  <p className="font-medium">{item.title}</p>
                </div>

                <div>
                  <Label className="text-gray-600">Date</Label>
                  <p className="font-medium">{item.date}</p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-2 pt-2">

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => handleEdit(item)}
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
              </CardContent>
            </Card>
          ))
        ) : (
          <div>No publication data available.</div>
        )}
      </div>

      {/* DIALOG FORM */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedRecord ? 'Edit Publication' : 'Add Publication'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editForm.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={editForm.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicationTab;
