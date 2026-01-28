// Single Source of Truth for Positions
export const POSITIONS_CONFIG = {
  GK: { id: 'GK', label: 'Goleiro', aliases: ['GOL'], short: 'gk' },
  DC: { id: 'DC', label: 'Zagueiro', aliases: ['ZAG'], short: 'dc' },
  DL: { id: 'DL', label: 'Lateral Esquerdo', aliases: ['LE'], short: 'dl' },
  DR: { id: 'DR', label: 'Lateral Direito', aliases: ['LD'], short: 'dr' },
  WBL: { id: 'WBL', label: 'Ala Esquerdo', aliases: ['ALE'], short: 'wbl' },
  WBR: { id: 'WBR', label: 'Ala Direito', aliases: ['ALD'], short: 'wbr' },
  DM: { id: 'DM', label: 'Volante', aliases: ['VOL', 'DMC'], short: 'dmc' },
  MC: { id: 'MC', label: 'Meia Central', aliases: ['MEI'], short: 'mc' },
  ML: { id: 'ML', label: 'Meia Esquerda', aliases: ['ME'], short: 'ml' },
  MR: { id: 'MR', label: 'Meia Direita', aliases: ['MD'], short: 'mr' },
  AML: { id: 'AML', label: 'Ponta Esquerda', aliases: ['MAE'], short: 'aml' },
  AMR: { id: 'AMR', label: 'Ponta Direita', aliases: ['MAD'], short: 'amr' },
  AMC: { id: 'AMC', label: 'Meia Atacante', aliases: ['MAC'], short: 'amc' },
  ST: { id: 'ST', label: 'Atacante', aliases: ['ATA'], short: 'st' },
};

// Derived mappings for compatibility
export const POS_LABELS: Record<string, string> = Object.values(
  POSITIONS_CONFIG
).reduce(
  (acc, pos) => {
    acc[pos.short] = pos.aliases[0];
    return acc;
  },
  {} as Record<string, string>
);

export const POSITIONS_PT_BR: Record<string, string> = Object.values(
  POSITIONS_CONFIG
).reduce(
  (acc, pos) => {
    acc[pos.id] = pos.label;
    return acc;
  },
  {} as Record<string, string>
);

export const PT_ALIAS_TO_ID: Record<string, string> = Object.values(
  POSITIONS_CONFIG
).reduce(
  (acc, pos) => {
    pos.aliases.forEach(alias => {
      acc[alias] = pos.id;
    });
    return acc;
  },
  {} as Record<string, string>
);

// --- ATTRIBUTE DEFINITIONS ---
export const ATTRIBUTE_CATEGORIES = {
  PHYSICAL: 'Físico',
  MENTAL: 'Mental',
  TECHNICAL: 'Técnico',
  GOALKEEPING: 'Goleiro',
} as const;

