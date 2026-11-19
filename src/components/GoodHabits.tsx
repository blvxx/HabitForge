import React, { useState } from 'react';
import { GoodHabit } from '../types';
import { generateId, getToday } from '../utils';
import { Plus, Trash2, Check, Flame, X, Target } from 'lucide-react';

interface GoodHabitsProps {
  habits: GoodHabit[];
  onUpdate: (habits: GoodHabit[]) => void;
}

const CATEGORIES = ['Здоровье', 'Спорт', 'Образование', 'Работа', 'Саморазвитие', 'Финансы', 'Другое'];

export default function GoodHabits({ habits, onUpdate }: GoodHabitsProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Здоровье');

  const today = getToday();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHabit: GoodHabit = {
      id: generateId(),
      name: name.trim(),
      description: description.trim(),
      streak: 0,
      lastCompleted: null,
      completedDates: [],
      category,
      createdAt: new Date().toISOString(),
    };

    onUpdate([...habits, newHabit]);
    setName('');
    setDescription('');
    setShowForm(false);
  };

  const handleComplete = (id: string) => {
    const updated = habits.map(h => {
      if (h.id !== id) return h;

      const isCompletedToday = h.lastCompleted === today;
      if (isCompletedToday) return h;

      // Calculate streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const newStreak = h.lastCompleted === yesterdayStr ? h.streak + 1 : 1;

      return {
        ...h,
        lastCompleted: today,
        streak: newStreak,
        completedDates: [...h.completedDates, today],
      };
    });
    onUpdate(updated);
  };

  const handleDelete = (id: string) => {
    onUpdate(habits.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">Хорошие привычки</h2>
          <p className="text-gray-500 mt-1">Формируйте полезные привычки каждый день</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#1e3a5f]/20"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Отмена' : 'Добавить'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Новая привычка</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Название</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm"
                placeholder="Например: Медитация 10 минут"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Описание</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm"
                placeholder="Краткое описание привычки"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#c9a227] hover:bg-[#e6c34d] text-white font-semibold rounded-lg transition-all text-sm"
            >
              Создать привычку
            </button>
          </form>
        </div>
      )}

      {/* Habits List */}
      {habits.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Нет привычек</h3>
          <p className="text-gray-400 text-sm">Начните формировать полезные привычки прямо сейчас</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {habits.map(habit => {
            const isCompletedToday = habit.lastCompleted === today;
            return (
              <div key={habit.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleComplete(habit.id)}
                    disabled={isCompletedToday}
                    className={`mt-1 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isCompletedToday
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-[#c9a227] hover:bg-[#c9a227]/10'
                    }`}
                  >
                    {isCompletedToday && <Check className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${isCompletedToday ? 'text-green-700' : 'text-[#1e3a5f]'}`}>
                        {habit.name}
                      </h4>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{habit.category}</span>
                    </div>
                    {habit.description && (
                      <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Flame className={`w-4 h-4 ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
                        <span className={`font-medium ${habit.streak > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                          {habit.streak} {habit.streak === 1 ? 'день' : habit.streak < 5 ? 'дня' : 'дней'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        Всего выполнено: {habit.completedDates.length}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


