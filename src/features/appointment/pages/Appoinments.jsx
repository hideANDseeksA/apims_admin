import React from 'react'
import AppointmentTable from '../components/appointment/AppointmentTable'

const Appointments = () => {
  return (
    <div className='space-y-2'>
        <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">Appointments</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Manage and Review Appointments</p>
        </div>
        <AppointmentTable/>
    </div>
        
  )
}

export default Appointments