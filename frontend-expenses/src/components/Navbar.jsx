import React from 'react'
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isProfile, setisProfile] = useState(false)
    const [user, setuser] = useState(null)
    const [info, setinfo] = useState({
        name: "",
        email: ""
    })
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/user/info');
                setuser(res.data)
                const { userName, email } = res.data;
                setinfo({ name: userName, email });
                console.log("info request sent")
            } catch {
                setuser(null)
            }
        }
        fetchUser()
    }, [])

    const profileRef = useRef()
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setisProfile(false)
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])

    const handleSignout = async () => {
        try {
            await api.post('/user/logout/');
            console.log("logged-out");
            setuser(null);
            window.location.href = "/";
        } catch (err) {
            console.log("Logout error:", err)
        }
    }

    return (
        <nav className="bg-white backdrop-blur-md border-b border-gray-200/50 text-gray-800 px-3 md:px-6 py-4 flex justify-between items-center sticky top-0 shadow-sm z-50">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                <span className='text-white'>💸</span> ExpenseTracker
            </h1>
            <ul className="flex space-x-2 md:space-x-8 items-center">
                <li>
                    <Link to="/" className="hover:text-blue-600 transition-colors duration-200 font-medium">
                        Home
                    </Link>
                </li>
                <li>
                    {user && (
                        <Link to="/transactions" className="hover:text-blue-600 transition-colors duration-200 font-medium">
                            Transactions
                        </Link>
                    )}
                </li>
                {!user && (
                    <Link to="/login" className="hover:text-blue-600 transition-colors duration-200 font-medium justify-center">
                        Login
                    </Link>
                )}
                <li>
                    <button
                        onClick={() => setisProfile(!isProfile)}
                        className="hover:text-blue-600 transition-colors w-[40px] duration-200 cursor-pointer p-2 hover:bg-blue-50 rounded-full"
                    >
                        <i className="fa-solid fa-user"></i>
                    </button>
                </li>
            </ul>
            {isProfile && user && (
                <div
                    ref={profileRef}
                    className="profileContainer bg-white/95 backdrop-blur-md shadow-xl border border-gray-200/50 fixed top-20 right-4 w-80 rounded-2xl px-5 py-4 animate-slide-down"
                >
                    <div className="flex items-center gap-4 mb-3">
                        <div className="pic h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {info.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="username font-semibold text-gray-800">{info.name}</span>
                            <span className="mail text-sm text-gray-500">{info.email}</span>
                        </div>
                    </div>
                    <button onClick={handleSignout} className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-full px-4 py-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer">
                        Sign Out
                    </button>
                </div>
            )}

        </nav>
    )
}

export default Navbar
