import SidebarLayout from '@/components/SidebarLayout'
import { Card, CardContent } from '@/components/ui/card'
import React, { use, useState,useEffect } from 'react'
import EmployeeGraph from '../components/EmployeeGraph'
import EmployeeTable from '../components/EmployeeTable'
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import APIV2 from '@/api/axiosv2'


const Dashboard = () => {
    const [totalEmployee,setTotalEmployee]=useState(0)
    const [totalRetirements, setTotalRetirements] = useState(0)
    const [totalResgnations, setTotalResignations] = useState(0)
    const [totalEligibleRetirements, setTotalEligibleRetirements] = useState(0)
    
    useEffect(() => {
      const fetchRetirements = async () => {
        try {
          const res = await APIV2.get(`/analytics/summary`);
          setTotalEmployee(res.data.null_remarks_count)
          setTotalRetirements(res.data.retired_count);
          setTotalEligibleRetirements(res.data.age_60_and_above_with_null_remarks);
          setTotalResignations(res.data.resigned_count);
        } catch (error) {
          console.error("Error fetching retirement data:", error);
        }
      }
  
      fetchRetirements();
    }, );
  return (
 <div className='space-y-4 bg-[#F7F9F7] p-4'>
    
    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
      <Card className="shadow-lg border-0">
        <CardContent>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-[#5A6F5A]'>Total Employee</p>
              <p className='text-[#2D5A2D] text-2xl font-semibold'>{totalEmployee}</p>
            </div>

            <div className='rounded-lg bg-[#7CB342]/20 p-3'>
              <Users className='h-6 w-6 text-[#2D5A2D]'/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardContent>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-[#5A6F5A]'>Total Retired</p>
              <p className='text-[#2D5A2D] text-2xl font-semibold'>{totalRetirements}</p>
            </div>

            <div className='rounded-lg bg-[#7CB342]/20 p-3'>
              <UserCheck className='h-6 w-6 text-[#2D5A2D]'/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardContent>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-[#5A6F5A]'>Total Resigned</p>
              <p className='text-[#2D5A2D] text-2xl font-semibold'>{totalResgnations}</p>
            </div>

            <div className='rounded-lg bg-[#7CB342]/20 p-3'>
              <UserX className='h-6 w-6 text-[#2D5A2D]'/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardContent>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-[#5A6F5A]'>Total Eligble Retired</p>
              <p className='text-[#2D5A2D] text-2xl font-semibold'>{totalEligibleRetirements}</p>
            </div>

            <div className='rounded-lg bg-[#7CB342]/20 p-3'>
              <Clock className='h-6 w-6 text-[#2D5A2D]'/>
            </div>
          </div>
        </CardContent>
      </Card>
      
    </div>
    <div>
      <EmployeeGraph/>
    </div>
      <div className='max-h-[10px]'> 
      <EmployeeTable/>
    </div>
    </div>
  )
}

export default Dashboard