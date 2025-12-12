import React from 'react'
import ContractTable from '../components/contract/ContractTable'

const Contracts = () => {
  return (

    <div className='space-y-2'>
        <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">Contracts</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Manage and Review Contracts</p>
        </div>
        <ContractTable />
    </div>
  )
}

export default Contracts