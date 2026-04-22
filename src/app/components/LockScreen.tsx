import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'motion/react';
import {
  MessageSquare, Hash, Phone, Flame, MapPin, Map, Music,
  Camera, Mail, CalendarDays, Zap, Play, Car, Briefcase, DollarSign, Star, MessageCircle,
} from 'lucide-react';

const WALLPAPER =
  'https://images.unsplash.com/photo-1774923309787-d94a3eecd317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9vbiUyMG5pZ2h0JTIwc3BhY2UlMjBtaW5pbWFsJTIwd2FsbHBhcGVyfGVufDF8fHx8MTc3Njg4ODkyMXww&ixlib=rb-4.1.0&q=80&w=1080';

// ─────────────────────────────────────────────
// App icon colours & shapes
// ─────────────────────────────────────────────
const APP_META: Record<string, { bg: string; gradient?: string }> = {
  messages:  { gradient: 'linear-gradient(145deg,#58f552,#00b931)' },
  slack:     { gradient: 'linear-gradient(145deg,#56117f,#3d0c6b)' },
  phone:     { gradient: 'linear-gradient(145deg,#58f552,#00b931)' },
  tinder:    { gradient: 'linear-gradient(145deg,#ff5a5a,#ff2d55)' },
  findmy:    { gradient: 'linear-gradient(145deg,#58f552,#00b931)' },
  maps:      { gradient: 'linear-gradient(145deg,#ffffff,#e8f0ff)' },
  music:     { gradient: 'linear-gradient(145deg,#ff6b6b,#fc3c44)' },
  instagram: { gradient: 'linear-gradient(145deg,#f9a248,#e1306c,#833ab4)' },
  gmail:     { gradient: 'linear-gradient(145deg,#ea4335,#c5221f)' },
  calendar:  { gradient: 'linear-gradient(145deg,#ffffff,#f2f2f7)' },
  x:         { gradient: 'linear-gradient(145deg,#1a1a1a,#000000)' },
  netflix:   { gradient: 'linear-gradient(145deg,#e50914,#b20710)' },
  uber:      { gradient: 'linear-gradient(145deg,#000000,#1a1a1a)' },
  linkedin:  { gradient: 'linear-gradient(145deg,#0a66c2,#004182)' },
  cashapp:   { gradient: 'linear-gradient(145deg,#00d64f,#00a63e)' },
  duolingo:  { gradient: 'linear-gradient(145deg,#58cc02,#3e9600)' },
  reddit:    { gradient: 'linear-gradient(145deg,#ff4500,#cc3700)' },
};

function AppIcon({ id, size = 40 }: { id: string; size?: number }) {
  const meta = APP_META[id] ?? { bg: '#555' };
  const iconProps = { size: size * 0.55, strokeWidth: 2 };
  const iconMap: Record<string, React.ReactNode> = {
    messages:  <MessageSquare {...iconProps} color="white" />,
    slack:     <Hash {...iconProps} color="white" />,
    phone:     <Phone {...iconProps} color="white" fill="white" />,
    tinder:    <Flame {...iconProps} color="white" fill="white" />,
    findmy:    <MapPin {...iconProps} color="white" fill="white" />,
    maps:      <Map {...iconProps} color="#3478f6" />,
    music:     <Music {...iconProps} color="white" />,
    instagram: <Camera {...iconProps} color="white" />,
    gmail:     <Mail {...iconProps} color="white" />,
    calendar:  <CalendarDays {...iconProps} color="#e8290b" />,
    x:         <Zap {...iconProps} color="white" fill="white" />,
    netflix:   <Play {...iconProps} color="white" fill="white" />,
    uber:      <Car {...iconProps} color="white" />,
    linkedin:  <Briefcase {...iconProps} color="white" />,
    cashapp:   <DollarSign {...iconProps} color="white" />,
    duolingo:  <Star {...iconProps} color="white" fill="white" />,
    reddit:    <MessageCircle {...iconProps} color="white" fill="white" />,
  };
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: size * 0.24,
        background: meta.gradient ?? meta.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      {iconMap[id]}
    </div>
  );
}

// ─────────────────────────────────────────────
// Notification data
// ─────────────────────────────────────────────
export type NItem = { id: string; sender: string; body: string; time: string };
export type NGroup = {
  id: string;
  appId: string;
  appName: string;
  items: NItem[];
  dismissed: boolean;
  expanded: boolean;
  canOpen: boolean;
};

