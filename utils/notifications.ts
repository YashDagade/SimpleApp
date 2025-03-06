import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { UserSettings } from '../context/AppContext';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }
  
  return existingStatus === 'granted';
};

// Schedule wake up time notification
export const scheduleWakeUpNotification = async (wakeUpTime: string) => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  const [hours, minutes] = wakeUpTime.split(':').map(Number);
  
  // Create a Date object for today at the specified time
  const trigger = new Date();
  trigger.setHours(hours);
  trigger.setMinutes(minutes);
  trigger.setSeconds(0);
  
  // If the time has already passed today, schedule for tomorrow
  if (trigger <= new Date()) {
    trigger.setDate(trigger.getDate() + 1);
  }
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Good Morning! ☀️',
      body: 'How was your sleep? Tap to record your sleep data.',
      data: { screen: 'index' },
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
};

// Schedule bedtime notification
export const scheduleBedTimeNotification = async (bedTime: string) => {
  const [hours, minutes] = bedTime.split(':').map(Number);
  
  // Calculate 15 minutes before bedtime
  let reminderHours = hours;
  let reminderMinutes = minutes - 15;
  
  if (reminderMinutes < 0) {
    reminderMinutes += 60;
    reminderHours = (reminderHours - 1 + 24) % 24;
  }
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bedtime Soon! 😴',
      body: 'Don\'t forget to log your food and exercise for today.',
      data: { screen: 'food' },
    },
    trigger: {
      hour: reminderHours,
      minute: reminderMinutes,
      repeats: true,
    },
  });
};

// Setup all notifications based on user settings
export const setupNotifications = async (settings: UserSettings) => {
  if (!settings.notificationsEnabled) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }
  
  const hasPermission = await requestNotificationPermissions();
  
  if (hasPermission) {
    await scheduleWakeUpNotification(settings.wakeUpTime);
    await scheduleBedTimeNotification(settings.bedTime);
  }
};

// Add a notification listener
export const addNotificationResponseListener = (callback: (notification: Notifications.Notification) => void) => {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    callback(response.notification);
  });
}; 