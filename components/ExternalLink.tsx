import { Pressable, Text } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = {
  href: string;
  style?: ComponentProps<typeof Text>['style'];
  children: React.ReactNode;
};

export function ExternalLink({ href, style, children }: Props) {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await openBrowserAsync(href);
    } else {
      // For web, open in a new tab
      window.open(href, '_blank');
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Text style={style}>{children}</Text>
    </Pressable>
  );
}
