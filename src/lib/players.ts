import type { Player } from '@/types/squad';

// Avatar images from TheSportsDB (free, no key required)
// https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=<name>
const SPORTSDB = 'https://www.thesportsdb.com/images/media/player/thumb';

export const PLAYERS: Player[] = [
  // ── GK ───────────────────────────────────────────────────────────────
  { id: 'courtois',    name: 'Courtois',      shortName: 'CO', country: 'Belgium',      countryCode: 'BEL', club: 'Real Madrid',  position: 'GK',  rating: 91, avatar: `${SPORTSDB}/courtois.jpg` },
  { id: 'alisson',    name: 'Alisson',        shortName: 'AL', country: 'Brazil',       countryCode: 'BRA', club: 'Liverpool',    position: 'GK',  rating: 90, avatar: `${SPORTSDB}/alisson.jpg` },
  { id: 'ederson',    name: 'Ederson',        shortName: 'ED', country: 'Brazil',       countryCode: 'BRA', club: 'Man City',     position: 'GK',  rating: 89, avatar: `${SPORTSDB}/ederson.jpg` },
  { id: 'lloris',     name: 'Lloris',         shortName: 'LL', country: 'France',       countryCode: 'FRA', club: 'Tottenham',    position: 'GK',  rating: 87, avatar: `${SPORTSDB}/lloris.jpg` },
  { id: 'oblak',      name: 'Oblak',          shortName: 'OB', country: 'Slovenia',     countryCode: 'SVN', club: 'Atlético',     position: 'GK',  rating: 88, avatar: `${SPORTSDB}/oblak.jpg` },
  { id: 'neuer',      name: 'Neuer',          shortName: 'NE', country: 'Germany',      countryCode: 'GER', club: 'Bayern',       position: 'GK',  rating: 87, avatar: `${SPORTSDB}/neuer.jpg` },
  { id: 'pickford',   name: 'Pickford',       shortName: 'PI', country: 'England',      countryCode: 'ENG', club: 'Everton',      position: 'GK',  rating: 85, avatar: `${SPORTSDB}/pickford.jpg` },
  { id: 'donnarumma', name: 'Donnarumma',     shortName: 'DO', country: 'Italy',        countryCode: 'ITA', club: 'PSG',          position: 'GK',  rating: 88, avatar: `${SPORTSDB}/donnarumma.jpg` },
  { id: 'diogo_costa', name: 'Diogo Costa',  shortName: 'DC', country: 'Portugal',     countryCode: 'POR', club: 'Porto',        position: 'GK',  rating: 86, avatar: `${SPORTSDB}/diogocosta.jpg` },
  { id: 'unai_simon', name: 'Unai Simón',    shortName: 'US', country: 'Spain',        countryCode: 'ESP', club: 'Athletic',     position: 'GK',  rating: 85, avatar: `${SPORTSDB}/unai_simon.jpg` },

  // ── DEF ──────────────────────────────────────────────────────────────
  { id: 'vandijk',    name: 'Van Dijk',       shortName: 'VD', country: 'Netherlands',  countryCode: 'NED', club: 'Liverpool',    position: 'DEF', rating: 90, avatar: `${SPORTSDB}/vandijk.jpg` },
  { id: 'hakimi',     name: 'Hakimi',         shortName: 'HA', country: 'Morocco',      countryCode: 'MAR', club: 'PSG',          position: 'DEF', rating: 88, avatar: `${SPORTSDB}/hakimi.jpg` },
  { id: 'marquinhos', name: 'Marquinhos',    shortName: 'MA', country: 'Brazil',       countryCode: 'BRA', club: 'PSG',          position: 'DEF', rating: 87, avatar: `${SPORTSDB}/marquinhos.jpg` },
  { id: 'kim',        name: 'Kim Min-jae',   shortName: 'KI', country: 'South Korea',  countryCode: 'KOR', club: 'Bayern',       position: 'DEF', rating: 86, avatar: `${SPORTSDB}/kimminjae.jpg` },
  { id: 'militao',    name: 'Militão',        shortName: 'MI', country: 'Brazil',       countryCode: 'BRA', club: 'Real Madrid',  position: 'DEF', rating: 86, avatar: `${SPORTSDB}/militao.jpg` },
  { id: 'acerbi',     name: 'Acerbi',         shortName: 'AC', country: 'Italy',        countryCode: 'ITA', club: 'Inter Milan',  position: 'DEF', rating: 84, avatar: `${SPORTSDB}/acerbi.jpg` },
  { id: 'rudiger',    name: 'Rüdiger',        shortName: 'RU', country: 'Germany',      countryCode: 'GER', club: 'Real Madrid',  position: 'DEF', rating: 86, avatar: `${SPORTSDB}/rudiger.jpg` },
  { id: 'laporte',    name: 'Laporte',        shortName: 'LA', country: 'Spain',        countryCode: 'ESP', club: 'Al-Nassr',     position: 'DEF', rating: 85, avatar: `${SPORTSDB}/laporte.jpg` },
  { id: 'cancelo',    name: 'Cancelo',        shortName: 'CA', country: 'Portugal',     countryCode: 'POR', club: 'Barcelona',    position: 'DEF', rating: 85, avatar: `${SPORTSDB}/cancelo.jpg` },
  { id: 'dias',       name: 'Rúben Dias',     shortName: 'RD', country: 'Portugal',     countryCode: 'POR', club: 'Man City',     position: 'DEF', rating: 88, avatar: `${SPORTSDB}/ruben_dias.jpg` },
  { id: 'alaba',      name: 'Alaba',          shortName: 'AB', country: 'Austria',      countryCode: 'AUT', club: 'Real Madrid',  position: 'DEF', rating: 85, avatar: `${SPORTSDB}/alaba.jpg` },
  { id: 'kounde',     name: 'Koundé',         shortName: 'KO', country: 'France',       countryCode: 'FRA', club: 'Barcelona',    position: 'DEF', rating: 85, avatar: `${SPORTSDB}/kounde.jpg` },
  { id: 'theo',       name: 'Theo Hernández', shortName: 'TH', country: 'France',       countryCode: 'FRA', club: 'AC Milan',     position: 'DEF', rating: 85, avatar: `${SPORTSDB}/theo_hernandez.jpg` },
  { id: 'trent',      name: 'Trent Alexander-Arnold', shortName: 'TA', country: 'England', countryCode: 'ENG', club: 'Real Madrid', position: 'DEF', rating: 87, avatar: `${SPORTSDB}/trent.jpg` },
  { id: 'luke_shaw',  name: 'Luke Shaw',      shortName: 'LS', country: 'England',      countryCode: 'ENG', club: 'Man Utd',      position: 'DEF', rating: 83, avatar: `${SPORTSDB}/luke_shaw.jpg` },
  { id: 'gvardiol',   name: 'Gvardiol',       shortName: 'GV', country: 'Croatia',      countryCode: 'CRO', club: 'Man City',     position: 'DEF', rating: 86, avatar: `${SPORTSDB}/gvardiol.jpg` },

  // ── MID ──────────────────────────────────────────────────────────────
  { id: 'bellingham', name: 'Bellingham',     shortName: 'BE', country: 'England',      countryCode: 'ENG', club: 'Real Madrid',  position: 'MID', rating: 91, avatar: `${SPORTSDB}/bellingham.jpg` },
  { id: 'rodri',      name: 'Rodri',          shortName: 'RO', country: 'Spain',        countryCode: 'ESP', club: 'Man City',     position: 'MID', rating: 91, avatar: `${SPORTSDB}/rodri.jpg` },
  { id: 'vinicius',   name: 'Vinícius Jr',    shortName: 'VI', country: 'Brazil',       countryCode: 'BRA', club: 'Real Madrid',  position: 'MID', rating: 92, avatar: `${SPORTSDB}/vinicius.jpg` },
  { id: 'pedri',      name: 'Pedri',          shortName: 'PE', country: 'Spain',        countryCode: 'ESP', club: 'Barcelona',    position: 'MID', rating: 88, avatar: `${SPORTSDB}/pedri.jpg` },
  { id: 'son',        name: 'Son',            shortName: 'SO', country: 'South Korea',  countryCode: 'KOR', club: 'Tottenham',    position: 'MID', rating: 87, avatar: `${SPORTSDB}/son.jpg` },
  { id: 'griezmann',  name: 'Griezmann',      shortName: 'GR', country: 'France',       countryCode: 'FRA', club: 'Atlético',     position: 'MID', rating: 87, avatar: `${SPORTSDB}/griezmann.jpg` },
  { id: 'modric',     name: 'Modrić',         shortName: 'MO', country: 'Croatia',      countryCode: 'CRO', club: 'Real Madrid',  position: 'MID', rating: 88, avatar: `${SPORTSDB}/modric.jpg` },
  { id: 'kroos',      name: 'Kroos',          shortName: 'KR', country: 'Germany',      countryCode: 'GER', club: 'Real Madrid',  position: 'MID', rating: 88, avatar: `${SPORTSDB}/kroos.jpg` },
  { id: 'de_bruyne',  name: 'De Bruyne',      shortName: 'DB', country: 'Belgium',      countryCode: 'BEL', club: 'Man City',     position: 'MID', rating: 91, avatar: `${SPORTSDB}/debruyne.jpg` },
  { id: 'camavinga',  name: 'Camavinga',      shortName: 'CM', country: 'France',       countryCode: 'FRA', club: 'Real Madrid',  position: 'MID', rating: 86, avatar: `${SPORTSDB}/camavinga.jpg` },
  { id: 'tchouameni', name: 'Tchouaméni',     shortName: 'TC', country: 'France',       countryCode: 'FRA', club: 'Real Madrid',  position: 'MID', rating: 85, avatar: `${SPORTSDB}/tchouameni.jpg` },
  { id: 'gundogan',   name: 'Gündoğan',       shortName: 'GU', country: 'Germany',      countryCode: 'GER', club: 'Barcelona',    position: 'MID', rating: 86, avatar: `${SPORTSDB}/gundogan.jpg` },
  { id: 'vitinha',    name: 'Vitinha',         shortName: 'VT', country: 'Portugal',     countryCode: 'POR', club: 'PSG',          position: 'MID', rating: 84, avatar: `${SPORTSDB}/vitinha.jpg` },
  { id: 'bernardo',   name: 'B. Silva',       shortName: 'BS', country: 'Portugal',     countryCode: 'POR', club: 'Man City',     position: 'MID', rating: 88, avatar: `${SPORTSDB}/bernardo_silva.jpg` },
  { id: 'joao_felix', name: 'João Félix',     shortName: 'JF', country: 'Portugal',     countryCode: 'POR', club: 'Chelsea',      position: 'MID', rating: 84, avatar: `${SPORTSDB}/joao_felix.jpg` },
  { id: 'dembele',    name: 'Dembélé',        shortName: 'DE', country: 'France',       countryCode: 'FRA', club: 'PSG',          position: 'MID', rating: 87, avatar: `${SPORTSDB}/dembele.jpg` },
  { id: 'gavi',       name: 'Gavi',           shortName: 'GA', country: 'Spain',        countryCode: 'ESP', club: 'Barcelona',    position: 'MID', rating: 87, avatar: `${SPORTSDB}/gavi.jpg` },
  { id: 'yamal',      name: 'Lamine Yamal',   shortName: 'LY', country: 'Spain',        countryCode: 'ESP', club: 'Barcelona',    position: 'MID', rating: 87, avatar: `${SPORTSDB}/yamal.jpg` },
  { id: 'nico_williams', name: 'Nico Williams', shortName: 'NW', country: 'Spain',     countryCode: 'ESP', club: 'Athletic',     position: 'MID', rating: 85, avatar: `${SPORTSDB}/nico_williams.jpg` },
  { id: 'saka',       name: 'Saka',           shortName: 'SK', country: 'England',      countryCode: 'ENG', club: 'Arsenal',      position: 'MID', rating: 87, avatar: `${SPORTSDB}/saka.jpg` },
  { id: 'foden',      name: 'Foden',          shortName: 'FO', country: 'England',      countryCode: 'ENG', club: 'Man City',     position: 'MID', rating: 88, avatar: `${SPORTSDB}/foden.jpg` },
  { id: 'musiala',    name: 'Musiala',        shortName: 'MU', country: 'Germany',      countryCode: 'GER', club: 'Bayern',       position: 'MID', rating: 88, avatar: `${SPORTSDB}/musiala.jpg` },
  { id: 'wirtz',      name: 'Wirtz',          shortName: 'WI', country: 'Germany',      countryCode: 'GER', club: 'Leverkusen',   position: 'MID', rating: 87, avatar: `${SPORTSDB}/wirtz.jpg` },

  // ── FWD ──────────────────────────────────────────────────────────────
  { id: 'mbappe',     name: 'Mbappé',         shortName: 'MB', country: 'France',       countryCode: 'FRA', club: 'Real Madrid',  position: 'FWD', rating: 95, avatar: `${SPORTSDB}/mbappe.jpg` },
  { id: 'messi',      name: 'Messi',          shortName: 'ME', country: 'Argentina',    countryCode: 'ARG', club: 'Inter Miami',  position: 'FWD', rating: 94, avatar: `${SPORTSDB}/messi.jpg` },
  { id: 'kane',       name: 'Kane',           shortName: 'KA', country: 'England',      countryCode: 'ENG', club: 'Bayern',       position: 'FWD', rating: 91, avatar: `${SPORTSDB}/kane.jpg` },
  { id: 'raphinha',   name: 'Raphinha',       shortName: 'RA', country: 'Brazil',       countryCode: 'BRA', club: 'Barcelona',    position: 'FWD', rating: 87, avatar: `${SPORTSDB}/raphinha.jpg` },
  { id: 'osimhen',    name: 'Osimhen',        shortName: 'OS', country: 'Nigeria',      countryCode: 'NGA', club: 'Galatasaray',  position: 'FWD', rating: 88, avatar: `${SPORTSDB}/osimhen.jpg` },
  { id: 'salah',      name: 'Salah',          shortName: 'SA', country: 'Egypt',        countryCode: 'EGY', club: 'Liverpool',    position: 'FWD', rating: 90, avatar: `${SPORTSDB}/salah.jpg` },
  { id: 'lewandowski', name: 'Lewandowski',   shortName: 'LE', country: 'Poland',       countryCode: 'POL', club: 'Barcelona',    position: 'FWD', rating: 90, avatar: `${SPORTSDB}/lewandowski.jpg` },
  { id: 'ronaldo',    name: 'Ronaldo',        shortName: 'CR', country: 'Portugal',     countryCode: 'POR', club: 'Al-Nassr',     position: 'FWD', rating: 91, avatar: `${SPORTSDB}/ronaldo.jpg` },
  { id: 'lukaku',     name: 'Lukaku',         shortName: 'LU', country: 'Belgium',      countryCode: 'BEL', club: 'Napoli',       position: 'FWD', rating: 87, avatar: `${SPORTSDB}/lukaku.jpg` },
  { id: 'neymar',     name: 'Neymar',         shortName: 'NY', country: 'Brazil',       countryCode: 'BRA', club: 'Al-Hilal',     position: 'FWD', rating: 89, avatar: `${SPORTSDB}/neymar.jpg` },
  { id: 'lautaro',    name: 'Lautaro',        shortName: 'LM', country: 'Argentina',    countryCode: 'ARG', club: 'Inter Milan',  position: 'FWD', rating: 88, avatar: `${SPORTSDB}/lautaro.jpg` },
  { id: 'di_maria',   name: 'Di María',       shortName: 'DM', country: 'Argentina',    countryCode: 'ARG', club: 'Benfica',      position: 'FWD', rating: 86, avatar: `${SPORTSDB}/dimaria.jpg` },
  { id: 'alvarez',    name: 'J. Álvarez',     shortName: 'JA', country: 'Argentina',    countryCode: 'ARG', club: 'Atlético',     position: 'FWD', rating: 85, avatar: `${SPORTSDB}/julian_alvarez.jpg` },
  { id: 'gnabry',     name: 'Gnabry',         shortName: 'GN', country: 'Germany',      countryCode: 'GER', club: 'Bayern',       position: 'FWD', rating: 84, avatar: `${SPORTSDB}/gnabry.jpg` },
  { id: 'sterling',   name: 'Sterling',       shortName: 'ST', country: 'England',      countryCode: 'ENG', club: 'Arsenal',      position: 'FWD', rating: 83, avatar: `${SPORTSDB}/sterling.jpg` },
  { id: 'duran',      name: 'Durán',          shortName: 'DU', country: 'Colombia',     countryCode: 'COL', club: 'Aston Villa',  position: 'FWD', rating: 83, avatar: `${SPORTSDB}/duran.jpg` },
  { id: 'ferran',     name: 'Ferran Torres',  shortName: 'FT', country: 'Spain',        countryCode: 'ESP', club: 'Barcelona',    position: 'FWD', rating: 82, avatar: `${SPORTSDB}/ferran_torres.jpg` },
  { id: 'havertz',    name: 'Havertz',        shortName: 'HV', country: 'Germany',      countryCode: 'GER', club: 'Arsenal',      position: 'FWD', rating: 84, avatar: `${SPORTSDB}/havertz.jpg` },
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
