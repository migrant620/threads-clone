import * as React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CloseIcon } from './Icons';
import { onboardingSuggestions } from '../data';
import { colors, frame, weight } from '../tokens';


type Props = {
  onDone: (handles: string[]) => void;
  onCancel: () => void;
};

const ROW_TOP = 157.6;
const ROW_PITCH = 60;

const Tick: React.FC = () => (
  <Svg width={18.6} height={18.6} viewBox="0 0 24 24">
    <Path d="M12 0a12 12 0 1 1 0 24a12 12 0 1 1 0-24z" fill={colors.ink} />
    <Path d="m6.9 12.4 3.4 3.4 6.9-7" stroke={colors.onDark} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const FollowSuggestionsScreen: React.FC<Props> = ({ onDone, onCancel }) => {
  const [selected, setSelected] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(onboardingSuggestions.map((s) => [s.handle, true])),
  );
  const chosen = onboardingSuggestions.filter((s) => selected[s.handle]).map((s) => s.handle);
  const allOn = chosen.length === onboardingSuggestions.length;

  const toggleAll = () => setSelected(Object.fromEntries(onboardingSuggestions.map((s) => [s.handle, !allOn])));
  const toggleOne = (handle: string) => setSelected((prev) => ({ ...prev, [handle]: !prev[handle] }));

  return (
    <View style={styles.screen}>
      <Pressable accessibilityRole="button" accessibilityLabel="Cancel" onPress={onCancel} style={styles.cancelKey}>
        <CloseIcon size={24.5} color={colors.ink} />
      </Pressable>

      <ScrollView style={styles.scroll} contentContainerStyle={{ height: ROW_TOP - 56 + onboardingSuggestions.length * ROW_PITCH + 60 }} showsVerticalScrollIndicator={false}>
        <Text accessibilityRole="header" style={styles.title}>
          Follow suggestions based on your Instagram activity
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={allOn ? 'Unselect all' : 'Select all'}
          onPress={toggleAll}
          style={styles.selectKey}
        >
          <Text style={styles.selectRun}>{allOn ? 'Unselect all' : 'Select all'}</Text>
        </Pressable>

        {onboardingSuggestions.map((s, i) => {
          const top = ROW_TOP - 56 + i * ROW_PITCH;
          const on = !!selected[s.handle];
          return (
            <Pressable
              key={s.handle}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${s.handle}, ${s.followers} followers`}
              onPress={() => toggleOne(s.handle)}
              style={[styles.row, { top }]}
            >
              <Image source={s.avatar} style={styles.avatar} />
              <Text style={styles.handle} numberOfLines={1}>
                {s.handle}
              </Text>
              <Text style={styles.followers}>{`${s.followers} followers`}</Text>
              <View style={styles.checkKey}>{on ? <Tick /> : <View style={styles.checkOff} />}</View>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable accessibilityRole="button" accessibilityLabel={`Follow all (${chosen.length})`} onPress={() => onDone(chosen)} style={styles.followAll}>
        <Text style={styles.followAllRun}>{`Follow all (${chosen.length})`}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, width: frame.width, height: frame.height, backgroundColor: colors.page },
  cancelKey: { position: 'absolute', left: 0, top: 4, width: 60, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  scroll: { position: 'absolute', left: 0, top: 56, width: frame.width, height: 726 - 56 },
  title: {
    position: 'absolute',
    left: 36,
    top: 1.2,
    width: 320.9,
    fontSize: 23.5,
    lineHeight: 24.4,
    letterSpacing: -0.3,
    fontWeight: weight.bold,
    textAlign: 'center',
    color: colors.ink,
    fontFamily: 'ThreadsBody',
  },
  selectKey: { position: 'absolute', left: 257, top: 116.8 - 56, width: 120, height: 40.8, alignItems: 'flex-end', justifyContent: 'center' },
  selectRun: { fontSize: 15, fontWeight: weight.bold, letterSpacing: -0.2, color: colors.ink, fontFamily: 'ThreadsBody' },
  row: { position: 'absolute', left: 0, width: frame.width, height: ROW_PITCH },
  avatar: { position: 'absolute', left: 16, top: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt },
  handle: { position: 'absolute', left: 68, top: 10.5, width: 260, fontSize: 16, lineHeight: 19, fontWeight: weight.semibold, letterSpacing: -0.2, color: colors.ink, fontFamily: 'ThreadsBody' },
  followers: { position: 'absolute', left: 68, top: 32, fontSize: 15, lineHeight: 17.5, letterSpacing: -0.2, color: colors.menuInk, fontFamily: 'ThreadsBody' },
  checkKey: { position: 'absolute', left: 342.1, top: 6, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  checkOff: { width: 18.6, height: 18.6, borderRadius: 9.3, borderWidth: 1.5, borderColor: colors.border },
  followAll: { position: 'absolute', left: 16, top: 726, width: 361, height: 51, borderRadius: 19, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  followAllRun: { fontSize: 16, fontWeight: weight.semibold, color: colors.onDark, fontFamily: 'ThreadsBody' },
});
