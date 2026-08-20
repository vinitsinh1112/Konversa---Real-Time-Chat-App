import React, { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import { useAuthStore } from '../store/authStore'

const LoginPage = () => {

    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(formData);

            navigate("/");

        } catch (error) {
            console.log(error);
        }
    }


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <>
            <AuthLayout>
                <div className='w-full max-w-md rounded-3xl border border-gray-800 bg-gray-950 p-8'>
                    <h1 className='text-3xl font-bold text-center'>Konversa</h1>

                    <p className='text-center text-gray-400 mt-2'>Welcome Back</p>

                    <form className='mt-8 space-y-5' onSubmit={handleSubmit}>

                        <Input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={formData.password}
                        />

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='w-full mt-4 py-3 rounded-xl bg-white text-black font-semibold cursor-pointer'
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    <p className='text-center text-gray-400 mt-6'>
                        Don't have an account?{" "}
                        <Link to="/register" className="text-white font-medium">Create Account</Link>
                    </p>

                </div>
            </AuthLayout>
        </>
    )
}

export default LoginPage
