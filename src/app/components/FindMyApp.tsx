import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Plus, Navigation } from 'lucide-react';

// ── Pulsing blue location dot ──────────────────────────────────
function BlueDot() {
  return (
    <div style={{ position: 'relative', width: 28, height: 28 }}>
      {/* Outer pulse ring 1 */}
      <div style={{
        position: 'absolute',
        inset: -14,
        borderRadius: '50%',
        background: 'rgba(0, 122, 255, 0.12)',
        animation: 'bluePulse1 2.4s ease-out infinite',
      }} />
      {/* Outer pulse ring 2 */}
      <div style={{
        position: 'absolute',
        inset: -7,
        borderRadius: '50%',
        background: 'rgba(0, 122, 255, 0.22)',
        animation: 'bluePulse2 2.4s ease-out infinite',
      }} />
      {/* Accuracy ring */}
      <div style={{
        position: 'absolute',
        inset: -3,
        borderRadius: '50%',
        background: 'rgba(0, 122, 255, 0.18)',
        border: '1.5px solid rgba(0, 122, 255, 0.35)',
      }} />
      {/* Core dot */}
      <div style={{
        width: 28, height: 28,
        borderRadius: '50%',
        background: '#007AFF',
        border: '3px solid white',
        boxShadow: '0 2px 8px rgba(0,122,255,0.6), 0 1px 3px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 2,
      }} />
    </div>
  );
}

// ── Signal bars (same style as lock screen) ──────────────────
function SignalBars() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13">
      {[0,1,2,3].map(i => (
        <rect key={i} x={i*4.5} y={13-(i+1)*3-i} width={3.5} height={(i+1)*3+i} rx={1}
          fill={i < 3 ? 'white' : 'rgba(255,255,255,0.3)'} />
      ))}
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg width="16" height="13" viewBox="0 0 16 13">
      <path d="M8 10.5 C8 10.5 8 10.5 8 10.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5.5 8.5 Q8 6.8 10.5 8.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M3 6 Q8 3.5 13 6" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M0.5 3.5 Q8 0 15.5 3.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function BatteryIcon() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <svg width="24" height="13" viewBox="0 0 24 13">
        <rect x="0.5" y="0.5" width="20" height="12" rx="3.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/>
        <rect x="20.5" y="4" width="3" height="5" rx="1" fill="rgba(255,255,255,0.45)"/>
        <rect x="2" y="2" width="15" height="9" rx="2" fill="white"/>
      </svg>
      <span style={{ color: 'white', fontSize: 12, fontWeight: 500 }}>85%</span>
    </div>
  );
}

