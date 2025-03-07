import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CustomSlider } from '@/components/ui/CustomSlider';
import { useAppContext, SleepEntry } from '@/context/AppContext';

export default function SleepScreen() {
  const { addSleepEntry, userSettings, getTodayEntries, sleepEntries } = useAppContext();
  const currentDate = new Date().toISOString().split('T')[0];
  const [sleepQualityIndex, setSleepQualityIndex] = useState<number | null>(null);
  const [roomTemperature, setRoomTemperature] = useState(70);
  const [thoughts, setThoughts] = useState('');
  const [saved, setSaved] = useState(false);

  const sleepQualityOptions = ['Feel Great', 'Bit Tired', 'Very Sleepy'];
  const sleepQualityValues: Array<'great' | 'tired' | 'sleepy'> = ['great', 'tired', 'sleepy'];

  useEffect(() => {
    // Load today's sleep entry whenever sleepEntries changes
    const entries = getTodayEntries();
    if (entries.sleep) {
      if (entries.sleep.sleepQuality) {
        const index = sleepQualityValues.indexOf(entries.sleep.sleepQuality);
        setSleepQualityIndex(index >= 0 ? index : null);
      }
      setRoomTemperature(entries.sleep.roomTemperature);
      setThoughts(entries.sleep.thoughts);
    }
  }, [sleepEntries, getTodayEntries]); // Re-run when sleepEntries changes

  const handleTemperatureChange = (value: number) => {
    console.log('Temperature changed to:', value);
    setRoomTemperature(value);
  };

  const saveSleepEntry = () => {
    const entry: SleepEntry = {
      date: currentDate,
      sleepQuality: sleepQualityIndex !== null ? sleepQualityValues[sleepQualityIndex] : null,
      roomTemperature,
      thoughts,
    };
    
    addSleepEntry(entry);
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.title}>Sleep Journal</Text>
          <Text style={styles.subtitle}>
            Track your sleep quality and room conditions
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card>
            <Text style={styles.dateText}>Today: {new Date(currentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
            <View style={styles.timeInfo}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Wake up time</Text>
                <Text style={styles.timeValue}>{userSettings.wakeUpTime}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Bed time</Text>
                <Text style={styles.timeValue}>{userSettings.bedTime}</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Card>
            <Text style={styles.cardTitle}>How do you feel after waking up?</Text>
            <SegmentedControl
              options={sleepQualityOptions}
              selectedIndex={sleepQualityIndex ?? 0}
              onChange={setSleepQualityIndex}
              style={styles.segmentedControl}
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Card>
            <Text style={styles.cardTitle}>Room Temperature</Text>
            <Text style={styles.cardSubtitle}>What was your room temperature?</Text>
            <CustomSlider
              min={60}
              max={80}
              value={roomTemperature}
              onValueChange={handleTemperatureChange}
              labels={['Cold (60°F)', 'Comfortable', 'Warm (80°F)']}
            />
            <Text style={styles.temperatureDisplay}>
              Current temperature: {roomTemperature}°F
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <Card>
            <Text style={styles.cardTitle}>Sleep Notes</Text>
            <Text style={styles.cardSubtitle}>Any thoughts about your sleep?</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Enter your notes here..."
              value={thoughts}
              onChangeText={setThoughts}
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <TouchableOpacity style={styles.saveButton} onPress={saveSleepEntry} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>{saved ? 'Saved!' : 'Save Sleep Journal'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  segmentedControl: {
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    height: 120,
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  temperatureDisplay: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
