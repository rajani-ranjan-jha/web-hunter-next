import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';

import Card from "./Card.jsx";
import { useSelector, useDispatch } from "react-redux"
import { NotifyUser } from './Notification.jsx'
import { allCategories } from '../assets/categories.js'


const PORT = process.env.NEXTAUTH_URL ;

const Bookmarks = () => {

  const [WebData, setWebData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const state = useSelector(state => state.admin.status)
  const dispatch = useDispatch();


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
      console.log(`Fetching data from server at: ${PORT}`);
      const res = await fetch(`${PORT}/api/web`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!data || data.length === 0) {
        console.log("No data found from the server!");
        return;
      }

      const storedBookmarks = JSON.parse(localStorage.getItem('web-hunter-bookmarks')) || [];

      // Filter data.webs to only include bookmarked items
      const bookmarked = data.webs.filter(item =>
        storedBookmarks.some(bookmark => bookmark.id === item._id)
      );

      // console.log(bookmarked);
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
    <div className="w-full flex flex-col justify-center items-center bg-gradient-to-r from-cyan-300 via-indigo-400 to-cyan-300 dark:from-indigo-900 dark:via-cyan-800 dark:to-indigo-900 dark:text-white text-black">
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
          <h3 className="text-2xl">No bookmarks available !!</h3>
        )}
      </div>
    </div>
  );
}

export default Bookmarks
