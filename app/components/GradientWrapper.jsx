'use client'
import React, { useEffect, useState } from 'react'
import Navbar2 from './Navbar2'

const GradientWrapper = ({ children }) => {

    const [theme, setTheme] = useState();

    useEffect(() => {
        const local = localStorage.getItem('theme');
        if (local) {
            setTheme(local);
            document.body.className = local;
        } else {
            setTheme('light');
            document.body.className = 'light';
        }
    }, [])
    

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme);
        document.body.className = newTheme;
        localStorage.setItem('theme', newTheme);
    };


    return (
        <div className='min-h-screen transition-all duration-300 bg-gradient-to-br dark:from-gray-900 dark:via-purple-800 dark:to-gray-900 from-blue-500 via-purple-500 to-pink-500 text-white space-y-5'>
            <Navbar2 theme={theme} toggleTheme={toggleTheme} />
            <div className="">
                {children}
            </div>
        </div>
    )
}

export default GradientWrapper
