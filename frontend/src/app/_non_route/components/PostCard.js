import { useRouter } from 'next/navigation';
import { postApi } from '../lib/api';
import Image from 'next/image';

export default function PostCard({ post }) {
    const handleDelete = async () => {
        if (confirm('Yakin hapus postingan ini?')) {
            await postApi.delete(post.id);
            window.location.reload();
        }
    };

     const router = useRouter();

    return (
        <div className="card bg-base-100 shadow-xl">
            {post.thumbnail && (
                <figure>
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        width={100}
                        height={192}
                    />
                </figure>
            )}
            <div className="card-body">
                <h2 className="card-title">{post.title}</h2>
                <p className="line-clamp-2">{post.content}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </span>
                    <div className="space-x-2">
                        <button onClick={() => router.push('/posts/' + post.id)} className="btn btn-sm btn-ghost">
                            Lihat
                        </button>
                        <button onClick={handleDelete} className="btn btn-sm btn-error">
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}