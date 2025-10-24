'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { postApi, getAuthToken } from '../../_non_route/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function PostDetail({ params }) {
    const { id } = params;
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            toast.error('Silakan login untuk melihat postingan');
            router.push('/');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser(payload);
        } catch (e) {
            console.warn('Token tidak valid');
        }

        const fetchPost = async () => {
            try {
                const data = await postApi.getById(id);
                setPost(data);
            } catch (err) {
                console.error('Gagal muat postingan:', err);
                toast.error(err.message || 'Postingan tidak ditemukan');
                router.push('/posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, router]);

    const handleDelete = async () => {
        if (!confirm('Yakin ingin menghapus postingan ini?')) return;

        try {
            await postApi.delete(id);
            toast.success('Postingan berhasil dihapus');
            router.push('/posts');
        } catch (err) {
            toast.error(err.message || 'Gagal menghapus');
        }
    };

    const handleEdit = () => {
        toast.info('Fitur edit belum tersedia');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-error shadow-lg">
                    <div>
                        <span>Postingan tidak ditemukan</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            {post.thumbnail && (
                <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full! h-64! !md:h-96 object-cover"
                        width={800}
                        height={400}
                    />
                </div>
            )}

            <article className="bg-base-100 rounded-xl shadow-md p-6">
                <header className="mb-4">
                    <h1 className="text-3xl font-bold text-primary mb-2">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>oleh {post.user?.email || 'Anonim'}</span>
                        <span>•</span>
                        <time>
                            {new Date(post.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                    </div>
                </header>

                <div className="prose prose-lg max-w-none mt-4">
                    <p className="whitespace-pre-line">{post.content}</p>
                </div>
            </article>

            {user && user.sub === post.userId && (
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        onClick={handleEdit}
                        className="btn btn-outline btn-info"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn btn-error"
                    >
                        Hapus
                    </button>
                </div>
            )}

            <div className="mt-8">
                <Link href="/posts" className="btn btn-ghost">
                    ← Kembali ke Daftar
                </Link>
            </div>
        </div>
    );
}