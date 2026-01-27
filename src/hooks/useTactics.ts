import { useState, useMemo } from 'react';
import { Player, FormationSlot } from '../types';

// Extended interface for lineup with assigned player
interface LineupSlot extends FormationSlot {
  player?: Player | null;
}

const formations = {
  '4-3-3': [
    {
      id: 'gk',
      role: 'GK',
      positionKey: ['gk'],
      x: 50,
      y: 90,
      methodology: 'gk',
      ipRole: 'GK',
      oopRole: 'GK',
    },
    {
      id: 'dl',
      role: 'DL',
      positionKey: ['dl'],
      x: 15,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DL',
      oopRole: 'DL',
    },
    {
      id: 'dc1',
      role: 'DC',
      positionKey: ['dc'],
      x: 30,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc2',
      role: 'DC',
      positionKey: ['dc'],
      x: 50,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc3',
      role: 'DC',
      positionKey: ['dc'],
      x: 70,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dr',
      role: 'DR',
      positionKey: ['dr'],
      x: 85,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DR',
      oopRole: 'DR',
    },
    {
      id: 'ml',
      role: 'ML',
      positionKey: ['ml'],
      x: 20,
      y: 50,
      methodology: 'stretching',
      ipRole: 'ML',
      oopRole: 'ML',
    },
    {
      id: 'mc1',
      role: 'MC',
      positionKey: ['mc'],
      x: 35,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc2',
      role: 'MC',
      positionKey: ['mc'],
      x: 50,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc3',
      role: 'MC',
      positionKey: ['mc'],
      x: 65,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mr',
      role: 'MR',
      positionKey: ['mr'],
      x: 80,
      y: 50,
      methodology: 'stretching',
      ipRole: 'MR',
      oopRole: 'MR',
    },
    {
      id: 'aml',
      role: 'AML',
      positionKey: ['aml'],
      x: 25,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AML',
      oopRole: 'AML',
    },
    {
      id: 'st',
      role: 'ST',
      positionKey: ['st'],
      x: 50,
      y: 30,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
    {
      id: 'amr',
      role: 'AMR',
      positionKey: ['amr'],
      x: 75,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AMR',
      oopRole: 'AMR',
    },
  ],
  '4-4-2': [
    {
      id: 'gk',
      role: 'GK',
      positionKey: ['gk'],
      x: 50,
      y: 90,
      methodology: 'gk',
      ipRole: 'GK',
      oopRole: 'GK',
    },
    {
      id: 'dl',
      role: 'DL',
      positionKey: ['dl'],
      x: 15,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DL',
      oopRole: 'DL',
    },
    {
      id: 'dc1',
      role: 'DC',
      positionKey: ['dc'],
      x: 30,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc2',
      role: 'DC',
      positionKey: ['dc'],
      x: 50,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc3',
      role: 'DC',
      positionKey: ['dc'],
      x: 70,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dr',
      role: 'DR',
      positionKey: ['dr'],
      x: 85,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DR',
      oopRole: 'DR',
    },
    {
      id: 'ml',
      role: 'ML',
      positionKey: ['ml'],
      x: 20,
      y: 50,
      methodology: 'stretching',
      ipRole: 'ML',
      oopRole: 'ML',
    },
    {
      id: 'mc1',
      role: 'MC',
      positionKey: ['mc'],
      x: 40,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc2',
      role: 'MC',
      positionKey: ['mc'],
      x: 60,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mr',
      role: 'MR',
      positionKey: ['mr'],
      x: 80,
      y: 50,
      methodology: 'stretching',
      ipRole: 'MR',
      oopRole: 'MR',
    },
    {
      id: 'aml',
      role: 'AML',
      positionKey: ['aml'],
      x: 30,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AML',
      oopRole: 'AML',
    },
    {
      id: 'amr',
      role: 'AMR',
      positionKey: ['amr'],
      x: 70,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AMR',
      oopRole: 'AMR',
    },
  ],
  '3-5-2': [
    {
      id: 'gk',
      role: 'GK',
      positionKey: ['gk'],
      x: 50,
      y: 90,
      methodology: 'gk',
      ipRole: 'GK',
      oopRole: 'GK',
    },
    {
      id: 'dl',
      role: 'DL',
      positionKey: ['dl'],
      x: 20,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DL',
      oopRole: 'DL',
    },
    {
      id: 'dc1',
      role: 'DC',
      positionKey: ['dc'],
      x: 40,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc2',
      role: 'DC',
      positionKey: ['dc'],
      x: 60,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dr',
      role: 'DR',
      positionKey: ['dr'],
      x: 80,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DR',
      oopRole: 'DR',
    },
    {
      id: 'mc1',
      role: 'MC',
      positionKey: ['mc'],
      x: 25,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc2',
      role: 'MC',
      positionKey: ['mc'],
      x: 40,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc3',
      role: 'MC',
      positionKey: ['mc'],
      x: 50,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc4',
      role: 'MC',
      positionKey: ['mc'],
      x: 60,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc5',
      role: 'MC',
      positionKey: ['mc'],
      x: 75,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'st1',
      role: 'ST',
      positionKey: ['st'],
      x: 35,
      y: 30,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
    {
      id: 'st2',
      role: 'ST',
      positionKey: ['st'],
      x: 65,
      y: 30,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
  ],
  '4-2-3-1': [
    {
      id: 'gk',
      role: 'GK',
      positionKey: ['gk'],
      x: 50,
      y: 90,
      methodology: 'gk',
      ipRole: 'GK',
      oopRole: 'GK',
    },
    {
      id: 'dl',
      role: 'DL',
      positionKey: ['dl'],
      x: 15,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DL',
      oopRole: 'DL',
    },
    {
      id: 'dc1',
      role: 'DC',
      positionKey: ['dc'],
      x: 35,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc2',
      role: 'DC',
      positionKey: ['dc'],
      x: 65,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dr',
      role: 'DR',
      positionKey: ['dr'],
      x: 85,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DR',
      oopRole: 'DR',
    },
    {
      id: 'mc1',
      role: 'MC',
      positionKey: ['mc'],
      x: 40,
      y: 60,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc2',
      role: 'MC',
      positionKey: ['mc'],
      x: 60,
      y: 60,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'aml',
      role: 'AML',
      positionKey: ['aml'],
      x: 20,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AML',
      oopRole: 'AML',
    },
    {
      id: 'amc',
      role: 'AMC',
      positionKey: ['mc', 'amc'],
      x: 50,
      y: 30,
      methodology: 'linking',
      ipRole: 'AMC',
      oopRole: 'AMC',
    },
    {
      id: 'amr',
      role: 'AMR',
      positionKey: ['amr'],
      x: 80,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AMR',
      oopRole: 'AMR',
    },
    {
      id: 'st',
      role: 'ST',
      positionKey: ['st'],
      x: 50,
      y: 15,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
  ],
  '3-4-3': [
    {
      id: 'gk',
      role: 'GK',
      positionKey: ['gk'],
      x: 50,
      y: 90,
      methodology: 'gk',
      ipRole: 'GK',
      oopRole: 'GK',
    },
    {
      id: 'dc1',
      role: 'DC',
      positionKey: ['dc'],
      x: 30,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc2',
      role: 'DC',
      positionKey: ['dc'],
      x: 50,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc3',
      role: 'DC',
      positionKey: ['dc'],
      x: 70,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'ml',
      role: 'ML',
      positionKey: ['ml'],
      x: 15,
      y: 50,
      methodology: 'stretching',
      ipRole: 'ML',
      oopRole: 'ML',
    },
    {
      id: 'mc1',
      role: 'MC',
      positionKey: ['mc'],
      x: 40,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc2',
      role: 'MC',
      positionKey: ['mc'],
      x: 60,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mr',
      role: 'MR',
      positionKey: ['mr'],
      x: 85,
      y: 50,
      methodology: 'stretching',
      ipRole: 'MR',
      oopRole: 'MR',
    },
    {
      id: 'aml',
      role: 'AML',
      positionKey: ['aml'],
      x: 25,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AML',
      oopRole: 'AML',
    },
    {
      id: 'st',
      role: 'ST',
      positionKey: ['st'],
      x: 50,
      y: 20,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
    {
      id: 'amr',
      role: 'AMR',
      positionKey: ['amr'],
      x: 75,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AMR',
      oopRole: 'AMR',
    },
  ],
  '5-3-2': [
    {
      id: 'gk',
      role: 'GK',
      positionKey: ['gk'],
      x: 50,
      y: 90,
      methodology: 'gk',
      ipRole: 'GK',
      oopRole: 'GK',
    },
    {
      id: 'dl',
      role: 'DL',
      positionKey: ['dl'],
      x: 15,
      y: 65,
      methodology: 'tracking',
      ipRole: 'DL',
      oopRole: 'DL',
    },
    {
      id: 'dc1',
      role: 'DC',
      positionKey: ['dc'],
      x: 35,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc2',
      role: 'DC',
      positionKey: ['dc'],
      x: 50,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc3',
      role: 'DC',
      positionKey: ['dc'],
      x: 65,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dr',
      role: 'DR',
      positionKey: ['dr'],
      x: 85,
      y: 65,
      methodology: 'tracking',
      ipRole: 'DR',
      oopRole: 'DR',
    },
    {
      id: 'mc1',
      role: 'MC',
      positionKey: ['mc'],
      x: 35,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc2',
      role: 'MC',
      positionKey: ['mc'],
      x: 50,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc3',
      role: 'MC',
      positionKey: ['mc'],
      x: 65,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'st1',
      role: 'ST',
      positionKey: ['st'],
      x: 40,
      y: 25,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
    {
      id: 'st2',
      role: 'ST',
      positionKey: ['st'],
      x: 60,
      y: 25,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
  ],
  '4-1-2-1-2': [
    {
      id: 'gk',
      role: 'GK',
      positionKey: ['gk'],
      x: 50,
      y: 90,
      methodology: 'gk',
      ipRole: 'GK',
      oopRole: 'GK',
    },
    {
      id: 'dl',
      role: 'DL',
      positionKey: ['dl'],
      x: 15,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DL',
      oopRole: 'DL',
    },
    {
      id: 'dc1',
      role: 'DC',
      positionKey: ['dc'],
      x: 35,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc2',
      role: 'DC',
      positionKey: ['dc'],
      x: 65,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dr',
      role: 'DR',
      positionKey: ['dr'],
      x: 85,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DR',
      oopRole: 'DR',
    },
    {
      id: 'dm',
      role: 'DM',
      positionKey: ['mc', 'dm'],
      x: 50,
      y: 60,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc1',
      role: 'MC',
      positionKey: ['mc'],
      x: 35,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc2',
      role: 'MC',
      positionKey: ['mc'],
      x: 65,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'amc',
      role: 'AMC',
      positionKey: ['mc', 'amc'],
      x: 50,
      y: 35,
      methodology: 'linking',
      ipRole: 'AMC',
      oopRole: 'AMC',
    },
    {
      id: 'st1',
      role: 'ST',
      positionKey: ['st'],
      x: 40,
      y: 20,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
    {
      id: 'st2',
      role: 'ST',
      positionKey: ['st'],
      x: 60,
      y: 20,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
  ],
  '4-1-4-1': [
    {
      id: 'gk',
      role: 'GK',
      positionKey: ['gk'],
      x: 50,
      y: 90,
      methodology: 'gk',
      ipRole: 'GK',
      oopRole: 'GK',
    },
    {
      id: 'dl',
      role: 'DL',
      positionKey: ['dl'],
      x: 15,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DL',
      oopRole: 'DL',
    },
    {
      id: 'dc1',
      role: 'DC',
      positionKey: ['dc'],
      x: 35,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc2',
      role: 'DC',
      positionKey: ['dc'],
      x: 65,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dr',
      role: 'DR',
      positionKey: ['dr'],
      x: 85,
      y: 70,
      methodology: 'tracking',
      ipRole: 'DR',
      oopRole: 'DR',
    },
    {
      id: 'dm',
      role: 'DM',
      positionKey: ['mc', 'dm'],
      x: 50,
      y: 60,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'ml',
      role: 'ML',
      positionKey: ['ml'],
      x: 15,
      y: 45,
      methodology: 'stretching',
      ipRole: 'ML',
      oopRole: 'ML',
    },
    {
      id: 'mc1',
      role: 'MC',
      positionKey: ['mc'],
      x: 40,
      y: 45,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc2',
      role: 'MC',
      positionKey: ['mc'],
      x: 60,
      y: 45,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mr',
      role: 'MR',
      positionKey: ['mr'],
      x: 85,
      y: 45,
      methodology: 'stretching',
      ipRole: 'MR',
      oopRole: 'MR',
    },
    {
      id: 'st',
      role: 'ST',
      positionKey: ['st'],
      x: 50,
      y: 20,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
  ],
  '5-2-3': [
    {
      id: 'gk',
      role: 'GK',
      positionKey: ['gk'],
      x: 50,
      y: 90,
      methodology: 'gk',
      ipRole: 'GK',
      oopRole: 'GK',
    },
    {
      id: 'dl',
      role: 'DL',
      positionKey: ['dl'],
      x: 15,
      y: 65,
      methodology: 'tracking',
      ipRole: 'DL',
      oopRole: 'DL',
    },
    {
      id: 'dc1',
      role: 'DC',
      positionKey: ['dc'],
      x: 35,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc2',
      role: 'DC',
      positionKey: ['dc'],
      x: 50,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dc3',
      role: 'DC',
      positionKey: ['dc'],
      x: 65,
      y: 70,
      methodology: 'engaged',
      ipRole: 'DC',
      oopRole: 'DC',
    },
    {
      id: 'dr',
      role: 'DR',
      positionKey: ['dr'],
      x: 85,
      y: 65,
      methodology: 'tracking',
      ipRole: 'DR',
      oopRole: 'DR',
    },
    {
      id: 'mc1',
      role: 'MC',
      positionKey: ['mc'],
      x: 40,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'mc2',
      role: 'MC',
      positionKey: ['mc'],
      x: 60,
      y: 50,
      methodology: 'linking',
      ipRole: 'MC',
      oopRole: 'MC',
    },
    {
      id: 'aml',
      role: 'AML',
      positionKey: ['aml'],
      x: 25,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AML',
      oopRole: 'AML',
    },
    {
      id: 'st',
      role: 'ST',
      positionKey: ['st'],
      x: 50,
      y: 20,
      methodology: 'outlet',
      ipRole: 'ST',
      oopRole: 'ST',
    },
    {
      id: 'amr',
      role: 'AMR',
      positionKey: ['amr'],
      x: 75,
      y: 30,
      methodology: 'dynamic',
      ipRole: 'AMR',
      oopRole: 'AMR',
    },
  ],
};

export const useTactics = (players: Player[]) => {
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [tacticalPhase, setTacticalPhase] = useState<'ip' | 'oop'>('ip');
  const [lineup, setLineup] = useState<LineupSlot[]>([]);

  const currentFormation =
    formations[selectedFormation as keyof typeof formations] ||
    formations['4-3-3'];

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

    return Object.entries(formations)
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
    formations: Object.keys(formations),
    generateLineup,
    clearLineup,
    getLineupStrength,
    getFormationBalance,
    recommendedFormations,
  };
};
