import React, { useState } from 'react';
import { Activity, Users } from 'lucide-react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import EmptyState from './components/EmptyState';
import Dashboard from './components/Dashboard';
import SquadList from './components/SquadList';
import PlayerDetailModal from './components/PlayerDetailModal';
import CompareModal from './components/CompareModal';
import { usePlayerData } from './hooks/usePlayerData';
import { useFilters } from './hooks/useFilters';
import { useModal } from './hooks/useModal';

const FMAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    players,
    filteredPlayers,
    statistics,
    isLoading,
    error,
    handleFileUpload,
  } = usePlayerData();

  const {
    selectedTeam,
    setSelectedTeam,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
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

  const Guide = () => {
    const categories = [
      {
        name: 'Elite',
        desc: 'Jogadores de classe mundial (Nota ≥ 14)',
        color: 'text-yellow-400',
      },
      {
        name: 'Titular',
        desc: 'Jogadores prontos para o time principal (Nota ≥ 12.5)',
        color: 'text-green-400',
      },
      {
        name: 'Promessa',
        desc: 'Jovens com alto potencial (≤ 21 anos, Nota ≥ 10.5)',
        color: 'text-purple-400',
      },
      {
        name: 'Rotação',
        desc: 'Opções úteis para compor elenco',
        color: 'text-slate-400',
      },
      {
        name: 'Nível Baixo',
        desc: 'Jogadores abaixo do nível exigido (Nota < 10)',
        color: 'text-orange-400',
      },
      {
        name: 'Vender',
        desc: 'Veteranos sem rendimento ou excedentes (≥ 29 anos, Nota < 10)',
        color: 'text-red-400',
      },
    ];

    const methodologies = [
      {
        name: 'Stretching (Amplitude)',
        desc: 'Capacidade de alargar o campo ofensivamente',
        attr: 'Velocidade, Aceleração, Cruzamento',
        role: 'Pontas, Alas',
      },
      {
        name: 'Linking (Ligação)',
        desc: 'Conectar defesa e ataque, ditar ritmo',
        attr: 'Passe, Visão, Decisões, Técnica',
        role: 'Playmakers',
      },
      {
        name: 'Dynamic (Dinâmica)',
        desc: 'Movimentação e infiltração constante',
        attr: 'Sem Bola, Antecipação, Físico',
        role: 'Box-to-Box, Atacantes',
      },
      {
        name: 'Engaged (Combate)',
        desc: 'Intensidade na recuperação de bola',
        attr: 'Desarme, Agressão, Bravura, Trabalho em Equipe',
        role: 'Volantes, Zagueiros',
      },
      {
        name: 'Tracking (Cobertura)',
        desc: 'Acompanhar adversários e fechar espaços',
        attr: 'Marcação, Concentração, Posicionamento',
        role: 'Laterais Defensivos',
      },
      {
        name: 'Outlet (Referência)',
        desc: 'Segurar a bola e aliviar pressão (Pivô)',
        attr: 'Força, Equilíbrio, Controle de Bola',
        role: 'Pivôs, Zagueiros Rebatedores',
      },
      {
        name: 'GK (Goleiro)',
        desc: 'Proteção da meta e distribuição',
        attr: 'Reflexos, Posicionamento, Agilidade',
        role: 'Goleiros',
      },
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Metodologias */}
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
          <h3 className="text-white font-black mb-8 flex items-center gap-3 text-lg uppercase tracking-wider">
            <Activity size={24} className="text-blue-500" /> Metodologias
            Táticas (DNA)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methodologies.map(m => (
              <div
                key={m.name}
                className="bg-black/20 p-5 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-black/40 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                  <div className="text-blue-400 font-bold text-sm uppercase tracking-wider">
                    {m.name}
                  </div>
                </div>
                <div className="text-slate-300 text-xs mb-4 font-medium leading-relaxed border-b border-white/5 pb-4">
                  {m.desc}
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                    Atributos Chave
                  </div>
                  <div className="text-white text-xs">{m.attr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categorias */}
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
          <h3 className="text-white font-black mb-8 flex items-center gap-3 text-lg uppercase tracking-wider">
            <Users size={24} className="text-yellow-500" /> Hierarquia do Elenco
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(c => (
              <div
                key={c.name}
                className="bg-black/20 p-5 rounded-xl border border-white/5 hover:bg-black/40 transition-all"
              >
                <div
                  className={`${c.color} font-black text-lg mb-2 uppercase tracking-tight`}
                >
                  {c.name}
                </div>
                <div className="text-slate-400 text-xs font-medium leading-relaxed">
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TacticsBoard = () => {
    return (
      <div className="text-center py-16 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/5">
        <div className="text-slate-400 text-sm">
          Módulo Tático em desenvolvimento...
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black/60 text-slate-100 p-6 font-sans backdrop-blur-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Header onFileUpload={handleFileUpload} />

        {/* Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
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
                  {activeTab === 'dashboard' && (
                    <Dashboard players={players} statistics={statistics} />
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
        
        <CompareModal
          show={showCompareModal}
          players={comparePlayers}
          onClose={closeCompareModal}
        />
      </div>
    </div>
  );
};

export default FMAnalyzer;
