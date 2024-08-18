import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearError, clearPasswordReseted, loginAuthError, loginAuthStatus, loginIsAuthenticated, passwordResetted, resetPassword } from '../../slices/authSlice';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import Spinner from '../../utils/Spinner';

const ResetPassword = () => {
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const { token } = useParams();
    const dispatch = useDispatch();
    const LoginIsAuthenticated = useSelector(loginIsAuthenticated);
    const LoginAuthStatus = useSelector(loginAuthStatus);
    const LoginAuthError = useSelector(loginAuthError);
    const PasswordResetted = useSelector(passwordResetted);

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
        apiError: '',
        success: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (PasswordResetted) {
            setErrors(prevErrors => ({
                ...prevErrors,
                success: "Password Reset Successfully"
            }));
            dispatch(clearPasswordReseted());
            navigate('/');
        }
        if (LoginAuthError) {
            setErrors(prevErrors => ({
                ...prevErrors,
                apiError: LoginAuthError
            }));
            dispatch(clearError());
        }
    }, [PasswordResetted, LoginAuthError, dispatch, navigate]);

    const validateForm = () => {
        const newErrors = {
            password: '',
            confirmPassword: '',
            apiError: '',
            success: ''
        };

        if (!pass) newErrors.password = 'Password is required';
        if (!confirmPass) newErrors.confirmPassword = 'Confirm Password is required';
        if (pass !== confirmPass) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(prev => ({ ...prev, ...newErrors }));
        return !Object.values(newErrors).some(error => error);
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const obj = {
                password: pass,
                confirmPassword: confirmPass,
                token: token // Ensure token is passed here
            };
            dispatch(resetPassword(obj));
        }
    };

    const resetError = (field) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: '',
            apiError: '',
            success: ''
        }));
    };

    console.log(LoginAuthError)
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-lg w-full sm:max-w-md lg:max-w-md lg:mx-auto">
                <h1 className="text-2xl font-bold mb-6">New Password</h1>

                <form onSubmit={submitForm}>
                    <div className="relative mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <input
                                className="flex-1 p-2 border-none outline-none"
                                type={show1 ? 'text' : 'password'}
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                placeholder="Password"
                                onFocus={() => resetError('password')}
                            />
                            <button
                                type="button"
                                className="p-2"
                                onClick={() => setShow1(!show1)}
                            >
                                {show1 ? (
                                    <IoEyeOutline className="text-gray-500" fontSize="1.5rem" />
                                ) : (
                                    <IoEyeOffOutline className="text-gray-500" fontSize="1.5rem" />
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="relative mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <input
                                className="flex-1 p-2 border-none outline-none"
                                type={show2 ? 'text' : 'password'}
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                placeholder="Confirm Password"
                                onFocus={() => resetError('confirmPassword')}
                            />
                            <button
                                type="button"
                                className="p-2"
                                onClick={() => setShow2(!show2)}
                            >
                                {show2 ? (
                                    <IoEyeOutline className="text-gray-500" fontSize="1.5rem" />
                                ) : (
                                    <IoEyeOffOutline className="text-gray-500" fontSize="1.5rem" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {errors.apiError && <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>}
                    {errors.success && <p className="text-green-500 text-sm mt-1">{errors.success}</p>}

                    {LoginAuthStatus === "loading" ? (
                        <button
                            type="submit"
                            className="w-full mt-4 py-2 px-4 bg-primary text-white font-bold rounded-md flex items-center justify-center"
                            disabled
                        >
                            <Spinner />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="w-full mt-4 py-2 px-4 bg-primary text-white font-bold rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Set Password
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
