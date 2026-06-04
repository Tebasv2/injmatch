import type { Player } from '@/types/squad';

export const PLAYERS: Player[] = [
  // GK
  { id: 'courtois',   name: 'Courtois',   shortName: 'CO', country: 'Belgium',     countryCode: 'BEL', club: 'Real Madrid',  position: 'GK',  rating: 91 },
  { id: 'alisson',    name: 'Alisson',    shortName: 'AL', country: 'Brazil',      countryCode: 'BRA', club: 'Liverpool',    position: 'GK',  rating: 90 },
  { id: 'lloris',     name: 'Lloris',     shortName: 'LL', country: 'France',      countryCode: 'FRA', club: 'Tottenham',    position: 'GK',  rating: 87 },
  { id: 'ederson',    name: 'Ederson',    shortName: 'ED', country: 'Brazil',      countryCode: 'BRA', club: 'Man City',     position: 'GK',  rating: 89 },
  // DEF
  { id: 'vandijk',    name: 'Van Dijk',   shortName: 'VD', country: 'Netherlands', countryCode: 'NED', club: 'Liverpool',    position: 'DEF', rating: 90 },
  { id: 'hakimi',     name: 'Hakimi',     shortName: 'HA', country: 'Morocco',     countryCode: 'MAR', club: 'PSG',          position: 'DEF', rating: 88 },
  { id: 'marquinhos', name: 'Marquinhos', shortName: 'MA', country: 'Brazil',      countryCode: 'BRA', club: 'PSG',          position: 'DEF', rating: 87 },
  { id: 'kim',        name: 'Kim',        shortName: 'KI', country: 'South Korea', countryCode: 'KOR', club: 'Bayern',       position: 'DEF', rating: 86 },
  { id: 'militao',    name: 'Militão',    shortName: 'MI', country: 'Brazil',      countryCode: 'BRA', club: 'Real Madrid',  position: 'DEF', rating: 86 },
  { id: 'acerbi',     name: 'Acerbi',     shortName: 'AC', country: 'Italy',       countryCode: 'ITA', club: 'Inter Milan',  position: 'DEF', rating: 84 },
  // MID
  { id: 'bellingham', name: 'Bellingham', shortName: 'BE', country: 'England',     countryCode: 'ENG', club: 'Real Madrid',  position: 'MID', rating: 91 },
  { id: 'rodri',      name: 'Rodri',      shortName: 'RO', country: 'Spain',       countryCode: 'ESP', club: 'Man City',     position: 'MID', rating: 91 },
  { id: 'vinicius',   name: 'Vinícius',   shortName: 'VI', country: 'Brazil',      countryCode: 'BRA', club: 'Real Madrid',  position: 'MID', rating: 92 },
  { id: 'pedri',      name: 'Pedri',      shortName: 'PE', country: 'Spain',       countryCode: 'ESP', club: 'Barcelona',    position: 'MID', rating: 88 },
  { id: 'son',        name: 'Son',        shortName: 'SO', country: 'South Korea', countryCode: 'KOR', club: 'Tottenham',    position: 'MID', rating: 87 },
  { id: 'griezmann',  name: 'Griezmann',  shortName: 'GR', country: 'France',      countryCode: 'FRA', club: 'Atlético',     position: 'MID', rating: 87 },
  { id: 'modric',     name: 'Modrić',     shortName: 'MO', country: 'Croatia',     countryCode: 'CRO', club: 'Real Madrid',  position: 'MID', rating: 88 },
  // FWD
  { id: 'mbappe',     name: 'Mbappé',     shortName: 'MB', country: 'France',      countryCode: 'FRA', club: 'Real Madrid',  position: 'FWD', rating: 95 },
  { id: 'messi',      name: 'Messi',      shortName: 'ME', country: 'Argentina',   countryCode: 'ARG', club: 'Inter Miami',  position: 'FWD', rating: 94 },
  { id: 'kane',       name: 'Kane',       shortName: 'KA', country: 'England',     countryCode: 'ENG', club: 'Bayern',       position: 'FWD', rating: 91 },
  { id: 'raphinha',   name: 'Raphinha',   shortName: 'RA', country: 'Brazil',      countryCode: 'BRA', club: 'Barcelona',    position: 'FWD', rating: 86 },
  { id: 'osimhen',    name: 'Osimhen',    shortName: 'OS', country: 'Nigeria',     countryCode: 'NGA', club: 'Napoli',       position: 'FWD', rating: 88 },
  { id: 'salah',      name: 'Salah',      shortName: 'SA', country: 'Egypt',       countryCode: 'EGY', club: 'Liverpool',    position: 'FWD', rating: 90 },
  { id: 'lewandowski',name: 'Lewandowski',shortName: 'LE', country: 'Poland',      countryCode: 'POL', club: 'Barcelona',    position: 'FWD', rating: 90 },
];

export const FORMATIONS: Record<string, { rows: { position: 'GK'|'DEF'|'MID'|'FWD'; count: number }[] }> = {
  '4-3-3': {
    rows: [
      { position: 'FWD', count: 3 },
      { position: 'MID', count: 3 },
      { position: 'DEF', count: 4 },
      { position: 'GK',  count: 1 },
    ],
  },
  '4-4-2': {
    rows: [
      { position: 'FWD', count: 2 },
      { position: 'MID', count: 4 },
      { position: 'DEF', count: 4 },
      { position: 'GK',  count: 1 },
    ],
  },
  '3-5-2': {
    rows: [
      { position: 'FWD', count: 2 },
      { position: 'MID', count: 5 },
      { position: 'DEF', count: 3 },
      { position: 'GK',  count: 1 },
    ],
  },
  '4-2-3-1': {
    rows: [
      { position: 'FWD', count: 1 },
      { position: 'MID', count: 3 },
      { position: 'MID', count: 2 },
      { position: 'DEF', count: 4 },
      { position: 'GK',  count: 1 },
    ],
  },
};
