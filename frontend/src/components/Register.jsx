
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../context/RegisterContext';
import { IoEyeOutline, IoEyeOffOutline, IoCloseOutline } from "react-icons/io5";
import LOGO from '../assets/LOGO.png';
import { clearError, loadUser, loginAuthError, loginAuthStatus, loginAuthUser, registerUser } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../utils/Spinner';

const Register = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { formData, updateFormData } = useRegister();
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData(name, value);
    };

    const [showPassword, setShowPassword] = useState(false);
    const error = useSelector(loginAuthError);
    const status = useSelector(loginAuthStatus);
    const user = useSelector(loginAuthUser);

    const profileFor = [
        { value: 'myself', label: 'Myself' },
        { value: 'daughter', label: 'Daughter' },
        { value: 'son', label: 'Son' },
        { value: 'friend', label: 'Friend' },
        { value: 'sister', label: 'Sister' },
        { value: 'brother', label: 'Brother' },
        { value: 'relative', label: 'Relative' },
    ];

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        profile: '',
        gender: '',
        apiError: ''
    });

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            password: '',
            profile: '',
            gender: ''
        };

        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.profileFor && !formData.gender) {
            newErrors.profile = 'Select your profile and gender';
            newErrors.gender = ''; 
        } else if (!formData.profileFor) {
            newErrors.profile = 'Profile is required';
            newErrors.gender = ''; 
        } else if (!formData.gender && (formData.profileFor === "myself" || formData.profileFor === "friend" || formData.profileFor === "relative")) {
            newErrors.gender = 'Select your gender';
            newErrors.profile = ''; 
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const autoGender = () => {
        if (formData.profileFor === "daughter" || formData.profileFor === "sister") {
            return 'female';
        } else if (formData.profileFor === "son" || formData.profileFor === "brother") {
            return 'male';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            let FormDatas = new FormData();
            FormDatas.append('name', formData.name);
            FormDatas.append('email', formData.email);
            FormDatas.append('password', formData.password);
            FormDatas.append('profileFor', formData.profileFor);
            FormDatas.append('gender', formData.gender);
            dispatch(registerUser(FormDatas));
            navigate('/register-form')
        }
    };

    useEffect(() => {
        if (formData.profileFor) {
            updateFormData('gender', formData.gender || autoGender());
        }

        if (error) {
            setErrors(prevErrors => ({
                ...prevErrors,
                apiError: error || '',
            }));
            dispatch(clearError());
        }
    }, [error, formData.profileFor]);

    useEffect(() => {
        if (status === 'succeeded') {
            dispatch(loadUser()); 
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (user && user.role === "user") {
            navigate('/register-form');
        }
    }, [user, navigate]);

    console.log(user);
    console.log(user?.role);


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full h-full sm:max-w-full sm:h-full lg:max-w-md lg:h-auto lg:mx-auto">
                <div className='flex justify-end'>
                    <IoCloseOutline
                        onClick={onClose}
                        className='cursor-pointer border border-gray-300 rounded-full hover:border-blue-500 text-2xl'
                    />
                </div>
                <div className='flex items-center mt-2 flex-col justify-between'>
                    <img src={LOGO} alt="VishwaKarma Weddings" width={150} height={150} />
                    <h2 className="w-full text-lg text-gray-800 mb-4 text-center">LET'S BEGIN</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(!formData.profileFor || formData.profileFor === "daughter" || formData.profileFor === "son" || formData.profileFor === "sister" || formData.profileFor === "brother") ? (
                            <div className="relative mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Profile For
                                </label>
                                <select
                                    name="profileFor"
                                    value={formData.profileFor}
                                    onChange={handleChange}
                                    className="focus:outline-none focus:ring-0 mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring focus:ring-opacity-50"
                                >
                                    <option value="">
                                        Select Profile
                                    </option>
                                    {profileFor.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.profile && <p className="text-red-500 text-sm mt-1">{errors.profile}</p>}
                            </div>
                        ) : (formData.profileFor === "myself" || formData.profileFor === "friend" || formData.profileFor === "relative") && (
                            <div className="relative mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="focus:outline-none focus:ring-0 mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring focus:ring-opacity-50"
                                >
                                    <option value="">
                                        Select Gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                            </div>
                        )}

                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                type="text"
                                className=" focus:outline-none focus:ring-0 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                placeholder="Enter your name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                className=" focus:outline-none focus:ring-0 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    className=" focus:outline-none focus:ring-0 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                    placeholder="Enter your password"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <IoEyeOffOutline className="text-gray-500" />
                                    ) : (
                                        <IoEyeOutline className="text-gray-500" />
                                    )}
                                </div>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                    </div>

                    {errors.apiError && (
                        <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {status === 'loading' ? <Spinner /> : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
