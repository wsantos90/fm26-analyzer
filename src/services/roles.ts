import {
  calculatePositionScore,
  SUPPORTED_POSITIONS,
} from '../utils/positionAnalysis';
import { calculateFM26Scores } from './scoring';

// Mapping from Analysis (English) keys to CSV (Portuguese) codes
export const ENGLISH_TO_PT_CODE: Record<string, string> = {
  GK: 'GOL',
  DC: 'ZAG',
  DL: 'LE',
  DR: 'LD',
  WBL: 'ALE',
  WBR: 'ALD',
  DM: 'VOL',
  MC: 'MEI',
  ML: 'ME',
  MR: 'MD',
  AML: 'MAE',
  AMR: 'MAD',
  AMC: 'MAC',
  ST: 'ATA',
};

export const augmentPositionsWithAnalysis = (
  attributes: any,
  primary: string[],
  secondary: string[]
) => {
  const scores = SUPPORTED_POSITIONS.map(pos => ({
    position: pos,
    score: calculatePositionScore(attributes, pos),
  }));

  // Get top 3 positions with score >= 10 (minimum threshold for relevance)
  const bestPositions = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter(p => p.score >= 10);

  bestPositions.forEach(p => {
    const ptCode = ENGLISH_TO_PT_CODE[p.position];
    if (ptCode && !primary.includes(ptCode) && !secondary.includes(ptCode)) {
      secondary.push(ptCode);
    }
  });
};

export const calculateBestPositionAndScore = (attributes: any) => {
  let maxScore = 0;
  let bestPos = '';
  SUPPORTED_POSITIONS.forEach(pos => {
    const score = calculatePositionScore(attributes, pos);
    if (score > maxScore) {
      maxScore = score;
      bestPos = pos;
    }
  });
  return { mainScore: maxScore, bestPosition: bestPos };
};

export const determineBestRole = (attributes: any, scores: any) => {
  const roleScores = [
    { role: 'GK', score: attributes.reflexes },
    { role: 'DC', score: attributes.tackling + attributes.marking },
    { role: 'DL', score: attributes.tackling + attributes.pace },
    { role: 'DR', score: attributes.tackling + attributes.pace },
    { role: 'DMC', score: attributes.tackling + attributes.passing },
    { role: 'MC', score: attributes.passing + attributes.vision },
    { role: 'ML', score: attributes.crossing + attributes.dribbling },
    { role: 'MR', score: attributes.crossing + attributes.dribbling },
    { role: 'AML', score: attributes.dribbling + attributes.finishing },
    { role: 'AMR', score: attributes.dribbling + attributes.finishing },
    { role: 'AMC', score: attributes.passing + attributes.vision },
    { role: 'ST', score: attributes.finishing + attributes.anticipation },
  ];

  return roleScores.reduce((best, current) =>
    current.score > best.score ? current : best
  ).role;
};

export const determineBestIPRole = (attributes: any) => {
  const scores = calculateFM26Scores(attributes);
  let bestRole = '';
  let bestScore = -1;

  Object.entries(scores.ip).forEach(([role, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestRole = role;
    }
  });

  return bestRole;
};

export const determineBestOOPRole = (attributes: any) => {
  const scores = calculateFM26Scores(attributes);
  let bestRole = '';
  let bestScore = -1;

  Object.entries(scores.oop).forEach(([role, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestRole = role;
    }
  });

  return bestRole;
};
