"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
function Header() {

  const {user,isSignedIn} = useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-md'>
        <Image src={'/logo.png'}
        alt='logo'
        width={150}
        height={150}
        />
        {isSignedIn?
        <UserButton/> : 
        <Link href={'/sign-in'}>
        <Button>Get Started</Button>
        </Link>
        }
    </div>
  )
}

export default Header