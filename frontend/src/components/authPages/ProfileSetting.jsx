import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, clearStatus, clearUpdated, editUser, isUpdated, loadUser, loginAuthError, loginAuthStatus, loginAuthUser, logoutUser, updateAvatar } from '../../slices/authSlice';
import { MdModeEdit } from "react-icons/md";
import { useRegister } from '../../context/RegisterContext';
import Select from 'react-select';
import { countries } from 'countries-list';
import { states, cities } from '../../utils/Data';
import {
    gothraOptions, chevvaiDoshamOptions, starOptions,
    raasiOptions, maritalStatusOptions, indianLanguages, subCasteOptions, familyStatusOptions, familyTypeOptions,
    physicalStatusOptions, educationOptions
} from '../../utils/Options'
import Spinner from '../../utils/Spinner';
import { useNavigate } from 'react-router-dom';


const ProfileSetting = () => {
    const dispatch = useDispatch();
    const { formData, updateFormData, resetFormData } = useRegister();
    const navigate = useNavigate()

    const [error, setError] = useState(null);
    const loginError = useSelector(loginAuthError);
    const status = useSelector(loginAuthStatus);
    const user = useSelector(loginAuthUser);
    const IsUpdated = useSelector(isUpdated)

    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
    const [isEditingAvatar, setIsEditingAvatar] = useState(false)


    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            Object.entries(user).forEach(([key, value]) => {
                updateFormData(key, value);
            });
        }
        setAvatarPreview(user?.avatar)
    }, [user, avatar]);

    useEffect(() => {
        dispatch(loadUser());
        if (loginError) {
            setError(loginError);
            dispatch(clearError());
        }
    }, [dispatch, loginError]);

    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const userDOB = new Date(user?.DOB);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDOB = userDOB.toLocaleDateString('en-US', options);

    console.log("FORMDATA", formData);
    console.log("USER", user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData(name, value);
    };

    const handleDropChange = (selectedOption, actionMeta) => {
        console.log(selectedOption)
        const { name } = actionMeta;
        updateFormData(name, selectedOption)
    };
    const countryOptions = Object.keys(countries).map(code => ({
        value: code,
        label: countries[code].name
    }));

    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    useEffect(() => {
        if (formData.country) {
            const selectedCountryStates = states[formData.country] || [];
            const stateOptions = selectedCountryStates.map(state => ({ value: state, label: state }));
            setStateOptions(stateOptions);
        } else {
            setStateOptions([]);
        }

        if (formData.state) {
            const selectedCity = cities[formData.state] || [];
            console.log("selectedCity", selectedCity, formData.state)
            const stateOptions = selectedCity.map(city => ({ value: city, label: city }));
            setCityOptions(stateOptions);
        } else {
            setCityOptions([]);
        }

        if (IsUpdated) {
            dispatch(clearUpdated())
        }
    }, [formData.country, IsUpdated, formData.state]);


    const handleSubmit = (e) => {
        e.preventDefault();
        let FormDatas = new FormData();
        FormDatas.append('subCaste', formData.subCaste);
        FormDatas.append('motherTongue', formData.motherTongue);
        FormDatas.append('maritalStatus', formData.maritalStatus);
        FormDatas.append('height', formData.height);
        FormDatas.append('weight', formData.weight);
        FormDatas.append('star', formData.star);
        FormDatas.append('raasi', formData.raasi);
        FormDatas.append('gothra', formData.gothra);
        FormDatas.append('chevvaiDosham', formData.chevvaiDosham);
        FormDatas.append('phoneNumber', formData.phoneNumber);
        FormDatas.append('city', formData.city);
        FormDatas.append('country', formData.country);
        FormDatas.append('state', formData.state);
        FormDatas.append('education', formData.education);
        FormDatas.append('occupation', formData.occupation);
        FormDatas.append('income', formData.income);
        FormDatas.append('physicalStatus', formData.physicalStatus);
        FormDatas.append('familyStatus', formData.familyStatus);
        FormDatas.append('familyType', formData.familyType);
        FormDatas.append('about', formData.about);
        FormDatas.append('name', formData.name);
        dispatch(editUser(FormDatas))
        handleEditClick()
        resetFormData()
    };

    const handleLogout = () => {
        resetFormData()
        dispatch(logoutUser());
        dispatch(clearStatus());
        navigate('/')
    };

    const handleAvatar = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('avatar', avatar);
    }


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        if (file) {
            setIsEditingAvatar(true)
            dispatch(clearError());

        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const submitAvatarUpdate = (e) => {
        e.preventDefault();
        let avatarData = new FormData();
        avatarData.append('avatar', avatar);
        dispatch(updateAvatar(avatarData));

        setAvatarPreview(user?.avatar)
        setIsEditingAvatar(false)
    };

    const cancelAvatarUpdate = (e) => {
        e.preventDefault();
        setIsEditingAvatar(false)
        setAvatar('')
        setAvatarPreview(user?.avatar)
    }

    const triggerFileInput = () => {
        document.getElementById('avatarInput').click();
    };
    return (
        <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
            <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                <div className="mt-10 sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
                    <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
                    <a href="#"
                        className="flex items-center px-3 py-2.5 border rounded-full font-semibold  hover:text-primary hover:border-primary-light hover:rounded-full">
                        Pubic Profile
                    </a>
                    <a href="#"
                        className="flex items-center px-3 py-2.5 border rounded-full font-semibold  hover:text-primary hover:border-primary-light hover:rounded-full">
                        Account Settings
                    </a>
                    <a href="#"
                        className="flex items-center px-3 py-2.5  border rounded-full font-semibold hover:text-primary hover:border-primary-light  hover:rounded-full  ">
                        Notifications
                    </a>
                    <a href="#"
                        className="flex items-center px-3 py-2.5  border rounded-full font-semibold hover:text-primary hover:border-primary-light  hover:rounded-full  ">
                        PRO Account
                    </a>
                </div>
            </aside>
            <main className="w-full  md:flex  md:justify-center min-h-screen py-1  lg:w-3/4">
                <div className="p-2 md:p-4 md:w-full md:flex  md:justify-center">
                    <div className=" w-full px-6 pb-8 mt-10 pt-5 sm:max-w-xl sm:rounded-lg">
                        <h2 className="text-2xl font-bold sm:text-xl">Public Profile</h2>
                        <div className="grid max-w-2xl mx-auto mt-8">
                            <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                <img className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-primary-light "
                                    src={avatarPreview}
                                    alt="Bordered avatar" />

                                <div className="flex flex-col space-y-5 sm:ml-8">
                                    {error && <span className='text-red-500 py-3'>{error}</span>}

                                    {isEditingAvatar ? <div className='flex gap-3'> <button
                                        type="button"
                                        onClick={submitAvatarUpdate}
                                        className="py-3.5 px-7 text-base font-bold text-white focus:outline-none bg-blue-600 rounded-lg"
                                    >
                                        Update
                                    </button>
                                        <button
                                            type="button"
                                            onClick={cancelAvatarUpdate}
                                            className="py-3.5 px-7 text-base font-bold text-white focus:outline-none bg-red-500 rounded-lg"
                                        >
                                            Delete
                                        </button>
                                    </div> :
                                        <> <input
                                            type="file"
                                            name="avatar"
                                            id="avatarInput"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="py-3.5 px-7 text-base font-bold text-white bg-blue-500 rounded-lg"
                                            >
                                                Choose Avatar
                                            </button></>
                                    }
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="py-3.5 px-7 text-base font-bold text-white focus:outline-none bg-red-500 rounded-lg  "
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>

                            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                <div className='flex w-full  justify-end'>
                                    <button onClick={handleEditClick} className="border border-gray-300 bg-gray-100 p-2 rounded-md   mb-4 text-black font-semibold">
                                        {isEditing ? 'Cancel' : <div className='flex gap-2 items-center'><MdModeEdit /> Edit  </div>}
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit}>

                                    <div className="w-full mb-3">
                                        <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                            About Us
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                type="text"
                                                id="about"
                                                name='about'
                                                className="border border-black text-sm rounded-lg block w-full p-2.5 focus:outline-none"
                                                placeholder="About Us"
                                                defaultValue={formData?.about}
                                                onChange={handleChange}

                                            />
                                        ) : (
                                            <p className="border border-primary rounded-md p-2.5">{user?.about || 'NONE'}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    id="first_name"
                                                    name='name'
                                                    className="border border-black text-sm rounded-lg block w-full p-2.5 focus:outline-none"
                                                    placeholder="Enter your name"
                                                    defaultValue={formData?.name}
                                                    onChange={handleChange}

                                                />
                                            ) : (
                                                <p className="border border-primary  rounded-md p-2.5 ">
                                                    {user?.name}
                                                </p>)}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Date Of Birth
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    id="dob"
                                                    className="border border-black text-sm rounded-lg block w-full p-2.5 focus:outline-none"
                                                    placeholder="Your DOB"
                                                    defaultValue={formattedDOB}
                                                    onChange={handleChange}
                                                    name='DOB'

                                                />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{formattedDOB}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Email
                                            </label>
                                            <p className="border border-primary  rounded-md p-2.5 ">
                                                {user?.email}
                                            </p>
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Phone Number
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    id="phoneNumber"
                                                    className="border border-black text-sm rounded-lg block w-full p-2.5 focus:outline-none"
                                                    placeholder="Your Phone Number"
                                                    defaultValue={formData?.phoneNumber}
                                                    onChange={handleChange}
                                                    name='phoneNumber'

                                                />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.phoneNumber}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Height
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    id="height"
                                                    className="border border-black text-sm rounded-lg block w-full p-2.5 focus:outline-none"
                                                    placeholder="Your Height in CM"
                                                    defaultValue={formData.height}
                                                    onChange={handleChange}
                                                    name='height'

                                                />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.height || 'NONE'}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Weight
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    id="weight"
                                                    className="border border-black text-sm rounded-lg block w-full p-2.5 focus:outline-none"
                                                    placeholder="Your Weight in KG"
                                                    defaultValue={formData.weight}
                                                    onChange={handleChange}
                                                    name='weight'

                                                />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.weight || 'NONE'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Occupation
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    id="occupation"
                                                    className="border border-black text-sm rounded-lg block w-full p-2.5 focus:outline-none"
                                                    placeholder="Your Occupation"
                                                    defaultValue={formData.occupation}
                                                    onChange={handleChange}
                                                    name='occupation'
                                                />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.occupation || 'NONE'}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Income
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    id="income"
                                                    className="border border-black text-sm rounded-lg block w-full p-2.5 focus:outline-none"
                                                    placeholder="Your monthly income"
                                                    defaultValue={formData.income}
                                                    onChange={handleChange}
                                                    name='income'

                                                />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.income || 'NONE'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Education
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={educationOptions}
                                                    value={educationOptions.find(option => option.label === formData.education) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'education' })}
                                                    placeholder="Select Education" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.education || 'NONE'}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Physical Status
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={physicalStatusOptions}
                                                    value={physicalStatusOptions.find(option => option.label === formData.physicalStatus) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'physicalStatus' })}
                                                    placeholder="Select Physical Status" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.physicalStatus || 'NONE'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Family Status
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={familyStatusOptions}
                                                    value={familyStatusOptions.find(option => option.label === formData.familyStatus) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'familyStatus' })}
                                                    placeholder="Select Family Status" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.familyStatus || 'NONE'}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Family Type
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={familyTypeOptions}
                                                    value={familyTypeOptions.find(option => option.label === formData.familyType) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'familyType' })}
                                                    placeholder="Select Family Type" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.familyType || 'NONE'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Raasi
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={raasiOptions}
                                                    value={raasiOptions.find(option => option.value === formData.raasi) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'raasi' })}
                                                    placeholder="Select Raasi" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.raasi || 'NONE'}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Star
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={starOptions}
                                                    value={starOptions.find(option => option.value === formData.star) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'star' })}
                                                    placeholder="Select Star" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.star || 'NONE'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Chevvai Dhosam
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={chevvaiDoshamOptions}
                                                    value={chevvaiDoshamOptions.find(option => option.value === formData.chevvaiDosham) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'chevvaiDosham' })}
                                                    placeholder="Select Chevvai Dosham" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.chevvaiDosham || 'NONE'}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Gothra
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={gothraOptions}
                                                    value={gothraOptions.find(option => option.value === formData.gothra) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'gothra' })}
                                                    placeholder="Select Gothra" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.gothra || 'NONE'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Sub Caste
                                            </label>
                                            {isEditing ? (

                                                <Select
                                                    options={subCasteOptions}
                                                    value={subCasteOptions.find(option => option.value === formData.subCaste) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'subCaste' })}
                                                    placeholder="Select SubCaste" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.subCaste || 'NONE'}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Mother Tongue
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={indianLanguages}
                                                    value={indianLanguages.find(option => option.value === formData.motherTongue) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'motherTongue' })}
                                                    placeholder="Select Mother Tongue" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.motherTongue || 'NONE'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Country
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={countryOptions}
                                                    value={countryOptions.find(option => option.label === formData.country) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'country' })}
                                                    placeholder="Select Country" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.country || 'NONE'}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                State
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={stateOptions}
                                                    value={stateOptions.find(option => option.label === formData.state) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'state' })}
                                                    placeholder="Select state" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.state || 'NONE'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                City
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={cityOptions}
                                                    value={cityOptions.find(option => option.label === formData.city) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'city' })}
                                                    placeholder="Select city" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.city || 'NONE'}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text dark:text-white">
                                                Marital Status
                                            </label>
                                            {isEditing ? (
                                                <Select
                                                    options={maritalStatusOptions}
                                                    value={maritalStatusOptions.find(option => option.value === formData.maritalStatus) || null}
                                                    onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'maritalStatus' })}
                                                    placeholder="Select Marital Status" />
                                            ) : (
                                                <p className="border border-primary rounded-md p-2.5">{user?.maritalStatus || 'NONE'}</p>
                                            )}
                                        </div>
                                    </div>

                                    {error && <span className='text-red-500 py-3'>{error}</span>}
                                    {isEditing && (
                                        <div className="flex justify-end">
                                            <button
                                                disabled={status === "loading"}
                                                type="submit"
                                                className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-dark font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                            >
                                                {status === "loading" ? <Spinner /> : 'Save'}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfileSetting;
