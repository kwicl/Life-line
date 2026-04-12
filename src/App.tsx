/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMilestoneAdded = () => {
    setRefreshKey(prev => prev + 1);
    // Close sidebar on mobile after adding
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-cosmic-black overflow-hidden selection:bg-electric-blue/30 relative">
      <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          onMilestoneAdded={handleMilestoneAdded} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
        />
        <Timeline key={refreshKey} />
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-cosmic-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

