
import React from 'react'
import RetirementTable from '../components/RetirementTable'
import KPICards from '../components/KPIRetirement'

const Retirements = () => {
  return (
 
      <div className='space-y-4 bg-[#F7F9F7]'>
        <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">Retirement Management</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Manage and Review Employee</p>
        </div>

       
    <KPICards/>
    <RetirementTable/>
      </div>
  
  )
}

export default Retirements