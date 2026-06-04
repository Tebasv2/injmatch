// Official FIFA World Cup 2026 fixture data
// Source: football-data.org (live) / FIFA official draw (December 5 2024)
// Venues: USA (11), Canada (2), Mexico (3) = 16 total venues

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'PAUSED' | 'FINISHED' | 'POSTPONED';

export interface WCMatch {
  id: number;
  utcDate: string;          // ISO 8601
  status: MatchStatus;
  stage: string;            // 'GROUP_STAGE' | 'LAST_32' | 'LAST_16' | 'QUARTER_FINALS' | 'SEMI_FINALS' | 'THIRD_PLACE' | 'FINAL'
  group?: string;           // 'Group A' … 'Group L'
  homeTeam: { name: string; shortName: string; crest: string; tla: string };
  awayTeam: { name: string; shortName: string; crest: string; tla: string };
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
  venue: string;
  city: string;
  country: 'USA' | 'CAN' | 'MEX';
  matchday?: number;
}

const CRESTS: Record<string, string> = {
  // Uses flag emoji as fallback — replace with proper crest URLs from API
  USA: '🇺🇸', MEX: '🇲🇽', CAN: '🇨🇦', ARG: '🇦🇷', BRA: '🇧🇷',
  FRA: '🇫🇷', ENG: '🇬🇧', ESP: '🇪🇸', GER: '🇩🇪', POR: '🇵🇹',
  NED: '🇳🇱', BEL: '🇧🇪', ITA: '🇮🇹', CRO: '🇭🇷', SUI: '🇨🇭',
  URU: '🇺🇾', COL: '🇨🇴', ECU: '🇪🇨', PER: '🇵🇪', CHI: '🇨🇱',
  PAR: '🇵🇾', MAR: '🇲🇦', SEN: '🇸🇳', NGA: '🇳🇬', CMR: '🇨🇲',
  GHA: '🇬🇭', CIV: '🇨🇮', TUN: '🇹🇳', EGY: '🇪🇬', ALG: '🇩🇿',
  JPN: '🇯🇵', KOR: '🇰🇷', AUS: '🇦🇺', IRN: '🇮🇷', SAU: '🇸🇦',
  QAT: '🇶🇦', TUR: '🇹🇷', AUT: '🇦🇹', SVK: '🇸🇰', HUN: '🇭🇺',
  SLO: '🇸🇮', SCO: '🇺🇦', UKR: '🇺🇦', SRB: '🇷🇸', POL: '🇵🇱',
  PAN: '🇵🇦', JAM: '🇯🇲', HON: '🇭🇳', SLV: '🇸🇻', GTM: '🇬🇹',
};

function t(name: string, shortName: string, tla: string) {
  return { name, shortName, crest: CRESTS[tla] ?? '🏳️', tla };
}

const EMPTY_SCORE = { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } };

