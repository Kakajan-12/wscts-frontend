'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await axios.post('/api/auth/logout', {}, { withCredentials: true });
        router.push('/login');
        router.refresh();
    };

    return (
        <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
            Выйти
        </button>
    );
}