import React, { useState } from 'react';
import Image from 'next/image';
import Logo from "../images/ShopLogo.png";
import Link from 'next/link';
import { HomeIcon, Cog6ToothIcon, QueueListIcon, ShoppingBagIcon, ListBulletIcon, ArrowLeftOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

export default function Navbar({show}){
    const [showNav, setShowNav] = useState(false);
    const inactiveLink = "flex gap-6 p-6 py-4";
    const activeLink = 'flex gap-6 p-6 bg-blue-300 rounded-lg';
    const router = useRouter();
    const {pathname} = router;
    async function logout(){
        await router.push('/');
        await signOut();
    }
  return ( 
    <aside show={showNav} className={"p-4 mr-4 relative w-auto h-auto"}>
        <button onClick={() => setShowNav(true)}><Bars3Icon className="h-8 w-8"/></button>
        <Link href={"/"} className='flex items-center gap-2 mb-4'>
            <Image className='h-10 w-16' src={Logo} alt='Shop' />
            <p className='text-xl'>E-Commerce Shop</p>
        </Link>
        <nav className='flex flex-col gap-12 py-2 ml-4 px-2 rounded-lg bg-white'>
            <Link href={"/"} className={pathname === "/" ? activeLink : inactiveLink}>
                <HomeIcon className='h-6 w-6'/>
                <p>Dashboard</p>
            </Link>
            <Link href={"/products"} className={pathname.includes("/products") ? activeLink : inactiveLink}>
                <ShoppingBagIcon className='h-6 w-6'/>
                <p>Products</p>
            </Link>
            <Link href={"/categories"} className={pathname.includes("/categories") ? activeLink : inactiveLink}>
                <ListBulletIcon className='h-6 w-6'/>
                <p>Categories</p>
            </Link>
            <Link href={"/orders"} className={pathname.includes("/orders") ? activeLink : inactiveLink}>
                <QueueListIcon className='h-6 w-6'/>
                <p>Orders</p>
            </Link>
            <Link href={"/settings"} className={pathname.includes("/settings") ? activeLink : inactiveLink}>
                <Cog6ToothIcon className='h-6 w-6'/>
                <p>Setting</p>
            </Link>
            <button onClick={logout} className={inactiveLink}>
                <ArrowLeftOnRectangleIcon className='h-6 w-6'/>
                <p>Logout</p>
            </button>
        </nav>
    </aside>
  )
}

