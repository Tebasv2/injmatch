import type { Player } from '@/types/squad';

// TheSportsDB search names — used by PlayerAvatar to fetch actual images at runtime
export const SPORTSDB_SEARCH_NAME: Record<string, string> = {
  // GK
  courtois: 'Thibaut Courtois', alisson: 'Alisson Becker', ederson: 'Ederson',
  donnarumma: 'Gianluigi Donnarumma', oblak: 'Jan Oblak', neuer: 'Manuel Neuer',
  pickford: 'Jordan Pickford', maignan: 'Mike Maignan', diogo_costa: 'Diogo Costa',
  unai_simon: 'Unai Simon', emi_martinez: 'Emiliano Martinez', ochoa: 'Guillermo Ochoa',
  turner: 'Matt Turner', mendy: 'Edouard Mendy', bono: 'Bono',
  // DEF
  vandijk: 'Virgil van Dijk', hakimi: 'Achraf Hakimi', marquinhos: 'Marquinhos',
  kim: 'Kim Min-jae', militao: 'Eder Militao', acerbi: 'Francesco Acerbi',
  rudiger: 'Antonio Rudiger', dias: 'Ruben Dias', gvardiol: 'Josko Gvardiol',
  theo: 'Theo Hernandez', cancelo: 'Joao Cancelo', kounde: 'Jules Kounde',
  trent: 'Trent Alexander-Arnold', cubarsi: 'Pau Cubarsi',
  upamecano: 'Dayot Upamecano', romero: 'Cristian Romero',
  lisandro: 'Lisandro Martinez', dumfries: 'Denzel Dumfries',
  araújo: 'Ronald Araujo', pulisic: 'Christian Pulisic',
  mendes: 'Nuno Mendes', alves: 'Toti Gomes',
  // MID
  bellingham: 'Jude Bellingham', rodri: 'Rodri', vinicius: 'Vinicius Junior',
  de_bruyne: 'Kevin De Bruyne', pedri: 'Pedri', modric: 'Luka Modric',
  gavi: 'Gavi', yamal: 'Lamine Yamal', saka: 'Bukayo Saka',
  foden: 'Phil Foden', musiala: 'Jamal Musiala', wirtz: 'Florian Wirtz',
  bernardo: 'Bernardo Silva', joao_felix: 'Joao Felix', dembele: 'Ousmane Dembele',
  son: 'Son Heung-min', griezmann: 'Antoine Griezmann',
  nico_williams: 'Nico Williams', camavinga: 'Eduardo Camavinga',
  tchouameni: 'Aurelien Tchouameni', gundogan: 'Ilkay Gundogan',
  vitinha: 'Vitinha', rice: 'Declan Rice', mac_allister: 'Alexis Mac Allister',
  de_paul: 'Rodrigo De Paul', de_jong: 'Frenkie De Jong',
  gakpo: 'Cody Gakpo', valverde: 'Federico Valverde',
  barella: 'Nicolo Barella', amrabat: 'Sofyan Amrabat',
  mitoma: 'Kaoru Mitoma', james: 'James Rodriguez',
  luis_diaz: 'Luis Diaz', mckennie: 'Weston McKennie',
  reyna: 'Giovanni Reyna', kimmich: 'Joshua Kimmich',
  palmer: 'Cole Palmer', ziyech: 'Hakim Ziyech',
  // FWD
  mbappe: 'Kylian Mbappe', messi: 'Lionel Messi', salah: 'Mohamed Salah',
  ronaldo: 'Cristiano Ronaldo', kane: 'Harry Kane',
  lewandowski: 'Robert Lewandowski', lautaro: 'Lautaro Martinez',
  osimhen: 'Victor Osimhen', raphinha: 'Raphinha', lukaku: 'Romelu Lukaku',
  havertz: 'Kai Havertz', alvarez: 'Julian Alvarez',
  neymar: 'Neymar Jr', darwin: 'Darwin Nunez', rodrygo: 'Rodrygo',
  endrick: 'Endrick', mane: 'Sadio Mane', en_nesyri: 'Youssef En-Nesyri',
  ferran: 'Ferran Torres', olmo: 'Dani Olmo',
  chiesa: 'Federico Chiesa', gnabry: 'Serge Gnabry',
  sane: 'Leroy Sane', leao: 'Rafael Leao', ramos_g: 'Goncalo Ramos',
  duran: 'Jhon Duran', morata: 'Alvaro Morata',
  weghorst: 'Wout Weghorst', giminez: 'Santiago Gimenez',
};

