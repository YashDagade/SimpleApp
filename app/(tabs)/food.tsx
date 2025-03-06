import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { Card } from '@/components/ui/Card';
import { useAppContext, MealEntry } from '@/context/AppContext';

type MealType = 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner';

interface MealCardProps {
  title: string;
  mealType: MealType;
  onSave: (entry: Partial<MealEntry>) => void;
  initialData?: MealEntry;
}

const MealCard: React.FC<MealCardProps> = ({ title, mealType, onSave, initialData }) => {
  const [eaten, setEaten] = useState(initialData?.eaten ?? false);
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [imageUri, setImageUri] = useState(initialData?.imageUri);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      onSave({ mealType, eaten, notes, imageUri: result.assets[0].uri });
    }
  };

  const handleToggleEaten = () => {
    const newEatenState = !eaten;
    setEaten(newEatenState);
    onSave({ mealType, eaten: newEatenState, notes, imageUri });
  };

  const handleSaveNotes = () => {
    onSave({ mealType, eaten, notes, imageUri });
  };

  return (
    <Card>
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{title}</Text>
        <View style={styles.eatenToggle}>
          <Text style={styles.eatenLabel}>{eaten ? 'Eaten' : 'Skipped'}</Text>
          <TouchableOpacity
            style={[styles.toggleButton, eaten ? styles.toggleActive : styles.toggleInactive]}
            onPress={handleToggleEaten}
          >
            <View style={[styles.toggleIndicator, eaten ? styles.indicatorRight : styles.indicatorLeft]} />
          </TouchableOpacity>
        </View>
      </View>

      {eaten && (
        <>
          <TextInput
            style={styles.mealInput}
            multiline
            placeholder={`What did you eat for ${title.toLowerCase()}?`}
            value={notes}
            onChangeText={setNotes}
            onEndEditing={handleSaveNotes}
          />

          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.mealImage} />
              <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <IconSymbol name="camera.fill" size={20} color="#666" />
              <Text style={styles.addImageText}>Add a photo</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </Card>
  );
};

export default function FoodScreen() {
  const { addMealEntry, getTodayEntries } = useAppContext();
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);

  useEffect(() => {
    // Load today's meal entries if they exist
    const entries = getTodayEntries();
    if (entries.meals.length > 0) {
      setTodayMeals(entries.meals);
    }
  }, []);

  const getMealByType = (type: MealType): MealEntry | undefined => {
    return todayMeals.find(meal => meal.mealType === type);
  };

  const handleSaveMeal = (mealData: Partial<MealEntry>) => {
    if (!mealData.mealType) return;
    
    const entry: MealEntry = {
      date: currentDate,
      mealType: mealData.mealType,
      eaten: mealData.eaten ?? false,
      notes: mealData.notes ?? '',
      imageUri: mealData.imageUri,
    };
    
    addMealEntry(entry);
    
    // Update local state
    setTodayMeals(prev => {
      const filtered = prev.filter(meal => meal.mealType !== mealData.mealType);
      return [...filtered, entry];
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.title}>Food Journal</Text>
          <Text style={styles.subtitle}>
            Track your meals and eating habits
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card>
            <Text style={styles.dateText}>Today: {new Date(currentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <MealCard
            title="Breakfast"
            mealType="breakfast"
            onSave={handleSaveMeal}
            initialData={getMealByType('breakfast')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <MealCard
            title="Morning Snack"
            mealType="morningSnack"
            onSave={handleSaveMeal}
            initialData={getMealByType('morningSnack')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <MealCard
            title="Lunch"
            mealType="lunch"
            onSave={handleSaveMeal}
            initialData={getMealByType('lunch')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <MealCard
            title="Afternoon Snack"
            mealType="afternoonSnack"
            onSave={handleSaveMeal}
            initialData={getMealByType('afternoonSnack')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(500)}>
          <MealCard
            title="Dinner"
            mealType="dinner"
            onSave={handleSaveMeal}
            initialData={getMealByType('dinner')}
          />
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  eatenToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eatenLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#4CD964',
  },
  toggleInactive: {
    backgroundColor: '#D1D1D6',
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  indicatorRight: {
    alignSelf: 'flex-end',
  },
  indicatorLeft: {
    alignSelf: 'flex-start',
  },
  mealInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    height: 80,
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  addImageText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  imageContainer: {
    marginBottom: 12,
  },
  mealImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  changeImageButton: {
    alignSelf: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  changeImageText: {
    fontSize: 14,
    color: '#666',
  },
}); 