const INITIAL_GROUPS: NGroup[] = [
  {
    id: 'messages', appId: 'messages', appName: 'Messages', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'm1', sender: 'Agnes Lawyer', body: 'Call me back ASAP — urgent regarding DANIELS VS. XU. Please.', time: '8m ago' },
      { id: 'm2', sender: 'Arjun', body: 'Hate how we left things yesterday. Metrics review over drinks tonight?', time: '22m ago' },
      { id: 'm3', sender: 'Akeem', body: 'Last night was everything 😊 When can I see you again?', time: '1h ago' },
    ],
  },
  {
    id: 'slack', appId: 'slack', appName: 'Slack', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 's1', sender: '#code-review', body: '@charlie 3 PRs are blocked on your review — people waiting', time: 'now' },
      { id: 's2', sender: 'Gary Chen', body: '@charlie can you review my branch before 3pm standup? 🙏', time: '5m ago' },
      { id: 's3', sender: 'Priya S.', body: '@charlie prod deploy is frozen — need your sign-off NOW', time: '12m ago' },
      { id: 's4', sender: '#engineering', body: '@channel staging is down again — all hands investigate', time: '18m ago' },
      { id: 's5', sender: 'Marcus T.', body: '@charlie what\'s the ETA on the security patch?', time: '31m ago' },
      { id: 's6', sender: 'Gary Chen', body: 'following up on the API rate limit issue you flagged', time: '45m ago' },
      { id: 's7', sender: 'Priya S.', body: 'sprint review in 20 mins — joining?', time: '1h ago' },
      { id: 's8', sender: 'Marcus T.', body: 'pipeline is back up btw — deploy ready', time: '1h ago' },
      { id: 's9', sender: '#general', body: 'Free donuts in the kitchen 🍩 first come first served', time: '2h ago' },
      { id: 's10', sender: 'Gary Chen', body: 'also — can we sync on the Daniels project scope?', time: '2h ago' },
    ],
  },
  {
    id: 'phone', appId: 'phone', appName: 'Phone', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'p1', sender: 'Nic', body: 'Missed call · Tap to call back', time: '14m ago' },
    ],
  },
  {
    id: 'tinder', appId: 'tinder', appName: 'Tinder', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 't1', sender: 'Tinder', body: '🔥 You have a new match!', time: '2m ago' },
      { id: 't2', sender: 'Akeem', body: 'What are u doing right now?', time: '15m ago' },
      { id: 't3', sender: 'Some Guy', body: 'I love Chinese food ;)', time: '38m ago' },
      { id: 't4', sender: 'Hot Guy', body: 'Yum. Show me more. 😛', time: '1h ago' },
      { id: 't5', sender: 'Brad M.', body: 'Hey there ✨ hope your day is going well', time: '2h ago' },
    ],
  },
  {
    id: 'findmy', appId: 'findmy', appName: 'Find My', canOpen: true,
    dismissed: false, expanded: false,
    items: [
      { id: 'fm1', sender: "Nic's iPhone", body: "Nic's iPhone is nearby — tap to view location", time: '3m ago' },
    ],
  },
  {
    id: 'maps', appId: 'maps', appName: 'Maps', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'mp1', sender: 'Maps', body: 'Route updated · ETA 12 min to destination', time: '7m ago' },
    ],
  },
  {
    id: 'music', appId: 'music', appName: 'Music', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'mu1', sender: 'Apple Music', body: 'Jolene — Dolly Parton · Now Playing', time: '9m ago' },
    ],
  },
  {
    id: 'instagram', appId: 'instagram', appName: 'Instagram', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'ig1', sender: 'Instagram', body: 'sofia_v and 47 others liked your photo', time: '4m ago' },
      { id: 'ig2', sender: 'Instagram', body: 'jake.m commented: "this is everything 🔥"', time: '11m ago' },
      { id: 'ig3', sender: 'Instagram', body: 'You have a new follower: marcus_shoots', time: '28m ago' },
    ],
  },
  {
    id: 'gmail', appId: 'gmail', appName: 'Gmail', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'gm1', sender: 'HR Team', body: 'Your Q3 performance review is scheduled for Friday at 2pm', time: '6m ago' },
      { id: 'gm2', sender: 'IT Security', body: 'Action required: Update your password before midnight tonight', time: '19m ago' },
      { id: 'gm3', sender: 'noreply@delta.com', body: 'Flight DL 2847 to JFK departs in 3 hours — check in now', time: '44m ago' },
    ],
  },
  {
    id: 'calendar', appId: 'calendar', appName: 'Calendar', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'cal1', sender: 'In 15 minutes', body: 'Dinner reservation · The Inn at Little Washington', time: '1m ago' },
      { id: 'cal2', sender: 'Tomorrow 9:00 AM', body: 'Daniels v. Xu — Pre-trial hearing · Courtroom B', time: '3m ago' },
    ],
  },
  {
    id: 'x', appId: 'x', appName: 'X', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'x1', sender: 'X', body: '@danielscase retweeted your post — 214 new impressions', time: '17m ago' },
      { id: 'x2', sender: 'X', body: 'You were mentioned in a post by @legalinsider', time: '52m ago' },
    ],
  },
  {
    id: 'netflix', appId: 'netflix', appName: 'Netflix', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'nf1', sender: 'Netflix', body: 'New episode available: "The Diplomat" S2 E4 — Watch now', time: '1h ago' },
    ],
  },
  {
    id: 'uber', appId: 'uber', appName: 'Uber', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'ub1', sender: 'Uber', body: 'Your driver Kofi is 3 minutes away · Toyota Camry · KZM 4829', time: '2m ago' },
      { id: 'ub2', sender: 'Uber Eats', body: 'Your order from Shake Shack is out for delivery', time: '33m ago' },
    ],
  },
  {
    id: 'linkedin', appId: 'linkedin', appName: 'LinkedIn', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'li1', sender: 'LinkedIn', body: 'Sarah Kim viewed your profile — she\'s a Senior Partner at Kirkland & Ellis', time: '20m ago' },
      { id: 'li2', sender: 'LinkedIn', body: 'You have 3 new connection requests', time: '1h ago' },
    ],
  },
  {
    id: 'cashapp', appId: 'cashapp', appName: 'Cash App', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'ca1', sender: 'Cash App', body: 'Arjun sent you $120.00 — "dinner last night 🍷"', time: '25m ago' },
    ],
  },
  {
    id: 'duolingo', appId: 'duolingo', appName: 'Duolingo', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'dl1', sender: 'Duolingo', body: "You're on a 14-day streak! Don't break it now 🦉", time: '2h ago' },
    ],
  },
  {
    id: 'reddit', appId: 'reddit', appName: 'Reddit', canOpen: false,
    dismissed: false, expanded: false,
    items: [
      { id: 'rd1', sender: 'r/legaladvice', body: 'Your post "Daniels v. Xu update" has 847 upvotes and 203 comments', time: '1h ago' },
      { id: 'rd2', sender: 'r/Charlottesville', body: 'New reply to your comment in "Best spots downtown"', time: '3h ago' },
    ],
  },
];