// ── Virginia (Charlottesville) dark-mode SVG map ─────────────
function VirginiaMap() {
  // Approximate Charlottesville VA downtown layout
  // Coordinate system: x=0-390 (full phone width), y=0-750
  const bgColor = '#1b1f2e';
  const streetMinor = '#272d40';
  const streetMajor = '#313750';
  const streetHighway = '#3a3520';
  const parkColor = '#1b2820';
  const waterColor = '#1a2535';
  const labelColor = 'rgba(255,255,255,0.45)';
  const labelColorBold = 'rgba(255,255,255,0.65)';

  return (
    <svg
      viewBox="0 0 390 750"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="390" height="750" fill={bgColor} />

      {/* ── Parks ── */}
      <rect x="110" y="165" width="72" height="55" rx="4" fill={parkColor} />
      <rect x="125" y="310" width="48" height="55" rx="4" fill={parkColor} />
      <rect x="310" y="220" width="55" height="40" rx="4" fill={parkColor} />
      {/* Rivanna River (bottom) */}
      <path d="M -20 650 Q 60 635 130 645 Q 200 655 280 638 Q 340 625 410 640"
        stroke={waterColor} strokeWidth="28" fill="none" />

      {/* ── Vertical streets (N-S) ── */}
      {/* 6th St SW/NW */}
      <line x1="52" y1="0" x2="52" y2="620" stroke={streetMinor} strokeWidth="2" />
      {/* 5th St */}
      <line x1="90" y1="0" x2="90" y2="620" stroke={streetMinor} strokeWidth="2" />
      {/* 4th St */}
      <line x1="128" y1="0" x2="128" y2="620" stroke={streetMinor} strokeWidth="2.5" />
      {/* 3rd St */}
      <line x1="162" y1="0" x2="162" y2="620" stroke={streetMinor} strokeWidth="2" />
      {/* 2nd St SW/NW */}
      <line x1="194" y1="0" x2="194" y2="620" stroke={streetMajor} strokeWidth="3" />
      {/* 1st St (Commerce Area) */}
      <line x1="224" y1="0" x2="224" y2="620" stroke={streetMajor} strokeWidth="3" />
      {/* Jefferson St */}
      <line x1="258" y1="0" x2="258" y2="620" stroke={streetMinor} strokeWidth="2.5" />
      {/* 2nd St NE */}
      <line x1="294" y1="0" x2="294" y2="620" stroke={streetMinor} strokeWidth="2" />
      {/* 3rd St NE */}
      <line x1="328" y1="0" x2="328" y2="620" stroke={streetMinor} strokeWidth="2" />
      {/* Ridge St (diagonal) */}
      <line x1="-10" y1="420" x2="110" y2="140" stroke={streetMinor} strokeWidth="2" />
      {/* Park St (diagonal slight) */}
      <line x1="340" y1="0" x2="390" y2="80" stroke={streetMinor} strokeWidth="1.8" />

      {/* ── Horizontal streets (E-W) ── */}
      {/* Barracks Rd / Hydraulic Rd top */}
      <line x1="0" y1="120" x2="390" y2="115" stroke={streetMinor} strokeWidth="2" />
      {/* W High St / E High St */}
      <line x1="0" y1="175" x2="390" y2="170" stroke={streetMajor} strokeWidth="3" />
      {/* W Market St / E Market St */}
      <line x1="0" y1="230" x2="390" y2="225" stroke={streetMajor} strokeWidth="3" />
      {/* *** W Main St / E Main St — major road *** */}
      <line x1="0" y1="285" x2="390" y2="280" stroke={streetHighway} strokeWidth="6" />
      {/* Water St */}
      <line x1="0" y1="340" x2="390" y2="335" stroke={streetMajor} strokeWidth="3" />
      {/* Garrett St */}
      <line x1="0" y1="395" x2="390" y2="390" stroke={streetMinor} strokeWidth="2" />
      {/* Avon St SW extended */}
      <line x1="0" y1="450" x2="390" y2="445" stroke={streetMinor} strokeWidth="2" />
      {/* Far south road */}
      <line x1="0" y1="520" x2="390" y2="515" stroke={streetMinor} strokeWidth="1.8" />

      {/* ── Route 29 / US-250 (highway) — curves through ── */}
      <path d="M 0 550 Q 100 540 195 535 Q 280 530 390 525"
        stroke={streetHighway} strokeWidth="7" fill="none" />
      {/* Highway center line */}
      <path d="M 0 550 Q 100 540 195 535 Q 280 530 390 525"
        stroke="rgba(255,220,60,0.25)" strokeWidth="2" fill="none" strokeDasharray="16,10" />

      {/* ── Street labels ── */}
      <text x="8" y="168" fill={labelColor} fontSize="7.5" fontFamily="-apple-system,sans-serif">W HIGH ST</text>
      <text x="310" y="168" fill={labelColor} fontSize="7.5" fontFamily="-apple-system,sans-serif">E HIGH ST</text>

      <text x="8" y="222" fill={labelColor} fontSize="7.5" fontFamily="-apple-system,sans-serif">W MARKET ST</text>
      <text x="300" y="222" fill={labelColor} fontSize="7.5" fontFamily="-apple-system,sans-serif">E MARKET ST</text>

      <text x="8" y="277" fill={labelColorBold} fontSize="8.5" fontWeight="600" fontFamily="-apple-system,sans-serif">W MAIN ST</text>
      <text x="310" y="277" fill={labelColorBold} fontSize="8.5" fontWeight="600" fontFamily="-apple-system,sans-serif">E MAIN ST</text>

      <text x="8" y="330" fill={labelColor} fontSize="7.5" fontFamily="-apple-system,sans-serif">WATER ST</text>

      {/* Vertical labels */}
      <text x="118" y="200" fill={labelColor} fontSize="7" fontFamily="-apple-system,sans-serif"
        transform="rotate(-90 128 200)">4TH ST NW</text>
      <text x="182" y="200" fill={labelColor} fontSize="7" fontFamily="-apple-system,sans-serif"
        transform="rotate(-90 192 200)">2ND ST NW</text>
      <text x="212" y="200" fill={labelColor} fontSize="7" fontFamily="-apple-system,sans-serif"
        transform="rotate(-90 222 200)">COMMERCE ST</text>
      <text x="246" y="200" fill={labelColor} fontSize="7" fontFamily="-apple-system,sans-serif"
        transform="rotate(-90 256 200)">JEFFERSON ST</text>

      {/* Highway label */}
      <text x="150" y="545" fill="rgba(255,200,60,0.5)" fontSize="8" fontFamily="-apple-system,sans-serif">US-250 · RICHMOND RD</text>

      {/* Park labels */}
      <text x="130" y="197" fill="rgba(100,180,100,0.6)" fontSize="7" fontFamily="-apple-system,sans-serif">LEE PARK</text>
      <text x="131" y="340" fill="rgba(100,180,100,0.6)" fontSize="7" fontFamily="-apple-system,sans-serif">McGUFFEY</text>

      {/* City indicator */}
      <text x="165" y="92" fill="rgba(255,255,255,0.35)" fontSize="11" fontWeight="500"
        fontFamily="-apple-system,sans-serif">CHARLOTTESVILLE, VA</text>

      {/* Court Square block */}
      <rect x="196" y="232" width="26" height="46" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="198" y="257" fill="rgba(255,255,255,0.3)" fontSize="5.5" fontFamily="-apple-system,sans-serif">COURT</text>
      <text x="198" y="265" fill="rgba(255,255,255,0.3)" fontSize="5.5" fontFamily="-apple-system,sans-serif">SQ</text>

      {/* Building blocks (grey rectangles) */}
      {[
        [56,128,30,38], [96,128,28,38], [134,128,24,38],
        [56,182,30,42], [96,182,28,42],
        [164,182,26,42], [226,182,28,42],
        [266,182,26,42], [300,182,24,42], [334,182,22,42],
        [56,236,30,40], [96,236,28,40],
        [164,236,24,40], [226,236,24,40],
        [266,236,24,40], [300,236,22,40], [334,236,22,40],
        [56,290,30,42], [96,290,28,42],
        [164,290,24,42], [226,290,24,42],
        [266,290,24,42], [300,290,22,42], [334,290,22,42],
        [56,345,30,42], [96,345,28,42], [130,345,24,42],
        [164,345,24,42], [226,345,24,42],
        [266,345,24,42], [300,345,22,42], [334,345,22,42],
      ].map(([x,y,w,h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="2"
          fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      ))}
    </svg>
  );
}

// ── Bottom sheet panel ────────────────────────────────────────
function BottomSheet() {
  const [shareEnabled, setShareEnabled] = useState(true);

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div style={{
      background: 'rgba(28,28,30,0.96)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden',
    }}>
      {/* Pull handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
        <div style={{ width: 36, height: 4.5, background: 'rgba(255,255,255,0.25)', borderRadius: 3 }} />
      </div>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 12px' }}>
        <span style={{ color: 'white', fontSize: 22, fontWeight: 700, fontFamily: '-apple-system,sans-serif' }}>Me</span>
        <button style={{
          width: 28, height: 28, borderRadius: 14,
          background: 'rgba(255,255,255,0.15)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Plus size={16} color="white" />
        </button>
      </div>

      {/* Address */}
      <div style={{ padding: '0 20px 14px' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: '-apple-system,sans-serif' }}>
          312 E Main St, Charlottesville VA, United States
        </span>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 20px' }} />

      {/* My Location row */}
      <div style={rowStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: '#007AFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Navigation size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontSize: 15, fontWeight: 600, fontFamily: '-apple-system,sans-serif' }}>My Location</div>
          </div>
        </div>
      </div>

      {/* Share My Location */}
      <div style={rowStyle}>
        <span style={{ color: 'white', fontSize: 15, fontFamily: '-apple-system,sans-serif' }}>Share My Location</span>
        <div
          onClick={() => setShareEnabled(v => !v)}
          style={{
            width: 50, height: 30,
            borderRadius: 15,
            background: shareEnabled ? '#34C759' : 'rgba(255,255,255,0.2)',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.25s',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 3, left: shareEnabled ? 22 : 3,
            width: 24, height: 24,
            borderRadius: 12,
            background: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
            transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }} />
        </div>
      </div>

      {/* Sharing From */}
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <span style={{ color: 'white', fontSize: 15, fontFamily: '-apple-system,sans-serif' }}>Sharing From</span>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: '-apple-system,sans-serif' }}>This iPhone and cellular</span>
      </div>
    </div>
  );
}

// ── Bottom navigation tabs ────────────────────────────────────
function BottomTabs() {
  const tabs = [
    { label: 'People', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M17 20c0-2.21-2.24-4-5-4s-5 1.79-5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M22 20c0-1.66-1.34-3-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="19" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M2 20c0-1.66 1.34-3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="5" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    )},
    { label: 'Devices', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="4" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="9" y="2" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="9" y1="17" x2="15" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )},
    { label: 'Items', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )},
    { label: 'Me', active: true, icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 21c0-3.31-3.58-6-8-6s-8 2.69-8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    )},
  ];

  return (
    <div style={{
      background: 'rgba(22,22,24,0.96)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
    }}>
      {tabs.map(tab => (
        <div key={tab.label} style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 3,
          padding: '10px 0 2px',
          cursor: 'pointer',
          color: tab.active ? '#007AFF' : 'rgba(255,255,255,0.4)',
        }}>
          {tab.icon}
          <span style={{
            fontSize: 10, fontFamily: '-apple-system,sans-serif',
            fontWeight: tab.active ? 600 : 400,
          }}>{tab.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main FindMyApp ────────────────────────────────────────────
interface FindMyAppProps {
  onBack: () => void;
}

export function FindMyApp({ onBack }: FindMyAppProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = time.getHours() % 12 || 12;
  const m = time.getMinutes().toString().padStart(2, '0');
  const timeStr = `${h}:${m}`;

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#1b1f2e',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* CSS animations */}
      <style>{`
        @keyframes bluePulse1 {
          0%   { transform: scale(0.8); opacity: 0.6; }
          60%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        @keyframes bluePulse2 {
          0%   { transform: scale(0.9); opacity: 0.5; }
          50%  { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(0.9); opacity: 0; }
        }
        @keyframes dotBreathe {
          0%, 100% { box-shadow: 0 2px 8px rgba(0,122,255,0.6), 0 1px 3px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 2px 16px rgba(0,122,255,0.9), 0 1px 6px rgba(0,0,0,0.4); }
        }
      `}</style>

      {/* Map fills screen */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <VirginiaMap />
      </div>

      {/* ── Status bar overlay ── */}
      <div style={{
        position: 'relative', zIndex: 20,
        paddingTop: 'max(14px, env(safe-area-inset-top, 14px))',
        paddingLeft: 16, paddingRight: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <SignalBars />
          <span style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: '-apple-system,sans-serif' }}>T-Mobile</span>
        </div>
        <span style={{ color: 'white', fontSize: 15, fontWeight: 600, fontFamily: '-apple-system,sans-serif' }}>{timeStr}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>

      {/* ── Back button (← Lock Screen) ── */}
      <div style={{ position: 'absolute', top: 62, left: 0, zIndex: 30 }}>
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.9 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '0 20px 20px 0',
            padding: '9px 16px 9px 10px',
            cursor: 'pointer',
            color: 'white',
            fontSize: 15,
            fontWeight: 500,
            fontFamily: '-apple-system,sans-serif',
          }}
        >
          <ChevronLeft size={18} color="white" strokeWidth={2.5} />
          <span>Lock Screen</span>
        </motion.button>
      </div>

      {/* ── Map controls (top right) ── */}
      <div style={{
        position: 'absolute', top: 62, right: 16, zIndex: 30,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Map type */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            width: 44, height: 44,
            borderRadius: 12,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l-6-3V5l6 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 18l6-3V3l-6 3v12z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 15l6 3V6l-6-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>

        {/* Navigation / re-center */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            width: 44, height: 44,
            borderRadius: 12,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Navigation size={20} color="white" />
        </motion.button>
      </div>

      {/* ── Blue dot (Nic's location) ── */}
      {/* Slightly off-center to look like someone nearby */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          position: 'absolute',
          // Center-ish, slightly left of Commerce St, on Main St
          left: 'calc(50% - 14px)',
          top: '36%',
          zIndex: 25,
          pointerEvents: 'none',
        }}
      >
        <BlueDot />
      </motion.div>

      {/* Spacer to push bottom sheet down */}
      <div style={{ flex: 1 }} />

      {/* ── Bottom sheet + tabs ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: 'relative', zIndex: 20 }}
      >
        <BottomSheet />
        <BottomTabs />
      </motion.div>
    </div>
  );
}