export const PLAYERS: Player[] = [
  // ════════════════════ GK ════════════════════
  {
    id: 'courtois', name: 'Courtois', shortName: 'COU', country: 'Belgium', countryCode: 'BEL',
    club: 'Real Madrid', position: 'GK', rating: 91, price: 6.0, form: 7.2,
    stats: { pac: 52, sho: 18, pas: 68, dri: 52, def: 91, phy: 88 },
  },
  {
    id: 'alisson', name: 'Alisson', shortName: 'ALI', country: 'Brazil', countryCode: 'BRA',
    club: 'Liverpool', position: 'GK', rating: 90, price: 5.5, form: 6.8,
    stats: { pac: 50, sho: 17, pas: 70, dri: 50, def: 90, phy: 84 },
  },
  {
    id: 'ederson', name: 'Ederson', shortName: 'EDE', country: 'Brazil', countryCode: 'BRA',
    club: 'Man City', position: 'GK', rating: 89, price: 5.5, form: 6.5,
    stats: { pac: 58, sho: 16, pas: 72, dri: 55, def: 89, phy: 83 },
  },
  {
    id: 'donnarumma', name: 'Donnarumma', shortName: 'DON', country: 'Italy', countryCode: 'ITA',
    club: 'PSG', position: 'GK', rating: 88, price: 5.5, form: 6.4,
    stats: { pac: 55, sho: 14, pas: 62, dri: 48, def: 88, phy: 90 },
  },
  {
    id: 'oblak', name: 'Oblak', shortName: 'OBL', country: 'Slovenia', countryCode: 'SVN',
    club: 'Atlético', position: 'GK', rating: 88, price: 5.0, form: 6.0,
    stats: { pac: 48, sho: 15, pas: 60, dri: 45, def: 88, phy: 85 },
  },
  {
    id: 'neuer', name: 'Neuer', shortName: 'NEU', country: 'Germany', countryCode: 'GER',
    club: 'Bayern', position: 'GK', rating: 86, price: 4.5, form: 5.8,
    stats: { pac: 54, sho: 16, pas: 66, dri: 51, def: 86, phy: 82 },
  },
  {
    id: 'pickford', name: 'Pickford', shortName: 'PIC', country: 'England', countryCode: 'ENG',
    club: 'Everton', position: 'GK', rating: 84, price: 4.5, form: 5.5,
    stats: { pac: 50, sho: 12, pas: 58, dri: 44, def: 84, phy: 78 },
  },
  {
    id: 'maignan', name: 'Maignan', shortName: 'MAI', country: 'France', countryCode: 'FRA',
    club: 'AC Milan', position: 'GK', rating: 87, price: 5.0, form: 7.0,
    stats: { pac: 58, sho: 15, pas: 65, dri: 50, def: 87, phy: 84 },
  },
  {
    id: 'diogo_costa', name: 'Diogo Costa', shortName: 'DCO', country: 'Portugal', countryCode: 'POR',
    club: 'Porto', position: 'GK', rating: 86, price: 4.5, form: 6.0,
    stats: { pac: 54, sho: 13, pas: 64, dri: 49, def: 86, phy: 81 },
  },
  {
    id: 'unai_simon', name: 'Unai Simón', shortName: 'USI', country: 'Spain', countryCode: 'ESP',
    club: 'Athletic', position: 'GK', rating: 85, price: 4.5, form: 6.8,
    stats: { pac: 52, sho: 13, pas: 65, dri: 46, def: 85, phy: 80 },
  },
  {
    id: 'emi_martinez', name: 'Emi Martínez', shortName: 'EMI', country: 'Argentina', countryCode: 'ARG',
    club: 'Aston Villa', position: 'GK', rating: 88, price: 5.5, form: 7.5,
    stats: { pac: 50, sho: 14, pas: 62, dri: 46, def: 88, phy: 84 },
  },
  {
    id: 'mendy', name: 'E. Mendy', shortName: 'MND', country: 'Senegal', countryCode: 'SEN',
    club: 'Al-Ahli', position: 'GK', rating: 84, price: 4.0, form: 5.8,
    stats: { pac: 50, sho: 13, pas: 58, dri: 43, def: 84, phy: 82 },
  },
  {
    id: 'bono', name: 'Bono', shortName: 'BON', country: 'Morocco', countryCode: 'MAR',
    club: 'Sevilla', position: 'GK', rating: 85, price: 4.5, form: 6.5,
    stats: { pac: 52, sho: 14, pas: 60, dri: 46, def: 85, phy: 80 },
  },
  {
    id: 'turner', name: 'M. Turner', shortName: 'TUR', country: 'USA', countryCode: 'USA',
    club: 'Arsenal', position: 'GK', rating: 82, price: 4.0, form: 5.5,
    stats: { pac: 56, sho: 12, pas: 55, dri: 42, def: 82, phy: 83 },
  },
  {
    id: 'ochoa', name: 'Ochoa', shortName: 'OCH', country: 'Mexico', countryCode: 'MEX',
    club: 'Salernitana', position: 'GK', rating: 82, price: 4.0, form: 5.0,
    stats: { pac: 50, sho: 12, pas: 54, dri: 42, def: 82, phy: 78 },
  },

  // ════════════════════ DEF ════════════════════
  {
    id: 'vandijk', name: 'Van Dijk', shortName: 'VDK', country: 'Netherlands', countryCode: 'NED',
    club: 'Liverpool', position: 'DEF', rating: 90, price: 6.5, form: 7.5,
    stats: { pac: 77, sho: 60, pas: 71, dri: 72, def: 90, phy: 91 },
  },
  {
    id: 'trent', name: 'Trent Arnold', shortName: 'TAA', country: 'England', countryCode: 'ENG',
    club: 'Real Madrid', position: 'DEF', rating: 87, price: 7.5, form: 7.8,
    stats: { pac: 80, sho: 72, pas: 88, dri: 81, def: 75, phy: 73 },
  },
  {
    id: 'rudiger', name: 'Rüdiger', shortName: 'RUD', country: 'Germany', countryCode: 'GER',
    club: 'Real Madrid', position: 'DEF', rating: 86, price: 5.5, form: 6.8,
    stats: { pac: 78, sho: 51, pas: 64, dri: 63, def: 86, phy: 90 },
  },
  {
    id: 'dias', name: 'Rúben Dias', shortName: 'RDI', country: 'Portugal', countryCode: 'POR',
    club: 'Man City', position: 'DEF', rating: 88, price: 6.0, form: 7.0,
    stats: { pac: 72, sho: 45, pas: 68, dri: 64, def: 88, phy: 88 },
  },
  {
    id: 'gvardiol', name: 'Gvardiol', shortName: 'GVA', country: 'Croatia', countryCode: 'CRO',
    club: 'Man City', position: 'DEF', rating: 86, price: 6.0, form: 7.2,
    stats: { pac: 80, sho: 58, pas: 72, dri: 74, def: 86, phy: 84 },
  },
  {
    id: 'hakimi', name: 'Hakimi', shortName: 'HAK', country: 'Morocco', countryCode: 'MAR',
    club: 'PSG', position: 'DEF', rating: 88, price: 7.0, form: 7.6,
    stats: { pac: 92, sho: 67, pas: 78, dri: 82, def: 82, phy: 79 },
  },
  {
    id: 'theo', name: 'Theo Hernández', shortName: 'THE', country: 'France', countryCode: 'FRA',
    club: 'AC Milan', position: 'DEF', rating: 85, price: 6.5, form: 7.0,
    stats: { pac: 91, sho: 65, pas: 71, dri: 79, def: 78, phy: 81 },
  },
  {
    id: 'kounde', name: 'Koundé', shortName: 'KOU', country: 'France', countryCode: 'FRA',
    club: 'Barcelona', position: 'DEF', rating: 85, price: 5.5, form: 6.8,
    stats: { pac: 82, sho: 53, pas: 70, dri: 72, def: 85, phy: 78 },
  },
  {
    id: 'upamecano', name: 'Upamecano', shortName: 'UPA', country: 'France', countryCode: 'FRA',
    club: 'Bayern', position: 'DEF', rating: 84, price: 5.0, form: 6.2,
    stats: { pac: 80, sho: 46, pas: 63, dri: 64, def: 84, phy: 87 },
  },
  {
    id: 'marquinhos', name: 'Marquinhos', shortName: 'MAR', country: 'Brazil', countryCode: 'BRA',
    club: 'PSG', position: 'DEF', rating: 87, price: 5.5, form: 6.5,
    stats: { pac: 75, sho: 50, pas: 74, dri: 70, def: 87, phy: 84 },
  },
  {
    id: 'militao', name: 'Militão', shortName: 'MIL', country: 'Brazil', countryCode: 'BRA',
    club: 'Real Madrid', position: 'DEF', rating: 86, price: 5.5, form: 6.0,
    stats: { pac: 76, sho: 46, pas: 62, dri: 63, def: 86, phy: 86 },
  },
  {
    id: 'cancelo', name: 'Cancelo', shortName: 'CAN', country: 'Portugal', countryCode: 'POR',
    club: 'Barcelona', position: 'DEF', rating: 85, price: 6.0, form: 6.2,
    stats: { pac: 83, sho: 64, pas: 80, dri: 82, def: 80, phy: 76 },
  },
  {
    id: 'mendes', name: 'Nuno Mendes', shortName: 'NME', country: 'Portugal', countryCode: 'POR',
    club: 'PSG', position: 'DEF', rating: 84, price: 5.5, form: 6.8,
    stats: { pac: 88, sho: 55, pas: 73, dri: 78, def: 80, phy: 74 },
  },
  {
    id: 'kim', name: 'Kim Min-jae', shortName: 'KIM', country: 'South Korea', countryCode: 'KOR',
    club: 'Bayern', position: 'DEF', rating: 86, price: 5.5, form: 6.5,
    stats: { pac: 76, sho: 48, pas: 65, dri: 65, def: 86, phy: 91 },
  },
  {
    id: 'romero', name: 'Cuti Romero', shortName: 'CRO', country: 'Argentina', countryCode: 'ARG',
    club: 'Tottenham', position: 'DEF', rating: 86, price: 5.5, form: 7.0,
    stats: { pac: 76, sho: 52, pas: 65, dri: 68, def: 86, phy: 88 },
  },
  {
    id: 'lisandro', name: 'L. Martínez', shortName: 'LMZ', country: 'Argentina', countryCode: 'ARG',
    club: 'Man Utd', position: 'DEF', rating: 85, price: 5.5, form: 6.8,
    stats: { pac: 72, sho: 50, pas: 68, dri: 66, def: 85, phy: 82 },
  },
  {
    id: 'dumfries', name: 'Dumfries', shortName: 'DUM', country: 'Netherlands', countryCode: 'NED',
    club: 'Inter Milan', position: 'DEF', rating: 83, price: 5.0, form: 6.5,
    stats: { pac: 82, sho: 58, pas: 70, dri: 72, def: 78, phy: 80 },
  },
  {
    id: 'acerbi', name: 'Acerbi', shortName: 'ACE', country: 'Italy', countryCode: 'ITA',
    club: 'Inter Milan', position: 'DEF', rating: 84, price: 4.5, form: 6.0,
    stats: { pac: 66, sho: 44, pas: 67, dri: 60, def: 84, phy: 82 },
  },
  {
    id: 'araújo', name: 'Ronald Araújo', shortName: 'RAR', country: 'Uruguay', countryCode: 'URU',
    club: 'Barcelona', position: 'DEF', rating: 85, price: 5.5, form: 6.5,
    stats: { pac: 78, sho: 52, pas: 64, dri: 66, def: 85, phy: 89 },
  },
  {
    id: 'cubarsi', name: 'Cubarsí', shortName: 'CUB', country: 'Spain', countryCode: 'ESP',
    club: 'Barcelona', position: 'DEF', rating: 83, price: 5.0, form: 7.5,
    stats: { pac: 74, sho: 44, pas: 68, dri: 66, def: 83, phy: 80 },
  },
  {
    id: 'pulisic', name: 'Pulisic', shortName: 'PUL', country: 'USA', countryCode: 'USA',
    club: 'AC Milan', position: 'DEF', rating: 84, price: 7.0, form: 8.0,
    stats: { pac: 84, sho: 80, pas: 76, dri: 84, def: 56, phy: 70 },
  },

  // ════════════════════ MID ════════════════════
  {
    id: 'bellingham', name: 'Bellingham', shortName: 'BEL', country: 'England', countryCode: 'ENG',
    club: 'Real Madrid', position: 'MID', rating: 91, price: 12.0, form: 9.0,
    stats: { pac: 82, sho: 86, pas: 84, dri: 88, def: 74, phy: 88 },
  },
  {
    id: 'rodri', name: 'Rodri', shortName: 'ROD', country: 'Spain', countryCode: 'ESP',
    club: 'Man City', position: 'MID', rating: 91, price: 10.0, form: 8.5,
    stats: { pac: 72, sho: 74, pas: 88, dri: 78, def: 88, phy: 88 },
  },
  {
    id: 'vinicius', name: 'Vinícius Jr', shortName: 'VIN', country: 'Brazil', countryCode: 'BRA',
    club: 'Real Madrid', position: 'MID', rating: 92, price: 12.5, form: 9.2,
    stats: { pac: 95, sho: 84, pas: 79, dri: 94, def: 38, phy: 73 },
  },
  {
    id: 'de_bruyne', name: 'De Bruyne', shortName: 'KDB', country: 'Belgium', countryCode: 'BEL',
    club: 'Man City', position: 'MID', rating: 91, price: 11.5, form: 8.0,
    stats: { pac: 76, sho: 86, pas: 93, dri: 87, def: 64, phy: 78 },
  },
  {
    id: 'yamal', name: 'Lamine Yamal', shortName: 'YAM', country: 'Spain', countryCode: 'ESP',
    club: 'Barcelona', position: 'MID', rating: 88, price: 11.0, form: 9.5,
    stats: { pac: 91, sho: 80, pas: 82, dri: 92, def: 36, phy: 65 },
  },
  {
    id: 'saka', name: 'Saka', shortName: 'SAK', country: 'England', countryCode: 'ENG',
    club: 'Arsenal', position: 'MID', rating: 87, price: 10.0, form: 8.8,
    stats: { pac: 88, sho: 83, pas: 83, dri: 88, def: 55, phy: 72 },
  },
  {
    id: 'musiala', name: 'Musiala', shortName: 'MUS', country: 'Germany', countryCode: 'GER',
    club: 'Bayern', position: 'MID', rating: 88, price: 10.0, form: 8.8,
    stats: { pac: 82, sho: 82, pas: 82, dri: 91, def: 52, phy: 70 },
  },
  {
    id: 'wirtz', name: 'Wirtz', shortName: 'WIR', country: 'Germany', countryCode: 'GER',
    club: 'Leverkusen', position: 'MID', rating: 87, price: 9.5, form: 8.6,
    stats: { pac: 80, sho: 83, pas: 85, dri: 90, def: 50, phy: 69 },
  },
  {
    id: 'foden', name: 'Foden', shortName: 'FOD', country: 'England', countryCode: 'ENG',
    club: 'Man City', position: 'MID', rating: 88, price: 9.5, form: 8.0,
    stats: { pac: 84, sho: 84, pas: 84, dri: 89, def: 48, phy: 70 },
  },
  {
    id: 'pedri', name: 'Pedri', shortName: 'PED', country: 'Spain', countryCode: 'ESP',
    club: 'Barcelona', position: 'MID', rating: 88, price: 9.0, form: 8.0,
    stats: { pac: 80, sho: 76, pas: 88, dri: 90, def: 62, phy: 68 },
  },
  {
    id: 'gavi', name: 'Gavi', shortName: 'GAV', country: 'Spain', countryCode: 'ESP',
    club: 'Barcelona', position: 'MID', rating: 87, price: 9.0, form: 8.2,
    stats: { pac: 77, sho: 72, pas: 87, dri: 88, def: 68, phy: 72 },
  },
  {
    id: 'bernardo', name: 'B. Silva', shortName: 'BSI', country: 'Portugal', countryCode: 'POR',
    club: 'Man City', position: 'MID', rating: 88, price: 9.0, form: 7.8,
    stats: { pac: 78, sho: 79, pas: 87, dri: 88, def: 64, phy: 72 },
  },
  {
    id: 'griezmann', name: 'Griezmann', shortName: 'GRI', country: 'France', countryCode: 'FRA',
    club: 'Atlético', position: 'MID', rating: 87, price: 8.5, form: 7.8,
    stats: { pac: 78, sho: 88, pas: 82, dri: 82, def: 62, phy: 74 },
  },
  {
    id: 'dembele', name: 'Dembélé', shortName: 'DEM', country: 'France', countryCode: 'FRA',
    club: 'PSG', position: 'MID', rating: 87, price: 8.5, form: 7.5,
    stats: { pac: 93, sho: 82, pas: 78, dri: 89, def: 38, phy: 71 },
  },
  {
    id: 'son', name: 'Son', shortName: 'SON', country: 'South Korea', countryCode: 'KOR',
    club: 'Tottenham', position: 'MID', rating: 87, price: 8.5, form: 7.2,
    stats: { pac: 88, sho: 87, pas: 80, dri: 84, def: 46, phy: 73 },
  },
  {
    id: 'modric', name: 'Modrić', shortName: 'MOD', country: 'Croatia', countryCode: 'CRO',
    club: 'Real Madrid', position: 'MID', rating: 87, price: 8.0, form: 7.5,
    stats: { pac: 74, sho: 76, pas: 90, dri: 88, def: 72, phy: 68 },
  },
  {
    id: 'nico_williams', name: 'Nico Williams', shortName: 'NWI', country: 'Spain', countryCode: 'ESP',
    club: 'Athletic', position: 'MID', rating: 85, price: 8.0, form: 8.5,
    stats: { pac: 90, sho: 78, pas: 77, dri: 88, def: 40, phy: 68 },
  },
  {
    id: 'rice', name: 'Declan Rice', shortName: 'RIC', country: 'England', countryCode: 'ENG',
    club: 'Arsenal', position: 'MID', rating: 87, price: 8.5, form: 8.8,
    stats: { pac: 76, sho: 72, pas: 82, dri: 79, def: 86, phy: 86 },
  },
  {
    id: 'palmer', name: 'Cole Palmer', shortName: 'CPL', country: 'England', countryCode: 'ENG',
    club: 'Chelsea', position: 'MID', rating: 86, price: 9.5, form: 9.0,
    stats: { pac: 79, sho: 84, pas: 84, dri: 88, def: 48, phy: 70 },
  },
  {
    id: 'mac_allister', name: 'Mac Allister', shortName: 'MAC', country: 'Argentina', countryCode: 'ARG',
    club: 'Liverpool', position: 'MID', rating: 85, price: 8.0, form: 8.0,
    stats: { pac: 74, sho: 78, pas: 84, dri: 82, def: 72, phy: 78 },
  },
  {
    id: 'de_paul', name: 'De Paul', shortName: 'DPL', country: 'Argentina', countryCode: 'ARG',
    club: 'Atlético', position: 'MID', rating: 84, price: 7.5, form: 7.8,
    stats: { pac: 74, sho: 74, pas: 83, dri: 82, def: 70, phy: 80 },
  },
  {
    id: 'de_jong', name: 'Frenkie De Jong', shortName: 'FDJ', country: 'Netherlands', countryCode: 'NED',
    club: 'Barcelona', position: 'MID', rating: 86, price: 8.0, form: 7.2,
    stats: { pac: 76, sho: 72, pas: 86, dri: 84, def: 70, phy: 78 },
  },
  {
    id: 'gakpo', name: 'Gakpo', shortName: 'GAK', country: 'Netherlands', countryCode: 'NED',
    club: 'Liverpool', position: 'MID', rating: 84, price: 8.0, form: 8.0,
    stats: { pac: 84, sho: 82, pas: 76, dri: 82, def: 42, phy: 76 },
  },
  {
    id: 'valverde', name: 'Valverde', shortName: 'VAL', country: 'Uruguay', countryCode: 'URU',
    club: 'Real Madrid', position: 'MID', rating: 87, price: 9.0, form: 8.5,
    stats: { pac: 84, sho: 78, pas: 80, dri: 82, def: 76, phy: 88 },
  },
  {
    id: 'vitinha', name: 'Vitinha', shortName: 'VIT', country: 'Portugal', countryCode: 'POR',
    club: 'PSG', position: 'MID', rating: 84, price: 7.0, form: 7.2,
    stats: { pac: 78, sho: 72, pas: 84, dri: 84, def: 62, phy: 68 },
  },
  {
    id: 'joao_felix', name: 'João Félix', shortName: 'JFX', country: 'Portugal', countryCode: 'POR',
    club: 'Chelsea', position: 'MID', rating: 84, price: 7.5, form: 6.8,
    stats: { pac: 82, sho: 82, pas: 78, dri: 87, def: 40, phy: 68 },
  },
  {
    id: 'camavinga', name: 'Camavinga', shortName: 'CAM', country: 'France', countryCode: 'FRA',
    club: 'Real Madrid', position: 'MID', rating: 86, price: 7.5, form: 7.0,
    stats: { pac: 82, sho: 70, pas: 80, dri: 84, def: 76, phy: 80 },
  },
  {
    id: 'tchouameni', name: 'Tchouaméni', shortName: 'TCH', country: 'France', countryCode: 'FRA',
    club: 'Real Madrid', position: 'MID', rating: 85, price: 7.0, form: 6.5,
    stats: { pac: 75, sho: 68, pas: 77, dri: 75, def: 85, phy: 86 },
  },
  {
    id: 'kimmich', name: 'Kimmich', shortName: 'KIM', country: 'Germany', countryCode: 'GER',
    club: 'Bayern', position: 'MID', rating: 87, price: 8.5, form: 8.0,
    stats: { pac: 72, sho: 74, pas: 88, dri: 80, def: 84, phy: 80 },
  },
  {
    id: 'gundogan', name: 'Gündoğan', shortName: 'GUN', country: 'Germany', countryCode: 'GER',
    club: 'Barcelona', position: 'MID', rating: 86, price: 7.0, form: 6.8,
    stats: { pac: 70, sho: 80, pas: 87, dri: 82, def: 66, phy: 72 },
  },
  {
    id: 'barella', name: 'Barella', shortName: 'BAR', country: 'Italy', countryCode: 'ITA',
    club: 'Inter Milan', position: 'MID', rating: 86, price: 8.0, form: 8.0,
    stats: { pac: 78, sho: 76, pas: 82, dri: 82, def: 74, phy: 84 },
  },
  {
    id: 'amrabat', name: 'Amrabat', shortName: 'AMR', country: 'Morocco', countryCode: 'MAR',
    club: 'Fiorentina', position: 'MID', rating: 83, price: 6.5, form: 7.0,
    stats: { pac: 74, sho: 62, pas: 76, dri: 74, def: 82, phy: 84 },
  },
  {
    id: 'ziyech', name: 'Ziyech', shortName: 'ZIY', country: 'Morocco', countryCode: 'MAR',
    club: 'Galatasaray', position: 'MID', rating: 83, price: 6.5, form: 7.0,
    stats: { pac: 78, sho: 80, pas: 82, dri: 84, def: 36, phy: 68 },
  },
  {
    id: 'james', name: 'James Rodríguez', shortName: 'JAM', country: 'Colombia', countryCode: 'COL',
    club: 'Rayo Vallecano', position: 'MID', rating: 83, price: 7.0, form: 7.5,
    stats: { pac: 68, sho: 82, pas: 88, dri: 84, def: 40, phy: 68 },
  },
  {
    id: 'luis_diaz', name: 'Luis Díaz', shortName: 'LDI', country: 'Colombia', countryCode: 'COL',
    club: 'Liverpool', position: 'MID', rating: 85, price: 8.5, form: 8.5,
    stats: { pac: 91, sho: 80, pas: 74, dri: 86, def: 36, phy: 72 },
  },
  {
    id: 'mitoma', name: 'Mitoma', shortName: 'MIT', country: 'Japan', countryCode: 'JPN',
    club: 'Brighton', position: 'MID', rating: 83, price: 7.5, form: 7.8,
    stats: { pac: 90, sho: 78, pas: 76, dri: 86, def: 38, phy: 68 },
  },
  {
    id: 'mckennie', name: 'McKennie', shortName: 'MCK', country: 'USA', countryCode: 'USA',
    club: 'Juventus', position: 'MID', rating: 82, price: 6.5, form: 7.0,
    stats: { pac: 78, sho: 74, pas: 76, dri: 76, def: 72, phy: 82 },
  },
  {
    id: 'reyna', name: 'Gio Reyna', shortName: 'REY', country: 'USA', countryCode: 'USA',
    club: 'Nottm Forest', position: 'MID', rating: 82, price: 7.0, form: 7.5,
    stats: { pac: 80, sho: 78, pas: 80, dri: 84, def: 42, phy: 66 },
  },

  // ════════════════════ FWD ════════════════════
  {
    id: 'mbappe', name: 'Mbappé', shortName: 'MBP', country: 'France', countryCode: 'FRA',
    club: 'Real Madrid', position: 'FWD', rating: 95, price: 13.5, form: 9.5,
    stats: { pac: 97, sho: 91, pas: 80, dri: 92, def: 36, phy: 78 },
  },
  {
    id: 'messi', name: 'Messi', shortName: 'MES', country: 'Argentina', countryCode: 'ARG',
    club: 'Inter Miami', position: 'FWD', rating: 94, price: 13.0, form: 8.5,
    stats: { pac: 82, sho: 92, pas: 91, dri: 95, def: 34, phy: 65 },
  },
  {
    id: 'salah', name: 'Salah', shortName: 'SAL', country: 'Egypt', countryCode: 'EGY',
    club: 'Liverpool', position: 'FWD', rating: 90, price: 12.0, form: 9.5,
    stats: { pac: 91, sho: 90, pas: 80, dri: 90, def: 44, phy: 76 },
  },
  {
    id: 'kane', name: 'Kane', shortName: 'KAN', country: 'England', countryCode: 'ENG',
    club: 'Bayern', position: 'FWD', rating: 91, price: 11.0, form: 8.8,
    stats: { pac: 72, sho: 93, pas: 83, dri: 79, def: 48, phy: 84 },
  },
  {
    id: 'ronaldo', name: 'Ronaldo', shortName: 'CR7', country: 'Portugal', countryCode: 'POR',
    club: 'Al-Nassr', position: 'FWD', rating: 90, price: 10.0, form: 7.5,
    stats: { pac: 82, sho: 93, pas: 76, dri: 86, def: 34, phy: 84 },
  },
  {
    id: 'lewandowski', name: 'Lewandowski', shortName: 'LEW', country: 'Poland', countryCode: 'POL',
    club: 'Barcelona', position: 'FWD', rating: 90, price: 10.0, form: 8.0,
    stats: { pac: 78, sho: 91, pas: 78, dri: 82, def: 44, phy: 82 },
  },
  {
    id: 'darwin', name: 'Darwin Núñez', shortName: 'DAR', country: 'Uruguay', countryCode: 'URU',
    club: 'Liverpool', position: 'FWD', rating: 86, price: 9.5, form: 8.2,
    stats: { pac: 92, sho: 85, pas: 66, dri: 80, def: 36, phy: 84 },
  },
  {
    id: 'lautaro', name: 'Lautaro', shortName: 'LAU', country: 'Argentina', countryCode: 'ARG',
    club: 'Inter Milan', position: 'FWD', rating: 88, price: 9.5, form: 8.5,
    stats: { pac: 78, sho: 88, pas: 74, dri: 84, def: 44, phy: 82 },
  },
  {
    id: 'raphinha', name: 'Raphinha', shortName: 'RAP', country: 'Brazil', countryCode: 'BRA',
    club: 'Barcelona', position: 'FWD', rating: 87, price: 9.0, form: 8.8,
    stats: { pac: 88, sho: 84, pas: 79, dri: 87, def: 40, phy: 72 },
  },
  {
    id: 'osimhen', name: 'Osimhen', shortName: 'OSI', country: 'Nigeria', countryCode: 'NGA',
    club: 'Galatasaray', position: 'FWD', rating: 88, price: 9.5, form: 8.0,
    stats: { pac: 90, sho: 87, pas: 64, dri: 78, def: 38, phy: 88 },
  },
  {
    id: 'lukaku', name: 'Lukaku', shortName: 'LUK', country: 'Belgium', countryCode: 'BEL',
    club: 'Napoli', position: 'FWD', rating: 87, price: 8.5, form: 7.8,
    stats: { pac: 82, sho: 87, pas: 64, dri: 78, def: 42, phy: 94 },
  },
  {
    id: 'rodrygo', name: 'Rodrygo', shortName: 'RDR', country: 'Brazil', countryCode: 'BRA',
    club: 'Real Madrid', position: 'FWD', rating: 86, price: 9.0, form: 8.5,
    stats: { pac: 86, sho: 82, pas: 78, dri: 86, def: 40, phy: 68 },
  },
  {
    id: 'havertz', name: 'Havertz', shortName: 'HAV', country: 'Germany', countryCode: 'GER',
    club: 'Arsenal', position: 'FWD', rating: 84, price: 8.5, form: 8.2,
    stats: { pac: 78, sho: 82, pas: 78, dri: 80, def: 55, phy: 80 },
  },
  {
    id: 'alvarez', name: 'J. Álvarez', shortName: 'JUA', country: 'Argentina', countryCode: 'ARG',
    club: 'Atlético', position: 'FWD', rating: 85, price: 8.5, form: 8.5,
    stats: { pac: 82, sho: 83, pas: 74, dri: 82, def: 52, phy: 80 },
  },
  {
    id: 'olmo', name: 'Dani Olmo', shortName: 'OLM', country: 'Spain', countryCode: 'ESP',
    club: 'Barcelona', position: 'FWD', rating: 85, price: 8.5, form: 8.0,
    stats: { pac: 80, sho: 82, pas: 82, dri: 84, def: 52, phy: 72 },
  },
  {
    id: 'leao', name: 'Leão', shortName: 'LEO', country: 'Portugal', countryCode: 'POR',
    club: 'AC Milan', position: 'FWD', rating: 85, price: 8.5, form: 8.0,
    stats: { pac: 93, sho: 80, pas: 76, dri: 88, def: 38, phy: 74 },
  },
  {
    id: 'ramos_g', name: 'Gonçalo Ramos', shortName: 'GRA', country: 'Portugal', countryCode: 'POR',
    club: 'PSG', position: 'FWD', rating: 83, price: 7.5, form: 7.5,
    stats: { pac: 76, sho: 84, pas: 72, dri: 78, def: 40, phy: 80 },
  },
  {
    id: 'chiesa', name: 'Chiesa', shortName: 'CHI', country: 'Italy', countryCode: 'ITA',
    club: 'Liverpool', position: 'FWD', rating: 83, price: 7.5, form: 7.2,
    stats: { pac: 88, sho: 80, pas: 72, dri: 82, def: 44, phy: 72 },
  },
  {
    id: 'sane', name: 'Sané', shortName: 'SAN', country: 'Germany', countryCode: 'GER',
    club: 'Bayern', position: 'FWD', rating: 84, price: 8.0, form: 7.5,
    stats: { pac: 92, sho: 80, pas: 76, dri: 86, def: 38, phy: 72 },
  },
  {
    id: 'gnabry', name: 'Gnabry', shortName: 'GNA', country: 'Germany', countryCode: 'GER',
    club: 'Bayern', position: 'FWD', rating: 84, price: 7.5, form: 6.8,
    stats: { pac: 88, sho: 82, pas: 74, dri: 84, def: 40, phy: 72 },
  },
  {
    id: 'mane', name: 'Sadio Mané', shortName: 'MAN', country: 'Senegal', countryCode: 'SEN',
    club: 'Al-Nassr', position: 'FWD', rating: 85, price: 8.0, form: 7.0,
    stats: { pac: 90, sho: 86, pas: 76, dri: 86, def: 44, phy: 76 },
  },
  {
    id: 'en_nesyri', name: 'En-Nesyri', shortName: 'ENS', country: 'Morocco', countryCode: 'MAR',
    club: 'Fenerbahçe', position: 'FWD', rating: 83, price: 7.5, form: 7.5,
    stats: { pac: 80, sho: 82, pas: 62, dri: 74, def: 36, phy: 82 },
  },
  {
    id: 'duran', name: 'Durán', shortName: 'DUR', country: 'Colombia', countryCode: 'COL',
    club: 'Aston Villa', position: 'FWD', rating: 83, price: 7.5, form: 8.0,
    stats: { pac: 82, sho: 84, pas: 62, dri: 76, def: 36, phy: 84 },
  },
  {
    id: 'endrick', name: 'Endrick', shortName: 'END', country: 'Brazil', countryCode: 'BRA',
    club: 'Real Madrid', position: 'FWD', rating: 82, price: 7.5, form: 7.8,
    stats: { pac: 84, sho: 82, pas: 66, dri: 82, def: 34, phy: 78 },
  },
  {
    id: 'giminez', name: 'S. Giménez', shortName: 'SGM', country: 'Mexico', countryCode: 'MEX',
    club: 'AC Milan', position: 'FWD', rating: 82, price: 7.0, form: 7.5,
    stats: { pac: 78, sho: 82, pas: 64, dri: 76, def: 36, phy: 78 },
  },
  {
    id: 'morata', name: 'Morata', shortName: 'MOR', country: 'Spain', countryCode: 'ESP',
    club: 'AC Milan', position: 'FWD', rating: 83, price: 7.0, form: 7.0,
    stats: { pac: 80, sho: 80, pas: 72, dri: 78, def: 46, phy: 78 },
  },
  {
    id: 'weghorst', name: 'Weghorst', shortName: 'WEG', country: 'Netherlands', countryCode: 'NED',
    club: 'Hoffenheim', position: 'FWD', rating: 80, price: 5.5, form: 6.5,
    stats: { pac: 74, sho: 78, pas: 64, dri: 66, def: 40, phy: 86 },
  },
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

export const SQUAD_BUDGET = 100; // INJ
