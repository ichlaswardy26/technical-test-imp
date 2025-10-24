'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from './_non_route/lib/api';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await authApi.signin(email, password);
        router.push('/posts');
      } else {
        await authApi.signup(email, password);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">
            {isLogin ? 'Login' : 'Daftar'}
          </h2>

          {error && (
            <div className="alert alert-error shadow-lg">
              <div>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary mt-6 ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {isLogin ? 'Login' : 'Daftar'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="link link-primary"
            >
              {isLogin
                ? 'Belum punya akun? Daftar'
                : 'Sudah punya akun? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}