import { useContext } from 'react';
import { NotificationContext } from './notifContext';

export const useNotification = () => useContext(NotificationContext);
