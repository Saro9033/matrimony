import React, { useEffect, useState } from 'react';
import { FaUsers, FaMale, FaFemale } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { AllUsersByAdmin, FemaleUsersByAdmin,  getUsersByAdmin, MaleUsersByAdmin } from '../../slices/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch()
  const allUsers = useSelector(AllUsersByAdmin)
  const maleUsers = useSelector(MaleUsersByAdmin)
  const femaleUsers = useSelector(FemaleUsersByAdmin)

  
  useEffect(()=>{
    dispatch(getUsersByAdmin())
    dispatch(getUsersByAdmin('male'))
    dispatch(getUsersByAdmin('female'))
  },[dispatch])

  return (
    <div className="w-full p-6 border rounded-lg border-gray-300 bg-gray-100" style={{ height: '80vh' }}>
      {/* Total Users Card */}
      <div className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white rounded-lg p-8 shadow-lg mb-6">
        <div className="rounded-full bg-white p-4 mb-4 shadow-lg">
          <FaUsers color="indigo" size={50} />
        </div>
        <h1 className="text-2xl lg:text-3xl  font-bold">Total Users</h1>
        <h1 className="text-2xl lg:text-3xl  font-extrabold mt-2">{allUsers.length}</h1>
      </div>
      
      {/* Male and Female Users Cards */}
      <div className="mt-3 flex gap-6">
        {/* Male Users Card */}
        <div className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
          <div className="rounded-full bg-white p-4 mb-3 shadow-lg">
            <FaMale color="blue" size={50} />
          </div>
          <h1 className="text-1xl text-center  lg:text-3xl  font-bold">Male Users</h1>
          <h1 className="text-2xl lg:text-3xl  font-extrabold mt-2">{maleUsers.length}</h1>
        </div>
        
        {/* Female Users Card */}
        <div className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
          <div className="rounded-full bg-white p-4 mb-3 shadow-lg">
            <FaFemale color="red" size={50} />
          </div>
          <h1 className="text-1xl lg:text-3xl text-center font-bold">Female Users</h1>
          <h1 className="text-2xl lg:text-3xl  font-extrabold mt-2">{femaleUsers.length}</h1>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
