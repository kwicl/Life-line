import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarPickerProps {
  value: string; // DD/MM/YYYY format
  onChange: (date: string) => void;
}

const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function parseDateString(dateStr: string): { day: number; month: number; year: number } {
  const parts = dateStr.split('/');
  return {
    day: parseInt(parts[0]) || 1,
    month: parseInt(parts[1]) || 1,
    year: parseInt(parts[2]) || 2026
  };
}

function formatDate(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number): number {
  // Returns 0=Mon, 1=Tue, ... 6=Sun (ISO week)
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const parsed = parseDateString(value);
  const [viewMonth, setViewMonth] = useState(parsed.month);
  const [viewYear, setViewYear] = useState(parsed.year);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // When value changes externally, sync view
  useEffect(() => {
    const p = parseDateString(value);
    setViewMonth(p.month);
    setViewYear(p.year);
  }, [value]);

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);

  // Previous month days for leading blanks
  const prevMonthDays = getDaysInMonth(viewMonth === 1 ? 12 : viewMonth - 1, viewMonth === 1 ? viewYear - 1 : viewYear);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    onChange(formatDate(day, viewMonth, viewYear));
    setIsOpen(false);
  };

  const handleGoToToday = () => {
    setViewMonth(todayMonth);
    setViewYear(todayYear);
  };

  const isToday = (day: number) => day === todayDay && viewMonth === todayMonth && viewYear === todayYear;
  const isSelected = (day: number) => day === parsed.day && viewMonth === parsed.month && viewYear === parsed.year;

  // Build calendar grid cells
  const cells: Array<{ day: number; isCurrentMonth: boolean }> = [];

  // Leading days from previous month
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevMonthDays - firstDay + 1 + i, isCurrentMonth: false });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true });
  }

  // Trailing days from next month
  const remaining = 42 - cells.length; // 6 rows * 7
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false });
  }

  // Only show 5 rows if possible
  const totalRows = Math.ceil((firstDay + daysInMonth) / 7);
  const displayCells = cells.slice(0, totalRows * 7);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Input */}
      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-electric-blue/40 z-10" />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-2 py-3 text-[13px] font-mono font-medium text-white text-left focus:outline-none focus:border-electric-blue/50 transition-all cursor-pointer hover:bg-white/[0.05] tracking-tight whitespace-nowrap overflow-hidden"
      >
        {value}
      </button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-[200] rounded-2xl overflow-hidden"
          >
            <div className="bg-cosmic-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,212,255,0.08)] p-4">
              {/* Header: Month/Year + Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all text-white/50 hover:text-electric-blue"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleGoToToday}
                  className="text-sm font-display font-bold text-white tracking-wide hover:text-electric-blue transition-colors"
                >
                  {MONTHS[viewMonth - 1]} {viewYear}
                </button>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all text-white/50 hover:text-electric-blue"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map(d => (
                  <div key={d} className="text-center text-[9px] font-mono font-bold text-white/25 uppercase tracking-wider py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {displayCells.map((cell, i) => {
                  const isTodayCell = cell.isCurrentMonth && isToday(cell.day);
                  const isSelectedCell = cell.isCurrentMonth && isSelected(cell.day);

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!cell.isCurrentMonth}
                      onClick={() => cell.isCurrentMonth && handleSelectDay(cell.day)}
                      className={`
                        relative w-full aspect-square rounded-lg flex items-center justify-center text-xs font-mono transition-all
                        ${!cell.isCurrentMonth
                          ? 'text-white/8 cursor-default'
                          : isSelectedCell
                            ? 'bg-accent-green/20 text-accent-green font-bold border border-accent-green/40 shadow-[0_0_12px_rgba(0,255,136,0.2)]'
                            : isTodayCell
                              ? 'bg-electric-blue/15 text-electric-blue font-bold border border-electric-blue/40 shadow-[0_0_12px_rgba(0,212,255,0.15)]'
                              : 'text-white/60 hover:bg-white/10 hover:text-white cursor-pointer'
                        }
                      `}
                    >
                      {cell.day}
                      {/* Today dot indicator */}
                      {isTodayCell && !isSelectedCell && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-electric-blue animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer: Today shortcut */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onChange(formatDate(todayDay, todayMonth, todayYear));
                    setIsOpen(false);
                  }}
                  className="text-[10px] font-mono font-bold text-electric-blue/60 hover:text-electric-blue uppercase tracking-widest transition-colors"
                >
                  ⚡ Today
                </button>
                <span className="text-[9px] font-mono text-white/20">
                  {formatDate(todayDay, todayMonth, todayYear)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
