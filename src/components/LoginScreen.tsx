import * as React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChevronRightIcon, InstagramMark, MetaLogo, WordmarkGlyph, WordmarkPlate } from './Icons';
import { account } from '../data';
import { colors, fonts, frame, radius, shadow, type, weight } from '../tokens';


export type LoginVariant = 'picker' | 'generic' | 'join' | 'launch';

type Props = {
  variant: LoginVariant;
  onVariant: (v: LoginVariant) => void;
  onPick: () => void;
  onJoin: () => void;
  onLogin: () => void;
};

export const LoginScreen: React.FC<Props> = ({ variant, onVariant, onPick, onJoin, onLogin }) => {
  const picker = variant === 'picker';
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');

  if (variant === 'launch') {
    return (
      <View style={[styles.screen, styles.sheetGround]}>
        <View style={[styles.wordmarkBlock, { top: 255.1 }]}>
          <WordmarkPlate width={264} height={80} />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Log in with Instagram" onPress={() => onVariant('join')} style={[styles.card, { top: 381.4 }]}>
          <View style={styles.cardMark}>
            <InstagramMark size={48} />
          </View>
          <Text style={[styles.cardRun, { left: 88.1 }]}>Log in with Instagram</Text>
          <View style={styles.cardChevron}>
            <ChevronRightIcon size={19.3} color={colors.secondary} />
          </View>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Create Instagram account" onPress={() => onVariant('join')} style={[styles.pickerBottomRun, { top: 704.9 }]}>
          <Text style={styles.pickerBottomRunText}>Create Instagram account</Text>
        </Pressable>
      </View>
    );
  }

  if (picker || variant === 'join') {
    const join = variant === 'join';
    return (
      <View style={[styles.screen, styles.sheetGround]}>
        <View style={[styles.wordmarkBlock, join ? { top: 179.0 } : null]}>
          <WordmarkPlate width={264} height={80} />
        </View>

        {join ? (
          <Text style={styles.consent}>
            By joining Threads, you agree to our <Text style={styles.consentLink}>terms</Text> and{' '}
            <Text style={styles.consentLink}>policies</Text>. We&apos;ll add your account to Accounts Center and{' '}
            <Text style={styles.consentLink}>combine and use your info</Text> across accounts to personalize your experiences and ads.
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={join ? `Join with Instagram as ${account.handle}` : `${account.handle} account`}
          onPress={join ? onJoin : onPick}
          style={[styles.card, join ? { top: 397.7 } : null]}
        >
          <View style={styles.cardMark}>
            <InstagramMark size={48} />
          </View>
          {join ? (
            <>
              <Text style={[styles.cardRun, { top: 25.5 }]}>Join with Instagram</Text>
              <Text style={[styles.cardSubRun, { top: 49.2 }]}>{account.handle}</Text>
            </>
          ) : (
            <Text style={styles.cardRun}>{account.handle}</Text>
          )}
          <View style={styles.cardChevron}>
            <ChevronRightIcon size={19.3} color={colors.secondary} />
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Use different account"
          onPress={() => onVariant('generic')}
          style={styles.pickerBottomRun}
        >
          <Text style={styles.pickerBottomRunText}>Use different account</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Pressable accessibilityRole="button" accessibilityLabel="English (US)" style={styles.langKey}>
        <Text style={styles.langRun}>English (US)</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Threads from Meta"
        onPress={() => onVariant('picker')}
        style={styles.markPlate}
      >
        <WordmarkGlyph size={54} color={colors.ink} />
      </Pressable>

      <View style={styles.fieldPlate} />
      <View style={styles.userBox}>
        <TextInput
          accessibilityLabel="Username, email or mobile number"
          placeholder="Username, email or mobile number"
          placeholderTextColor={colors.fieldInk}
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
          style={styles.userInput}
        />
      </View>

      <View style={styles.fieldPlate2} />
      <View style={styles.passBox}>
        <TextInput
          accessibilityLabel="Password"
      placeholder="Password"
      placeholderTextColor={colors.fieldInk}
          value={pass}
          onChangeText={setPass}
          secureTextEntry
          style={styles.passInput}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log in"
        accessibilityState={{ disabled: !(user.trim() && pass) }}
        onPress={() => {
          if (user.trim() && pass) onLogin();
        }}
        style={styles.loginKey}
      >
        <Text style={styles.loginRun}>Log in</Text>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="Forgot password?" style={styles.forgotKey}>
        <Text style={styles.forgotRun}>Forgot password?</Text>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="Meta logo" style={styles.metaKey}>
        <MetaLogo width={60} height={12} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface, width: frame.width, height: frame.height },
  sheetGround: { backgroundColor: colors.loginGround },

  langKey: { position: 'absolute', left: 142.6, top: 8, width: 108.1, height: 21.8, alignItems: 'center', justifyContent: 'center' },
  langRun: { fontSize: 13.5, lineHeight: 21.8, color: colors.fieldInk, fontFamily: fonts.body },

  markPlate: { position: 'absolute', left: 16, top: 125.2, width: 361, height: 60, alignItems: 'center', justifyContent: 'center' },

  fieldPlate: {
    position: 'absolute',
    left: 16,
    top: 300.6,
    width: 360.6,
    height: 60,
    borderRadius: 10.5,
    borderWidth: 1,
    borderColor: colors.fieldBorder,
    backgroundColor: colors.surface,
  },
  fieldPlate2: {
    position: 'absolute',
    left: 16,
    top: 373.0,
    width: 360.6,
    height: 60,
    borderRadius: 10.5,
    borderWidth: 1,
    borderColor: colors.fieldBorder,
    backgroundColor: colors.surface,
  },
  userBox: { position: 'absolute', left: 32, top: 328.6, width: 292.9, height: 19.6 },
  userInput: {
    position: 'absolute',
    left: 0,
    top: -7.3,
    width: 237.3,
    height: 18.9,
    padding: 0,
    borderWidth: 0,
    fontSize: type.body,
    lineHeight: 18.9,
    color: colors.ink,
    fontFamily: fonts.body,
    backgroundColor: 'transparent',
  },
  passBox: { position: 'absolute', left: 32, top: 401, width: 292.9, height: 19.6 },
  passInput: {
    position: 'absolute',
    left: 0,
    top: -7.3,
    width: 67.3,
    height: 18.9,
    padding: 0,
    borderWidth: 0,
    fontSize: type.body,
    lineHeight: 18.9,
    color: colors.ink,
    fontFamily: fonts.body,
    backgroundColor: 'transparent',
  },

  loginKey: {
    position: 'absolute',
    left: 16,
    top: 445.4,
    width: 361,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.igBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginRun: { fontSize: type.body, lineHeight: 21.1, fontWeight: weight.soft, color: colors.loginInk, fontFamily: fonts.body },

  forgotKey: { position: 'absolute', left: 118.6, top: 501.4, width: 155.7, height: 36, alignItems: 'center', justifyContent: 'center' },
  forgotRun: { marginTop: 1.3, fontSize: 14.6, lineHeight: 25.1, fontWeight: weight.medium, letterSpacing: 0.11, color: colors.forgotInk, fontFamily: fonts.body },

  metaKey: { position: 'absolute', left: 166.7, top: 748.2, width: 60, height: 12, alignItems: 'center', justifyContent: 'center' },

  wordmarkBlock: { position: 'absolute', left: 64.4, top: 210.0, width: 264, height: 80, alignItems: 'center', justifyContent: 'center' },
  card: {
    position: 'absolute',
    left: 24,
    top: 366.4,
    width: 345,
    height: 92.1,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  cardMark: { position: 'absolute', left: 22.2, top: 22.2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  cardRun: { position: 'absolute', left: 78.2, top: 37.5, fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: fonts.body },
  cardChevron: { position: 'absolute', left: 293, top: 22.2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  pickerBottomRun: { position: 'absolute', left: 24, top: 723.1, width: 345, height: 48, alignItems: 'center', justifyContent: 'center' },
  cardSubRun: { position: 'absolute', left: 78.2, fontSize: type.body, color: colors.secondary, fontFamily: fonts.body },
  consent: { position: 'absolute', left: 30.2, top: 305.3, width: 332.6, fontSize: type.caption, lineHeight: 15.5, textAlign: 'center', color: colors.secondary, fontFamily: fonts.body },
  consentLink: { color: colors.ink, fontWeight: weight.medium },
  pickerBottomRunText: { fontSize: type.body, color: colors.secondary, fontFamily: fonts.body },
});
