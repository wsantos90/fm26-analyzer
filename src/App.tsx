import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import EmptyState from './components/EmptyState';
import Dashboard from './components/Dashboard';
import SquadList from './components/SquadList';
import ClubStructure from './components/ClubStructure'; // Novo Componente
import PlayerDetailModal from './components/PlayerDetailModal';
import CompareSidebar from './components/CompareSidebar';
import Guide from './components/Guide';
import { usePlayerData } from './hooks/usePlayerData';
import { useFilters } from './hooks/useFilters';
import { useModal } from './hooks/useModal';

const FMAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('structure'); // Default alterado para estrutura

  const { players, statistics, isLoading, error, handleFileUpload, resetData } =
    usePlayerData();

  const {
    selectedTeam,
    setSelectedTeam,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    filteredPlayers,
    uniqueTeams,
    uniqueCategories,
  } = useFilters(players);

  const {
    showPlayerModal,
    selectedPlayer,
    modalPositionContext,
    openPlayerModal,
    closePlayerModal,
    showCompareModal,
    comparePlayers,
    openCompareModal,
    closeCompareModal,
    addToCompare,
    removeFromCompare,
  } = useModal();

  const handlePlayerClick = (player: any, positionContext?: string) => {
    openPlayerModal(player, positionContext);
  };

  return (
    <div className="min-h-screen bg-black/60 text-slate-100 p-6 font-sans backdrop-blur-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Header onFileUpload={handleFileUpload} />

        {/* Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main
          className={`transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${showCompareModal ? 'mr-[400px]' : ''}`}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/5">
              <div className="text-blue-400 text-sm">Carregando arquivo...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16 bg-red-900/20 backdrop-blur-md rounded-xl border border-red-500/20">
              <div className="text-red-400 text-sm mb-4">
                Erro ao processar arquivo:
              </div>
              <div className="text-red-300 text-xs">{error}</div>
            </div>
          )}

          {/* Normal Content */}
          {!isLoading && !error && (
            <>
              {players.length === 0 ? (
                <EmptyState onFileUpload={handleFileUpload} />
              ) : (
                <>
                  {activeTab === 'structure' && (
                    <ClubStructure
                      players={players}
                      onPlayerClick={handlePlayerClick}
                    />
                  )}
                  {activeTab === 'dashboard' && (
                    <Dashboard
                      players={players}
                      statistics={statistics}
                      onReset={resetData}
                    />
                  )}
                  {activeTab === 'squad' && (
                    <SquadList
                      players={filteredPlayers}
                      onPlayerClick={handlePlayerClick}
                      onCompareClick={openCompareModal}
                      selectedTeam={selectedTeam}
                      setSelectedTeam={setSelectedTeam}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      uniqueTeams={uniqueTeams}
                      uniqueCategories={uniqueCategories}
                      comparePlayers={comparePlayers}
                      addToCompare={addToCompare}
                      removeFromCompare={removeFromCompare}
                    />
                  )}
                  {activeTab === 'tactics' && (
                    <div className="text-center py-16 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/5">
                      <div className="text-slate-400 text-sm">
                        Painel Tático - Em desenvolvimento...
                      </div>
                    </div>
                  )}
                  {activeTab === 'guide' && <Guide />}
                </>
              )}
            </>
          )}
        </main>

        {/* Modals */}
        <PlayerDetailModal
          show={showPlayerModal}
          player={selectedPlayer}
          positionContext={modalPositionContext}
          onClose={closePlayerModal}
        />

        <CompareSidebar
          show={showCompareModal}
          players={comparePlayers}
          onClose={closeCompareModal}
        />
      </div>
    </div>
  );
};

export default FMAnalyzer;
