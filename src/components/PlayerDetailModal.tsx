import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Target,
  Activity,
  Shield,
  Swords,
  Dumbbell,
  Brain,
  Zap,
} from 'lucide-react';
import { Player } from '../types';
import {
  ATTRIBUTE_LIST,
  ATTRIBUTE_CATEGORIES,
  POSITIONS_PT_BR,
  PT_ALIAS_TO_ID,
} from '../constants';
import { FM26_ROLES, POSITION_TO_ROLES } from '../data/roles';
import {
  SUPPORTED_POSITIONS,
  calculatePositionScore,
  getBestPositions,
  getBestRoleAttributes,
} from '../utils/positionAnalysis';

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
  const [activeTab, setActiveTab] = useState<
    'overview' | 'analysis' | 'roles' | 'training'
  >('overview');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<{
    name: string;
    type: 'ip' | 'oop' | 'gk';
  } | null>(null);

  useEffect(() => {
    if (player) {
      setActiveTab('overview');
      // Resolve position ID (handle PT aliases like 'ATA' -> 'ST')
      const primaryPos = player.positions.primary[0];
      const resolvedPrimary = PT_ALIAS_TO_ID[primaryPos] || primaryPos || 'MC';

      const initialPos =
        positionContext && SUPPORTED_POSITIONS.includes(positionContext)
          ? positionContext
          : resolvedPrimary;

      setSelectedPosition(initialPos);
      setSelectedRole(null);
    }
  }, [player, positionContext]);

  if (!show || !player) return null;

  const p = player;
  const bestPositions = getBestPositions(p);

  const selectedPosAttributes = getBestRoleAttributes(
    p.attributes as unknown as Record<string, number>,
    selectedPosition
  );
  const selectedPosScore = calculatePositionScore(
    p.attributes as unknown as Record<string, number>,
    selectedPosition
  );

  // Get top 3 roles
  const getTopRoles = (type: 'ip' | 'oop' | 'gk') => {
    const scores = p.fm26Scores[type];
    const posId = PT_ALIAS_TO_ID[selectedPosition] || selectedPosition;

    // Get valid roles for this position and type
    const validRoles = POSITION_TO_ROLES[posId]?.[type] || [];

    // Filter scores to only include valid roles
    return Object.entries(scores)
      .filter(([role]) => validRoles.includes(role))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  const topIpRoles = getTopRoles('ip');
  const topOopRoles = getTopRoles('oop');
  const topGkRoles = getTopRoles('gk');

  const allAttributes = ATTRIBUTE_LIST.map(attr => ({
    name: attr.label,
    value: p.attributes[attr.key as keyof typeof p.attributes] || 0,
    type: attr.category,
    key: attr.key,
  }));

  const getTrainingPhase = (age: number) => {
    if (age < 18) return 'Desenvolvimento Físico (Base)';
    if (age <= 21) return 'Transição / Técnico';
    return 'Performance / Mental';
  };

  const getTrainingAdvice = (age: number) => {
    if (age < 18)
      return 'Prioridade total em atributos Físicos e Posição Geral. Focar em Agilidade, Equilíbrio e Força.';
    if (age <= 21)
      return 'Focar em deficiências Técnicas específicas da função e preparação para o time principal. Considerar empréstimos.';
    return 'Refinamento de Atributos Mentais e desenvolvimento de Traços (Traits). Alternar foco entre Mental e Técnico.';
  };

  const getUniversalAttributes = (pos: string) => {
    const baseUniversals = [
      'acceleration',
      'pace',
      'dribbling',
      'stamina',
      'anticipation',
      'jumping',
      'balance',
      'workRate',
      'determination',
      'positioning',
    ];

    const posId = PT_ALIAS_TO_ID[pos] || pos;
    const excluded: string[] = [];

    // Exclude Dribbling for Defenders/DMs (unless specifically required by role) and GKs
    if (['DC', 'GK', 'DM'].includes(posId)) {
      excluded.push('dribbling');
    }

    // Exclude Positioning (Defensive) for Attackers
    if (['ST', 'AMC', 'AML', 'AMR'].includes(posId)) {
      excluded.push('positioning');
    }

    return baseUniversals.filter(attr => !excluded.includes(attr));
  };

  const UNIVERSAL_ATTRIBUTES = getUniversalAttributes(selectedPosition);

  const getTrainingColor = (val: number) => {
    if (val >= 15) return 'text-green-400';
    if (val >= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrainingBg = (val: number) => {
    if (val >= 15) return 'bg-green-500/10 border-green-500/30';
    if (val >= 10) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  // For overview tab - calculate generic strengths
  const strengths = allAttributes
    .sort((a, b) => b.value - a.value)
    .filter(a => a.value >= 14)
    .slice(0, 6);

  const getAttributeColor = (
    val: number,
    key: string,
    isKey: boolean = false
  ) => {
    // Role analysis mode
    if (activeTab === 'roles' && selectedRole) {
      // @ts-ignore
      const roleWeights = FM26_ROLES[selectedRole.type][selectedRole.name];
      const weight = roleWeights ? roleWeights[key] : 0;

      if (weight >= 5)
        return 'bg-yellow-500 text-black font-black ring-2 ring-yellow-500/50';
      if (weight >= 4)
        return 'bg-green-500 text-black font-bold ring-1 ring-green-500/50';
      if (weight >= 3) return 'bg-blue-500 text-white font-bold';
      if (weight > 0) return 'bg-slate-700 text-white';
      return 'bg-slate-800/30 text-slate-600';
    }

    // If we are in analysis mode and this is a key attribute, make it pop more
    if (activeTab === 'analysis') {
      if (isKey) {
        if (val >= 15)
          return 'bg-yellow-500 text-black font-black ring-2 ring-yellow-500/50';
        if (val >= 12)
          return 'bg-yellow-600 text-white font-bold ring-1 ring-yellow-500/30';
        return 'bg-yellow-900/50 text-yellow-200 font-bold border border-yellow-500/30';
      }
      // Non-key attributes in analysis mode should be dimmer
      return 'bg-slate-800/50 text-slate-500';
    }

    // Standard coloring for overview
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

  const renderAttributeSection = (
    title: string,
    type: string,
    colorClass: string
  ) => (
    <div className="bg-black/20 p-5 rounded-xl border border-white/5">
      <h4
        className={`${colorClass} font-black text-sm uppercase tracking-wider mb-4 flex items-center justify-between`}
      >
        {title}
        {activeTab === 'analysis' && (
          <span className="text-[10px] opacity-60 font-normal normal-case">
            Destaques para {selectedPosition}
          </span>
        )}
        {activeTab === 'roles' && selectedRole && (
          <span className="text-[10px] opacity-60 font-normal normal-case">
            {selectedRole.name} (
            {selectedRole.type === 'ip'
              ? 'Com Bola'
              : selectedRole.type === 'oop'
                ? 'Sem Bola'
                : 'Goleiro'}
            )
          </span>
        )}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allAttributes
          .filter(a => a.type === type)
          .map(attr => {
            const isKey =
              activeTab === 'analysis' &&
              selectedPosAttributes.includes(attr.key);
            return (
              <div
                key={attr.key}
                className={`flex justify-between items-center p-1 rounded ${isKey ? 'bg-white/5' : ''}`}
              >
                <span
                  className={`text-xs ${isKey ? 'text-white font-bold' : 'text-slate-400'}`}
                >
                  {attr.name}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${getAttributeColor(attr.value, attr.key, isKey)}`}
                >
                  {attr.value}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );

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
                Main Score: {p.mainScore.toFixed(1)}
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/5 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Activity size={16} />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'analysis'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Target size={16} />
            Análise de Posição
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Swords size={16} />
            Funções Táticas
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'training'
                ? 'border-green-500 text-green-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell size={16} />
            Treino
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Attributes */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'training' ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {/* Universal Attributes */}
                  <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                    <h4 className="text-blue-400 font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Activity size={18} />
                      Atributos Universais (Meta FM26)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {UNIVERSAL_ATTRIBUTES.map(key => {
                        const attr = allAttributes.find(a => a.key === key);
                        if (!attr) return null;
                        return (
                          <div
                            key={key}
                            className="flex justify-between items-center p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <span className="text-xs text-slate-300 font-medium">
                              {attr.name}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded font-black ${getTrainingColor(attr.value)} ${getTrainingBg(attr.value)}`}
                            >
                              {attr.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Position Focus */}
                  <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                    <h4 className="text-green-400 font-black text-sm uppercase tracking-wider mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target size={18} />
                        Foco da Posição: {POSITIONS_PT_BR[selectedPosition]}
                      </div>
                      <select
                        value={selectedPosition}
                        onChange={e => setSelectedPosition(e.target.value)}
                        className="bg-black/40 border border-green-500/30 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-green-500 font-normal normal-case"
                      >
                        {Object.entries(POSITIONS_PT_BR).map(([key, label]) => (
                          <option key={key} value={key}>
                            {key} - {label}
                          </option>
                        ))}
                      </select>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {allAttributes
                        .filter(
                          a =>
                            selectedPosAttributes.includes(a.key) &&
                            !UNIVERSAL_ATTRIBUTES.includes(a.key)
                        )
                        .map(attr => (
                          <div
                            key={attr.key}
                            className="flex justify-between items-center p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <span className="text-xs text-slate-300 font-medium">
                              {attr.name}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded font-black ${getTrainingColor(attr.value)} ${getTrainingBg(attr.value)}`}
                            >
                              {attr.value}
                            </span>
                          </div>
                        ))}
                    </div>
                    {allAttributes.filter(
                      a =>
                        selectedPosAttributes.includes(a.key) &&
                        !UNIVERSAL_ATTRIBUTES.includes(a.key)
                    ).length === 0 && (
                      <div className="text-slate-500 text-xs italic p-2 bg-white/5 rounded mt-2 text-center">
                        Todos os atributos principais desta posição já estão
                        cobertos nos Universais.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {activeTab === 'analysis' && (
                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                          <Target size={20} />
                        </div>
                        <div>
                          <label className="text-xs text-purple-300 font-bold uppercase block mb-1">
                            Selecionar Posição para Análise
                          </label>
                          <select
                            value={selectedPosition}
                            onChange={e => setSelectedPosition(e.target.value)}
                            className="bg-black/40 border border-purple-500/30 text-white text-sm rounded px-3 py-1 focus:outline-none focus:border-purple-500"
                          >
                            {Object.entries(POSITIONS_PT_BR).map(
                              ([key, label]) => (
                                <option key={key} value={key}>
                                  {key} - {label}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-purple-300 uppercase font-bold">
                          Score na Posição
                        </div>
                        <div className="text-2xl font-black text-white">
                          {selectedPosScore.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPosition === 'GK' &&
                    renderAttributeSection(
                      'Atributos de Goleiro',
                      ATTRIBUTE_CATEGORIES.GOALKEEPING,
                      'text-orange-400'
                    )}
                  {renderAttributeSection(
                    'Atributos Físicos',
                    ATTRIBUTE_CATEGORIES.PHYSICAL,
                    'text-blue-400'
                  )}
                  {renderAttributeSection(
                    'Atributos Mentais',
                    ATTRIBUTE_CATEGORIES.MENTAL,
                    'text-purple-400'
                  )}
                  {renderAttributeSection(
                    'Atributos Técnicos',
                    ATTRIBUTE_CATEGORIES.TECHNICAL,
                    'text-green-400'
                  )}
                </>
              )}
            </div>

            {/* Right Column: Context specific info */}
            <div className="space-y-6">
              {activeTab === 'training' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                    <h4 className="text-yellow-400 font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Brain size={16} />
                      Plano de Desenvolvimento
                    </h4>
                    <div className="mb-4">
                      <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                        Fase Atual
                      </div>
                      <div className="text-lg font-bold text-white">
                        {getTrainingPhase(p.age)}
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="text-xs text-yellow-200 leading-relaxed">
                        {getTrainingAdvice(p.age)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                    <h4 className="text-red-400 font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Zap size={16} />
                      Pontos de Atenção
                    </h4>
                    <div className="space-y-2">
                      {allAttributes
                        .filter(
                          a =>
                            (UNIVERSAL_ATTRIBUTES.includes(a.key) ||
                              selectedPosAttributes.includes(a.key)) &&
                            a.value < 12
                        )
                        .sort((a, b) => a.value - b.value)
                        .slice(0, 5)
                        .map(attr => (
                          <div
                            key={attr.key}
                            className="flex justify-between items-center"
                          >
                            <span className="text-xs text-slate-400">
                              {attr.name}
                            </span>
                            <span className="text-red-400 font-bold text-sm">
                              {attr.value}
                            </span>
                          </div>
                        ))}
                      {allAttributes.filter(
                        a =>
                          (UNIVERSAL_ATTRIBUTES.includes(a.key) ||
                            selectedPosAttributes.includes(a.key)) &&
                          a.value < 12
                      ).length === 0 && (
                        <div className="text-green-400 text-xs">
                          Nenhum ponto crítico detectado.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Roles Tab Content */}
              {activeTab === 'roles' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  {/* GK Roles */}
                  {topGkRoles.length > 0 && (
                    <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                      <h4 className="text-orange-400 font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Shield size={16} />
                        Goleiro
                      </h4>
                      <div className="space-y-2">
                        {topGkRoles.map(([role, score], idx) => (
                          <div
                            key={role}
                            onClick={() =>
                              setSelectedRole({ name: role, type: 'gk' })
                            }
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedRole?.name === role &&
                              selectedRole?.type === 'gk'
                                ? 'bg-orange-500/20 border-orange-500/50'
                                : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-orange-500 text-black' : 'bg-slate-700 text-slate-300'}`}
                              >
                                {idx + 1}
                              </div>
                              <span className="text-sm font-bold text-white">
                                {role}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-orange-400">
                              {score.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IP Roles */}
                  {topIpRoles.length > 0 && (
                    <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                      <h4 className="text-blue-400 font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Swords size={16} />
                        Com Bola (In Possession)
                      </h4>
                      <div className="space-y-2">
                        {topIpRoles.map(([role, score], idx) => (
                          <div
                            key={role}
                            onClick={() =>
                              setSelectedRole({ name: role, type: 'ip' })
                            }
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedRole?.name === role &&
                              selectedRole?.type === 'ip'
                                ? 'bg-blue-500/20 border-blue-500/50'
                                : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                              >
                                {idx + 1}
                              </div>
                              <span className="text-sm font-bold text-white">
                                {role}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-blue-400">
                              {score.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OOP Roles */}
                  {topOopRoles.length > 0 && (
                    <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                      <h4 className="text-red-400 font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Shield size={16} />
                        Sem Bola (Out of Possession)
                      </h4>
                      <div className="space-y-2">
                        {topOopRoles.map(([role, score], idx) => (
                          <div
                            key={role}
                            onClick={() =>
                              setSelectedRole({ name: role, type: 'oop' })
                            }
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedRole?.name === role &&
                              selectedRole?.type === 'oop'
                                ? 'bg-red-500/20 border-red-500/50'
                                : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                              >
                                {idx + 1}
                              </div>
                              <span className="text-sm font-bold text-white">
                                {role}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-red-400">
                              {score.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Top 3 Positions (Analysis Tab) */}
              {activeTab === 'analysis' && (
                <div className="bg-black/20 p-5 rounded-xl border border-white/5 animate-in slide-in-from-right-4 duration-500">
                  <h4 className="text-yellow-400 font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Trophy size={16} />
                    Melhores Posições
                  </h4>
                  <div className="space-y-3">
                    {bestPositions.map((pos, idx) => (
                      <div
                        key={pos.position}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-yellow-500/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedPosition(pos.position)}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-white'}`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-white">
                            {POSITIONS_PT_BR[pos.position]}
                          </div>
                          <div className="text-xs text-slate-400">
                            {pos.position}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-yellow-400">
                          {pos.score.toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths (Overview Tab) */}
              {activeTab === 'overview' && strengths.length > 0 && (
                <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                  <h4 className="text-green-400 font-black text-sm uppercase tracking-wider mb-4">
                    Pontos Fortes Gerais
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

              {/* Current Positions (Both Tabs) */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <h4 className="text-purple-400 font-black text-sm uppercase tracking-wider mb-4">
                  Posições do Jogador
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
                          className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 cursor-pointer hover:bg-blue-500/30"
                          onClick={() => {
                            setActiveTab('analysis');
                            setSelectedPosition(pos);
                          }}
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
                            className="text-xs bg-slate-500/20 text-slate-400 px-2 py-1 rounded border border-slate-500/30 cursor-pointer hover:bg-slate-500/30"
                            onClick={() => {
                              setActiveTab('analysis');
                              setSelectedPosition(pos);
                            }}
                          >
                            {pos.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scores Táticos (Overview Tab) */}
              {activeTab === 'overview' && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailModal;
