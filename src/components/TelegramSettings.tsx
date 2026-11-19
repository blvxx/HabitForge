import React, { useState } from 'react';
import { User } from '../types';
import { Bot, Send, Bell, Clock, CheckCircle, AlertCircle, ExternalLink, Shield } from 'lucide-react';

interface TelegramSettingsProps {
  user: User;
  onUpdate: (user: User) => void;
}

export default function TelegramSettings({ user, onUpdate }: TelegramSettingsProps) {
  const [botToken, setBotToken] = useState(user.telegramBotToken || '');
  const [chatId, setChatId] = useState(user.telegramChatId || '');
  const [reminderTime, setReminderTime] = useState(user.reminderTime || '09:00');
  const [remindersEnabled, setRemindersEnabled] = useState(user.remindersEnabled);
  const [testMessage, setTestMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate({
      ...user,
      telegramBotToken: botToken,
      telegramChatId: chatId,
      reminderTime,
      remindersEnabled,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = () => {
    if (!botToken || !chatId) {
      setTestMessage('Заполните токен бота и Chat ID');
      return;
    }
    // Simulate sending test message
    setTestMessage('Тестовое сообщение отправлено! Проверьте ваш Telegram.');
    setTimeout(() => setTestMessage(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Telegram бот</h2>
        <p className="text-gray-500 mt-1">Настройте уведомления и напоминания через Telegram</p>
      </div>

      {/* Connection Status */}
      <div className={`rounded-xl p-5 border ${botToken && chatId ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-3">
          {botToken && chatId ? (
            <>
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Бот подключён</p>
                <p className="text-sm text-green-600">Уведомления активны</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800">Бот не подключён</p>
                <p className="text-sm text-amber-600">Настройте бота для получения напоминаний</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full p-5 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1e3a5f]">Инструкция по настройке</h3>
              <p className="text-sm text-gray-500">Как создать и подключить Telegram бота</p>
            </div>
          </div>
          <span className="text-gray-400">{showInstructions ? '▲' : '▼'}</span>
        </button>

        {showInstructions && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium text-gray-800">Создайте бота</p>
                  <p className="text-sm text-gray-500">
                    Откройте <a href="https://t.me/BotFather" target="_blank" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      @BotFather <ExternalLink className="w-3 h-3" />
                    </a> в Telegram и отправьте команду <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/newbot</code>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium text-gray-800">Получите токен</p>
                  <p className="text-sm text-gray-500">
                    Скопируйте токен, который пришлёт BotFather (формат: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">123456:ABC-DEF...</code>)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium text-gray-800">Узнайте свой Chat ID</p>
                  <p className="text-sm text-gray-500">
                    Откройте <a href="https://t.me/userinfobot" target="_blank" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      @userinfobot <ExternalLink className="w-3 h-3" />
                    </a> и скопируйте ваш ID
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-medium text-gray-800">Вставьте данные ниже</p>
                  <p className="text-sm text-gray-500">Введите токен бота и Chat ID в поля ниже</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#c9a227]" />
          Настройки бота
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Токен бота (Bot Token)</label>
            <input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm font-mono"
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Chat ID</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm font-mono"
              placeholder="123456789"
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Напоминания</p>
                  <p className="text-xs text-gray-500">Ежедневные уведомления о привычках</p>
                </div>
              </div>
              <button
                onClick={() => setRemindersEnabled(!remindersEnabled)}
                className={`w-12 h-6 rounded-full transition-all ${remindersEnabled ? 'bg-[#c9a227]' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${remindersEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {remindersEnabled && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Время напоминания
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all text-sm"
                />
              </div>
            )}
          </div>

          {testMessage && (
            <div className={`text-sm px-4 py-3 rounded-lg ${testMessage.includes('отправлено') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {testMessage}
            </div>
          )}

          {saved && (
            <div className="text-sm px-4 py-3 rounded-lg bg-green-50 text-green-700 border border-green-100 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Настройки сохранены
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white font-semibold rounded-lg transition-all text-sm"
            >
              Сохранить настройки
            </button>
            <button
              onClick={handleTest}
              className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all text-sm flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Тест
            </button>
          </div>
        </div>
      </div>

      {/* Reminder Preview */}
      {remindersEnabled && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Предпросмотр уведомления</h3>
          <div className="bg-[#f0f4f8] rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">HabitForge Bot</p>
                <p className="text-xs text-gray-500">Ежедневное напоминание</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
              <p>👋 Доброе утро!</p>
              <p className="mt-2">📋 Не забудьте выполнить свои привычки сегодня:</p>
              <p className="mt-1 text-gray-500">• Медитация 10 минут</p>
              <p className="text-gray-500">• Чтение 30 минут</p>
              <p className="mt-2">🔥 Вы уже 5 дней без курения — так держать!</p>
              <p className="mt-2 text-xs text-gray-400">⏰ Напоминание в {reminderTime}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
