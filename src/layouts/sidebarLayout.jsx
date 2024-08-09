import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { removeUser } from '../redux/user/user';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import icon from '../assets/Icon/logo-light.png'
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StarIcon from '@mui/icons-material/Star';
import AdUnitsIcon from '@mui/icons-material/AdUnits';

const SidebarLayout = () => {
    const { collapseSidebar, collapsed } = useProSidebar();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()
    const CustomMenuItem = styled(MenuItem)({
        color: '#79819C',
        '&:hover': {
            color: '#00000',
            backgroundColor: 'transparent'
        },
    });
    return (
        <div className='flex min-h-screen'>
            <Sidebar >
                <div className='w-full flex justify-center '>
                    <div className='w-[202px] h-[70px] px-14 py-5'>
                        <img src={icon} height={19} />
                    </div>
                </div>
                <Menu>
                    <CustomMenuItem
                        onClick={() => {
                            navigate("/dashboards");
                        }}
                        style={{
                            fontWeight: location.pathname.includes('dash    boards') ? 'bold' : 'normal',
                            color: location.pathname.includes('dashboards') ? '#ffffff' : '#79819C',
                            fontSize: "13px"
                        }}
                    >
                        <div className='flex items-center'>
                            <HomeIcon style={{ marginRight: '8px' }} />
                            Dashboard
                        </div>
                    </CustomMenuItem>
                    <CustomMenuItem
                        onClick={() => {
                            navigate("/chapters");
                        }}
                        style={{
                            fontWeight: location.pathname.includes('chapters') ? 'bold' : 'normal',
                            color: location.pathname.includes('chapters') ? '#ffffff' : '#79819C',
                            fontSize: "13px"
                        }}
                    >
                        <div className='flex items-center'>
                            <LibraryBooksIcon style={{ marginRight: '8px' }} />
                            Chapter
                        </div>
                    </CustomMenuItem>
                    <CustomMenuItem
                        onClick={() => {
                            navigate("/levels");
                        }}
                        style={{
                            fontWeight: location.pathname.includes('level') ? 'bold' : 'normal',
                            color: location.pathname.includes('level') ? '#ffffff' : '#79819C',
                            fontSize: "13px"
                        }}
                    >
                        <div className='flex items-center'>
                            <StarIcon style={{ marginRight: '8px' }} />
                            Level
                        </div>
                    </CustomMenuItem>
                    <CustomMenuItem
                        onClick={() => {
                            navigate("/user-device");
                        }}
                        style={{
                            fontWeight: location.pathname.includes('user-device') ? 'bold' : 'normal',
                            color: location.pathname.includes('user-device') ? '#ffffff' : '#79819C',
                            fontSize: "13px"
                        }}
                    >
                        <AdUnitsIcon style={{ marginRight: '8px' }} />
                        User Devices
                    </CustomMenuItem>
                    <CustomMenuItem
                        icon={<LogoutRoundedIcon />}
                        onClick={() => {
                            navigate("/signin")
                            dispatch(removeUser())
                        }}
                        > Logout </CustomMenuItem>
                </Menu>
            </Sidebar>
            <Outlet />
            {/* <main style={{ flexGrow: 1, padding: '20px' }}>
                <h1>Main Content</h1>
            </main> */}
        </div>
    );
};

export default SidebarLayout;