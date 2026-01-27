import React from 'react';
import { X, ArrowRightLeft, TrendingUp } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Player } from '../types';

// Fix for Recharts TS error
const RadarAny = Radar as any;
const RadarChartAny = RadarChart as any;
const PolarGridAny = PolarGrid as any;
const PolarAngleAxisAny = PolarAngleAxis as any;
const PolarRadiusAxisAny = PolarRadiusAxis as any;
const LegendAny = Legend as any;

interface CompareSidebarProps {
  show: boolean;
  players: Player[];
  onClose: () => void;
}

const CompareSidebar: React.FC<CompareSidebarProps> = ({
  show,
  players,
  onClose,
}) => {
  if (!show) return null;

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

  // Prepare data for Radar Chart
  const radarData = [
    {
      subject: 'Stretching',
      A: players[0]?.scores.stretching || 0,
      B: players[1]?.scores.stretching || 0,
      fullMark: 20,
    },
    {
      subject: 'Linking',
      A: players[0]?.scores.linking || 0,
      B: players[1]?.scores.linking || 0,
      fullMark: 20,
    },
    {
      subject: 'Dynamic',
      A: players[0]?.scores.dynamic || 0,
      B: players[1]?.scores.dynamic || 0,
      fullMark: 20,
    },
    {
      subject: 'Engaged',
      A: players[0]?.scores.engaged || 0,
      B: players[1]?.scores.engaged || 0,
      fullMark: 20,
    },
    {
      subject: 'Tracking',
      A: players[0]?.scores.tracking || 0,
      B: players[1]?.scores.tracking || 0,
      fullMark: 20,
    },
    {
      subject: 'Outlet',
      A: players[0]?.scores.outlet || 0,
      B: players[1]?.scores.outlet || 0,
      fullMark: 20,
    },
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-slate-900/95 border-l border-white/10 shadow-2xl z-[100] flex flex-col backdrop-blur-xl transition-all animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={20} className="text-blue-500" />
          <h3 className="text-white font-black text-lg tracking-tight">
            Comparação
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
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-6">
          {/* Players Header */}
          <div className="grid grid-cols-2 gap-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`bg-black/20 p-3 rounded-xl border ${index === 0 ? 'border-blue-500/30' : 'border-green-500/30'} text-center relative overflow-hidden`}
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${index === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
                />
                <div className="flex flex-col items-center gap-1 mb-2">
                  <h4 className="text-white font-bold text-sm truncate w-full">
                    {player.name.split(' ')[0]}
                  </h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider border ${getCategoryColor(player.category)}`}
                  >
                    {player.category === 'promessa'
                      ? 'PROM'
                      : player.category === 'titular'
                        ? 'TIT'
                        : player.category === 'elite'
                          ? 'ELITE'
                          : player.category.substring(0, 3).toUpperCase()}
                  </span>
                </div>
                <div className="text-white font-black text-2xl tracking-tighter">
                  {player.mainScore.toFixed(1)}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">
                  Score Geral
                </div>
              </div>
            ))}
          </div>

          {/* Radar Chart */}
          {players.length > 0 && (
            <div className="bg-black/20 p-2 rounded-xl border border-white/5">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChartAny
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={radarData}
                  >
                    <PolarGridAny stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxisAny
                      dataKey="subject"
                      tick={{
                        fill: '#94a3b8',
                        fontSize: 10,
                        fontWeight: 'bold',
                      }}
                    />
                    <PolarRadiusAxisAny
                      angle={30}
                      domain={[0, 20]}
                      tick={false}
                      axisLine={false}
                    />
                    {players[0] && (
                      <RadarAny
                        name={players[0].name.split(' ')[0]}
                        dataKey="A"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    )}
                    {players[1] && (
                      <RadarAny
                        name={players[1].name.split(' ')[0]}
                        dataKey="B"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.3}
                      />
                    )}
                    <LegendAny
                      iconSize={8}
                      wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    />
                  </RadarChartAny>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Attributes Comparison */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-yellow-500" />
              Atributos
            </h4>
            {compareAttributes.map(attr => {
              const player1Value =
                players[0]?.attributes[
                  attr.key as keyof Player['attributes']
                ] || 0;
              const player2Value =
                players[1]?.attributes[
                  attr.key as keyof Player['attributes']
                ] || 0;

              // Only show if at least one player has a significant value or if there's a difference
              if (player1Value < 10 && player2Value < 10) return null;

              return (
                <div
                  key={attr.key}
                  className="bg-black/20 p-2 rounded-lg border border-white/5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Player 1 */}
                    <div className="w-8 text-center">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-bold ${getAttributeColor(player1Value)}`}
                      >
                        {player1Value}
                      </span>
                    </div>

                    {/* Name */}
                    <span className="text-slate-400 text-xs font-medium flex-1 text-center truncate">
                      {attr.name}
                    </span>

                    {/* Player 2 */}
                    <div className="w-8 text-center">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-bold ${getAttributeColor(player2Value)}`}
                      >
                        {player2Value}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareSidebar;
