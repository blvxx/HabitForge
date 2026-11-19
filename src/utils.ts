import { User, GoodHabit, BadHabit, AppState } from './types';

const STORAGE_KEY = 'habitforge_data';

export function loadState(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { user: null, goodHabits: [], badHabits: [] };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} мин`;
  if (hours < 24) return `${Math.round(hours)} ч`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} дн`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} мес`;
  const years = Math.floor(months / 12);
  return `${years} г ${months % 12} мес`;
}

export function getHoursSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60);
}

export function getHealthBenefitsForHabit(habitName: string) {
  const benefits: Record<string, { timePassed: number; title: string; description: string }[]> = {
    'Курение': [
      { timePassed: 0.33, title: '20 минут', description: 'Артериальное давление нормализуется' },
      { timePassed: 8, title: '8 часов', description: 'Уровень угарного газа в крови снижается вдвое' },
      { timePassed: 24, title: '24 часа', description: 'Риск сердечного приступа начинает снижаться' },
      { timePassed: 48, title: '48 часов', description: 'Нервные окончания начинают восстанавливаться' },
      { timePassed: 72, title: '72 часа', description: 'Бронхи расслабляются, дыхание становится легче' },
      { timePassed: 168, title: '1 неделя', description: 'Вкус и обоняние начинают улучшаться' },
      { timePassed: 720, title: '1 месяц', description: 'Функция лёгких улучшается на 30%' },
      { timePassed: 2160, title: '3 месяца', description: 'Кровообращение значительно улучшается' },
      { timePassed: 8760, title: '1 год', description: 'Риск сердечных заболеваний снижается вдвое' },
      { timePassed: 43800, title: '5 лет', description: 'Риск инсульта снижается до уровня некурящего' },
    ],
    'Алкоголь': [
      { timePassed: 1, title: '1 час', description: 'Организм начинает выводить токсины' },
      { timePassed: 24, title: '24 часа', description: 'Уровень сахара в крови нормализуется' },
      { timePassed: 48, title: '48 часов', description: 'Начинается восстановление печени' },
      { timePassed: 168, title: '1 неделя', description: 'Улучшается качество сна' },
      { timePassed: 336, title: '2 недели', description: 'Кожа становится чище, уходит отёчность' },
      { timePassed: 720, title: '1 месяц', description: 'Печень восстанавливается на 50%' },
      { timePassed: 2160, title: '3 месяца', description: 'Иммунная система укрепляется' },
      { timePassed: 8760, title: '1 год', description: 'Риск рака значительно снижается' },
    ],
    'Фастфуд': [
      { timePassed: 24, title: '24 часа', description: 'Организм начинает очищаться от транс-жиров' },
      { timePassed: 72, title: '3 дня', description: 'Вкусовые рецепторы начинают восстанавливаться' },
      { timePassed: 168, title: '1 неделя', description: 'Улучшается пищеварение' },
      { timePassed: 336, title: '2 недели', description: 'Уровень энергии повышается' },
      { timePassed: 720, title: '1 месяц', description: 'Вес начинает стабилизироваться' },
      { timePassed: 2160, title: '3 месяца', description: 'Холестерин значительно снижается' },
    ],
    'default': [
      { timePassed: 1, title: '1 час', description: 'Организм начинает восстанавливаться' },
      { timePassed: 24, title: '24 часа', description: 'Первые положительные изменения' },
      { timePassed: 168, title: '1 неделя', description: 'Заметное улучшение самочувствия' },
      { timePassed: 720, title: '1 месяц', description: 'Устойчивая привычка формируется' },
      { timePassed: 2160, title: '3 месяца', description: 'Значительные изменения в здоровье' },
      { timePassed: 8760, title: '1 год', description: 'Полная трансформация образа жизни' },
    ],
  };

  const habitBenefits = benefits[habitName] || benefits['default'];
  return habitBenefits.map(b => ({ ...b, timePassed: b.timePassed.toString(), achieved: false }));
}
