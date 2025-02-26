import { useState, useEffect } from 'react';
import { 
  Button, 
  Title, 
  Text, 
  Card, 
  Div, 
  FixedLayout,
  Counter
} from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.tsx';
import { VapeStorageService } from '@/services/VapeStorageService';
import { VapeStats } from '@/models/VapeData';

import './VapeTrackerPage.css';

export const VapeTrackerPage = () => {
  const [stats, setStats] = useState<VapeStats>(VapeStorageService.loadStats());
  const [todayCount, setTodayCount] = useState(0);
  
  useEffect(() => {
    // Загружаем статистику при монтировании компонента
    const loadedStats = VapeStorageService.loadStats();
    setStats(loadedStats);
    
    // Вычисляем число затяжек за сегодня
    const today = new Date().toISOString().split('T')[0];
    setTodayCount(loadedStats.dailyPuffs[today] || 0);
  }, []);
  
  const handlePuff = () => {
    const updatedStats = VapeStorageService.addPuff();
    setStats(updatedStats);
    
    const today = new Date().toISOString().split('T')[0];
    setTodayCount(updatedStats.dailyPuffs[today] || 0);
  };
  
  return (
    <Page back={false}>
      <Div className="vape-tracker-container">
        <Title level="1" weight="1" className="vape-tracker-title">
          Vape Tracker
        </Title>
        
        <Card className="vape-counter-card">
          <Div className="counter-container">
            <Counter size="l">{stats.totalPuffs}</Counter>
            <Text weight="3">Всего затяжек</Text>
          </Div>
          
          <Div className="counter-container">
            <Counter size="m" mode={todayCount > 20 ? 'prominent' : 'primary'}>
              {todayCount}
            </Counter>
            <Text weight="3">Сегодня</Text>
          </Div>
        </Card>
        
        <Div className="action-buttons">
          <Button 
            size="l" 
            appearance="positive"
            stretched
            onClick={handlePuff}
            className="puff-button"
          >
            Засчитать затяжку
          </Button>
        </Div>
        
        <Card className="stats-summary-card">
          <Div>
            <Text weight="3">Последняя активность</Text>
            {stats.sessions.length > 0 ? (
              <Text>
                {new Date(stats.sessions[stats.sessions.length - 1].timestamp).toLocaleTimeString()}
                {' • '}
                {stats.sessions[stats.sessions.length - 1].puffs} затяжек
              </Text>
            ) : (
              <Text>Нет данных</Text>
            )}
          </Div>
        </Card>
      </Div>
      
      <FixedLayout vertical="bottom" filled>
        <Div className="nav-buttons">
          <Button 
            appearance="overlay" 
            mode="secondary"
            stretched
            onClick={() => window.location.href = '#/stats'}
          >
            Статистика
          </Button>
          <Button 
            appearance="overlay" 
            mode="secondary"
            stretched
            onClick={() => window.location.href = '#/settings'}
          >
            Настройки
          </Button>
        </Div>
      </FixedLayout>
    </Page>
  );
};
