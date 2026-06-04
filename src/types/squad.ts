export interface PlayerStats {
  pac: number; // pace
  sho: number; // shooting
  pas: number; // passing
  dri: number; // dribbling
  def: number; // defending
  phy: number; // physical
}

export interface Player {
  id: string;
  name: string;
  shortName: string;
  country: string;
  countryCode: string;
  club: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating: number;
  price: number;      // INJ value (e.g. 12.5)
  form: number;       // 0–10 recent form score
  stats: PlayerStats;
  avatar?: string;    // resolved at runtime via TheSportsDB
}

export type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1' | '5-3-2';

export interface Squad {
  formation: Formation;
  starters: (Player | null)[];  // 11 slots
  bench: (Player | null)[];     // 3 slots
}
