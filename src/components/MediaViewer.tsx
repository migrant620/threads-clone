import * as React from 'react';
import { Image, type ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { BackIcon } from './Icons';
import { colors, frame } from '../tokens';
import { useModalFocus } from './Chrome';

export const MediaViewer: React.FC<{ source: ImageSourcePropType; onClose: () => void; opener?: HTMLElement | null }> = ({ source, onClose, opener }) => {
  const modal = useModalFocus(onClose, true, opener);
  return (
  <View ref={modal} style={styles.layer} role="dialog" aria-modal accessibilityLabel="Photo viewer" accessibilityViewIsModal>
    <Image source={source} accessibilityLabel="Photo" style={styles.photo} resizeMode="contain" />
    <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onClose} style={styles.backKey}>
      <BackIcon size={24} color={colors.onDark} />
    </Pressable>
  </View>
  );
};

const styles = StyleSheet.create({
  layer: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: colors.ink, zIndex: 95 },
  photo: { position: 'absolute', left: 0, top: 56, width: frame.width, height: frame.height - 112 },
  backKey: { position: 'absolute', left: 0, top: 4, width: 60, height: 48, alignItems: 'center', justifyContent: 'center' },
});
