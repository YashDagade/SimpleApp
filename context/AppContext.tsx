import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export type SleepEntry = {
  date: string;
  sleepQuality: 'great' | 'tired' | 'sleepy' | null;
  roomTemperature: number;
  thoughts: string;
};

export type MealEntry = {
  date: string;
  mealType: 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner';
  eaten: boolean;
  notes: string;
  imageUri?: string;
};

export type ExerciseEntry = {
  date: string;
  completed: boolean;
  notes: string;
};

export type UserSettings = {
  wakeUpTime: string; // HH:MM format
  bedTime: string; // HH:MM format
  notificationsEnabled: boolean;
};

type AppContextType = {
  sleepEntries: SleepEntry[];
  mealEntries: MealEntry[];
  exerciseEntries: ExerciseEntry[];
  userSettings: UserSettings;
  addSleepEntry: (entry: SleepEntry) => void;
  addMealEntry: (entry: MealEntry) => void;
  addExerciseEntry: (entry: ExerciseEntry) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  getTodayEntries: () => {
    sleep: SleepEntry | null;
    meals: MealEntry[];
    exercise: ExerciseEntry | null;
  };
  getRecentEntries: (days: number) => {
    sleep: SleepEntry[];
    meals: MealEntry[];
    exercise: ExerciseEntry[];
  };
};

const defaultUserSettings: UserSettings = {
  wakeUpTime: '06:00',
  bedTime: '22:00',
  notificationsEnabled: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSleepEntries = await AsyncStorage.getItem('sleepEntries');
        const storedMealEntries = await AsyncStorage.getItem('mealEntries');
        const storedExerciseEntries = await AsyncStorage.getItem('exerciseEntries');
        const storedUserSettings = await AsyncStorage.getItem('userSettings');

        if (storedSleepEntries) setSleepEntries(JSON.parse(storedSleepEntries));
        if (storedMealEntries) setMealEntries(JSON.parse(storedMealEntries));
        if (storedExerciseEntries) setExerciseEntries(JSON.parse(storedExerciseEntries));
        if (storedUserSettings) setUserSettings(JSON.parse(storedUserSettings));
      } catch (error) {
        console.error('Error loading data from storage:', error);
      }
    };

    loadData();
  }, []);

  // Save data to storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('sleepEntries', JSON.stringify(sleepEntries));
        await AsyncStorage.setItem('mealEntries', JSON.stringify(mealEntries));
        await AsyncStorage.setItem('exerciseEntries', JSON.stringify(exerciseEntries));
        await AsyncStorage.setItem('userSettings', JSON.stringify(userSettings));
      } catch (error) {
        console.error('Error saving data to storage:', error);
      }
    };

    saveData();
  }, [sleepEntries, mealEntries, exerciseEntries, userSettings]);

  const addSleepEntry = (entry: SleepEntry) => {
    // Replace any existing entry for the same date
    setSleepEntries(prevEntries => {
      const filtered = prevEntries.filter(e => e.date !== entry.date);
      return [...filtered, entry];
    });
  };

  const addMealEntry = (entry: MealEntry) => {
    // Replace any existing entry for the same date and meal type
    setMealEntries(prevEntries => {
      const filtered = prevEntries.filter(
        e => !(e.date === entry.date && e.mealType === entry.mealType)
      );
      return [...filtered, entry];
    });
  };

  const addExerciseEntry = (entry: ExerciseEntry) => {
    // Replace any existing entry for the same date
    setExerciseEntries(prevEntries => {
      const filtered = prevEntries.filter(e => e.date !== entry.date);
      return [...filtered, entry];
    });
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...settings }));
  };

  const getTodayEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    
    return {
      sleep: sleepEntries.find(entry => entry.date === today) || null,
      meals: mealEntries.filter(entry => entry.date === today),
      exercise: exerciseEntries.find(entry => entry.date === today) || null,
    };
  };

  const getRecentEntries = (days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffString = cutoffDate.toISOString().split('T')[0];
    
    return {
      sleep: sleepEntries.filter(entry => entry.date >= cutoffString),
      meals: mealEntries.filter(entry => entry.date >= cutoffString),
      exercise: exerciseEntries.filter(entry => entry.date >= cutoffString),
    };
  };

  return (
    <AppContext.Provider
      value={{
        sleepEntries,
        mealEntries,
        exerciseEntries,
        userSettings,
        addSleepEntry,
        addMealEntry,
        addExerciseEntry,
        updateUserSettings,
        getTodayEntries,
        getRecentEntries,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 