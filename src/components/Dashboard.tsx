import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Trophy, Users, TrendingUp, Activity } from 'lucide-react';
import { Player } from '../types';

interface DashboardProps {
  players: Player[];
  statistics: any;
}

const Dashboard: React.FC<DashboardProps> = ({ players, statistics }) => {
  const categoryData = Object.entries(statistics.byCategory).map(
    ([category, count]) => ({
      name: category.replace('_', ' ').toUpperCase(),
      count: count as number,
      color:
        category === 'elite'
          ? '#fbbf24'
          : category === 'titular'
            ? '#34d399'
            : category === 'promessa'
              ? '#a78bfa'
              : '#64748b',
    })
  );

  const teamTypeData = Object.entries(statistics.byTeamType).map(
    ([teamType, count]) => ({
      name:
        teamType === 'main'
          ? 'Principal'
          : teamType === 'youth'
            ? 'Sub-19/20'
            : teamType === 'reserve'
              ? 'Reserva'
              : 'Emprestado',
      count: count as number,
    })
  );

  const topPlayers = [...players]
    .sort((a, b) => b.mainScore - a.mainScore)
    .slice(0, 5)
    .map((player, index) => ({
      name:
        player.name.length > 15
          ? player.name.substring(0, 15) + '...'
          : player.name,
      score: parseFloat(player.mainScore.toFixed(1)),
      category: player.category,
    }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:bg-slate-900/80 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <Users size={24} className="text-blue-500" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {statistics.total}
          </div>
          <div className="text-xs text-slate-400 mt-2">Jogadores no elenco</div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:bg-slate-900/80 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <Trophy size={24} className="text-yellow-500" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              Elite
            </span>
          </div>
          <div className="text-3xl font-black text-yellow-400">
            {statistics.byCategory.elite || 0}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Jogadores de classe mundial
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:bg-slate-900/80 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={24} className="text-green-500" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              Média
            </span>
          </div>
          <div className="text-3xl font-black text-green-400">
            {statistics.averageScore.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Score médio do elenco
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:bg-slate-900/80 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <Activity size={24} className="text-purple-500" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              Idade
            </span>
          </div>
          <div className="text-3xl font-black text-purple-400">
            {statistics.averageAge.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Idade média do elenco
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
          <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-wider">
            <Trophy size={20} className="text-yellow-500" />
            Distribuição por Categoria
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Type Distribution */}
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
          <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-wider">
            <Users size={20} className="text-blue-500" />
            Distribuição por Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamTypeData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Players & Skills Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Players */}
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
          <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-wider">
            <Trophy size={20} className="text-yellow-500" />
            Top 5 Jogadores
          </h3>
          <div className="space-y-3">
            {topPlayers.map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-blue-400">
                    #{index + 1}
                  </span>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-green-400">
                    {player.score}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded font-black uppercase ${
                      player.category === 'elite'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : player.category === 'titular'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {player.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Radar */}
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
          <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-wider">
            <Activity size={20} className="text-purple-500" />
            Perfil Médio do Elenco
          </h3>
          <div className="flex items-center justify-center h-64 text-slate-400">
            Radar Chart em desenvolvimento...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
