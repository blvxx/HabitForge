import React, { useState } from 'react';
import { User } from '../types';
import { generateId } from '../utils';
import { Shield, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (!isLogin && !name) {
      setError('Введите ваше имя');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    // Load existing users
    const usersStr = localStorage.getItem('habitforge_users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        setError('Неверный email или пароль');
        return;
      }
      onLogin(user);
    } else {
      if (users.find(u => u.email === email)) {
        setError('Пользователь с таким email уже существует');
        return;
      }
      const newUser: User = {
        id: generateId(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
        remindersEnabled: false,
        reminderTime: '09:00',
      };
      users.push(newUser);
      localStorage.setItem('habitforge_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1f33] via-[#1e3a5f] to-[#2d5a8e] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#c9a227] mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">HabitForge</h1>
          <p className="text-gray-300 mt-2 text-sm">Выстраивайте привычки. Куйте характер.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                isLogin ? 'text-[#1e3a5f] border-b-2 border-[#c9a227]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Вход
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                !isLogin ? 'text-[#1e3a5f] border-b-2 border-[#c9a227]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm"
                  placeholder="Иван Петров"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white font-semibold rounded-lg transition-all shadow-lg shadow-[#1e3a5f]/20 hover:shadow-xl hover:shadow-[#1e3a5f]/30 text-sm"
            >
              {isLogin ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 HabitForge. Все права защищены.
        </p>
      </div>
    </div>
  );
}
