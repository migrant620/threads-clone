import * as React from 'react';
import { Image, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionRow, ActionSheet, Avatar, BottomNav, FollowBadge, MoreKey, PostHeader, TopBar } from './Chrome';
import { ChevronRightIcon } from './Icons';
import { account, formatCount, relativeTime, type Post } from '../data';
import { colors, feedRows, fonts, frame, radius, rhythm, space, tracking, type, weight } from '../tokens';


type Props = {
  now: number;
  posts: Post[];
  liked: Record<string, boolean>;
  onToggleLike: (id: string) => void;
  onOpenPost: (id: string) => void;
  onNavigate: (key: string) => void;
  scrollRef?: React.RefObject<ScrollView | null>;
  onScrollOffset?: (y: number) => void;
  followed?: Record<string, boolean>;
  onToggleFollow?: (handle: string) => void;
  ownPosts?: Post[];
  reposted?: Record<string, boolean>;
  onToggleRepost?: (id: string) => void;
};

const FeedsPanel = React.lazy(() => import('./FeedsPanel').then((m) => ({ default: m.FeedsPanel })));
const MediaViewer = React.lazy(() => import('./MediaViewer').then((m) => ({ default: m.MediaViewer })));

const FEED_TOP = 115.6;
const FEED_HEIGHT = 728 - FEED_TOP;
const TRIGGER = 30;
const MAX_PULL = 70;
const REFRESH_MS = 900;

export const FeedScreen: React.FC<Props> = ({
  now,
  posts,
  liked,
  onToggleLike,
  onOpenPost,
  onNavigate,
  scrollRef,
  onScrollOffset,
  followed = {},
  onToggleFollow,
  ownPosts = [],
  reposted = {},
  onToggleRepost,
}) => {
  const [pull, setPull] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const offset = React.useRef(0);
  const pulled = React.useRef(0);
  const busy = React.useRef(false);
  const [sheet, setSheet] = React.useState<{ kind: 'repost' | 'share'; id: string } | null>(null);
  const [feedsOpen, setFeedsOpen] = React.useState(false);
  const [viewing, setViewing] = React.useState<Post['photo'] | null>(null);
  const dragged = React.useRef(false);
  const openPhoto = React.useCallback((src: NonNullable<Post['photo']>) => {
    if (dragged.current || busy.current) return;
    setViewing(src);
  }, []);

  const begin = React.useCallback(() => {
    busy.current = true;
    pulled.current = 44;
    setPull(44);
    setRefreshing(true);
    setTimeout(() => {
      busy.current = false;
      pulled.current = 0;
      setPull(0);
      setRefreshing(false);
    }, REFRESH_MS);
  }, []);

  const responder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_e, g) =>
          !busy.current && offset.current <= 0 && g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderGrant: () => {
          dragged.current = true;
        },
        onPanResponderMove: (_e, g) => {
          const d = Math.max(0, Math.min(MAX_PULL, g.dy * 0.5));
          pulled.current = d;
          setPull(d);
        },
        onPanResponderRelease: () => {
          setTimeout(() => (dragged.current = false), 0);
          if (pulled.current >= TRIGGER) begin();
          else {
            pulled.current = 0;
            setPull(0);
          }
        },
        onPanResponderTerminate: () => {
          setTimeout(() => (dragged.current = false), 0);
          pulled.current = 0;
          setPull(0);
        },
      }),
    [begin],
  );

  return (
    <View style={styles.screen}>
      <TopBar left="menu" onLeft={() => setFeedsOpen(true)} wordmark right={['search']} onRight={(k) => (k === 'search' ? onNavigate('search') : undefined)} />
      <ComposerEntry onPress={() => onNavigate('create')} />
      <View pointerEvents="none" style={styles.feedRule} />
      {refreshing || pull > 0 ? (
        <View
          accessibilityRole="progressbar"
          accessibilityLabel={refreshing ? 'Refreshing' : 'Pull to refresh feed'}
          style={[styles.pullRow, { top: FEED_TOP + Math.max(0, pull) / 2 - 12 }]}
        >
          <View style={styles.spinner} />
        </View>
      ) : null}
      <View style={styles.feedArea} {...responder.panHandlers}>
        <ScrollView
          ref={scrollRef}
          style={styles.scroller}
          contentContainerStyle={{ paddingTop: pull, paddingBottom: 8 }}
          onScroll={(e) => {
            const y = e.nativeEvent.contentOffset.y;
            offset.current = y;
            onScrollOffset?.(y);
          }}
          scrollEventThrottle={16}
        >
          {ownPosts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              index={-1}
              now={now}
              liked={!!liked[p.id]}
              reposted={false}
              onToggleLike={() => onToggleLike(p.id)}
              onOpen={() => onOpenPost(p.id)}
              onRepostKey={() => setSheet({ kind: 'repost', id: p.id })}
              onShareKey={() => setSheet({ kind: 'share', id: p.id })}
              onPhoto={openPhoto}
            />
          ))}
          {posts.map((p, i) => (
            <PostCard
              key={p.id}
              post={p}
              index={i}
              now={now}
              liked={!!liked[p.id]}
              reposted={!!reposted[p.id]}
              onToggleLike={() => onToggleLike(p.id)}
              onOpen={() => onOpenPost(p.id)}
              onRepostKey={() => setSheet({ kind: 'repost', id: p.id })}
              onShareKey={() => setSheet({ kind: 'share', id: p.id })}
              following={!!followed[p.handle]}
              onFollow={onToggleFollow ? () => onToggleFollow(p.handle) : undefined}
              onPhoto={openPhoto}
            />
          ))}
        </ScrollView>
      </View>
      <BottomNav current="feed" onSelect={onNavigate} />
      {sheet ? (
        <ActionSheet
          rows={
            sheet.kind === 'repost'
              ? [
                  {
                    label: 'Repost',
                    onPress: () => {
                      onToggleRepost?.(sheet.id);
                      setSheet(null);
                    },
                  },
                  { label: 'Quote', onPress: () => setSheet(null) },
                ]
              : [
                  { label: 'Copy link', onPress: () => setSheet(null) },
                  { label: 'Share', onPress: () => setSheet(null) },
                ]
          }
          onClose={() => setSheet(null)}
        />
      ) : null}
      <React.Suspense fallback={null}>
        {feedsOpen ? <FeedsPanel onClose={() => setFeedsOpen(false)} /> : null}
        {viewing ? <MediaViewer source={viewing} onClose={() => setViewing(null)} /> : null}
      </React.Suspense>
    </View>
  );
};

