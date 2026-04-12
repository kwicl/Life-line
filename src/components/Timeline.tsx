import { motion, useScroll, useTransform } from 'motion/react';
import { Milestone } from '../types';
import { INITIAL_MILESTONES } from '../constants';
import { Search, ZoomIn, ZoomOut, MousePointer2, Sparkles } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const years = [2020, 2025, 2030, 2035, 2040];
  const startYear = 2020;
  const endYear = 2040;
  const startDate = new Date(startYear, 0, 1).getTime();
  const endDate = new Date(endYear, 11, 31).getTime();
  const totalDuration = endDate - startDate;

  const getPosition = (dateStr: string | number) => {
    let time: number;
    if (typeof dateStr === 'number') {
      time = new Date(dateStr, 0, 1).getTime();
    } else {
      // Handle DD/MM/YYYY or ISO
      if (dateStr.includes('/')) {
        const [d, m, y] = dateStr.split('/').map(Number);
        time = new Date(y, m - 1, d).getTime();
      } else {
        time = new Date(dateStr).getTime();
      }
    }
    return ((time - startDate) / totalDuration) * 100;
  };

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch('/api/milestones');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setMilestones(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch milestones:', error);
      }
    };
    fetchMilestones();
  }, []);

  // Background particles
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    color: Math.random() > 0.5 ? 'var(--color-gold)' : 'white',
  }));

  // Stars for Orion Constellation
  const orionStars = [
    { top: '20%', left: '45%', size: 3, name: 'Betelgeuse', color: '#ff7b00' },
    { top: '22%', left: '55%', size: 2.5, name: 'Bellatrix', color: '#fff' },
    { top: '40%', left: '49%', size: 3, name: 'Alnilam', color: '#00d4ff' }, // Belt Center
    { top: '38%', left: '47%', size: 2.5, name: 'Alnitak', color: '#00d4ff' }, // Belt Left
    { top: '42%', left: '51%', size: 2.5, name: 'Mintaka', color: '#00d4ff' }, // Belt Right
    { top: '60%', left: '43%', size: 2.5, name: 'Saiph', color: '#fff' },
    { top: '62%', left: '57%', size: 3.5, name: 'Rigel', color: '#00d4ff' },
  ];

  return (
    <main 
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-gradient-to-br from-cosmic-black via-cosmic-blue to-cosmic-black flex flex-col"
    >
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Nebulas */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent-red/10 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-electric-blue/5 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        {/* 3D Isometric Grid Floor */}
        <div 
          className="absolute bottom-0 inset-x-0 h-[40%] opacity-20"
          style={{
            backgroundImage: `linear-gradient(to bottom, transparent, var(--color-cosmic-black)), 
                             repeating-linear-gradient(90deg, rgba(0, 212, 255, 0.1) 0px, rgba(0, 212, 255, 0.1) 1px, transparent 1px, transparent 40px),
                             repeating-linear-gradient(0deg, rgba(0, 212, 255, 0.1) 0px, rgba(0, 212, 255, 0.1) 1px, transparent 1px, transparent 40px)`,
            transform: 'perspective(1000px) rotateX(60deg) translateY(100px)',
            transformOrigin: 'bottom'
          }}
        />

        {/* Orion Constellation */}
        <div className="absolute inset-0 opacity-40">
          {orionStars.map((star, i) => (
            <motion.div
              key={`orion-${i}`}
              className="absolute rounded-full"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                boxShadow: `0 0 20px ${star.color}, 0 0 40px ${star.color}44`,
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {/* Optional Star Glimmer */}
              <div className="absolute inset-[-4px] bg-white opacity-20 blur-[2px] rounded-full" />
            </motion.div>
          ))}
          {/* Orion Connector Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <line x1="45%" y1="20%" x2="49%" y2="40%" stroke="white" strokeWidth="0.5" />
            <line x1="55%" y1="22%" x2="49%" y2="40%" stroke="white" strokeWidth="0.5" />
            <line x1="49%" y1="40%" x2="43%" y2="60%" stroke="white" strokeWidth="0.5" />
            <line x1="49%" y1="40%" x2="57%" y2="62%" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Floating Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}

        {/* Shooting Stars */}
        <div className="shooting-star" style={{ top: '10%', left: '20%', animationDelay: '0s' }} />
        <div className="shooting-star" style={{ top: '30%', left: '50%', animationDelay: '4s' }} />
        <div className="shooting-star" style={{ top: '5%', left: '80%', animationDelay: '7s' }} />
      </div>

      {/* Scrollable Timeline Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden relative z-10 custom-scrollbar-hide">
        <div className="min-w-[1400px] lg:min-w-[2000px] h-full relative">
          {/* 3D Curved Trajectories (Bézier Curves) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-electric-blue)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--color-electric-blue)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--color-electric-blue)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {milestones.map((milestone, i) => {
              if (i === milestones.length - 1) return null;
              const next = milestones[i + 1];
              const x1 = getPosition(milestone.date || milestone.year);
              const x2 = getPosition(next.date || next.year);
              const y1 = 100 - (180 + (i % 4) * 70) / 10; 
              const y2 = 100 - (180 + ((i + 1) % 4) * 70) / 10;
              
              return (
                <motion.path
                  key={`curve-${i}`}
                  d={`M ${x1}% ${y1}% C ${(x1 + x2) / 2}% ${y1}%, ${(x1 + x2) / 2}% ${y2}%, ${x2}% ${y2}%`}
                  stroke="url(#curveGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: i * 0.2 }}
                />
              );
            })}
          </svg>

          {/* Milestones Container */}
          <div className="absolute inset-0 px-[5%] pt-20 pb-0">
            {milestones.map((milestone, index) => {
              const left = getPosition(milestone.date || milestone.year);
              const barHeight = 200 + (index % 4) * 80;
              const bubbleOffset = (index % 3) * 45;
              const depth = 1 - (index % 3) * 0.1; 
              
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, scale: 0.8, z: -100 }}
                  animate={{ opacity: 1, scale: depth, z: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="absolute bottom-0 flex flex-col items-center group"
                  style={{ 
                    left: `${left}%`, 
                    transform: 'translateX(-50%)',
                    filter: `blur(${(1 - depth) * 4}px)`,
                    zIndex: Math.floor(depth * 100)
                  }}
                >
                  {/* Holographic Beaming Card */}
                  <motion.div 
                    className="absolute bottom-full mb-16 w-64 lg:w-80 glass-morphism rounded-3xl p-4 lg:p-6 shadow-[0_0_60px_rgba(0,212,255,0.25)] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-10 group-hover:-translate-y-14 pointer-events-none group-hover:pointer-events-auto z-50 overflow-hidden"
                  >
                    {/* Holographic Beam Effect */}
                    <div className="absolute inset-x-0 -top-full h-full bg-gradient-to-b from-electric-blue/20 to-transparent animate-pulse" />
                    
                    <div className="relative space-y-4 lg:space-y-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1.5 overflow-hidden">
                          <h3 className="text-sm lg:text-base font-display font-bold text-white tracking-wide uppercase truncate">{milestone.title}</h3>
                          <p className="text-[10px] lg:text-xs font-mono text-electric-blue text-glow">{milestone.date || milestone.year} • {milestone.type}</p>
                        </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                          <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-gold" />
                        </div>
                      </div>

                      <div className="flex gap-4 lg:gap-5">
                        <div className="relative group/img">
                          <img 
                            src={milestone.imageUrl} 
                            alt={milestone.title} 
                            className="w-20 h-20 lg:w-28 lg:h-28 rounded-2xl object-cover border border-white/10 shadow-2xl transition-transform duration-500 group-hover/img:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-electric-blue/10 rounded-2xl mix-blend-overlay" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center space-y-3 lg:space-y-4">
                          <div>
                            <p className="text-[8px] lg:text-[10px] text-white/30 uppercase tracking-widest font-bold">Capital Value</p>
                            <p className="text-lg lg:text-xl font-display font-bold text-white text-glow">
                              {milestone.value > 0 ? `${milestone.value.toLocaleString()} €` : 'STRATEGIC'}
                            </p>
                          </div>
                          <div className="h-1 lg:h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-electric-blue shadow-[0_0_15px_#00d4ff]"
                              initial={{ width: 0 }}
                              whileInView={{ width: '70%' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 lg:pt-4 border-t border-white/5">
                        <p className="text-[10px] lg:text-xs text-white/40 leading-relaxed font-medium italic line-clamp-2">
                          "{milestone.circumstances}"
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Persistent Shooting Star Link */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] overflow-hidden pointer-events-none"
                    style={{ height: `${barHeight}px` }}
                  >
                    {/* Base Line (Static) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent" />
                    
                    {/* The "Star" (Pulse) */}
                    <div 
                      className="absolute w-full h-24 bg-gradient-to-t from-transparent via-electric-blue to-transparent animate-shooting-star-vertical"
                      style={{ 
                        animationDelay: `${index * 0.7}s`,
                        boxShadow: `0 0 10px ${milestone.color}`
                      }}
                    />
                  </div>

                  {/* Floating Holographic Sphere */}
                  <div 
                    className="absolute transition-all duration-500 z-10 animate-float" 
                    style={{ bottom: `${barHeight + 25}px`, animationDelay: `${index * 0.5}s` }}
                  >
                    <div className="relative group-hover:scale-125 transition-transform duration-500">
                      {/* Connecting Band to Card */}
                      <div 
                        className="absolute bottom-full left-1/2 -translate-x-1/2 w-1 h-16 opacity-0 group-hover:opacity-100 transition-all duration-500"
                        style={{ 
                          background: `linear-gradient(to top, ${milestone.color}, transparent)`,
                          boxShadow: `0 0 15px ${milestone.color}`
                        }}
                      />

                      {/* Outer Halo */}
                      <div 
                        className="absolute inset-[-20px] rounded-full blur-2xl opacity-25 animate-pulse-glow"
                        style={{ backgroundColor: milestone.color }}
                      />
                      {/* Sphere */}
                      <div 
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-white/20 flex items-center justify-center overflow-hidden relative shadow-2xl"
                        style={{ 
                          background: `radial-gradient(circle at 30% 30%, white, ${milestone.color}44, transparent)`,
                          boxShadow: `inset 0 0 30px ${milestone.color}88, 0 0 40px ${milestone.color}44`
                        }}
                      >
                        <img 
                          src={milestone.imageUrl} 
                          alt={milestone.title} 
                          className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-100 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,212,255,0.1)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none" />
                      </div>
                      
                      {/* Light Cone Downward on Hover */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-80 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Vertical Connector (Glassy Tube) */}
                  <div 
                    className="glass-morphism rounded-full transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]"
                    style={{ 
                      height: `${barHeight}px`, 
                      width: `${milestone.lineWidth * 2}px`,
                      background: `linear-gradient(to top, ${milestone.color}44, transparent)`,
                      border: `1px solid ${milestone.color}22`
                    }}
                  />

                  {/* Dot on Timeline Axis */}
                  <div 
                    className="w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-cosmic-black z-10 transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_20px_currentColor]"
                    style={{ backgroundColor: milestone.color, color: milestone.color }}
                  />
                  
                  {/* Milestone Bubble (Below Axis) */}
                  <div 
                    className="absolute top-[calc(100%+15px)] transition-all duration-500 z-20"
                    style={{ transform: `translateY(${bubbleOffset}px)` }}
                  >
                    <button 
                      className="px-4 py-1.5 lg:px-5 lg:py-2 rounded-xl text-[9px] lg:text-[10px] font-display font-bold whitespace-nowrap border border-white/10 glass-morphism transition-all hover:border-electric-blue/50 hover:text-electric-blue group-hover:translate-y-2"
                      style={{ 
                        boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 10px ${milestone.color}11`,
                        color: milestone.color
                      }}
                    >
                      {milestone.title}
                    </button>
                    <div className="mt-2 text-center">
                      <span className="text-[8px] lg:text-[9px] font-mono font-bold text-white/20 group-hover:text-electric-blue transition-colors tracking-widest">
                        {milestone.date || milestone.year}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Futuristic 3D Glass Tube Timeline Axis */}
          <div className="absolute bottom-0 h-48 lg:h-56 inset-x-0 border-t border-white/5 bg-cosmic-black/60 backdrop-blur-3xl px-[5%] flex items-start pt-12 lg:pt-16">
            {/* The Glass Tube */}
            <div className="absolute top-12 lg:top-16 inset-x-0 h-3 lg:h-4 mx-[5%] rounded-full glass-morphism overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-blue/10 to-transparent animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/40" />
            </div>

            <div className="w-full h-px relative z-10">
              {years.map((year) => (
                <div 
                  key={year} 
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${getPosition(year)}%` }}
                >
                  <div className="w-px h-4 lg:h-6 bg-gradient-to-b from-electric-blue to-transparent" />
                  <span className="mt-4 text-[9px] lg:text-[11px] font-mono font-bold text-white/20 tracking-[0.2em]">{year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Controls Overlay */}
      <div className="absolute right-4 lg:right-12 bottom-6 lg:bottom-10 z-50 flex items-center gap-4 lg:gap-6 glass-morphism rounded-2xl px-4 py-2 lg:px-6 lg:py-3 shadow-[0_0_40px_rgba(0,0,0,0.5)] scale-90 lg:scale-100">
        <button className="text-white/30 hover:text-electric-blue transition-all hover:scale-110"><ZoomOut className="w-4 h-4 lg:w-5 lg:h-5" /></button>
        <div className="w-px h-5 lg:h-6 bg-white/10" />
        <button className="text-white/30 hover:text-electric-blue transition-all hover:scale-110"><ZoomIn className="w-4 h-4 lg:w-5 lg:h-5" /></button>
        <div className="w-px h-5 lg:h-6 bg-white/10" />
        <button className="text-white/30 hover:text-electric-blue transition-all hover:scale-110"><MousePointer2 className="w-4 h-4 lg:w-5 lg:h-5" /></button>
        <div className="w-px h-5 lg:h-6 bg-white/10" />
        <button className="text-white/30 hover:text-electric-blue transition-all hover:scale-110"><Search className="w-4 h-4 lg:w-5 lg:h-5" /></button>
      </div>

      {/* KWICL Watermark */}
      <div className="absolute left-6 lg:left-12 bottom-6 lg:bottom-10 mb-[env(safe-area-inset-bottom)] z-50 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse shadow-[0_0_10px_#ff3b47]" />
          <div className="text-[9px] lg:text-[10px] font-mono text-white/10 tracking-[0.3em] uppercase">
            System Active • LifeLine v2.0
          </div>
        </div>
        <div className="flex flex-col">
          <span
            className="text-[22px] lg:text-[28px] font-display font-black tracking-[0.5em] animate-pulse"
            style={{
              color: '#ff3b47',
              textShadow: '0 0 20px #ff3b47, 0 0 40px #ff3b4788, 0 0 80px #ff3b4744',
            }}
          >
            KWICL
          </span>
          <div className="h-[1px] w-full mt-1" style={{ background: 'linear-gradient(to right, #ff3b47, transparent)', boxShadow: '0 0 10px #ff3b47' }} />
        </div>
      </div>
    </main>
  );
}

