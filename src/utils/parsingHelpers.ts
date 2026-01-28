import { PlayerAttributes } from '../types';

export const ATTRIBUTE_MAPPINGS: Record<keyof PlayerAttributes, string[]> = {
  pace: ['pace', 'Pace', 'PACE', 'Velocidade'],
  acceleration: ['acceleration', 'Acceleration', 'ACCELERATION', 'Aceleração'],
  stamina: ['stamina', 'Stamina', 'STAMINA', 'Resistência'],
  strength: ['strength', 'Strength', 'STRENGTH', 'Força'],
  balance: ['balance', 'Balance', 'BALANCE', 'Equilíbrio'],
  agility: ['agility', 'Agility', 'AGILITY', 'Agilidade'],
  jumping: ['jumping', 'Jumping', 'JUMPING', 'Pulo'],
  naturalFitness: [
    'naturalFitness',
    'Natural Fitness',
    'NATURAL_FITNESS',
    'Cond. Física Natural',
  ],
  workRate: ['workRate', 'Work Rate', 'WORK_RATE', 'Índice de Trabalho'],
  teamwork: ['teamwork', 'Teamwork', 'TEAMWORK', 'Trabalho em Equipe'],
  aggression: ['aggression', 'Aggression', 'AGGRESSION', 'Agressão'],
  bravery: ['bravery', 'Bravery', 'BRAVERY', 'Bravura'],
  decisions: ['decisions', 'Decisions', 'DECISIONS', 'Decisões'],
  composure: ['composure', 'Composure', 'COMPOSURE', 'Frieza'],
  concentration: [
    'concentration',
    'Concentration',
    'CONCENTRATION',
    'Concentração',
  ],
  anticipation: ['anticipation', 'Anticipation', 'ANTICIPATION', 'Antecipação'],
  vision: ['vision', 'Vision', 'VISION', 'Visão'],
  flair: ['flair', 'Flair', 'FLAIR', 'Talento'],
  determination: [
    'determination',
    'Determination',
    'DETERMINATION',
    'Determinação',
  ],
  offTheBall: ['offTheBall', 'Off The Ball', 'OFF_THE_BALL', 'Sem a Bola'],
  passing: ['passing', 'Passing', 'PASSING', 'Passe'],
  crossing: ['crossing', 'Crossing', 'CROSSING', 'Cruzamento'],
  dribbling: ['dribbling', 'Dribbling', 'DRIBBLING', 'Drible'],
  firstTouch: ['firstTouch', 'First Touch', 'FIRST_TOUCH', 'Toque de Primeira'],
  finishing: ['finishing', 'Finishing', 'FINISHING', 'Finalização'],
  heading: ['heading', 'Heading', 'HEADING', 'Cabeçada'],
  longShots: ['longShots', 'Long Shots', 'LONG_SHOTS', 'Chutes de Longe'],
  technique: ['technique', 'Technique', 'TECHNIQUE', 'Técnica'],
  tackling: ['tackling', 'Tackling', 'TACKLING', 'Desarme'],
  marking: ['marking', 'Marking', 'MARKING', 'Marcação'],
  positioning: ['positioning', 'Positioning', 'POSITIONING', 'Posicionamento'],
  reflexes: ['reflexes', 'Reflexes', 'REFLEXES', 'Reflexos'],
  handling: ['handling', 'Handling', 'HANDLING', 'Jogo de Mãos'],
  command: ['command', 'Command', 'COMMAND', 'Comando de Área'],
  aerial: ['aerial', 'Aerial', 'AERIAL', 'Habilidade Aérea'],
  oneOnOne: ['oneOnOne', 'One On One', 'ONE_ON_ONE', 'Um para Um'],
  kicking: ['kicking', 'Kicking', 'KICKING', 'Pontapé'],
  rushing: ['rushing', 'Rushing', 'RUSHING', 'Saídas'],
  eccentricity: [
    'eccentricity',
    'Eccentricity',
    'ECCENTRICITY',
    'Excentricidade',
  ],
  communication: [
    'communication',
    'Communication',
    'COMMUNICATION',
    'Comunicação',
  ],
  throwing: ['throwing', 'Throwing', 'THROWING', 'Lançamentos'],
};

export const extractAttributes = (
  getValue: (...names: string[]) => any
): PlayerAttributes => {
  const attributes: any = {};

  Object.entries(ATTRIBUTE_MAPPINGS).forEach(([key, possibleNames]) => {
    // Default to 1 instead of 10 to avoid fake stats for missing columns
    attributes[key] = Math.min(parseInt(getValue(...possibleNames)) || 1, 20);
  });

  return attributes as PlayerAttributes;
};
