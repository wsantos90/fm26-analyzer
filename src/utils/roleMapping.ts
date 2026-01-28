// Mapping of Positions to valid FM26 Roles (IP and OOP)
// Based on FM26 role definitions and 'Base de Conhecimento'

export const POSITION_TO_ROLES: Record<
  string,
  { ip: string[]; oop: string[]; gk: string[] }
> = {
  // GOALKEEPER
  GK: {
    ip: [],
    oop: [],
    gk: [
      'Goleiro',
      'Guardião de Linha',
      'GK Direto',
      'Guardião Varredor',
      'Goleiro Jogador',
    ],
  },

  // DEFENDERS (Center)
  DC: {
    ip: ['Defesa com Bola', 'Defesa Avançado', 'Zagueiro Lateral'],
    oop: ['Zagueiro Tampão', 'Zagueiro de Cobertura'],
    gk: [],
  },

  // LATERALS / WING BACKS
  DL: {
    ip: ['Lateral Invertido', 'Ala Armador', 'Ala Ofensivo'],
    oop: ['Lateral de Pressão', 'Lateral de Contenção'],
    gk: [],
  },
  DR: {
    ip: ['Lateral Invertido', 'Ala Armador', 'Ala Ofensivo'],
    oop: ['Lateral de Pressão', 'Lateral de Contenção'],
    gk: [],
  },
  WBL: {
    ip: ['Lateral Invertido', 'Ala Armador', 'Ala Ofensivo'],
    oop: ['Lateral de Pressão', 'Lateral de Contenção'],
    gk: [],
  },
  WBR: {
    ip: ['Lateral Invertido', 'Ala Armador', 'Ala Ofensivo'],
    oop: ['Lateral de Pressão', 'Lateral de Contenção'],
    gk: [],
  },

  // DEFENSIVE MIDFIELDERS
  DM: {
    ip: ['Construtor de Jogo Recuado', 'Construtor Box-to-Box'],
    oop: ['Volante de Proteção', 'Volante de Pressão', 'Volante de Cobertura'],
    gk: [],
  },

  // CENTRAL MIDFIELDERS
  MC: {
    ip: [
      'Construtor de Jogo Recuado',
      'Construtor Box-to-Box',
      'Meio-Campista de Canal',
      'Construtor de Jogo Avançado',
    ],
    oop: [
      'Meio-Campista de Marcação',
      'Volante de Pressão',
      'Volante de Cobertura',
    ],
    gk: [],
  },

  // ATTACKING MIDFIELDERS
  AMC: {
    ip: [
      'Construtor de Jogo Avançado',
      'Função Livre',
      'Meio-Campista de Canal',
    ],
    oop: ['Avançado de Pressão', 'Extremo de Marcação'],
    gk: [],
  },

  // WINGERS / WIDE MIDFIELDERS
  ML: {
    ip: [
      'Extremo Interior',
      'Construtor de Jogo Aberto',
      'Ala Ofensivo',
      'Construtor de Jogo Avançado',
    ],
    oop: ['Extremo de Marcação', 'Extremo de Escape'],
    gk: [],
  },
  MR: {
    ip: [
      'Extremo Interior',
      'Construtor de Jogo Aberto',
      'Ala Ofensivo',
      'Construtor de Jogo Avançado',
    ],
    oop: ['Extremo de Marcação', 'Extremo de Escape'],
    gk: [],
  },
  AML: {
    ip: [
      'Extremo Interior',
      'Construtor de Jogo Aberto',
      'Ala Ofensivo',
      'Construtor de Jogo Avançado',
    ],
    oop: ['Extremo de Marcação', 'Extremo de Escape'],
    gk: [],
  },
  AMR: {
    ip: [
      'Extremo Interior',
      'Construtor de Jogo Aberto',
      'Ala Ofensivo',
      'Construtor de Jogo Avançado',
    ],
    oop: ['Extremo de Marcação', 'Extremo de Escape'],
    gk: [],
  },

  // STRIKERS
  ST: {
    ip: ['Falso Nove', 'Avançado de Canal', 'Avançado Alvo'],
    oop: ['Avançado de Pressão', 'Pivô de Escape'],
    gk: [],
  },
};