const ComposerEntry: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <Pressable accessibilityRole="button" accessibilityLabel="Create a new thread" onPress={onPress} style={styles.composerEntry}>
    <View style={{ position: 'absolute', left: space.avatarLeft, top: 54.1 }}>
      <Avatar source={account.avatar} label="m620ui profile photo" />
    </View>
    <Text accessibilityLabel="m620ui" style={[styles.composerHandle, { top: 57.85 }]}>m620ui</Text>
    <Text style={[styles.composerPrompt, { top: 79.35 }]}>What&apos;s new?</Text>
  </Pressable>
);

export const PostCard: React.FC<{
  post: Post;
  now: number;
  liked: boolean;
  reposted: boolean;
  onToggleLike: () => void;
  onOpen: () => void;
  onRepostKey: () => void;
  onShareKey: () => void;
  index?: number;
  following?: boolean;
  onFollow?: () => void;
  onPhoto?: (src: NonNullable<Post['photo']>) => void;
}> = ({ post, now, liked, reposted, onToggleLike, onOpen, onRepostKey, onShareKey, index = 0, following = false, onFollow, onPhoto }) => {
  const badge = !!post.suggestFollow && !following;
  const hasMedia = !!(post.photo || post.gallery || post.quote);
  return (
  <View style={{ width: frame.width }}>
    {post.topic ? (
      <TopicHeader post={post} time={relativeTime(post.postedAt, now)} onOpen={onOpen} badge={badge} onFollow={badge ? onFollow : undefined} />
    ) : (
      <PostHeader
        avatar={post.avatar}
        handle={post.handle}
        verified={post.verified}
        time={relativeTime(post.postedAt, now)}
        row={feedRows[index] ?? feedRows[0]}
        onOpen={onOpen}
        openLabel={index === 0 ? 'Open post' : `Open post by ${post.handle}`}
        followBadge={badge}
        onAvatarPress={badge ? onFollow : undefined}
      />
    )}
    <View style={[styles.bodyBox, index === 1 ? styles.bodyLift : null]}>
      <Text style={styles.body}>
        {post.body}
        {post.link ? (
          <>
            {' '}
            <Text accessibilityRole="link" accessibilityLabel={flushLink(post.link)} onPress={onOpen} style={styles.linkTarget}>
              <Text style={styles.link}>{flushLink(post.link)}</Text>
            </Text>
          </>
        ) : null}
      </Text>
    </View>
    {post.part ? <PartPill index={post.part.index} total={post.part.total} /> : null}
    {post.gallery ? <Gallery photos={post.gallery} afterPill={!!post.part} onPhoto={onPhoto} /> : null}
    {post.quote ? <QuoteCard quote={post.quote} now={now} onOpen={onOpen} /> : null}
    {post.photo ? (
      <View style={styles.mediaBlock}>
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.mediaPlate}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Photo preview"
            onPress={onPhoto && post.photo ? () => onPhoto(post.photo as NonNullable<Post['photo']>) : undefined}
            style={styles.media}
          >
            <Image source={post.photo} style={styles.mediaImage} resizeMode="cover" />
          </Pressable>
        </Pressable>
      </View>
    ) : hasMedia ? null : (
      <View style={{ height: rhythm.post.bodyToActions }} />
    )}
    <Pressable accessibilityRole="button" accessibilityLabel="" style={[styles.actionPlate, post.photo ? { marginTop: 0.5 } : null]}>
      <View style={styles.actionInset}>
        <ActionRow
          likes={post.likes + (liked ? 1 : 0)}
          replies={post.replies}
          reposts={post.reposts + (reposted ? 1 : 0)}
          liked={liked}
          onLike={onToggleLike}
          onReply={onOpen}
          onRepost={onRepostKey}
          onShare={onShareKey}
          likeLabel={formatCount(post.likes + (liked ? 1 : 0))}
        />
      </View>
    </Pressable>
    <View style={{ height: rhythm.post.actionsToHairline - (post.photo ? 0.5 : 0) }} />
    <View style={styles.separator} />
  </View>
  );
};

