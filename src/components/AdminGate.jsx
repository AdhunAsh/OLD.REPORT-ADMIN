import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { useAuth } from '@clerk/clerk-react'
import LoadingSpinner from './LoadingSpinner';

const AdminGate = ({ getToken, children }) => {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);
    const { signOut } = useAuth();

    useEffect(() => {
        const checkRole = async () => {
            try {
                const token = await getToken();
                const res = await axiosInstance.get("/role/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(res.data);
                if (res.data.role === "manager") {
                    setAllowed(true);
                } else {
                    toast.error("Unauthorized access");
                }
            } catch (err) {
                toast.error("Unauthorized access");
            } finally {
                setLoading(false);
            }
        };
        checkRole();
    }, [getToken]);

    if (loading) {
        return <LoadingSpinner message="Checking access..." />;
    }

    if (!allowed) {
        return (
            <div className="flex flex-col items-center mt-10">
                <p className="text-red-500">You are not authorized to access this page</p>
                <button onClick={()=> signOut()} className="px-4 py-2 bg-gray-800 text-white rounded mt-5">
                    Sign Out
                </button>
            </div>
        )
    };

    return <>{children}</>;
};

export default AdminGate;
