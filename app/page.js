"use client";

import { useState } from "react";
import HeroSection from "./components/HeroSection";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Navbar2 from "./components/Navbar2";
import { useDispatch } from "react-redux";
import { setError } from "./redux/webSlice";
import Footer from "./components/Footer";

export default function Page() {

  const dispatch = useDispatch()
  const [WebData, setWebData] = useState ([]);
  const [filteredData, setFilteredData] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
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
      dispatch(s(res))
      setWebData(res);
      setLoading(false);
      setNoResults(false);
    } catch (error) {
      console.log("Error fetching data from server:", error);
      dispatch(setError(error.message));
    }
  };


  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  };

  return (
    <>
      <div className="h-screen bg-red-500">
        {/* <Navbar2 theme={theme} toggleTheme={toggleTheme} /> */}
        <HeroSection/>
        {/* <Home/> */}
        <Footer />
      </div>
    </>
  );
}
