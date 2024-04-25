"use client";
import React from "react";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      toast.success("Logout Successfully");
      router.push("/login");
    } catch (err: any) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile Page</p>
      <hr />
      <h2 className="p-1 rouonded bg-green-500">
        {data === "nothing" ? (
          "nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <button
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white
      font-bold py-2 px-4 rounded"
        onClick={logout}
      >
        Logout
      </button>
      <button
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white
      font-bold py-2 px-4 rounded"
        onClick={getUserDetails}
      >
        Get User
      </button>
    </div>
  );
};

export default Profile;
