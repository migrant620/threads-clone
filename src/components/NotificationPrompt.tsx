import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { fonts, frame } from '../tokens';


type Props = {
  onAllow: () => void;
  onDeny: () => void;
};

const INK = 'rgb(25,28,30)';
const CARD = 'rgb(240,240,243)';
const KEY = 'rgb(193,232,255)';
const GLYPH = 'rgb(0,102,139)';

const RingingBell: React.FC = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24">
    <Path fill={GLYPH} d="M12 3.2c-3 0-5.3 2.3-5.3 5.3v4.6L4.9 15.4v1h14.2v-1l-1.8-2.3V8.5c0-3-2.3-5.3-5.3-5.3z" />
    <Path fill={GLYPH} d="M9.9 17.6a2.1 2.1 0 0 0 4.2 0z" />
    <Path stroke={GLYPH} strokeWidth={1.6} strokeLinecap="round" fill="none" d="M4.6 3.9A8.6 8.6 0 0 0 2.4 9M19.4 3.9A8.6 8.6 0 0 1 21.6 9" />
  </Svg>
);

export const NotificationPrompt: React.FC<Props> = ({ onAllow, onDeny }) => (
  <View style={styles.layer} role="dialog" aria-modal accessibilityViewIsModal>
    <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={onDeny} style={styles.scrim} />
    <View style={styles.card} accessibilityRole="alert">
      <View style={styles.glyph}>
        <RingingBell />
      </View>
      <Text style={styles.message}>
        Allow <Text style={styles.bold}>Threads</Text> to send you notifications?
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Allow" onPress={onAllow} style={[styles.key, styles.keyTop, { top: 387.9 - 249.3 }]}>
        <Text style={styles.keyRun}>Allow</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Don’t allow" onPress={onDeny} style={[styles.key, styles.keyBottom, { top: 448.3 - 249.3 }]}>
        <Text style={styles.keyRun}>Don’t allow</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  layer: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, zIndex: 80 },
  scrim: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: 'rgba(0,0,0,0.55)' },
  card: { position: 'absolute', left: 25.8, top: 249.3, width: 341.4, height: 279.4, borderRadius: 28, backgroundColor: CARD },
  glyph: { position: 'absolute', left: 180.5 - 25.8, top: 267.5 - 249.3, width: 32, height: 32 },
  message: {
    position: 'absolute',
    left: 49.9 - 25.8,
    top: 311.5 - 249.3,
    width: 293.3,
    fontSize: 21,
    lineHeight: 25.1,
    textAlign: 'center',
    color: INK,
    fontFamily: fonts.body,
  },
  bold: { fontWeight: '700' },
  key: { position: 'absolute', left: 49.9 - 25.8, width: 293.3, height: 56, backgroundColor: KEY, alignItems: 'center', justifyContent: 'center' },
  keyTop: { borderTopLeftRadius: 12.5, borderTopRightRadius: 12.5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  keyBottom: { borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 12.5, borderBottomRightRadius: 12.5 },
  keyRun: { fontSize: 16, color: INK, fontFamily: fonts.body },
});