// ─────────────────────────────────────────────
// Single swipeable notification group
// ─────────────────────────────────────────────
function NotificationGroup({
  group,
  onDismiss,
  onToggleExpand,
  onOpenApp,
}: {
  group: NGroup;
  onDismiss: () => void;
  onToggleExpand: () => void;
  onOpenApp?: () => void;
}) {
  const x = useMotionValue(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const isDismissed = useRef(false);
  const stackCount = group.items.length;
  const showStack = !group.expanded && stackCount > 1;

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (isDismissed.current) return;
    if (info.offset.x < -90 || info.velocity.x < -400) {
      isDismissed.current = true;
      animate(x, -500, { duration: 0.28, ease: [0.4, 0, 1, 1] });
      setTimeout(onDismiss, 260);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
    setIsSwiping(false);
  };

  const handleDragStart = () => setIsSwiping(true);

  const glassStyle: React.CSSProperties = {
    background: 'rgba(28,28,30,0.72)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 16,
  };

  const handleTap = () => {
    if (isSwiping) return;
    if (onOpenApp) {
      onOpenApp();
    } else {
      onToggleExpand();
    }
  };

  const topItem = group.items[0];

  return (
    <div style={{ position: 'relative', marginBottom: 10 }}>
      {/* Stack peek cards */}
      {showStack && stackCount >= 3 && (
        <div style={{
          position: 'absolute',
          top: 10, bottom: -10, left: 10, right: 10,
          ...glassStyle,
          opacity: 0.55,
          zIndex: 0,
        }} />
      )}
      {showStack && stackCount >= 2 && (
        <div style={{
          position: 'absolute',
          top: 5, bottom: -5, left: 5, right: 5,
          ...glassStyle,
          opacity: 0.72,
          zIndex: 1,
        }} />
      )}

      {/* Main swipeable card */}
      <motion.div
        style={{ x, position: 'relative', zIndex: 2, cursor: 'grab' }}
        drag="x"
        dragConstraints={{ right: 0 }}
        dragElastic={0.05}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        whileTap={{ scale: 0.985 }}
      >
        {/* Red clear reveal */}
        <motion.div
          style={{
            position: 'absolute', right: -80, top: 0, bottom: 0, width: 80,
            background: '#ff3b30',
            borderRadius: '0 16px 16px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0,
          }}
          animate={{
            opacity: 0,
          }}
        >
          <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Clear</span>
        </motion.div>

        <div style={{ ...glassStyle, overflow: 'hidden' }}>
          {/* Collapsed or single view */}
          {!group.expanded && (
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <AppIcon id={group.appId} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, letterSpacing: 0.2 }}>
                      {group.appName}
                      {stackCount > 1 && (
                        <span style={{ marginLeft: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 8, padding: '1px 6px', fontSize: 11, color: 'white' }}>
                          {stackCount}
                        </span>
                      )}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{topItem.time}</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 500, lineHeight: 1.3, marginBottom: 1 }}>
                    {topItem.sender}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                    {topItem.body}
                  </div>
                  {stackCount > 1 && (
                    <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>
                      {stackCount - 1} more notification{stackCount - 1 > 1 ? 's' : ''} →
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Expanded view */}
          {group.expanded && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px 8px' }}>
                <AppIcon id={group.appId} size={32} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>{group.appName}</span>
                <span style={{ marginLeft: 'auto', color: '#007AFF', fontSize: 13, fontWeight: 500 }}>Show Less</span>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 14px' }} />
              <AnimatePresence>
                {group.items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: idx * 0.04, duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '9px 14px', borderBottom: idx < group.items.length - 1 ? '1px solid rgba(255,255,255,0.07)' : undefined }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, fontWeight: 600 }}>{item.sender}</span>
                        <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>{item.time}</span>
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13, lineHeight: 1.35 }}>{item.body}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Status bar icons (SVG-based)
// ─────────────────────────────────────────────
function SignalBars({ bars = 3 }: { bars?: number }) {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13">
      {[0,1,2,3].map(i => (
        <rect
          key={i}
          x={i * 4.5}
          y={13 - (i + 1) * 3 - i}
          width={3.5}
          height={(i + 1) * 3 + i}
          rx={1}
          fill={i < bars ? 'white' : 'rgba(255,255,255,0.3)'}
        />
      ))}
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="13" viewBox="0 0 16 13">
      <path d="M8 10.5 C8 10.5 8 10.5 8 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M5.5 8.5 Q8 6.8 10.5 8.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M3 6 Q8 3.5 13 6" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M0.5 3.5 Q8 0 15.5 3.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function BatteryIcon({ percent = 85 }: { percent?: number }) {
  const barWidth = Math.max(0, Math.min(18, Math.round((percent / 100) * 18)));
  const barColor = percent < 20 ? '#ff3b30' : percent < 30 ? '#ff9500' : 'white';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <div style={{ position: 'relative', width: 24, height: 13 }}>
        <svg width="24" height="13" viewBox="0 0 24 13">
          <rect x="0.5" y="0.5" width="20" height="12" rx="3.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
          <rect x="20.5" y="4" width="3" height="5" rx="1" fill="rgba(255,255,255,0.45)" />
          <rect x="2" y="2" width={barWidth} height="9" rx="2" fill={barColor} />
        </svg>
      </div>
      <span style={{ color: 'white', fontSize: 12, fontWeight: 500, letterSpacing: -0.2 }}>{percent}%</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Activity ring widgets (decorative)
// ─────────────────────────────────────────────
function ActivityRing({ progress, icon, size = 52 }: { progress: number; icon: React.ReactNode; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={4} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth={4}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'relative', zIndex: 1, opacity: 0.75 }}>{icon}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main LockScreen component
// ─────────────────────────────────────────────
interface LockScreenProps {
  onOpenFindMy: () => void;
  onReset: () => void;
}

export function LockScreen({ onOpenFindMy, onReset }: LockScreenProps) {
  const [time, setTime] = useState(new Date());
  const [groups, setGroups] = useState<NGroup[]>(INITIAL_GROUPS);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatHour = (d: Date) => {
    const h = d.getHours() % 12 || 12;
    return h.toString();
  };
  const formatMin = (d: Date) => d.getMinutes().toString().padStart(2, '0');
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleTimeTap = useCallback(() => {
    tapCountRef.current += 1;
    clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      onReset();
      return;
    }
    tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0; }, 500);
  }, [onReset]);

  const dismissGroup = (id: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, dismissed: true } : g));
  };

  const toggleExpand = (id: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, expanded: !g.expanded } : g));
  };

  const visibleGroups = groups.filter(g => !g.dismissed);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
      {/* Wallpaper */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${WALLPAPER})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
      }} />
      {/* Dim overlay for text legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)' }} />

      {/* ── Scrollable content ── */}
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: 'calc(90px + env(safe-area-inset-bottom, 20px))',
      }}>
        {/* ── Date / Time ── */}
        <div
          style={{
            textAlign: 'center',
            paddingTop: 80,
            paddingBottom: 8,
            cursor: 'default',
            userSelect: 'none',
          }}
          onClick={handleTimeTap}
        >
          <div style={{
            color: 'rgba(255,255,255,0.88)',
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: 0.2,
            marginBottom: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          }}>
            {formatDate(time)}
          </div>
          <div style={{
            color: 'white',
            fontSize: 96,
            fontWeight: 100,
            letterSpacing: -4,
            lineHeight: 1,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>
            {formatHour(time)}:{formatMin(time)}
          </div>
        </div>

        {/* ── Activity ring widgets ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '10px 0 20px' }}>
          <ActivityRing progress={0.78} size={52} icon={<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="rgba(255,255,255,0.8)"/></svg>} />
          <ActivityRing progress={0.62} size={52} icon={<svg width="18" height="18" viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="16" rx="4" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/><line x1="12" y1="19" x2="12" y2="21" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/></svg>} />
          <ActivityRing progress={0.45} size={52} icon={<svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 8 Q12 3 21 8 Q21 16 12 21 Q3 16 3 8Z" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/><circle cx="9" cy="12" r="2" fill="rgba(255,255,255,0.8)"/><circle cx="15" cy="12" r="2" fill="rgba(255,255,255,0.8)"/></svg>} />
        </div>

        {/* ── Notifications ── */}
        <div style={{ padding: '0 16px' }}>
          <AnimatePresence>
            {visibleGroups.map(group => (
              <motion.div
                key={group.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, scaleX: 0.9 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <NotificationGroup
                  group={group}
                  onDismiss={() => dismissGroup(group.id)}
                  onToggleExpand={() => toggleExpand(group.id)}
                  onOpenApp={group.canOpen ? onOpenFindMy : undefined}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {visibleGroups.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, paddingTop: 20 }}
            >
              No Notifications
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
        paddingTop: 16,
        paddingLeft: 40,
        paddingRight: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)',
        zIndex: 30,
      }}>
        {/* Flashlight */}
        <button
          style={{
            width: 50, height: 50,
            borderRadius: 25,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => {}}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 3h6l1 8H8L9 3z" fill="white" opacity="0.9"/>
            <path d="M8 11l1 10h6l1-10" fill="white" opacity="0.7"/>
            <line x1="12" y1="15" x2="12" y2="19" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Home indicator placeholder */}
        <div style={{
          width: 134, height: 5,
          background: 'rgba(255,255,255,0.3)',
          borderRadius: 3,
        }} />

        {/* Camera */}
        <button
          style={{
            width: 50, height: 50,
            borderRadius: 25,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => {}}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="6" width="20" height="14" rx="3" stroke="white" strokeWidth="1.8" fill="none" opacity="0.9"/>
            <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.8" fill="none" opacity="0.9"/>
            <circle cx="12" cy="13" r="1.5" fill="white" opacity="0.7"/>
            <path d="M8 6 L9.5 4 H14.5 L16 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"/>
          </svg>
        </button>
      </div>

      {/* Home bar */}
      <div style={{
        position: 'absolute',
        bottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 134, height: 5,
        background: 'rgba(255,255,255,0.35)',
        borderRadius: 3,
        zIndex: 35,
      }} />
    </div>
  );
}