import React, { useMemo } from 'react';
import { Player } from '../types';
import { POS_LABELS } from '../constants';
import {
  Trophy,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Shield,
  Zap,
} from 'lucide-react';

interface ClubStructureProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

const ClubStructure: React.FC<ClubStructureProps> = ({
  players,
  onPlayerClick,
}) => {
  // Organize players by team type
  const squads = useMemo(() => {
    const main = players
      .filter(p => p.teamType === 'main')
      .sort((a, b) => b.mainScore - a.mainScore);
    const reserve = players
      .filter(p => p.teamType === 'reserve')
      .sort((a, b) => b.mainScore - a.mainScore);
    const youth = players
      .filter(p => p.teamType === 'youth')
      .sort((a, b) => b.mainScore - a.mainScore);
    const loan = players
      .filter(p => p.teamType === 'loan')
      .sort((a, b) => b.mainScore - a.mainScore);

    return { main, reserve, youth, loan };
  }, [players]);

  // Calculate stats for Main Squad to use as benchmark
  const mainStats = useMemo(() => {
    if (squads.main.length === 0)
      return { avgScore: 0, minScore: 0, lowestTitularScore: 0 };
    const scores = squads.main.map(p => p.mainScore);
    return {
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      minScore: Math.min(...scores),
      lowestTitularScore: scores[Math.min(10, scores.length - 1)] || 0, // Approx 11th player
    };
  }, [squads.main]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'elite':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'titular':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'promessa':
        return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case 'rotacao':
        return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      default:
        return 'text-slate-400 border-slate-400/30 bg-slate-400/10';
    }
  };

  const PlayerCard = ({
    player,
    isMain = false,
  }: {
    player: Player;
    isMain?: boolean;
  }) => {
    // Check if non-main player is better than main squad average or lowest titular
    const isPromotable =
      !isMain &&
      (player.mainScore >= mainStats.lowestTitularScore ||
        player.category === 'elite' ||
        player.category === 'titular');

    return (
      <div
        onClick={() => onPlayerClick(player)}
        className={`
          relative group p-3 rounded-lg border transition-all cursor-pointer mb-2
          ${
            isPromotable
              ? 'bg-green-900/20 border-green-500/50 hover:bg-green-900/30'
              : 'bg-slate-800/50 border-white/5 hover:bg-slate-800 hover:border-blue-500/30'
          }
        `}
      >
        {isPromotable && (
          <div className="absolute -right-1 -top-1 bg-green-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg z-10 animate-bounce">
            <ArrowUpRight size={10} />
            PROMOVER
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm text-white truncate">
                {player.name}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">
                {player.age}a
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase font-semibold">
                {player.bestPosition
                  ? POS_LABELS[player.bestPosition.toLowerCase()] ||
                    player.bestPosition
                  : player.positions.primary[0]}
              </span>
              <span
                className={`text-[10px] px-1.5 rounded border ${getCategoryColor(
                  player.category
                )}`}
              >
                {player.category === 'baixo_nivel' ? 'BAIXO' : player.category}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end pl-2">
            <span className="text-lg font-black text-white leading-none">
              {player.mainScore.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-500">SCORE</span>
          </div>
        </div>
      </div>
    );
  };

  const SquadColumn = ({
    title,
    players,
    icon: Icon,
    color,
    isMain = false,
  }: {
    title: string;
    players: Player[];
    icon: any;
    color: string;
    isMain?: boolean;
  }) => (
    <div className="flex flex-col h-full bg-slate-900/40 border border-white/5 rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b border-white/5 ${color} bg-opacity-10`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Icon size={18} className={color.replace('bg-', 'text-')} />
            <h3 className="font-black text-white uppercase tracking-wider">
              {title}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-black/40 px-2 py-1 rounded">
            {players.length} JOGADORES
          </span>
        </div>
        {isMain && (
          <div className="flex gap-4 mt-2 text-xs text-slate-400">
            <span>
              Média:{' '}
              <b className="text-white">{mainStats.avgScore.toFixed(1)}</b>
            </span>
            <span>
              Corte Titular:{' '}
              <b className="text-white">
                {mainStats.lowestTitularScore.toFixed(1)}
              </b>
            </span>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {players.length > 0 ? (
          players.map(player => (
            <PlayerCard key={player.id} player={player} isMain={isMain} />
          ))
        ) : (
          <div className="h-32 flex flex-col items-center justify-center text-slate-600">
            <Shield size={32} className="mb-2 opacity-20" />
            <span className="text-sm">Nenhum jogador</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] animate-in fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
        <SquadColumn
          title="Time Principal"
          players={squads.main}
          icon={Trophy}
          color="bg-blue-600"
          isMain={true}
        />
        <SquadColumn
          title="Time Reserva (B)"
          players={squads.reserve}
          icon={Zap}
          color="bg-slate-600"
        />
        <SquadColumn
          title="Sub-19 / Sub-20"
          players={squads.youth}
          icon={TrendingUp}
          color="bg-purple-600"
        />
        <SquadColumn
          title="Emprestados"
          players={squads.loan}
          icon={AlertCircle}
          color="bg-orange-600"
        />
      </div>
    </div>
  );
};

export default ClubStructure;
