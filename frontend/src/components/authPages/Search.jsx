
import React, { useEffect, useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { getMatchedUsers, loginAuthError, loginAuthStatus, matchedUsers, clearError } from '../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import MobileHome from '../../skeleton/MobileHome';
import SearchResList from '../SearchResList';
import { IoMdColorFilter } from "react-icons/io";
import { FaSort } from "react-icons/fa";
import { BsSortNumericUp, BsSortNumericDown } from "react-icons/bs";
import {
    gothraOptions, starOptions,
    raasiOptions, maritalStatusOptions, indianLanguages, subCasteOptions,
     educationOptions
} from '../../utils/Options'

const Search = ({ isMobile, toggleSearch }) => {
    const [showModal, setShowModal] = useState(false);
    const [searchValue, setSearchValue] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Add state for sidebar
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const loginError = useSelector(loginAuthError);
    const status = useSelector(loginAuthStatus);
    const MatchedUsers = useSelector(getMatchedUsers);

    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

    const [sort, setSort] = useState(null)

    useEffect(() => {
        if (loginError) {
            setError(loginError);
            dispatch(clearError());
        }
    }, [dispatch, loginError]);



    const handleFocus = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleFilterSidebar = () => setIsFilterSidebarOpen(!isFilterSidebarOpen);

    const toggleAgeSort = () => {
        if (sort === "DOB") {
            console.log(sort)
            setSort('DOB,desc')
        }
        else if (sort === 'DOB,desc') {
            setSort('DOB')
        }
        else {
            setSort('DOB')
        }
        setIsSidebarOpen(false)
    }

    const toggleIncomeSort = () => {
        if (sort === "income") {
            setSort('income,desc')
        }
        else if (sort === 'income,desc') {
            setSort('income')
        }
        else {
            setSort('income')
        }
        setIsSidebarOpen(false)
    }

    const toggleHeightSort = () => {
        if (sort === "height") {
            setSort('height,desc')
        }
        else if (sort === 'height,desc') {
            setSort('height')
        }
        else {
            setSort('height')
        }
        setIsSidebarOpen(false)
    }

    const toggleWeightSort = () => {
        if (sort === "weight") {
            setSort('weight,desc')
        }
        else if (sort === 'weight,desc') {
            setSort('weight')
        }
        else {
            setSort('weight')
        }
        setIsSidebarOpen(false)
    }

    const [showSubCaste, setShowSubCaste] = useState(true)
    const [selectedSubCastes, setSelectedSubCastes] = useState([]);

    const [showEducation, setShowEducation] = useState(false)
    const [selectedEducation, setSelectedEducation] = useState([]);

    const [showMaritalStatus, setShowMaritalStatus] = useState(false)
    const [selectedMaritalStatus, setSelectedMaritalStatus] = useState([]);

    const [showRaasi, setShowRaasi] = useState(false)
    const [selectedRaasi, setSelectedRaasi] = useState([]);

    const [showStar, setShowStar] = useState(false)
    const [selectedStar, setSelectedStar] = useState([]);

    const [showGothra, setShowGothra] = useState(false)
    const [selectedGothra, setSelectedGothra] = useState([]);

    const [showMotherTongue, setShowMotherTongue] = useState(false)
    const [selectedMotherTongue, setSelectedMotherTongue] = useState([]);



    const handleCheckboxChange = (value, setState) => {
        setState(prevSelectedValues => {
            if (prevSelectedValues.includes(value)) {
                return prevSelectedValues.filter(item => item !== value);
            } else {
                return [...prevSelectedValues, value];
            }
        });
    }

    console.log(` Selected SubCastes: ${selectedSubCastes.join(',')}`);

    const commonListFunction = (opt, state, setState) => {
        return <div
            className='cursor-pointer hover:bg-gray-100 mb-2 p-2 border flex items-center'
            key={opt.value}
            onClick={() => handleCheckboxChange(opt.value, setState)}
        >
            <input
                type="checkbox"
                value={opt.value}
                checked={state.includes(opt.value)}
                onChange={(e) => e.stopPropagation()}
            /> &nbsp;
            <label className='cursor-pointer'>{opt.label}</label>
        </div>
    }


    // common function to handle state changes
    const handleButtonClick = (buttonName) => {
        setShowSubCaste(buttonName === 'subCaste');
        setShowEducation(buttonName === 'education');
        setShowMotherTongue(buttonName === 'motherTongue');
        setShowGothra(buttonName === 'gothra');
        setShowStar(buttonName === 'star');
        setShowRaasi(buttonName === 'raasi');
        setShowMaritalStatus(buttonName === 'maritalStatus');

    };

    useEffect(() => {
        dispatch(matchedUsers({
            keyword: searchValue,
            sort, subCaste: selectedSubCastes.join(','),
            education: selectedEducation.join(','), star: selectedStar.join(','),
            gothra: selectedGothra.join(','), marritalStatus: selectedMaritalStatus.join(','),
            raasi: selectedRaasi.join(','), motherTongue: selectedMotherTongue.join(',')
        }));
    }, [dispatch, searchValue, sort,
        selectedSubCastes, selectedEducation, selectedGothra,
        selectedMaritalStatus, selectedMotherTongue, selectedRaasi, selectedStar]);


    return (
        <>
            {/* Search Modal */}
            {showModal && (
                <div style={{ minHeight: '100vh', zIndex: '10' }} className="fixed inset-0 flex items-start justify-center z-50">
                    <div className="bg-white w-full h-full p-4 rounded-lg shadow-lg overflow-auto transition-transform transform scale-100 mt-16">

                        <div style={{ top: '-17px' }} className="rounded-md shadow-md px-2 py-2 w-full bg-white sticky ">

                            {/* filters */}
                            {sort && <div className='py-2' style={{ fontSize: '14px' }}>
                                {(sort === "DOB" || sort === "DOB,desc") &&
                                    <button onClick={toggleAgeSort} className=' flex items-center font-bold border border-primary rounded-full px-2 py-1'>
                                        {sort === "DOB" ? <BsSortNumericUp /> : <BsSortNumericDown />}&nbsp; Age &nbsp;
                                        <span onClick={(e) => {
                                            e.stopPropagation();
                                            setSort(null);
                                        }} ><IoMdCloseCircle size={20} /> </span>
                                    </button>
                                }
                                {(sort === "income" || sort === "income,desc") &&
                                    <button onClick={toggleIncomeSort} className=' flex items-center font-bold border border-primary rounded-full px-2 py-1'>
                                        {sort === "income" ? <BsSortNumericUp /> : <BsSortNumericDown />}&nbsp; Income &nbsp;
                                        <span onClick={(e) => {
                                            e.stopPropagation();
                                            setSort(null);
                                        }} ><IoMdCloseCircle size={20} /> </span>
                                    </button>
                                }
                                {(sort === "height" || sort === "height,desc") &&
                                    <button onClick={toggleHeightSort} className=' flex items-center font-bold border border-primary rounded-full px-2 py-1'>
                                        {sort === "height" ? <BsSortNumericUp /> : <BsSortNumericDown />}&nbsp; Height &nbsp;
                                        <span onClick={(e) => {
                                            e.stopPropagation();
                                            setSort(null);
                                        }} ><IoMdCloseCircle size={20} /> </span>
                                    </button>
                                }
                                {(sort === "weight" || sort === "weight,desc") &&
                                    <button onClick={toggleWeightSort} className=' flex items-center font-bold border border-primary rounded-full px-2 py-1'>
                                        {sort === "weight" ? <BsSortNumericUp /> : <BsSortNumericDown />}&nbsp; Weight &nbsp;
                                        <span onClick={(e) => {
                                            e.stopPropagation();
                                            setSort(null);
                                        }} ><IoMdCloseCircle size={20} /> </span>
                                    </button>
                                }
                            </div>}

                            <div className='flex items-center justify-between'>
                                <div className='flex gap-3'>
                                    <button
                                        type="button"
                                        onClick={toggleSidebar} // Toggle sidebar on button click
                                        style={{ fontSize: '14px' }}
                                        className='flex  items-center border border-primary bg-gray-100 cursor-pointer px-2 py-1 rounded-full  whitespace-nowrap'
                                    >
                                        <FaSort size={15} /> Sort
                                    </button>
                                    <button
                                        onClick={toggleFilterSidebar} // Toggle sidebar on button click
                                        style={{ fontSize: '14px' }}
                                        className="flex items-center border border-primary bg-gray-100 cursor-pointer px-2 py-1 rounded-full whitespace-nowrap"
                                    >
                                        <IoMdColorFilter size={15} /> Filter
                                    </button></div>

                                <div className='flex flex-col items-end'>
                                    {!isMobile && <button
                                        className="cursor-pointer text-gray-600 hover:text-gray-900"
                                        onClick={handleCloseModal}
                                    >
                                        <IoMdCloseCircle size={25} />
                                    </button>}
                                    <h2 className="font-bold " style={{ fontSize: '14px' }}>

                                        Search Results : {MatchedUsers?.total === 0 ? "No Results Found" : MatchedUsers?.total}
                                    </h2>
                                </div>

                            </div>
                        </div>

                        <div className="lg:px-5 overflow-x-hidden">
                            {status === 'loading' && (
                                Array.from({ length: 6 }, (_, index) => (
                                    <MobileHome key={index} />
                                ))
                            )}

                            {error && <p className="text-red-500">{error} </p>}
                            <div className='mb-20 pb-20'>  {
                                MatchedUsers?.users?.length > 0 && status === "succeeded" &&
                                MatchedUsers.users.map(user => <SearchResList user={user} key={user._id} isMobile={isMobile} handleCloseModal={handleCloseModal} toggleSearch={toggleSearch} sort={sort} />)
                            }
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form className={`${isMobile ? 'fixed' : 'mx-5'} ${showModal && !isMobile ? 'fixed mx-0' : ''} top-0 left-0 right-0 rounded-lg bg-white border-b border-gray-300 shadow-md z-50`}>
                <div className="relative">
                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>

                    {/* Search Input */}
                    <input
                        type="search"
                        autoFocus={isMobile}
                        onFocus={handleFocus}
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                        id="default-search"
                        className={`block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:outline-none focus:ring-0`}
                        placeholder="Search Mockups, Logos..."
                        required
                    />

                    {/* Search Button */}
                    <button
                        onClick={isMobile && toggleSearch}
                        type="submit"
                        className={`${isMobile ? 'p-1 m-1' : 'px-3 py-1'} text-white absolute right-2.5 bottom-1.5 bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-full text-sm dark:bg-primary-dark dark:hover:bg-primary-dark dark:focus:ring-primary-dark`}
                    >
                        {isMobile ? <IoMdCloseCircle /> : 'Search'}
                    </button>
                </div>
            </form>

            {/* Off-canvas Sidebar for sorting*/}
            <div
                style={{ zIndex: 100, minHeight: '100vh' }}
                className={`fixed top-20 rounded-md shadow-left left-0 h-full p-4 overflow-y-auto transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white w-80 dark:bg-gray-800`}
                aria-labelledby="drawer-label"
            >
                <h5 id="drawer-label" className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
                    Sort
                </h5>
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-controls="drawer-example"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <IoMdCloseCircle size={25} />
                </button>

                <div className='flex flex-wrap gap-3'>
                    <button onClick={toggleAgeSort} style={{ fontSize: '15px' }} className='border border-primary flex items-center bg-gray-200 cursor-pointer px-3 py-1 rounded-full'> AGE</button>

                    <button onClick={toggleIncomeSort} style={{ fontSize: '15px' }} className='border border-primary flex items-center bg-gray-200 cursor-pointer px-3 py-1 rounded-full'> INCOME</button>
                    <button onClick={toggleHeightSort} style={{ fontSize: '15px' }} className='border border-primary flex items-center bg-gray-200 cursor-pointer px-3 py-1 rounded-full'> HEIGHT</button>
                    <button onClick={toggleWeightSort} style={{ fontSize: '15px' }} className='border border-primary flex items-center bg-gray-200 cursor-pointer px-3 py-1 rounded-full'> WEIGHT</button>

                </div>
            </div>

            {/* Off-canvas Sidebar for filtering*/}
            <div
                style={{ zIndex: 100, minHeight: '100vh' }}
                className={`fixed top-20 rounded-md shadow-left left-0 h-full p-4 overflow-y-auto transition-transform ${isFilterSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white w-full lg:w-1/2 dark:bg-gray-800`}
                aria-labelledby="drawer-label"
            >
                <h5 id="drawer-label" className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
                    Filters
                </h5>
                <button
                    type="button"
                    onClick={() => setIsFilterSidebarOpen(false)}
                    aria-controls="drawer-example"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <IoMdCloseCircle size={25} />
                </button>

                <div className='flex gap-5'>
                    <div className='w-3/10'>
                        <button
                            onClick={() => handleButtonClick('subCaste')}
                            style={{ fontSize: '15px' }}
                            className='mb-3 w-full border flex items-center bg-gray-100 cursor-pointer px-3 py-1 rounded-md'>
                            subCaste
                        </button>
                        <button
                            onClick={() => handleButtonClick("education")}
                            style={{ fontSize: '15px' }}
                            className='mb-3 w-full border flex items-center bg-gray-100 cursor-pointer px-3 py-1 rounded-md'>
                            Education
                        </button>
                        <button
                            onClick={() => handleButtonClick("maritalStatus")}
                            style={{ fontSize: '15px' }}
                            className='mb-3 w-full border flex items-center bg-gray-100 cursor-pointer px-3 py-1 rounded-md'>
                            Marital Status
                        </button>
                        <button
                            onClick={() => handleButtonClick("star")}
                            style={{ fontSize: '15px' }}
                            className='mb-3 w-full border flex items-center bg-gray-100 cursor-pointer px-3 py-1 rounded-md'>
                            Star
                        </button>
                        <button
                            onClick={() => handleButtonClick("gothra")}
                            style={{ fontSize: '15px' }}
                            className='mb-3 w-full border flex items-center bg-gray-100 cursor-pointer px-3 py-1 rounded-md'>
                            Gothra
                        </button>
                        <button
                            onClick={() => handleButtonClick("raasi")}
                            style={{ fontSize: '15px' }}
                            className='mb-3 w-full border flex items-center bg-gray-100 cursor-pointer px-3 py-1 rounded-md'>
                            Raasi
                        </button>
                        <button
                            onClick={() => handleButtonClick("motherTongue")}
                            style={{ fontSize: '15px' }}
                            className='mb-3 w-full border flex items-center bg-gray-100 cursor-pointer px-3 py-1 rounded-md'>
                            Mother Tongue
                        </button>

                    </div>
                    <div className='w-full'>
                        {showSubCaste &&
                            subCasteOptions.map(opt => (
                                commonListFunction(opt, selectedSubCastes, setSelectedSubCastes)
                            ))
                        }
                        {showEducation &&
                            educationOptions.map(opt => (
                                commonListFunction(opt, selectedEducation, setSelectedEducation)
                            ))
                        }

                        {showMaritalStatus &&
                            maritalStatusOptions.map(opt => (
                                commonListFunction(opt, selectedMaritalStatus, setSelectedMaritalStatus)
                            ))
                        }
                        {showStar &&
                            starOptions.map(opt => (
                                commonListFunction(opt, selectedStar, setSelectedStar)
                            ))
                        }
                        {showRaasi &&
                            raasiOptions.map(opt => (
                                commonListFunction(opt, selectedRaasi, setSelectedRaasi)
                            ))
                        }
                        {showGothra &&
                            gothraOptions.map(opt => (
                                commonListFunction(opt, selectedGothra, setSelectedGothra)
                            ))
                        }
                        {showMotherTongue &&
                            indianLanguages.map(opt => (
                                commonListFunction(opt, selectedMotherTongue, setSelectedMotherTongue)
                            ))
                        }
                    </div>
                </div>
            </div>






        </>
    );
};

export default Search;
