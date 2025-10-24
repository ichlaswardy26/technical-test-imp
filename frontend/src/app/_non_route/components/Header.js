"use client";

import { authApi } from '../lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const Header = () => {
    const router = useRouter();

    const handleLogout = () => {
        authApi.signout();
        toast.success('Berhasil logout!', { position: 'top-center' });
        router.push('/');
    };

    return (<header style={{ padding: '1rem', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <a className="text-xl">Frontend CRUD</a>
            </div>
            <div className="navbar-end">
                <button onClick={handleLogout} className="btn">Logout</button>
            </div>
        </div>
    </header>)
};

export default Header;