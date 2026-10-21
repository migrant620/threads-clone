import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PencilIcon, PlusIcon } from './Icons';
import { colors, fonts, frame, radius, type, weight } from '../tokens';

const PANEL_RIGHT = 8.0 + 297.3;

export const FeedsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <View style={styles.layer}>
    <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={onClose} style={styles.scrim} />
    <View style={styles.panel} accessibilityViewIsModal>
      <Text accessibilityRole="header" style={styles.title}>
        Feeds
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Create feed" style={styles.createKey}>
        <PlusIcon size={22} color={colors.ink} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Edit feeds" style={styles.editKey}>
        <PencilIcon size={22} color={colors.ink} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Your algo"
        aria-selected
        onPress={onClose}
        style={styles.row}
      >
        <Text style={styles.rowRun}>Your algo</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  layer: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, zIndex: 90 },
  scrim: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: 'rgba(0,0,0,0.6)' },
  panel: { position: 'absolute', left: 0, top: 0, width: PANEL_RIGHT, height: frame.height, backgroundColor: colors.page },
  title: {
    position: 'absolute',
    left: 26.9,
    top: 38.2,
    width: 191.0,
    height: 25.8,
    fontSize: 22,
    lineHeight: 25.8,
    fontWeight: weight.semibold,
    color: colors.ink,
    fontFamily: fonts.body,
  },
  createKey: { position: 'absolute', left: 218.0, top: 28.7, width: 34.2, height: 35.3, alignItems: 'center', justifyContent: 'center' },
  editKey: { position: 'absolute', left: 252.2, top: 28.7, width: 45.9, height: 35.3, alignItems: 'center', justifyContent: 'center' },
  row: {
    position: 'absolute',
    left: 26.9,
    top: 85.9,
    width: 259.5,
    height: 59.0,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    paddingLeft: 45.9 - 26.9,
  },
  rowRun: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: fonts.body },
});
