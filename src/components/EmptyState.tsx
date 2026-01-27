import React from 'react';
import { Upload } from 'lucide-react';

interface EmptyStateProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onFileUpload }) => {
  return (
    <div className="text-center py-32 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center">
      <div className="bg-slate-800/50 p-6 rounded-full mb-6 ring-1 ring-white/10">
        <Upload size={48} className="text-slate-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-3">
        Sua Temporada Começa Aqui
      </h2>
      <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
        Importe a visualização "All Attributes" do Football Manager para
        desbloquear análises profundas de elenco e tática.
      </p>
      <label className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold cursor-pointer transition-all shadow-xl shadow-blue-900/30 inline-flex items-center gap-3 transform hover:scale-105 duration-200">
        <Upload size={20} />
        <span className="uppercase tracking-widest text-xs">
          Selecionar Arquivo
        </span>
        <input
          type="file"
          accept=".html,.htm,.csv"
          onChange={onFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default EmptyState;
