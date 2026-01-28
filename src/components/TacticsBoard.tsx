import React from 'react';
import { Shield, Users, Play, RotateCw, BarChart3, Trophy } from 'lucide-react';
import { useTactics } from '../hooks/useTactics';
import { Player } from '../types';
import { TACTICAL_METHODOLOGIES } from '../constants';

interface TacticsBoardProps {
  players: Player[];
}

const TacticsBoard: React.FC<TacticsBoardProps> = ({ players }) => {
  const {
    selectedFormation,
    setSelectedFormation,
    tacticalPhase,
    setTacticalPhase,
    lineup,
    formations,
    generateLineup,
    clearLineup,
    getLineupStrength,
    getFormationBalance,
    recommendedFormations,
  } = useTactics(players);

  const getSlotColor = (slot: any) => {
    if (!slot.player) return 'bg-slate-800/50 border-slate-700';

    const category = slot.player.category;
    switch (category) {
      case 'elite':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'titular':
        return 'bg-green-500/20 border-green-500/50';
      case 'promessa':
        return 'bg-purple-500/20 border-purple-500/50';
      case 'rotacao':
        return 'bg-slate-500/20 border-slate-500/50';
      case 'vender':
        return 'bg-red-500/20 border-red-500/50';
      default:
        return 'bg-orange-500/20 border-orange-500/50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 14) return 'text-green-400';
    if (score >= 12) return 'text-blue-400';
    if (score >= 10) return 'text-slate-300';
    return 'text-slate-500';
  };

  const formatPosition = (x: number, y: number) => {
    return { left: `${x}%`, top: `${y}%` };
  };

  const balance = getFormationBalance;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Recommended Formations */}
      {recommendedFormations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl">
          <h3 className="text-white font-black mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Trophy size={16} className="text-yellow-500" />
            Melhores Formações para seu Elenco
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedFormations.map((rec, index) => (
              <button
                key={rec.name}
                onClick={() => {
                  setSelectedFormation(rec.name);
                  setTimeout(() => generateLineup(), 100);
                }}
                className="flex items-center justify-between p-4 bg-black/40 hover:bg-white/10 border border-white/5 hover:border-blue-500/50 rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      index === 0
                        ? 'bg-yellow-500 text-black'
                        : index === 1
                          ? 'bg-slate-300 text-black'
                          : 'bg-orange-700 text-white'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-white font-bold">
                    {rec.name.replace('-', ' ')}
                  </span>
                </div>
                <span className="text-green-400 font-bold text-sm">
                  {rec.score.toFixed(0)} pts
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 shadow-xl">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Formation Selector */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm font-black uppercase tracking-wider">
              Formação:
            </span>
            <select
              value={selectedFormation}
              onChange={e => setSelectedFormation(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {formations.map(formation => (
                <option key={formation} value={formation}>
                  {formation.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Tactical Phase */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm font-black uppercase tracking-wider">
              Fase:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setTacticalPhase('ip')}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                  tacticalPhase === 'ip'
                    ? 'bg-blue-600 text-white'
                    : 'bg-black/40 text-slate-400 hover:bg-black/60'
                }`}
              >
                IP
              </button>
              <button
                onClick={() => setTacticalPhase('oop')}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                  tacticalPhase === 'oop'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/40 text-slate-400 hover:bg-black/60'
                }`}
              >
                OOP
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={generateLineup}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all"
              disabled={players.length === 0}
            >
              <Play size={16} />
              Gerar Time
            </button>
            <button
              onClick={clearLineup}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all"
            >
              <RotateCw size={16} />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Formation Display */}
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
        <div
          className="relative bg-green-900/20 rounded-xl border border-green-500/30"
          style={{ paddingBottom: '40%' }}
        >
          {/* Field Lines */}
          <div className="absolute inset-0 border-2 border-green-700/30 rounded-xl m-4"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-2 border-green-700/30"></div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 border-2 border-green-700/30"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-0.5 border-2 border-green-700/30"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-0.5 border-2 border-green-700/30"></div>
          <div className="absolute left-0 right-0 top-1/4 h-0.5 border-2 border-green-700/30"></div>
          <div className="absolute left-0 right-0 top-3/4 h-0.5 border-2 border-green-700/30"></div>
          <div className="absolute left-0 right-0 top-1/2 h-0.5 border-2 border-green-700/30 border-dashed"></div>

          {/* Players */}
          {lineup.map(slot => (
            <div
              key={slot.id}
              className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${getSlotColor(slot)}`}
              style={formatPosition(slot.x, slot.y)}
              title={
                slot.player
                  ? `${slot.player.name} - ${slot.player.mainScore.toFixed(1)}`
                  : slot.role
              }
            >
              {slot.player ? (
                <div className="text-center">
                  <div className="text-xs font-bold text-white truncate w-10">
                    {slot.player.name.split(' ')[0]}
                  </div>
                  <div
                    className={`text-xs font-bold ${getScoreColor(slot.player.mainScore)}`}
                  >
                    {slot.player.mainScore.toFixed(1)}
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-xs font-bold">
                  {slot.role}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {lineup.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lineup Strength */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 shadow-xl">
            <h3 className="text-white font-black mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
              <BarChart3 size={20} className="text-blue-500" />
              Força do Time
            </h3>
            <div className="text-center">
              <div className="text-3xl font-black text-green-400">
                {getLineupStrength.toFixed(1)}
              </div>
              <div className="text-slate-400 text-sm">Score Médio</div>
            </div>
          </div>

          {/* Formation Balance */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 shadow-xl">
            <h3 className="text-white font-black mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
              <Shield size={20} className="text-purple-500" />
              Balance Tático
            </h3>
            <div className="space-y-2">
              {Object.entries(balance).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs capitalize">
                    {TACTICAL_METHODOLOGIES[
                      key as keyof typeof TACTICAL_METHODOLOGIES
                    ] || key}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-slate-300 text-xs font-bold">
                    {value.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {lineup.length === 0 && (
        <div className="text-center py-16 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/5">
          <Users size={48} className="text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400 mb-2">
            Nenhum time montado
          </h3>
          <p className="text-slate-500 text-sm">
            Selecione uma formação e clique em "Gerar Time" para montar o time
            ideal
          </p>
        </div>
      )}
    </div>
  );
};

export default TacticsBoard;
