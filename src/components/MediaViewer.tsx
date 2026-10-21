import * as React from 'react';
import { Image, type ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { BackIcon } from './Icons';
import { colors, frame } from '../tokens';

export const MediaViewer: React.FC<{ source: ImageSourcePropType; onClose: () => void }> = ({ source, onClose }) => (
  <View style={styles.layer} accessibilityViewIsModal>
    <Image source={source} accessibilityLabel="Photo" style={styles.photo} resizeMode="contain" />
    <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onClose} style={styles.backKey}>
      <BackIcon size={24} color={colors.onDark} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  layer: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: colors.ink, zIndex: 95 },
  photo: { position: 'absolute', left: 0, top: 56, width: frame.width, height: frame.height - 112 },
  backKey: { position: 'absolute', left: 0, top: 4, width: 60, height: 48, alignItems: 'center', justifyContent: 'center' },
});
