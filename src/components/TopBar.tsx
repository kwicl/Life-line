import { LayoutGrid, User, ShieldCheck, Activity, Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="h-20 lg:h-24 bg-cosmic-black/80 backdrop-blur-2xl border-b border-white/5 px-4 lg:px-12 flex items-center justify-between sticky top-0 z-[100] pt-[env(safe-area-inset-top)] relative overflow-hidden">
      {/* Top Glow Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent" />
      
      <div className="flex items-center gap-2 lg:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-all text-white/60 hover:text-electric-blue"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative group">
          <div className="absolute inset-0 bg-electric-blue/20 blur-lg rounded-lg group-hover:bg-electric-blue/40 transition-all" />
          <div className="relative w-10 h-10 glass-morphism rounded-xl flex items-center justify-center border border-white/20 shadow-2xl">
            <Activity className="text-electric-blue w-6 h-6 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-display font-black tracking-tighter text-white uppercase italic">
              Life<span className="text-electric-blue text-glow">Line</span>
            </h1>
            <span className="text-[10px] font-display font-medium text-white/50 tracking-widest uppercase mt-1 hidden sm:block">
              by Otmane Aboufaris
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[8px] lg:text-[9px] font-mono text-white/30 tracking-widest uppercase truncate max-w-[120px] lg:max-w-none">Quantum Ledger Active</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <nav className="hidden lg:flex items-center gap-2 glass-morphism p-1 rounded-xl border border-white/10">
          {['All Assets', 'Real Estate', 'Capital', 'Strategic'].map((filter, i) => (
            <button
              key={filter}
              className={`px-5 py-2 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
                i === 0 
                ? 'bg-electric-blue text-cosmic-black shadow-[0_0_15px_rgba(0,212,255,0.5)]' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 pl-8 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end gap-2">
              <ShieldCheck className="w-3 h-3 text-accent-green" />
              <p className="text-[11px] font-display font-bold text-white tracking-wide">Otmane Aboufaris</p>
            </div>
            <p className="text-[9px] font-mono text-white/30 tracking-widest uppercase">Tier 1 Investor</p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-electric-blue/20 blur-md rounded-full group-hover:bg-electric-blue/40 transition-all" />
            <div className="relative w-10 h-10 rounded-full glass-morphism flex items-center justify-center border border-white/20 shadow-xl overflow-hidden">
              <img 
                src="https://picsum.photos/seed/user/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

