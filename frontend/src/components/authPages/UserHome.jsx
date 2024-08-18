import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers, clearError, getAllUsers, loginAuthError, loginAuthStatus } from '../../slices/authSlice';
import UserCard from '../viewUsers/UserCard';
import { PcHome } from '../../skeleton/PcHome';
import { FindWidthContext } from '../../context/FindWidth';

const UserHome = () => {
  const dispatch = useDispatch();
  const AllUsers = useSelector(getAllUsers);
  const [error, setError] = useState(null);

  const loginError = useSelector(loginAuthError);
  const status = useSelector(loginAuthStatus);
  const width = useContext(FindWidthContext);

  useEffect(() => {
    // Dispatch action to get all users
    dispatch(allUsers());

    // Clean up error state
    if (loginError) {
      setError(loginError);
      dispatch(clearError());
    }
  }, [dispatch, loginError]);



  return (
    <div className='pb-10 container px-3 mx-auto mt-20' style={{ minHeight: '100vh' }}>
      {error && <div className="error text-red-500">{error}</div>}

     <div className={` ${width>640 ? 'flex flex-wrap':'block'}`}>  
      {
        status === "loading" && (
          Array.from({ length: 15 }, (_, index) => (
            <PcHome key={index} />
          ))
        )
      } </div>

      {status === "succeeded" && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {AllUsers.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserHome;
