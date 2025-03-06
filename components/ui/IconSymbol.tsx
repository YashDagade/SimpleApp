// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Define type for the Material Icon names
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING: Record<string, MaterialIconName> = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'bed.double.fill': 'hotel',
  'fork.knife': 'restaurant',
  'figure.run': 'directions-run',
  'chart.bar.fill': 'bar-chart',
  'camera.fill': 'camera-alt',
  'figure.walk': 'directions-walk',
  'figure.dance': 'nightlife',
  'figure.cross.training': 'fitness-center',
  'figure.yoga': 'self-improvement',
  'lightbulb.fill': 'lightbulb',
  'drop.fill': 'water-drop',
  'checkmark': 'check',
  'xmark': 'close',
};

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
