import React, { useState } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AddressForm from "./AddressForm"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AddEmployee = () => {
  const [isOtherCitizenship, setIsOtherCitizenship] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL

  const [formData, setFormData] = useState({
    employer_id: "",
    l_name: "",
    f_name: "",
    m_name: "",
    ex_name: "",
    b_day: "",
    p_birth: "",
    gender: "",
    civil_status: "",
    height: 0,
    weight: 0,
    blood_type: "",
    gsis_num: "",
    pagibig_num: "",
    philhealth_num: "",
    sss_num: "",
    tin_num: "",
    citizenship: "",
    house_no: "",
    baranggay: "",
    street: "",
    municipality: "",
    subdivision: "",
    province: "",
    tel_no: "",
    mobile_no: "",
    email_address: ""
  })

  // Update text/number inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Update address from AddressForm
  const handleAddressChange = (address) => {
    setFormData((prev) => ({
      ...prev,
      ...address, // merges province, municipality, barangay, etc.
    }))
  }

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()


    try {
      const response = await axios.post(`${API_URL}/employee/add`, formData)
      console.log("✅ Employee added:", response.data)
      alert("Employee added successfully!")
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        // Handle specific status codes
        if (status === 409) {
          console.error("⚠️ Conflict:", data);
          alert("Employee already exists or data conflict!");
        }
        else if (status === 422) {
          console.error("⚠️ Validation error:", data);
          alert("Some required fields are invalid or missing.");
        }
        else {
          console.error(`❌ Server error (${status}):`, data);
          alert("An unexpected server error occurred.");
        }
      }
      else if (error.request) {
        console.error("🚫 No response from server:", error.request);
        alert("No response from the server. Please check your connection.");
      }
      else {
        console.error("❌ Unexpected error:", error.message);
        alert("Unexpected error occurred.");
      }
    }

  }

  return (
    <Card className="max-w-4xl mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>Add Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Employer ID</Label>
                <Input name="employer_id" value={formData.employer_id} onChange={handleChange} required />
              </div>

              <div>
                <Label>Surnames</Label>
                <Input name="l_name" value={formData.l_name} onChange={handleChange} required />
              </div>
              <div>
                <Label>First Name</Label>
                <Input name="f_name" value={formData.f_name} onChange={handleChange} required />
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input name="m_name" value={formData.m_name} onChange={handleChange} />
              </div>
              <div>
                <Label>Name Extension</Label>
                <Input name="ex_name" value={formData.ex_name} onChange={handleChange} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" name="b_day" value={formData.b_day} onChange={handleChange} />
              </div>
              <div>
                <Label>Place of Birth</Label>
                <Input name="p_birth" value={formData.p_birth} onChange={handleChange} />
              </div>
              {/* Gender */}
              <div>
                <Label>Sex</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Civil Status */}
              <div>
                <Label>Civil Status</Label>
                <Select
                  value={formData.civil_status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, civil_status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Civil Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Height (cm)</Label>
                <Input name="height" value={formData.height} onChange={handleChange} />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input name="weight" type="number" value={formData.weight} onChange={handleChange} />
              </div>
              <div>
                <Label>Blood Type</Label>
                <Input name="blood_type" value={formData.blood_type} onChange={handleChange} />
              </div>
              <div>
                <Label>Citizenship</Label>
                <Select
                  value={isOtherCitizenship ? "Other" : formData.citizenship || ""}
                  onValueChange={(value) => {
                    if (value === "Filipino") {
                      setIsOtherCitizenship(false)
                      setFormData((prev) => ({ ...prev, citizenship: "Filipino" }))
                    } else {
                      setIsOtherCitizenship(true)
                      setFormData((prev) => ({ ...prev, citizenship: "" }))
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select citizenship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Filipino">Filipino</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {/* Only show when “Other” is selected */}
                {isOtherCitizenship && (
                  <div className="mt-2">
                    <Input
                      placeholder="Specify citizenship"
                      name="citizenship"
                      value={formData.citizenship}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Government IDs */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Government IDs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>GSIS</Label>
                <Input name="gsis_num" value={formData.gsis_num} onChange={handleChange} />
              </div>
              <div>
                <Label>Pag-IBIG</Label>
                <Input name="pagibig_num" value={formData.pagibig_num} onChange={handleChange} />
              </div>
              <div>
                <Label>PhilHealth</Label>
                <Input name="philhealth_num" value={formData.philhealth_num} onChange={handleChange} />
              </div>
              <div>
                <Label>SSS</Label>
                <Input name="sss_num" value={formData.sss_num} onChange={handleChange} />
              </div>
              <div>
                <Label>TIN</Label>
                <Input name="tin_num" value={formData.tin_num} onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Residential Address</h2>
            <AddressForm onAddressChange={handleAddressChange} />
          </section>

          {/* Contact Info */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Telephone Number</Label>
                <Input name="tel_no" value={formData.tel_no} onChange={handleChange} />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input name="mobile_no" value={formData.mobile_no} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <Label>Email Address</Label>
                <Input name="email_address" value={formData.email_address} onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="outline">Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddEmployee
