'use client';

import { useState, useEffect } from 'react';
import { SPORTSDB_SEARCH_NAME } from '@/lib/players';
import type { Player } from '@/types/squad';

// Module-level cache so we only fetch each player once per session
const imageCache = new Map<string, string | null>();
const inFlight = new Map<string, Promise<string | null>>();

const POS_BG: Record<string, string> = {
  GK:  'bg-yellow-500/20 text-yellow-400',
  DEF: 'bg-blue-500/20 text-blue-400',
  MID: 'bg-green-500/20 text-green-400',
  FWD: 'bg-red-500/20 text-red-400',
};

async function fetchPlayerImage(playerId: string): Promise<string | null> {
  const searchName = SPORTSDB_SEARCH_NAME[playerId];
  if (!searchName) return null;
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(searchName)}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const player = data?.player?.[0];
    return player?.strThumb || player?.strCutout || null;
  } catch {
    return null;
  }
}

function getOrFetchImage(playerId: string): Promise<string | null> {
  if (imageCache.has(playerId)) return Promise.resolve(imageCache.get(playerId)!);
  if (inFlight.has(playerId)) return inFlight.get(playerId)!;
  const p = fetchPlayerImage(playerId).then((url) => {
    imageCache.set(playerId, url);
    inFlight.delete(playerId);
    return url;
  });
  inFlight.set(playerId, p);
  return p;
}

interface Props {
  player: Player;
  size?: 'sm' | 'md';
  className?: string;
}

export function PlayerAvatar({ player, size = 'md', className = '' }: Props) {
  const [imgUrl, setImgUrl] = useState<string | null>(imageCache.get(player.id) ?? null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (imageCache.has(player.id)) {
      setImgUrl(imageCache.get(player.id) ?? null);
      return;
    }
    let cancelled = false;
    getOrFetchImage(player.id).then((url) => {
      if (!cancelled) setImgUrl(url);
    });
    return () => { cancelled = true; };
  }, [player.id]);

  const sizeClass = size === 'sm' ? 'w-9 h-9 text-[10px]' : 'w-12 h-12 text-[11px]';
  const roundClass = size === 'sm' ? 'rounded-lg' : 'rounded-xl';

  const showImage = imgUrl && !errored;

  return (
    <div className={`${sizeClass} ${roundClass} flex items-center justify-center font-black flex-shrink-0 overflow-hidden ${POS_BG[player.position]} ${className}`}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={player.name}
          className="w-full h-full object-cover object-top"
          onError={() => setErrored(true)}
        />
      ) : (
        <span>{player.shortName}</span>
      )}
    </div>
  );
}
