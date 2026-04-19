import { Upload, Plus, Euro, FileText, ChevronDown, Zap, Target, Loader2, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import CalendarPicker from './CalendarPicker';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

interface SidebarProps {
  onMilestoneAdded?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ onMilestoneAdded, isOpen, onClose }: SidebarProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '01/01/2026',
    type: 'Capital Asset',
    value: '',
    lineWidth: '4',
    circumstances: '',
    imageUrl: 'https://picsum.photos/seed/milestone/400/300',
    color: '#00d4ff'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [config, setConfig] = useState<{ hasConfig: boolean; spreadsheetId: string }>({ hasConfig: false, spreadsheetId: '' });
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Config fetch failed:', err));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            // Resize image to ensure Base64 string fits inside Google Sheets 50,000 character limit
            const MAX_SIZE = 400;
            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            // Compress heavily using WebP
            resolve(canvas.toDataURL('image/webp', 0.6));
          };
          img.onerror = reject;
        };
        reader.onerror = reject;
      });
      setFormData({ ...formData, imageUrl: dataUrl });
    } catch (error) {
      console.error('Image processing error:', error);
      alert('Failed to process image. Try a smaller or different image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.value || !formData.date) {
      alert('Please fill in title, value and date');
      return;
    }

    if (!config.hasConfig) {
      alert('Google Sheets is not configured. Please set up GOOGLE_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY in your .env file.');
      return;
    }

    setLoading(true);
    try {
      // Extract year from date for backward compatibility if needed
      const yearMatch = formData.date.match(/\d{4}$/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 2026;

      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          year,
          value: parseFloat(formData.value),
          lineWidth: parseInt(formData.lineWidth)
        })
      });

      if (response.ok) {
        onMilestoneAdded?.();
        setFormData({
          title: '',
          date: '01/01/2026',
          type: 'Capital Asset',
          value: '',
          lineWidth: '4',
          circumstances: '',
          imageUrl: 'https://picsum.photos/seed/milestone/400/300',
          color: '#00d4ff'
        });
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to add milestone');
      }
    } catch (error) {
      console.error('Error adding milestone:', error);
      alert('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      w-full max-w-[340px] bg-sidebar-bg backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col gap-8 overflow-y-auto h-full lg:h-[calc(100vh-64px)] relative
    `}>
      {/* Side Glow */}
      <div className="absolute right-0 inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-electric-blue/20 to-transparent" />
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-electric-blue" />
          <h2 className="text-sm font-mono font-bold text-electric-blue tracking-[0.2em] uppercase">Asset Initialization</h2>
        </div>
        <h3 className="text-xl font-display font-black text-white tracking-tight">New Milestone</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.15em]">Asset Designation</label>
          <div className="relative group">
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Quantum Real Estate"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-electric-blue/50 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.15em]">Temporal Node</label>
            <CalendarPicker
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.15em]">Category</label>
            <div className="relative">
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue/50 transition-all appearance-none cursor-pointer"
              >
                <option>Capital Asset</option>
                <option>Real Estate</option>
                <option>Strategic</option>
                <option>Other</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.15em]">Valuation (€)</label>
          <div className="relative">
            <Euro className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-electric-blue/40" />
            <input 
              type="number" 
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="0.00"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-electric-blue/50 transition-all font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.15em]">Vector Thickness (1-10)</label>
          <div className="flex items-center gap-5 glass-morphism rounded-xl p-3 border border-white/5">
            <input 
              type="range" 
              min="1" 
              max="10"
              value={formData.lineWidth}
              onChange={(e) => setFormData({ ...formData, lineWidth: e.target.value })}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-electric-blue"
            />
            <span className="text-xs font-mono font-bold text-electric-blue w-6 text-center">{formData.lineWidth.padStart(2, '0')}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.15em]">Strategic Context</label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-electric-blue/40" />
            <textarea 
              rows={3}
              value={formData.circumstances}
              onChange={(e) => setFormData({ ...formData, circumstances: e.target.value })}
              placeholder="Enter acquisition parameters..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-electric-blue/50 transition-all resize-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.15em]">Visual Identifier</label>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative border border-dashed border-white/20 rounded-2xl p-6 hover:border-electric-blue/50 transition-all cursor-pointer bg-white/[0.01] hover:bg-white/[0.03] overflow-hidden"
          >
            {(formData.imageUrl !== 'https://picsum.photos/seed/milestone/400/300' || uploading) && (
              <div className="absolute inset-0 bg-cosmic-black/60 backdrop-blur-[2px] z-0" />
            )}
            {formData.imageUrl !== 'https://picsum.photos/seed/milestone/400/300' && !uploading && (
              <img src={formData.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" alt="Preview" />
            )}
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all group-hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                {uploading ? (
                  <Loader2 className="w-5 h-5 text-electric-blue animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 text-white/20 group-hover:text-electric-blue" />
                )}
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">{uploading ? 'Processing Data...' : 'Upload Data'}</p>
                <p className="text-[9px] text-white/20 mt-1 font-mono">{formData.imageUrl !== 'https://picsum.photos/seed/milestone/400/300' ? 'Image Ready' : 'JPG, PNG, WEBP (MAX 5MB)'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-white/20 group-hover:text-electric-blue transition-colors" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-white font-mono uppercase tracking-widest">Connection</p>
                <p className="text-[8px] text-white/30 font-mono mt-0.5">{config.hasConfig ? 'Synchro Active' : 'Offline Mode'}</p>
              </div>
            </div>
            {config.hasConfig ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-accent-red" />
            )}
          </button>
          
          <AnimatePresence>
            {showConfig && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-4 rounded-xl bg-electric-blue/5 border border-electric-blue/10 space-y-3">
                  <p className="text-[10px] text-electric-blue/70 font-mono leading-relaxed">
                    {config.hasConfig 
                      ? `Linked to: ${config.spreadsheetId.substring(0, 12)}...`
                      : 'Not linked to any Google Sheet. Please configure your .env file to enable cloud synchronization.'}
                  </p>
                  {!config.hasConfig && (
                    <div className="space-y-1">
                      <p className="text-[9px] text-white/30 uppercase font-mono tracking-wider">Required Secrets:</p>
                      <ul className="text-[8px] font-mono text-white/20 space-y-1">
                        <li>• GOOGLE_SPREADSHEET_ID</li>
                        <li>• GOOGLE_SERVICE_ACCOUNT_EMAIL</li>
                        <li>• GOOGLE_PRIVATE_KEY</li>
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-electric-blue text-cosmic-black font-display font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
          Deploy Milestone
        </motion.button>
        <p className="text-center text-[8px] font-mono text-white/10 mt-4 uppercase tracking-[0.4em]">Secure Encryption Active</p>
      </div>
    </aside>
  );
}

