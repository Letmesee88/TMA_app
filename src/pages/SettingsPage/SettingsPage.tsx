import { useState } from 'react';
import { 
  Button, 
  Title, 
  Div, 
  List,
  Cell,
  Switch,
  Header,
  Card,
  Dialog,
  Text
} from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.tsx';
import { VapeStorageService } from '@/services/VapeStorageService';

export const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('vape_notifications') === 'true'
  );
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem('vape_dark_theme') === 'true'
  );
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('vape_notifications', String(newValue));
  };
  
  const handleThemeToggle = () => {
    const newValue = !darkTheme;
    setDarkTheme(newValue);
    localStorage.setItem('vape_dark_theme', String(newValue));
  };
  
  const handleResetStats = () => {
    VapeStorageService.resetAllStats();
    setShowResetDialog(false);
    window.location.reload();
  };
  
  return (
    <Page>
      <Header>Настройки</Header>
      
      <Div>
        <Card>
          <List>
            <Cell
              after={
                <Switch 
                  checked={notificationsEnabled}
                  onChange={handleNotificationsToggle}
                />
              }
            >
              Уведомления
            </Cell>
            <Cell
              after={
                <Switch 
                  checked={darkTheme}
                  onChange={handleThemeToggle}
                />
              }
            >
              Темная тема
            </Cell>
          </List>
        </Card>
        
        <Card style={{ marginTop: 16 }}>
          <List>
            <Cell
              subtitle="Сбросить только сегодняшний день"
              onClick={() => {
                VapeStorageService.resetDailyStats();
                window.location.reload();
              }}
            >
              Сбросить дневную статистику
            </Cell>
            <Cell
              subtitle="Сбросить всю статистику"
              onClick={() => setShowResetDialog(true)}
            >
              Сбросить все данные
            </Cell>
          </List>
        </Card>
        
        <Div style={{ padding: 16, textAlign: 'center' }}>
          <Text weight="3" style={{ color: 'var(--tgui--secondary_text_color)', fontSize: 14 }}>
            Vape Tracker v1.0.0
          </Text>
        </Div>
      </Div>
      
      {showResetDialog && (
        <Dialog
          visible={showResetDialog}
          onClose={() => setShowResetDialog(false)}
          actions={[
            {
              title: 'Отмена',
              mode: 'secondary',
              onClick: () => setShowResetDialog(false),
            },
            {
              title: 'Сбросить',
              mode: 'destructive',
              onClick: handleResetStats,
            },
          ]}
        >
          <Div>
            <Title level="3" weight="1">Сбросить все данные</Title>
            <Text>
              Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.
            </Text>
          </Div>
        </Dialog>
      )}
    </Page>
  );
};
