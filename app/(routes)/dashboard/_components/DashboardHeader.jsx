import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
        <div>
          <h2 className='font-semibold text-primary'>Manage Money, Manage Your Future!</h2>
        </div>
        <div>
            <UserButton/>
        </div>
    </div>
  )
}

export default DashboardHeader