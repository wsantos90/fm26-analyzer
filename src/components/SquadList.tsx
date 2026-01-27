import React from 'react';
import { Search, Filter, Trophy } from 'lucide-react';
import { Player } from '../types';

interface SquadListProps {
  players: Player[];
  onPlayerClick: (player: Player, positionContext?: string) => void;
  onCompareClick?: (players: Player[]) => void;
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  uniqueTeams: string[];
  uniqueCategories: string[];
  comparePlayers: Player[];
  addToCompare?: (player: Player) => void;
  removeFromCompare?: (playerId: string) => void;
}

const SquadList: React.FC<SquadListProps> = ({
  players,
  onPlayerClick,
  onCompareClick,
  selectedTeam,
  setSelectedTeam,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  uniqueTeams,
  uniqueCategories,
  comparePlayers,
  addToCompare,
  removeFromCompare,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'elite':
        return 'border-yellow-500 text-yellow-500 bg-yellow-500/10';
      case 'titular':
        return 'border-green-500 text-green-500 bg-green-500/10';
      case 'promessa':
        return 'border-purple-500 text-purple-500 bg-purple-500/10';
      case 'rotacao':
        return 'border-slate-500 text-slate-500 bg-slate-500/10';
      case 'vender':
        return 'border-red-500 text-red-500 bg-red-500/10';
      default:
        return 'border-orange-500 text-orange-500 bg-orange-500/10';
    }
  };

  const getTeamTypeColor = (teamType: string) => {
    switch (teamType) {
      case 'main':
        return 'bg-blue-600';
      case 'youth':
        return 'bg-purple-600';
      case 'reserve':
        return 'bg-slate-600';
      case 'loan':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Filters */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="space-y-3">
            <label className="text-slate-400 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <Search size={14} />
              Buscar Jogador
            </label>
            <input
              type="text"
              placeholder="Nome, time ou posição..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Team Filter */}
          <div className="space-y-3">
            <label className="text-slate-400 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <Filter size={14} />
              Filtrar por Time
            </label>
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="all">Todos os Times</option>
              <option value="main">Principal</option>
              <option value="youth">Sub-19/20</option>
              <option value="reserve">Reserva</option>
              <option value="loan">Emprestado</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <label className="text-slate-400 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <Trophy size={14} />
              Filtrar por Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="all">Todas</option>
              <option value="elite">Elite</option>
              <option value="titular">Titular</option>
              <option value="rotacao">Rotação</option>
              <option value="promessa">Promessa</option>
              <option value="vender">Vender</option>
              <option value="baixo_nivel">Nível Baixo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map(player => (
          <div
            key={player.id}
            onClick={() => onPlayerClick(player)}
            className="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-slate-900/80 transition-all cursor-pointer group"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-white font-bold text-sm mb-1 group-hover:text-blue-400 transition-colors">
                  {player.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{player.age} anos</span>
                  <span>•</span>
                  <span>{player.nat}</span>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider border ${getCategoryColor(player.category)}`}
              >
                {player.category === 'baixo_nivel'
                  ? 'Nível Baixo'
                  : player.category}
              </span>
            </div>

            {/* Team */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-2 h-2 rounded-full ${getTeamTypeColor(player.teamType)}`}
              ></div>
              <span className="text-xs text-slate-400">{player.team}</span>
            </div>

            {/* Positions */}
            <div className="flex flex-wrap gap-1 mb-3">
              {player.positions.primary.slice(0, 3).map((pos, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-black/40 text-blue-400 px-2 py-1 rounded border border-blue-500/30"
                >
                  {pos.toUpperCase()}
                </span>
              ))}
            </div>

            {/* Score */}
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <span className="text-xs text-slate-500">Score Principal</span>
              <span className="text-lg font-black text-green-400">
                {player.mainScore.toFixed(1)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onPlayerClick(player)}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors"
              >
                Ver
              </button>
              {onCompareClick && (
                <button
                  onClick={() => {
                    if (
                      comparePlayers.length < 2 &&
                      !comparePlayers.some(p => p.id === player.id)
                    ) {
                      addToCompare?.(player);
                      if (comparePlayers.length === 1) {
                        onCompareClick([...comparePlayers, player]);
                      }
                    }
                  }}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    comparePlayers.some(p => p.id === player.id)
                      ? 'bg-orange-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                  disabled={
                    comparePlayers.length >= 2 &&
                    !comparePlayers.some(p => p.id === player.id)
                  }
                >
                  {comparePlayers.some(p => p.id === player.id)
                    ? 'Comparado'
                    : 'Comparar'}
                </button>
              )}
            </div>

            {/* Best Role */}
            <div className="mt-2">
              <span className="text-xs text-slate-500">Melhor Posição:</span>
              <span className="ml-2 text-xs font-bold text-blue-400">
                {player.bestRole}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {players.length === 0 && (
        <div className="text-center py-16 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/5">
          <div className="text-slate-400 text-sm">
            Nenhum jogador encontrado com os filtros selecionados.
          </div>
        </div>
      )}
    </div>
  );
};

export default SquadList;
