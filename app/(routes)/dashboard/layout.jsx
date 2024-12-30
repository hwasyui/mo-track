"use client"
import React, { useEffect, useState } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '@/utils/db'
import { Budgets } from '@/utils/db/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'

function DashboardLayout({children}) {
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useUser();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    user && checkUserBudgets();
  }, [user])

  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const checkUserBudgets = async () => {
    const result = await db.select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
    
    if(result?.length == 0) {
      router.replace('/dashboard/budgets')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="sticky top-0 h-screen">
        <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className="flex-1">
        <DashboardHeader isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="p-2 md:p-2">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout