import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, Dimensions, TouchableOpacity } from 'react-native';

interface CustomSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  style?: ViewStyle;
  labels?: string[];
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  style,
  labels,
}) => {
  // Local state for the current display value
  const [displayValue, setDisplayValue] = useState(value);
  
  // Helper function to render the steps
  const renderSteps = () => {
    // Create 5 steps between min and max
    const stepCount = 5;
    const steps = [];
    const stepSize = (max - min) / (stepCount - 1);
    
    for (let i = 0; i < stepCount; i++) {
      const stepValue = min + i * stepSize;
      
      // Check if this step is the active one
      const isActive = Math.abs(stepValue - displayValue) < stepSize / 2;
      
      steps.push(
        <TouchableOpacity
          key={i}
          style={[styles.step, isActive ? styles.activeStep : {}]}
          onPress={() => handleSelectValue(stepValue)}
        >
          <Text style={isActive ? styles.activeStepText : styles.stepText}>
            {Math.round(stepValue)}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return steps;
  };
  
  // Handler for selecting a value
  const handleSelectValue = (newValue: number) => {
    setDisplayValue(newValue);
    onValueChange(newValue);
  };
  
  // Helper function to increment or decrement value
  const adjustValue = (increment: boolean) => {
    const newValue = increment 
      ? Math.min(max, displayValue + step)
      : Math.max(min, displayValue - step);
    
    setDisplayValue(newValue);
    onValueChange(newValue);
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => adjustValue(false)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.valueText}>{Math.round(displayValue)}°F</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => adjustValue(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.track}>
        {renderSteps()}
      </View>
      
      {labels && (
        <View style={styles.labelsContainer}>
          {labels.map((label, index) => (
            <Text key={index} style={styles.label}>
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    backgroundColor: '#007AFF',
  },
  stepText: {
    fontSize: 12,
    color: '#666',
  },
  activeStepText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
}); 