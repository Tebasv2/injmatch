import type { Player } from '@/types/squad';

// TheSportsDB search names — used by PlayerAvatar to fetch actual images at runtime
export const SPORTSDB_SEARCH_NAME: Record<string, string> = {
  // GK
  courtois: 'Thibaut Courtois', alisson: 'Alisson Becker', ederson: 'Ederson',
  donnarumma: 'Gianluigi Donnarumma', oblak: 'Jan Oblak', neuer: 'Manuel Neuer',
  pickford: 'Jordan Pickford', maignan: 'Mike Maignan', diogo_costa: 'Diogo Costa',
  unai_simon: 'Unai Simon', emi_martinez: 'Emiliano Martinez', ochoa: 'Guillermo Ochoa',
  turner: 'Matt Turner', mendy: 'Edouard Mendy', bono: 'Bono',
  borjan: 'Milan Borjan', sommer: 'Yann Sommer', pentz: 'Patrick Pentz',
  olsen_k: 'Kasper Schmeichel', gordon_c: 'Craig Gordon', al_owais: 'Mohammed Al-Owais',
  beiranvand: 'Alireza Beiranvand', ryan_mat: 'Mat Ryan', milinkovic_vanja: 'Vanja Milinkovic-Savic',
  onana_a: 'Andre Onana', kim_sg: 'Kim Seung-gyu', suzuki_s: 'Zion Suzuki',
  pavlenka: 'Jiri Pavlenka', cakir: 'Ugurcan Cakir',
  // DEF
  vandijk: 'Virgil van Dijk', hakimi: 'Achraf Hakimi', marquinhos: 'Marquinhos',
  kim: 'Kim Min-jae', militao: 'Eder Militao', acerbi: 'Francesco Acerbi',
  rudiger: 'Antonio Rudiger', dias: 'Ruben Dias', gvardiol: 'Josko Gvardiol',
  theo: 'Theo Hernandez', cancelo: 'Joao Cancelo', kounde: 'Jules Kounde',
  trent: 'Trent Alexander-Arnold', cubarsi: 'Pau Cubarsi',
  upamecano: 'Dayot Upamecano', romero: 'Cristian Romero',
  lisandro: 'Lisandro Martinez', dumfries: 'Denzel Dumfries',
  araújo: 'Ronald Araujo', pulisic: 'Christian Pulisic',
  mendes: 'Nuno Mendes', sutalo: 'Josip Sutalo',
  faes: 'Wout Faes', timber: 'Jurrien Timber', frimpong: 'Jeremie Frimpong',
  calafiori: 'Riccardo Calafiori', di_lorenzo: 'Giovanni Di Lorenzo',
  bednarek: 'Jan Bednarek', frankowski: 'Przemyslaw Frankowski',
  cardona: 'Juan Cuadrado', cuesta: 'Jhon Lucumi',
  gimenez_jm: 'Jose Maria Gimenez',
  mazraoui: 'Noussair Mazraoui', dari: 'Nayef Aguerd', saiss: 'Romain Saiss',
  kouyate: 'Cheikhou Kouyate', diatta: 'Krepin Diatta',
  davies: 'Alphonso Davies', johnston: 'Alistair Johnston', buchanan: 'Tajon Buchanan',
  estupinian: 'Pervis Estupinan', hincapie: 'Piero Hincapie',
  akanji: 'Manuel Akanji', alaba: 'David Alaba', laimer: 'Konrad Laimer',
  maehle: 'Joakim Maehle', christensen_a: 'Andreas Christensen',
  al_bullayhi: 'Ali Al-Bulayhi', hajsafi: 'Ehsan Hajsafi',
  rowles: 'Kye Rowles', aidoo: 'Joseph Aidoo', lamptey: 'Tariq Lamptey',
  boly: 'Willy Boly', mandi: 'Aissa Mandi',
  kostic: 'Filip Kostic', coufal: 'Vladimir Coufal',
  robertson: 'Andrew Robertson', tierney: 'Kieran Tierney',
  walker: 'Kyle Walker', trippier: 'Kieran Trippier',
  acuna: 'Marcos Acuna', tagliafico: 'Nicolas Tagliafico',
  gabriel_mag: 'Gabriel Magalhaes',
  le_normand: 'Robin Le Normand', grimaldo: 'Alejandro Grimaldo',
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
  kovacic: 'Mateo Kovacic', ivanusec: 'Luka Ivanusec',
  tielemans: 'Youri Tielemans', doku: 'Jeremy Doku',
  reijnders: 'Tijjani Reijnders', frattesi: 'Davide Frattesi', tonali: 'Sandro Tonali',
  szymanski: 'Sebastian Szymanski', zielinski: 'Piotr Zielinski',
  ugarte: 'Manuel Ugarte', de_arrascaeta: 'Giorgian De Arrascaeta', pellistri: 'Facundo Pellistri',
  ounahi: 'Azzedine Ounahi', gueye: 'Idrissa Gueye',
  eustaquio: 'Stephen Eustaquio', sarmiento: 'Jeremy Sarmiento',
  xhaka: 'Granit Xhaka', shaqiri: 'Xherdan Shaqiri', vargas_r: 'Ruben Vargas',
  sabitzer: 'Marcel Sabitzer', baumgartner: 'Christoph Baumgartner',
  guler: 'Arda Guler', calhanoglu: 'Hakan Calhanoglu', akturkoglu: 'Kerem Akturkoglu', yildiz: 'Kenan Yildiz', muldur: 'Zeki Muldur',
  eriksen: 'Christian Eriksen', hojbjerg: 'Pierre-Emile Hojbjerg',
  al_dawsari: 'Salem Al-Dawsari', kanno: 'Mohamed Kanno',
  taremi: 'Mehdi Taremi', azmoun: 'Sardar Azmoun', jahanbakhsh: 'Alireza Jahanbakhsh',
  leckie: 'Mathew Leckie', irvine: 'Jackson Irvine', mcgree: 'Riley McGree',
  kudus: 'Mohammed Kudus', semenyo: 'Antoine Semenyo', ayew_j: 'Jordan Ayew',
  anguissa: 'Andre-Frank Zambo Anguissa', toko_ekambi: 'Karl Toko Ekambi',
  kessie: 'Franck Kessie', fofana_o: 'Odilon Fofana', konate_y: 'Youssouf Konate',
  mahrez: 'Riyad Mahrez', benrahma: 'Said Benrahma', aouar: 'Houssem Aouar',
  vlahovic: 'Dusan Vlahovic', tadic: 'Dusan Tadic',
  soucek: 'Tomas Soucek', hlozek: 'Adam Hlozek',
  mctominay: 'Scott McTominay', adams_c: 'Che Adams',
  minamino: 'Takumi Minamino', doan: 'Ritsu Doan', endo_w: 'Wataru Endo', furuhashi: 'Kyogo Furuhashi',
  lee_kangin: 'Lee Kang-in', hwang_hc: 'Hwang Hee-chan', hwang_ib: 'Hwang In-beom', cho_gs: 'Cho Gue-sung',
  weah: 'Timothy Weah', ferreira_j: 'Jesus Ferreira', adams_t: 'Tyler Adams',
  antuna: 'Uriel Antuna', henry_martin: 'Henry Martin', orbelin: 'Orbelin Pineda',
  paredes: 'Leandro Paredes',
  paqueta: 'Lucas Paqueta', savinho: 'Savinho',
  otavio: 'Otavio', william_carvalho: 'William Carvalho',
  coman: 'Kingsley Coman', guendouzi: 'Matteo Guendouzi',
  zubimendi: 'Martin Zubimendi',
  goretzka: 'Leon Goretzka', muller: 'Thomas Muller',
  mainoo: 'Kobbie Mainoo', gordon_a: 'Anthony Gordon',
  herrera_y: 'Yangel Herrera', soteldo: 'Yeferson Soteldo',
  // FWD
  mbappe: 'Kylian Mbappe', messi: 'Lionel Messi', salah: 'Mohamed Salah',
  ronaldo: 'Cristiano Ronaldo', kane: 'Harry Kane',
  lewandowski: 'Robert Lewandowski', lautaro: 'Lautaro Martinez',
  osimhen: 'Victor Osimhen', raphinha: 'Raphinha', lukaku: 'Romelu Lukaku',
  havertz: 'Kai Havertz', alvarez: 'Julian Alvarez',
  darwin: 'Darwin Nunez', rodrygo: 'Rodrygo',
  endrick: 'Endrick', mane: 'Sadio Mane', en_nesyri: 'Youssef En-Nesyri',
  olmo: 'Dani Olmo', chiesa: 'Federico Chiesa', gnabry: 'Serge Gnabry',
  sane: 'Leroy Sane', leao: 'Rafael Leao', ramos_g: 'Goncalo Ramos',
  duran: 'Jhon Duran', morata: 'Alvaro Morata',
  weghorst: 'Wout Weghorst', giminez: 'Santiago Gimenez',
  kramaric: 'Andrej Kramaric', budimir: 'Ante Budimir',
  openda: 'Lois Openda', depay: 'Memphis Depay',
  retegui: 'Mateo Retegui', raspadori: 'Giacomo Raspadori',
  milik: 'Arkadiusz Milik', larin: 'Cyle Larin',
  david: 'Jonathan David', valencia_e: 'Enner Valencia',
  embolo: 'Breel Embolo', arnautovic: 'Marko Arnautovic',
  dolberg: 'Kasper Dolberg', wind: 'Jonas Wind',
  al_shehri: 'Firas Al-Buraikan', schick: 'Patrik Schick',
  kolo_muani: 'Randal Kolo Muani', martinelli: 'Gabriel Martinelli',
  trincao: 'Francisco Trincao', fullkrug: 'Niclas Fullkrug',
  rashford: 'Marcus Rashford', aboubakar: 'Vincent Aboubakar', choupo: 'Eric Maxim Choupo-Moting',
  haller: 'Sebastien Haller', slimani: 'Islam Slimani',
  mitrovic_a: 'Aleksandar Mitrovic', ueda: 'Ayase Ueda',
  n_jackson: 'Nicolas Jackson', rondon: 'Salomon Rondon', josef_martinez: 'Josef Martinez',
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

  // ════════════════════ CROATIA ════════════════════
  { id: 'kovacic', name: 'Kovačić', shortName: 'KOV', country: 'Croatia', countryCode: 'CRO', club: 'Man City', position: 'MID', rating: 85, price: 7.5, form: 7.5, stats: { pac: 76, sho: 70, pas: 84, dri: 84, def: 72, phy: 74 } },
  { id: 'kramaric', name: 'Kramarić', shortName: 'KRA', country: 'Croatia', countryCode: 'CRO', club: 'Hoffenheim', position: 'FWD', rating: 83, price: 7.0, form: 7.2, stats: { pac: 74, sho: 83, pas: 74, dri: 80, def: 42, phy: 72 } },
  { id: 'ivanusec', name: 'Ivanušec', shortName: 'IVA', country: 'Croatia', countryCode: 'CRO', club: 'Lazio', position: 'MID', rating: 80, price: 6.0, form: 6.8, stats: { pac: 76, sho: 74, pas: 78, dri: 80, def: 44, phy: 66 } },
  { id: 'budimir', name: 'Budimir', shortName: 'BUD', country: 'Croatia', countryCode: 'CRO', club: 'Osasuna', position: 'FWD', rating: 79, price: 5.5, form: 6.5, stats: { pac: 68, sho: 78, pas: 62, dri: 68, def: 38, phy: 84 } },
  { id: 'sutalo', name: 'Šutalo', shortName: 'SUT', country: 'Croatia', countryCode: 'CRO', club: 'Ajax', position: 'DEF', rating: 79, price: 5.0, form: 6.2, stats: { pac: 76, sho: 44, pas: 62, dri: 62, def: 79, phy: 80 } },

  // ════════════════════ BELGIUM ════════════════════
  { id: 'tielemans', name: 'Tielemans', shortName: 'TIE', country: 'Belgium', countryCode: 'BEL', club: 'Aston Villa', position: 'MID', rating: 84, price: 7.5, form: 7.5, stats: { pac: 72, sho: 76, pas: 84, dri: 80, def: 70, phy: 76 } },
  { id: 'doku', name: 'Doku', shortName: 'DOK', country: 'Belgium', countryCode: 'BEL', club: 'Man City', position: 'MID', rating: 83, price: 8.5, form: 8.0, stats: { pac: 96, sho: 74, pas: 72, dri: 90, def: 34, phy: 68 } },
  { id: 'openda', name: 'Openda', shortName: 'OPE', country: 'Belgium', countryCode: 'BEL', club: 'RB Leipzig', position: 'FWD', rating: 84, price: 8.0, form: 8.0, stats: { pac: 90, sho: 82, pas: 68, dri: 82, def: 38, phy: 76 } },
  { id: 'faes', name: 'Faes', shortName: 'FAE', country: 'Belgium', countryCode: 'BEL', club: 'Leicester', position: 'DEF', rating: 78, price: 4.5, form: 6.0, stats: { pac: 70, sho: 42, pas: 60, dri: 58, def: 78, phy: 82 } },

  // ════════════════════ NETHERLANDS ════════════════════
  { id: 'reijnders', name: 'Reijnders', shortName: 'REI', country: 'Netherlands', countryCode: 'NED', club: 'AC Milan', position: 'MID', rating: 84, price: 7.5, form: 7.8, stats: { pac: 76, sho: 74, pas: 82, dri: 80, def: 66, phy: 78 } },
  { id: 'frimpong', name: 'Frimpong', shortName: 'FRI', country: 'Netherlands', countryCode: 'NED', club: 'Leverkusen', position: 'DEF', rating: 83, price: 6.5, form: 7.5, stats: { pac: 93, sho: 64, pas: 72, dri: 82, def: 74, phy: 74 } },
  { id: 'timber', name: 'Timber', shortName: 'TIM', country: 'Netherlands', countryCode: 'NED', club: 'Arsenal', position: 'DEF', rating: 83, price: 6.0, form: 7.0, stats: { pac: 80, sho: 52, pas: 68, dri: 72, def: 83, phy: 80 } },
  { id: 'depay', name: 'Depay', shortName: 'DEP', country: 'Netherlands', countryCode: 'NED', club: 'Atlético', position: 'FWD', rating: 83, price: 7.5, form: 7.0, stats: { pac: 86, sho: 82, pas: 76, dri: 84, def: 36, phy: 74 } },

  // ════════════════════ ITALY ════════════════════
  { id: 'retegui', name: 'Retegui', shortName: 'RET', country: 'Italy', countryCode: 'ITA', club: 'Atalanta', position: 'FWD', rating: 83, price: 7.5, form: 8.0, stats: { pac: 74, sho: 84, pas: 66, dri: 74, def: 40, phy: 82 } },
  { id: 'calafiori', name: 'Calafiori', shortName: 'CAL', country: 'Italy', countryCode: 'ITA', club: 'Arsenal', position: 'DEF', rating: 82, price: 5.5, form: 7.2, stats: { pac: 76, sho: 56, pas: 72, dri: 72, def: 82, phy: 78 } },
  { id: 'frattesi', name: 'Frattesi', shortName: 'FRA', country: 'Italy', countryCode: 'ITA', club: 'Inter Milan', position: 'MID', rating: 82, price: 7.0, form: 7.5, stats: { pac: 76, sho: 76, pas: 76, dri: 76, def: 66, phy: 82 } },
  { id: 'tonali', name: 'Tonali', shortName: 'TON', country: 'Italy', countryCode: 'ITA', club: 'Newcastle', position: 'MID', rating: 84, price: 7.5, form: 7.5, stats: { pac: 72, sho: 72, pas: 80, dri: 80, def: 80, phy: 84 } },
  { id: 'raspadori', name: 'Raspadori', shortName: 'RAS', country: 'Italy', countryCode: 'ITA', club: 'Napoli', position: 'FWD', rating: 81, price: 6.5, form: 7.0, stats: { pac: 76, sho: 80, pas: 74, dri: 78, def: 44, phy: 68 } },
  { id: 'di_lorenzo', name: 'Di Lorenzo', shortName: 'DIL', country: 'Italy', countryCode: 'ITA', club: 'Napoli', position: 'DEF', rating: 82, price: 5.5, form: 7.0, stats: { pac: 78, sho: 58, pas: 70, dri: 70, def: 82, phy: 78 } },

  // ════════════════════ POLAND ════════════════════
  { id: 'szymanski', name: 'Szymański', shortName: 'SZY', country: 'Poland', countryCode: 'POL', club: 'Feyenoord', position: 'MID', rating: 81, price: 6.5, form: 7.2, stats: { pac: 74, sho: 76, pas: 78, dri: 78, def: 60, phy: 74 } },
  { id: 'zielinski', name: 'Zielinski', shortName: 'ZIE', country: 'Poland', countryCode: 'POL', club: 'Inter Milan', position: 'MID', rating: 83, price: 7.0, form: 7.0, stats: { pac: 72, sho: 78, pas: 86, dri: 82, def: 58, phy: 70 } },
  { id: 'bednarek', name: 'Bednarek', shortName: 'BED', country: 'Poland', countryCode: 'POL', club: 'Southampton', position: 'DEF', rating: 79, price: 4.5, form: 6.0, stats: { pac: 70, sho: 44, pas: 60, dri: 58, def: 79, phy: 82 } },
  { id: 'frankowski', name: 'Frankowski', shortName: 'FRK', country: 'Poland', countryCode: 'POL', club: 'Lens', position: 'DEF', rating: 78, price: 5.0, form: 6.5, stats: { pac: 82, sho: 56, pas: 68, dri: 70, def: 72, phy: 70 } },
  { id: 'milik', name: 'Milik', shortName: 'MIK', country: 'Poland', countryCode: 'POL', club: 'Juventus', position: 'FWD', rating: 81, price: 6.5, form: 6.5, stats: { pac: 72, sho: 82, pas: 64, dri: 74, def: 36, phy: 80 } },

  // ════════════════════ COLOMBIA ════════════════════
  { id: 'cardona', name: 'J. Arias', shortName: 'JAR', country: 'Colombia', countryCode: 'COL', club: 'Fluminense', position: 'DEF', rating: 80, price: 5.5, form: 7.0, stats: { pac: 80, sho: 58, pas: 68, dri: 72, def: 76, phy: 74 } },
  { id: 'cuesta', name: 'Lucumí', shortName: 'LUC', country: 'Colombia', countryCode: 'COL', club: 'Bologna', position: 'DEF', rating: 79, price: 5.0, form: 6.5, stats: { pac: 76, sho: 46, pas: 62, dri: 62, def: 79, phy: 84 } },

  // ════════════════════ URUGUAY ════════════════════
  { id: 'ugarte', name: 'Ugarte', shortName: 'UGA', country: 'Uruguay', countryCode: 'URU', club: 'Man Utd', position: 'MID', rating: 82, price: 6.5, form: 7.0, stats: { pac: 74, sho: 62, pas: 76, dri: 74, def: 82, phy: 86 } },
  { id: 'de_arrascaeta', name: 'De Arrascaeta', shortName: 'ARR', country: 'Uruguay', countryCode: 'URU', club: 'Flamengo', position: 'MID', rating: 83, price: 7.0, form: 7.5, stats: { pac: 76, sho: 78, pas: 82, dri: 84, def: 48, phy: 68 } },
  { id: 'pellistri', name: 'Pellistri', shortName: 'PEL', country: 'Uruguay', countryCode: 'URU', club: 'Man Utd', position: 'MID', rating: 78, price: 5.5, form: 6.5, stats: { pac: 84, sho: 70, pas: 68, dri: 78, def: 40, phy: 66 } },
  { id: 'gimenez_jm', name: 'J.M. Giménez', shortName: 'JMG', country: 'Uruguay', countryCode: 'URU', club: 'Atlético', position: 'DEF', rating: 83, price: 5.5, form: 6.8, stats: { pac: 74, sho: 48, pas: 64, dri: 64, def: 83, phy: 86 } },

  // ════════════════════ MOROCCO ════════════════════
  { id: 'mazraoui', name: 'Mazraoui', shortName: 'MAZ', country: 'Morocco', countryCode: 'MAR', club: 'Man Utd', position: 'DEF', rating: 82, price: 5.5, form: 7.0, stats: { pac: 80, sho: 58, pas: 70, dri: 74, def: 78, phy: 74 } },
  { id: 'ounahi', name: 'Ounahi', shortName: 'OUN', country: 'Morocco', countryCode: 'MAR', club: 'Marseille', position: 'MID', rating: 80, price: 6.0, form: 7.0, stats: { pac: 78, sho: 66, pas: 78, dri: 80, def: 60, phy: 72 } },
  { id: 'dari', name: 'Aguerd', shortName: 'AGU', country: 'Morocco', countryCode: 'MAR', club: 'West Ham', position: 'DEF', rating: 81, price: 5.0, form: 6.5, stats: { pac: 74, sho: 48, pas: 64, dri: 62, def: 81, phy: 82 } },

  // ════════════════════ SENEGAL ════════════════════
  { id: 'gueye', name: 'Gueye', shortName: 'GUE', country: 'Senegal', countryCode: 'SEN', club: 'Everton', position: 'MID', rating: 82, price: 6.0, form: 6.8, stats: { pac: 76, sho: 62, pas: 72, dri: 72, def: 82, phy: 86 } },
  { id: 'diatta', name: 'Diatta', shortName: 'DIA', country: 'Senegal', countryCode: 'SEN', club: 'Monaco', position: 'MID', rating: 80, price: 6.0, form: 6.8, stats: { pac: 88, sho: 72, pas: 68, dri: 80, def: 40, phy: 68 } },
  { id: 'n_jackson', name: 'N. Jackson', shortName: 'NJA', country: 'Senegal', countryCode: 'SEN', club: 'Chelsea', position: 'FWD', rating: 82, price: 7.5, form: 7.5, stats: { pac: 84, sho: 80, pas: 64, dri: 78, def: 38, phy: 78 } },

  // ════════════════════ CANADA ════════════════════
  { id: 'borjan', name: 'Borjan', shortName: 'BOR', country: 'Canada', countryCode: 'CAN', club: 'Red Star', position: 'GK', rating: 78, price: 4.0, form: 6.0, stats: { pac: 50, sho: 12, pas: 54, dri: 42, def: 78, phy: 80 } },
  { id: 'davies', name: 'Davies', shortName: 'DAV', country: 'Canada', countryCode: 'CAN', club: 'Bayern', position: 'DEF', rating: 86, price: 7.5, form: 8.0, stats: { pac: 96, sho: 66, pas: 74, dri: 84, def: 76, phy: 76 } },
  { id: 'johnston', name: 'Johnston', shortName: 'JOH', country: 'Canada', countryCode: 'CAN', club: 'Celtic', position: 'DEF', rating: 78, price: 5.0, form: 6.5, stats: { pac: 80, sho: 52, pas: 66, dri: 68, def: 74, phy: 70 } },
  { id: 'eustaquio', name: 'Eustáquio', shortName: 'EUS', country: 'Canada', countryCode: 'CAN', club: 'Porto', position: 'MID', rating: 82, price: 6.5, form: 7.2, stats: { pac: 74, sho: 70, pas: 80, dri: 76, def: 68, phy: 76 } },
  { id: 'buchanan', name: 'Buchanan', shortName: 'BUC', country: 'Canada', countryCode: 'CAN', club: 'Inter Milan', position: 'MID', rating: 79, price: 6.0, form: 7.0, stats: { pac: 88, sho: 68, pas: 70, dri: 78, def: 42, phy: 68 } },
  { id: 'david', name: 'J. David', shortName: 'JDA', country: 'Canada', countryCode: 'CAN', club: 'Lille', position: 'FWD', rating: 84, price: 8.5, form: 8.5, stats: { pac: 84, sho: 85, pas: 70, dri: 82, def: 36, phy: 72 } },
  { id: 'larin', name: 'Larin', shortName: 'LAR', country: 'Canada', countryCode: 'CAN', club: 'Club Brugge', position: 'FWD', rating: 78, price: 5.5, form: 6.5, stats: { pac: 78, sho: 78, pas: 58, dri: 72, def: 34, phy: 78 } },

  // ════════════════════ ECUADOR ════════════════════
  { id: 'hincapie', name: 'Hincapié', shortName: 'HIN', country: 'Ecuador', countryCode: 'ECU', club: 'Leverkusen', position: 'DEF', rating: 82, price: 5.5, form: 7.0, stats: { pac: 82, sho: 48, pas: 68, dri: 70, def: 82, phy: 80 } },
  { id: 'estupinian', name: 'Estupiñán', shortName: 'EST', country: 'Ecuador', countryCode: 'ECU', club: 'Brighton', position: 'DEF', rating: 82, price: 5.5, form: 7.0, stats: { pac: 84, sho: 56, pas: 70, dri: 72, def: 78, phy: 74 } },
  { id: 'caicedo', name: 'Caicedo', shortName: 'CAI', country: 'Ecuador', countryCode: 'ECU', club: 'Chelsea', position: 'MID', rating: 85, price: 8.0, form: 8.2, stats: { pac: 78, sho: 70, pas: 80, dri: 80, def: 84, phy: 86 } },
  { id: 'sarmiento', name: 'Sarmiento', shortName: 'SAR', country: 'Ecuador', countryCode: 'ECU', club: 'Brighton', position: 'MID', rating: 78, price: 5.5, form: 6.5, stats: { pac: 78, sho: 68, pas: 74, dri: 76, def: 42, phy: 66 } },
  { id: 'valencia_e', name: 'E. Valencia', shortName: 'ECV', country: 'Ecuador', countryCode: 'ECU', club: 'LDU Quito', position: 'FWD', rating: 80, price: 6.5, form: 7.0, stats: { pac: 78, sho: 80, pas: 62, dri: 74, def: 38, phy: 84 } },

  // ════════════════════ SWITZERLAND ════════════════════
  { id: 'sommer', name: 'Sommer', shortName: 'SOM', country: 'Switzerland', countryCode: 'SUI', club: 'Inter Milan', position: 'GK', rating: 85, price: 5.0, form: 7.0, stats: { pac: 52, sho: 14, pas: 62, dri: 46, def: 85, phy: 78 } },
  { id: 'akanji', name: 'Akanji', shortName: 'AKA', country: 'Switzerland', countryCode: 'SUI', club: 'Man City', position: 'DEF', rating: 84, price: 5.5, form: 7.0, stats: { pac: 78, sho: 48, pas: 68, dri: 66, def: 84, phy: 84 } },
  { id: 'xhaka', name: 'Xhaka', shortName: 'XHA', country: 'Switzerland', countryCode: 'SUI', club: 'Leverkusen', position: 'MID', rating: 84, price: 7.0, form: 7.5, stats: { pac: 68, sho: 72, pas: 84, dri: 74, def: 80, phy: 82 } },
  { id: 'shaqiri', name: 'Shaqiri', shortName: 'SHA', country: 'Switzerland', countryCode: 'SUI', club: 'Chicago Fire', position: 'MID', rating: 81, price: 6.0, form: 6.5, stats: { pac: 78, sho: 78, pas: 78, dri: 80, def: 44, phy: 68 } },
  { id: 'embolo', name: 'Embolo', shortName: 'EMB', country: 'Switzerland', countryCode: 'SUI', club: 'Monaco', position: 'FWD', rating: 80, price: 6.5, form: 6.8, stats: { pac: 82, sho: 78, pas: 66, dri: 78, def: 40, phy: 82 } },
  { id: 'vargas_r', name: 'R. Vargas', shortName: 'VAR', country: 'Switzerland', countryCode: 'SUI', club: 'Augsburg', position: 'FWD', rating: 78, price: 5.5, form: 6.5, stats: { pac: 80, sho: 74, pas: 68, dri: 76, def: 36, phy: 68 } },

  // ════════════════════ AUSTRIA ════════════════════
  { id: 'pentz', name: 'Pentz', shortName: 'PNZ', country: 'Austria', countryCode: 'AUT', club: 'Brighton', position: 'GK', rating: 78, price: 4.0, form: 6.2, stats: { pac: 52, sho: 12, pas: 54, dri: 44, def: 78, phy: 80 } },
  { id: 'alaba', name: 'Alaba', shortName: 'ALA', country: 'Austria', countryCode: 'AUT', club: 'Real Madrid', position: 'DEF', rating: 86, price: 6.0, form: 6.0, stats: { pac: 76, sho: 64, pas: 76, dri: 76, def: 86, phy: 78 } },
  { id: 'sabitzer', name: 'Sabitzer', shortName: 'SAB', country: 'Austria', countryCode: 'AUT', club: 'Man Utd', position: 'MID', rating: 82, price: 6.5, form: 7.0, stats: { pac: 74, sho: 76, pas: 78, dri: 78, def: 68, phy: 76 } },
  { id: 'laimer', name: 'Laimer', shortName: 'LAI', country: 'Austria', countryCode: 'AUT', club: 'Bayern', position: 'MID', rating: 82, price: 6.5, form: 7.0, stats: { pac: 80, sho: 68, pas: 74, dri: 76, def: 76, phy: 84 } },
  { id: 'baumgartner', name: 'Baumgartner', shortName: 'BAU', country: 'Austria', countryCode: 'AUT', club: 'Hoffenheim', position: 'MID', rating: 80, price: 6.0, form: 6.8, stats: { pac: 74, sho: 74, pas: 78, dri: 78, def: 52, phy: 70 } },
  { id: 'arnautovic', name: 'Arnautović', shortName: 'ARN', country: 'Austria', countryCode: 'AUT', club: 'Man Utd', position: 'FWD', rating: 80, price: 6.0, form: 6.5, stats: { pac: 72, sho: 78, pas: 68, dri: 74, def: 38, phy: 80 } },

  // ════════════════════ TURKEY ════════════════════
  { id: 'cakir', name: 'Çakır', shortName: 'CAK', country: 'Turkey', countryCode: 'TUR', club: 'Trabzonspor', position: 'GK', rating: 82, price: 4.5, form: 6.5, stats: { pac: 52, sho: 13, pas: 58, dri: 44, def: 82, phy: 80 } },
  { id: 'muldur', name: 'Müldür', shortName: 'MUL', country: 'Turkey', countryCode: 'TUR', club: 'Sevilla', position: 'DEF', rating: 79, price: 5.0, form: 6.5, stats: { pac: 82, sho: 54, pas: 64, dri: 68, def: 74, phy: 72 } },
  { id: 'calhanoglu', name: 'Çalhanoğlu', shortName: 'CAL', country: 'Turkey', countryCode: 'TUR', club: 'Inter Milan', position: 'MID', rating: 86, price: 8.0, form: 8.0, stats: { pac: 72, sho: 80, pas: 86, dri: 82, def: 72, phy: 74 } },
  { id: 'guler', name: 'Güler', shortName: 'GUL', country: 'Turkey', countryCode: 'TUR', club: 'Real Madrid', position: 'MID', rating: 84, price: 8.5, form: 8.5, stats: { pac: 78, sho: 82, pas: 82, dri: 86, def: 42, phy: 66 } },
  { id: 'yildiz', name: 'Yıldız', shortName: 'YIL', country: 'Turkey', countryCode: 'TUR', club: 'Juventus', position: 'MID', rating: 82, price: 7.5, form: 7.8, stats: { pac: 80, sho: 78, pas: 78, dri: 84, def: 38, phy: 66 } },
  { id: 'akturkoglu', name: 'Aktürkoğlu', shortName: 'AKT', country: 'Turkey', countryCode: 'TUR', club: 'Galatasaray', position: 'FWD', rating: 80, price: 7.0, form: 7.5, stats: { pac: 86, sho: 76, pas: 68, dri: 82, def: 36, phy: 68 } },

  // ════════════════════ DENMARK ════════════════════
  { id: 'olsen_k', name: 'K. Schmeichel', shortName: 'KSC', country: 'Denmark', countryCode: 'DEN', club: 'Anderlecht', position: 'GK', rating: 82, price: 4.5, form: 6.0, stats: { pac: 50, sho: 13, pas: 60, dri: 44, def: 82, phy: 82 } },
  { id: 'christensen_a', name: 'A. Christensen', shortName: 'ACH', country: 'Denmark', countryCode: 'DEN', club: 'Barcelona', position: 'DEF', rating: 83, price: 5.5, form: 6.8, stats: { pac: 72, sho: 46, pas: 72, dri: 66, def: 83, phy: 80 } },
  { id: 'maehle', name: 'Maehle', shortName: 'MAE', country: 'Denmark', countryCode: 'DEN', club: 'Wolfsburg', position: 'DEF', rating: 79, price: 5.0, form: 6.5, stats: { pac: 82, sho: 54, pas: 66, dri: 68, def: 74, phy: 72 } },
  { id: 'eriksen', name: 'Eriksen', shortName: 'ERI', country: 'Denmark', countryCode: 'DEN', club: 'Man Utd', position: 'MID', rating: 84, price: 7.5, form: 7.0, stats: { pac: 70, sho: 78, pas: 88, dri: 80, def: 56, phy: 68 } },
  { id: 'hojbjerg', name: 'Højbjerg', shortName: 'HOJ', country: 'Denmark', countryCode: 'DEN', club: 'PSG', position: 'MID', rating: 82, price: 6.5, form: 7.0, stats: { pac: 72, sho: 68, pas: 80, dri: 72, def: 80, phy: 82 } },
  { id: 'wind', name: 'Wind', shortName: 'WIN', country: 'Denmark', countryCode: 'DEN', club: 'Wolfsburg', position: 'FWD', rating: 78, price: 5.5, form: 6.5, stats: { pac: 78, sho: 76, pas: 62, dri: 72, def: 36, phy: 78 } },
  { id: 'dolberg', name: 'Dolberg', shortName: 'DOL', country: 'Denmark', countryCode: 'DEN', club: 'Anderlecht', position: 'FWD', rating: 79, price: 5.5, form: 6.5, stats: { pac: 72, sho: 78, pas: 62, dri: 70, def: 36, phy: 76 } },

  // ════════════════════ SAUDI ARABIA ════════════════════
  { id: 'al_owais', name: 'Al-Owais', shortName: 'AOW', country: 'Saudi Arabia', countryCode: 'KSA', club: 'Al-Hilal', position: 'GK', rating: 78, price: 4.0, form: 6.0, stats: { pac: 50, sho: 12, pas: 54, dri: 42, def: 78, phy: 78 } },
  { id: 'al_bullayhi', name: 'Al-Bulayhi', shortName: 'ABU', country: 'Saudi Arabia', countryCode: 'KSA', club: 'Al-Hilal', position: 'DEF', rating: 76, price: 4.0, form: 5.8, stats: { pac: 72, sho: 42, pas: 58, dri: 56, def: 76, phy: 78 } },
  { id: 'kanno', name: 'Kanno', shortName: 'KAN', country: 'Saudi Arabia', countryCode: 'KSA', club: 'Al-Shabab', position: 'MID', rating: 77, price: 4.5, form: 6.0, stats: { pac: 68, sho: 64, pas: 76, dri: 70, def: 66, phy: 72 } },
  { id: 'al_dawsari', name: 'Al-Dawsari', shortName: 'ALD', country: 'Saudi Arabia', countryCode: 'KSA', club: 'Al-Hilal', position: 'MID', rating: 80, price: 6.0, form: 7.0, stats: { pac: 80, sho: 74, pas: 72, dri: 78, def: 38, phy: 68 } },
  { id: 'al_shehri', name: 'Al-Buraikan', shortName: 'ALB', country: 'Saudi Arabia', countryCode: 'KSA', club: 'Al-Fateh', position: 'FWD', rating: 78, price: 5.5, form: 6.5, stats: { pac: 78, sho: 76, pas: 60, dri: 72, def: 34, phy: 74 } },

  // ════════════════════ IRAN ════════════════════
  { id: 'beiranvand', name: 'Beiranvand', shortName: 'BEI', country: 'Iran', countryCode: 'IRN', club: 'Persepolis', position: 'GK', rating: 78, price: 4.0, form: 6.0, stats: { pac: 52, sho: 12, pas: 54, dri: 42, def: 78, phy: 82 } },
  { id: 'hajsafi', name: 'Hajsafi', shortName: 'HAJ', country: 'Iran', countryCode: 'IRN', club: 'Olympiacos', position: 'DEF', rating: 76, price: 4.0, form: 5.8, stats: { pac: 74, sho: 44, pas: 62, dri: 62, def: 72, phy: 72 } },
  { id: 'jahanbakhsh', name: 'Jahanbakhsh', shortName: 'JAH', country: 'Iran', countryCode: 'IRN', club: 'Feyenoord', position: 'MID', rating: 79, price: 5.5, form: 6.5, stats: { pac: 82, sho: 72, pas: 70, dri: 78, def: 40, phy: 68 } },
  { id: 'azmoun', name: 'Azmoun', shortName: 'AZM', country: 'Iran', countryCode: 'IRN', club: 'Bayer Leverkusen', position: 'FWD', rating: 82, price: 7.0, form: 7.0, stats: { pac: 80, sho: 82, pas: 68, dri: 78, def: 36, phy: 80 } },
  { id: 'taremi', name: 'Taremi', shortName: 'TAR', country: 'Iran', countryCode: 'IRN', club: 'Inter Milan', position: 'FWD', rating: 83, price: 7.5, form: 7.5, stats: { pac: 76, sho: 84, pas: 70, dri: 78, def: 40, phy: 80 } },

  // ════════════════════ AUSTRALIA ════════════════════
  { id: 'ryan_mat', name: 'Mat Ryan', shortName: 'MRY', country: 'Australia', countryCode: 'AUS', club: 'Real Sociedad', position: 'GK', rating: 80, price: 4.5, form: 6.5, stats: { pac: 50, sho: 12, pas: 60, dri: 44, def: 80, phy: 78 } },
  { id: 'rowles', name: 'Rowles', shortName: 'ROW', country: 'Australia', countryCode: 'AUS', club: 'Middlesbrough', position: 'DEF', rating: 76, price: 4.0, form: 6.0, stats: { pac: 72, sho: 42, pas: 60, dri: 58, def: 76, phy: 78 } },
  { id: 'irvine', name: 'Irvine', shortName: 'IRV', country: 'Australia', countryCode: 'AUS', club: 'Hull City', position: 'MID', rating: 78, price: 5.0, form: 6.5, stats: { pac: 72, sho: 68, pas: 72, dri: 70, def: 64, phy: 80 } },
  { id: 'mcgree', name: 'McGree', shortName: 'MCG', country: 'Australia', countryCode: 'AUS', club: 'Middlesbrough', position: 'MID', rating: 77, price: 5.0, form: 6.5, stats: { pac: 74, sho: 66, pas: 72, dri: 72, def: 60, phy: 74 } },
  { id: 'leckie', name: 'Leckie', shortName: 'LEC', country: 'Australia', countryCode: 'AUS', club: 'Melbourne City', position: 'FWD', rating: 77, price: 5.0, form: 6.2, stats: { pac: 84, sho: 72, pas: 62, dri: 74, def: 38, phy: 68 } },

  // ════════════════════ GHANA ════════════════════
  { id: 'kudus', name: 'Kudus', shortName: 'KUD', country: 'Ghana', countryCode: 'GHA', club: 'West Ham', position: 'MID', rating: 83, price: 8.0, form: 8.2, stats: { pac: 84, sho: 80, pas: 72, dri: 84, def: 46, phy: 76 } },
  { id: 'semenyo', name: 'Semenyo', shortName: 'SEM', country: 'Ghana', countryCode: 'GHA', club: 'Bournemouth', position: 'FWD', rating: 79, price: 6.5, form: 7.2, stats: { pac: 88, sho: 74, pas: 64, dri: 80, def: 36, phy: 74 } },
  { id: 'ayew_j', name: 'J. Ayew', shortName: 'JAY', country: 'Ghana', countryCode: 'GHA', club: 'Le Havre', position: 'FWD', rating: 78, price: 5.0, form: 6.2, stats: { pac: 76, sho: 74, pas: 68, dri: 74, def: 42, phy: 70 } },
  { id: 'lamptey', name: 'Lamptey', shortName: 'LAM', country: 'Ghana', countryCode: 'GHA', club: 'Brighton', position: 'DEF', rating: 78, price: 5.0, form: 6.5, stats: { pac: 90, sho: 56, pas: 64, dri: 72, def: 68, phy: 66 } },
  { id: 'aidoo', name: 'Aidoo', shortName: 'AID', country: 'Ghana', countryCode: 'GHA', club: 'Rennes', position: 'DEF', rating: 77, price: 4.5, form: 6.0, stats: { pac: 76, sho: 44, pas: 62, dri: 62, def: 77, phy: 80 } },

  // ════════════════════ CAMEROON ════════════════════
  { id: 'onana_a', name: 'A. Onana', shortName: 'AON', country: 'Cameroon', countryCode: 'CMR', club: 'Man Utd', position: 'GK', rating: 83, price: 5.0, form: 6.5, stats: { pac: 52, sho: 14, pas: 64, dri: 48, def: 83, phy: 82 } },
  { id: 'anguissa', name: 'Anguissa', shortName: 'ANG', country: 'Cameroon', countryCode: 'CMR', club: 'Napoli', position: 'MID', rating: 84, price: 7.5, form: 7.8, stats: { pac: 80, sho: 68, pas: 76, dri: 78, def: 80, phy: 88 } },
  { id: 'toko_ekambi', name: 'Toko Ekambi', shortName: 'TOK', country: 'Cameroon', countryCode: 'CMR', club: 'Al-Qadsiah', position: 'FWD', rating: 80, price: 6.0, form: 6.8, stats: { pac: 86, sho: 76, pas: 68, dri: 78, def: 36, phy: 72 } },
  { id: 'aboubakar', name: 'Aboubakar', shortName: 'ABO', country: 'Cameroon', countryCode: 'CMR', club: 'Beşiktaş', position: 'FWD', rating: 80, price: 6.5, form: 7.0, stats: { pac: 80, sho: 80, pas: 60, dri: 74, def: 36, phy: 84 } },
  { id: 'choupo', name: 'Choupo-Moting', shortName: 'CHO', country: 'Cameroon', countryCode: 'CMR', club: 'Stoke City', position: 'FWD', rating: 78, price: 5.0, form: 6.0, stats: { pac: 72, sho: 76, pas: 66, dri: 72, def: 38, phy: 80 } },

  // ════════════════════ IVORY COAST ════════════════════
  { id: 'haller', name: 'Haller', shortName: 'HAL', country: 'Ivory Coast', countryCode: 'CIV', club: 'Dortmund', position: 'FWD', rating: 82, price: 7.5, form: 7.5, stats: { pac: 76, sho: 82, pas: 62, dri: 72, def: 38, phy: 86 } },
  { id: 'kessie', name: 'Kessié', shortName: 'KES', country: 'Ivory Coast', countryCode: 'CIV', club: 'Al-Ahli', position: 'MID', rating: 83, price: 7.0, form: 7.0, stats: { pac: 76, sho: 74, pas: 76, dri: 76, def: 78, phy: 90 } },
  { id: 'fofana_o', name: 'O. Fofana', shortName: 'FOF', country: 'Ivory Coast', countryCode: 'CIV', club: 'Chelsea', position: 'MID', rating: 83, price: 7.0, form: 7.0, stats: { pac: 80, sho: 66, pas: 76, dri: 76, def: 80, phy: 88 } },
  { id: 'konate_y', name: 'Y. Konaté', shortName: 'YKO', country: 'Ivory Coast', countryCode: 'CIV', club: 'Eintracht Frankfurt', position: 'MID', rating: 79, price: 6.0, form: 7.0, stats: { pac: 80, sho: 72, pas: 70, dri: 76, def: 54, phy: 80 } },
  { id: 'boly', name: 'Boly', shortName: 'BOL', country: 'Ivory Coast', countryCode: 'CIV', club: 'Nottm Forest', position: 'DEF', rating: 79, price: 4.5, form: 6.2, stats: { pac: 68, sho: 44, pas: 58, dri: 58, def: 79, phy: 86 } },

  // ════════════════════ ALGERIA ════════════════════
  { id: 'mahrez', name: 'Mahrez', shortName: 'MAH', country: 'Algeria', countryCode: 'ALG', club: 'Al-Ahli', position: 'MID', rating: 85, price: 8.0, form: 7.5, stats: { pac: 80, sho: 82, pas: 80, dri: 88, def: 38, phy: 68 } },
  { id: 'benrahma', name: 'Benrahma', shortName: 'BNR', country: 'Algeria', countryCode: 'ALG', club: 'Lyon', position: 'MID', rating: 81, price: 7.0, form: 7.2, stats: { pac: 80, sho: 76, pas: 74, dri: 84, def: 36, phy: 68 } },
  { id: 'aouar', name: 'Aouar', shortName: 'AOU', country: 'Algeria', countryCode: 'ALG', club: 'Roma', position: 'MID', rating: 80, price: 6.5, form: 6.8, stats: { pac: 74, sho: 72, pas: 80, dri: 80, def: 52, phy: 68 } },
  { id: 'slimani', name: 'Slimani', shortName: 'SLI', country: 'Algeria', countryCode: 'ALG', club: 'Auxerre', position: 'FWD', rating: 78, price: 5.5, form: 6.5, stats: { pac: 72, sho: 78, pas: 62, dri: 70, def: 36, phy: 82 } },
  { id: 'mandi', name: 'Mandi', shortName: 'MAN', country: 'Algeria', countryCode: 'ALG', club: 'Villarreal', position: 'DEF', rating: 78, price: 4.5, form: 6.0, stats: { pac: 70, sho: 44, pas: 62, dri: 60, def: 78, phy: 80 } },

  // ════════════════════ SERBIA ════════════════════
  { id: 'milinkovic_vanja', name: 'V. Milinković', shortName: 'VMI', country: 'Serbia', countryCode: 'SRB', club: 'Torino', position: 'GK', rating: 82, price: 4.5, form: 6.5, stats: { pac: 52, sho: 13, pas: 58, dri: 44, def: 82, phy: 80 } },
  { id: 'kostic', name: 'Kostić', shortName: 'KOS', country: 'Serbia', countryCode: 'SRB', club: 'Juventus', position: 'DEF', rating: 81, price: 5.5, form: 6.8, stats: { pac: 80, sho: 66, pas: 72, dri: 74, def: 72, phy: 72 } },
  { id: 'tadic', name: 'Tadić', shortName: 'TAD', country: 'Serbia', countryCode: 'SRB', club: 'Fenerbahçe', position: 'MID', rating: 83, price: 7.5, form: 7.5, stats: { pac: 72, sho: 78, pas: 84, dri: 82, def: 48, phy: 68 } },
  { id: 'vlahovic', name: 'Vlahović', shortName: 'VLA', country: 'Serbia', countryCode: 'SRB', club: 'Juventus', position: 'FWD', rating: 85, price: 9.0, form: 8.0, stats: { pac: 80, sho: 88, pas: 66, dri: 78, def: 38, phy: 86 } },
  { id: 'mitrovic_a', name: 'Mitrović', shortName: 'MIT', country: 'Serbia', countryCode: 'SRB', club: 'Al-Hilal', position: 'FWD', rating: 84, price: 8.0, form: 7.5, stats: { pac: 70, sho: 87, pas: 60, dri: 68, def: 36, phy: 92 } },

  // ════════════════════ CZECH REPUBLIC ════════════════════
  { id: 'pavlenka', name: 'Pavlenka', shortName: 'PAV', country: 'Czech Republic', countryCode: 'CZE', club: 'Werder Bremen', position: 'GK', rating: 80, price: 4.5, form: 6.5, stats: { pac: 50, sho: 12, pas: 58, dri: 44, def: 80, phy: 78 } },
  { id: 'coufal', name: 'Coufal', shortName: 'COU', country: 'Czech Republic', countryCode: 'CZE', club: 'West Ham', position: 'DEF', rating: 79, price: 5.0, form: 6.5, stats: { pac: 78, sho: 52, pas: 62, dri: 64, def: 74, phy: 74 } },
  { id: 'soucek', name: 'Souček', shortName: 'SOU', country: 'Czech Republic', countryCode: 'CZE', club: 'West Ham', position: 'MID', rating: 82, price: 6.5, form: 7.0, stats: { pac: 68, sho: 74, pas: 74, dri: 70, def: 72, phy: 90 } },
  { id: 'schick', name: 'Schick', shortName: 'SCH', country: 'Czech Republic', countryCode: 'CZE', club: 'Leverkusen', position: 'FWD', rating: 82, price: 7.5, form: 7.0, stats: { pac: 76, sho: 84, pas: 68, dri: 76, def: 36, phy: 80 } },
  { id: 'hlozek', name: 'Hložek', shortName: 'HLO', country: 'Czech Republic', countryCode: 'CZE', club: 'Leverkusen', position: 'FWD', rating: 79, price: 6.0, form: 6.8, stats: { pac: 78, sho: 76, pas: 68, dri: 76, def: 36, phy: 72 } },

  // ════════════════════ SCOTLAND ════════════════════
  { id: 'gordon_c', name: 'C. Gordon', shortName: 'CGO', country: 'Scotland', countryCode: 'SCO', club: 'Hearts', position: 'GK', rating: 78, price: 4.0, form: 6.0, stats: { pac: 48, sho: 11, pas: 56, dri: 42, def: 78, phy: 76 } },
  { id: 'tierney', name: 'Tierney', shortName: 'TIR', country: 'Scotland', countryCode: 'SCO', club: 'Real Sociedad', position: 'DEF', rating: 80, price: 5.0, form: 6.5, stats: { pac: 80, sho: 52, pas: 68, dri: 68, def: 76, phy: 74 } },
  { id: 'robertson', name: 'Robertson', shortName: 'ROB', country: 'Scotland', countryCode: 'SCO', club: 'Liverpool', position: 'DEF', rating: 84, price: 6.0, form: 7.0, stats: { pac: 84, sho: 60, pas: 76, dri: 74, def: 78, phy: 76 } },
  { id: 'mctominay', name: 'McTominay', shortName: 'MCT', country: 'Scotland', countryCode: 'SCO', club: 'Napoli', position: 'MID', rating: 83, price: 7.5, form: 8.0, stats: { pac: 72, sho: 76, pas: 76, dri: 72, def: 74, phy: 86 } },
  { id: 'adams_c', name: 'Che Adams', shortName: 'CHA', country: 'Scotland', countryCode: 'SCO', club: 'Southampton', position: 'FWD', rating: 78, price: 5.5, form: 6.5, stats: { pac: 80, sho: 76, pas: 62, dri: 72, def: 38, phy: 74 } },

  // ════════════════════ JAPAN (extra) ════════════════════
  { id: 'suzuki_s', name: 'Z. Suzuki', shortName: 'ZSU', country: 'Japan', countryCode: 'JPN', club: 'Parma', position: 'GK', rating: 78, price: 4.0, form: 6.2, stats: { pac: 50, sho: 11, pas: 54, dri: 42, def: 78, phy: 76 } },
  { id: 'endo_w', name: 'W. Endo', shortName: 'WEN', country: 'Japan', countryCode: 'JPN', club: 'Liverpool', position: 'MID', rating: 82, price: 6.5, form: 7.0, stats: { pac: 70, sho: 62, pas: 78, dri: 72, def: 82, phy: 80 } },
  { id: 'doan', name: 'Doan', shortName: 'DOA', country: 'Japan', countryCode: 'JPN', club: 'Freiburg', position: 'MID', rating: 80, price: 6.0, form: 7.0, stats: { pac: 80, sho: 72, pas: 72, dri: 78, def: 44, phy: 68 } },
  { id: 'minamino', name: 'Minamino', shortName: 'MIN', country: 'Japan', countryCode: 'JPN', club: 'Monaco', position: 'MID', rating: 80, price: 6.5, form: 7.0, stats: { pac: 80, sho: 74, pas: 74, dri: 78, def: 46, phy: 68 } },
  { id: 'furuhashi', name: 'Furuhashi', shortName: 'FUR', country: 'Japan', countryCode: 'JPN', club: 'Celtic', position: 'FWD', rating: 80, price: 6.5, form: 7.2, stats: { pac: 82, sho: 78, pas: 68, dri: 78, def: 36, phy: 68 } },
  { id: 'ueda', name: 'Ueda', shortName: 'UED', country: 'Japan', countryCode: 'JPN', club: 'Feyenoord', position: 'FWD', rating: 79, price: 6.0, form: 6.8, stats: { pac: 74, sho: 78, pas: 62, dri: 70, def: 36, phy: 76 } },

  // ════════════════════ SOUTH KOREA (extra) ════════════════════
  { id: 'kim_sg', name: 'Kim Seung-gyu', shortName: 'KSG', country: 'South Korea', countryCode: 'KOR', club: 'Vissel Kobe', position: 'GK', rating: 78, price: 4.0, form: 6.0, stats: { pac: 50, sho: 12, pas: 54, dri: 42, def: 78, phy: 78 } },
  { id: 'lee_kangin', name: 'Lee Kang-in', shortName: 'LKI', country: 'South Korea', countryCode: 'KOR', club: 'PSG', position: 'MID', rating: 83, price: 7.5, form: 8.0, stats: { pac: 76, sho: 78, pas: 82, dri: 84, def: 44, phy: 66 } },
  { id: 'hwang_hc', name: 'Hwang Hee-chan', shortName: 'HHC', country: 'South Korea', countryCode: 'KOR', club: 'Wolves', position: 'FWD', rating: 80, price: 6.5, form: 7.2, stats: { pac: 84, sho: 78, pas: 66, dri: 78, def: 40, phy: 74 } },
  { id: 'hwang_ib', name: 'Hwang In-beom', shortName: 'HIB', country: 'South Korea', countryCode: 'KOR', club: 'Feyenoord', position: 'MID', rating: 79, price: 5.5, form: 6.8, stats: { pac: 74, sho: 68, pas: 76, dri: 72, def: 62, phy: 74 } },
  { id: 'cho_gs', name: 'Cho Gue-sung', shortName: 'CGS', country: 'South Korea', countryCode: 'KOR', club: 'Freiburg', position: 'FWD', rating: 78, price: 5.5, form: 6.5, stats: { pac: 74, sho: 78, pas: 60, dri: 68, def: 36, phy: 82 } },

  // ════════════════════ USA (extra) ════════════════════
  { id: 'adams_t', name: 'Tyler Adams', shortName: 'TAD', country: 'USA', countryCode: 'USA', club: 'Bournemouth', position: 'MID', rating: 80, price: 6.0, form: 6.8, stats: { pac: 74, sho: 62, pas: 74, dri: 70, def: 78, phy: 80 } },
  { id: 'weah', name: 'T. Weah', shortName: 'TWE', country: 'USA', countryCode: 'USA', club: 'Juventus', position: 'MID', rating: 79, price: 6.0, form: 7.0, stats: { pac: 86, sho: 70, pas: 68, dri: 76, def: 42, phy: 72 } },
  { id: 'ferreira_j', name: 'J. Ferreira', shortName: 'JFE', country: 'USA', countryCode: 'USA', club: 'FC Dallas', position: 'FWD', rating: 77, price: 5.0, form: 6.5, stats: { pac: 78, sho: 74, pas: 64, dri: 72, def: 36, phy: 72 } },
  { id: 'ream', name: 'Ream', shortName: 'REA', country: 'USA', countryCode: 'USA', club: 'Charlotte FC', position: 'DEF', rating: 76, price: 4.0, form: 5.8, stats: { pac: 64, sho: 42, pas: 60, dri: 56, def: 76, phy: 78 } },

  // ════════════════════ MEXICO (extra) ════════════════════
  { id: 'antuna', name: 'Antuna', shortName: 'ANT', country: 'Mexico', countryCode: 'MEX', club: 'Cruz Azul', position: 'MID', rating: 78, price: 5.5, form: 6.8, stats: { pac: 82, sho: 70, pas: 68, dri: 76, def: 38, phy: 68 } },
  { id: 'henry_martin', name: 'H. Martín', shortName: 'HMA', country: 'Mexico', countryCode: 'MEX', club: 'América', position: 'FWD', rating: 79, price: 6.0, form: 7.0, stats: { pac: 74, sho: 78, pas: 62, dri: 72, def: 36, phy: 78 } },
  { id: 'orbelin', name: 'Orbelín', shortName: 'ORB', country: 'Mexico', countryCode: 'MEX', club: 'Betis', position: 'MID', rating: 78, price: 5.5, form: 6.5, stats: { pac: 74, sho: 72, pas: 74, dri: 76, def: 44, phy: 68 } },

  // ════════════════════ ARGENTINA (extra) ════════════════════
  { id: 'acuna', name: 'Acuña', shortName: 'ACN', country: 'Argentina', countryCode: 'ARG', club: 'Sevilla', position: 'DEF', rating: 82, price: 5.5, form: 7.0, stats: { pac: 78, sho: 58, pas: 70, dri: 72, def: 78, phy: 78 } },
  { id: 'tagliafico', name: 'Tagliafico', shortName: 'TAG', country: 'Argentina', countryCode: 'ARG', club: 'Lyon', position: 'DEF', rating: 81, price: 5.0, form: 6.8, stats: { pac: 76, sho: 54, pas: 68, dri: 68, def: 78, phy: 74 } },
  { id: 'paredes', name: 'Paredes', shortName: 'PAR', country: 'Argentina', countryCode: 'ARG', club: 'Roma', position: 'MID', rating: 82, price: 6.5, form: 6.8, stats: { pac: 66, sho: 68, pas: 84, dri: 74, def: 70, phy: 74 } },

  // ════════════════════ BRAZIL (extra) ════════════════════
  { id: 'paqueta', name: 'Paquetá', shortName: 'PAQ', country: 'Brazil', countryCode: 'BRA', club: 'West Ham', position: 'MID', rating: 84, price: 8.0, form: 7.8, stats: { pac: 76, sho: 76, pas: 82, dri: 84, def: 54, phy: 74 } },
  { id: 'savinho', name: 'Savinho', shortName: 'SAV', country: 'Brazil', countryCode: 'BRA', club: 'Man City', position: 'MID', rating: 81, price: 7.5, form: 8.0, stats: { pac: 90, sho: 72, pas: 72, dri: 86, def: 36, phy: 66 } },
  { id: 'martinelli', name: 'Martinelli', shortName: 'MAR', country: 'Brazil', countryCode: 'BRA', club: 'Arsenal', position: 'FWD', rating: 83, price: 8.5, form: 8.0, stats: { pac: 86, sho: 80, pas: 70, dri: 82, def: 42, phy: 74 } },
  { id: 'gabriel_mag', name: 'G. Magalhães', shortName: 'GMA', country: 'Brazil', countryCode: 'BRA', club: 'Arsenal', position: 'DEF', rating: 84, price: 5.5, form: 7.5, stats: { pac: 74, sho: 50, pas: 66, dri: 64, def: 84, phy: 88 } },

  // ════════════════════ PORTUGAL (extra) ════════════════════
  { id: 'otavio', name: 'Otávio', shortName: 'OTA', country: 'Portugal', countryCode: 'POR', club: 'Al-Nassr', position: 'MID', rating: 80, price: 6.0, form: 6.5, stats: { pac: 74, sho: 68, pas: 78, dri: 76, def: 60, phy: 72 } },
  { id: 'william_carvalho', name: 'W. Carvalho', shortName: 'WCA', country: 'Portugal', countryCode: 'POR', club: 'Betis', position: 'MID', rating: 81, price: 6.0, form: 6.5, stats: { pac: 64, sho: 60, pas: 78, dri: 70, def: 80, phy: 82 } },
  { id: 'trincao', name: 'Trincão', shortName: 'TRI', country: 'Portugal', countryCode: 'POR', club: 'Sporting', position: 'FWD', rating: 80, price: 6.5, form: 7.0, stats: { pac: 82, sho: 74, pas: 70, dri: 82, def: 36, phy: 66 } },

  // ════════════════════ FRANCE (extra) ════════════════════
  { id: 'coman', name: 'Coman', shortName: 'COM', country: 'France', countryCode: 'FRA', club: 'Bayern', position: 'MID', rating: 84, price: 7.5, form: 7.2, stats: { pac: 92, sho: 76, pas: 72, dri: 84, def: 38, phy: 70 } },
  { id: 'kolo_muani', name: 'Kolo Muani', shortName: 'KOM', country: 'France', countryCode: 'FRA', club: 'Juventus', position: 'FWD', rating: 83, price: 7.5, form: 7.0, stats: { pac: 86, sho: 80, pas: 68, dri: 78, def: 36, phy: 80 } },
  { id: 'guendouzi', name: 'Guendouzi', shortName: 'GUE', country: 'France', countryCode: 'FRA', club: 'Lazio', position: 'MID', rating: 82, price: 6.5, form: 7.0, stats: { pac: 74, sho: 66, pas: 78, dri: 74, def: 72, phy: 80 } },

  // ════════════════════ SPAIN (extra) ════════════════════
  { id: 'zubimendi', name: 'Zubimendi', shortName: 'ZUB', country: 'Spain', countryCode: 'ESP', club: 'Real Sociedad', position: 'MID', rating: 83, price: 7.0, form: 7.5, stats: { pac: 68, sho: 64, pas: 82, dri: 74, def: 82, phy: 78 } },
  { id: 'le_normand', name: 'Le Normand', shortName: 'LNO', country: 'Spain', countryCode: 'ESP', club: 'Atlético', position: 'DEF', rating: 82, price: 5.0, form: 7.0, stats: { pac: 70, sho: 46, pas: 66, dri: 62, def: 82, phy: 84 } },
  { id: 'grimaldo', name: 'Grimaldo', shortName: 'GRI', country: 'Spain', countryCode: 'ESP', club: 'Leverkusen', position: 'DEF', rating: 83, price: 6.0, form: 7.5, stats: { pac: 82, sho: 64, pas: 76, dri: 76, def: 76, phy: 72 } },

  // ════════════════════ GERMANY (extra) ════════════════════
  { id: 'goretzka', name: 'Goretzka', shortName: 'GOR', country: 'Germany', countryCode: 'GER', club: 'Bayern', position: 'MID', rating: 84, price: 7.5, form: 7.2, stats: { pac: 76, sho: 78, pas: 78, dri: 76, def: 76, phy: 90 } },
  { id: 'muller', name: 'T. Müller', shortName: 'TMU', country: 'Germany', countryCode: 'GER', club: 'Bayern', position: 'FWD', rating: 82, price: 7.0, form: 6.8, stats: { pac: 70, sho: 80, pas: 82, dri: 76, def: 52, phy: 74 } },
  { id: 'fullkrug', name: 'Füllkrug', shortName: 'FUL', country: 'Germany', countryCode: 'GER', club: 'West Ham', position: 'FWD', rating: 81, price: 7.0, form: 7.2, stats: { pac: 68, sho: 84, pas: 64, dri: 68, def: 38, phy: 88 } },

  // ════════════════════ ENGLAND (extra) ════════════════════
  { id: 'walker', name: 'Walker', shortName: 'WAL', country: 'England', countryCode: 'ENG', club: 'AC Milan', position: 'DEF', rating: 83, price: 5.5, form: 6.8, stats: { pac: 90, sho: 54, pas: 66, dri: 72, def: 80, phy: 80 } },
  { id: 'trippier', name: 'Trippier', shortName: 'TRP', country: 'England', countryCode: 'ENG', club: 'Newcastle', position: 'DEF', rating: 82, price: 5.5, form: 7.0, stats: { pac: 74, sho: 64, pas: 76, dri: 68, def: 78, phy: 72 } },
  { id: 'mainoo', name: 'Mainoo', shortName: 'MAI', country: 'England', countryCode: 'ENG', club: 'Man Utd', position: 'MID', rating: 80, price: 6.5, form: 7.5, stats: { pac: 72, sho: 68, pas: 76, dri: 78, def: 64, phy: 72 } },
  { id: 'gordon_a', name: 'A. Gordon', shortName: 'AGO', country: 'England', countryCode: 'ENG', club: 'Newcastle', position: 'MID', rating: 80, price: 7.0, form: 7.8, stats: { pac: 84, sho: 74, pas: 68, dri: 78, def: 40, phy: 70 } },
  { id: 'rashford', name: 'Rashford', shortName: 'RAS', country: 'England', countryCode: 'ENG', club: 'Aston Villa', position: 'FWD', rating: 83, price: 8.0, form: 7.5, stats: { pac: 90, sho: 80, pas: 70, dri: 84, def: 36, phy: 78 } },

  // ════════════════════ VENEZUELA ════════════════════
  { id: 'herrera_y', name: 'Y. Herrera', shortName: 'YHE', country: 'Venezuela', countryCode: 'VEN', club: 'Girona', position: 'MID', rating: 81, price: 6.5, form: 7.2, stats: { pac: 74, sho: 72, pas: 76, dri: 76, def: 62, phy: 76 } },
  { id: 'soteldo', name: 'Soteldo', shortName: 'SOT', country: 'Venezuela', countryCode: 'VEN', club: 'Santos', position: 'MID', rating: 79, price: 5.5, form: 6.8, stats: { pac: 82, sho: 72, pas: 68, dri: 82, def: 36, phy: 62 } },
  { id: 'rondon', name: 'Rondón', shortName: 'RON', country: 'Venezuela', countryCode: 'VEN', club: 'Al-Kerrah', position: 'FWD', rating: 78, price: 5.0, form: 6.0, stats: { pac: 68, sho: 76, pas: 58, dri: 66, def: 36, phy: 86 } },
  { id: 'josef_martinez', name: 'J. Martínez', shortName: 'JMR', country: 'Venezuela', countryCode: 'VEN', club: 'Estudiantes', position: 'FWD', rating: 78, price: 5.5, form: 6.5, stats: { pac: 80, sho: 78, pas: 60, dri: 74, def: 34, phy: 72 } },
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