const TopicHeader: React.FC<{ post: Post; time: string; onOpen: () => void; badge: boolean; onFollow?: () => void }> = ({ post, time, onOpen, badge, onFollow }) => (
  <View style={{ height: 64.5 }}>
    <View pointerEvents="none" aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.topicLine}>
      <Text numberOfLines={1} style={styles.topicHandle}>{post.handle}</Text>
      <View style={styles.topicChevron}>
        <ChevronRightIcon size={12.5} color={colors.secondary} />
      </View>
      <Text numberOfLines={1} style={styles.topicRun}>{post.topic}</Text>
    </View>
    <Text pointerEvents="none" style={styles.topicTime}>{time}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={`${post.handle} posted`} onPress={onOpen} style={styles.topicPosted} />
    <Pressable accessibilityRole="button" accessibilityLabel={post.topic} onPress={onOpen} style={styles.topicKey} />
    <Pressable accessibilityRole="button" accessibilityLabel={time} onPress={onOpen} style={styles.topicTimeKey} />
    <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.topicOverflow}>
      <MoreKey top={20.4} left={16} />
    </Pressable>
    <View style={{ position: 'absolute', left: space.avatarLeft, top: 13.6, zIndex: 2 }}>
      <Avatar source={post.avatar} label={`${post.handle} profile photo`} onPress={onFollow} />
      {badge ? <FollowBadge /> : null}
    </View>
  </View>
);

const PartPill: React.FC<{ index: number; total: number }> = ({ index, total }) => (
  <View accessibilityLabel={`Part ${index} of ${total}`} style={styles.partPill}>
    <Text style={[styles.partDigit, { left: 6.1 }]}>{index}</Text>
    <Text style={[styles.partDigit, { left: 14.5 }]}>/</Text>
    <Text style={[styles.partDigit, { left: 20.7 }]}>{total}</Text>
  </View>
);

