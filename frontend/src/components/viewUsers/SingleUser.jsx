import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUser, loginAuthError, loginAuthStatus, clearError, GetSingleUser, loginAuthUser, loadUser, getAllUsers, allUsers } from '../../slices/authSlice';
import { IoMdArrowBack } from "react-icons/io";
import SingleUserSkeleton from '../../skeleton/SingleUserSkeleton';
import { CiUser } from "react-icons/ci";
import CalculateAge from '../../utils/CalculateAge';
import { CgCommunity } from "react-icons/cg";
import { TiShoppingBag } from "react-icons/ti";
import { CiLocationOn } from "react-icons/ci";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoIosCall } from "react-icons/io";
import { CiLineHeight } from "react-icons/ci";
import { FaWeightScale } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { GiLinkedRings } from "react-icons/gi";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";
import { MdFamilyRestroom } from "react-icons/md";
import { MdCastForEducation } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import UserCard from './UserCard';
import { accessChat, fetchChat, selectChat } from '../../slices/chatSlice';
import {  setMobileSingleChat, setSelectedChat, toggleIsOpen } from '../../slices/selectedChatSlice';

const SingleUser = () => {
  const { id } = useParams(); // Get the user ID from the URL parameters

  const dispatch = useDispatch();
  const user = useSelector(GetSingleUser); // Replace 'auth.user' with the correct path to the user state
  const [error, setError] = useState(null);
  const loginError = useSelector(loginAuthError);
  const status = useSelector(loginAuthStatus);
  const navigate = useNavigate()
  const currentUser = useSelector(loginAuthUser)
  const AllUsers = useSelector(getAllUsers);
  const Chat = useSelector(selectChat)

  const handleBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    dispatch(loadUser())
    dispatch(allUsers());
  }, [dispatch])


  useEffect(() => {
    dispatch(getSingleUser(id));
    // Clean up error state
    if (loginError) {
      setError(loginError);
      dispatch(clearError());
    }
  }, [dispatch, id, loginError]);

  useEffect(() => {
    if (Chat) {
        dispatch(setMobileSingleChat(true));
        dispatch(setSelectedChat(Chat));
    }
}, [Chat, dispatch]);  



  if (status === 'loading') {
    return <SingleUserSkeleton />;
  }

  if (error) {
    return <div className="error">{error}</div>; // Display the error if there is one
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

  const whatsappMessage = encodeURIComponent(`Hi ${user?.name} ,I'm ${currentUser?.name}, I've seen your profile on VishwaKarma Wedding site.`);
  const whatsappLink = `https://wa.me/${user?.phoneNumber}?text=${whatsappMessage}`;


  const filteredUsers = AllUsers.filter(currentUser => currentUser._id !== user._id);

  const handleCreateChat = async () => {
    dispatch(toggleIsOpen())

    dispatch(accessChat({ userId: id }))
      .then(() => {
        return dispatch(fetchChat());  // Fetch chats after accessing chat
      })
      .catch(error => {
        console.error("Error accessing chat:", error);
      });
      navigate('/chat-home')
    };

  return (
    <div className="w-full flex flex-col  lg:mt-10 lg:pt-7 justify-center px-5 py-4">
      <div className='m-1'>
        <IoMdArrowBack size={35} className='bg-gray-100 rounded-full p-1 cursor-pointer' onClick={handleBack} />
      </div>
      <div className="border w-full flex mt-2 flex-col md:flex-row  justify-center w-full p-4  rounded shadow dark:border-gray-700">
        {/* Left Side: Image */}
        <div className="flex-shrink-0 w-full md:w-1/3 lg:w-1/3 mb-4 md:mb-0">
          <img className="w-full h-auto rounded-md" src={user?.avatar} alt={user?.name} />
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

          <div className='mt-5 gap-3 p-2 flex w-full lg:absolute lg:bottom-0'>
            <button
              onClick={handleCreateChat}
              className='w-1/3 shadow border border-gray-300 flex items-center p-2 rounded-md hover:text-white hover:bg-primary-light'>
              <IoChatbubbleEllipses />&nbsp;Chat
            </button>
            <a href={whatsappLink} target='_blank'
              rel='noopener noreferrer' className='w-1/3 border-gray-300 cursor-pointer shadow border flex items-center p-2 rounded-md hover:text-white hover:bg-primary-light'>
              <IoLogoWhatsapp />&nbsp;Whatspp
            </a>
            <a href={`tel:${user.phoneNumber}`} className='w-1/3 border-gray-300 cursor-pointer shadow border flex items-center p-2 rounded-md hover:text-white hover:bg-primary-light'>
              <IoIosCall />&nbsp;Call
            </a>
          </div>

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

      {filteredUsers.length > 0 && <>
        <h2 className='text-2xl my-5'>Related Profiles</h2>
        {status === "succeeded" && (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

        )}
      </>}

    </div>

  );
};

export default SingleUser;
