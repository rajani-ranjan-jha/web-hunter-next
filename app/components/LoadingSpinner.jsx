'use client'
import React, { useEffect, useState } from 'react'

const LoadingSpinner = () => {
    const [dot, setDot] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDot(prev => prev.length < 3 ? prev + '.' : '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center text-3xl gap-4'>
            <div className="animate-spin rounded-full h-15 w-15 border-b-2 border-white mx-auto mb-2"></div>
            {/* <p className="text-gray-300">Loading...</p> */}
            <p className="text-white">Loading{dot}</p>
        </div>
    )
}

export default LoadingSpinner
