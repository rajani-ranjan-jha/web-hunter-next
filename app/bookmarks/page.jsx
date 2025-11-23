"use client"
import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';

import { useSelector, useDispatch } from "react-redux"

import { allCategories } from "@/public/categories.js"
import { NotifyUser } from "../components/Notification";
import Card from "../components/Card";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpinner";

const PORT = process.env.NEXTAUTH_URL;

const Bookmarks = () => {

  const [WebData, setWebData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const state = useSelector(state => state.admin.status)
  const dispatch = useDispatch();
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      NotifyUser("Please Login to view your bookmarks", false, 'top-center');
      router.push('/login');
      // window.alert("Please sign in to view your bookmarks");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <><LoadingSpinner/></>
  }

  if (!session) {
    return null;
  }

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

  const getBookmarkedData = async () => {
    try {
      // Fetch data from server
      console.warn(`Fetching data from server at: ${PORT}`);
      const req = await fetch(`/api/web`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const res = await req.json();
      const data = res.data;
      if (!data || data.length === 0) {
        console.error("No data found from the server!");
        return;
      }

      const storedBookmarks = JSON.parse(localStorage.getItem('web-hunter-bookmarks')) || [];

      // Filter data to only include bookmarked items
      const bookmarked = data?.filter(item =>
        storedBookmarks.some(bookmark => bookmark.id === item._id)
      );

      setWebData(bookmarked);
      setFilteredData(bookmarked);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleReloadAfterDeletion = () => {
    NotifyUser('Data deleted', true, 'top-center')
    getBookmarkedData();
  };

  useEffect(() => {
    getBookmarkedData();
  }, []);


  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Toaster />

      {WebData && WebData.length > 0 &&
        (<div className="my-10 w-full flex justify-center items-center gap-5">
          <input
            className="p-2 border border-violet-600 dark:border-white focus:outline-none focus:shadow-md focus:shadow-violet-600 dark:focus:shadow-white rounded-xl "
            type="text"
            placeholder="Search by name or tag"
            onChange={handleSearch}
          />
        </div>)}

      <div className="w-full min-h-screen flex flex-wrap gap-4 justify-center items-center py-10">
        {WebData && WebData.length > 0 ? (
          noResults ? "Oops! No results found."
            : (WebData.map((data, index) => (
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
          <div className="flex flex-col justify-center items-center gap-5">
            <p className="text-2xl">No bookmarks available!</p>
            <p className="text-center text-2xl">You can bookmark your favorite websites by clicking the bookmark icon on their respective cards.</p>
            <Link href='/categories' className="text-2xl font-semibold underline">Start exploring</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmarks
