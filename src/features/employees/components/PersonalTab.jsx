import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PersonalTab = ({ employeeId }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const PersonalSections = [
    {
      title: "Name Information",
      fields: [
        { key: "f_name", label: "First Name" },
        { key: "l_name", label: "Last Name" },
        { key: "m_name", label: "Middle Name" },
        { key: "ex_name", label: "Name Extension" },
      ],
    },
    {
      title: "Birth Details",
      fields: [
        { key: "b_day", label: "Date of Birth", type: "date" },
        { key: "p_birth", label: "Place of Birth" },
        { key: "gender", label: "Sex" },
        { key: "citizenship", label: "Citizenship" },
      ],
    },
    {
      title: "Government Identification",
      fields: [
        { key: "gsis_num", label: "GSIS ID" },
        { key: "pagibig_num", label: "Pag-IBIG ID" },
        { key: "philhealth_num", label: "PhilHealth ID" },
        { key: "sss_num", label: "SSS ID" },
        { key: "tin_num", label: "TIN" },
        { key: "employer_id", label: "Agency Employee No." },
      ],
    },
    {
      title: "Contact Information",
      fields: [
        { key: "mobile_no", label: "Mobile Number" },
        { key: "email_address", label: "Email Address" },
        { key: "house_no", label: "House No." },
        { key: "street", label: "Street" },
        { key: "baranggay", label: "Barangay" },
        { key: "municipality", label: "Municipality" },
        { key: "province", label: "Province" },
      ],
    },
  ];

  // Fetch employee data when mounted
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/employee/personal_info/${employeeId}`);
        // Fix: Set formData to res.data directly, not res.data.data
        setFormData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch employee:", err);
      } finally {
        setLoading(false);
      }
    };
    if (employeeId) fetchEmployee();
  }, [employeeId]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/employee/update/${employeeId}`, formData);
      alert("✅ Employee data updated successfully!");
    } catch (err) {
      console.error("❌ Error updating employee:", err);
      alert("Update failed. Please check the console.");
    }
  };

  if (loading) return <p>Loading employee data...</p>;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {PersonalSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardContent className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-[#1A3A1A] border-b pb-1">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type={field.type || "text"}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.label}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default PersonalTab;
