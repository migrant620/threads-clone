import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FontDisplay, useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { FeedScreen } from './components/FeedScreen';
import type { LoginVariant } from './components/LoginScreen';
import { buildFeed, buildOwnThread, buildThread, type Post, type ReplyNode } from './data';
import { colors, frame } from './tokens';
import { useVariableWeightFont } from './webfont';


const loadDetail = () => import('./components/ThreadDetail');
const loadComposer = () => import('./components/Composer');
const loadSearch = () => import('./components/SearchScreen');
const loadActivity = () => import('./components/ActivityScreen');
const loadProfile = () => import('./components/ProfileScreen');
const loadMessages = () => import('./components/MessagesScreen');
const loadLogin = () => import('./components/LoginScreen');
const loadSettings = () => import('./components/SettingsScreen');
const loadSuggestions = () => import('./components/FollowSuggestionsScreen');
const loadPrompt = () => import('./components/NotificationPrompt');
const ThreadDetail = React.lazy(() => loadDetail().then((m) => ({ default: m.ThreadDetail })));
const Composer = React.lazy(() => loadComposer().then((m) => ({ default: m.Composer })));
const SearchScreen = React.lazy(() => loadSearch().then((m) => ({ default: m.SearchScreen })));
const ActivityScreen = React.lazy(() => loadActivity().then((m) => ({ default: m.ActivityScreen })));
const ProfileScreen = React.lazy(() => loadProfile().then((m) => ({ default: m.ProfileScreen })));
const MessagesScreen = React.lazy(() => loadMessages().then((m) => ({ default: m.MessagesScreen })));
const LoginScreen = React.lazy(() => loadLogin().then((m) => ({ default: m.LoginScreen })));
const SettingsScreen = React.lazy(() => loadSettings().then((m) => ({ default: m.SettingsScreen })));
const FollowSuggestionsScreen = React.lazy(() => loadSuggestions().then((m) => ({ default: m.FollowSuggestionsScreen })));
const NotificationPrompt = React.lazy(() => loadPrompt().then((m) => ({ default: m.NotificationPrompt })));

let prefetched = false;
const prefetch = () => {
  if (prefetched) return;
  prefetched = true;
  [loadDetail, loadComposer, loadSearch, loadActivity, loadProfile, loadMessages, loadLogin, loadSettings, loadSuggestions, loadPrompt].forEach(
    (load) => {
      load().catch(() => undefined);
    },
  );
};

const FONT_GRACE_MS = 1500;

