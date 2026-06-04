'use client';

import { PitchCard } from './PlayerCard';
import type { Player, Formation } from '@/types/squad';
import { FORMATIONS } from '@/lib/players';

interface Props {
  formation: Formation;
  starters: (Player | null)[];
  selectedSlot: number | null;
  onSlotClick: (index: number) => void;
}

export function Pitch({ formation, starters, selectedSlot, onSlotClick }: Props) {
  const rows = FORMATIONS[formation]?.rows ?? FORMATIONS['4-3-3'].rows;

  // Build slot indices per row (top = attack, bottom = GK)
  const rowSlots: { positionHint: 'GK' | 'DEF' | 'MID' | 'FWD'; slotIndex: number }[][] = [];
  let slotCursor = 0;
  for (const row of rows) {
    const slots = [];
    for (let i = 0; i < row.count; i++) {
      slots.push({ positionHint: row.position, slotIndex: slotCursor });
      slotCursor++;
    }
    rowSlots.push(slots);
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden flex flex-col justify-between py-5 px-3"
      style={{
        background: 'linear-gradient(180deg, #0d4a1f 0%, #0a3d18 40%, #083210 100%)',
        minHeight: '420px',
      }}
    >
      {/* Pitch markings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 300 420" preserveAspectRatio="none">
        {/* Outer border */}
        <rect x="8" y="8" width="284" height="404" fill="none" stroke="white" strokeWidth="1.5" rx="2"/>
        {/* Centre line */}
        <line x1="8" y1="210" x2="292" y2="210" stroke="white" strokeWidth="1"/>
        {/* Centre circle */}
        <circle cx="150" cy="210" r="40" fill="none" stroke="white" strokeWidth="1"/>
        <circle cx="150" cy="210" r="2" fill="white"/>
        {/* Top penalty box */}
        <rect x="75" y="8" width="150" height="55" fill="none" stroke="white" strokeWidth="1"/>
        <rect x="108" y="8" width="84" height="28" fill="none" stroke="white" strokeWidth="1"/>
        <circle cx="150" cy="52" r="2" fill="white"/>
        {/* Bottom penalty box */}
        <rect x="75" y="357" width="150" height="55" fill="none" stroke="white" strokeWidth="1"/>
        <rect x="108" y="384" width="84" height="28" fill="none" stroke="white" strokeWidth="1"/>
        <circle cx="150" cy="368" r="2" fill="white"/>
      </svg>

      {/* Player rows */}
      <div className="relative z-10 flex flex-col gap-4 h-full justify-around">
        {rowSlots.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-3 md:gap-5">
            {row.map(({ positionHint, slotIndex }) => (
              <PitchCard
                key={slotIndex}
                slotIndex={slotIndex}
                player={starters[slotIndex]}
                positionHint={positionHint}
                isSelected={selectedSlot === slotIndex}
                onClick={() => onSlotClick(slotIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
