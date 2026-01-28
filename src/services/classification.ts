import { Player } from '../types';

export const determinePlayerCategory = (
  scores: { score: number },
  age: number
): Player['category'] => {
  const mainScore = scores.score;

  if (mainScore >= 14) return 'elite';
  if (mainScore >= 12.5) return 'titular';
  if (age <= 21 && mainScore >= 10.5) return 'promessa';
  if (mainScore >= 10) return 'rotacao';
  if (age >= 29 && mainScore < 10) return 'vender';
  return 'baixo_nivel';
};

export const determineTeamType = (
  team: string
): 'main' | 'youth' | 'reserve' | 'loan' => {
  if (!team) return 'main';
  const teamUpper = team.toUpperCase();

  // Regra 1: S19, S20, etc. ou variações de Sub/Youth -> youth
  if (
    /S(1[8-9]|2[0-3])/.test(teamUpper) || // S18, S19, S20, S21, S22, S23
    teamUpper.includes('SUB') ||
    teamUpper.includes('U19') ||
    teamUpper.includes('U20') ||
    teamUpper.includes('U21') ||
    teamUpper.includes('U23') ||
    teamUpper.includes('YOUTH') ||
    teamUpper.includes('JUNIORES')
  ) {
    return 'youth';
  }

  // Regra 2: Contém EMP ou LOAN -> loan
  if (teamUpper.includes('EMP') || teamUpper.includes('LOAN')) {
    return 'loan';
  }

  // Regra 3: Termina com " B", " II", " 2" ou contém "RESERVA"
  // Atenção: O espaço antes do número é crucial para não pegar "Schalke 04"
  if (
    teamUpper.includes('RESERVA') ||
    teamUpper.includes('RESERVE') ||
    teamUpper.endsWith(' B') ||
    teamUpper.endsWith(' II') ||
    teamUpper.endsWith(' 2') // Adicionado para capturar "Schalke 04 2"
  ) {
    return 'reserve';
  }

  // Regra 4: Outros -> main
  return 'main';
};
