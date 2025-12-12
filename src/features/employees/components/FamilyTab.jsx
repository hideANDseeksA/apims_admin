import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const FamilyTab = ({ employeeId }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [familyData, setFamilyData] = useState({});
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);

  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [childForm, setChildForm] = useState({ full_name: "", b_day: "" });

  useEffect(() => {
    if (!employeeId) return;

    const fetchFamilyData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/family/${employeeId}`);
        const data = res.data.data || res.data;
        if (!data) {
          setExists(false);
          setFamilyData({});
        } else {
          setExists(true);
          setFamilyData(data);
        }

        const childrenRes = await axios.get(
          `${API_URL}/family/children/by-employee/${employeeId}`
        );
        setChildren(childrenRes.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setExists(false);
          setFamilyData({});
          setChildren([]);
        } else {
          console.error("Error fetching family data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, [employeeId]);

  const handleChange = (key, value) => {
    setFamilyData((prev) => ({ ...prev, [key]: value }));
  };

  const handleChildFormChange = (key, value) => {
    setChildForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveFamily = async () => {
    try {
      const payload = {
        employee_id: employeeId,
        spouse_fname: familyData.spouse_fname || "",
        spouse_mname: familyData.spouse_mname || "",
        spouse_lname: familyData.spouse_lname || "",
        spouse_exname: familyData.spouse_exname || "",
        occupation: familyData.occupation || "",
        employer_business: familyData.employer_business || "",
        business_add: familyData.business_add || "",
        tel_no: familyData.tel_no || "",
        father_lname: familyData.father_lname || "",
        father_fname: familyData.father_fname || "",
        father_mname: familyData.father_mname || "",
        father_exname: familyData.father_exname || "",
        mother_maidenname: familyData.mother_maidenname || "",
        mother_fname: familyData.mother_fname || "",
        mother_mname: familyData.mother_mname || "",
      };

      if (!exists) {
        const res = await axios.post(`${API_URL}/family/add`, payload);
        const created = res.data.data || res.data;
        setFamilyData({ ...payload, family_id: created.family_id });
        setExists(true);
        alert("✅ Family record created!");
        return;
      }

      await axios.put(`${API_URL}/family/update/${familyData.id}`, payload);
      alert("✅ Family information updated!");
    } catch (err) {
      console.error("Error saving family data:", err);
      alert("❌ Save failed.");
    }
  };

  const handleSaveChild = async () => {
    try {
      if (!childForm.full_name || !childForm.b_day) {
        alert("Please enter child name and birth date.");
        return;
      }

      if (editingChild) {
        const res = await axios.put(
          `${API_URL}/family/children/update/${editingChild.id}`,
          { ...childForm, employee_id: employeeId }
        );
        const updatedChild = res.data.data || { ...editingChild, ...childForm };
        setChildren((prev) =>
          prev.map((c) => (c.id === updatedChild.id ? updatedChild : c))
        );
        alert("✅ Child updated!");
      } else {
        const res = await axios.post(`${API_URL}/family/children/add`, {
          ...childForm,
          employee_id: employeeId,
        });
        const createdChild = res.data.data || {
          ...childForm,
          id: Math.random(),
        };
        setChildren((prev) => [...prev, createdChild]);
        alert("✅ Child added!");
      }

      setChildForm({ full_name: "", b_day: "" });
      setEditingChild(null);
      setChildDialogOpen(false);
    } catch (err) {
      console.error("Error saving child:", err);
      alert("❌ Failed to save child.");
    }
  };

  const handleDeleteChild = async (childId) => {
    if (!confirm("Are you sure you want to delete this child?")) return;

    try {
      await axios.delete(`${API_URL}/family/children/delete/${childId}`);
      setChildren((prev) => prev.filter((c) => c.id !== childId));
      alert("✅ Child deleted!");
    } catch (err) {
      console.error("Error deleting child:", err);
      alert("❌ Failed to delete child.");
    }
  };

  if (loading) return <p>Loading family data...</p>;

  return (
    <div className="space-y-8">

      {/* GRID */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6">

        {/* SPOUSE */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Spouse Information</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>First Name</Label>
              <Input
                value={familyData.spouse_fname || ""}
                onChange={(e) => handleChange("spouse_fname", e.target.value)}
              />
            </div>
            <div>
              <Label>Middle Name</Label>
              <Input
                value={familyData.spouse_mname || ""}
                onChange={(e) => handleChange("spouse_mname", e.target.value)}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={familyData.spouse_lname || ""}
                onChange={(e) => handleChange("spouse_lname", e.target.value)}
              />
            </div>
            <div>
              <Label>Extension</Label>
              <Input
                value={familyData.spouse_exname || ""}
                onChange={(e) => handleChange("spouse_exname", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* OCCUPATION */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Occupation Information</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Occupation</Label>
              <Input
                value={familyData.occupation || ""}
                onChange={(e) => handleChange("occupation", e.target.value)}
              />
            </div>
            <div>
              <Label>Employer / Business</Label>
              <Input
                value={familyData.employer_business || ""}
                onChange={(e) => handleChange("employer_business", e.target.value)}
              />
            </div>
            <div>
              <Label>Business Address</Label>
              <Input
                value={familyData.business_add || ""}
                onChange={(e) => handleChange("business_add", e.target.value)}
              />
            </div>
            <div>
              <Label>Telephone No.</Label>
              <Input
                value={familyData.tel_no || ""}
                onChange={(e) => handleChange("tel_no", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* PARENTS */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Parent Information</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Father's Last Name</Label>
              <Input
                value={familyData.father_lname || ""}
                onChange={(e) => handleChange("father_lname", e.target.value)}
              />
            </div>
            <div>
              <Label>Father's First Name</Label>
              <Input
                value={familyData.father_fname || ""}
                onChange={(e) => handleChange("father_fname", e.target.value)}
              />
            </div>
            <div>
              <Label>Father's Middle Name</Label>
              <Input
                value={familyData.father_mname || ""}
                onChange={(e) => handleChange("father_mname", e.target.value)}
              />
            </div>
            <div>
              <Label>Father's Extension</Label>
              <Input
                value={familyData.father_exname || ""}
                onChange={(e) => handleChange("father_exname", e.target.value)}
              />
            </div>
            <div>
              <Label>Mother's Maiden Name</Label>
              <Input
                value={familyData.mother_maidenname || ""}
                onChange={(e) => handleChange("mother_maidenname", e.target.value)}
              />
            </div>
            <div>
              <Label>Mother's First Name</Label>
              <Input
                value={familyData.mother_fname || ""}
                onChange={(e) => handleChange("mother_fname", e.target.value)}
              />
            </div>
            <div>
              <Label>Mother's Middle Name</Label>
              <Input
                value={familyData.mother_mname || ""}
                onChange={(e) => handleChange("mother_mname", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* CHILDREN */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Children</h2>
              <Dialog open={childDialogOpen} onOpenChange={setChildDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Add Child</Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Child Name</Label>
                      <Input
                        placeholder="Full Name"
                        value={childForm.full_name}
                        onChange={(e) =>
                          handleChildFormChange("full_name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Birth Date</Label>
                      <Input
                        type="date"
                        value={childForm.b_day}
                        onChange={(e) =>
                          handleChildFormChange("b_day", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setChildDialogOpen(false);
                          setEditingChild(null);
                          setChildForm({ full_name: "", b_day: "" });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveChild}>
                        {editingChild ? "Update Child" : "Save Child"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              {children.length === 0 ? (
                <p className="text-gray-500">No children added yet.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {children.map((child) => (
                    <Card key={child.id} className="border shadow-sm">
                      <CardHeader>
                        <h3 className="font-medium">{child.full_name}</h3>
                        <p className="text-sm text-gray-500">
                          Birthdate: {child.b_day}
                        </p>
                      </CardHeader>
                      <CardFooter className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingChild(child);
                            setChildForm({
                              full_name: child.full_name,
                              b_day: child.b_day,
                            });
                            setChildDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteChild(child.id)}
                        >
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <Button className="bg-blue-600 text-white" onClick={handleSaveFamily}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default FamilyTab;
