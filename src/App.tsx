import { useState, useEffect } from 'react';
import { User, GoodHabit, BadHabit } from './types';
import { loadState, saveState } from './utils';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GoodHabits from './components/GoodHabits';
import QuitTimer from './components/QuitTimer';
import TelegramSettings from './components/TelegramSettings';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [goodHabits, setGoodHabits] = useState<GoodHabit[]>([]);
  const [badHabits, setBadHabits] = useState<BadHabit[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const state = loadState();
    if (state.user) {
      setUser(state.user);
      setGoodHabits(state.goodHabits || []);
      setBadHabits(state.badHabits || []);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      saveState({ user, goodHabits, badHabits });
    }
  }, [user, goodHabits, badHabits, initialized]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Load user-specific data
    const state = loadState();
    if (state.user && state.user.id === loggedInUser.id) {
      setGoodHabits(state.goodHabits || []);
      setBadHabits(state.badHabits || []);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setGoodHabits([]);
    setBadHabits([]);
    setActiveTab('dashboard');
    localStorage.removeItem('habitforge_current_user');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard goodHabits={goodHabits} badHabits={badHabits} userName={user.name} />;
      case 'good-habits':
        return <GoodHabits habits={goodHabits} onUpdate={setGoodHabits} />;
      case 'quit-timer':
        return <QuitTimer habits={badHabits} onUpdate={setBadHabits} />;
      case 'telegram':
        return <TelegramSettings user={user} onUpdate={handleUpdateUser} />;
      default:
        return <Dashboard goodHabits={goodHabits} badHabits={badHabits} userName={user.name} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#0f1f33] z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-white font-bold">HabitForge</h1>
        <div className="w-10" />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          user={user}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-5xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
