import React from 'react';
import {
  BarChart3,
  Users,
  Shield,
  CheckCircle,
  LayoutGrid,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'structure', label: 'ESTRUTURA', icon: LayoutGrid },
    { id: 'dashboard', label: 'ANÁLISE', icon: BarChart3 },
    { id: 'squad', label: 'ELENCO', icon: Users },
    { id: 'tactics', label: 'TÁTICAS', icon: Shield },
    { id: 'guide', label: 'MANUAL', icon: CheckCircle },
  ];

  return (
    <nav className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 backdrop-blur-md overflow-x-auto shadow-inner">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-xs tracking-wider transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 ring-1 ring-white/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
