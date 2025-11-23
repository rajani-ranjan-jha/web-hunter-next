"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "next/navigation.js";
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from "react-redux";

import Card from "../components/Card.jsx";
import Pagination from "../components./Pagination.jsx";
import { NotifyUser } from '../components./Notification.jsx'
import { allCategories } from '@/public/categories.js'
import Navbar from "../components./Navbar.jsx";

import { setWebData, setLoading, setError } from "@/app/redux/webSlice.js";
import Navbar2 from "../components/Navbar2.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const PORT = process.env.NEXTAUTH_URL || "http://localhost:3000";


const Categories = () => {


    const dispatch = useDispatch()

    // universal-parameters
    const [WebData, setWebData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [loading, setLoading] = useState(true);

    const [pageValue, setPageValue] = useState()

    const params = useParams()
    console.log(params)
    // const PageNumber = params?.pageId?.split('-')[1] || null

    useEffect(() => {
        getDataFromServer()
    }, [])


    const getDataFromServer = async () => {
        try {
            const req = await fetch(`${PORT}/api/web`, {
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
            // console.warn("Data fetched from server:", res);
            setWebData(res.data);
            setFilteredData(res.data);
            setLoading(false);
            setNoResults(false)
        } catch (error) {
            console.log("Error fetching data from server:", error);
            dispatch(setError(error.message));
        }
    };



    // useEffect(() => {
    //     console.warn("Category selected:", categoryValue);
    //     handleSearch(categoryValue)
    // }, [categoryValue])

    const handleSearch = (param) => {
        const value = param.toLowerCase();

        console.warn("Search initiated for:", value);
        // const value = e.target.value.toLowerCase();
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
            setNoResults(false);
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
            setCurrentPage(1)

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
    const [cardsPerPage, setCardsPerPage] = useState(10);
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




    if (loading) {
        return <LoadingSpinner/>
    }


    return (
        <>
            {/* <Navbar2 />  */}
            <div className="pt-16 w-full flex flex-col justify-center items-center  dark:text-white text-black">
                <Toaster />
                {WebData && WebData?.length > 0 &&
                    (<>
                        <div className="my-10 w-full flex md:flex-row flex-col justify-center items-center gap-5">
                            <input
                                className="p-2 border border-violet-600 dark:border-white focus:outline-none focus:shadow-md focus:shadow-violet-600 dark:focus:shadow-white rounded-xl "
                                type="text"
                                placeholder="Search by name or tag"
                                onChange={(e) => handleSearch(e.target.value)}
                            />

                            {/* category selection field: hidden */}
                            <select className="hidden text-white p-2 border border-violet-600 dark:border-white focus:outline-none focus:shadow-md focus:shadow-violet-600 dark:focus:shadow-white rounded-xl"
                                name="category"
                                id="category"
                                // onChange={handleSearch(e.target.value)}
                                onChange={(e) => handleSearch(e.target.value)}
                            >
                                <option className="text-indigo-700 dark:bg-black hover:bg-white/50" value="">===Select Category===</option>
                                {allCategories.map((category, index) => (
                                    <option
                                        id={category}

                                        key={index}
                                        className="text-indigo-700 dark:bg-black hover:bg-white/50"
                                        value={category}>
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



                 {/* Card container */}
                <div id="1" className="w-full min-h-screen flex flex-wrap gap-4 justify-center items-center py-10">
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
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                    />

                </div>



            </div>
        </>
    );
};

export default Categories;
