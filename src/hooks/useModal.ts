import { useState } from 'react';
import { Player } from '../types';

export const useModal = () => {
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparePlayers, setComparePlayers] = useState<Player[]>([]);
  const [modalPositionContext, setModalPositionContext] = useState<string>('');

  const openPlayerModal = (player: Player, positionContext?: string) => {
    setSelectedPlayer(player);
    setModalPositionContext(positionContext || '');
    setShowPlayerModal(true);
  };

  const closePlayerModal = () => {
    setShowPlayerModal(false);
    setSelectedPlayer(null);
    setModalPositionContext('');
  };

  const openCompareModal = (players: Player[]) => {
    setComparePlayers(players);
    setShowCompareModal(true);
  };

  const closeCompareModal = () => {
    setShowCompareModal(false);
    setComparePlayers([]);
  };

  const addToCompare = (player: Player) => {
    if (
      comparePlayers.length < 2 &&
      !comparePlayers.some(p => p.id === player.id)
    ) {
      setComparePlayers([...comparePlayers, player]);
    }
  };

  const removeFromCompare = (playerId: string) => {
    setComparePlayers(comparePlayers.filter(p => p.id !== playerId));
  };

  return {
    showPlayerModal,
    selectedPlayer,
    showCompareModal,
    comparePlayers,
    modalPositionContext,
    openPlayerModal,
    closePlayerModal,
    openCompareModal,
    closeCompareModal,
    addToCompare,
    removeFromCompare,
  };
};
