import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BackIcon, ChevronRightIcon } from './Icons';
import { colors, frame, tracking, type } from '../tokens';

const GROUPS: Array<{ title: string; rows: Array<{ label: string; chevron?: boolean }> }> = [
  {
    title: 'Account',
    rows: [
      { label: 'Edit profile' },
      { label: 'Account details' },
      { label: 'Verified accounts', chevron: false },
    ],
  },
  {
    title: 'Your activity',
    rows: [
      { label: 'Insights' },
      { label: 'Archive' },
      { label: 'Close friends' },
      { label: 'Liked posts', chevron: false },
      { label: 'Pinned posts', chevron: false },
    ],
  },
  {
    title: 'Your threads',
    rows: [
      { label: 'Threads from profiles you follow', chevron: false },
      { label: 'Reply controls' },
      { label: 'Mentions and tags' },
    ],
  },
  {
    title: 'Privacy',
    rows: [
      { label: 'Blocked accounts', chevron: false },
      { label: 'Muted accounts and words', chevron: false },
    ],
  },
  {
    title: 'More',
    rows: [
      { label: 'Notifications' },
      { label: 'Display' },
      { label: 'Help' },
    ],
  },
  {
    title: 'About',
    rows: [{ label: 'Terms of Service' }, { label: 'Privacy Policy' }],
  },
];

export const SettingsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <View style={styles.screen}>
    <View style={styles.topBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        style={styles.backKey}
      >
        <BackIcon size={24} color={colors.ink} />
      </Pressable>
      <Text style={styles.title}>Settings</Text>
    </View>

    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} accessibilityLabel="Settings">
      <View style={styles.content}>
        {GROUPS.map(group => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.card}>
              {group.rows.map((row, index) => (
                <Pressable
                  key={row.label}
                  accessibilityRole="button"
                  accessibilityLabel={row.label}
                  style={[styles.row, index > 0 && styles.rowDivided]}
                >
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  {row.chevron === false ? (
                    <View style={styles.switchTrack}>
                      <View style={styles.switchThumb} />
                    </View>
                  ) : (
                    <ChevronRightIcon size={16} color={colors.secondary} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, width: frame.width, backgroundColor: colors.page },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  backKey: { width: 40, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
  title: {
    marginLeft: 4,
    fontFamily: 'ThreadsBody',
    fontSize: type.name,
    lineHeight: type.nameLine,
    letterSpacing: tracking.name,
    color: colors.ink,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  group: { marginTop: 24 },
  groupTitle: {
    marginLeft: 16,
    marginBottom: 8,
    fontFamily: 'ThreadsBody',
    fontSize: type.caption,
    lineHeight: type.captionLine,
    color: colors.secondary,
  },
  card: { marginHorizontal: 16 },
  row: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  rowDivided: { borderTopWidth: 1, borderTopColor: colors.hairlineStrong },
  rowLabel: {
    fontFamily: 'ThreadsBody',
    fontSize: type.body,
    lineHeight: type.bodyLine,
    letterSpacing: tracking.body,
    color: colors.ink,
  },
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.chip,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.page,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});