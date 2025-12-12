
import React from 'react'
import PositionTable from '../components/position/PositionTable'

const Position = () => {

  return (
    <div className='space-y-5'>
        <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">Position Management</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Manage and Review Positions</p>
        </div>
        <PositionTable />
    </div>
  )
}

export default Position