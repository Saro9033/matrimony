import React, { useContext, useEffect, useState } from 'react';
import LOGO from '../assets/LOGO.png';
import LoginModal from './Login';
import { clearStatus, loginAuthUser, loginIsAuthenticated, logoutUser } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Search from './authPages/Search';
import { FindWidthContext } from '../context/FindWidth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import SideDrawer from './Chat/SideDrawer';
import { clearSelectedChat } from '../slices/selectedChatSlice';
import { IoIosNotifications } from "react-icons/io";
import { getSenderName } from '../utils/getSender';

const Navbar = () => {
  const isAuth = useSelector(loginIsAuthenticated);
  const user = useSelector(loginAuthUser);
  const dispatch = useDispatch();
  const width = useContext(FindWidthContext)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const notification = useSelector((state) => state.selectedChat.notification);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsOpen(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
  };

  const handleMouseEnter = () => setIsDropDownOpen(true);
  const handleMouseLeave = () => setIsDropDownOpen(false);

  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setScrollY(currentScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Determine background color
  const isScrolled = scrollY > 40;
  const isScrollingUp = scrollDirection === 'up';
  const bgColor = isScrolled ? 'bg-gray-100 shadow-down' : 'bg-transparent';
  const textColor = isScrolled ? 'text-primary border-primary' : 'text-white';
  const navPosition = isScrollingUp ? 'translate-y-0' : '-translate-y-full';

  const [isSearchVisible, setSearchVisible] = useState(false);

  // Toggle search input visibility
  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };
  const location = useLocation();
  const isChatPage = location.pathname === '/chat-home'
  const isAdmin = user?.role === "admin"

  const handleClick = () => {
    dispatch(clearSelectedChat());
    navigate('/chat-home');
  };

  const [isNotification, setIsNotification] = useState(false)

  const handleNotificationEnter = () => setIsNotification(true);
  const handleNotificationLeave = () => setIsNotification(false);

  console.log(notification);
  
  return (
    <>
      {isSearchVisible && (
        <Search isMobile={true} toggleSearch={toggleSearch} />
      )}

      <LoginModal isOpen={showLoginModal} onClose={closeModals} />
      <header className={`text-gray-800 w-full z-20 transition-transform duration-300 ${isAuth ? 'bg-gray-100 shadow-down' : bgColor} ${isAuth ? 'translate-y-0' : navPosition} fixed top-0 left-0 w-full`}>
        <nav className="container mx-auto lg:px-20 px-5 py-2 flex items-center justify-between">
          <div className="text-xl font-bold">
            <a href="/">
              <img src={LOGO} alt="Logo" width='150px' height="150px" />
            </a>
          </div>


          {/* Full Width Search Bar for Medium and Large Screens */}
          {!isAdmin && isAuth && width >= 1023 && !isChatPage && (
            <div className="lg:flex-grow lg:w-full md:flex-grow md:w-full">
              <Search />
            </div>
          )
          }

          {isAuth && width >= 1023 && isChatPage && (
            <div className="lg:flex lg:w-full md:flex-grow md:w-full  justify-end">
              <SideDrawer />
            </div>
          )
          }

          <div className="hidden lg:flex space-x-4">

            {/* Check user is authenticated or not if authenticated then show their details if not then show LOGIN button */}
            {isAuth && user?.role === "user" ? (
              <div className='flex gap-3 items-center'>
                <div className='bg-primary p-2 rounded-full cursor-pointer'  onMouseEnter={handleNotificationEnter} onMouseLeave={handleNotificationLeave}>
                  {/*  pc Notification */}
                  <IoIosNotifications  size={20} color='white' />
                  {isNotification && 
                (
                      <div className="absolute top-14 right-40 w-30 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        <div className="border-t p-4 border-gray-200">
                          {
                            !notification.length && "No new Messages"
                          }
                          {notification.map((notif=>(
                            <li key={notif._id}>
                               {`New Message from ${getSenderName(user, notif.chat.users)}`}
                            </li>
                          )))}
                        </div>
                      </div>
                    )}

                </div>
                <div
                  className="relative inline-block cursor-pointer text-left"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center">
                    <button
                      className={`rounded-lg transition-colors duration-500 ease-in-out px-2 py-1 border ${isOpen ? 'bg-gray-200' : 'bg-white'}`}
                    >
                      <div className="items-center pr-3 flex justify-between">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          width="40px"
                          height="40px"
                          className="rounded-full border border-gray-300"
                        />
                        <p className="pr-3 text-gray-700 font-semibold">&nbsp;{user.name}</p>
                        <p>{isDropDownOpen ? <FaAngleUp /> : <FaAngleDown />} </p>
                      </div>
                    </button>
                  </div>
                  {/* Show dropdown when hover */}
                  {isDropDownOpen && (
                    <div className="absolute right-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => navigate('/')}
                          className="w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-100"
                        >
                          Home
                        </button>
                        <button
                          onClick={() => navigate('/chat-home')}
                          className="w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-100"
                        >
                          Messages
                        </button>
                        <button
                          onClick={() => navigate('/profile-settings')}
                          className="w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-100"
                        >
                          Profile Setting
                        </button>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : !isAdmin &&
            <button
              onClick={openLoginModal}
              className={`transition-colors duration-500 ease-in-out rounded px-3 py-1 border ${textColor} hover:text-white hover:bg-primary-dark`}
            >
              LOGIN
            </button>
            }
          </div>

          {isAuth && user?.role === "user" ? (
            // <button className='lg:hidden rounded'>
            //   <img
            //     src={user.avatar}
            //     alt={user.name}
            //     width="40px"
            //     height="40px"
            //     className="rounded-full border border-gray-300"
            //   />
            // </button>
            <div className='flex gap-3'>
              {!isChatPage && <>
                {/*  mobile Notification */}
                <button onClick={toggleSearch} data-modal-target="popup-modal" data-modal-toggle="popup-modal" className="lg:hidden rounded-full text-white hover:text-white block bg-primary-light hover:bg-primary focus:ring-4  font-medium text-sm px-3 py-3 text-center   " type="button">
                  <FaSearch />
                </button >

                <button onClick={handleClick} className="lg:hidden rounded-full text-white hover:text-white block bg-primary-light hover:bg-primary focus:ring-4  font-medium text-sm px-3 py-3 text-center   " type="button">
                  <IoChatbubbleEllipsesSharp />
                </button>
              </>
              }

              {isChatPage && <div className="lg:hidden"><SideDrawer /> </div>}
            </div>
          ) : !isAdmin && (
            <button
              onClick={openLoginModal}
              className={`lg:hidden px-3 py-2 transition-colors duration-500 ease-in-out rounded px-3 py-1 border ${textColor} hover:text-white hover:bg-primary-dark`}
            >
              LOGIN
            </button>
          )}
        </nav>

        {/*      Search Bar for Small Screens
           {isAuth && width < 630 && (
            <div className="block lg:hidden flex-grow mx-2">
              <Search />
            </div>
          )} */}

      </header>
    </>
  );
};

export default Navbar;
