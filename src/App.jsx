import React, { useState, useMemo, useEffect } from 'react';

// ==========================================
// 🔗 CONFIGURAÇÃO DE URL SEGURA (VARIÁVEIS DE AMBIENTE)
// ==========================================
// O app tenta puxar a URL do Vercel (Next.js/CRA/Vite). 
// Se não encontrar, usa uma string vazia como fallback.
const GOOGLE_SHEETS_WEBAPP_URL = 
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SHEETS_URL) || 
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SHEETS_URL) || 
  ""; 

const Icon = ({ name, size = 24, className = "" }) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />,
    directory: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    mappin: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    chevronright: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />,
    barchart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    tag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    briefcase: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    usercheck: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    sun: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
    moon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
    map: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />,
    file: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    save: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    unlock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  };
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      className={className}
    >
      {icons[name] || icons['alert']}
    </svg>
  );
};

// Dados baseados na estrutura real dos CSVs
const INITIAL_MOCK_DATA = [
  { id: "mock_1", base: "Base Florianópolis", lideranca: "Fátima Lima", municipio_bairro: "Armação", regiao: "Sul", distrito: "Pântano do Sul", situacao: "3 - Pré alinhado", area_de_atuacao: "Cultura/Teatro", temas: "Cultura", tema_institucional: "FUNDO SOCIAL", articulador: "Guto", telefone: "48984692944", email: "costadelimafatima@gmail.com", observacoes: "" },
  { id: "mock_2", base: "Base Santa Catarina", lideranca: "Amilton", municipio_bairro: "Santo Amaro da Imperatriz", regiao: "GRANDE FLORIANÓPOLIS", distrito: "", situacao: "4 - Comprometido", area_de_atuacao: "Agricultor Orgânico", temas: "Agroecologia", tema_institucional: "AGRICULTURA", articulador: "Toninho", telefone: "48996905764", email: "", observacoes: "" },
];

const MAP_COORDINATES = {
  SC: {
    "Florianópolis": { x: 88, y: 55 },
    "Santo Amaro da Imperatriz": { x: 85, y: 55 },
    "São José": { x: 87, y: 54 },
    "Palhoça": { x: 86, y: 56 },
    "Joinville": { x: 85, y: 20 },
    "Chapecó": { x: 15, y: 45 },
    "Criciúma": { x: 80, y: 85 },
    "Lages": { x: 55, y: 65 },
    "Blumenau": { x: 75, y: 35 },
    "Itajaí": { x: 85, y: 35 },
    "Garopaba": { x: 87, y: 65 }
  },
  FLN: {
    "Centro": { x: 45, y: 45 },
    "Sul da Ilha": { x: 55, y: 75 },
    "Campeche": { x: 58, y: 70 },
    "Armação": { x: 60, y: 85 },
    "Rio Tavares": { x: 55, y: 65 },
    "Norte da Ilha": { x: 50, y: 20 },
    "Ingleses": { x: 65, y: 15 },
    "Canasvieiras": { x: 45, y: 10 },
    "Continente": { x: 30, y: 42 },
    "Coqueiros": { x: 32, y: 45 },
    "Lagoa da Conceição": { x: 65, y: 45 },
    "Trindade": { x: 48, y: 40 }
  }
};

