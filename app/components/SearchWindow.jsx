'use client'
import { Search, X } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import Card from './Card';
import { NotifyUser } from './Notification';




const SearchWindow = ({ onClose }) => {


  const PORT = process.env.NEXT_PUBLIC_PORT || "http://localhost:3000";
  const [WebData, setWebData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showCards, setShowCards] = useState(false);



  useEffect(() => {
    getDataFromServer();
  }, []);

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
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (param) => {
    console.log('Searching for:', param);
    if(param && param.length > 0){
      setShowCards(true);
    }
    const value = param.toLowerCase();
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

  const handleReloadAfterDeletion = () => {
    NotifyUser('Data deleted', true, 'top-center')
    getDataFromServer();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };




  return (
    <>
      <div className="py-10 absolute z-50 w-full h-full flex flex-col gap-5 items-center justify-start">
        <button className='absolute right-10 z-100  hover:bg-white/20 p-2 text-2xl rounded-md'>
          <X className="w-8 h-8 text-white " onClick={() => onClose()} />
        </button>
        <div className="min-w-4xl h-20 flex gap-2 items-center rounded-2xl shadow-2xl overflow-hidden transition-all duration-300  backdrop-blur-xs border border-white/30">
          <Search className="w-6 h-6 ml-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search for websites, tools, resources..."
            onChange={(e) => handleSearch(e.target.value)}
            className="h-full w-full text-lg bg-transparent outline-none text-white "
          />
        </div>

        <div className="h-8/10 overflow-y-auto handle-scroll w-4/5 flex flex-wrap gap-4 justify-center items-center py-10 text-white rounded-lg border-2 border-white">
          {showCards && WebData && WebData?.length > 0 ? (
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
            <h3 className="text-2xl">Search Something...</h3>
          )}
        </div>

      </div>
    </>
  )
}

export default SearchWindow
