'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuthToken, postApi } from '../_non_route/lib/api';
import PostCard from '../_non_route/components/PostCard';
import toast from 'react-hot-toast';

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
    });
    const [loading, setLoading] = useState(true);

    const loadPosts = async (page = 1) => {
        setLoading(true);
        try {
            const data = await postApi.list(page, 10);
            setPosts(data.posts);
            setPagination(data.pagination);
        } catch (err) {
            toast.error('Gagal memuat postingan', { position: 'top-right' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();

        if (!getAuthToken()) {
            router.push('/');
        }
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            loadPosts(newPage);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Semua Postingan</h1>
                <Link href="/create" className="btn btn-primary">
                    + Buat Postingan
                </Link>
            </div>

            <div className="grid gap-6">
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">Belum ada postingan.</p>
                ) : (
                    posts.map((post) => <PostCard key={post.id} post={post} />)
                )}
            </div>

            {pagination.pages > 1 && (
                <div className="join flex justify-center mt-8">
                    <button
                        className="join-item btn"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        «
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                        <button
                            key={i + 1}
                            className={`join-item btn ${pagination.page === i + 1 ? 'btn-active' : ''
                                }`}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="join-item btn"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                    >
                        »
                    </button>
                </div>
            )}
        </div>
    );
}