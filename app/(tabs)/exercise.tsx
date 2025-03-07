import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { Card } from '@/components/ui/Card';
import { useAppContext, ExerciseEntry } from '@/context/AppContext';

export default function ExerciseScreen() {
  const { addExerciseEntry, getTodayEntries, exerciseEntries } = useAppContext();
  const currentDate = new Date().toISOString().split('T')[0];
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load today's exercise entry whenever exerciseEntries changes
    const entries = getTodayEntries();
    if (entries.exercise) {
      setExerciseCompleted(entries.exercise.completed);
      setNotes(entries.exercise.notes);
    }
  }, [exerciseEntries, getTodayEntries]); // Re-run when exerciseEntries changes

  const saveExerciseEntry = () => {
    const entry: ExerciseEntry = {
      date: currentDate,
      completed: exerciseCompleted,
      notes,
    };
    
    addExerciseEntry(entry);
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
          <Text style={styles.title}>Exercise Journal</Text>
          <Text style={styles.subtitle}>
            Track your daily workouts and activities
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card>
            <Text style={styles.dateText}>Today: {new Date(currentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Card>
            <View style={styles.completedContainer}>
              <Text style={styles.completedTitle}>Did you complete your workout today?</Text>
              <View style={styles.switchContainer}>
                <Text style={[styles.switchLabel, !exerciseCompleted && styles.activeLabel]}>No</Text>
                <Switch
                  value={exerciseCompleted}
                  onValueChange={setExerciseCompleted}
                  trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D1D6"
                  style={styles.switch}
                />
                <Text style={[styles.switchLabel, exerciseCompleted && styles.activeLabel]}>Yes</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Card>
            <Text style={styles.notesTitle}>Workout Notes</Text>
            <Text style={styles.notesSubtitle}>What did you do for your workout today?</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Describe your workout or reasons for skipping..."
              value={notes}
              onChangeText={setNotes}
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <Card>
            <Text style={styles.tipsTitle}>Quick Workout Ideas</Text>
            <View style={styles.tipContainer}>
              <IconSymbol name="figure.walk" size={24} color="#4CD964" />
              <Text style={styles.tipText}>15-minute brisk walk</Text>
            </View>
            <View style={styles.tipContainer}>
              <IconSymbol name="figure.dance" size={24} color="#4CD964" />
              <Text style={styles.tipText}>10 minutes of jumping jacks</Text>
            </View>
            <View style={styles.tipContainer}>
              <IconSymbol name="figure.cross.training" size={24} color="#4CD964" />
              <Text style={styles.tipText}>3 sets of 10 pushups and squats</Text>
            </View>
            <View style={styles.tipContainer}>
              <IconSymbol name="figure.yoga" size={24} color="#4CD964" />
              <Text style={styles.tipText}>15 minutes of basic yoga stretches</Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <TouchableOpacity style={styles.saveButton} onPress={saveExerciseEntry} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>{saved ? 'Saved!' : 'Save Exercise Journal'}</Text>
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
    color: '#333',
    textAlign: 'center',
  },
  completedContainer: {
    alignItems: 'center',
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    marginHorizontal: 8,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  switchLabel: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#333',
    fontWeight: '600',
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  notesSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
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
}); 