import { useState, useEffect } from 'react';
import { 
  Title, 
  Text, 
  Card, 
  Div, 
  List,
  Cell,
  Header,
  Button
} from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.tsx';
import { VapeStorageService } from '@/services/VapeStorageService';
import { VapeStats } from '@/models/VapeData';

import './StatsPage.css';

export const StatsPage = () => {
  const [stats, setStats] = useState<VapeStats>(VapeStorageService.loadStats());
  
  useEffect(() => {
    // Загружаем статистику при монтировании компонента
    const loadedStats = VapeStorageService.loadStats();
    setStats(loadedStats);
  }, []);
  
  // Преобразуем данные по дням для отображения
  const dailyData = Object.entries(stats.dailyPuffs)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString(),
      count
    }));
  
  // Форматирование даты сессии
  const formatSessionTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  // Находим день с максимальным количеством затяжек
  const maxPuffsDay = Object.entries(stats.dailyPuffs).reduce(
    (max, [date, count]) => (count > max.count ? { date, count } : max),
    { date: '', count: 0 }
  );
  
  return (
    <Page>
      <Header>Статистика использования</Header>
      
      <Div className="stats-container">
        <Card className="stats-summary">
          <List>
            <Cell
              subtitle="Общее количество"
              indicator={stats.totalPuffs}
            >
              Затяжки
            </Cell>
            <Cell
              subtitle="Количество сессий"
              indicator={stats.sessions.length}
            >
              Сессии
            </Cell>
            {maxPuffsDay.date && (
              <Cell
                subtitle="Дата"
                indicator={maxPuffsDay.count}
              >
                Максимум за день
              </Cell>
            )}
          </List>
        </Card>
        
        <Title level="3" weight="2" className="section-title">
          Статистика по дням
        </Title>
        
        <Card>
          {dailyData.length > 0 ? (
            <List>
              {dailyData.map((item, index) => (
                <Cell
                  key={index}
                  indicator={item.count}
                >
                  {item.date}
                </Cell>
              ))}
            </List>
          ) : (
            <Div>
              <Text weight="3">Нет данных о затяжках</Text>
            </Div>
          )}
        </Card>
        
        <Title level="3" weight="2" className="section-title">
          Последние сессии
        </Title>
        
        <Card>
          {stats.sessions.length > 0 ? (
            <List>
              {[...stats.sessions]
                .reverse()
                .slice(0, 5)
                .map((session) => (
                  <Cell
                    key={session.id}
                    subtitle={`${session.puffs} затяжек • ${Math.floor(session.duration / 60)} мин`}
                  >
                    {formatSessionTime(session.timestamp)}
                  </Cell>
                ))}
            </List>
          ) : (
            <Div>
              <Text weight="3">Нет данных о сессиях</Text>
            </Div>
          )}
        </Card>
      </Div>
    </Page>
  );
};
