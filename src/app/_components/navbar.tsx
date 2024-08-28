"use client"
import Link from "next/link";
import React, { useState } from "react";
import { endpoints } from "../helpers/url";
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
// import { error } from "console";

type PropTypes = {
    activeLink: string
}

export default function Navbar({ activeLink }: PropTypes) {

    const [loading, setLoading] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const router = useRouter();

    console.log(activeLink);

    const createRoom = async () => {
        setLoading(true);
        const url = endpoints.createRoom()
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
          .then(resData => {
            setLoading(false);
            console.log(resData, 29)
            router.push(`/code/${resData.data.room.id}`)
          })
          .catch(error => {
            console.log(error)
            throw new Error("Something went wrong!")
          })
    }

    return <nav className="bg-gray-800">
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button onClick={() => setShowMenu(!showMenu)} type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open main menu</span>
            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex flex-shrink-0 items-center">
            <Link className="text-2xl font-mono border-b-2 border-transparent hover:border-inherit" href="/">CodeNCode</Link>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
                <Link className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" href="/code">Online code editor</Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button onClick={createRoom} type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            {loading ? <>Creating room...</> : <>Create Room</>}
          </button>
          
        </div>
      </div>
    </div>

    {showMenu && <div className="sm:hidden" id="mobile-menu">
      <div className="space-y-1 px-2 pb-3 pt-2">
        <Link href="/code" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" >Online code editor</Link><br />
        <button onClick={createRoom} type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        {loading ? <>Creating room...</> : <>Create Room</>}
        </button>
      </div>
    </div>}
  </nav>
}