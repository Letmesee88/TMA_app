import { VapeStats, DEFAULT_VAPE_STATS, VapeSession } from '@/models/VapeData';

const STORAGE_KEY = 'vape_tracker_data';

export class VapeStorageService {
  static loadStats(): VapeStats {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_VAPE_STATS;
    } catch (error) {
      console.error('Error loading vape stats:', error);
      return DEFAULT_VAPE_STATS;
    }
  }

  static saveStats(stats: VapeStats): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving vape stats:', error);
    }
  }

  static addPuff(): VapeStats {
    const stats = this.loadStats();
    const today = new Date().toISOString().split('T')[0];
    
    // Обновляем общее количество затяжек
    stats.totalPuffs += 1;
    
    // Обновляем количество затяжек за день
    stats.dailyPuffs[today] = (stats.dailyPuffs[today] || 0) + 1;
    
    // Обновляем или создаем текущую сессию
    const currentTime = Date.now();
    let lastSession = stats.sessions[stats.sessions.length - 1];
    
    // Если последняя сессия была менее 30 минут назад, обновляем ее
    if (lastSession && (currentTime - lastSession.timestamp) < 30 * 60 * 1000) {
      lastSession.puffs += 1;
      lastSession.duration = Math.floor((currentTime - lastSession.timestamp) / 1000);
    } else {
      // Иначе создаем новую сессию
      const newSession: VapeSession = {
        id: crypto.randomUUID(),
        timestamp: currentTime,
        puffs: 1,
        duration: 0
      };
      stats.sessions.push(newSession);
    }
    
    this.saveStats(stats);
    return stats;
  }

  static resetDailyStats(): VapeStats {
    const stats = this.loadStats();
    const today = new Date().toISOString().split('T')[0];
    stats.dailyPuffs[today] = 0;
    this.saveStats(stats);
    return stats;
  }

  static resetAllStats(): VapeStats {
    this.saveStats(DEFAULT_VAPE_STATS);
    return DEFAULT_VAPE_STATS;
  }
}
