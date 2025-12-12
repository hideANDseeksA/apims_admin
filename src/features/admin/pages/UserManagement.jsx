
import React from 'react'
import UserManagementTable from '../components/UserManagementTable'

const Retirements = () => {
  return (
 
      <div className='space-y-4 bg-[#F7F9F7]'>
        <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">User Management</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Manage and Review Users</p>
        </div>

       
    <UserManagementTable/>
      </div>
  
  )
}

export default Retirements