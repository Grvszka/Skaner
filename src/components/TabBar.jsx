const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'formats', label: '📐 Formaty' },
    { id: 'blanks', label: '📄 Puste' },
    { id: 'colors', label: '🎨 Kolor' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-px" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-t-xl font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-slate-800 text-cyan-400 border-t border-x border-slate-700 shadow-[0_-4px_12px_rgba(34,211,238,0.05)]'
              : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300 border-t border-x border-transparent'
          }`}
          aria-label={tab.label}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