export default function App() {
  const [view, setView] = useState('dashboard');
  const [contacts, setContacts] = useState(INITIAL_MOCK_DATA);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mapScope, setMapScope] = useState('SC');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBase, setFilterBase] = useState('Todas');
  const [filterTemas, setFilterTemas] = useState('Todos');
  const [filterSituacao, setFilterSituacao] = useState('Todas');
  const [filterArticulador, setFilterArticulador] = useState('Todos');

  // Segurança dos Ajustes
  const [isSettingsUnlocked, setIsSettingsUnlocked] = useState(false);
  const [settingsPasswordInput, setSettingsPasswordInput] = useState('');

  // Nuvem / Sheets API
  const [localSyncUrl, setLocalSyncUrl] = useState(() => localStorage.getItem('tabulum_sync_url') || GOOGLE_SHEETS_WEBAPP_URL);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localSyncUrl) syncWithCloud();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--border-color', isDarkMode ? '#F4F4F0' : '#1A1A1A');
  }, [isDarkMode]);

  const t = {
    bgApp: isDarkMode ? 'bg-[#121212]' : 'bg-[#F4F4F0]',
    text: isDarkMode ? 'text-[#F4F4F0]' : 'text-[#1A1A1A]',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-[#F4F4F0]' : 'border-[#1A1A1A]',
    cardBg: isDarkMode ? 'bg-[#1E1E1E]' : 'bg-white',
    inputBg: isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white',
    inputBgAlt: isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#EAEAEA]',
  };

  const baseCard = `border-[3px] ${t.border} rounded-xl shadow-mondrian transition-all`;
  const mondrianCard = `${baseCard} ${t.cardBg}`;
  const mondrianButton = `font-bold border-[3px] ${t.border} rounded-xl shadow-mondrian-btn transition-all flex items-center justify-center gap-2 px-6 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`;

  const bases = ['Todas', 'Base Florianópolis', 'Base Santa Catarina'];
  const temasExtraidos = ['Todos', ...new Set(contacts.map(c => c.temas).filter(Boolean))].sort();
  const situacoesExtraidas = ['Todas', ...new Set(contacts.map(c => c.situacao).filter(Boolean))].sort();
  const articuladoresExtraidos = ['Todos', ...new Set(contacts.map(c => c.articulador).filter(Boolean))].sort();

  // === FUNÇÕES DA NUVEM (API GOOGLE SHEETS) ===
  const syncWithCloud = async () => {
    if (!localSyncUrl) return;
    setIsLoading(true);
    try {
      const res = await fetch(localSyncUrl);
      const data = await res.json();
      if (Array.isArray(data)) {
        setContacts(data);
      }
    } catch (e) {
      console.error("Erro ao sincronizar:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToCloud = async (action, dataPayload) => {
    if (!localSyncUrl) return;
    setIsLoading(true);
    try {
      await fetch(localSyncUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ _action: action, ...dataPayload })
      });
      // Resync to get updated Row IDs from Server
      await syncWithCloud();
    } catch (e) {
      console.error("Erro ao salvar na nuvem:", e);
      alert("Ocorreu um erro ao comunicar com a planilha.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = async () => {
    const isNew = !formData.id;
    const contactToSave = { ...formData };
    
    // Atualiza State Localmente
    if (isNew) {
      contactToSave.id = "temp_" + Date.now(); 
      setContacts(prev => [...prev, contactToSave]);
    } else {
      setContacts(prev => prev.map(c => String(c.id) === String(contactToSave.id) ? contactToSave : c));
    }
    
    // Envia para a nuvem (vai atribuir o Row ID correto lá)
    await saveToCloud('update', contactToSave);
    
    setSelectedContact(null);
    setIsEditMode(false);
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Tem certeza que deseja apagar esta liderança?")) return;
    setContacts(prev => prev.filter(c => String(c.id) !== String(id)));
    await saveToCloud('delete', { id });
    setSelectedContact(null);
    setIsEditMode(false);
  };

  const openNewContactModal = () => {
    setFormData({
      id: '', base: 'Base Florianópolis', lideranca: '', municipio_bairro: '',
      regiao: '', distrito: '', situacao: '', area_de_atuacao: '', temas: '',
      tema_institucional: '', articulador: '', telefone: '', email: '', observacoes: ''
    });
    setIsEditMode(true);
    setSelectedContact({ isNew: true });
  };

  const openEditModal = (contact) => {
    setFormData({ ...contact });
    setIsEditMode(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsLogin = (e) => {
    e.preventDefault();
    if (settingsPasswordInput === 'admin') {
      setIsSettingsUnlocked(true);
      setSettingsPasswordInput('');
    } else {
      alert('Senha incorreta.');
      setSettingsPasswordInput('');
    }
  };

  // === RENDERIZAÇÃO DA INTERFACE ===

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const nomeMatch = contact.lideranca?.toLowerCase().includes(searchTerm.toLowerCase());
      const localMatch = contact.municipio_bairro?.toLowerCase().includes(searchTerm.toLowerCase());
      const areaMatch = contact.area_de_atuacao?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSearch = nomeMatch || localMatch || areaMatch;
      const matchesBase = filterBase === 'Todas' || contact.base === filterBase;
      const matchesTemas = filterTemas === 'Todos' || contact.temas === filterTemas;
      const matchesSituacao = filterSituacao === 'Todas' || contact.situacao === filterSituacao;
      const matchesArticulador = filterArticulador === 'Todos' || contact.articulador === filterArticulador;
      
      return matchesSearch && matchesBase && matchesTemas && matchesSituacao && matchesArticulador;
    });
  }, [contacts, searchTerm, filterBase, filterTemas, filterSituacao, filterArticulador]);

  const dashboardContacts = useMemo(() => {
    if (filterArticulador === 'Todos') return contacts;
    return contacts.filter(c => c.articulador === filterArticulador);
  }, [contacts, filterArticulador]);

  const stats = useMemo(() => {
    const floripaCount = dashboardContacts.filter(c => c.base === 'Base Florianópolis').length;
    const scCount = dashboardContacts.filter(c => c.base === 'Base Santa Catarina').length;
    const temaCounts = dashboardContacts.reduce((acc, curr) => {
      if(curr.temas) acc[curr.temas] = (acc[curr.temas] || 0) + 1;
      return acc;
    }, {});
    const topTemas = Object.entries(temaCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return { total: dashboardContacts.length, floripaCount, scCount, topTemas };
  }, [dashboardContacts]);

  const renderHeatMap = () => {
    const heatPoints = {};
    dashboardContacts.forEach(c => {
      if (mapScope === 'FLN' && c.base !== 'Base Florianópolis') return;
      const locName = c.municipio_bairro;
      const coords = MAP_COORDINATES[mapScope][locName];
      if (coords) {
        if (!heatPoints[locName]) heatPoints[locName] = { ...coords, count: 0, label: locName };
        heatPoints[locName].count += 1;
      }
    });

    const maxCount = Math.max(1, ...Object.values(heatPoints).map(p => p.count));

    return (
      <div className={`${baseCard} bg-[#1A1A1A] p-4 flex flex-col md:col-span-3 text-[#F4F4F0] overflow-hidden`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Icon name="map" size={28} className="text-[#DCAE1D]" /> 
            Densidade: {mapScope === 'SC' ? 'Santa Catarina' : 'Florianópolis'}
          </h3>
          <div className="flex border-[3px] border-[#F4F4F0] rounded-lg overflow-hidden shrink-0">
            <button onClick={() => setMapScope('SC')} className={`px-4 py-2 font-bold transition-colors ${mapScope === 'SC' ? 'bg-[#DCAE1D] text-[#1A1A1A]' : 'bg-transparent text-[#F4F4F0] hover:bg-gray-800'}`}>SC</button>
            <div className="w-[3px] bg-[#F4F4F0]"></div>
            <button onClick={() => setMapScope('FLN')} className={`px-4 py-2 font-bold transition-colors ${mapScope === 'FLN' ? 'bg-[#007577] text-white' : 'bg-transparent text-[#F4F4F0] hover:bg-gray-800'}`}>Floripa</button>
          </div>
        </div>
        <div className={`relative w-full ${mapScope === 'SC' ? 'aspect-video max-h-[500px]' : 'aspect-[3/4] max-h-[600px] max-w-[400px] mx-auto'} bg-[#2A2A2A] rounded-lg border-2 border-gray-700 overflow-hidden`}>
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            {mapScope === 'SC' ? (
              <polygon points="5,45 35,30 65,20 85,10 95,40 98,55 90,85 75,95 55,75 25,65 5,60" fill="#007577" stroke="#F4F4F0" strokeWidth="1" strokeLinejoin="round" />
            ) : (
              <>
                <polygon points="5,35 35,35 40,55 25,65 5,65" fill="#DCAE1D" stroke="#F4F4F0" strokeWidth="1" strokeLinejoin="round" />
                <polygon points="45,15 65,10 75,40 85,70 70,95 55,85 50,60 40,40" fill="#007577" stroke="#F4F4F0" strokeWidth="1" strokeLinejoin="round" />
              </>
            )}
          </svg>
          {Object.values(heatPoints).map((pt, i) => {
            const intensity = pt.count / maxCount;
            const size = 16 + (intensity * 40); 
            const opacity = 0.5 + (intensity * 0.5);
            const color = mapScope === 'FLN' ? '#DCAE1D' : '#B32033';
            return (
              <div key={i} className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group cursor-crosshair" style={{ top: `${pt.y}%`, left: `${pt.x}%`, width: size, height: size }}>
                <div className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: color, opacity: opacity * 0.5 }}></div>
                <div className="absolute inset-2 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: color, opacity: opacity }}></div>
                <div className="absolute top-full mt-2 w-max bg-[#F4F4F0] text-[#1A1A1A] text-xs font-bold px-2 py-1 rounded border-2 border-[#1A1A1A] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-md">
                  {pt.label}: {pt.count} contatos
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const SituacaoBadge = ({ situacao }) => {
    if (!situacao) return null;
    let cor = isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-[#1A1A1A]";
    if (situacao.includes("4 -")) cor = "bg-[#007577] text-white";
    else if (situacao.includes("3 -")) cor = "bg-[#DCAE1D] text-[#1A1A1A]";
    else if (situacao.includes("1 -")) cor = "bg-[#B32033] text-white";
    return <span className={`px-2 py-1 text-xs font-bold rounded-md border-2 ${t.border} ${cor}`}>{situacao}</span>;
  };

  const renderDashboard = () => (
    <div className="space-y-6 animation-fade-in">
      
      {/* BARRA DE FILTRO DO DASHBOARD */}
      <div className={`p-4 rounded-xl border-[3px] ${t.border} ${t.cardBg} flex flex-col md:flex-row justify-between items-center gap-4 shadow-mondrian`}>
        <h2 className={`text-xl font-black ${t.text} flex items-center gap-2`}>
          <Icon name="dashboard" /> Visão Geral
        </h2>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className={`font-bold ${t.textMuted} text-sm whitespace-nowrap`}>Filtrar Articulador:</label>
          <select 
            value={filterArticulador} 
            onChange={e => setFilterArticulador(e.target.value)} 
            className={`w-full md:w-48 px-3 py-2 rounded-lg border-2 ${t.border} font-medium ${t.inputBg} ${t.text}`}
          >
            {articuladoresExtraidos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${mondrianCard} p-6 flex flex-col justify-between overflow-hidden relative`}>
          <div className={`absolute top-0 right-0 w-16 h-16 bg-[#B32033] border-l-[3px] border-b-[3px] ${t.border} rounded-bl-xl`}></div>
          <h3 className={`text-xl font-bold mb-2 relative z-10 ${t.text}`}>Total de Lideranças</h3>
          <p className={`text-6xl font-black relative z-10 ${t.text}`}>{stats.total}</p>
        </div>
        <div className={`${baseCard} bg-[#007577] text-white p-6 flex flex-col justify-between`}>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Icon name="mappin" /> Base Florianópolis</h3>
          <p className="text-5xl font-black">{stats.floripaCount}</p>
        </div>
        <div className={`${baseCard} bg-[#DCAE1D] text-[#1A1A1A] p-6 flex flex-col justify-between`}>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Icon name="mappin" /> Base Santa Catarina</h3>
          <p className="text-5xl font-black">{stats.scCount}</p>
        </div>
        {renderHeatMap()}
        <div className={`${mondrianCard} p-6 md:col-span-3`}>
          <h3 className={`text-2xl font-bold mb-6 border-b-[3px] ${t.border} pb-2 flex items-center gap-2 ${t.text}`}>
            <Icon name="barchart" /> Principais Temas
          </h3>
          <div className="space-y-4 max-w-3xl">
            {stats.topTemas.map(([nome, count], index) => {
              const max = Math.max(...stats.topTemas.map(t => t[1]));
              const percentage = (count / max) * 100;
              const colors = ['bg-[#B32033]', 'bg-[#007577]', 'bg-[#DCAE1D]', isDarkMode ? 'bg-gray-400' : 'bg-[#1A1A1A]'];
              return (
                <div key={nome}>
                  <div className={`flex justify-between text-sm font-bold mb-1 ${t.text}`}>
                    <span>{nome}</span><span>{count} contatos</span>
                  </div>
                  <div className={`h-4 w-full ${t.inputBgAlt} rounded-full border-2 ${t.border} overflow-hidden`}>
                    <div className={`h-full ${colors[index % colors.length]} transition-all duration-1000 border-r-2 ${t.border}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDirectory = () => (
    <div className="space-y-6 animation-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className={`text-2xl font-black flex items-center gap-2 ${t.text}`}><Icon name="directory"/> Diretório Base</h2>
        <button onClick={openNewContactModal} className={`${mondrianButton} bg-[#007577] text-white hover:-translate-y-1`}>
          <Icon name="plus" size={20} /> Adicionar
        </button>
      </div>

      <div className={`${mondrianCard} p-4 md:p-6 bg-[#DCAE1D] flex flex-col md:flex-row gap-4 items-end flex-wrap`}>
        <div className="w-full md:flex-1 min-w-[200px] flex flex-col gap-2">
          <label className="font-bold text-[#1A1A1A]">Buscar</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Icon name="search" size={20} /></div>
            <input type="text" placeholder="Nome, área, município..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-3 py-3 rounded-lg border-[3px] ${t.border} focus:outline-none focus:ring-2 focus:ring-[#B32033] font-medium ${t.inputBg} ${t.text}`} />
          </div>
        </div>
        <div className="w-full md:w-48 flex flex-col gap-2">
          <label className="font-bold text-[#1A1A1A]">Base</label>
          <select value={filterBase} onChange={(e) => setFilterBase(e.target.value)} className={`w-full px-3 py-3 rounded-lg border-[3px] ${t.border} font-medium ${t.inputBg} ${t.text}`}>
            {bases.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="w-full md:w-48 flex flex-col gap-2">
          <label className="font-bold text-[#1A1A1A]">Tema Principal</label>
          <select value={filterTemas} onChange={(e) => setFilterTemas(e.target.value)} className={`w-full px-3 py-3 rounded-lg border-[3px] ${t.border} font-medium ${t.inputBg} ${t.text} truncate`}>
            {temasExtraidos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="w-full md:w-48 flex flex-col gap-2">
          <label className="font-bold text-[#1A1A1A]">Situação</label>
          <select value={filterSituacao} onChange={(e) => setFilterSituacao(e.target.value)} className={`w-full px-3 py-3 rounded-lg border-[3px] ${t.border} font-medium ${t.inputBg} ${t.text} truncate`}>
            {situacoesExtraidas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="w-full md:w-48 flex flex-col gap-2">
          <label className="font-bold text-[#1A1A1A]">Articulador</label>
          <select value={filterArticulador} onChange={(e) => setFilterArticulador(e.target.value)} className={`w-full px-3 py-3 rounded-lg border-[3px] ${t.border} font-medium ${t.inputBg} ${t.text} truncate`}>
            {articuladoresExtraidos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map(contact => (
          <div key={contact.id} onClick={() => { setSelectedContact(contact); setIsEditMode(false); }} className={`${mondrianCard} hover:-translate-y-1 hover:shadow-mondrian-btn cursor-pointer flex flex-col h-full`}>
            <div className={`h-3 w-full border-b-[3px] ${t.border} ${contact.base.includes('Florianópolis') ? 'bg-[#007577]' : 'bg-[#DCAE1D]'}`}></div>
            <div className="p-5 flex-grow flex flex-col gap-3">
              <div>
                <h3 className={`text-xl font-bold leading-tight mb-1 line-clamp-2 ${t.text}`}>{contact.lideranca}</h3>
                <div className={`flex items-center text-sm font-semibold gap-1 mb-2 ${t.textMuted}`}>
                  <span className="text-[#B32033]"><Icon name="mappin" size={14} /></span> {contact.municipio_bairro} {contact.distrito ? `- ${contact.distrito}` : ''}
                </div>
                <SituacaoBadge situacao={contact.situacao} />
              </div>
              <div className={`mt-auto pt-4 border-t-2 border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} flex flex-wrap gap-2 items-center justify-between`}>
                <span className={`text-xs font-bold truncate ${t.textMuted}`}><Icon name="tag" size={12} className="inline mr-1"/>{contact.temas || 'S/ Tema'}</span>
                <button className={`p-2 ${t.inputBgAlt} border-2 ${t.border} rounded-md hover:bg-[#B32033] hover:text-white transition-colors ${t.text}`}><Icon name="chevronright" size={18} /></button>
              </div>
            </div>
          </div>
        ))}
        {filteredContacts.length === 0 && (
          <div className={`col-span-full py-12 text-center border-[3px] border-dashed ${t.border} rounded-xl ${t.cardBg}`}>
            <Icon name="alert" size={48} className="mx-auto mb-4 text-[#B32033]" />
            <h3 className={`text-2xl font-bold ${t.text}`}>Nenhum contato encontrado</h3>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => {
    // TELA DE LOGIN PARA OS AJUSTES
    if (!isSettingsUnlocked) {
      return (
        <div className="space-y-6 animation-fade-in max-w-md mx-auto mt-12">
          <div className={`${mondrianCard} p-8 text-center`}>
            <div className="w-16 h-16 mx-auto bg-[#B32033] rounded-full border-[3px] border-[#1A1A1A] flex items-center justify-center text-white mb-6">
              <Icon name="lock" size={32} />
            </div>
            <h2 className={`text-2xl font-black mb-2 ${t.text}`}>Área Restrita</h2>
            <p className={`mb-6 text-sm ${t.textMuted}`}>Insira a senha de administrador para acessar as configurações do sistema.</p>
            
            <form onSubmit={handleSettingsLogin} className="flex flex-col gap-4">
              <input 
                type="password" 
                value={settingsPasswordInput}
                onChange={(e) => setSettingsPasswordInput(e.target.value)}
                placeholder="Senha" 
                className={`w-full px-4 py-3 rounded-lg border-[3px] ${t.border} font-medium ${t.inputBg} ${t.text} text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#B32033]`}
                autoFocus
              />
              <button type="submit" className={`${mondrianButton} bg-[#1A1A1A] text-white w-full hover:bg-gray-800`}>
                Desbloquear
              </button>
            </form>
          </div>
        </div>
      );
    }

    // TELA DE AJUSTES DESBLOQUEADA
    return (
      <div className="space-y-6 animation-fade-in max-w-4xl mx-auto">
        <div className={`${mondrianCard} p-8 relative`}>
          <button 
            onClick={() => setIsSettingsUnlocked(false)} 
            className="absolute top-8 right-8 text-[#B32033] hover:text-red-700 flex items-center gap-2 font-bold text-sm"
          >
            <Icon name="lock" size={16} /> Bloquear Sessão
          </button>

          <h2 className={`text-3xl font-black mb-8 border-b-[3px] ${t.border} pb-4 flex items-center gap-3 ${t.text}`}>
            <span className="text-[#B32033]"><Icon name="settings" size={32} /></span> Ajustes
          </h2>

          <div className={`mb-10 p-6 border-[3px] ${t.border} rounded-xl ${t.inputBgAlt}`}>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${t.text}`}>
               <Icon name="refresh" size={24} className="text-[#007577]" /> Sincronização Google Sheets
            </h3>
            <p className={`mb-4 text-sm font-medium ${t.textMuted}`}>
              A URL primária está sendo puxada de forma segura através das Variáveis de Ambiente do servidor. <br/>
              Abaixo, você pode forçar a sincronização ou testar temporariamente outra URL.
            </p>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input 
                type="text" 
                value={localSyncUrl} 
                onChange={(e) => {
                  setLocalSyncUrl(e.target.value);
                  localStorage.setItem('tabulum_sync_url', e.target.value);
                }}
                placeholder="https://script.google.com/macros/s/..." 
                className={`flex-grow px-4 py-3 rounded-lg border-[3px] ${t.border} font-medium ${t.inputBg} ${t.text} focus:outline-none focus:ring-2 focus:ring-[#B32033]`}
              />
              <button onClick={syncWithCloud} disabled={isLoading || !localSyncUrl} className={`${mondrianButton} bg-[#007577] text-white shrink-0`}>
                <Icon name="refresh" size={20} className={isLoading ? "animate-spin" : ""} /> {isLoading ? 'Aguarde...' : 'Sincronizar Agora'}
              </button>
            </div>
            {(!localSyncUrl) && (
              <p className="text-xs text-[#B32033] font-bold">Variável de ambiente não detectada. Insira o link acima para testar.</p>
            )}
          </div>

          <div className={`mb-10 p-6 border-[3px] ${t.border} rounded-xl ${t.inputBgAlt}`}>
            <h3 className={`text-xl font-bold mb-4 ${t.text}`}>Aparência</h3>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`${mondrianButton} ${t.cardBg} ${t.text} w-full md:w-auto`}>
              {isDarkMode ? <span className="text-[#DCAE1D]"><Icon name="sun" size={20} /></span> : <span className="text-[#007577]"><Icon name="moon" size={20} /></span>}
              Alternar para Tema {isDarkMode ? 'Claro' : 'Escuro'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!selectedContact) return null;

    const inputClasses = `w-full px-3 py-2 mt-1 rounded border-2 ${t.border} font-medium ${t.inputBg} ${t.text} focus:outline-none focus:ring-2 focus:ring-[#B32033]`;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animation-fade-in">
        <div className={`${mondrianCard} w-full max-w-3xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row`}>
          <div className={`hidden md:block w-8 border-r-[3px] ${t.border} ${isEditMode ? 'bg-[#DCAE1D]' : 'bg-[#B32033]'} flex-shrink-0 transition-colors`}></div>
          <div className="flex-grow p-6 md:p-8">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                {isEditMode ? (
                  <h2 className={`text-2xl font-black flex items-center gap-2 ${t.text}`}><Icon name="edit"/> {formData.id ? 'Editar Contato' : 'Novo Contato'}</h2>
                ) : (
                  <>
                    <h2 className={`text-3xl font-black mb-2 pr-12 ${t.text}`}>{selectedContact.lideranca}</h2>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <div className={`flex items-center gap-2 font-bold ${t.textMuted} ${t.inputBgAlt} w-fit px-3 py-1 rounded-md border-2 ${t.border}`}>
                        <Icon name="tag" size={16} /> {selectedContact.base}
                      </div>
                      <SituacaoBadge situacao={selectedContact.situacao} />
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {!isEditMode && !selectedContact.isNew && (
                  <button onClick={() => openEditModal(selectedContact)} className={`p-2 border-[3px] ${t.border} rounded-xl hover:bg-[#DCAE1D] transition-colors shadow-mondrian-btn ${t.text}`} title="Editar">
                    <Icon name="edit" size={24} />
                  </button>
                )}
                <button onClick={() => { setSelectedContact(null); setIsEditMode(false); }} className={`p-2 border-[3px] ${t.border} rounded-xl hover:bg-[#B32033] hover:text-white transition-colors shadow-mondrian-btn ${t.text}`} title="Fechar">
                  <Icon name="x" size={24} />
                </button>
              </div>
            </div>

            {isEditMode ? (
              // MODO EDIÇÃO (Mapeado exatamente para o seu CSV)
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Liderança (Nome) *</label>
                    <input type="text" name="lideranca" value={formData.lideranca || ''} onChange={handleFormChange} className={inputClasses} required />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Aba / Base *</label>
                    <select name="base" value={formData.base || 'Base Florianópolis'} onChange={handleFormChange} className={inputClasses}>
                      <option value="Base Florianópolis">Base Florianópolis</option>
                      <option value="Base Santa Catarina">Base Santa Catarina</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Município / Bairro</label>
                    <input type="text" name="municipio_bairro" value={formData.municipio_bairro || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Região</label>
                    <input type="text" name="regiao" value={formData.regiao || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  {formData.base === 'Base Florianópolis' && (
                    <div>
                      <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Distrito (Só Floripa)</label>
                      <input type="text" name="distrito" value={formData.distrito || ''} onChange={handleFormChange} className={inputClasses} />
                    </div>
                  )}
                  <div>
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Situação</label>
                    <input type="text" name="situacao" value={formData.situacao || ''} onChange={handleFormChange} placeholder="Ex: 4 - Comprometido" className={inputClasses} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Área de Atuação Livre</label>
                    <input type="text" name="area_de_atuacao" value={formData.area_de_atuacao || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Temas</label>
                    <input type="text" name="temas" value={formData.temas || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Tema Institucional</label>
                    <input type="text" name="tema_institucional" value={formData.tema_institucional || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Articulador</label>
                    <input type="text" name="articulador" value={formData.articulador || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Telefone</label>
                    <input type="text" name="telefone" value={formData.telefone || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`text-xs font-bold uppercase ${t.textMuted}`}>E-mail</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                </div>
                <div>
                  <label className={`text-xs font-bold uppercase ${t.textMuted}`}>Observações</label>
                  <textarea name="observacoes" value={formData.observacoes || ''} onChange={handleFormChange} rows="3" className={inputClasses}></textarea>
                </div>

                <div className={`mt-6 pt-6 border-t-[3px] ${t.border} flex flex-col md:flex-row justify-between gap-4`}>
                  {formData.id && (
                    <button onClick={() => handleDeleteContact(formData.id)} disabled={isLoading} className={`${mondrianButton} bg-[#B32033] text-white w-full md:w-auto`}>
                      <Icon name="trash" size={20} /> Excluir
                    </button>
                  )}
                  <div className="flex gap-4 ml-auto w-full md:w-auto">
                    <button onClick={() => { setIsEditMode(false); if(!formData.id) setSelectedContact(null); }} className={`${mondrianButton} ${t.inputBgAlt} ${t.text} w-full md:w-auto`}>
                      Cancelar
                    </button>
                    <button onClick={handleSaveContact} disabled={isLoading || !formData.lideranca} className={`${mondrianButton} bg-[#007577] text-white w-full md:w-auto`}>
                      <Icon name="save" size={20} className={isLoading ? "animate-spin" : ""} /> {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // MODO VISUALIZAÇÃO
              <>
                {selectedContact.area_de_atuacao && (
                  <div className={`mb-6 p-4 ${t.inputBgAlt} border-2 ${t.border} rounded-lg flex items-center gap-3`}>
                    <span className="text-[#DCAE1D]"><Icon name="briefcase" size={28} /></span>
                    <div>
                      <p className={`font-bold text-lg ${t.text}`}>{selectedContact.area_de_atuacao}</p>
                      <p className={`text-sm font-semibold ${t.textMuted}`}>Área de Atuação</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Localização</label>
                      <p className={`font-bold flex items-start gap-2 ${t.text}`}>
                        <span className="text-[#007577] mt-1 shrink-0"><Icon name="map" size={18}/></span> 
                        <span>
                          <span className="block">{selectedContact.municipio_bairro} {selectedContact.distrito ? `/ ${selectedContact.distrito}` : ''}</span>
                          <span className={`text-sm ${t.textMuted}`}>{selectedContact.regiao}</span>
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Telefone</label>
                      <p className={`font-bold flex items-center gap-2 ${t.text}`}><span className="text-[#DCAE1D]"><Icon name="phone" size={18}/></span> {selectedContact.telefone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">E-mail</label>
                      <p className={`font-bold flex items-center gap-2 ${t.text}`}><span className="text-[#B32033]"><Icon name="mail" size={18}/></span> {selectedContact.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Articulador(a)</label>
                      <p className={`font-bold flex items-center gap-2 text-lg ${t.text}`}>
                        <span className="text-[#B32033]"><Icon name="usercheck" size={20} /></span> {selectedContact.articulador || 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Tema Principal</label>
                      <p className={`font-bold ${t.text}`}>{selectedContact.temas || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Tema Institucional</label>
                      <p className={`font-bold ${t.text}`}>{selectedContact.tema_institucional || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className={`border-t-[3px] ${t.border} pt-6`}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Observações</label>
                  <div className={`${t.inputBgAlt} p-4 rounded-lg border-2 ${t.border} font-medium ${t.text} text-lg leading-relaxed whitespace-pre-wrap`}>
                    {selectedContact.observacoes || 'Sem anotações.'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${t.bgApp} p-4 md:p-8 font-sans selection:bg-[#DCAE1D] selection:text-[#1A1A1A] transition-colors duration-300`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .animation-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .shadow-mondrian { box-shadow: 5px 5px 0 0 var(--border-color); }
        .shadow-mondrian-btn { box-shadow: 3px 3px 0 0 var(--border-color); }
        .shadow-mondrian-btn:active:not(:disabled) { box-shadow: 0 0 0 0 transparent; transform: translate(3px, 3px); }
      `}} />

      <div className="max-w-6xl mx-auto">
        <header className={`mb-8 flex flex-col md:flex-row md:items-end justify-between border-b-[4px] ${t.border} pb-6 gap-6 relative`}>
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-16 h-16 bg-[#1A1A1A] border-[3px] ${t.border} rounded-xl shadow-mondrian flex items-center justify-center flex-shrink-0`}>
              <Icon name="users" size={32} className="text-[#DCAE1D]" />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-black uppercase tracking-tight ${t.text}`}>TABULUM</h1>
              <p className="text-lg font-bold text-[#007577]">Mapa de Lideranças</p>
            </div>
          </div>
          <div className="flex gap-2 relative z-10">
            <span className={`h-4 w-4 rounded-sm border-2 ${t.border} bg-[#B32033]`}></span>
            <span className={`h-4 w-4 rounded-sm border-2 ${t.border} bg-[#007577]`}></span>
            <span className={`h-4 w-4 rounded-sm border-2 ${t.border} bg-[#DCAE1D]`}></span>
          </div>
        </header>

        <nav className="flex flex-wrap gap-4 mb-8">
          <button onClick={() => setView('dashboard')} className={`${mondrianButton} ${view === 'dashboard' ? 'bg-[#DCAE1D] text-[#1A1A1A]' : `${t.cardBg} ${t.text}`}`}>
            <Icon name="dashboard" size={20} /> Dashboard
          </button>
          <button onClick={() => setView('directory')} className={`${mondrianButton} ${view === 'directory' ? 'bg-[#007577] text-white' : `${t.cardBg} ${t.text}`}`}>
            <Icon name="directory" size={20} /> Diretório
          </button>
          <button onClick={() => setView('settings')} className={`${mondrianButton} ${view === 'settings' ? 'bg-[#B32033] text-white' : `${t.cardBg} ${t.text}`} ml-auto`}>
            <Icon name={isSettingsUnlocked ? "settings" : "lock"} size={20} /> Ajustes
          </button>
        </nav>

        <main>
          {view === 'dashboard' && renderDashboard()}
          {view === 'directory' && renderDirectory()}
          {view === 'settings' && renderSettings()}
        </main>
      </div>

      {renderModal()}
    </div>
  );
}
