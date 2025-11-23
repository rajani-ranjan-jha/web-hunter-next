"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { LucideDelete } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";

import { NotifyUser } from "../components/Notification";
import { SendData, UpdateData } from '../components/action.js';
import { allCategories } from "@/public/categories.js";
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '../components/LoadingSpinner';

const PORT = process.env.NEXTAUTH_URL;




const AdminPanel = () => {
    const router = useRouter()
    const location = typeof window !== 'undefined' ? window.location : { state: null };
    // const isToUpdate = location.state && location.state.id ? true : false
    const [isToUpdate, setIsToUpdate] = useState(false)
    // console.log(isToUpdate);
    // console.log(isToUpdate ? JSON.parse(sessionStorage.getItem('toUpdate')) : null);

    // Initialize state variables with location.state data if updating, else empty
    const [id, setId] = useState('')
    const [Name, setName] = useState('')
    const [Url, setUrl] = useState('')
    const [Description, setDescription] = useState('')
    const [Categories, setCategories] = useState([])
    // const [id] = useState(isToUpdate ? location.state.id : '')
    // const [Name, setName] = useState(isToUpdate ? location.state.name : '')
    // const [Url, setUrl] = useState(isToUpdate ? location.state.url : '')
    // const [Description, setDescription] = useState(isToUpdate ? location.state.description : '')
    // const [Categories, setCategories] = useState(isToUpdate ? (Array.isArray(location.state.tags) ? location.state.tags : []) : [])
    const [message, setMessage] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [categoryInput, setCategoryInput] = useState('')
    const [filteredCategories, setFilteredCategories] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)

    const isAdmin = useSelector(state => state?.admin?.status)
    const dispatch = useDispatch();
    const inputRef = useRef(null)
    const {data: session, status} = useSession()



    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            NotifyUser("Only Authorized people can access this page", false, 'top-center');
            router.push('/login');
            // return
            // window.alert("Only admins can access this page");
        }
    }, [session, status, router]);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const toUpdate = sessionStorage.getItem('toUpdate')
            if (toUpdate) {
                setIsToUpdate(true)
                const data = JSON.parse(toUpdate)
                setId(data.id)
                setName(data.name)
                setUrl(data.url)
                setDescription(data.description)
                setCategories(data.tags && Array.isArray(data.tags) ? data.tags : [])
            }
        }
    }, [])

    useEffect(() => {
        if (categoryInput.trim() === '') {
            setFilteredCategories(allCategories.filter(cat => !Categories.includes(cat)))
        } else {
            const filtered = allCategories.filter(cat =>
                cat.toLowerCase().includes(categoryInput.toLowerCase()) && !Categories.includes(cat)
            )
            setFilteredCategories(filtered)
        }
    }, [categoryInput, Categories])

    //
    async function Generate(url) {
        setIsPending(true)
        const res = await fetch(`/api/web/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        })
        const result = await res.json()
        const data = result.data
        if (!res.ok) {
            console.log("URL fetch failed:", result.message);
            return
        }
        if (result.error && result.error.length > 0) {
            NotifyUser(result.error, false, 'top-center')
            console.warn(result.error)
            setIsPending(false)
            return
        }
        // console.log(data)
        setName(data.title)
        setDescription(data.description)
        setIsPending(false)
    }
    //

    const handleCategoryInputChange = (e) => {
        setCategoryInput(e.target.value)
        setShowDropdown(true)
    }

    const handleCategorySelect = (category) => {
        setCategories(prev => [...prev, category])
        setCategoryInput('')
        setShowDropdown(false)
    }

    const handleCategoryRemove = (category) => {
        setCategories(prev => prev.filter(cat => cat !== category))
    }

    const handleClickOutside = (e) => {
        if (inputRef.current && !inputRef.current.contains(e.target)) {
            setShowDropdown(false)
        }
    }


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true)

        if (!Name.trim() || !Url.trim() || Categories.length === 0) {
            setMessage('Please fill all fields and select at least one category.')
            setIsPending(false)
            return
        }
        if (Description.length > 110) {
            NotifyUser('Your Description is too long!', false, 'top-center')
            setIsPending(false)

            return
        }

        if (isToUpdate) {
            // Prepare plain object for UpdateData
            const updatedData = {
                name: Name,
                url: Url,
                description: Description,
                tags: Categories
            }
            const result = await UpdateData(id, updatedData)
            if (result === true) {
                // setMessage('The data has been updated successfully !')
                NotifyUser('Data Updated!!', true, 'top-right', 3000)
                sessionStorage.removeItem('toUpdate');
            } else {
                setMessage(result)
                NotifyUser('Something Went Wrong!!', false, 'top-right')
            }
        } else {
            // Prepare FormData for SendData
            const siteData = new FormData()//taking the data from FORM structure
            siteData.append('name', Name)
            siteData.append('url', Url)
            siteData.append('description', Description)
            siteData.append('categories', JSON.stringify(Categories))
            const result = await SendData(siteData)//sending the data
            if (result.status) {
                setMessage('The data has been submitted!')
                NotifyUser('Data Added!!', true, 'top-right')

                // Clear form
                setName('')
                setUrl('')
                setDescription('')
                setCategories([])
            } else {
                setMessage(result.message)
                NotifyUser(result.message, false, 'top-right')

            }
        }
        setIsPending(false)
    }

    if(status =='loading'){
        return <><LoadingSpinner/></>
    }

    if(!session){
        return null;
    }


    return (
        <>
            <div className='w-full flex justify-center items-center py-25'>
                <Toaster />
                {/* md:w-8/12 sm:w-4/5 */}
                <form onSubmit={handleSubmit} className='py-15 flex flex-col justify-center items-center gap-4 rounded-2xl px-10 border-2 border-white'>
                    <div className='w-full flex justify-between items-center'>
                        <h1 className='text-4xl  text-center text-white'>The Admin Panel</h1>
                        <button
                            onClick={() => { Generate(Url) }}
                            className='bg-indigo-700 text-white dark:bg-white dark:hover:bg-white/80 dark:text-indigo-700 text-sm p-2 px-4 rounded-xl cursor-pointer disabled:opacity-50'
                            disabled={!Url && Url.length < 1}
                        >
                            {isPending ? 'Fetching..' : "Get a Hit"}
                        </button>

                    </div>
                    <div className=" p-10 h-full rounded-2xl flex flex-col text-white justify-center items-center gap-4">
                        <div className='w-full space-x-5 flex justify-between items-center'>
                            <label htmlFor="name">Site Name</label>
                            <input
                                className='p-2 border-2 border-white/70 focus:outline-none focus:border-white rounded-lg'
                                type="text"
                                onChange={(e) => { setName(e.target.value) }}
                                placeholder='Enter site name'
                                name="name"
                                value={Name}
                                required
                            />
                        </div>
                        <div className='w-full space-x-5 flex justify-between items-center'>
                            <label htmlFor="name">Site Url</label>
                            <input
                                className='p-2 border-2 border-white/70 focus:outline-none focus:border-white rounded-lg'
                                type="text"
                                onChange={(e) => { setUrl(e.target.value) }}

                                placeholder='Enter site url'
                                name="url"
                                value={Url}
                                required
                            />
                        </div>
                        <div className='w-full space-x-5 flex justify-between items-center'>
                            <label htmlFor="name">Site Description</label>
                            <textarea
                                className='p-2 border-2 border-white/70 focus:outline-none focus:border-white rounded-lg w-56'
                                onChange={(e) => {
                                    if (e.target.value.length < 110) {
                                        setDescription(e.target.value)
                                    } else {
                                        NotifyUser('Your Description is too long!', false, 'top-center')
                                    }
                                }}
                                placeholder='Description (if any)'
                                name="description"
                                value={Description}
                                rows="5">
                            </textarea>
                        </div>

                        <div className='relative w-full space-x-5 flex justify-between items-center' ref={inputRef}>
                            <label htmlFor="category">Select Category</label>
                            <div className='w-56 flex flex-wrap gap-1 p-2 border border-white/70 focus:outline-none focus:border-white rounded-xl text-white cursor-text ' onClick={() => setShowDropdown(true)}>
                                {Categories.map((category) => (
                                    <div key={category} className=' flex flex-wrap rounded-lg items-center gap-1 bg-indigo-600 text-sm px-2 py-1'>
                                        <span>{category}</span>
                                        <button
                                            type="button"
                                            className='text-sm text-white hover:bg-slate-500 cursor-pointer'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleCategoryRemove(category)
                                            }}
                                        >
                                            <LucideDelete className='w-5 h-5 ' />
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    name="category"
                                    className='w-0 border-white/70 focus:outline-none focus:border-white flex-grow'
                                    placeholder={`${Categories.length > 0 ? '' : 'Select category'}`}
                                    value={categoryInput}
                                    onChange={handleCategoryInputChange}
                                    onFocus={() => setShowDropdown(true)}
                                />
                            </div>
                            {showDropdown && filteredCategories.length > 0 && (
                                <ul className='absolute right-0 top-0 z-10 w-50 max-h-40 overflow-auto bg-white text-black rounded-xl shadow-lg'>
                                    {filteredCategories.map((category) => (
                                        <li
                                            key={category}
                                            className='p-2 cursor-pointer hover:bg-indigo-500 hover:text-white'
                                            onClick={() => handleCategorySelect(category)}
                                        >
                                            {category}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="w-full flex justify-center items-center gap-2">
                            <button
                                type="submit"
                                className='bg-indigo-700 text-white dark:bg-white dark:hover:bg-white/80 dark:text-indigo-700 text-md p-2 px-8 rounded-xl  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={isPending || !Name.trim() || !Url.trim() || Categories.length === 0}
                            >
                                {isPending ? (isToUpdate ? 'Updating...' : 'Adding...') : (isToUpdate ? 'Update Site' : 'Add Site')}
                            </button>
                        </div>

                        {message && (
                            <p id='message' className='text-white text-center mt-2'>{message}</p>

                        )}

                    </div>
                </form>
            </div>
        </>
    )
}

export default AdminPanel