type Screen = 'login' | 'suggestions' | 'feed' | 'post' | 'create' | 'search' | 'activity' | 'profile' | 'messages' | 'settings';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    ThreadsBody: { uri: require('../assets/fonts/InstrumentSans-VF.ttf'), display: FontDisplay.SWAP },
    ThreadsNumbers: { uri: require('../assets/fonts/Roboto_500Medium.ttf'), display: FontDisplay.SWAP },
  });
  const [fontGraceOver, setFontGraceOver] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setFontGraceOver(true), FONT_GRACE_MS);
    return () => clearTimeout(t);
  }, []);
  const fontsReady = fontsLoaded || !!fontError || fontGraceOver;
  useVariableWeightFont('ThreadsBody');
  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      prefetch();
      return undefined;
    }
    const t = setTimeout(prefetch, 8000);
    return () => clearTimeout(t);
  }, [fontsLoaded, fontError]);

  const [now] = React.useState(() => Date.now());
  const [screen, setScreen] = React.useState<Screen>('feed');
  const [loginVariant, setLoginVariant] = React.useState<LoginVariant>('picker');
  const [liked, setLiked] = React.useState<Record<string, boolean>>({});
  const [followed, setFollowed] = React.useState<Record<string, boolean>>({});
  const [openPostId, setOpenPostId] = React.useState<string | null>(null);
  const [segments, setSegments] = React.useState<string[]>(['']);
  const [query, setQuery] = React.useState('');
  const [audience, setAudience] = React.useState('Community or topic');
  const [posted, setPosted] = React.useState(false);
  const [ownPosts, setOwnPosts] = React.useState<Post[]>([]);
  const [ownReplies, setOwnReplies] = React.useState<ReplyNode[]>([]);
  const [reposted, setReposted] = React.useState<Record<string, boolean>>({});
  const toggleRepost = React.useCallback((id: string) => setReposted((s) => ({ ...s, [id]: !s[id] })), []);
  const addReply = React.useCallback((r: ReplyNode) => setOwnReplies((s) => [...s, r]), []);
  const [askNotifications, setAskNotifications] = React.useState(false);
  const [notificationsOn, setNotificationsOn] = React.useState(false);
  const requestNotifications = React.useCallback(() => setAskNotifications(true), []);
  const [joining, setJoining] = React.useState(false);
  const closePrompt = React.useCallback(() => {
    setAskNotifications(false);
    if (joining) {
      setJoining(false);
      setScreen('suggestions');
    }
  }, [joining]);
  const feedScroll = React.useRef<ScrollView | null>(null);
  const feedOffset = React.useRef(0);
  const [restoreAt, setRestoreAt] = React.useState<number | null>(null);

  const feed = React.useMemo(() => buildFeed(now), [now]);
  const thread = React.useMemo(() => buildThread(now), [now]);

  const toggleLike = React.useCallback((id: string) => setLiked((s) => ({ ...s, [id]: !s[id] })), []);

  const toggleFollow = React.useCallback((handle: string) => setFollowed((s) => ({ ...s, [handle]: !s[handle] })), []);

  React.useEffect(() => {
    if (screen === 'feed' && restoreAt !== null && feedScroll.current) {
      feedScroll.current.scrollTo({ y: restoreAt, animated: false });
      setRestoreAt(null);
    }
  }, [screen, restoreAt]);

  const openPost = (id: string) => {
    setOpenPostId(id);
    setScreen('post');
  };

  const backToFeed = () => {
    setRestoreAt(feedOffset.current);
    setScreen('feed');
  };

  const onNavigate = (key: string) => {
    if (key === 'feed') return setScreen('feed');
    if (key === 'messages') return setScreen('messages');
    if (key === 'create') {
      setSegments((s) => (s.length ? s : ['']));
      setPosted(false);
      return setScreen('create');
    }
    if (key === 'activity') return setScreen('activity');
    if (key === 'profile') return setScreen('profile');
    if (key === 'search') return setScreen('search');
    if (key === 'settings') return setScreen('settings');
    return setScreen('login');
  };

  if (!fontsReady) {
    return (
      <View style={styles.shell}>
        <Text style={styles.loading} accessibilityLabel="Loading">Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.shell}>
      <StatusBar style="dark" />
      <View style={styles.frame}>
        <React.Suspense fallback={null}>
        {screen === 'login' ? (
          <LoginScreen
            variant={loginVariant}
            onVariant={setLoginVariant}
            onPick={() => setScreen('suggestions')}
            onJoin={() => {
              setJoining(true);
              setAskNotifications(true);
            }}
            onLogin={() => setScreen('feed')}
          />
        ) : null}
        {screen === 'suggestions' ? (
          <FollowSuggestionsScreen
            onCancel={() => setScreen('feed')}
            onDone={(handles) => {
              setFollowed((s) => ({ ...s, ...Object.fromEntries(handles.map((h) => [h, true])) }));
              setScreen('feed');
            }}
          />
        ) : null}

        {screen === 'feed' ? (
          <FeedScreen
            now={now}
            posts={feed}
            liked={liked}
            onToggleLike={toggleLike}
            onOpenPost={openPost}
            onNavigate={onNavigate}
            scrollRef={feedScroll}
            onScrollOffset={(y) => (feedOffset.current = y)}
            followed={followed}
            onToggleFollow={toggleFollow}
            ownPosts={ownPosts}
            reposted={reposted}
            onToggleRepost={toggleRepost}
          />
        ) : null}

        {screen === 'post' ? (
          <ThreadDetail
            now={now}
            root={thread.root}
            replies={thread.replies}
            liked={liked}
            onToggleLike={toggleLike}
            onBack={backToFeed}
            followed={!!followed[thread.root.handle]}
            onToggleFollow={() => toggleFollow(thread.root.handle)}
            notificationsOn={notificationsOn}
            onRequestNotifications={requestNotifications}
            added={ownReplies}
            onAddReply={addReply}
          />
        ) : null}

        {screen === 'create' ? (
          <Composer
            segments={segments}
            onChange={setSegments}
            onAddSegment={() => setSegments((s) => [...s, ''])}
            onRemoveSegment={(i) => setSegments((s) => (s.length <= 1 ? s : s.filter((_, j) => j !== i)))}
            onClose={() => setScreen('feed')}
            onPost={() => {
              setOwnPosts((s) => [...buildOwnThread(segments, Date.now(), s.length), ...s]);
              setSegments(['']);
              setPosted(true);
              setScreen('feed');
            }}
            audience={audience}
            onAudience={() => setAudience((a) => (a === 'Community or topic' ? 'Profile you follow' : 'Community or topic'))}
          />
        ) : null}

        {screen === 'search' ? <SearchScreen query={query} onQuery={setQuery} onBack={backToFeed} onNavigate={onNavigate} followed={followed} onToggleFollow={toggleFollow} /> : null}
        {screen === 'activity' ? (
          <ActivityScreen now={now} onNavigate={onNavigate} notificationsOn={notificationsOn} onRequestNotifications={requestNotifications} />
        ) : null}
        {screen === 'profile' ? (
          <ProfileScreen
            onNavigate={onNavigate}
            followed={followed}
            onToggleFollow={toggleFollow}
            now={now}
            ownPosts={ownPosts}
            ownReplies={ownReplies}
            replyContext={thread.root}
            repostedPosts={feed.filter((p) => reposted[p.id])}
            liked={liked}
            onToggleLike={toggleLike}
            onOpenPost={openPost}
            onToggleRepost={toggleRepost}
          />
        ) : null}
        {screen === 'settings' ? <SettingsScreen onBack={() => setScreen('profile')} /> : null}
        {screen === 'messages' ? <MessagesScreen onNavigate={onNavigate} onRequestNotifications={requestNotifications} /> : null}
        </React.Suspense>
        <React.Suspense fallback={null}>
        {askNotifications ? (
          <NotificationPrompt
            onAllow={() => {
              setNotificationsOn(true);
              closePrompt();
            }}
            onDeny={closePrompt}
          />
        ) : null}
        </React.Suspense>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show login screen"
        onPress={() => {
          if (screen === 'login') {
            setLoginVariant((v) => (v === 'generic' ? 'picker' : v === 'picker' ? 'join' : v === 'join' ? 'launch' : 'generic'));
          } else {
            setLoginVariant('generic');
            setScreen('login');
          }
        }}
        style={styles.loginKey}
      />
      {posted ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Posted" onPress={() => setPosted(false)} style={styles.postedToast}>
          <Text style={styles.postedText}>Posted</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: '#E9E9E9', alignItems: 'center', justifyContent: 'center' },
  frame: { width: frame.width, height: frame.height, backgroundColor: colors.page, overflow: 'hidden' },
  loading: { fontSize: 14, color: colors.secondary },
  loginKey: { position: 'absolute', right: 6, bottom: 6, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  loginKeyText: { fontSize: 22, lineHeight: 22, color: colors.secondary },
  postedToast: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: colors.ink, borderRadius: 18, paddingHorizontal: 16, height: 36, alignItems: 'center', justifyContent: 'center' },
  postedText: { color: colors.onDark, fontSize: 15 },
});
