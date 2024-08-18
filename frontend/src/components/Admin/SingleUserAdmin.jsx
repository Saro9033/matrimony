import React, { useEffect, useState } from 'react'
import { IoIosCall, IoMdArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearDeleted, clearError, getSingleUser, GetSingleUser, getUsersByAdmin, IsDeleted, loginAuthError, loginAuthStatus, removeUserByAdmin } from '../../slices/authSlice';
import SingleUserSkeleton from '../../skeleton/SingleUserSkeleton';
import CalculateAge from '../../utils/CalculateAge';
import { CiLineHeight, CiLocationOn, CiUser } from 'react-icons/ci';
import { TiShoppingBag } from 'react-icons/ti';
import { CgCommunity } from 'react-icons/cg';
import { FaUserEdit } from 'react-icons/fa';
import { GiLinkedRings } from 'react-icons/gi';
import { IoLanguage } from 'react-icons/io5';
import { FaWeightScale } from 'react-icons/fa6';
import { MdCastForEducation, MdFamilyRestroom, MdOutlineMailOutline } from 'react-icons/md';
import { RiMoneyRupeeCircleLine } from 'react-icons/ri';
import Notification from '../../utils/Notification';

const SingleUserAdmin = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(GetSingleUser);
    const [error, setError] = useState(null);
    const loginError = useSelector(loginAuthError);
    const status = useSelector(loginAuthStatus);
    const navigate = useNavigate()
    const isDeleted = useSelector(IsDeleted)
    const [showNotification, setShowNotification] = useState(false);


    const handleBack = () => {
        navigate(-1)
    }


    useEffect(() => {
        dispatch(getSingleUser(id));
        if (loginError) {
            setError(loginError);
            dispatch(clearError());
        }
    }, [dispatch, id, loginError]);

    
    useEffect(() => {
        if (isDeleted) {
            setShowNotification(true);
            dispatch(clearDeleted());
            setTimeout(() => {
                setShowNotification(false);
                navigate('/admin/users');
            }, 3000); // Hide notification after 3 seconds
        }
    }, [isDeleted, dispatch, navigate]);


    if (status === 'loading') {
        return <SingleUserSkeleton />;
      }
    
      if (error) {
        return <div className="error">{error}</div>; 
      }
    
      if (!user) {
        return <div>User not found</div>;
      }

      const desc = [
        { title: "Age", value: CalculateAge(user?.DOB), icon: <CiUser /> },
        { title: "Work", value: user?.occupation, icon: <TiShoppingBag /> },
        { title: "Lives in", value: `${user?.city},${user?.state}, ${user?.country} `, icon: <CiLocationOn /> },
        { title: "Sub Caste", value: user?.subCaste, icon: <CgCommunity /> },
      ]
    
      const userDOB = new Date(user?.DOB);
      const options = { year: 'numeric', month: 'short', day: '2-digit' };
      const formattedDOB = userDOB.toLocaleDateString('en-US', options)  || "";
    
      const basicDetails = [
        { title: "Age", value: `${CalculateAge(user?.DOB) || ""} / ${formattedDOB }`, icon: <CiUser /> },
        { title: "Profile Created By", value: user?.profileFor, icon: <FaUserEdit /> },
        { title: "Marital Status", value: `${user?.maritalStatus  || ""} `, icon: <GiLinkedRings /> },
        { title: "Mother Tongue", value: `${user?.motherTongue  || ""} `, icon: <IoLanguage /> },
        { title: "Height", value: user?.height, icon: <CiLineHeight /> },
        { title: "Weight", value: user?.weight, icon: <FaWeightScale /> },
        { title: "Lives in", value: `${user?.city  || ""},${user?.state  || ""}, ${user?.country  || ""}`, icon: <CiLocationOn /> },
        { title: "Sub Caste", value: user?.subCaste  || "", icon: <CgCommunity /> },
    
      ]
    
      const contactDetails = [
        { title: "Phone", value: ` ${user?.phoneNumber  || ""} `, icon: <IoIosCall /> },
        { title: "Email", value: ` ${user?.email  || ""} `, icon: <MdOutlineMailOutline /> },
      ]
    
      const familyDetails = [
        { title: "Family Type", value: ` ${user?.familyType  || ""} `, icon: <MdFamilyRestroom /> },
        { title: "Family Status", value: ` ${user?.familyStatus  || ""} `, icon: <MdFamilyRestroom /> },
      ]
    
      const otherDetails = [
        { title: "Education", value: ` ${user?.education  || ""} `, icon: <MdCastForEducation /> },
        { title: "Occupation", value: user?.occupation  || "", icon: <TiShoppingBag /> },
        { title: "Income", value: ` ${user?.income  || ""} `, icon: <RiMoneyRupeeCircleLine /> },
      ]


     const handleDelete = (id)=>{
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            dispatch(removeUserByAdmin(id));
            navigate('/admin/users')
            dispatch(getUsersByAdmin())
        }
     }

    return (
        <div className="w-full flex flex-col  justify-center px-5 py-4">
                        {showNotification && <Notification message="User deleted successfully!" onClose={() => setShowNotification(false)} />}

            <div className='m-1'>
                <IoMdArrowBack size={35} className='bg-gray-100 rounded-full p-1 cursor-pointer' onClick={handleBack} />
            </div>
            <div className="border w-full flex mt-2 flex-col md:flex-row  justify-center w-full p-4  rounded shadow dark:border-gray-700">
                {/* Left Side: Image */}
                <div onClick={()=>handleDelete(user._id)} className="flex-shrink-0 justify-between w-full md:w-1/3 lg:w-1/3 mb-4 md:mb-0">
                    <img  className="w-full h-auto rounded-md" src={user?.avatar} alt={user?.name} />
                    <button className='w-full mt-4 rounded-md bg-red-600 text-white'>Delete</button>
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-2/3 lg:w-3/4 pl-0 md:pl-4 lg:relative ">
                    <h2 className="text-3xl mb-3 font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                    {desc.map(list => (
                        <div className='flex my-2 items-center'>
                            <div className='bg-primary-light rounded-md p-1 text-white'> {list?.icon}</div>
                            <p className="pl-2  text-gray-600" style={{ fontSize: '14px' }}><span style={{ fontWeight: '700' }}>{list.title} </span>: {list.value}</p>
                        </div>
                    ))}

                </div>
            </div>


            <div>
                <h1 className='mt-3 text-2xl font-bold-500'>About {user.name}</h1>
                <p style={{ fontSize: '14px', textAlign: 'justify' }}>{user?.about}</p>
            </div>

            <div>
                <h2 className='text-2xl mt-5'>{user.gender === "female" ? "Her" : "His"} Details</h2>

                <h2 className='pl-2 text-1xl mt-5 mb-2 lg:mb-1 lg:mt-3'>Basic</h2>
                <table className="w-full text-left border-collapse">
                    <tbody>
                        {basicDetails.map((list, index) => (
                            <tr key={index}>
                                <td className="w-1/2 border border-gray-200 py-2 px-2 align-top">
                                    <div className="flex items-start">
                                        <div className="bg-primary-light rounded-md p-1 text-white">{list?.icon}</div>
                                        <span className="pl-2 font-semibold text-gray-600 dark:text-gray-400">{list.title}</span>
                                    </div>
                                </td>
                                <td className="w-1/2 border border-gray-200  py-2 px-2 text-gray-600 dark:text-gray-400">
                                    {list.value || ""}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 className='pl-2 text-1xl mt-5 mb-2 lg:mb-1 lg:mt-3'>Contact</h2>
                <table className="w-full text-left border-collapse">
                    <tbody>
                        {contactDetails.map((list, index) => (
                            <tr key={index}>
                                <td className="w-1/2 border border-gray-200  py-2 px-2 align-top">
                                    <div className="flex items-start">
                                        <div className="bg-primary-light rounded-md p-1 text-white">{list?.icon}</div>
                                        <span className="pl-2 font-semibold text-gray-600 dark:text-gray-400">{list.title}</span>
                                    </div>
                                </td>
                                <td className="w-1/2 border border-gray-200  py-2 px-2 text-gray-600 dark:text-gray-400">
                                    {list.value || ""}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 className='pl-2  text-1xl mt-5 mb-2 lg:mb-1 lg:mt-3'>Family</h2>
                <table className="w-full text-left border-collapse">
                    <tbody >
                        {familyDetails.map((list, index) => (
                            <tr key={index}>
                                <td className="w-1/2 border border-gray-200 py-2 px-2 align-top">
                                    <div className="flex items-start">
                                        <div className="bg-primary-light rounded-md p-1 text-white">{list?.icon}</div>
                                        <span className="pl-2 font-semibold text-gray-600 dark:text-gray-400">{list.title}</span>
                                    </div>
                                </td>
                                <td className="w-1/2 border border-gray-200 py-2 px-2 text-gray-600 dark:text-gray-400">
                                    {list.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 className='pl-2 text-1xl mt-5 mb-2 lg:mb-1 lg:mt-3'>Others</h2>
                <table className="w-full text-left border-collapse">
                    <tbody>
                        {otherDetails.map((list, index) => (
                            <tr key={index}>
                                <td className="w-1/2 border border-gray-200  py-2 px-2 align-top">
                                    <div className="flex items-start">
                                        <div className="bg-primary-light rounded-md p-1 text-white">{list?.icon}</div>
                                        <span className="pl-2 font-semibold text-gray-600 dark:text-gray-400">{list.title}</span>
                                    </div>
                                </td>
                                <td className="w-1/2 border border-gray-200  py-2 px-2 text-gray-600 dark:text-gray-400">
                                    {list.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default SingleUserAdmin