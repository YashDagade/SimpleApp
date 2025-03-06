import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

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
  const width = 300;
  const thumbSize = 28;
  const sliderWidth = width - thumbSize;
  
  const range = max - min;
  const valueToPosition = (val: number) => ((val - min) / range) * sliderWidth;
  const positionToValue = (pos: number) => {
    const rawValue = min + (pos / sliderWidth) * range;
    return Math.round(rawValue / step) * step;
  };

  const translateX = useSharedValue(valueToPosition(value));

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      let newPosition = ctx.startX + event.translationX;
      newPosition = Math.max(0, Math.min(sliderWidth, newPosition));
      translateX.value = newPosition;
    },
    onEnd: () => {
      const newValue = positionToValue(translateX.value);
      translateX.value = withSpring(valueToPosition(newValue));
      onValueChange(newValue);
    },
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value + thumbSize / 2,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.sliderContainer}>
        <View style={styles.track} />
        <Animated.View style={[styles.progress, progressStyle]} />
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <Text style={styles.thumbText}>{positionToValue(translateX.value)}</Text>
          </Animated.View>
        </PanGestureHandler>
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
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8E8E8',
  },
  progress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    position: 'absolute',
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
  },
}); 