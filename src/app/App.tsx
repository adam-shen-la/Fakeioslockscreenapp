import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LockScreen } from './components/LockScreen';
import { FindMyApp } from './components/FindMyApp';

type Screen = 'lock' | 'findmy';

export default function App() {
  const [screen, setScreen] = useState<Screen>('lock');
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(k => k + 1);
    setScreen('lock');
  };

  return (
    <div className="w-full h-full bg-black overflow-hidden"
      style={{ position: 'fixed', inset: 0 }}>
      <AnimatePresence mode="wait">
        {screen === 'lock' && (
          <motion.div
            key={`lock-${resetKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: '-30%' }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <LockScreen
              onOpenFindMy={() => setScreen('findmy')}
              onReset={handleReset}
            />
          </motion.div>
        )}
        {screen === 'findmy' && (
          <motion.div
            key="findmy"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <FindMyApp onBack={() => setScreen('lock')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
