import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { Card } from '@/components/ui/Card';
import { useAppContext, SleepEntry, MealEntry, ExerciseEntry } from '@/context/AppContext';

const DAYS_TO_SHOW = 7;

// Helper function to format dates
const formatDay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
};

// Helper function to get the last N days
const getLastNDays = (n: number) => {
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date.toISOString().split('T')[0]);
  }
  return result;
};

// Helper to get a color based on sleep quality
const getSleepQualityColor = (quality: string | null) => {
  switch (quality) {
    case 'great':
      return '#4CD964';
    case 'tired':
      return '#FFCC00';
    case 'sleepy':
      return '#FF3B30';
    default:
      return '#D1D1D6';
  }
};

// Helper to get the sleep emoji
const getSleepEmoji = (quality: string | null) => {
  switch (quality) {
    case 'great':
      return '😀';
    case 'tired':
      return '😐';
    case 'sleepy':
      return '😴';
    default:
      return '❓';
  }
};

export default function SummaryScreen() {
  const { getRecentEntries } = useAppContext();
  const [recentDays] = useState(getLastNDays(DAYS_TO_SHOW));
  const [recentData, setRecentData] = useState<{
    sleep: SleepEntry[];
    meals: MealEntry[];
    exercise: ExerciseEntry[];
  }>({ sleep: [], meals: [], exercise: [] });

  useEffect(() => {
    const data = getRecentEntries(DAYS_TO_SHOW);
    setRecentData(data);
  }, []);

  // Find entry for a specific date
  const findSleepEntry = (date: string) => {
    return recentData.sleep.find(entry => entry.date === date);
  };

  const findExerciseEntry = (date: string) => {
    return recentData.exercise.find(entry => entry.date === date);
  };

  const findMealEntries = (date: string) => {
    return recentData.meals.filter(entry => entry.date === date);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.title}>Your Wellness Summary</Text>
          <Text style={styles.subtitle}>
            Last {DAYS_TO_SHOW} days overview
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card>
            <Text style={styles.sectionTitle}>Sleep Quality</Text>
            <View style={styles.daysContainer}>
              {recentDays.map((day) => {
                const entry = findSleepEntry(day);
                return (
                  <View key={`sleep-${day}`} style={styles.dayColumn}>
                    <Text style={styles.dayText}>{formatDay(day)}</Text>
                    <View
                      style={[
                        styles.sleepQualityCircle,
                        { backgroundColor: getSleepQualityColor(entry?.sleepQuality || null) },
                      ]}
                    >
                      <Text style={styles.emojiText}>{getSleepEmoji(entry?.sleepQuality || null)}</Text>
                    </View>
                    <Text style={styles.temperatureText}>
                      {entry ? `${entry.roomTemperature}°F` : 'N/A'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Card>
            <Text style={styles.sectionTitle}>Exercise Completed</Text>
            <View style={styles.daysContainer}>
              {recentDays.map((day) => {
                const entry = findExerciseEntry(day);
                return (
                  <View key={`exercise-${day}`} style={styles.dayColumn}>
                    <Text style={styles.dayText}>{formatDay(day)}</Text>
                    <View
                      style={[
                        styles.exerciseCircle,
                        { backgroundColor: entry?.completed ? '#4CD964' : '#D1D1D6' },
                      ]}
                    >
                      <IconSymbol
                        name={entry?.completed ? 'checkmark' : 'xmark'}
                        size={18}
                        color="white"
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Card>
            <Text style={styles.sectionTitle}>Meals Consumed</Text>
            {recentDays.map((day) => {
              const entries = findMealEntries(day);
              const breakfast = entries.find(e => e.mealType === 'breakfast');
              const morningSnack = entries.find(e => e.mealType === 'morningSnack');
              const lunch = entries.find(e => e.mealType === 'lunch');
              const afternoonSnack = entries.find(e => e.mealType === 'afternoonSnack');
              const dinner = entries.find(e => e.mealType === 'dinner');
              
              return (
                <View key={`meals-${day}`} style={styles.mealDayRow}>
                  <Text style={styles.mealDayText}>{formatDay(day)}</Text>
                  <View style={styles.mealDotsContainer}>
                    <View
                      style={[
                        styles.mealDot,
                        { backgroundColor: breakfast?.eaten ? '#4CD964' : '#D1D1D6' },
                      ]}
                    />
                    <View
                      style={[
                        styles.mealDot,
                        { backgroundColor: morningSnack?.eaten ? '#4CD964' : '#D1D1D6' },
                      ]}
                    />
                    <View
                      style={[
                        styles.mealDot,
                        { backgroundColor: lunch?.eaten ? '#4CD964' : '#D1D1D6' },
                      ]}
                    />
                    <View
                      style={[
                        styles.mealDot,
                        { backgroundColor: afternoonSnack?.eaten ? '#4CD964' : '#D1D1D6' },
                      ]}
                    />
                    <View
                      style={[
                        styles.mealDot,
                        { backgroundColor: dinner?.eaten ? '#4CD964' : '#D1D1D6' },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
            <View style={styles.mealLegendContainer}>
              <View style={styles.mealLegendItem}>
                <View style={[styles.mealDot, { backgroundColor: '#4CD964' }]} />
                <Text style={styles.mealLegendText}>Eaten</Text>
              </View>
              <View style={styles.mealLegendItem}>
                <View style={[styles.mealDot, { backgroundColor: '#D1D1D6' }]} />
                <Text style={styles.mealLegendText}>Skipped</Text>
              </View>
            </View>
            <View style={styles.mealLegendContainer}>
              <Text style={styles.mealTypeText}>B</Text>
              <Text style={styles.mealTypeText}>MS</Text>
              <Text style={styles.mealTypeText}>L</Text>
              <Text style={styles.mealTypeText}>AS</Text>
              <Text style={styles.mealTypeText}>D</Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <Card style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Your Wellness Tips</Text>
            
            <View style={styles.tipContainer}>
              <IconSymbol name="lightbulb.fill" size={20} color="#FFCC00" />
              <Text style={styles.tipText}>
                Consistent sleep times help regulate your circadian rhythm
              </Text>
            </View>
            
            <View style={styles.tipContainer}>
              <IconSymbol name="fork.knife" size={20} color="#FF9500" />
              <Text style={styles.tipText}>
                Try to eat meals at regular times each day
              </Text>
            </View>
            
            <View style={styles.tipContainer}>
              <IconSymbol name="figure.run" size={20} color="#4CD964" />
              <Text style={styles.tipText}>
                Even a short 15-minute workout is better than nothing
              </Text>
            </View>
            
            <View style={styles.tipContainer}>
              <IconSymbol name="drop.fill" size={20} color="#007AFF" />
              <Text style={styles.tipText}>
                Don't forget to drink plenty of water throughout the day
              </Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const dayColumnWidth = (width - 64) / DAYS_TO_SHOW;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    width: dayColumnWidth,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  sleepQualityCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emojiText: {
    fontSize: 18,
  },
  temperatureText: {
    fontSize: 12,
    color: '#666',
  },
  exerciseCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealDayText: {
    width: 60,
    fontSize: 14,
    color: '#333',
  },
  mealDotsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  mealDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  mealLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
  },
  mealLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealLegendText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  mealTypeText: {
    fontSize: 12,
    color: '#666',
    width: 20,
    textAlign: 'center',
  },
  tipsCard: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
}); 