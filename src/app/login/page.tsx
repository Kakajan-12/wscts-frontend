'use client';

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface ErrorResponse {
    message?: string;
}

export default function LoginPage() {
    const router = useRouter();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await axios.post(
                "/api/auth/login",
                { phone, password },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (res.status === 200) {
                console.log('Login successful:', res.data);
                router.push('/tk');
                router.refresh();
            }

        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            console.error('Login error:', err);

            if (err.code === 'ECONNREFUSED') {
                setError("Cannot connect to server. Please try again.");
            } else if (err.response?.status === 401) {
                setError("Invalid phone or password");
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || "Invalid input");
            } else {
                setError(err.response?.data?.message || "Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleLogin}
                className="p-8 bg-white space-y-4 rounded-lg shadow-lg w-96"
            >
                <div className="flex flex-col items-center space-y-4">
                    <Image src="/icon.png" alt="logo" width={60} height={60}/>
                    <p className="text-xl text-center font-medium">
                        Türkmenistanyň suw hojalygy baradaky döwlet komiteti
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <input
                    type="tel"
                    placeholder="Phone"
                    className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white p-3 w-full rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {isLoading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}