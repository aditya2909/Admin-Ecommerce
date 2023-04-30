import Image from "next/image";
import Logo from "../images/Logo.png";
import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";


export default function Layout({children}) {
  const { data: session } = useSession();
  if(!session) {
    return (
      <div className={'bg-blue-300 flex items-center w-screen h-screen'}>
        <div className="w-full text-center flex items-center flex-col justify-center">
          <Image className="h-60 w-60" src={Logo} alt="Logo" />
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-md">Login with Google</button>
        </div>
      </div>
    );
      
  }
  return (
    <div className="bg-[#F0EEF6] min-h-screen">
      <div className="flex">
        <Navbar/>
        <div className="bg-white flex-grow p-4 mt-2 mr-2 rounded-lg">
          {children}
        </div>
      </div>
    </div>
  )
}
