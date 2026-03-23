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
          className={`px-8 py-4 text-lg rounded-t-2xl font-bold transition-all ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white border-t-2 border-x-2 border-blue-400 shadow-[0_-10px_20px_rgba(37,99,235,0.2)] z-10 relative'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-t-2 border-x-2 border-slate-700/50 shadow-inner'
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
