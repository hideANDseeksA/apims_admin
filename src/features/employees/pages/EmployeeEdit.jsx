import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useRef, useEffect, useState } from "react"
import FamilyTab from "../components/FamilyTab"
import EducationTab from "../components/EducationTab"
import PersonalTab from "../components/PersonalTab"
import EligibilityTab from "../components/EligibilityTab"
import PublicationTab from "../components/PublicationTab"
import InvolvementTab from "../components/InvolvementTab"
import TrainingsTab from "../components/TrainingsTab"
import MembershipTab from "../components/MembershipTab"
import ScholarshipTab from "../components/ScholarshipTab"
import RecognitionTab from "../components/RecognitionTab"
import ResearchInnovationTab from "../components/ResearchInnovationTab"
import SkillsTab from "../components/SkillsTab"
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Users, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Award, 
  Newspaper, 
  ShieldCheck, 
  Gift, 
  Trophy, 
  Lightbulb, 
  Wrench 
} from "lucide-react"

const EmployeeEdit = () => {
  const { employee_id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const employeeName = location.state?.employeeName || "Employee"
  const tabsListRef = useRef(null)
  const [hoveredTab, setHoveredTab] = useState(null)
  const [activeTab, setActiveTab] = useState("personal")

  useEffect(() => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollLeft = 0
    }
  }, [])

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const tabs = [
    { value: "personal", label: "Personal", icon: User },
    { value: "family", label: "Family", icon: Users },
    { value: "education", label: "Education", icon: GraduationCap },
    { value: "involvement", label: "Involvement", icon: Briefcase },
    { value: "trainings", label: "Trainings", icon: BookOpen },
    { value: "eligibility", label: "Eligibility", icon: ShieldCheck },
    { value: "publication", label: "Publication", icon: Newspaper },
    { value: "membership", label: "Membership", icon: Users },
    { value: "scholarship", label: "Scholarship", icon: Gift },
    { value: "recognition", label: "Recognition", icon: Trophy },
    { value: "research_innovation", label: "Research & Innovation", icon: Lightbulb },
    { value: "skills", label: "Skills", icon: Wrench }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/employees/${employee_id}`)}
            className="group hover:bg-white/80 transition-all duration-200 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Overview
          </Button>

          <div className="flex items-start gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 truncate">
                {employeeName}
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  CSC Form 212
                </span>
                <span className="hidden sm:inline">Personal Data Sheet</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              {/* Icon Navigation Bar */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 via-green-700 to-green-600 shadow-lg">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-green-800 scrollbar-track-green-700">
                  <TabsList
                    ref={tabsListRef}
                    className="inline-flex w-full min-w-max h-auto bg-transparent p-2 gap-1"
                  >
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          onMouseEnter={() => setHoveredTab(tab.value)}
                          onMouseLeave={() => setHoveredTab(null)}
                          className="
                            relative
                            group
                            flex
                            flex-col
                            items-center
                            justify-center
                            min-w-[70px]
                            px-3
                            py-3
                            gap-1
                            text-white/70
                            hover:text-white
                            data-[state=active]:text-white
                            data-[state=active]:bg-white/20
                            hover:bg-white/10
                            rounded-lg
                            transition-all
                            duration-300
                            ease-in-out
                            backdrop-blur-sm
                          "
                        >
                          <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:scale-110" />
                          <span className="text-[10px] font-medium whitespace-nowrap transition-opacity duration-300">
                            {tab.label}
                          </span>
                          
                          {/* Active Indicator */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-white rounded-full transition-all duration-300 group-data-[state=active]:w-3/4" />
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <TabsContent value="personal" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "personal"} hidden={activeTab !== "personal"}>
                    {activeTab === "personal" && <PersonalTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="family" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "family"} hidden={activeTab !== "family"}>
                    {activeTab === "family" && <FamilyTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="education" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "education"} hidden={activeTab !== "education"}>
                    {activeTab === "education" && <EducationTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="involvement" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "involvement"} hidden={activeTab !== "involvement"}>
                    {activeTab === "involvement" && <InvolvementTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="trainings" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "trainings"} hidden={activeTab !== "trainings"}>
                    {activeTab === "trainings" && <TrainingsTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="eligibility" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "eligibility"} hidden={activeTab !== "eligibility"}>
                    {activeTab === "eligibility" && <EligibilityTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="publication" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "publication"} hidden={activeTab !== "publication"}>
                    {activeTab === "publication" && <PublicationTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="membership" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "membership"} hidden={activeTab !== "membership"}>
                    {activeTab === "membership" && <MembershipTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="scholarship" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "scholarship"} hidden={activeTab !== "scholarship"}>
                    {activeTab === "scholarship" && <ScholarshipTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="recognition" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "recognition"} hidden={activeTab !== "recognition"}>
                    {activeTab === "recognition" && <RecognitionTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="research_innovation" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "research_innovation"} hidden={activeTab !== "research_innovation"}>
                    {activeTab === "research_innovation" && <ResearchInnovationTab employeeId={employee_id} />}
                  </TabsContent>

                  <TabsContent value="skills" className="mt-0 focus-visible:outline-none focus-visible:ring-0" forceMount={activeTab === "skills"} hidden={activeTab !== "skills"}>
                    {activeTab === "skills" && <SkillsTab employeeId={employee_id} />}
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeEdit