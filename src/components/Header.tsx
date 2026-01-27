import React from 'react';
import { Activity, Upload } from 'lucide-react';

interface HeaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ onFileUpload }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="flex items-center gap-5 z-10">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3.5 rounded-xl shadow-lg shadow-blue-900/30 ring-1 ring-white/10">
          <Activity size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase drop-shadow-sm">
            FM26 Analyzer <span className="text-blue-500">PRO</span>
          </h1>
          <p className="text-slate-400 font-medium text-xs tracking-widest uppercase">
            Central de Inteligência Tática
          </p>
        </div>
      </div>

      <div className="flex gap-4 z-10 mt-4 md:mt-0">
        <label className="flex items-center gap-2 bg-white/5 hover:bg-blue-600 hover:border-blue-500 border border-white/10 text-white px-6 py-3 rounded-xl cursor-pointer font-bold transition-all shadow-lg hover:shadow-blue-500/25 group/btn">
          <Upload
            size={18}
            className="text-slate-400 group-hover/btn:text-white transition-colors"
          />
          <span className="uppercase text-xs tracking-wider">
            Importar Elenco
          </span>
          <input
            type="file"
            accept=".html,.htm,.csv"
            onChange={onFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </header>
  );
};

export default Header;
