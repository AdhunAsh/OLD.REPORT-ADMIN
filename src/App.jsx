import React from "react";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { Routes, Route } from "react-router-dom";
import AdminGate from "./components/AdminGate";
import { useAuth, SignIn } from "@clerk/clerk-react";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import List from "./pages/List";
import Orders from "./pages/Orders";
import ProductForm from "./pages/ProductForm";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

const App = () => {
    const { isSignedIn, getToken } = useAuth();
    const navigate = useNavigate();
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={3000} />
            {!isSignedIn ? (
                <div className="flex items-center justify-center min-h-screen">
                    <SignIn 
                        signUpUrl={null}
                        appearance={{
                            elements:{
                                footer: "hidden",
                            }
                        }}/>
                </div>
            ) : (
                <>
                    <AdminGate getToken={getToken}>
                        <NavBar />
                        <hr />
                        <div className="flex w-full">
                            <SideBar />
                            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
                                <Routes>
                                    <Route
                                        path="/add"
                                        element={<ProductForm />}
                                    />
                                    <Route
                                        path="/list"
                                        element={<List />}
                                    />
                                    <Route
                                        path="/orders"
                                        element={<Orders />}
                                    />
                                </Routes>
                            </div>
                        </div>
                    </AdminGate>
                </>
            )}
        </div>
    );
};

export default App;