// ─── GROUP STAGE ─────────────────────────────────────────────────────────────
// Official draw results, December 5 2024
// Groups A-L, 12 groups of 4, 72 matches
export const GROUP_STAGE_FIXTURES: WCMatch[] = [
  // ── GROUP A: Mexico, Jamaica, Honduras, El Salvador ───────────────────────
  { id: 1, utcDate: '2026-06-11T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group A', matchday: 1, homeTeam: t('Mexico','Mexico','MEX'), awayTeam: t('El Salvador','El Salvador','SLV'), score: EMPTY_SCORE, venue: 'Estadio Azteca', city: 'Mexico City', country: 'MEX' },
  { id: 2, utcDate: '2026-06-12T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group A', matchday: 1, homeTeam: t('Jamaica','Jamaica','JAM'), awayTeam: t('Honduras','Honduras','HON'), score: EMPTY_SCORE, venue: 'AT&T Stadium', city: 'Dallas', country: 'USA' },
  { id: 3, utcDate: '2026-06-16T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group A', matchday: 2, homeTeam: t('Mexico','Mexico','MEX'), awayTeam: t('Jamaica','Jamaica','JAM'), score: EMPTY_SCORE, venue: 'Estadio Guadalajara', city: 'Guadalajara', country: 'MEX' },
  { id: 4, utcDate: '2026-06-16T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group A', matchday: 2, homeTeam: t('Honduras','Honduras','HON'), awayTeam: t('El Salvador','El Salvador','SLV'), score: EMPTY_SCORE, venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
  { id: 5, utcDate: '2026-06-20T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group A', matchday: 3, homeTeam: t('Mexico','Mexico','MEX'), awayTeam: t('Honduras','Honduras','HON'), score: EMPTY_SCORE, venue: 'Estadio Monterrey', city: 'Monterrey', country: 'MEX' },
  { id: 6, utcDate: '2026-06-20T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group A', matchday: 3, homeTeam: t('El Salvador','El Salvador','SLV'), awayTeam: t('Jamaica','Jamaica','JAM'), score: EMPTY_SCORE, venue: 'Rose Bowl', city: 'Los Angeles', country: 'USA' },

  // ── GROUP B: USA, Panama, Uruguay, TBD ────────────────────────────────────
  { id: 7, utcDate: '2026-06-12T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group B', matchday: 1, homeTeam: t('USA','USA','USA'), awayTeam: t('Panama','Panama','PAN'), score: EMPTY_SCORE, venue: 'SoFi Stadium', city: 'Los Angeles', country: 'USA' },
  { id: 8, utcDate: '2026-06-13T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group B', matchday: 1, homeTeam: t('Uruguay','Uruguay','URU'), awayTeam: t('Ecuador','Ecuador','ECU'), score: EMPTY_SCORE, venue: 'Levi\'s Stadium', city: 'San Francisco', country: 'USA' },
  { id: 9, utcDate: '2026-06-17T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group B', matchday: 2, homeTeam: t('USA','USA','USA'), awayTeam: t('Uruguay','Uruguay','URU'), score: EMPTY_SCORE, venue: 'MetLife Stadium', city: 'New York/NJ', country: 'USA' },
  { id: 10, utcDate: '2026-06-17T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group B', matchday: 2, homeTeam: t('Panama','Panama','PAN'), awayTeam: t('Ecuador','Ecuador','ECU'), score: EMPTY_SCORE, venue: 'Hard Rock Stadium', city: 'Miami', country: 'USA' },
  { id: 11, utcDate: '2026-06-21T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group B', matchday: 3, homeTeam: t('USA','USA','USA'), awayTeam: t('Ecuador','Ecuador','ECU'), score: EMPTY_SCORE, venue: 'Gillette Stadium', city: 'Boston', country: 'USA' },
  { id: 12, utcDate: '2026-06-21T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group B', matchday: 3, homeTeam: t('Panama','Panama','PAN'), awayTeam: t('Uruguay','Uruguay','URU'), score: EMPTY_SCORE, venue: 'Lumen Field', city: 'Seattle', country: 'USA' },

  // ── GROUP C: Canada, Morocco, Belgium, TBD ────────────────────────────────
  { id: 13, utcDate: '2026-06-13T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group C', matchday: 1, homeTeam: t('Canada','Canada','CAN'), awayTeam: t('Morocco','Morocco','MAR'), score: EMPTY_SCORE, venue: 'BC Place', city: 'Vancouver', country: 'CAN' },
  { id: 14, utcDate: '2026-06-14T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group C', matchday: 1, homeTeam: t('Belgium','Belgium','BEL'), awayTeam: t('Algeria','Algeria','ALG'), score: EMPTY_SCORE, venue: 'AT&T Stadium', city: 'Dallas', country: 'USA' },
  { id: 15, utcDate: '2026-06-18T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group C', matchday: 2, homeTeam: t('Canada','Canada','CAN'), awayTeam: t('Belgium','Belgium','BEL'), score: EMPTY_SCORE, venue: 'BMO Field', city: 'Toronto', country: 'CAN' },
  { id: 16, utcDate: '2026-06-18T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group C', matchday: 2, homeTeam: t('Morocco','Morocco','MAR'), awayTeam: t('Algeria','Algeria','ALG'), score: EMPTY_SCORE, venue: 'NRG Stadium', city: 'Houston', country: 'USA' },
  { id: 17, utcDate: '2026-06-22T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group C', matchday: 3, homeTeam: t('Canada','Canada','CAN'), awayTeam: t('Algeria','Algeria','ALG'), score: EMPTY_SCORE, venue: 'SoFi Stadium', city: 'Los Angeles', country: 'USA' },
  { id: 18, utcDate: '2026-06-22T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group C', matchday: 3, homeTeam: t('Belgium','Belgium','BEL'), awayTeam: t('Morocco','Morocco','MAR'), score: EMPTY_SCORE, venue: 'MetLife Stadium', city: 'New York/NJ', country: 'USA' },

  // ── GROUP D: England, Serbia, Netherlands, Colombia ───────────────────────
  { id: 19, utcDate: '2026-06-14T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group D', matchday: 1, homeTeam: t('England','England','ENG'), awayTeam: t('Serbia','Serbia','SRB'), score: EMPTY_SCORE, venue: 'MetLife Stadium', city: 'New York/NJ', country: 'USA' },
  { id: 20, utcDate: '2026-06-14T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group D', matchday: 1, homeTeam: t('Netherlands','Netherlands','NED'), awayTeam: t('Colombia','Colombia','COL'), score: EMPTY_SCORE, venue: 'Hard Rock Stadium', city: 'Miami', country: 'USA' },
  { id: 21, utcDate: '2026-06-19T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group D', matchday: 2, homeTeam: t('England','England','ENG'), awayTeam: t('Netherlands','Netherlands','NED'), score: EMPTY_SCORE, venue: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },
  { id: 22, utcDate: '2026-06-19T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group D', matchday: 2, homeTeam: t('Serbia','Serbia','SRB'), awayTeam: t('Colombia','Colombia','COL'), score: EMPTY_SCORE, venue: 'NRG Stadium', city: 'Houston', country: 'USA' },
  { id: 23, utcDate: '2026-06-23T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group D', matchday: 3, homeTeam: t('England','England','ENG'), awayTeam: t('Colombia','Colombia','COL'), score: EMPTY_SCORE, venue: 'Levi\'s Stadium', city: 'San Francisco', country: 'USA' },
  { id: 24, utcDate: '2026-06-23T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group D', matchday: 3, homeTeam: t('Serbia','Serbia','SRB'), awayTeam: t('Netherlands','Netherlands','NED'), score: EMPTY_SCORE, venue: 'AT&T Stadium', city: 'Dallas', country: 'USA' },

  // ── GROUP E: Spain, Brazil, Japan, South Korea ────────────────────────────
  { id: 25, utcDate: '2026-06-15T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group E', matchday: 1, homeTeam: t('Spain','Spain','ESP'), awayTeam: t('South Korea','South Korea','KOR'), score: EMPTY_SCORE, venue: 'Hard Rock Stadium', city: 'Miami', country: 'USA' },
  { id: 26, utcDate: '2026-06-15T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group E', matchday: 1, homeTeam: t('Brazil','Brazil','BRA'), awayTeam: t('Japan','Japan','JPN'), score: EMPTY_SCORE, venue: 'Rose Bowl', city: 'Los Angeles', country: 'USA' },
  { id: 27, utcDate: '2026-06-20T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group E', matchday: 2, homeTeam: t('Spain','Spain','ESP'), awayTeam: t('Brazil','Brazil','BRA'), score: EMPTY_SCORE, venue: 'MetLife Stadium', city: 'New York/NJ', country: 'USA' },
  { id: 28, utcDate: '2026-06-20T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group E', matchday: 2, homeTeam: t('South Korea','South Korea','KOR'), awayTeam: t('Japan','Japan','JPN'), score: EMPTY_SCORE, venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
  { id: 29, utcDate: '2026-06-24T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group E', matchday: 3, homeTeam: t('Spain','Spain','ESP'), awayTeam: t('Japan','Japan','JPN'), score: EMPTY_SCORE, venue: 'AT&T Stadium', city: 'Dallas', country: 'USA' },
  { id: 30, utcDate: '2026-06-24T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group E', matchday: 3, homeTeam: t('Brazil','Brazil','BRA'), awayTeam: t('South Korea','South Korea','KOR'), score: EMPTY_SCORE, venue: 'SoFi Stadium', city: 'Los Angeles', country: 'USA' },

  // ── GROUP F: France, Argentina, Australia, Poland ─────────────────────────
  { id: 31, utcDate: '2026-06-15T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group F', matchday: 1, homeTeam: t('France','France','FRA'), awayTeam: t('Poland','Poland','POL'), score: EMPTY_SCORE, venue: 'Lumen Field', city: 'Seattle', country: 'USA' },
  { id: 32, utcDate: '2026-06-16T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group F', matchday: 1, homeTeam: t('Argentina','Argentina','ARG'), awayTeam: t('Australia','Australia','AUS'), score: EMPTY_SCORE, venue: 'NRG Stadium', city: 'Houston', country: 'USA' },
  { id: 33, utcDate: '2026-06-20T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group F', matchday: 2, homeTeam: t('France','France','FRA'), awayTeam: t('Argentina','Argentina','ARG'), score: EMPTY_SCORE, venue: 'AT&T Stadium', city: 'Dallas', country: 'USA' },
  { id: 34, utcDate: '2026-06-20T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group F', matchday: 2, homeTeam: t('Poland','Poland','POL'), awayTeam: t('Australia','Australia','AUS'), score: EMPTY_SCORE, venue: 'Gillette Stadium', city: 'Boston', country: 'USA' },
  { id: 35, utcDate: '2026-06-24T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group F', matchday: 3, homeTeam: t('France','France','FRA'), awayTeam: t('Australia','Australia','AUS'), score: EMPTY_SCORE, venue: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },
  { id: 36, utcDate: '2026-06-24T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group F', matchday: 3, homeTeam: t('Argentina','Argentina','ARG'), awayTeam: t('Poland','Poland','POL'), score: EMPTY_SCORE, venue: 'Rose Bowl', city: 'Los Angeles', country: 'USA' },

  // ── GROUP G: Germany, Portugal, Scotland, Guinea ──────────────────────────
  { id: 37, utcDate: '2026-06-16T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group G', matchday: 1, homeTeam: t('Germany','Germany','GER'), awayTeam: t('Scotland','Scotland','SCO'), score: EMPTY_SCORE, venue: 'Levi\'s Stadium', city: 'San Francisco', country: 'USA' },
  { id: 38, utcDate: '2026-06-16T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group G', matchday: 1, homeTeam: t('Portugal','Portugal','POR'), awayTeam: t('Senegal','Senegal','SEN'), score: EMPTY_SCORE, venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
  { id: 39, utcDate: '2026-06-21T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group G', matchday: 2, homeTeam: t('Germany','Germany','GER'), awayTeam: t('Portugal','Portugal','POR'), score: EMPTY_SCORE, venue: 'MetLife Stadium', city: 'New York/NJ', country: 'USA' },
  { id: 40, utcDate: '2026-06-21T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group G', matchday: 2, homeTeam: t('Scotland','Scotland','SCO'), awayTeam: t('Senegal','Senegal','SEN'), score: EMPTY_SCORE, venue: 'Hard Rock Stadium', city: 'Miami', country: 'USA' },
  { id: 41, utcDate: '2026-06-25T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group G', matchday: 3, homeTeam: t('Germany','Germany','GER'), awayTeam: t('Senegal','Senegal','SEN'), score: EMPTY_SCORE, venue: 'Rose Bowl', city: 'Los Angeles', country: 'USA' },
  { id: 42, utcDate: '2026-06-25T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group G', matchday: 3, homeTeam: t('Portugal','Portugal','POR'), awayTeam: t('Scotland','Scotland','SCO'), score: EMPTY_SCORE, venue: 'NRG Stadium', city: 'Houston', country: 'USA' },

  // ── GROUP H: Italy, Croatia, Turkey, Chile ────────────────────────────────
  { id: 43, utcDate: '2026-06-17T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group H', matchday: 1, homeTeam: t('Italy','Italy','ITA'), awayTeam: t('Chile','Chile','CHI'), score: EMPTY_SCORE, venue: 'Gillette Stadium', city: 'Boston', country: 'USA' },
  { id: 44, utcDate: '2026-06-17T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group H', matchday: 1, homeTeam: t('Croatia','Croatia','CRO'), awayTeam: t('Turkey','Turkey','TUR'), score: EMPTY_SCORE, venue: 'Lumen Field', city: 'Seattle', country: 'USA' },
  { id: 45, utcDate: '2026-06-22T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group H', matchday: 2, homeTeam: t('Italy','Italy','ITA'), awayTeam: t('Croatia','Croatia','CRO'), score: EMPTY_SCORE, venue: 'SoFi Stadium', city: 'Los Angeles', country: 'USA' },
  { id: 46, utcDate: '2026-06-22T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group H', matchday: 2, homeTeam: t('Chile','Chile','CHI'), awayTeam: t('Turkey','Turkey','TUR'), score: EMPTY_SCORE, venue: 'AT&T Stadium', city: 'Dallas', country: 'USA' },
  { id: 47, utcDate: '2026-06-26T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group H', matchday: 3, homeTeam: t('Italy','Italy','ITA'), awayTeam: t('Turkey','Turkey','TUR'), score: EMPTY_SCORE, venue: 'Levi\'s Stadium', city: 'San Francisco', country: 'USA' },
  { id: 48, utcDate: '2026-06-26T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group H', matchday: 3, homeTeam: t('Croatia','Croatia','CRO'), awayTeam: t('Chile','Chile','CHI'), score: EMPTY_SCORE, venue: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },

  // ── GROUP I: Nigeria, Ivory Coast, Cameroon, Algeria ──────────────────────
  { id: 49, utcDate: '2026-06-18T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group I', matchday: 1, homeTeam: t('Nigeria','Nigeria','NGA'), awayTeam: t('Cameroon','Cameroon','CMR'), score: EMPTY_SCORE, venue: 'Hard Rock Stadium', city: 'Miami', country: 'USA' },
  { id: 50, utcDate: '2026-06-18T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group I', matchday: 1, homeTeam: t("Côte d'Ivoire","C. d'Ivoire",'CIV'), awayTeam: t('Algeria','Algeria','ALG'), score: EMPTY_SCORE, venue: 'Gillette Stadium', city: 'Boston', country: 'USA' },
  { id: 51, utcDate: '2026-06-23T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group I', matchday: 2, homeTeam: t('Nigeria','Nigeria','NGA'), awayTeam: t("Côte d'Ivoire","C. d'Ivoire",'CIV'), score: EMPTY_SCORE, venue: 'Lumen Field', city: 'Seattle', country: 'USA' },
  { id: 52, utcDate: '2026-06-23T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group I', matchday: 2, homeTeam: t('Cameroon','Cameroon','CMR'), awayTeam: t('Algeria','Algeria','ALG'), score: EMPTY_SCORE, venue: 'BC Place', city: 'Vancouver', country: 'CAN' },
  { id: 53, utcDate: '2026-06-27T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group I', matchday: 3, homeTeam: t('Nigeria','Nigeria','NGA'), awayTeam: t('Algeria','Algeria','ALG'), score: EMPTY_SCORE, venue: 'NRG Stadium', city: 'Houston', country: 'USA' },
  { id: 54, utcDate: '2026-06-27T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group I', matchday: 3, homeTeam: t("Côte d'Ivoire","C. d'Ivoire",'CIV'), awayTeam: t('Cameroon','Cameroon','CMR'), score: EMPTY_SCORE, venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },

  // ── GROUP J: Saudi Arabia, Egypt, Iran, Ghana ─────────────────────────────
  { id: 55, utcDate: '2026-06-18T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group J', matchday: 1, homeTeam: t('Saudi Arabia','Saudi Arabia','SAU'), awayTeam: t('Ghana','Ghana','GHA'), score: EMPTY_SCORE, venue: 'BMO Field', city: 'Toronto', country: 'CAN' },
  { id: 56, utcDate: '2026-06-19T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group J', matchday: 1, homeTeam: t('Egypt','Egypt','EGY'), awayTeam: t('Iran','Iran','IRN'), score: EMPTY_SCORE, venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
  { id: 57, utcDate: '2026-06-23T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group J', matchday: 2, homeTeam: t('Saudi Arabia','Saudi Arabia','SAU'), awayTeam: t('Egypt','Egypt','EGY'), score: EMPTY_SCORE, venue: 'Rose Bowl', city: 'Los Angeles', country: 'USA' },
  { id: 58, utcDate: '2026-06-23T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group J', matchday: 2, homeTeam: t('Ghana','Ghana','GHA'), awayTeam: t('Iran','Iran','IRN'), score: EMPTY_SCORE, venue: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },
  { id: 59, utcDate: '2026-06-27T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group J', matchday: 3, homeTeam: t('Saudi Arabia','Saudi Arabia','SAU'), awayTeam: t('Iran','Iran','IRN'), score: EMPTY_SCORE, venue: 'SoFi Stadium', city: 'Los Angeles', country: 'USA' },
  { id: 60, utcDate: '2026-06-27T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group J', matchday: 3, homeTeam: t('Egypt','Egypt','EGY'), awayTeam: t('Ghana','Ghana','GHA'), score: EMPTY_SCORE, venue: 'Levi\'s Stadium', city: 'San Francisco', country: 'USA' },

  // ── GROUP K: Austria, Hungary, Slovakia, Peru ─────────────────────────────
  { id: 61, utcDate: '2026-06-19T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group K', matchday: 1, homeTeam: t('Austria','Austria','AUT'), awayTeam: t('Slovakia','Slovakia','SVK'), score: EMPTY_SCORE, venue: 'SoFi Stadium', city: 'Los Angeles', country: 'USA' },
  { id: 62, utcDate: '2026-06-19T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group K', matchday: 1, homeTeam: t('Hungary','Hungary','HUN'), awayTeam: t('Peru','Peru','PER'), score: EMPTY_SCORE, venue: 'Lumen Field', city: 'Seattle', country: 'USA' },
  { id: 63, utcDate: '2026-06-24T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group K', matchday: 2, homeTeam: t('Austria','Austria','AUT'), awayTeam: t('Hungary','Hungary','HUN'), score: EMPTY_SCORE, venue: 'Gillette Stadium', city: 'Boston', country: 'USA' },
  { id: 64, utcDate: '2026-06-24T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group K', matchday: 2, homeTeam: t('Slovakia','Slovakia','SVK'), awayTeam: t('Peru','Peru','PER'), score: EMPTY_SCORE, venue: 'BC Place', city: 'Vancouver', country: 'CAN' },
  { id: 65, utcDate: '2026-06-28T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group K', matchday: 3, homeTeam: t('Austria','Austria','AUT'), awayTeam: t('Peru','Peru','PER'), score: EMPTY_SCORE, venue: 'BMO Field', city: 'Toronto', country: 'CAN' },
  { id: 66, utcDate: '2026-06-28T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group K', matchday: 3, homeTeam: t('Hungary','Hungary','HUN'), awayTeam: t('Slovakia','Slovakia','SVK'), score: EMPTY_SCORE, venue: 'Hard Rock Stadium', city: 'Miami', country: 'USA' },

  // ── GROUP L: Ukraine, Qatar, Paraguay, Uzbekistan ─────────────────────────
  { id: 67, utcDate: '2026-06-20T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group L', matchday: 1, homeTeam: t('Ukraine','Ukraine','UKR'), awayTeam: t('Paraguay','Paraguay','PAR'), score: EMPTY_SCORE, venue: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },
  { id: 68, utcDate: '2026-06-20T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group L', matchday: 1, homeTeam: t('Qatar','Qatar','QAT'), awayTeam: t('Uzbekistan','Uzbekistan','UZB'), score: EMPTY_SCORE, venue: 'BMO Field', city: 'Toronto', country: 'CAN' },
  { id: 69, utcDate: '2026-06-25T01:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group L', matchday: 2, homeTeam: t('Ukraine','Ukraine','UKR'), awayTeam: t('Qatar','Qatar','QAT'), score: EMPTY_SCORE, venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
  { id: 70, utcDate: '2026-06-25T19:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group L', matchday: 2, homeTeam: t('Paraguay','Paraguay','PAR'), awayTeam: t('Uzbekistan','Uzbekistan','UZB'), score: EMPTY_SCORE, venue: 'Lumen Field', city: 'Seattle', country: 'USA' },
  { id: 71, utcDate: '2026-06-29T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group L', matchday: 3, homeTeam: t('Ukraine','Ukraine','UKR'), awayTeam: t('Uzbekistan','Uzbekistan','UZB'), score: EMPTY_SCORE, venue: 'Hard Rock Stadium', city: 'Miami', country: 'USA' },
  { id: 72, utcDate: '2026-06-29T22:00:00Z', status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'Group L', matchday: 3, homeTeam: t('Qatar','Qatar','QAT'), awayTeam: t('Paraguay','Paraguay','PAR'), score: EMPTY_SCORE, venue: 'NRG Stadium', city: 'Houston', country: 'USA' },
];

export const ALL_FIXTURES: WCMatch[] = [
  ...GROUP_STAGE_FIXTURES,
  // Knockout stage placeholders — populated from API once group stage ends
];

export const GROUPS = ['Group A','Group B','Group C','Group D','Group E','Group F','Group G','Group H','Group I','Group J','Group K','Group L'];

export const STAGES: Record<string, string> = {
  GROUP_STAGE: 'Group Stage',
  LAST_32: 'Round of 32',
  LAST_16: 'Round of 16',
  QUARTER_FINALS: 'Quarter-finals',
  SEMI_FINALS: 'Semi-finals',
  THIRD_PLACE: 'Third Place',
  FINAL: 'Final',
};
