import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Input = ({ type, placeholder, name, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <div className="relative">
            <input
                type={isPassword && showPassword ? "text" : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-900 border border-gray-700 outline-none focus:border-white"
            />

            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
            )}
        </div>
    );
};

export default Input;
