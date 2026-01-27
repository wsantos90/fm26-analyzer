import React from 'react';
import { X, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { Player } from '../types';

interface CompareModalProps {
  show: boolean;
  players: Player[];
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({
  show,
  players,
  onClose,
}) => {
  if (!show || players.length === 0) return null;

  const getAttributeColor = (val: number) => {
    if (val >= 16) return 'bg-green-500 text-black font-bold';
    if (val >= 13) return 'bg-green-800 text-green-100 font-bold';
    if (val >= 10) return 'bg-slate-700 text-white';
    if (val >= 6) return 'bg-slate-800 text-slate-400';
    return 'bg-red-900 text-red-200';
  };

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
        return 'border-slate-500 text-slate-500 bg-slate-500/10';
    }
  };

  const compareAttributes = [
    { name: 'Velocidade', key: 'pace' },
    { name: 'Aceleração', key: 'acceleration' },
    { name: 'Resistência', key: 'stamina' },
    { name: 'Força', key: 'strength' },
    { name: 'Equilíbrio', key: 'balance' },
    { name: 'Agilidade', key: 'agility' },
    { name: 'Pulo', key: 'jumping' },
    { name: 'Trabalho', key: 'workRate' },
    { name: 'Espírito', key: 'teamwork' },
    { name: 'Agressão', key: 'aggression' },
    { name: 'Decisões', key: 'decisions' },
    { name: 'Visão', key: 'vision' },
    { name: 'Passe', key: 'passing' },
    { name: 'Drible', key: 'dribbling' },
    { name: 'Finalização', key: 'finishing' },
    { name: 'Cabeceio', key: 'heading' },
    { name: 'Desarme', key: 'tackling' },
    { name: 'Marcação', key: 'marking' },
    { name: 'Posicionamento', key: 'positioning' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6 transition-all animate-in fade-in zoom-in-95 duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900/95 w-full max-w-6xl max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col backdrop-blur-xl overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ArrowRightLeft size={24} className="text-blue-500" />
            <h3 className="text-white font-black text-2xl tracking-tight">
              Comparação de Jogadores
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Players Header */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="bg-black/20 p-4 rounded-xl border border-white/5"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold text-lg">
                    {player.name}
                  </h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider border ${getCategoryColor(player.category)}`}
                  >
                    {player.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-slate-400 text-sm space-y-1">
                  <div>
                    {player.age} anos • {player.nat}
                  </div>
                  <div>{player.team}</div>
                  <div className="text-green-400 font-bold">
                    Score: {player.mainScore.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Attributes Comparison */}
          <div className="space-y-3">
            {compareAttributes.map(attr => {
              const player1Value =
                players[0]?.attributes[
                  attr.key as keyof Player['attributes']
                ] || 0;
              const player2Value =
                players[1]?.attributes[
                  attr.key as keyof Player['attributes']
                ] || 0;
              const diff = player1Value - player2Value;
              const isBetter = diff > 0;

              return (
                <div
                  key={attr.key}
                  className="bg-black/20 p-4 rounded-xl border border-white/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm font-medium w-32">
                      {attr.name}
                    </span>

                    <div className="flex items-center gap-8 flex-1">
                      {/* Player 1 */}
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-slate-500 text-xs w-20 truncate">
                          {players[0]?.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getAttributeColor(player1Value)}`}
                        >
                          {player1Value}
                        </span>
                      </div>

                      {/* Difference */}
                      <div className="flex items-center justify-center w-20">
                        {diff !== 0 && (
                          <div
                            className={`flex items-center gap-1 text-xs font-bold ${isBetter ? 'text-green-400' : 'text-red-400'}`}
                          >
                            <TrendingUp
                              size={12}
                              className={isBetter ? '' : 'rotate-180'}
                            />
                            {Math.abs(diff)}
                          </div>
                        )}
                      </div>

                      {/* Player 2 */}
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span
                          className={`text-xs px-2 py-1 rounded ${getAttributeColor(player2Value)}`}
                        >
                          {player2Value}
                        </span>
                        <span className="text-slate-500 text-xs w-20 truncate text-right">
                          {players[1]?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scores Comparison */}
          <div className="mt-6 bg-black/20 p-4 rounded-xl border border-white/5">
            <h4 className="text-white font-bold mb-4">Scores Táticos</h4>
            <div className="grid grid-cols-2 gap-6">
              {players.map((player, index) => (
                <div key={player.id}>
                  <h5 className="text-slate-400 text-sm mb-2">{player.name}</h5>
                  <div className="space-y-2">
                    {Object.entries(player.scores).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span className="text-slate-500 text-xs capitalize">
                          {key === 'gk'
                            ? 'Goleiro'
                            : key === 'stretching'
                              ? 'Amplitude'
                              : key === 'linking'
                                ? 'Ligação'
                                : key === 'dynamic'
                                  ? 'Dinâmica'
                                  : key === 'engaged'
                                    ? 'Combate'
                                    : key === 'tracking'
                                      ? 'Cobertura'
                                      : key === 'outlet'
                                        ? 'Referência'
                                        : key}
                        </span>
                        <span className="text-blue-400 font-bold text-sm">
                          {value.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
