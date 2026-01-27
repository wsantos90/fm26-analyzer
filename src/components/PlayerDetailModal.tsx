import React from 'react';
import { X } from 'lucide-react';
import { Player } from '../types';

interface PlayerDetailModalProps {
  show: boolean;
  player: Player | null;
  positionContext: string;
  onClose: () => void;
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  show,
  player,
  positionContext,
  onClose,
}) => {
  if (!show || !player) return null;

  const p = player;

  const KEY_ATTRIBUTES: Record<string, string[]> = {
    gk: ['reflexes', 'handling', 'kicking', 'positioning', 'oneOnOne'],
    dc: [
      'tackling',
      'marking',
      'heading',
      'positioning',
      'jumping',
      'strength',
    ],
    dl: ['tackling', 'marking', 'positioning', 'pace', 'stamina', 'crossing'],
    dr: ['tackling', 'marking', 'positioning', 'pace', 'stamina', 'crossing'],
    dmc: [
      'tackling',
      'marking',
      'positioning',
      'passing',
      'stamina',
      'workRate',
    ],
    mc: [
      'passing',
      'vision',
      'firstTouch',
      'decisions',
      'technique',
      'stamina',
    ],
    ml: [
      'crossing',
      'dribbling',
      'acceleration',
      'pace',
      'technique',
      'passing',
    ],
    mr: [
      'crossing',
      'dribbling',
      'acceleration',
      'pace',
      'technique',
      'passing',
    ],
    aml: ['dribbling', 'finishing', 'acceleration', 'pace', 'flair', 'agility'],
    amr: ['dribbling', 'finishing', 'acceleration', 'pace', 'flair', 'agility'],
    amc: ['passing', 'vision', 'technique', 'dribbling', 'finishing', 'flair'],
    st: [
      'finishing',
      'anticipation',
      'composure',
      'acceleration',
      'heading',
      'pace',
    ],
  };

  const mainPos = positionContext || p.positions.primary[0] || 'mc';
  const keyAttrs = KEY_ATTRIBUTES[mainPos] || [];

  const allAttributes = [
    {
      name: 'Aceleração',
      value: p.attributes.acceleration,
      type: 'Físico',
      key: 'acceleration',
    },
    {
      name: 'Agilidade',
      value: p.attributes.agility,
      type: 'Físico',
      key: 'agility',
    },
    {
      name: 'Equilíbrio',
      value: p.attributes.balance,
      type: 'Físico',
      key: 'balance',
    },
    {
      name: 'Pulo',
      value: p.attributes.jumping,
      type: 'Físico',
      key: 'jumping',
    },
    {
      name: 'Velocidade',
      value: p.attributes.pace,
      type: 'Físico',
      key: 'pace',
    },
    {
      name: 'Resistência',
      value: p.attributes.stamina,
      type: 'Físico',
      key: 'stamina',
    },
    {
      name: 'Força',
      value: p.attributes.strength,
      type: 'Físico',
      key: 'strength',
    },
    {
      name: 'Agressão',
      value: p.attributes.aggression,
      type: 'Mental',
      key: 'aggression',
    },
    {
      name: 'Antecipação',
      value: p.attributes.anticipation,
      type: 'Mental',
      key: 'anticipation',
    },
    {
      name: 'Bravura',
      value: p.attributes.bravery,
      type: 'Mental',
      key: 'bravery',
    },
    {
      name: 'Frieza',
      value: p.attributes.composure,
      type: 'Mental',
      key: 'composure',
    },
    {
      name: 'Concentração',
      value: p.attributes.concentration,
      type: 'Mental',
      key: 'concentration',
    },
    {
      name: 'Decisões',
      value: p.attributes.decisions,
      type: 'Mental',
      key: 'decisions',
    },
    {
      name: 'Determinação',
      value: p.attributes.determination,
      type: 'Mental',
      key: 'determination',
    },
    {
      name: 'Visão',
      value: p.attributes.vision,
      type: 'Mental',
      key: 'vision',
    },
    {
      name: 'Trabalho em Equipe',
      value: p.attributes.teamwork,
      type: 'Mental',
      key: 'teamwork',
    },
    {
      name: 'Posicionamento',
      value: p.attributes.positioning,
      type: 'Mental',
      key: 'positioning',
    },
    {
      name: 'Improviso',
      value: p.attributes.flair,
      type: 'Mental',
      key: 'flair',
    },
    {
      name: 'Cruzamento',
      value: p.attributes.crossing,
      type: 'Técnico',
      key: 'crossing',
    },
    {
      name: 'Drible',
      value: p.attributes.dribbling,
      type: 'Técnico',
      key: 'dribbling',
    },
    {
      name: 'Finalização',
      value: p.attributes.finishing,
      type: 'Técnico',
      key: 'finishing',
    },
    {
      name: 'Prim. Toque',
      value: p.attributes.firstTouch,
      type: 'Técnico',
      key: 'firstTouch',
    },
    {
      name: 'Cabeceio',
      value: p.attributes.heading,
      type: 'Técnico',
      key: 'heading',
    },
    {
      name: 'Chute Longe',
      value: p.attributes.longShots,
      type: 'Técnico',
      key: 'longShots',
    },
    {
      name: 'Marcação',
      value: p.attributes.marking,
      type: 'Técnico',
      key: 'marking',
    },
    {
      name: 'Passe',
      value: p.attributes.passing,
      type: 'Técnico',
      key: 'passing',
    },
    {
      name: 'Desarme',
      value: p.attributes.tackling,
      type: 'Técnico',
      key: 'tackling',
    },
    {
      name: 'Técnica',
      value: p.attributes.technique,
      type: 'Técnico',
      key: 'technique',
    },
  ].sort((a, b) => b.value - a.value);

  const strengths = allAttributes.filter(a => a.value >= 14).slice(0, 6);
  const trainingSuggestions = allAttributes
    .filter(a => keyAttrs.includes(a.key))
    .filter(a => a.value < 13)
    .sort((a, b) => a.value - b.value)
    .slice(0, 4);

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

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-[100] p-6 pt-20 transition-all animate-in fade-in zoom-in-95 duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900/95 w-full max-w-5xl max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col backdrop-blur-xl overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-white font-black text-3xl tracking-tight">
                {p.name}
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-widest border ${getCategoryColor(p.category)}`}
              >
                {p.category.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <span>{p.age} anos</span>
              <span>•</span>
              <span>{p.nat}</span>
              <span>•</span>
              <span>{p.team}</span>
              <span>•</span>
              <span className="text-green-400 font-bold">
                {p.mainScore.toFixed(1)}
              </span>
            </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attributes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Physical */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <h4 className="text-blue-400 font-black text-sm uppercase tracking-wider mb-4">
                  Atributos Físicos
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allAttributes
                    .filter(a => a.type === 'Físico')
                    .map(attr => (
                      <div
                        key={attr.key}
                        className="flex justify-between items-center"
                      >
                        <span className="text-slate-400 text-xs">
                          {attr.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getAttributeColor(attr.value)}`}
                        >
                          {attr.value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Mental */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <h4 className="text-purple-400 font-black text-sm uppercase tracking-wider mb-4">
                  Atributos Mentais
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allAttributes
                    .filter(a => a.type === 'Mental')
                    .map(attr => (
                      <div
                        key={attr.key}
                        className="flex justify-between items-center"
                      >
                        <span className="text-slate-400 text-xs">
                          {attr.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getAttributeColor(attr.value)}`}
                        >
                          {attr.value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Technical */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <h4 className="text-green-400 font-black text-sm uppercase tracking-wider mb-4">
                  Atributos Técnicos
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allAttributes
                    .filter(a => a.type === 'Técnico')
                    .map(attr => (
                      <div
                        key={attr.key}
                        className="flex justify-between items-center"
                      >
                        <span className="text-slate-400 text-xs">
                          {attr.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getAttributeColor(attr.value)}`}
                        >
                          {attr.value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Analysis */}
            <div className="space-y-6">
              {/* Strengths */}
              {strengths.length > 0 && (
                <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                  <h4 className="text-green-400 font-black text-sm uppercase tracking-wider mb-4">
                    Pontos Fortes
                  </h4>
                  <div className="space-y-2">
                    {strengths.map((attr, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <span className="text-slate-400 text-xs">
                          {attr.name}
                        </span>
                        <span className="text-green-400 font-bold text-sm">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Training Suggestions */}
              {trainingSuggestions.length > 0 && (
                <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                  <h4 className="text-yellow-400 font-black text-sm uppercase tracking-wider mb-4">
                    Foco de Treino
                  </h4>
                  <div className="space-y-2">
                    {trainingSuggestions.map((attr, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <span className="text-slate-400 text-xs">
                          {attr.name}
                        </span>
                        <span className="text-yellow-400 font-bold text-sm">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scores */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <h4 className="text-blue-400 font-black text-sm uppercase tracking-wider mb-4">
                  Scores Táticos
                </h4>
                <div className="space-y-2">
                  {Object.entries(p.scores).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center"
                    >
                      <span className="text-slate-400 text-xs capitalize">
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

              {/* Positions */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <h4 className="text-purple-400 font-black text-sm uppercase tracking-wider mb-4">
                  Posições
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-500 text-xs uppercase">
                      Primárias:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.positions.primary.map((pos, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30"
                        >
                          {pos.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  {p.positions.secondary.length > 0 && (
                    <div>
                      <span className="text-slate-500 text-xs uppercase">
                        Secundárias:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.positions.secondary.map((pos, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-slate-500/20 text-slate-400 px-2 py-1 rounded border border-slate-500/30"
                          >
                            {pos.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailModal;
