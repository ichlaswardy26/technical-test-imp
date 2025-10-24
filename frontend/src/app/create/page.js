'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { postApi, getAuthToken } from '../_non_route/lib/api';
import toast from 'react-hot-toast';
import { withAuth } from '../_non_route/lib/withAuth';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();

    if (!getAuthToken()) {
        router.push('/');
        return null;
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setThumbnail(null);
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP.', {
                position: 'top-right',
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 5MB', { position: 'top-right' });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setThumbnail(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error('Judul dan isi postingan wajib diisi', { position: 'top-right' });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('content', content.trim());
        if (thumbnail) {
            formData.append('thumbnailFile', thumbnail);
        }

        try {
            await postApi.create(formData);
            toast.success('Postingan berhasil dibuat!', { position: 'top-right' });

            setTitle('');
            setContent('');
            setThumbnail(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            router.push('/posts');
        } catch (err) {
            console.error('Create post error:', err);
            toast.error(err.message || 'Gagal membuat postingan', { position: 'top-right' });
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Buat Postingan Baru</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">
                        <span className="label-text">Judul</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Masukkan judul..."
                        required
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text">Isi Postingan</span>
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="textarea textarea-bordered w-full h-40"
                        placeholder="Tulis sesuatu..."
                        required
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text">Thumbnail (opsional)</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full"
                        ref={fileInputRef}
                    />
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
            </form>
        </div>
    );
}

export default withAuth(CreatePost);