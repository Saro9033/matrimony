import React from 'react'
import BottomMenuItems from './BottomMenuItems'
import { GoHomeFill } from "react-icons/go";
import './BottomMenu.css'
import { GoHome } from "react-icons/go";
import { useSelector } from 'react-redux';
import { loginAuthUser, loginIsAuthenticated } from '../../slices/authSlice';
import { FaRegUserCircle } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";

const BottomMenu = () => {
    const LoginIsAuthenticated = useSelector(loginIsAuthenticated);
    const user = useSelector(loginAuthUser);

    return (
        <>
            {LoginIsAuthenticated &&

                <div className='lg:hidden'>
                    <div className='bottomMenu '>
                        <ul id='menu' className='p-0 px-2 m-0'>
                          {  (user?.role === "user") ?
                            <>
                                <BottomMenuItems link={'/'} icon={GoHome} iconActive={GoHomeFill} title="HOME" />

                                {/* <BottomMenuItems link={'/my-orders'} icon={BsBoxSeam} iconActive={BsBoxSeamFill} title="ORDERS" />
                            <BottomMenuItems link={'/requests'} icon={RiGitPullRequestLine} iconActive={RiGitPullRequestFill} title="REQUESTS" />
                            <BottomMenuItems link={'/cart'} icon={PiShoppingCartSimpleLight} iconActive={PiShoppingCartSimpleDuotone} cart={true} title="CART" />*/}
                                <BottomMenuItems link={'/profile-settings'} icon={FaRegUserCircle} iconActive={FaUserCircle} title="PROFILE" />
                            </>
                            :(user?.role === "admin") &&
                            <div className='w-full flex justify-between' style={{ overflow: 'auto', scrollbarWidth: 'none' }}>
                                <BottomMenuItems isAdmin={true} link={'/admin/dashboard'} icon={MdOutlineDashboard} iconActive={MdDashboard} title="DASHBOARD" />
                                <BottomMenuItems isAdmin={true} link={'/admin/users'} icon={FaRegUserCircle} iconActive={FaUserCircle} title="USERS" />
                                <BottomMenuItems isAdmin={true} button={true} icon={IoIosLogOut} iconActive={IoLogOut} title="LOGOUT" />
                            </div>}
                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

export default BottomMenu