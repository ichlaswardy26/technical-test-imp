const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

export const setAuthToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
    }
};

export const clearAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
    }
};

const api = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const res = await fetch(url, config);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${res.status}`);
    }

    return res.json();
};

export const authApi = {
    signup: (email, password) =>
        api('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }).then((data) => {
            return data;
        }),

    signin: (email, password) =>
        api('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }).then((data) => {
            setAuthToken(data.token);
            return data;
        }),

    signout: () => {
        api('/auth/signout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        }).then((data) => {
            clearAuthToken();
            return data;
        })
    },
};

export const postApi = {
    list: (page = 1, limit = 10) =>
        api(`/posts?page=${page}&limit=${limit}`),

    getById: (id) => api(`/posts/${id}`),

    create: (formData) =>
        fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: formData,
        }).then((res) => {
            if (!res.ok) throw new Error('Gagal buat postingan');
            return res.json();
        }),

    update: (id, title, content) =>
        api(`/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content }),
        }),

    delete: (id) =>
        api(`/posts/${id}`, {
            method: 'DELETE',
        }),
};
