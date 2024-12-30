import { UserButton } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'
import React from 'react'

function DashboardHeader({ isOpen, setIsOpen }) {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between items-center bg-white'>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h2 className='font-semibold text-primary'>Manage Money, Manage Your Future!</h2>
        </div>
        <div>
            <UserButton/>
        </div>
    </div>
  )
}

export default DashboardHeader