import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import APIV2 from '@/api/axiosv2';
import { showSuccess, showError, showConfirm } from "@/utils/alerts";

const PersonalTab = ({ employeeId }) => {

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
        const res = await APIV2.get(`/employee/personal_info/${employeeId}`);
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
  const confirm = await showConfirm("Are you sure to save this changes?");
  if (!confirm.isConfirmed) return;


    try {
      await APIV2.put(`/employee/update/${employeeId}`, formData);
      await showSuccess("✅ Employee data updated successfully!");
    } catch (err) {
      console.error("❌ Error updating employee:", err);
      await showError("Update failed. Please check the console.");
    }
  };

if (loading)
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

        {/* Loading text */}
        <span className="text-gray-600 font-medium">Loading employee data...</span>
      </div>
    </div>
  );


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