export const ATTRIBUTES_CONFIG = {
  // Physical
  acceleration: {
    label: 'Aceleração',
    category: ATTRIBUTE_CATEGORIES.PHYSICAL,
  },
  agility: { label: 'Agilidade', category: ATTRIBUTE_CATEGORIES.PHYSICAL },
  balance: { label: 'Equilíbrio', category: ATTRIBUTE_CATEGORIES.PHYSICAL },
  jumping: { label: 'Pulo', category: ATTRIBUTE_CATEGORIES.PHYSICAL },
  pace: { label: 'Velocidade', category: ATTRIBUTE_CATEGORIES.PHYSICAL },
  stamina: { label: 'Resistência', category: ATTRIBUTE_CATEGORIES.PHYSICAL },
  strength: { label: 'Força', category: ATTRIBUTE_CATEGORIES.PHYSICAL },

  // Mental
  aggression: { label: 'Agressão', category: ATTRIBUTE_CATEGORIES.MENTAL },
  anticipation: { label: 'Antecipação', category: ATTRIBUTE_CATEGORIES.MENTAL },
  bravery: { label: 'Bravura', category: ATTRIBUTE_CATEGORIES.MENTAL },
  composure: { label: 'Frieza', category: ATTRIBUTE_CATEGORIES.MENTAL },
  concentration: {
    label: 'Concentração',
    category: ATTRIBUTE_CATEGORIES.MENTAL,
  },
  decisions: { label: 'Decisões', category: ATTRIBUTE_CATEGORIES.MENTAL },
  determination: {
    label: 'Determinação',
    category: ATTRIBUTE_CATEGORIES.MENTAL,
  },
  flair: { label: 'Improviso', category: ATTRIBUTE_CATEGORIES.MENTAL },
  offTheBall: { label: 'Sem Bola', category: ATTRIBUTE_CATEGORIES.MENTAL },
  positioning: {
    label: 'Posicionamento',
    category: ATTRIBUTE_CATEGORIES.MENTAL,
  },
  teamwork: {
    label: 'Trabalho em Equipe',
    category: ATTRIBUTE_CATEGORIES.MENTAL,
  },
  vision: { label: 'Visão', category: ATTRIBUTE_CATEGORIES.MENTAL },
  workRate: {
    label: 'Índice de Trabalho',
    category: ATTRIBUTE_CATEGORIES.MENTAL,
  },

  // Technical
  crossing: { label: 'Cruzamento', category: ATTRIBUTE_CATEGORIES.TECHNICAL },
  dribbling: { label: 'Drible', category: ATTRIBUTE_CATEGORIES.TECHNICAL },
  finishing: { label: 'Finalização', category: ATTRIBUTE_CATEGORIES.TECHNICAL },
  firstTouch: {
    label: 'Prim. Toque',
    category: ATTRIBUTE_CATEGORIES.TECHNICAL,
  },
  heading: { label: 'Cabeceio', category: ATTRIBUTE_CATEGORIES.TECHNICAL },
  longShots: { label: 'Chute Longe', category: ATTRIBUTE_CATEGORIES.TECHNICAL },
  marking: { label: 'Marcação', category: ATTRIBUTE_CATEGORIES.TECHNICAL },
  passing: { label: 'Passe', category: ATTRIBUTE_CATEGORIES.TECHNICAL },
  tackling: { label: 'Desarme', category: ATTRIBUTE_CATEGORIES.TECHNICAL },
  technique: { label: 'Técnica', category: ATTRIBUTE_CATEGORIES.TECHNICAL },

  // Goalkeeping
  aerial: {
    label: 'Alcance Aéreo',
    category: ATTRIBUTE_CATEGORIES.GOALKEEPING,
  },
  command: {
    label: 'Comando de Área',
    category: ATTRIBUTE_CATEGORIES.GOALKEEPING,
  },
  communication: {
    label: 'Comunicação',
    category: ATTRIBUTE_CATEGORIES.GOALKEEPING,
  },
  eccentricity: {
    label: 'Excentricidade',
    category: ATTRIBUTE_CATEGORIES.GOALKEEPING,
  },
  handling: {
    label: 'Jogo de Mãos',
    category: ATTRIBUTE_CATEGORIES.GOALKEEPING,
  },
  kicking: { label: 'Pontapé', category: ATTRIBUTE_CATEGORIES.GOALKEEPING },
  oneOnOne: {
    label: 'Um contra Um',
    category: ATTRIBUTE_CATEGORIES.GOALKEEPING,
  },
  reflexes: { label: 'Reflexos', category: ATTRIBUTE_CATEGORIES.GOALKEEPING },
  rushing: { label: 'Saídas', category: ATTRIBUTE_CATEGORIES.GOALKEEPING },
  throwing: {
    label: 'Lançamentos',
    category: ATTRIBUTE_CATEGORIES.GOALKEEPING,
  },
};

export const ATTRIBUTE_LIST = Object.entries(ATTRIBUTES_CONFIG).map(
  ([key, config]) => ({
    key,
    ...config,
  })
);

export const TACTICAL_METHODOLOGIES = {
  gk: 'Goleiro',
  stretching: 'Amplitude',
  linking: 'Ligação',
  dynamic: 'Dinâmica',
  engaged: 'Combate',
  tracking: 'Cobertura',
  outlet: 'Referência',
} as const;
