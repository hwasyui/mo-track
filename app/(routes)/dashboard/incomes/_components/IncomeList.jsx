"use client"
import React, { useEffect, useState } from 'react'
import CreateIncome from './CreateIncome'
import { db } from '@/utils/db'
import { desc, eq, getTableColumns } from 'drizzle-orm'
import { Income } from '@/utils/db/schema'
import { useUser } from '@clerk/nextjs'
import IncomeItem from './IncomeItem'

function IncomeList() {
  const [incomeList, setIncomeList] = useState([]);
  const {user} = useUser();

  useEffect(() => {
    user && getIncomeList() 
  }, [user])

  const getIncomeList = async() => {
    const result = await db.select({
      ...getTableColumns(Income),
    }).from(Income)
    .where(eq(Income.createdBy, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Income.id));

    setIncomeList(result);
  }

  return (
    <div className='mt-7'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateIncome refreshData={()=>getIncomeList()}/>
        {incomeList?.length>0? incomeList.map((income,index)=>(
          <IncomeItem key={index} income={income} refreshData={getIncomeList}/>
        ))
        :[1,2,3,4,5].map((item,index)=>(
          <div key={index} className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'>
          </div>
        ))
        }
        </div>
    </div>
  )
}

export default IncomeList