import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Icons
import { Plus, Edit, Trash2 } from "lucide-react";

const PublicationTab = ({ employeeId }) => {
  const [publicationData, setPublicationData] = useState([]);
  const [editForm, setEditForm] = useState({ title: '', date: '' });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPublicationData = async () => {
    try {
      const response = await axios.get(`${API_URL}/publication/all`);
      setPublicationData(response.data || []);
    } catch (error) {
      console.error('Error fetching publication data:', error);
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
    try {
      const payload = {
        title: editForm.title,
        date: editForm.date,
        employee_id: employeeId,
      };

      if (selectedRecord) {
        await axios.put(`${API_URL}/publication/update/${selectedRecord.id}`, payload);
      } else {
        await axios.post(`${API_URL}/publication/add`, payload);
      }

      fetchPublicationData();
      setEditForm({ title: '', date: '' });
      setSelectedRecord(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving publication data:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;

    try {
      await axios.delete(`${API_URL}/publication/delete/${id}`);
      fetchPublicationData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

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
