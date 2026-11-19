import React, { useState, useEffect } from 'react';
import { BadHabit, HealthBenefit } from '../types';
import { generateId, getHoursSince, formatDuration, getHealthBenefitsForHabit } from '../utils';
import { Plus, Trash2, Clock, Heart, Award, X, CheckCircle, AlertTriangle } from 'lucide-react';

interface QuitTimerProps {
  habits: BadHabit[];
  onUpdate: (habits: BadHabit[]) => void;
}

const POPULAR_HABITS = ['Курение', 'Алкоголь', 'Фастфуд', 'Социальные сети', 'Поздний сон', 'Кофеин', 'Сахар'];

export default function QuitTimer({ habits, onUpdate }: QuitTimerProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [motivation, setMotivation] = useState('');
  const [quitDate, setQuitDate] = useState(new Date().toISOString().slice(0, 16));
  const [now, setNow] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const healthBenefits = getHealthBenefitsForHabit(name).map(b => ({
      ...b,
      achieved: getHoursSince(quitDate) >= parseFloat(b.timePassed),
    }));

    const newHabit: BadHabit = {
      id: generateId(),
      name: name.trim(),
      quitDate: new Date(quitDate).toISOString(),
      motivation: motivation.trim(),
      healthBenefits,
      createdAt: new Date().toISOString(),
    };

    onUpdate([...habits, newHabit]);
    setName('');
    setMotivation('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(habits.filter(h => h.id !== id));
  };

  const getElapsedTime = (quitDate: string) => {
    const hours = getHoursSince(quitDate);
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    const minutes = Math.floor((hours * 60) % 60);

    if (days > 0) {
      return { days, hours: remainingHours, minutes };
    }
    return { days: 0, hours: Math.floor(hours), minutes };
  };

  const getMoneySaved = (hours: number) => {
    // Rough estimate
    return Math.floor(hours * 0.5); // 50₽ per hour saved
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">Отказ от вредных привычек</h2>
          <p className="text-gray-500 mt-1">Отслеживайте свой прогресс и мотивацию</p>
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
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Новый отказ от привычки</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Привычка</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm"
                placeholder="Например: Курение"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {POPULAR_HABITS.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setName(h)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      name === h ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Дата отказа</label>
              <input
                type="datetime-local"
                value={quitDate}
                onChange={(e) => setQuitDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Мотивация</label>
              <input
                type="text"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm"
                placeholder="Почему вы решили бросить?"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#c9a227] hover:bg-[#e6c34d] text-white font-semibold rounded-lg transition-all text-sm"
            >
              Начать отсчёт
            </button>
          </form>
        </div>
      )}

      {/* Habits List */}
      {habits.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Начните свой путь</h3>
          <p className="text-gray-400 text-sm">Отслеживайте время без вредных привычек и смотрите, как ваше здоровье улучшается</p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map(habit => {
            const elapsed = getElapsedTime(habit.quitDate);
            const totalHours = getHoursSince(habit.quitDate);
            const benefits = getHealthBenefitsForHabit(habit.name);
            const achievedBenefits = benefits.filter(b => totalHours >= parseFloat(b.timePassed));
            const nextBenefit = benefits.find(b => totalHours < parseFloat(b.timePassed));
            const progress = nextBenefit
              ? (totalHours / parseFloat(nextBenefit.timePassed)) * 100
              : 100;

            return (
              <div key={habit.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#1e3a5f]">Без: {habit.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{habit.motivation}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Timer Display */}
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] rounded-xl p-5 text-white mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-200 uppercase tracking-wide mb-1">Время без привычки</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">{elapsed.days}</span>
                          <span className="text-blue-200">дн</span>
                          <span className="text-2xl font-bold ml-2">{elapsed.hours}</span>
                          <span className="text-blue-200">ч</span>
                          <span className="text-2xl font-bold ml-2">{elapsed.minutes}</span>
                          <span className="text-blue-200">мин</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-300 text-sm">
                          <Heart className="w-4 h-4" />
                          <span>{achievedBenefits.length}/{benefits.length} достижений</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress to next milestone */}
                  {nextBenefit && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Следующее достижение: {nextBenefit.title}</span>
                        <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#c9a227] to-[#e6c34d] h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{nextBenefit.description}</p>
                    </div>
                  )}

                  {/* Achievements */}
                  <button
                    onClick={() => setSelectedHabit(selectedHabit === habit.id ? null : habit.id)}
                    className="text-xs text-[#1e3a5f] font-semibold hover:underline mb-3"
                  >
                    {selectedHabit === habit.id ? 'Скрыть достижения' : 'Показать все достижения'} →
                  </button>

                  {selectedHabit === habit.id && (
                    <div className="space-y-2 mt-3">
                      {benefits.map((benefit, i) => {
                        const isAchieved = totalHours >= parseFloat(benefit.timePassed);
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              isAchieved ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100 opacity-60'
                            }`}
                          >
                            {isAchieved ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            <div>
                              <p className={`text-sm font-medium ${isAchieved ? 'text-green-700' : 'text-gray-500'}`}>
                                {benefit.title} — {benefit.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
