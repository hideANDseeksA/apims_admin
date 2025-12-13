import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { showSuccess, showError, showConfirm } from "@/utils/alerts";
import React, { useEffect, useState } from 'react';
import APIV2 from '@/api/axiosv2';
import API from '@/api/axios';

const EducationTab = ({ employeeId }) => {
  const [educationData, setEducationData] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    school_name: '',
    level: '',
    date_from: '',
    date_to: '',
    graduated_year: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEducationData = async () => {
    try {
      setLoading(true)
      const response = await APIV2.get(`/education/all/${employeeId}`);
      setEducationData(response.data || []);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching education data:', error);
      setLoading(false)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      school_name: '',
      level: '',
      date_from: '',
      date_to: '',
      graduated_year: '',
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (school) => {
    setFormData({
      id: school.id,
      school_name: school.school_name,
      level: school.level,
      date_from: school.date_from,
      date_to: school.date_to,
      graduated_year: school.graduated_year,
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
      setOpenDialog(false);
    const confirm = await showConfirm("Are you sure to save this changes?");
    if (!confirm.isConfirmed) return;
    try {
      const payload = {
        school_name: formData.school_name,
        level: formData.level,
        date_from: formData.date_from,
        date_to: formData.date_to,
        graduated_year: Number(formData.graduated_year) || 0,
        employee_id: employeeId,
      };

      if (isEditing) {
        await API.put(`/education/update/${formData.id}`, payload);
      } else {
        await API.post(`/education/add`, payload);
      }
      await showSuccess();

      fetchEducationData();

    } catch (error) {
      console.error('Error saving education data:', error);
          await showError();
    }
  };

  const handleDelete = async (id) => {


    const confirm = await showConfirm("Are you sure to delete this data?");
    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/education/delete/${id}`);
          await showSuccess();
      fetchEducationData();

    } catch (error) {
      console.error("Delete error:", error);
      await showError();
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, [employeeId]);

  
if (loading)
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

        {/* Loading text */}
        <span className="text-gray-600 font-medium">Loading education data...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-[#1A3A1A] border-b pb-1">
        Education Information
      </h2>

      <Button className="btn btn-primary mb-4" onClick={handleAdd}>
        Add Education
      </Button>

 <div>
  {educationData.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {educationData.map((school) => (
        <Card key={school.id}>
          <CardContent className="space-y-2 pt-4">
            <div>
              <Label>School Name</Label>
              <p>{school.school_name}</p>
            </div>
            <div>
              <Label>Level</Label>
              <p>{school.level}</p>
            </div>
            <div>
              <Label>Date From - To</Label>
              <p>{`${school.date_from} - ${school.date_to}`}</p>
            </div>
            <div>
              <Label>Year Graduated</Label>
              <p>{school.graduated_year}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                className="btn btn-secondary"
                onClick={() => handleEdit(school)}
              >
                Edit
              </Button>
              <Button
                className="btn btn-danger"
                onClick={() => handleDelete(school.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div>No education data available.</div>
  )}
</div>


      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>School Name</Label>
              <Input name="school_name" value={formData.school_name} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Level</Label>
              <Input name="level" value={formData.level} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Date From</Label>
              <Input name="date_from" type="date" value={formData.date_from} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Date To</Label>
              <Input name="date_to" type="date" value={formData.date_to} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Year Graduated</Label>
              <Input name="graduated_year" value={formData.graduated_year} onChange={handleInputChange} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationTab;
