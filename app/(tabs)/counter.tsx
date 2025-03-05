import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomButton } from '@/components/CustomButton';

export default function CounterScreen() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Counter App</ThemedText>
      
      <ThemedView style={styles.counterContainer}>
        <ThemedText type="subtitle" style={styles.counterText}>{count}</ThemedText>
      </ThemedView>
      
      <View style={styles.buttonContainer}>
        <CustomButton 
          title="Decrement" 
          onPress={decrement} 
          buttonStyle={styles.decrementButton}
          disabled={count <= 0}
        />
        
        <CustomButton 
          title="Increment" 
          onPress={increment} 
        />
      </View>
      
      <CustomButton 
        title="Reset" 
        onPress={reset} 
        buttonStyle={styles.resetButton}
        textStyle={styles.resetButtonText}
        disabled={count === 0}
      />
      
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">How it works:</ThemedText>
        <ThemedText>
          This simple counter app demonstrates React state management using the useState hook.
          The count is stored in state and updated when you press the buttons.
        </ThemedText>
        <ThemedText style={styles.tipText}>
          Tip: Try implementing more features like a count history or a custom increment value!
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 40,
    fontSize: 28,
  },
  counterContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  decrementButton: {
    backgroundColor: '#FF3B30',
  },
  resetButton: {
    backgroundColor: '#E5E5EA',
    marginBottom: 40,
  },
  resetButtonText: {
    color: '#007AFF',
  },
  infoContainer: {
    padding: 16,
    borderRadius: 8,
    width: '100%',
    gap: 8,
  },
  tipText: {
    fontStyle: 'italic',
    marginTop: 8,
  },
}); 