// FM26 ROLE DEFINITIONS (Attribute Weights)
export const FM26_ROLES = {
  // --- GOALKEEPER (GK) ---
  gk: {
    Goleiro: {
      reflexes: 3,
      handling: 3,
      positioning: 3,
      agility: 2,
      aerial: 2,
    },
    'Guardião de Linha': {
      reflexes: 4,
      handling: 3,
      oneOnOne: 3,
      positioning: 3,
      aerial: 2,
    },
    'GK Direto': {
      reflexes: 3,
      handling: 3,
      kicking: 3,
      positioning: 2,
      concentration: 2,
    },
    'Guardião Varredor': {
      reflexes: 3,
      rushing: 3,
      oneOnOne: 3,
      anticipation: 3,
      acceleration: 2,
      passing: 2,
    },
    'Goleiro Jogador': {
      reflexes: 3,
      passing: 3,
      vision: 3,
      firstTouch: 2,
      composure: 2,
      throwing: 2,
    },
  },

  // --- IN POSSESSION (IP) ---
  ip: {
    // Defensores
    'Defesa com Bola': {
      passing: 4,
      vision: 3,
      composure: 3,
      technique: 2,
      acceleration: 4,
      pace: 4,
    },
    'Zagueiro Lateral': {
      crossing: 3,
      dribbling: 2,
      pace: 5,
      acceleration: 5,
      positioning: 3,
      agility: 4,
    },
    'Defesa Avançado': {
      passing: 4,
      vision: 3,
      dribbling: 3,
      composure: 3,
      pace: 4,
      acceleration: 4,
    }, // Libero moderno
    'Lateral Invertido': {
      passing: 3,
      vision: 3,
      positioning: 4,
      decisions: 3,
      acceleration: 4,
      agility: 3,
    },
    'Ala Armador': {
      passing: 4,
      vision: 4,
      crossing: 3,
      technique: 3,
      agility: 4,
      acceleration: 3,
    },
    'Ala Ofensivo': {
      pace: 5,
      acceleration: 5,
      crossing: 4,
      dribbling: 4,
      agility: 4,
    },

    // Meio-Campo
    'Construtor de Jogo Recuado': {
      passing: 5,
      vision: 4,
      composure: 4,
      firstTouch: 3,
      agility: 3,
      decisions: 3,
    },
    'Construtor Box-to-Box': {
      stamina: 5,
      workRate: 5,
      passing: 3,
      vision: 3,
      pace: 4,
      acceleration: 4,
    },
    'Meio-Campista de Canal': {
      pace: 5,
      acceleration: 5,
      stamina: 4,
      offTheBall: 4,
      workRate: 4,
    }, // Novo Mezzala
    'Construtor de Jogo Avançado': {
      passing: 4,
      vision: 4,
      technique: 3,
      flair: 3,
      agility: 4,
      acceleration: 3,
    },

    // Alas/Meias Ofensivos
    'Extremo Interior': {
      dribbling: 4,
      finishing: 3,
      acceleration: 5,
      pace: 5,
      flair: 3,
      agility: 4,
    },
    'Construtor de Jogo Aberto': {
      passing: 5,
      vision: 4,
      crossing: 3,
      technique: 3,
      agility: 3,
      composure: 3,
    },
    'Função Livre': {
      flair: 5,
      vision: 4,
      passing: 4,
      dribbling: 4,
      agility: 4,
      acceleration: 3,
    }, // Novo Trequartista/Enganche

    // Atacantes
    'Falso Nove': {
      vision: 4,
      passing: 4,
      dribbling: 3,
      composure: 3,
      acceleration: 4,
      agility: 4,
    },
    'Avançado de Canal': {
      pace: 5,
      acceleration: 5,
      offTheBall: 4,
      workRate: 4,
      finishing: 3,
    },
    'Avançado Alvo': {
      strength: 5,
      heading: 5,
      balance: 4,
      teamwork: 3,
      jumping: 4,
    },
  },

  // --- OUT OF POSSESSION (OOP) ---
  oop: {
    // Defensores
    'Zagueiro Tampão': {
      aggression: 4,
      bravery: 4,
      strength: 4,
      tackling: 3,
      pace: 3,
      jumping: 4,
    },
    'Zagueiro de Cobertura': {
      pace: 5,
      acceleration: 4,
      anticipation: 4,
      positioning: 4,
      concentration: 3,
    },
    'Lateral de Pressão': {
      stamina: 5,
      aggression: 4,
      workRate: 5,
      tackling: 3,
      acceleration: 5,
      pace: 4,
    },
    'Lateral de Contenção': {
      positioning: 5,
      marking: 4,
      concentration: 4,
      strength: 3,
      tackling: 4,
    },

    // Meio-Campo
    'Volante de Proteção': {
      positioning: 5,
      anticipation: 4,
      concentration: 4,
      strength: 3,
      stamina: 3,
      tackling: 3,
    }, // Novo Anchor
    'Volante de Pressão': {
      aggression: 4,
      workRate: 5,
      stamina: 5,
      tackling: 3,
      acceleration: 4,
      pace: 4,
    },
    'Volante de Cobertura': {
      pace: 4,
      stamina: 4,
      positioning: 4,
      teamwork: 3,
      acceleration: 3,
    }, // Cobre laterais
    'Meio-Campista de Marcação': {
      stamina: 5,
      workRate: 5,
      teamwork: 4,
      positioning: 3,
      marking: 4,
    },

    // Alas/Atacantes
    'Extremo de Marcação': {
      workRate: 5,
      stamina: 4,
      tackling: 3,
      teamwork: 4,
      acceleration: 4,
    },
    'Extremo de Escape': {
      pace: 5,
      acceleration: 5,
      anticipation: 3,
      flair: 2,
      offTheBall: 4,
    }, // Fica na frente
    'Avançado de Pressão': {
      workRate: 5,
      aggression: 4,
      stamina: 5,
      teamwork: 4,
      acceleration: 4,
      pace: 3,
    },
    'Pivô de Escape': {
      pace: 5,
      acceleration: 5,
      finishing: 3,
      composure: 2,
      offTheBall: 4,
    }, // Fica na banheira
  },
};

// Mapping of Positions to valid FM26 Roles (IP and OOP)
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
