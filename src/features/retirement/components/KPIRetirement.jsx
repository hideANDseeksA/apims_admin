import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import axios from 'axios'

const KPIRetirement = () => {
  const [retirementData, setRetirementData] = useState([])
  const [totalRetirements, setTotalRetirements] = useState(0)
  const [totalResgnations, setTotalResignations] = useState(0)
  const [totalEligibleRetirements, setTotalEligibleRetirements] = useState(0)


  const API_URL = import.meta.env.VITE_API_URL
  
  useEffect(() => {
    const fetchRetirements = async () => {
      try {
        const res = await axios.get(`${API_URL}/retirement/`);
        setRetirementData(res.data.data);
        setTotalRetirements(res.data.retired_count);
        setTotalEligibleRetirements(res.data.over60_active_count);
        setTotalResignations(res.data.resigned_count);
      } catch (error) {
        console.error("Error fetching retirement data:", error);
      }
    }

    fetchRetirements();
  }, [API_URL]);

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
              <p className='text-sm text-[#5A6F5A]'>Total Employee</p>
              <p className='text-[#2D5A2D] text-2xl font-semibold'>100</p>
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