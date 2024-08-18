
import React, { useState, useEffect } from 'react';
import { IoEyeOutline, IoEyeOffOutline, IoCloseOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { clearError, clearStatus, forgotPassword, loginAuthError, loginAuthStatus, loginIsAuthenticated, loginUser, Message } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../utils/Spinner';
import LOGO from '../assets/LOGO.png';

const Login = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const error = useSelector(loginAuthError);
    const status = useSelector(loginAuthStatus);
    const isAuthenticated = useSelector(loginIsAuthenticated);
    const forgotPasswordMessage = useSelector(Message);

    const [email, setEmail] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        apiError: '',
        forgotPassword: '',
        forgotPasswordSuccess: ''
    });

    useEffect(() => {
        if(error){
        setErrors(prevErrors => ({
            ...prevErrors,
            apiError: error || '',
            forgotPasswordSuccess: forgotPasswordMessage || ''
        }));
        dispatch(clearError())
    
    }
    }, [error, forgotPasswordMessage]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
            onClose();
        }
    }, [isAuthenticated, navigate, onClose]);

    const validateForm = () => {
        const newErrors = { email: '', password: '', forgotPassword: '' };

        if (!isForgotPassword) {
            if (!email) newErrors.email = 'Email is required';
            if (!password) newErrors.password = 'Password is required';
        } else {
            if (!forgotEmail) newErrors.forgotPassword = 'Email is required';
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(loginUser({ email, password }));
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(forgotPassword(forgotEmail));
        }
    };

    const resetError = () => {
        setErrors({
            email: '',
            password: '',
            apiError: '',
            forgotPassword: '',
            forgotPasswordSuccess: ''
        })
    }

    console.log(status)

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
                    <h2 className="w-full text-lg text-gray-800 mb-4 text-center">Welcome back! Please Login</h2>
                </div>
                {!isForgotPassword ? (
                    <form onSubmit={handleSubmit}>
                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                name='email'
                                onFocus={resetError}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0"
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                name='password'
                                onFocus={resetError}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-2"
                            >
                                {showPassword ? (
                                    <IoEyeOutline className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                ) : (
                                    <IoEyeOffOutline className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                )}
                            </button>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className='flex justify-end'>
                            <button type='button' onClick={() => setIsForgotPassword(!isForgotPassword)} className='text-primary text-xs'>Forgot Password?</button>
                        </div>

                        {errors.apiError && <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className={`mt-5 w-full py-2 px-4 rounded-md text-white font-bold ${status === "loading" ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200`}
                        >
                            {status === "loading" ? <Spinner /> : "LOGIN"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPassword}>
                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                onFocus={resetError}
                                name='email'
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                type="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0"
                                placeholder="Enter your email"
                            />
                            {errors.forgotPassword && <p className="text-red-500 text-sm mt-1">{errors.forgotPassword}</p>}
                        </div>

                        <div className='flex justify-end'>
                            <button type='button' onClick={() => setIsForgotPassword(!isForgotPassword)} className='text-primary text-xs'>Login?</button>
                        </div>
                        {errors.apiError && <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>}
                        {errors.forgotPasswordSuccess && <p className="text-green-500 text-sm mt-1">{errors.forgotPasswordSuccess}</p>}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className={`mt-5 w-full py-2 px-4 rounded-md text-white font-bold ${status === "loading" ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200`}
                        >
                            {status === "loading" ? <Spinner /> : "SEND RESET LINK"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
