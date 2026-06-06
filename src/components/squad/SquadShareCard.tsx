'use client';

import { useRef, useState } from 'react';
import type { Player } from '@/types/squad';
import type { UserProfile } from '@/hooks/useProfile';

interface Props {
  starters: (Player | null)[];
  formation: string;
  captainId: string | null;
  viceCaptainId: string | null;
  profile: UserProfile;
  address: string;
  hasBoost: boolean;
}

const POS_COLOR: Record<string, string> = {
  GK:  '#f59e0b',
  DEF: '#3b82f6',
  MID: '#22c55e',
  FWD: '#ef4444',
};

function PlayerDot({ player, isCaptain, isVC }: { player: Player; isCaptain: boolean; isVC: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 52 }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: POS_COLOR[player.position] + '22',
        border: `2px solid ${POS_COLOR[player.position]}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: POS_COLOR[player.position] }}>
          {player.shortName}
        </span>
        {isCaptain && (
          <span style={{
            position: 'absolute', top: -6, right: -6,
            background: '#f59e0b', color: '#000',
            fontSize: 7, fontWeight: 900, borderRadius: '50%',
            width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>C</span>
        )}
        {isVC && (
          <span style={{
            position: 'absolute', top: -6, right: -6,
            background: '#94a3b8', color: '#000',
            fontSize: 7, fontWeight: 900, borderRadius: '50%',
            width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>V</span>
        )}
      </div>
      <span style={{ fontSize: 8, color: '#e2e8f0', fontWeight: 700, textAlign: 'center', maxWidth: 52, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        {player.name}
      </span>
      <span style={{
        fontSize: 7, fontWeight: 900, color: POS_COLOR[player.position],
        background: POS_COLOR[player.position] + '22',
        padding: '1px 4px', borderRadius: 3,
      }}>
        {player.position}
      </span>
    </div>
  );
}

function Row({ players, captainId, viceCaptainId }: { players: (Player | null)[]; captainId: string | null; viceCaptainId: string | null }) {
  const valid = players.filter(Boolean) as Player[];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
      {valid.map((p) => (
        <PlayerDot key={p.id} player={p} isCaptain={captainId === p.id} isVC={viceCaptainId === p.id} />
      ))}
    </div>
  );
}

export function SquadShareCard({ starters, formation, captainId, viceCaptainId, profile, address, hasBoost }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Group starters by row based on formation
  const rows: (Player | null)[][] = [];
  // Parse formation like "4-3-3" → [4,3,3] and map to starters
  // First player is GK, then rows in reverse (DEF, MID, FWD bottom to top)
  const gk = [starters[0]];
  const rest = starters.slice(1);
  const parts = formation.split('-').map(Number);
  let cursor = 0;
  const fieldRows: (Player | null)[][] = parts.map(count => {
    const row = rest.slice(cursor, cursor + count);
    cursor += count;
    return row;
  });
  // Display order: FWD on top, GK at bottom
  const displayRows = [...fieldRows].reverse();
  displayRows.push(gk);

  const shortAddr = address.length > 16
    ? `${address.slice(0, 8)}…${address.slice(-6)}`
    : address;

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const link = document.createElement('a');
      link.download = `injmatch-squad-${profile.username || shortAddr}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* The card that gets captured */}
      <div
        ref={cardRef}
        style={{
          background: 'linear-gradient(160deg, #0a0a0f 0%, #0d1a0d 50%, #0a0a0f 100%)',
          borderRadius: 16,
          padding: 20,
          width: 340,
          fontFamily: 'system-ui, sans-serif',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {profile.avatar && (
              <img
                src={profile.avatar}
                alt="avatar"
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }}
                crossOrigin="anonymous"
              />
            )}
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>
                {profile.username || shortAddr}
              </div>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                {formation} · INJMATCH
              </div>
            </div>
          </div>
          {hasBoost && (
            <div style={{
              fontSize: 8, fontWeight: 900, color: '#60a5fa',
              border: '1px solid rgba(96,165,250,0.3)',
              background: 'rgba(96,165,250,0.1)',
              padding: '3px 7px', borderRadius: 6,
              letterSpacing: 1, textTransform: 'uppercase',
            }}>
              Boost Active
            </div>
          )}
        </div>

        {/* Pitch */}
        <div style={{
          background: 'linear-gradient(180deg, #14532d 0%, #166534 40%, #14532d 100%)',
          borderRadius: 10,
          padding: '16px 8px',
          display: 'flex', flexDirection: 'column', gap: 14,
          border: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Pitch markings */}
          <div style={{
            position: 'absolute', top: '50%', left: '10%', right: '10%', height: 1,
            background: 'rgba(255,255,255,0.12)', transform: 'translateY(-50%)',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '35%', right: '35%',
            width: 60, height: 60, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.12)',
            transform: 'translate(-50%, -50%)',
            marginLeft: '50%',
          }} />
          {displayRows.map((row, i) => (
            <Row key={i} players={row} captainId={captainId} viceCaptainId={viceCaptainId} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 9, color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
            injmatch.app
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {['GK','DEF','MID','FWD'].map(pos => (
              <span key={pos} style={{
                fontSize: 7, fontWeight: 900, color: POS_COLOR[pos],
                background: POS_COLOR[pos] + '22',
                padding: '2px 5px', borderRadius: 3,
              }}>{pos}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading || starters.every(s => !s)}
        className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-500 text-black hover:bg-blue-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {downloading ? (
          <>
            <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          'Download Squad Card'
        )}
      </button>
    </div>
  );
}
