import React, { useEffect, useState } from 'react';
import { AllUsersByAdmin, FemaleUsersByAdmin, getUsersByAdmin, MaleUsersByAdmin } from '../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UsersAdmin = () => {
    const dispatch = useDispatch();
    const allUsers = useSelector(AllUsersByAdmin);
    const maleUsers = useSelector(MaleUsersByAdmin);
    const femaleUsers = useSelector(FemaleUsersByAdmin);
    const navigate = useNavigate()

    // State to manage the selected gender
    const [selectedGender, setSelectedGender] = useState('All');

    // Fetch users based on selected gender
    useEffect(() => {
        if (selectedGender === 'All') {
            dispatch(getUsersByAdmin());
        } else {
            dispatch(getUsersByAdmin(selectedGender));
        }
    }, [dispatch, selectedGender]);

    // Handle dropdown change
    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    // Determine which users to display
    const usersToDisplay = selectedGender === 'All' ? allUsers : 
        (selectedGender === 'male' ? maleUsers : femaleUsers);

    return (
        <div className="w-full p-6 border rounded-lg border-gray-300 bg-gray-100" style={{ height: '80vh', overflowX: 'auto' }}>
            <div className="mb-6">
                <div className='flex justify-between gap-4 items-center'>
                    <div className='flex gap-3'> <h2 className="text-3xl font-bold mb-4">Users</h2>
                    <select
                        className='cursor-pointer border border-gray-400 py-1 rounded-lg'
                        name="gender"
                        id="gender"
                        value={selectedGender}
                        onChange={handleGenderChange}
                    >
                        <option value="All">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select></div>
                    <h3 className='text-3xl'>{usersToDisplay.length} Users</h3>
                </div>
                <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {usersToDisplay.map(user => (
                        <div onClick={()=>{navigate(`/admin/user/${user._id}`)}} key={user._id} className="cursor-pointer flex items-center bg-white p-4 rounded-lg shadow-lg">
                          <img className='rounded-full ' style={{height:'50px', width:'50px'}} src={user?.avatar} alt="" />
                           <div className='pl-3'> <h3 className="text-xl font-semibold">{user.name}</h3>
                            <p className="text-gray-600">{user.email}</p>
                            </div> 
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersAdmin;
