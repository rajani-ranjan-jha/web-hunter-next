"use client";

import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import { useDispatch } from "react-redux";
import { setWebData, setLoading, setError, loadWebData } from "./redux/webSlice";
import Footer from "./components/Footer";
import { NotifyUser } from "./components/Notification";

export default function Page() {

  const dispatch = useDispatch()
  const [theme, setTheme] = useState('light');



  const AddDataToRedux = async () => {
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
      dispatch(setWebData(res.data))
      dispatch(setLoading(false));
      dispatch(setError(null));
    } catch (error) {
      console.error(error.message)
      dispatch(setError(res.message));
    }
  };

  useEffect(() => {
    dispatch(loadWebData());

    // AddDataToRedux();

  }, [])
  


  
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
