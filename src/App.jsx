import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer, toast } from 'react-toastify';
import ProductForm from "./pages/ProductForm";


export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency =  '₹';


const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '' );

    useEffect(() => {
      localStorage.setItem('token', token)
    }, [token])
    

    return (
        <div className="bg-gary-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={3000} />
            {token === '' ? (
                <Login setToken={setToken} />
            ) : (
                <>
                    <NavBar setToken= {setToken} />
                    <hr />
                    <div className="flex w-full">
                        <SideBar />
                        <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
                            <Routes>
                                <Route path="/add" element={<ProductForm />} token= {token} />
                                <Route path="/list" element={<List />} token= {token} />
                                <Route path="/orders" element={<Orders />} token= {token} />
                            </Routes>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
