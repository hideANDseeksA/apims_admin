import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "@/api/axios" // <-- your axios instance

const EmployeeOverview = () => {
  const { employee_id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await API.get(`/employee/personal_info/${employee_id}`)
        setEmployee(res.data)
      } catch (err) {
        console.error("Failed to load employee:", err)
      }
    }

    fetchEmployee()
  }, [employee_id])

  if (!employee)
    return (
      <div className="p-6 text-gray-500">
        No employee data found.
      </div>
    )

  return (
    <div className="space-y-6 bg-[#F7F9F7] p-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate("/employees")}>
        ← Back to List
      </Button>

      {/* Employee Header Card */}
      <Card>
        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6">
          
          {/* Avatar + Info */}
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl">
                {employee.f_name && employee.l_name
                  ? `${employee.f_name[0]}${employee.l_name[0]}`.toUpperCase()
                  : "N/A"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-semibold text-[#1A3A1A]">
                {employee.f_name} {employee.m_name} {employee.l_name}
              </h2>
              <p className="text-muted-foreground text-base">
                {employee.position_name || "No position"}
              </p>
              <p className="text-sm text-gray-500">
                {employee.workstation_name || "—"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() =>
                navigate(`/employees/${employee_id}/edit`, {
                  state: {
                    employeeName: `${employee.f_name} ${employee.m_name} ${employee.l_name}`,
                  },
                })
              }
            >
              CSC Form 212
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/employees/${employee_id}/leave-credits`)}
            >
              Leave Credits
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                navigate(`/employees/${employee_id}/empservice_record`)
              }
            >
              Service Records
            </Button>

            <Button variant="outline">
              Performance Rating
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2 Columns Section */}
      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        
        {/* Trainings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trainings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title:
                  "International Training and Seminar on Non-Teaching Personnel Development",
                date: "June 12, 2023",
                branch: "Jakarta, Indonesia",
              },
              {
                title: "Regional HR Enhancement Workshop",
                date: "March 5, 2023",
                branch: "Quezon City",
              },
              {
                title: "Digital Transformation Seminar",
                date: "January 20, 2023",
                branch: "DepEd Central Office",
              },
            ].map((training, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <p className="font-medium w-[70%]">{training.title}</p>
                  <p className="text-muted-foreground">{training.date}</p>
                </div>
                <p className="text-xs text-gray-500">{training.branch}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{employee.email_address || "No email"}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{employee.mobile_no || "No phone number"}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>
                {employee.province
                  ? `${employee.province}, ${employee.municipality}`
                  : "No address on record"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeOverview
