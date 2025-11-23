"use client"
import React, { useState, useEffect } from 'react'
import { signIn, useSession } from "next-auth/react";
import { LucideEye, LucideEyeClosed } from 'lucide-react'

import { Toaster } from 'react-hot-toast'

import { NotifyUser } from '../components/Notification.jsx'
import { useRouter } from 'next/navigation.js'
import Link from 'next/link.js';

const Login = () => {
    // Login States
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    // Show Password
    const [showPassword, setShowPassword] = useState(false);

    const { data: session } = useSession();
    const user = session?.user;

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            NotifyUser("Please enter email and password", false, 'top-right', 2000)
            return
        }
        setIsPending(true)
        const result = await signIn("credentials", { email, password, redirect: false })
        if (result?.error) {
            NotifyUser(result.error, false, 'top-right', 4000)
        } else {
            router.push('/')
        }
        setIsPending(false)
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className='py-25 min-h-screen flex flex-col justify-center items-center'>
            <Toaster />
            <div className='border-2 border-white bg-white/5 lg:h-9/10 w-100 flex flex-col justify-center items-center gap-4 rounded-2xl p-5'>
                <h1 className='text-4xl text-center'>Login</h1>
                <div className='flex flex-row justify-center items-center gap-4 rounded-3xl'>
                    <button
                        className='flex justify-center items-center gap-2 px-2 py-1 border-1 rounded-md cursor-pointer hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={async () => await signIn("google")}
                        disabled={isPending}
                    >
                        <img className='w-5' src="/google.svg" alt="google" />
                        <span>Google</span>
                    </button>
                    <button
                        className='flex justify-center items-center gap-2 px-2 py-1 border-1 rounded-md cursor-pointer hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={async () => await signIn("facebook")}
                        disabled={isPending}
                    >
                        <img className='w-5' src="/facebook.svg" alt="facebook" />
                        <span>Facebook</span>
                    </button>
                </div>
                <div className='w-full flex items-center justify-center'>
                    <div className='flex-1 h-px bg-white/30'></div>
                    <span className='px-4 text-white/70'>or</span>
                    <div className='flex-1 h-px bg-white/30'></div>
                </div>
                <form onSubmit={handleSubmit} className='p-10 flex flex-col justify-center items-center gap-4 rounded-xl w-full max-w-md'>
                    <input
                        name="email"
                        className='w-full p-2 border-2 border-white focus:outline-none focus:border-white rounded-lg'
                        type="email"
                        onChange={(e) => { setemail(e.target.value) }}
                        placeholder='Enter email'
                        value={email}
                        required
                    />
                    <div className='relative w-full'>
                        <input
                            name="password"
                            className='w-full p-2 border-2 border-white focus:outline-none focus:border-white rounded-lg'
                            type={`${showPassword ? "text" : "password"}`}
                            onChange={(e) => { setpassword(e.target.value) }}
                            placeholder='Enter password'
                            value={password}
                            required
                        />
                        {password && (
                            <span onClick={toggleShowPassword} className='absolute right-4 top-3 cursor-pointer'>
                                {showPassword ? <LucideEye className='w-5' /> : <LucideEyeClosed className='w-5' />}
                            </span>
                        )}
                    </div>

                    <div>
                        Don't have an account? <Link href='/register' className='text-white cursor-pointer underline'>Register</Link>
                    </div>
                    <button
                        className='text-blue-500 bg-white dark:hover:bg-white/80 dark:text-indigo-700 text-md p-2 px-8 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                        type='submit'
                        disabled={isPending || !email || !password}
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
