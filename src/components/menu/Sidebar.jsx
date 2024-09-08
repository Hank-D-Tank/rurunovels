import React from 'react'
import logo from '../../assets/logo.png'
import { HiOutlineHomeModern } from 'react-icons/hi2'
import { IoLibraryOutline, IoLogInOutline, IoLogOutOutline } from 'react-icons/io5'
import { LiaHotjar, LiaPenNibSolid } from 'react-icons/lia'
import { TfiBookmarkAlt } from 'react-icons/tfi'
import { VscSettings } from 'react-icons/vsc'
import { NavLink, useLocation } from 'react-router-dom'

const Sidebar = ({ isOpen }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const menuItems = [
        {
            label: "Home",
            icon: <HiOutlineHomeModern />,
            url: "/",
        },
        {
            label: "Library",
            icon: <IoLibraryOutline />,
            url: "/library/filter?contentType=all",
        },
        {
            label: "Write A novel",
            icon: <LiaPenNibSolid />,
            url: user ? `/${user.uid}/all/novels` : `/user/all/novels`
            /* url: user ? `/${user.uid}/create/novel`: `/user/create/novel`, */
        },
        {
            label: "BookShelf",
            icon: <TfiBookmarkAlt />,
            url: "bookshelf/filter?contentType=all",
        },
        {
            label: user ? "Log Out" : "Log In",
            icon: user ? <IoLogOutOutline /> : <IoLogInOutline />,
            url: user ? "/logout" : "/login",
        },
    ];


    return (
        <div className={isOpen ? "sidebar sidebar-expanded" : "sidebar"}>
            <div className="sidebar-header">
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
                <div className="name"><p><b>Ruru</b></p><span>Novels</span></div>
            </div>
            <div className="sidebar-menu">
                {menuItems.map((menuItem, index) => (
                    <NavLink
                        key={index}
                        to={menuItem.url}
                        className={({isActive}) => (isActive ? "menu-item active" : "menu-item")}
                    >
                        <div className="menu-icon">{menuItem.icon}</div>
                        <div className="menu-link">{menuItem.label}</div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;















