import { useState, useMemo } from 'react';
import { Player, FormationSlot } from '../types';
import { FORMATIONS } from '../data/formations';

// Extended interface for lineup with assigned player
interface LineupSlot extends FormationSlot {
  player?: Player | null;
}

export const useTactics = (players: Player[]) => {
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [tacticalPhase, setTacticalPhase] = useState<'ip' | 'oop'>('ip');
  const [lineup, setLineup] = useState<LineupSlot[]>([]);

  const currentFormation = FORMATIONS[selectedFormation] || FORMATIONS['4-3-3'];

  const generateLineup = () => {
    const assignedIds: string[] = [];
    const newLineup = currentFormation.map(slot => {
      const candidates = players.filter(
        player =>
          !assignedIds.includes(player.id) &&
          slot.positionKey.some(key => player.positions.primary.includes(key))
      );

      const sortedCandidates = candidates.sort((a, b) => {
        if (
          tacticalPhase === 'ip' &&
          (slot as any).ipRole &&
          a.fm26Scores.ip[(slot as any).ipRole]
        ) {
          return (
            b.fm26Scores.ip[(slot as any).ipRole] -
            a.fm26Scores.ip[(slot as any).ipRole]
          );
        }
        if (
          tacticalPhase === 'oop' &&
          (slot as any).oopRole &&
          a.fm26Scores.oop[(slot as any).oopRole]
        ) {
          return (
            b.fm26Scores.oop[(slot as any).oopRole] -
            a.fm26Scores.oop[(slot as any).oopRole]
          );
        }
        return b.mainScore - a.mainScore;
      });

      const bestPlayer = sortedCandidates[0];

      if (bestPlayer) {
        assignedIds.push(bestPlayer.id);
      }

      return {
        ...slot,
        player: bestPlayer || null,
      } as LineupSlot;
    });

    setLineup(newLineup);
  };

  const clearLineup = () => {
    setLineup([]);
  };

  const getLineupStrength = useMemo(() => {
    const validPlayers = lineup.filter(slot => slot.player);
    if (validPlayers.length === 0) return 0;

    const totalScore = validPlayers.reduce(
      (sum, slot) => sum + slot.player!.mainScore,
      0
    );
    return totalScore / validPlayers.length;
  }, [lineup]);

  const getFormationBalance = useMemo(() => {
    const scores = {
      gk: 0,
      stretching: 0,
      linking: 0,
      dynamic: 0,
      engaged: 0,
      tracking: 0,
      outlet: 0,
    };

    lineup.forEach(slot => {
      if (slot.player) {
        scores[slot.methodology as keyof typeof scores] +=
          slot.player.scores[slot.methodology as keyof Player['scores']];
      }
    });

    const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
    return Object.fromEntries(
      Object.entries(scores).map(([key, val]) => [
        key,
        total > 0 ? (val / total) * 100 : 0,
      ])
    );
  }, [lineup]);

  const recommendedFormations = useMemo(() => {
    if (players.length === 0) return [];

    return Object.entries(FORMATIONS)
      .map(([name, slots]) => {
        // Calculate potential score for this formation
        const assignedIds: string[] = [];
        let totalScore = 0;
        let playerCount = 0;

        slots.forEach(slot => {
          const candidates = players.filter(
            player =>
              !assignedIds.includes(player.id) &&
              slot.positionKey.some(key =>
                player.positions.primary.includes(key)
              )
          );

          // Find best player for this slot based on mainScore (simplified for ranking)
          // Ideally we should use role-based scoring but mainScore is a good proxy for general quality
          const bestPlayer = candidates.sort(
            (a, b) => b.mainScore - a.mainScore
          )[0];

          if (bestPlayer) {
            assignedIds.push(bestPlayer.id);
            totalScore += bestPlayer.mainScore;
            playerCount++;
          }
        });

        // Penalize incomplete formations heavily
        if (playerCount < 11) {
          totalScore = totalScore * (playerCount / 11);
        }

        return {
          name,
          score: totalScore,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [players]);

  return {
    selectedFormation,
    setSelectedFormation,
    tacticalPhase,
    setTacticalPhase,
    lineup,
    formations: Object.keys(FORMATIONS),
    generateLineup,
    clearLineup,
    getLineupStrength,
    getFormationBalance,
    recommendedFormations,
  };
};
