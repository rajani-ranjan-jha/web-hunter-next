
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { DeleteData } from './action';
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Card = ({
    id,
    name,
    url,
    description,
    tags,
    onChange,


}) => {

    const isAdmin = useSelector(state => state.admin.status)
    const router = useRouter()
    const {data: session} = useSession()
    const [bookmarks, setBookmarks] = useState([])
    const [isBookmarked, setIsBookmarked] = useState(false)

    // Function to delete data from server
    const handleDelete = async (id) => {
        const result = await DeleteData(id)
        if (result) {
            onChange()
            console.info("Data deleted successfully");
        }
    }


    //Sending the data to ADMIN-PANEL to update
    const handleUpdate = () => {
        try {
            sessionStorage.setItem('toUpdate', JSON.stringify({id, name, url, description, tags}));
            router.push(`/admin-panel/`)
        } catch (error) {
           console.error(error);
           return;
        }
    }


    const handleBookmark = (id) => {
        if(!session){
            window.alert("Please sign in to manage bookmarks");
            return;
        }
        try {
            const storedBookmarks = localStorage.getItem('web-hunter-bookmarks');
            let bookmarkArray = storedBookmarks ? JSON.parse(storedBookmarks) : [];

            const index = bookmarkArray.findIndex(item => item.id === id);
            if (index !== -1) {
                // Remove bookmark
                bookmarkArray.splice(index, 1);
                setIsBookmarked(false);
                window.alert("Bookmark removed");
            } else {
                // Add bookmark
                const newVal = {
                    id: id,
                    title: name
                };
                bookmarkArray.push(newVal);
                setIsBookmarked(true);
                window.alert("Bookmark added");
            }

            localStorage.setItem('web-hunter-bookmarks', JSON.stringify(bookmarkArray));
            setBookmarks(bookmarkArray);

        } catch (error) {
            console.error("Error during bookmark operation:", error);
        }
    };

    useEffect(() => {
        const storedBookmarks = localStorage.getItem('web-hunter-bookmarks');
        if (storedBookmarks) {
            const parsedBookmarks = JSON.parse(storedBookmarks);
            setBookmarks(parsedBookmarks);
            const isBookmarkedNow = parsedBookmarks.some(item => item.id === id);
            setIsBookmarked(isBookmarkedNow);
        }
    }, [id]);

    return (
        <div className='w-80 h-100 flex flex-col gap-2 justify-between items-center backdrop-blur-2xl transition-all duration-300 hover:translate-x-0 hover:translate-y-0 hover:scale-103 hover:shadow-indigo-500 dark:hover:shadow-white shadow-lg  rounded-xl  text-white p-4 border-1'>

            {isAdmin && (
                <div className='w-full flex gap-2 justify-end items-center'>
                    <button onClick={handleUpdate} className='bg-white/5 hover:bg-white/20  text-yellow-400 px-2 py-1 rounded-xl transition-colors text-sm'>
                        Update
                    </button>
                    <button onClick={() => handleDelete(id)} className='bg-white/5 hover:bg-white/20 text-red-500 px-2 py-1 rounded-xl  transition-colors text-sm'>
                        Delete
                    </button>
                </div>
            )}

            <div className='w-full flex gap-2 justify-end items-center'>
                <button onClick={() => { handleBookmark(id) }} className='hover:bg-white/20 cursor-pointer p-2 rounded-md transition-all'>
                    {isBookmarked ? <BookmarkCheck /> : <Bookmark />}
                </button>
            </div>

            <div id='' className='w-full flex justify-center mx-auto items-center text-center'>
                <img
                    className='w-5'
                    src={`https://www.google.com/s2/favicons?domain=${url}`}
                    alt={`${url}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/default-favicon.ico'; }}
                />
                <h3 className='p-2 text-2xl text-wrap font-semibold'>{name}</h3>
            </div>

            <div className='w-full flex justify-around items-center text-center '>
                {description && description.length > 0 ? (
                    <p id='description' className='px-3 text-md'>{description}</p>
                ) : (
                    <p className='px-3 text-md'>No description available</p>
                )}
            </div>

            <div className='w-full flex flex-wrap justify-center gap-2'>
                {tags && tags.length > 0 ? (
                    tags.map((tag, index) => (
                        <Link href={`${tag.toLowerCase().replace(/\s+/g, '-')}`} key={index} className='bg-white/5 text-white px-2 py-1 rounded-xl text-sm'>
                            {tag}
                        </Link>
                    ))
                ) : (
                    <p>No tags available</p>
                )}
            </div>

            <div className='w-full flex justify-around items-center gap-2 '>
                <a className='px-6 py-1 border-b hover:border border-white/50 rounded-xl text-white text-md transition-all duration-200'
                    href={`${url.includes('https://') ? url : "https://" + url}`} target="_blank" rel="noopener noreferrer">Visit</a>
            </div>

        </div >
    )
}

export default Card
