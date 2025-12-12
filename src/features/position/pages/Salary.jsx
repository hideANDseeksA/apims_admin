import React from 'react'
import SalaryTranche from '../components/salary/SalaryTranche'

const Salary = () => {
  return (
    <div>
         <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">Salary Tranches Management</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Manage and Review Employee Salary Tranches</p>
        </div>

        <SalaryTranche/>
    </div>
  )
}

export default Salary

