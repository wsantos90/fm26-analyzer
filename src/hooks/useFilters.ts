import { useState, useMemo } from 'react';
import { Player } from '../types';

export const useFilters = (players: Player[]) => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    let filtered = players;

    if (selectedTeam !== 'all') {
      filtered = filtered.filter(player => player.teamType === selectedTeam);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        player => player.category === selectedCategory
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        player =>
          player.name.toLowerCase().includes(term) ||
          player.team.toLowerCase().includes(term) ||
          player.positions.primary.some(pos =>
            pos.toLowerCase().includes(term)
          ) ||
          player.positions.secondary.some(pos =>
            pos.toLowerCase().includes(term)
          )
      );
    }

    // Sort by mainScore descending (best to worst)
    return filtered.sort((a, b) => b.mainScore - a.mainScore);
  }, [players, selectedTeam, selectedCategory, searchTerm]);

  const uniqueTeams = useMemo(() => {
    const teams = new Set(players.map(player => player.teamType));
    return Array.from(teams);
  }, [players]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(players.map(player => player.category));
    return Array.from(categories);
  }, [players]);

  const clearFilters = () => {
    setSelectedTeam('all');
    setSelectedCategory('all');
    setSearchTerm('');
  };

  return {
    selectedTeam,
    setSelectedTeam,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    filteredPlayers,
    uniqueTeams,
    uniqueCategories,
    clearFilters,
  };
};
