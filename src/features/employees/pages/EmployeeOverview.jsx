import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone, ArrowLeft, FileText, Calendar, ClipboardList, TrendingUp, Award, Clock, User, Briefcase, MapPinned } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "@/api/axios"

const EmployeeOverview = () => {
  const { employee_id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await API.get(`/employee/with-postion/${employee_id}`);
        if (res.data) {
          setEmployee({
            ...res.data,
            trainings: res.data.trainings || [],
          });
        }
      } catch (err) {
        console.error("Failed to load employee:", err);
      }
    };

    fetchEmployee();
  }, [employee_id]);

  if (!employee)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading employee data...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate("/employees")}
          className="group hover:bg-emerald-50 border-emerald-200 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to List
        </Button>

        {/* Employee Header Card */}
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r from-white to-emerald-50/30">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              
              {/* Avatar + Info */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-emerald-100 shadow-md">
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                      {employee.f_name && employee.l_name
                        ? `${employee.f_name[0]}${employee.l_name[0]}`.toUpperCase()
                        : "N/A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-4 border-white"></div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {employee.f_name} {employee.l_name}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Briefcase className="h-4 w-4" />
                    <p className="text-lg font-medium">
                      {employee.position_name || "No position"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinned className="h-4 w-4" />
                    <p className="text-sm">
                      {employee.workstation_name || "No workstation assigned"}
                    </p>
                  </div>
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
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  CSC Form 212
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/employees/${employee_id}/leave-credits`)}
                  className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Leave Credits
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/employees/${employee_id}/empservice_record`)
                  }
                  className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Service Records
                </Button>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2 Columns Section */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          
          {/* Trainings Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Award className="h-5 w-5 text-emerald-700" />
                </div>
                <CardTitle className="text-xl text-gray-900">Recent Trainings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {employee.trainings && employee.trainings.length > 0 ? (
                <div className="space-y-4">
                  {employee.trainings.map((training, i) => (
                    <div 
                      key={i} 
                      className="p-4 rounded-lg border border-emerald-100 bg-gradient-to-r from-white to-emerald-50/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-semibold text-gray-900 flex-1">
                            {training.title || "No title"}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full whitespace-nowrap">
                            <Calendar className="h-3 w-3" />
                            {training.from_date && training.to_date
                              ? `${new Date(training.from_date).toLocaleDateString()} - ${new Date(training.to_date).toLocaleDateString()}`
                              : "No dates"}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                          {training.sponsor && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                              <User className="h-3 w-3" />
                              <span>{training.sponsor}</span>
                            </div>
                          )}
                          {training.level && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                              <Award className="h-3 w-3" />
                              <span>{training.level}</span>
                            </div>
                          )}
                          {training.hours && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                              <Clock className="h-3 w-3" />
                              <span>{training.hours} hrs</span>
                            </div>
                          )}
                          {training.participant_type && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                              <span>{training.participant_type}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No trainings available.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Phone className="h-5 w-5 text-emerald-700" />
                </div>
                <CardTitle className="text-xl text-gray-900">Contact Information</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors duration-200">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Mail className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {employee.email_address || "No email"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors duration-200">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Phone className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {employee.mobile_no || "No phone number"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors duration-200">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {employee.address.province
                      ? `${employee.address.province}, ${employee.address.municipality}`
                      : "No address on record"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EmployeeOverview