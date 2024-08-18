import React, { useContext } from 'react';
import { FindWidthContext } from '../../context/FindWidth';
import CalculateAge from '../../utils/CalculateAge';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
    const width = useContext(FindWidthContext);
    const navigate = useNavigate()

const onSubmit = (id)=>{
    navigate(`/profile/${id}`)
}

    return (
    <div className='container mx-auto'>{width > 640 ?
        <div className=" max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <img className="rounded-t-lg" width='100%' src={user?.avatar} alt={user.name}  />
            <div className="p-1">
                <a style={{fontSize:'16px'}} onClick={()=>onSubmit(user._id)} className='cursor-pointer  inline-block'>
                    <h6 className="hover:text-primary mb-1 text-1xl font-bold tracking-tight text-gray-900 dark:text-white">{user?.name}</h6>
                </a>
                <h6 style={{fontSize:'13px'}} className="mb-2 text-1xl tracking-tight text-gray-600 dark:text-white">{CalculateAge(user?.DOB)} Yrs Old</h6>

                <button
                    onClick={()=>onSubmit(user._id)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                >
                    View Profile
                </button>
            </div>
        </div>
        :
        <div  onClick={()=>onSubmit(user._id)}  className=" flex items-center w-full bg-white border border-gray-100 rounded-lg ">
            <a className='cursor-pointer'>
                <img className="rounded-full m-1" width={45} src={user?.avatar} alt={user?.name} />
            </a>
            <div className='pl-2'>
                <h2 style={{fontSize:'16px'}} className='font-bold'>{user?.name}</h2>
                <h2 style={{fontSize:'13px'}} className='text-gray-600'>{CalculateAge(user?.DOB)} Yrs Old</h2>
            </div>
        </div>}

    </div>
    );
};

export default UserCard;