const Gallery: React.FC<{ photos: Post['gallery']; afterPill: boolean; onPhoto?: (src: NonNullable<Post['photo']>) => void }> = ({
  photos = [],
  afterPill,
  onPhoto,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={[styles.gallery, { marginTop: afterPill ? 10.1 : rhythm.post.bodyToMedia }]}
    contentContainerStyle={styles.galleryRow}
  >
    {photos.map((src, i) => (
      <Pressable
        key={i}
        accessibilityRole="button"
        accessibilityLabel="Photo preview"
        onPress={onPhoto ? () => onPhoto(src) : undefined}
        style={[styles.galleryTile, i > 0 ? { marginLeft: 8.1 } : null]}
      >
        <Image source={src} style={styles.mediaImage} resizeMode="cover" />
      </Pressable>
    ))}
  </ScrollView>
);

const QuoteCard: React.FC<{ quote: NonNullable<Post['quote']>; now: number; onOpen: () => void }> = ({ quote, now, onOpen }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={`Quoted post by ${quote.handle}`} onPress={onOpen} style={styles.quoteCard}>
    <View style={styles.quoteHead}>
      <View style={styles.quoteAvatar}>
        <Image source={quote.avatar} style={styles.quoteAvatarImage} />
      </View>
      <View style={styles.quoteLine}>
        <Text style={styles.quoteHandle}>{quote.handle}</Text>
        <Text style={styles.quoteTime}>{relativeTime(quote.postedAt, now)}</Text>
      </View>
    </View>
    <Text style={styles.quoteBody}>{quote.body}</Text>
  </Pressable>
);

const flushLink = (link: string) => (link.length > 18 ? `${link.slice(0, 17)}…` : link);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },
  composerEntry: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 115.6 },
  feedArea: { position: 'absolute', left: 0, top: FEED_TOP, width: frame.width, height: FEED_HEIGHT },
  scroller: { flex: 1 },
  pullRow: { position: 'absolute', left: 0, width: frame.width, height: 24, alignItems: 'center', justifyContent: 'center', zIndex: 30 },
  spinner: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.disabled, borderTopColor: colors.secondary },
  composerHandle: { position: 'absolute', left: space.gutter, fontSize: type.body, fontWeight: weight.medium, color: colors.ink, letterSpacing: -0.27, fontFamily: fonts.body },
  composerPrompt: { position: 'absolute', left: space.gutter, width: 332.7, fontSize: type.body, color: colors.secondary, fontFamily: fonts.body },
  bodyBox: { marginLeft: space.gutter, width: 320.7 },
  bodyLift: { marginTop: -4.5 },
  body: { fontSize: type.body, lineHeight: type.bodyLine, letterSpacing: tracking.body, color: colors.ink, fontFamily: fonts.body },
  link: { color: colors.verified },
  linkTarget: { marginLeft: -0.8, paddingTop: 14.3, paddingBottom: 8.5 },
  mediaBlock: { position: 'relative', width: frame.width, height: 396, marginTop: rhythm.post.bodyToMedia },
  mediaPlate: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 396 },
  media: { position: 'absolute', left: space.gutter, top: 0, width: 316.7, height: 396, borderRadius: radius.media, overflow: 'hidden', backgroundColor: colors.surfaceAlt },
  mediaImage: { width: '100%', height: '100%' },
  actionPlate: { position: 'relative', width: frame.width, height: 43.3 },
  actionInset: { position: 'relative', left: 0, top: 0, width: frame.width, height: 43.3 },
  feedRule: { position: 'absolute', left: 0, right: 0, top: 115, height: 1, backgroundColor: colors.hairline, transformOrigin: 'top', transform: [{ translateY: 0.72 }, { scaleY: 0.728 }] },
  separator: { height: 1, backgroundColor: colors.hairline },
  topicLine: { position: 'absolute', left: space.gutter, top: 27.5 - 10, right: 48, height: 20, flexDirection: 'row', alignItems: 'center' },
  topicHandle: { fontSize: type.body, lineHeight: 20, fontWeight: weight.semibold, color: colors.ink, fontFamily: fonts.body },
  topicChevron: { marginLeft: 3, marginRight: 3.5, width: 12.5, height: 12.5 },
  topicRun: { flexShrink: 1, fontSize: type.body, lineHeight: 20, color: colors.ink, fontFamily: fonts.body },
  topicTime: { position: 'absolute', left: space.gutter, top: 48.7 - 10, lineHeight: 20, fontSize: type.body, color: colors.secondary, fontFamily: fonts.body },
  topicPosted: { position: 'absolute', left: 0, top: 15.4, width: frame.width, height: 42.9 },
  topicKey: { position: 'absolute', left: space.gutter, top: 12.9, width: 292.9, height: 48 },
  topicTimeKey: { position: 'absolute', left: 44.4, top: 23.8, width: 48, height: 48 },
  topicOverflow: { position: 'absolute', left: 345, top: -5, width: 48, height: 48 },
  partPill: { marginLeft: 60.1, marginTop: 1.3, width: 33.8, height: 14.9, borderRadius: 7.45, backgroundColor: colors.pillFill },
  partDigit: { position: 'absolute', top: 0, lineHeight: 14.9, fontSize: 11.5, color: colors.secondary, fontFamily: fonts.numbers },
  gallery: { width: frame.width, height: 245.3, flexGrow: 0, marginBottom: 16.0 },
  galleryRow: { paddingLeft: space.gutter, paddingRight: 16 },
  galleryTile: { width: 184.1, height: 245.3, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.surfaceAlt },
  quoteCard: { marginLeft: space.gutter, width: 317, borderWidth: 1, borderColor: colors.hairlineStrong, borderRadius: radius.card, paddingBottom: 16 },
  quoteHead: { height: 44.0 },
  quoteAvatar: { position: 'absolute', left: 15.7, top: 16.1, width: 20, height: 20, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.surfaceAlt },
  quoteAvatarImage: { width: 20, height: 20 },
  quoteLine: { position: 'absolute', left: 44.1, top: 26.3 - 10, height: 20, flexDirection: 'row', alignItems: 'center' },
  quoteHandle: { lineHeight: 20, fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: fonts.body },
  quoteTime: { marginLeft: 4, lineHeight: 20, fontSize: type.body, color: colors.secondary, fontFamily: fonts.body },
  quoteBody: { marginLeft: 16.1, width: 284.9, fontSize: type.body, lineHeight: type.bodyLine, letterSpacing: tracking.body, color: colors.ink, fontFamily: fonts.body },
});
