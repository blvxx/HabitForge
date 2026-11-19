import { GoodHabit, BadHabit } from '../types';
import { getToday, getHoursSince, formatDuration } from '../utils';
import { Target, Clock, Flame, TrendingUp, Award, Zap } from 'lucide-react';

interface DashboardProps {
  goodHabits: GoodHabit[];
  badHabits: BadHabit[];
  userName: string;
}

export default function Dashboard({ goodHabits, badHabits, userName }: DashboardProps) {
  const today = getToday();
  const completedToday = goodHabits.filter(h => h.lastCompleted === today).length;
  const totalStreak = goodHabits.reduce((sum, h) => sum + h.streak, 0);
  const longestQuit = badHabits.length > 0
    ? Math.max(...badHabits.map(h => getHoursSince(h.quitDate)))
    : 0;

  const stats = [
    {
      label: 'Выполнено сегодня',
      value: `${completedToday}/${goodHabits.length}`,
      icon: Target,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Общая серия',
      value: `${totalStreak} дн`,
      icon: Flame,
      color: 'bg-orange-50 text-orange-600',
      iconBg: 'bg-orange-100',
    },
    {
      label: 'Без вредных привычек',
      value: formatDuration(longestQuit),
      icon: Clock,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Всего привычек',
      value: `${goodHabits.length + badHabits.length}`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Добро пожаловать, {userName} 👋</h2>
        <p className="text-gray-500 mt-1">Вот ваш прогресс на сегодня</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1e3a5f]">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Habits */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#c9a227]" />
          Хорошие привычки на сегодня
        </h3>
        {goodHabits.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">
            Добавьте свои первые привычки во вкладке «Хорошие привычки»
          </p>
        ) : (
          <div className="space-y-3">
            {goodHabits.map(habit => {
              const isCompleted = habit.lastCompleted === today;
              return (
                <div key={habit.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isCompleted ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                    {isCompleted && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>{habit.name}</p>
                    <p className="text-xs text-gray-400">{habit.category} • Серия: {habit.streak} дн</p>
                  </div>
                  {isCompleted && <Award className="w-4 h-4 text-green-500" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quit Progress */}
      {badHabits.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#c9a227]" />
            Прогресс отказа от привычек
          </h3>
          <div className="space-y-3">
            {badHabits.map(habit => {
              const hours = getHoursSince(habit.quitDate);
              return (
                <div key={habit.id} className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-green-800">Без: {habit.name}</p>
                    <span className="text-sm font-bold text-green-600">{formatDuration(hours)}</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((hours / 720) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-600 mt-2">{habit.motivation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
