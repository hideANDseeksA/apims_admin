import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import APIV2 from '@/api/axiosv2'

const KPIRetirement = () => {
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
     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
      <Card className="shadow-lg border-0">
        <CardContent>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-[#5A6F5A]'>Eligible to Retire</p>
              <p className='text-[#2D5A2D] text-2xl font-semibold'>{totalEligibleRetirements}</p>
            </div>

            <div className='rounded-lg bg-[#7CB342]/20 p-3'>
              <TrendingUp className='h-6 w-6 text-[#2D5A2D]'/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardContent>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-[#5A6F5A]'>Total Retired Personel</p>
              <p className='text-[#2D5A2D] text-2xl font-semibold'>{totalRetirements}</p>
            </div>

            <div className='rounded-lg bg-[#7CB342]/20 p-3'>
              <TrendingUp className='h-6 w-6 text-[#2D5A2D]'/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardContent>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-[#5A6F5A]'>Total Resign Personel</p>
              <p className='text-[#2D5A2D] text-2xl font-semibold'>{totalResgnations}</p>
            </div>

            <div className='rounded-lg bg-[#7CB342]/20 p-3'>
              <TrendingUp className='h-6 w-6 text-[#2D5A2D]'/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardContent>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-[#5A6F5A]'>Total Active Employee</p>
              <p className='text-[#2D5A2D] text-2xl font-semibold'>{totalEmployee}</p>
            </div>

            <div className='rounded-lg bg-[#7CB342]/20 p-3'>
              <TrendingUp className='h-6 w-6 text-[#2D5A2D]'/>
            </div>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}

export default KPIRetirement