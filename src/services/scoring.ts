import { FM26_ROLES } from '../constants';

export const calculatePlayerScores = (attributes: any) => {
  const gk =
    (attributes.reflexes +
      attributes.handling +
      attributes.command +
      attributes.aerial +
      attributes.oneOnOne +
      attributes.kicking) /
    6;

  const stretching =
    (attributes.pace + attributes.acceleration + attributes.stamina) / 3;
  const linking =
    (attributes.passing +
      attributes.vision +
      attributes.decisions +
      attributes.technique) /
    4;
  const dynamic =
    (attributes.offTheBall + attributes.anticipation + attributes.stamina) / 3;
  const engaged =
    (attributes.tackling +
      attributes.aggression +
      attributes.bravery +
      attributes.teamwork) /
    4;
  const tracking =
    (attributes.marking + attributes.concentration + attributes.positioning) /
    3;
  const outlet =
    (attributes.strength + attributes.balance + attributes.firstTouch) / 3;

  return { gk, stretching, linking, dynamic, engaged, tracking, outlet };
};

export const calculateFM26Scores = (attributes: any) => {
  const scores: {
    ip: Record<string, number>;
    oop: Record<string, number>;
    gk: Record<string, number>;
  } = {
    ip: {},
    oop: {},
    gk: {},
  };

  // Calculate GK scores
  if (FM26_ROLES.gk) {
    Object.entries(FM26_ROLES.gk).forEach(([role, weights]) => {
      let score = 0;
      let weightSum = 0;
      Object.entries(weights).forEach(([attr, weight]) => {
        // @ts-ignore
        const attrValue = attributes[attr] || 0;
        score += attrValue * weight;
        weightSum += weight;
      });
      scores.gk[role] = weightSum > 0 ? score / weightSum : 0;
    });
  }

  // Calculate IP scores
  Object.entries(FM26_ROLES.ip).forEach(([role, weights]) => {
    let score = 0;
    let weightSum = 0;
    Object.entries(weights).forEach(([attr, weight]) => {
      // @ts-ignore
      const attrValue = attributes[attr] || 0;
      score += attrValue * weight;
      weightSum += weight;
    });
    scores.ip[role] = weightSum > 0 ? score / weightSum : 0;
  });

  // Calculate OOP scores
  Object.entries(FM26_ROLES.oop).forEach(([role, weights]) => {
    let score = 0;
    let weightSum = 0;
    Object.entries(weights).forEach(([attr, weight]) => {
      // @ts-ignore
      const attrValue = attributes[attr] || 0;
      score += attrValue * weight;
      weightSum += weight;
    });
    scores.oop[role] = weightSum > 0 ? score / weightSum : 0;
  });

  return scores;
};
