"use client";
import React, { useEffect } from 'react'
import Image from 'next/image'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
function SideNav() {
    const menuList =[
        {
            id:1,
            name:'Dashboard',
            icon:LayoutGrid,
            path:'/dashboard'
        },
        {
            id:2,
            name: 'Budgets',
            icon:PiggyBank,
            path:'/dashboard/budgets'
        },
        {
            id:3,
            name:'Expenses',
            icon:ReceiptText,
            path:'/dashboard/expenses'
        }
    ]
    const path=usePathname();
    useEffect(()=>{
        console.log
    })
  return (
    <div className='h-screen p-5 border shadow-sm'>
        <Image src={'/logo.png'}
        alt='logo'
        width={175}
        height={175}/>
        <div className='mt-5'>
            {menuList.map((menu,index)=>(
                <Link href={menu.path}>
                <h2 
                className={`flex gap-2 items-center 
                text-gray-500 font-medium p-5 mb-2
                cursor-pointer rounded-md hover:text-primary 
                hover:bg-hoverbg 
                ${path === menu.path ? 'text-primary bg-hoverbg' : ''}`}
                >
                    <menu.icon/>
                    {menu.name}
                </h2>
                </Link>
            ))}
        </div>
        <div className='fixed bottom-10 p-2 flex gap-2 items-center'>
            <UserButton/>
            Profile
        </div>
    </div>
  )
}

export default SideNav