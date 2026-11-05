import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { login, setupAdmin } from '../../hooks/useApi';

interface AdminLoginProps {
  onAuthenticated: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'setup'>('login');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(password);
    setLoading(false);

    if (result.success) {
      onAuthenticated();
    } else if (result.needsSetup) {
      setMode('setup');
      setError('');
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await setupAdmin(password);
    setLoading(false);

    if (result.success) {
      onAuthenticated();
    } else {
      setError(result.error ?? 'Setup failed');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4">
            <Shield size={24} className="text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {mode === 'setup' ? 'Setup Admin' : 'Admin Access'}
          </h1>
          <p className="text-sm text-zinc-500">
            {mode === 'setup'
              ? 'Create your secure admin password'
              : 'Enter your password to continue'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={mode === 'setup' ? handleSetup : handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock size={15} className="text-zinc-600" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'setup' ? 'Create a strong password' : 'Enter your password'}
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-colors"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-600 hover:text-zinc-400"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {mode === 'setup' && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock size={15} className="text-zinc-600" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-950/50 border border-red-800/50 rounded-lg">
                <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-zinc-950 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {mode === 'setup' ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : mode === 'setup' ? (
                'Create Admin Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {mode === 'login' && (
            <p className="mt-4 text-center text-xs text-zinc-600">
              First time?{' '}
              <button
                type="button"
                onClick={() => { setMode('setup'); setError(''); }}
                className="text-yellow-400 hover:text-yellow-300 font-medium"
              >
                Set up admin account
              </button>
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-zinc-700">
          Admin access is private and not linked from the site
        </p>
      </div>
    </div>
  );
};

