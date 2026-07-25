import React, { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import { useAuthStore } from '../store/authStore'


const RegisterPage = () => {

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { register, isLoading } = useAuthStore();
    const navigate = useNavigate();


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await register(formData);

            navigate("/");

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <AuthLayout>
                <div className='w-full max-w-md rounded-3xl border border-gray-800 bg-gray-950 p-8'>

                    <h1 className='text-3xl font-bold text-center'>Konversa</h1>

                    <p className='text-center text-gray-400 mt-2'>Create Account</p>

                    <form className='mt-8 space-y-5' onSubmit={handleSubmit}>

                        <Input
                            type='text'
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder='Full Name'
                        />

                        <Input
                            type='text'
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder='Email'
                        />

                        <Input
                            type='password'
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder='Password'
                        />

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='w-full mt-4 py-3 rounded-xl bg-white text-black font-semibold cursor-pointer'
                        >
                            {isLoading ? "Creating..." : "Create Account"}
                        </button>

                    </form>

                    <p className='text-center text-gray-400 mt-6'>
                        Already have an account ? {" "}
                        <Link to="/login" className='text-white font-medium'>Login</Link>
                    </p>

                </div>
            </AuthLayout>
        </>
    )
}

export default RegisterPage
