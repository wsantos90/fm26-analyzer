import React from 'react';
import {
  Activity,
  Users,
  Shield,
  BookOpen,
  Target,
  Zap,
  Anchor,
  Eye,
  Brain,
} from 'lucide-react';

const Guide: React.FC = () => {
  const categories = [
    {
      name: 'Elite',
      desc: 'Jogadores de classe mundial. São os pilares do time, capazes de decidir jogos sozinhos.',
      criteria: 'Nota ≥ 14',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
    {
      name: 'Titular',
      desc: 'Jogadores prontos para o time principal. Consistentes e confiáveis para a maioria dos jogos.',
      criteria: 'Nota ≥ 12.5',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      name: 'Promessa',
      desc: 'Jovens com alto potencial de evolução. Devem receber minutos para desenvolver.',
      criteria: '≤ 21 anos, Nota ≥ 10.5',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      name: 'Rotação',
      desc: 'Opções úteis para compor elenco. Entram para descansar titulares ou em jogos menores.',
      criteria: 'Nota entre 10 e 12.5',
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20',
    },
    {
      name: 'Nível Baixo',
      desc: 'Jogadores abaixo do nível exigido para o clube. Podem ser emprestados ou reavaliados.',
      criteria: 'Nota < 10',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      name: 'Vender',
      desc: 'Veteranos sem rendimento ou jogadores excedentes que não evoluirão mais.',
      criteria: '≥ 29 anos, Nota < 10',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
  ];

  const positions = [
    { code: 'GOL', name: 'Goleiro', en: 'GK' },
    { code: 'ZAG', name: 'Zagueiro', en: 'DC' },
    { code: 'LD', name: 'Lateral Direito', en: 'DR' },
    { code: 'LE', name: 'Lateral Esquerdo', en: 'DL' },
    { code: 'ALD', name: 'Ala Direito', en: 'WBR' },
    { code: 'ALE', name: 'Ala Esquerdo', en: 'WBL' },
    { code: 'VOL', name: 'Volante', en: 'DMC' },
    { code: 'MEI', name: 'Meia Central', en: 'MC' },
    { code: 'MD', name: 'Meia Direita', en: 'MR' },
    { code: 'ME', name: 'Meia Esquerda', en: 'ML' },
    { code: 'MAC', name: 'Meia Atacante Central', en: 'AMC' },
    { code: 'MAD', name: 'Meia Atacante Direito', en: 'AMR' },
    { code: 'MAE', name: 'Meia Atacante Esquerdo', en: 'AML' },
    { code: 'ATA', name: 'Atacante', en: 'ST' },
  ];

  const methodologies = [
    {
      name: 'Stretching (Amplitude)',
      desc: 'Capacidade de alargar o campo ofensivamente, criando espaços horizontais.',
      attr: 'Velocidade, Aceleração, Cruzamento, Drible',
      role: 'Pontas, Alas Ofensivos',
      icon: Zap,
    },
    {
      name: 'Linking (Ligação)',
      desc: 'Conectar defesa e ataque, ditar o ritmo e distribuir o jogo.',
      attr: 'Passe, Visão, Decisões, Técnica',
      role: 'Playmakers, Meias Centrais',
      icon: Activity,
    },
    {
      name: 'Dynamic (Dinâmica)',
      desc: 'Movimentação constante, infiltração e ataque ao espaço.',
      attr: 'Sem Bola, Antecipação, Físico, Finalização',
      role: 'Box-to-Box, Atacantes, Meias Atacantes',
      icon: Target,
    },
    {
      name: 'Engaged (Combate)',
      desc: 'Intensidade na recuperação de bola e duelos físicos.',
      attr: 'Desarme, Agressão, Bravura, Trabalho em Equipe',
      role: 'Volantes, Zagueiros',
      icon: Shield,
    },
    {
      name: 'Tracking (Cobertura)',
      desc: 'Capacidade de acompanhar adversários e fechar espaços defensivos.',
      attr: 'Marcação, Concentração, Posicionamento, Velocidade',
      role: 'Laterais Defensivos, Zagueiros Rápidos',
      icon: Eye,
    },
    {
      name: 'Outlet (Referência)',
      desc: 'Segurar a bola no ataque para aliviar a pressão defensiva (Pivô).',
      attr: 'Força, Equilíbrio, Controle de Bola, Cabeceio',
      role: 'Pivôs, Atacantes Alvo',
      icon: Anchor,
    },
    {
      name: 'GK (Goleiro)',
      desc: 'Proteção da meta, comando de área e distribuição de bola.',
      attr: 'Reflexos, Posicionamento, Agilidade, Um contra Um',
      role: 'Goleiros',
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
          <BookOpen className="text-blue-500" />
          Manual do Sistema FM26 Analyzer
        </h2>
        <p className="text-slate-300 leading-relaxed max-w-3xl">
          Bem-vindo ao FM26 Analyzer. Este sistema foi desenvolvido para
          oferecer uma análise profunda e objetiva do seu elenco no Football
          Manager, utilizando uma metodologia própria de avaliação baseada em
          atributos chave (Meta Attributes) e funções táticas modernas.
        </p>
      </div>

      {/* Como Funciona a Avaliação */}
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
        <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-wider border-b border-white/5 pb-4">
          <Target size={24} className="text-green-500" />
          Como Funciona a Avaliação (Score)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-blue-400 font-bold mb-3">1. Cálculo Base</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Cada jogador recebe uma pontuação baseada nos atributos mais
              importantes para o motor de jogo do FM26. Damos prioridade
              especial aos atributos físicos (Aceleração, Agilidade, Ritmo) e
              mentais (Antecipação, Decisões), que historicamente têm maior
              impacto na performance (Meta Attributes).
            </p>
            <h4 className="text-blue-400 font-bold mb-3">
              2. Funções Táticas (IP/OOP)
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              O sistema avalia cada jogador em dois momentos do jogo:
              <br />
              <br />
              <strong className="text-white">
                IP (In Possession / Com Bola):
              </strong>{' '}
              Capacidade ofensiva, construção e criatividade.
              <br />
              <strong className="text-white">
                OOP (Out of Possession / Sem Bola):
              </strong>{' '}
              Capacidade defensiva, pressão e posicionamento.
              <br />
              <br />A nota final (Main Score) é derivada da melhor performance
              possível do jogador, seja atacando ou defendendo.
            </p>
          </div>
          <div className="bg-black/20 p-6 rounded-xl border border-white/5">
            <h4 className="text-white font-bold mb-4">
              Importância dos Atributos
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">★ ★ ★</span>
                <span>
                  <strong className="text-white">Físico:</strong> Aceleração,
                  Agilidade e Ritmo são fundamentais para todas as posições.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">★ ★</span>
                <span>
                  <strong className="text-white">Mental:</strong> Antecipação e
                  Decisões definem a inteligência de jogo.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 font-bold">★</span>
                <span>
                  <strong className="text-white">Técnico:</strong> Importante,
                  mas secundário se o jogador não tiver físico para competir.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sugestões Inteligentes de Treino (Novo) */}
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
        <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-wider border-b border-white/5 pb-4">
          <Brain size={24} className="text-yellow-500" />
          Sugestões Inteligentes de Treino
        </h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          O sistema utiliza uma lógica avançada para sugerir focos de treino,
          filtrando atributos universais irrelevantes para cada posição.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/20 p-5 rounded-xl border border-white/5">
            <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <Zap size={18} />
              Filtragem por Posição
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Atributos que não fazem sentido para a posição selecionada são
              automaticamente excluídos das sugestões de treino.
            </p>
            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
              <div className="text-xs text-slate-500 uppercase font-bold mb-2">
                Exemplos de Exclusão:
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-slate-300">
                  <span className="text-red-400 text-xs">✕</span>
                  <span>
                    <strong>Zagueiros/Goleiros:</strong> Não treinam "Drible"
                  </span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <span className="text-red-400 text-xs">✕</span>
                  <span>
                    <strong>Atacantes:</strong> Não treinam "Posicionamento
                    Defensivo"
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-black/20 p-5 rounded-xl border border-white/5">
            <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
              <Target size={18} />
              Mapeamento de Funções (Roles)
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Ao analisar um jogador, o sistema sugere apenas as funções táticas
              válidas para a posição selecionada, divididas em fases de jogo.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  As 3 melhores funções são calculadas dinamicamente baseadas
                  nos atributos do jogador.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  Respeita a separação <strong>IP (Com Bola)</strong> e{' '}
                  <strong>OOP (Sem Bola)</strong> do FM26.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Glossário de Posições (Novo) */}
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
        <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-wider border-b border-white/5 pb-4">
          <Anchor size={24} className="text-purple-500" />
          Glossário de Posições (Brasil)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {positions.map(pos => (
            <div
              key={pos.code}
              className="bg-black/40 p-3 rounded-lg border border-white/5 flex flex-col"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-black text-lg">
                  {pos.code}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {pos.en}
                </span>
              </div>
              <span className="text-sm text-slate-400">{pos.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Regra de Promoção (Novo) */}
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
        <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-wider border-b border-white/5 pb-4">
          <Target size={24} className="text-green-500" />
          Regra: Pedindo Passagem (Promover)
        </h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          O sistema identifica automaticamente jogadores das equipes inferiores
          (Reserva, Sub-20, Emprestados) que merecem uma chance no time
          principal.
        </p>
        <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
          <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
            <Zap size={18} />
            Critérios para Destaque "PROMOVER":
          </h4>
          <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
            <li>
              O jogador <strong>NÃO</strong> está no Time Principal.
            </li>
            <li>
              Sua nota (Score) é <strong>maior ou igual</strong> à nota do 11º
              melhor jogador do time principal (Corte Titular).
            </li>
            <li>
              OU o jogador já atingiu o nível de categoria{' '}
              <strong>Elite</strong> ou <strong>Titular</strong> (Nota {'>'}=
              12.5).
            </li>
          </ul>
        </div>
      </div>

      {/* Categorias de Jogadores */}
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
        <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-wider border-b border-white/5 pb-4">
          <Users size={24} className="text-blue-500" />
          Categorias de Classificação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(c => (
            <div
              key={c.name}
              className={`bg-black/20 p-5 rounded-xl border ${c.border} hover:bg-black/40 transition-all group`}
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`${c.color} font-black text-lg uppercase tracking-tight`}
                >
                  {c.name}
                </div>
                <span
                  className={`text-[10px] px-2 py-1 rounded font-bold ${c.bg} ${c.color}`}
                >
                  {c.criteria}
                </span>
              </div>
              <div className="text-slate-400 text-xs font-medium leading-relaxed">
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metodologias */}
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
        <h3 className="text-white font-black mb-8 flex items-center gap-3 text-lg uppercase tracking-wider border-b border-white/5 pb-4">
          <Activity size={24} className="text-blue-500" />
          Metodologias Táticas (DNA)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methodologies.map(m => (
            <div
              key={m.name}
              className="bg-black/20 p-5 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-black/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <m.icon size={18} />
                </div>
                <div className="text-blue-400 font-bold text-sm uppercase tracking-wider group-hover:text-blue-300">
                  {m.name}
                </div>
              </div>
              <div className="text-slate-300 text-xs mb-4 font-medium leading-relaxed border-b border-white/5 pb-4 min-h-[40px]">
                {m.desc}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                    Atributos Chave
                  </div>
                  <div className="text-white text-xs opacity-80">{m.attr}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                    Funções Típicas
                  </div>
                  <div className="text-blue-300 text-xs opacity-80">
                    {m.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guide;
