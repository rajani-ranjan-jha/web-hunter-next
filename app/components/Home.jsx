"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import { Toaster } from 'react-hot-toast';
import Card from "./Card.jsx";
import Pagination from "./Pagination.jsx";
import { NotifyUser } from './Notification.jsx'
import { useSelector, useDispatch } from "react-redux"
import { allCategories } from '@/public/categories.js'
import Navbar from "./Navbar.jsx";
import { useParams } from "next/navigation.js";
import { setWebData, setLoading, setError } from '../redux/webSlice'

const PORT = process.env.NEXTAUTH_URL || "http://localhost:3000";


const Home = () => {


    const dispatch = useDispatch()

    // universal-parameters
    const [WebData, setWebData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [loading, setLoading] = useState(true);

    const params = useParams()
    const PageNumber = params?.pageId?.split('-')[1] || null

    useEffect(() => {
      getDataFromServer()
    }, [])
    



 

    const getDataFromServer = async () => {
        try {
            const req = await fetch(`/api/web`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const res = await req.json();
            if (!res) {
                console.log("No data found from the server!");

                return;
            }
            console.warn("Data fetched from server:", res);
            setWebData(res);
            setFilteredData(res);
            setLoading(false);
            setNoResults(false)
        } catch (error) {
            console.log("Error fetching data from server:", error);
            dispatch(setError(error.message));
        }
    };



    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        if (value && value.length > 0) {
            const filtered = filteredData.filter(
                (obj) =>
                    obj.name.toLowerCase().includes(value) ||
                    obj.tags.some((tag) => tag.toLowerCase().includes(value))
            );
            if (filtered && filtered.length > 0) {
                setNoResults(false)
                setWebData(filtered);
            }
            else setNoResults(true)
        } else {
            setWebData(filteredData);
        }
    };

    const handleSortBy = (e) => {
        const value = e.target.value;
        if (value && value.length > 0) {
            let sorted = [];
            if (value === "a-z") {
                sorted = [...filteredData].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            } else if (value === "z-a") {
                sorted = [...filteredData].sort((a, b) =>
                    b.name.localeCompare(a.name)
                );
            }
            else if (value === "new-old") {
                sorted = [...filteredData].sort((a, b) =>
                    b.createdAt.localeCompare(a.createdAt)
                );
            }
            else if (value === "old-new") {
                sorted = [...filteredData].sort((a, b) =>
                    a.createdAt.localeCompare(b.createdAt)
                );
            }
            else {
                sorted = filteredData.filter(
                    (obj) =>
                        obj.tags.some((tag) => tag.toLowerCase() === value)
                );
            }
            // console.log(sorted);
            if (sorted && sorted.length > 0) {
                setNoResults(false)
                setWebData(sorted);
            } else setNoResults(true)
            
        }
    };


    // Data is now fetched once and stored in Redux to avoid redundant fetches
    



    // useEffect(() => {
    //     getDataFromServer();
    // }, [rerender]);



    // New function to handle data change notification from Card
    const handleReloadAfterDeletion = () => {
        NotifyUser('Data deleted', true, 'top-center')
        getDataFromServer();
    };


    // pagination-parameters
    var [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(30);
    // const cardsPerPage = 30;

    const totalCards = WebData?.length;
    const totalPages = Math.ceil(totalCards / cardsPerPage);

    // Validate currentPage to be within range
    if (currentPage < 1 || currentPage > totalPages) {
        currentPage = 1;
    }

    const endIndex = currentPage * cardsPerPage;
    const startIndex = endIndex - cardsPerPage;
    // console.log(startIndex, endIndex)
    const currentCards = WebData?.slice(startIndex, endIndex) || [];

    useEffect(() => {
        setCurrentPage(parseInt(PageNumber) || 1)
    //   console.log(params);
    }, [])
    


    if (loading) {
    return (
      <div className="text-4xl w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-cyan-300 via-indigo-400 to-cyan-300 dark:from-indigo-900 dark:via-cyan-800 dark:to-indigo-900 dark:text-white text-black">
        <div className="animate-spin rounded-full h-15 w-15 border-b-2 border-white mx-auto mb-2"></div>
        <p className="text-gray-300">Loading..</p>
      </div>

    )
  }


    return (
        <>
            <Navbar />
            <div className="w-full flex flex-col justify-center items-center bg-gradient-to-r from-cyan-300 via-indigo-400 to-cyan-300 dark:from-indigo-900 dark:via-cyan-800 dark:to-indigo-900 dark:text-white text-black">
                <Toaster />

                {WebData && WebData?.length > 0 &&
                    (<>
                            <div className="my-10 w-full flex md:flex-row flex-col justify-center items-center gap-5">
                                <input
                                    className="p-2 border border-violet-600 dark:border-white focus:outline-none focus:shadow-md focus:shadow-violet-600 dark:focus:shadow-white rounded-xl "
                                    type="text"
                                    placeholder="Search by name or tag"
                                    onChange={handleSearch}
                                />
                                <select className="text-white p-2 border border-violet-600 dark:border-white focus:outline-none focus:shadow-md focus:shadow-violet-600 dark:focus:shadow-white rounded-xl"
                                    name="category"
                                    id="category"
                                    onChange={handleSearch}>
                                    <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="">===Select Category===</option>
                                    {allCategories.map((category, index) => (
                                        <option key={index} className="text-indigo-700 dark:bg-black hover:bg-white/50" value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full md:w-4/5 mx-auto border-b-2 pb-5 mt-5 flex justify-around items-center">
                                <span className="justify-self-start text-white font-semibold">Total - {totalCards}</span>
                                {/* <button className="bg-white/10 hover:bg-white/50 px-4 py-2 rounded-md">Sort By</button> */}
                                <select
                                    className="text-white p-2 border border-violet-600 dark:border-white focus:outline-none rounded-xl"
                                    name="sort"
                                    id="sort"
                                    onClick={handleSortBy}>
                                    <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="a-z">Sort By</option>
                                    <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="new-old">New-Old</option>
                                    <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="old-new">Old-New</option>
                                    <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="a-z">Name (a - z)</option>
                                    <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="z-a">Name (z - a)</option>
                                    <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="free">Free</option>
                                    <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="premium">Premium</option>
                                    <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="freemium">Freemium</option>

                                </select>

                            </div>
                        </>)}


                <div className="w-full min-h-screen flex flex-wrap gap-4 justify-center items-center py-10">
                    {WebData && WebData?.length > 0 ? (
                        noResults ? "Oops! No results found."
                            : (currentCards.map((data, index) => (

                                <Card
                                    key={index}
                                    name={data.name}
                                    url={data.url}
                                    description={data.description}
                                    tags={data.tags}
                                    id={data._id}
                                    onChange={handleReloadAfterDeletion}
                                    
                                />
                            )))

                    ) : (
                        <h3 className="text-2xl">No data available !!</h3>
                    )}
                </div>
                <div>
                    <Pagination
                        postsPerPage={cardsPerPage}
                        totalPosts={!noResults && WebData?.length ? WebData.length : 0}
                        // setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                    />

                </div>



            </div>
        </>
    );
};

export default Home;
