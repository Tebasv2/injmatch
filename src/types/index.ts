export interface League {
  id: string;
  name: string;
  admin: string;
  entry_fee: string;
  prize_pool: string;
  max_participants: number;
  participants: string[];
  status: 'open' | 'active' | 'finished';
  created_at: number;
}

export interface Prediction {
  predictor: string;
  league_id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  submitted_at: number;
}

export interface MatchResult {
  match_id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  stage: 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final';
}

export interface LeaderboardEntry {
  address: string;
  points: number;
  correct_scores: number;
  correct_outcomes: number;
  rank: number;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  error: string | null;
}
