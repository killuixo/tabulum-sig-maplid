import React, { useState, useMemo, useEffect, useRef } from 'react';

function normalizeStr(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

const Icon = ({ name, size = 24, className = "" }) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />,
    grid: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />,
    list: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
    directory: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    mappin: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />,
    chevronright: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />,
    barchart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    tag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    briefcase: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    usercheck: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    map: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    save: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      {icons[name] || icons['alert']}
    </svg>
  );
};

const INITIAL_MOCK_DATA = [];

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
  const [dialog, setDialog] = useState(null); 
  
  const [isDarkMode] = useState(false);
  const [mapScope, setMapScope] = useState('SC');
  const [directoryViewMode, setDirectoryViewMode] = useState('grid');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBase, setFilterBase] = useState([]);
  const [filterTemas, setFilterTemas] = useState([]);
  const [filterSituacao, setFilterSituacao] = useState([]);
  const [filterArticulador, setFilterArticulador] = useState([]);
  
  const [filterDistritoFln, setFilterDistritoFln] = useState([]);
  const [filterBairroFln, setFilterBairroFln] = useState([]);
  const [filterRegiaoSc, setFilterRegiaoSc] = useState([]);
  const [filterMunicipioSc, setFilterMunicipioSc] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [temaSort, setTemaSort] = useState({ column: 'count', direction: 'desc' });

  const [mapGeoJson, setMapGeoJson] = useState(null);
  const [hoveredMapItem, setHoveredMapItem] = useState(null);

  useEffect(() => {
    const cachedData = localStorage.getItem('tabulum_liderancas_data');
    if (cachedData) {
      try { setContacts(JSON.parse(cachedData)); } catch (e) {}
    }
    syncWithCloud();
    fetch('https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-42-mun.json')
      .then(res => res.json())
      .then(data => setMapGeoJson(data))
      .catch(err => console.error("Erro ao carregar mapa real:", err));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--border-color', isDarkMode ? '#F4F4F0' : '#1A1A1A');
  }, [isDarkMode]);

  useEffect(() => {
    if (filterBase.includes('Base Florianópolis') && !filterBase.includes('Base Santa Catarina')) {
      setMapScope('FLN');
    } else {
      setMapScope('SC');
    }
  }, [filterBase]);

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
  const mondrianButton = `font-bold border-[3px] ${t.border} rounded-xl shadow-mondrian-btn transition-all flex items-center justify-center gap-2 px-4 md:px-6 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base`;

  const bases = ['Base Florianópolis', 'Base Santa Catarina'];
  const temasExtraidos = [...new Set(contacts.map(c => c.temas).filter(Boolean))].sort();
  const situacoesExtraidas = [...new Set(contacts.map(c => c.situacao).filter(Boolean))].sort();
  const articuladoresExtraidos = [...new Set(contacts.map(c => c.articulador).filter(Boolean))].sort();
  
  const distritosExtraidos = [...new Set(contacts.filter(c => c.base === 'Base Florianópolis').map(c => c.distrito).filter(Boolean))].sort();
  const bairrosExtraidos = [...new Set(contacts.filter(c => c.base === 'Base Florianópolis').map(c => c.municipio_bairro).filter(Boolean))].sort();
  const regioesExtraidas = [...new Set(contacts.filter(c => c.base === 'Base Santa Catarina').map(c => c.regiao).filter(Boolean))].sort();
  const municipiosExtraidos = [...new Set(contacts.filter(c => c.base === 'Base Santa Catarina').map(c => c.municipio_bairro).filter(Boolean))].sort();

  const syncWithCloud = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined' && window.location.protocol === 'blob:') {
        setIsLoading(false);
        return;
      }
      const res = await fetch('/api/liderancas');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setContacts(data);
          localStorage.setItem('tabulum_liderancas_data', JSON.stringify(data));
        }
      }
    } catch (e) {} finally { setIsLoading(false); }
  };

  const saveToCloud = async (action, dataPayload) => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined' && window.location.protocol === 'blob:') {
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
        return;
      }
      await fetch('/api/liderancas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: action, ...dataPayload })
      });
      await syncWithCloud();
    } catch (e) {
      setDialog({ type: 'alert', message: "Erro ao comunicar com o servidor." });
    } finally { setIsLoading(false); }
  };

  const handleSaveContact = async () => {
    const isNew = !formData.id;
    const contactToSave = { ...formData };
    if (isNew) {
      contactToSave.id = "temp_" + Date.now(); 
      setContacts(prev => [...prev, contactToSave]);
    } else {
      setContacts(prev => prev.map(c => String(c.id) === String(contactToSave.id) ? contactToSave : c));
    }
    await saveToCloud('update', contactToSave);
    setSelectedContact(null);
    setIsEditMode(false);
  };

  const handleDeleteContact = (id) => {
    setDialog({
      type: 'confirm',
      message: 'Tem certeza que deseja apagar permanentemente esta liderança?',
      onConfirm: async () => {
        setDialog(null);
        setContacts(prev => prev.filter(c => String(c.id) !== String(id)));
        await saveToCloud('delete', { id });
        setSelectedContact(null);
        setIsEditMode(false);
      }
    });
  };

  const openNewContactModal = () => {
    setFormData({
      id: '', base: filterBase.length === 1 ? filterBase[0] : 'Base Florianópolis', 
      lideranca: '', municipio_bairro: '', regiao: '', distrito: '', situacao: '', 
      area_de_atuacao: '', temas: '', tema_institucional: '', 
      articulador: filterArticulador.length === 1 ? filterArticulador[0] : '', 
      telefone: '', email: '', observacoes: ''
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

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesBase = filterBase.length === 0 || filterBase.includes(contact.base);
      const matchesArticulador = filterArticulador.length === 0 || filterArticulador.includes(contact.articulador);
      const matchesTemas = filterTemas.length === 0 || filterTemas.includes(contact.temas);
      const matchesSituacao = filterSituacao.length === 0 || filterSituacao.includes(contact.situacao);

      const nomeMatch = contact.lideranca?.toLowerCase().includes(searchTerm.toLowerCase());
      const localMatch = contact.municipio_bairro?.toLowerCase().includes(searchTerm.toLowerCase());
      const areaMatch = contact.area_de_atuacao?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = !searchTerm || nomeMatch || localMatch || areaMatch;

      const isFln = contact.base === 'Base Florianópolis';
      const isSc = contact.base === 'Base Santa Catarina';
      
      const matchesDistrito = filterDistritoFln.length === 0 || filterDistritoFln.includes(contact.distrito);
      const matchesBairro = filterBairroFln.length === 0 || filterBairroFln.includes(contact.municipio_bairro);
      const flnMatch = !isFln || (matchesDistrito && matchesBairro);

      const matchesRegiao = filterRegiaoSc.length === 0 || filterRegiaoSc.includes(contact.regiao);
      const matchesMuni = filterMunicipioSc.length === 0 || filterMunicipioSc.includes(contact.municipio_bairro);
      const scMatch = !isSc || (matchesRegiao && matchesMuni);

      return matchesBase && matchesArticulador && matchesTemas && matchesSituacao && matchesSearch && flnMatch && scMatch;
    });
  }, [contacts, filterBase, filterArticulador, filterTemas, filterSituacao, searchTerm, filterDistritoFln, filterBairroFln, filterRegiaoSc, filterMunicipioSc]);

  const stats = useMemo(() => {
    const floripaCount = filteredContacts.filter(c => c.base === 'Base Florianópolis').length;
    const scCount = filteredContacts.filter(c => c.base === 'Base Santa Catarina').length;
    
    const temaCounts = filteredContacts.reduce((acc, curr) => {
      if(curr.temas) acc[curr.temas] = (acc[curr.temas] || 0) + 1;
      return acc;
    }, {});

    const situacaoCounts = filteredContacts.reduce((acc, curr) => {
      if(curr.situacao) acc[curr.situacao] = (acc[curr.situacao] || 0) + 1;
      return acc;
    }, {});
    const topSituacoes = Object.entries(situacaoCounts).sort((a, b) => a[0].localeCompare(b[0]));

    return { total: filteredContacts.length, floripaCount, scCount, temaCounts, topSituacoes };
  }, [filteredContacts]);

  const contatosPorMuni = useMemo(() => {
    const map = {};
    filteredContacts.forEach(c => {
      if (c.base !== 'Base Santa Catarina') return;
      const mName = normalizeStr(c.municipio_bairro);
      if(mName) map[mName] = (map[mName] || 0) + 1;
    });
    return map;
  }, [filteredContacts]);

  const contatosPorBairro = useMemo(() => {
    const map = {};
    filteredContacts.forEach(c => {
      if (c.base !== 'Base Florianópolis') return;
      const bName = c.municipio_bairro;
      if(bName) map[bName] = (map[bName] || 0) + 1;
    });
    return map;
  }, [filteredContacts]);

  const handleSortTemas = (column) => {
    if (temaSort.column === column) {
      setTemaSort({ column, direction: temaSort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setTemaSort({ column, direction: column === 'count' ? 'desc' : 'asc' });
    }
  };

  const MultiSelectFilter = ({ label, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggle = (val) => {
      if (selected.includes(val)) onChange(selected.filter(item => item !== val));
      else onChange([...selected, val]);
    };

    const displayValue = selected.length === 0 ? 'Todas/os' : (selected.length === 1 ? selected[0] : `${selected.length} selec.`);

    return (
      <div className="w-full sm:flex-1 min-w-[140px] flex flex-col gap-1.5" ref={dropdownRef}>
        <label className={`font-bold text-xs md:text-sm uppercase tracking-wide ${t.textMuted}`}>{label}</label>
        <div className="relative">
          <div 
            onClick={() => setIsOpen(!isOpen)} 
            className={`w-full px-3 py-2.5 rounded-lg border-[3px] ${t.border} font-bold ${t.inputBg} ${t.text} flex justify-between items-center cursor-pointer shadow-sm`}
          >
            <span className="truncate pr-2">{displayValue}</span>
            <Icon name="chevronright" size={16} className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </div>
          {isOpen && (
            <div className={`absolute top-full left-0 mt-1 w-full z-[60] border-[3px] ${t.border} rounded-lg shadow-mondrian max-h-60 overflow-y-auto ${t.inputBg}`}>
              {options.length === 0 ? (
                <div className={`px-3 py-3 text-sm text-center font-semibold ${t.textMuted}`}>Sem opções</div>
              ) : (
                options.map(o => (
                  <label key={o} className={`px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${t.text}`}>
                    <input 
                      type="checkbox" 
                      checked={selected.includes(o)} 
                      onChange={() => toggle(o)} 
                      className="form-checkbox h-4 w-4 rounded-sm border-[2px] border-[#1A1A1A] text-[#B32033] focus:ring-[#B32033] bg-white accent-[#B32033]"
                    />
                    <span className="truncate text-sm font-bold">{o}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const SituacaoBadge = ({ situacao }) => {
    if (!situacao) return null;
    let cor = isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-[#1A1A1A]";
    if (situacao.includes("4 -")) cor = "bg-[#007577] text-white";
    else if (situacao.includes("3 -")) cor = "bg-[#DCAE1D] text-[#1A1A1A]";
    else if (situacao.includes("1 -") || situacao.includes("2 -")) cor = "bg-[#B32033] text-white";
    else if (situacao.includes("2 -")) cor = "bg-[#F4A261] text-white"; 
    return <span className={`px-2 py-1 text-[10px] md:text-xs font-bold rounded-md border-[2px] ${t.border} ${cor} truncate max-w-full block`}>{situacao}</span>;
  };

  const renderGlobalFilters = () => (
    <div className={`${mondrianCard} p-4 md:p-6 mb-6 flex flex-col gap-4 bg-[#F4F4F0] dark:bg-[#1E1E1E]`}>
      <div className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
        <div className="w-full md:w-64 flex flex-col gap-1.5 shrink-0">
          <label className={`font-bold text-xs md:text-sm uppercase tracking-wide ${t.textMuted}`}>Buscar</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Icon name="search" size={20} /></div>
            <input type="text" placeholder="Nome, área..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-[3px] ${t.border} focus:outline-none focus:ring-2 focus:ring-[#B32033] font-bold ${t.inputBg} ${t.text} shadow-sm`} />
          </div>
        </div>
        
        <MultiSelectFilter label="Base" options={bases} selected={filterBase} onChange={setFilterBase} />
        <MultiSelectFilter label="Tema" options={temasExtraidos} selected={filterTemas} onChange={setFilterTemas} />
        <MultiSelectFilter label="Situação" options={situacoesExtraidas} selected={filterSituacao} onChange={setFilterSituacao} />
        <MultiSelectFilter label="Articulador" options={articuladoresExtraidos} selected={filterArticulador} onChange={setFilterArticulador} />
      </div>

      {(filterBase.length === 0 || filterBase.includes('Base Florianópolis') || filterBase.includes('Base Santa Catarina')) && (
        <div className={`flex flex-col md:flex-row gap-4 items-end flex-wrap pt-2 mt-2 border-t-[3px] border-dashed ${t.border}`}>
          {(filterBase.length === 0 || filterBase.includes('Base Florianópolis')) && (
            <>
              <MultiSelectFilter label="Distrito (Floripa)" options={distritosExtraidos} selected={filterDistritoFln} onChange={setFilterDistritoFln} />
              <MultiSelectFilter label="Bairro (Floripa)" options={bairrosExtraidos} selected={filterBairroFln} onChange={setFilterBairroFln} />
            </>
          )}
          {(filterBase.length === 0 || filterBase.includes('Base Santa Catarina')) && (
            <>
              <MultiSelectFilter label="Região (SC)" options={regioesExtraidas} selected={filterRegiaoSc} onChange={setFilterRegiaoSc} />
              <MultiSelectFilter label="Município (SC)" options={municipiosExtraidos} selected={filterMunicipioSc} onChange={setFilterMunicipioSc} />
            </>
          )}
        </div>
      )}
    </div>
  );

  const renderRealMapSVG = () => {
    if (!mapGeoJson) return <div className="p-8 text-center font-bold">Carregando Mapa Real de SC...</div>;

    const gFpolis = ["Florianópolis", "São José", "Palhoça", "Biguaçu", "Santo Amaro da Imperatriz", "Governador Celso Ramos", "Antônio Carlos", "São Pedro de Alcântara", "Águas Mornas"];

    const featuresToRender = mapGeoJson.features.filter(f =>
      mapScope === 'SC' ? true : gFpolis.includes(f.properties.name)
    );

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    featuresToRender.forEach(f => {
      const processRings = (rings) => {
        rings.forEach(ring => ring.forEach(coord => {
          if (coord[0] < minX) minX = coord[0];
          if (coord[0] > maxX) maxX = coord[0];
          if (coord[1] < minY) minY = coord[1];
          if (coord[1] > maxY) maxY = coord[1];
        }));
      };
      if (f.geometry.type === 'Polygon') processRings(f.geometry.coordinates);
      else if (f.geometry.type === 'MultiPolygon') f.geometry.coordinates.forEach(processRings);
    });

    const mapWidth = 800;
    const mapHeight = mapScope === 'SC' ? 550 : 700;
    
    const scaleX = mapWidth / (maxX - minX);
    const scaleY = mapHeight / (maxY - minY);
    const scale = Math.min(scaleX, scaleY) * 0.95; 
    
    const offsetX = (mapWidth - (maxX - minX) * scale) / 2;
    const offsetY = (mapHeight - (maxY - minY) * scale) / 2;

    const project = (coord) => {
      const x = (coord[0] - minX) * scale + offsetX;
      const y = mapHeight - ((coord[1] - minY) * scale) - offsetY;
      return { x, y };
    };

    const generatePath = (geometry) => {
      const createString = (rings) => rings.map(ring => "M" + ring.map(coord => {
         const p = project(coord); return `${p.x},${p.y}`;
      }).join("L") + "Z").join(" ");
      if (geometry.type === 'Polygon') return createString(geometry.coordinates);
      if (geometry.type === 'MultiPolygon') return geometry.coordinates.map(createString).join(" ");
      return "";
    };

    const getMuniColor = (val) => {
      if (!val || val === 0) return '#FFFFFF'; 
      if (val < 2) return '#DCAE1D'; 
      if (val < 5) return '#007577'; 
      return '#B32033'; 
    };

    const handleMapClick = (base, municipioBairro) => {
      setFilterBase([base]);
      setFilterDistritoFln([]);
      setFilterRegiaoSc([]);
      if (base === 'Base Florianópolis') {
        setFilterBairroFln([municipioBairro]);
        setFilterMunicipioSc([]);
      } else {
        setFilterBairroFln([]);
        setFilterMunicipioSc([municipioBairro]);
      }
      setView('directory');
    };

    return (
      <div className={`${baseCard} ${t.cardBg} p-4 md:p-6 flex flex-col lg:col-span-3 shadow-mondrian`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b-[3px] pb-4 border-dashed border-gray-300 dark:border-gray-700">
          <h3 className={`text-xl md:text-2xl font-bold flex items-center gap-2 w-full md:w-auto ${t.text}`}>
            <Icon name="map" size={28} className="text-[#DCAE1D] shrink-0" /> 
            <span className="truncate">Mapa de {mapScope === 'SC' ? 'Santa Catarina' : 'Florianópolis'}</span>
          </h3>
          <div className="flex items-center gap-4 flex-wrap w-full md:w-auto justify-between">
            <div className="flex space-x-2 text-[10px] md:text-xs font-black uppercase items-center">
                <span className={t.textMuted}>Legenda:</span>
                <div className="w-3 h-3 bg-[#FFFFFF] border border-[#1A1A1A]"></div> <span className={t.textMuted}>Zero</span>
                <div className="w-3 h-3 bg-[#DCAE1D] border border-[#1A1A1A] ml-2"></div> <span className={t.textMuted}>Baixo</span>
                <div className="w-3 h-3 bg-[#007577] border border-[#1A1A1A] ml-2"></div> <span className={t.textMuted}>Médio</span>
                <div className="w-3 h-3 bg-[#B32033] border border-[#1A1A1A] ml-2"></div> <span className={t.textMuted}>Alto</span>
            </div>
            <div className={`flex border-[3px] ${t.border} rounded-lg overflow-hidden shrink-0`}>
              <button onClick={() => setMapScope('SC')} className={`px-4 py-2 font-bold transition-colors ${mapScope === 'SC' ? 'bg-[#DCAE1D] text-[#1A1A1A]' : `bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 ${t.text}`}`}>SC</button>
              <div className={`w-[3px] ${t.border}`}></div>
              <button onClick={() => setMapScope('FLN')} className={`px-4 py-2 font-bold transition-colors ${mapScope === 'FLN' ? 'bg-[#007577] text-white' : `bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 ${t.text}`}`}>Floripa</button>
            </div>
          </div>
        </div>

        <div className={`relative w-full ${mapScope === 'SC' ? 'aspect-video max-h-[550px]' : 'aspect-[4/3] max-h-[600px] max-w-[500px] mx-auto'} bg-[#EAEAEA] dark:bg-[#121212] rounded-xl border-[3px] ${t.border} overflow-hidden p-2`}>
          <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full h-full drop-shadow-md">
            {featuresToRender.map((feature, i) => {
              const mName = normalizeStr(feature.properties.name);
              const val = contatosPorMuni[mName] || 0;
              
              let fillCol = getMuniColor(val);
              if (mapScope === 'FLN') fillCol = '#FFFFFF';

              return (
                <path 
                  key={i} d={generatePath(feature.geometry)}
                  fill={fillCol} 
                  stroke={isDarkMode ? "#555" : "#1A1A1A"} 
                  strokeWidth={mapScope === 'FLN' ? "1.5" : "1"}
                  className={`transition-all ${mapScope === 'SC' ? 'hover:stroke-[3px] hover:fill-[#DCAE1D] cursor-pointer' : ''}`}
                  onMouseEnter={(e) => {
                    if (mapScope === 'SC') setHoveredMapItem({ name: feature.properties.name, val, x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredMapItem(null)}
                  onClick={() => {
                    if (mapScope === 'SC' && val > 0) {
                      handleMapClick('Base Santa Catarina', feature.properties.name);
                    }
                  }}
                />
              );
            })}

            {mapScope === 'FLN' && Object.entries(contatosPorBairro).map(([bairro, count], i) => {
                const coords = MAP_COORDINATES.FLN[bairro];
                if (!coords) return null;
                
                const proj = project(coords);
                const maxBairro = Math.max(1, ...Object.values(contatosPorBairro));
                const intensity = count / maxBairro;
                
                const size = 12 + (intensity * 30); 
                const color = '#B32033'; 

                return (
                  <g key={`bubble-${i}`} className="cursor-pointer group"
                     onMouseEnter={(e) => setHoveredMapItem({ name: bairro, val: count, x: e.clientX, y: e.clientY })}
                     onMouseLeave={() => setHoveredMapItem(null)}
                     onClick={() => handleMapClick('Base Florianópolis', bairro)}
                  >
                    <circle cx={proj.x} cy={proj.y} r={size} fill={color} opacity="0.4" className="animate-pulse" />
                    <circle cx={proj.x} cy={proj.y} r={size * 0.6} fill={color} stroke="#F4F4F0" strokeWidth="2" className="group-hover:stroke-4 transition-all" />
                  </g>
                );
            })}
          </svg>

          {hoveredMapItem && (
            <div className="fixed bg-white border-[3px] border-[#1A1A1A] p-3 z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px] shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                 style={{ left: hoveredMapItem.x, top: hoveredMapItem.y }}>
              <p className="font-black text-[#B32033] uppercase text-sm">{hoveredMapItem.name}</p>
              <p className="font-bold text-[#1A1A1A] text-xs mt-1">
                {hoveredMapItem.val > 0 ? `${hoveredMapItem.val} Liderança(s)` : 'Sem contatos'}
              </p>
              {hoveredMapItem.val > 0 && <p className="text-[10px] text-[#007577] font-bold mt-1">Clique para filtrar &rarr;</p>}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    // Lógica Temas: Separar "OUTROS TEMAS" da lista e permitir ordenação
    const temaEntries = Object.entries(stats.temaCounts || {});
    const displayTemas = temaEntries.filter(([nome]) => nome.toUpperCase() !== 'OUTROS TEMAS' && nome.trim() !== '');
    const outrosTemasCount = temaEntries.find(([nome]) => nome.toUpperCase() === 'OUTROS TEMAS')?.[1] || 0;

    displayTemas.sort((a, b) => {
      if (temaSort.column === 'nome') {
        return temaSort.direction === 'asc' ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0]);
      } else {
        return temaSort.direction === 'asc' ? a[1] - b[1] : b[1] - a[1];
      }
    });

    // Lógica Gráfico de Pizza (Situação)
    const totalSituacoes = stats.topSituacoes.reduce((sum, item) => sum + item[1], 0);
    let cumulative = 0;
    const pieSlices = stats.topSituacoes.map(([nome, count]) => {
      const percent = (count / totalSituacoes) * 100;
      let color = '#888888';
      if (nome.includes('1 -')) color = '#B32033'; 
      else if (nome.includes('2 -')) color = '#F4A261'; 
      else if (nome.includes('3 -')) color = '#DCAE1D'; 
      else if (nome.includes('4 -')) color = '#007577'; 
      const slice = `${color} ${cumulative}% ${cumulative + percent}%`;
      cumulative += percent;
      return slice;
    }).join(', ');
    const conicGradient = `conic-gradient(${pieSlices})`;

    return (
      <div className="space-y-6 animation-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`${mondrianCard} p-6 flex flex-col justify-between overflow-hidden relative sm:col-span-2 lg:col-span-1`}>
            <div className={`absolute top-0 right-0 w-16 h-16 bg-[#B32033] border-l-[3px] border-b-[3px] ${t.border} rounded-bl-xl`}></div>
            <h3 className={`text-xl font-bold mb-2 relative z-10 ${t.text}`}>Total Filtrado</h3>
            <p className={`text-6xl font-black relative z-10 ${t.text}`}>{stats.total}</p>
          </div>
          <div className={`${baseCard} bg-[#007577] text-white p-6 flex flex-col justify-between`}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Icon name="mappin" /> Florianópolis</h3>
            <p className="text-5xl font-black">{stats.floripaCount}</p>
          </div>
          <div className={`${baseCard} bg-[#DCAE1D] text-[#1A1A1A] p-6 flex flex-col justify-between`}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Icon name="mappin" /> Santa Catarina</h3>
            <p className="text-5xl font-black">{stats.scCount}</p>
          </div>
          
          {renderRealMapSVG()}
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className={`${mondrianCard} p-6 flex flex-col h-[450px] md:h-[500px]`}>
              <h3 className={`text-xl md:text-2xl font-bold mb-4 border-b-[3px] ${t.border} pb-2 flex items-center gap-2 ${t.text} shrink-0`}>
                <Icon name="barchart" /> Lista de Temas
              </h3>
              
              {displayTemas.length > 0 ? (
                <>
                  <div className={`flex justify-between text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-500 mb-2 px-2 border-b-2 border-dashed ${t.border} pb-2 shrink-0`}>
                    <div className="cursor-pointer hover:text-[#B32033] flex items-center gap-1 transition-colors" onClick={() => handleSortTemas('nome')}>
                      TEMA {temaSort.column === 'nome' && (temaSort.direction === 'asc' ? '▲' : '▼')}
                    </div>
                    <div className="cursor-pointer hover:text-[#B32033] flex items-center gap-1 text-right transition-colors" onClick={() => handleSortTemas('count')}>
                      QTD {temaSort.column === 'count' && (temaSort.direction === 'asc' ? '▲' : '▼')}
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto pr-2 space-y-1 flex-1 custom-scrollbar">
                    {displayTemas.map(([nome, count]) => (
                      <div key={nome} className={`flex justify-between items-center text-xs md:text-sm font-bold p-2 hover:${t.inputBgAlt} rounded-md transition-colors ${t.text}`}>
                        <span className="truncate pr-4 leading-tight">{nome}</span>
                        <span className="shrink-0 bg-[#007577] text-white px-2.5 py-1 rounded-md text-[10px] md:text-xs border-[2px] border-[#1A1A1A]">{count}</span>
                      </div>
                    ))}
                  </div>
                  
                  {outrosTemasCount > 0 && (
                    <div className="mt-3 pt-3 border-t-[3px] border-dashed border-gray-300 dark:border-gray-700 text-xs md:text-sm font-bold text-gray-500 text-center flex justify-center items-center gap-2 shrink-0">
                      <Icon name="tag" size={14} /> Outros Temas: {outrosTemasCount} entrada(s) separadas
                    </div>
                  )}
                </>
              ) : (
                <p className={`font-medium ${t.textMuted} mt-auto mb-auto text-center`}>Não há temas associados a este filtro.</p>
              )}
            </div>

            <div className={`${mondrianCard} p-6 flex flex-col h-[450px] md:h-[500px]`}>
              <h3 className={`text-xl md:text-2xl font-bold mb-6 border-b-[3px] ${t.border} pb-2 flex items-center gap-2 ${t.text} shrink-0`}>
                <Icon name="check" /> Status de Alinhamento
              </h3>
              
              {totalSituacoes > 0 ? (
                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 mt-auto mb-auto overflow-y-auto custom-scrollbar pr-2">
                  <div 
                    className="w-40 h-40 md:w-52 md:h-52 rounded-full border-[4px] border-[#1A1A1A] shadow-mondrian shrink-0" 
                    style={{ background: conicGradient }}
                  ></div>
                  <div className="flex flex-col gap-3 w-full justify-center">
                    {stats.topSituacoes.map(([nome, count]) => {
                      let colorClass = 'bg-gray-500';
                      if (nome.includes('1 -')) colorClass = 'bg-[#B32033]';
                      else if (nome.includes('2 -')) colorClass = 'bg-[#F4A261]';
                      else if (nome.includes('3 -')) colorClass = 'bg-[#DCAE1D]';
                      else if (nome.includes('4 -')) colorClass = 'bg-[#007577]';

                      const percent = ((count / totalSituacoes) * 100).toFixed(1);

                      return (
                        <div key={nome} className={`flex items-center justify-between text-xs md:text-sm font-bold p-2 rounded-md border-[2px] ${t.border} bg-white dark:bg-[#2A2A2A] shadow-sm`}>
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className={`w-4 h-4 rounded-sm border-[2px] border-[#1A1A1A] shrink-0 ${colorClass}`}></span>
                            <span className={`truncate ${t.text}`}>{nome}</span>
                          </div>
                          <span className={`shrink-0 ${t.textMuted}`}>{percent}% ({count})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className={`font-medium ${t.textMuted} mt-auto mb-auto text-center`}>Sem dados de situação para exibir.</p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    );
  };

  const renderDirectory = () => (
    <div className="space-y-6 animation-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <h2 className={`text-xl md:text-2xl font-black flex items-center gap-2 ${t.text}`}><Icon name="directory"/> Diretório Base</h2>
        <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <div className={`flex border-[3px] ${t.border} rounded-xl overflow-hidden shadow-mondrian-btn ${t.inputBgAlt} w-full sm:w-auto`}>
            <button onClick={() => setDirectoryViewMode('grid')} className={`p-2 sm:px-4 sm:py-2 flex-1 sm:flex-none flex items-center justify-center transition-colors ${directoryViewMode === 'grid' ? 'bg-[#DCAE1D] text-[#1A1A1A]' : `bg-transparent hover:bg-gray-500/20 ${t.text}`}`} title="Grade">
              <Icon name="grid" size={20} />
            </button>
            <div className={`w-[3px] ${t.border}`}></div>
            <button onClick={() => setDirectoryViewMode('list')} className={`p-2 sm:px-4 sm:py-2 flex-1 sm:flex-none flex items-center justify-center transition-colors ${directoryViewMode === 'list' ? 'bg-[#007577] text-white' : `bg-transparent hover:bg-gray-500/20 ${t.text}`}`} title="Lista">
              <Icon name="list" size={20} />
            </button>
          </div>
          <button onClick={openNewContactModal} className={`${mondrianButton} bg-[#007577] text-white hover:-translate-y-1 w-full sm:w-auto`}>
            <Icon name="plus" size={20} /> Adicionar
          </button>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className={`col-span-full py-12 px-4 text-center border-[3px] border-dashed ${t.border} rounded-xl ${t.cardBg}`}>
          <Icon name="alert" size={48} className="mx-auto mb-4 text-[#B32033]" />
          <h3 className={`text-xl md:text-2xl font-bold ${t.text}`}>Nenhum contato encontrado</h3>
        </div>
      ) : (
        <>
          {directoryViewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map(contact => (
                <div key={contact.id} onClick={() => { setSelectedContact(contact); setIsEditMode(false); }} className={`${mondrianCard} hover:-translate-y-1 hover:shadow-mondrian-btn cursor-pointer flex flex-col h-full`}>
                  <div className={`h-3 w-full border-b-[3px] ${t.border} ${contact.base.includes('Florianópolis') ? 'bg-[#007577]' : 'bg-[#DCAE1D]'}`}></div>
                  <div className="p-4 md:p-5 flex-grow flex flex-col gap-3">
                    <div>
                      <h3 className={`text-lg md:text-xl font-bold leading-tight mb-1 line-clamp-2 ${t.text}`}>{contact.lideranca}</h3>
                      <div className={`flex items-start text-xs md:text-sm font-semibold gap-1 mb-2 ${t.textMuted}`}>
                        <span className="text-[#B32033] mt-0.5 shrink-0"><Icon name="mappin" size={14} /></span> 
                        <span className="line-clamp-2">{contact.municipio_bairro} {contact.distrito ? `- ${contact.distrito}` : ''}</span>
                      </div>
                      <SituacaoBadge situacao={contact.situacao} />
                    </div>
                    <div className={`mt-auto pt-4 border-t-2 border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} flex flex-wrap gap-2 items-center justify-between`}>
                      <div className="flex flex-col gap-1.5 max-w-[70%]">
                        <span className={`text-[10px] md:text-xs font-bold truncate ${t.textMuted}`}><Icon name="tag" size={12} className="inline mr-1"/>{contact.temas || 'S/ Tema'}</span>
                        {contact.articulador && (
                          <span className={`text-[10px] md:text-xs font-bold truncate text-[#1A1A1A] dark:text-[#F4F4F0]`}><Icon name="usercheck" size={12} className="inline mr-1"/>{contact.articulador}</span>
                        )}
                      </div>
                      <button className={`p-2 ${t.inputBgAlt} border-[2px] ${t.border} rounded-md hover:bg-[#B32033] hover:text-white transition-colors shrink-0 ${t.text}`}><Icon name="chevronright" size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {directoryViewMode === 'list' && (
            <div className="flex flex-col gap-3">
              {filteredContacts.map(contact => (
                <div key={contact.id} onClick={() => { setSelectedContact(contact); setIsEditMode(false); }} className={`${mondrianCard} relative overflow-hidden hover:-translate-y-1 hover:shadow-mondrian-btn cursor-pointer p-4 md:p-0 flex flex-col md:flex-row md:items-center gap-3 md:gap-0`}>
                  <div className={`h-2 w-full md:w-3 md:h-full absolute left-0 top-0 md:bottom-0 ${contact.base.includes('Florianópolis') ? 'bg-[#007577]' : 'bg-[#DCAE1D]'}`}></div>
                  <div className="md:pl-6 md:pr-4 md:py-4 flex-1 mt-2 md:mt-0">
                    <h3 className={`text-base md:text-lg font-bold leading-tight mb-1 truncate ${t.text}`}>{contact.lideranca}</h3>
                    <div className={`flex items-start text-[10px] md:text-xs font-semibold gap-1 ${t.textMuted}`}>
                      <span className="text-[#B32033] mt-0.5 shrink-0"><Icon name="mappin" size={12} /></span> 
                      <span className="truncate">{contact.municipio_bairro} {contact.distrito ? `- ${contact.distrito}` : ''}</span>
                    </div>
                  </div>
                  <div className="md:px-4 md:py-4 flex-1 hidden sm:block border-t-2 md:border-t-0 md:border-l-2 border-dashed border-gray-300 dark:border-gray-700">
                    <span className={`text-[10px] md:text-xs font-bold truncate block ${t.textMuted}`}>Tema</span>
                    <span className={`text-xs md:text-sm font-bold truncate block ${t.text}`}><Icon name="tag" size={12} className="inline mr-1"/>{contact.temas || 'S/ Tema'}</span>
                  </div>
                  <div className="md:px-4 md:py-4 md:w-48 shrink-0 flex items-center">
                    <SituacaoBadge situacao={contact.situacao} />
                  </div>
                  {contact.articulador && (
                    <div className="md:px-4 md:py-4 md:w-40 shrink-0 hidden md:block border-l-2 border-dashed border-gray-300 dark:border-gray-700">
                       <span className={`text-[10px] md:text-xs font-bold truncate block ${t.textMuted}`}>Articulador</span>
                       <span className={`text-xs font-bold truncate flex items-center gap-1 text-[#1A1A1A] dark:text-[#F4F4F0]`}>
                          <Icon name="usercheck" size={14} className="text-[#007577]" /> {contact.articulador}
                       </span>
                    </div>
                  )}
                  <div className="md:px-4 md:py-4 shrink-0 hidden md:flex items-center justify-center ml-auto">
                     <button className={`p-2 ${t.inputBgAlt} border-[2px] ${t.border} rounded-md hover:bg-[#B32033] hover:text-white transition-colors ${t.text}`}><Icon name="chevronright" size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderModal = () => {
    if (!selectedContact) return null;
    const inputClasses = `w-full px-3 py-2 mt-1 rounded border-[2px] ${t.border} font-medium ${t.inputBg} ${t.text} text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#B32033]`;

    return (
      <div className="fixed inset-0 z-[50] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animation-fade-in">
        <div className={`${mondrianCard} w-full max-w-3xl max-h-[95vh] overflow-y-auto relative flex flex-col md:flex-row`}>
          <div className={`hidden md:block w-8 border-r-[3px] ${t.border} ${isEditMode ? 'bg-[#DCAE1D]' : 'bg-[#B32033]'} flex-shrink-0 transition-colors`}></div>
          <div className="flex-grow p-4 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="w-full">
                {isEditMode ? (
                  <h2 className={`text-xl md:text-2xl font-black flex items-center gap-2 ${t.text}`}><Icon name="edit"/> {formData.id ? 'Editar Contato' : 'Novo Contato'}</h2>
                ) : (
                  <>
                    <h2 className={`text-2xl md:text-3xl font-black mb-2 ${t.text} pr-12 sm:pr-0 leading-tight`}>{selectedContact.lideranca}</h2>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <div className={`flex items-center gap-2 font-bold ${t.textMuted} ${t.inputBgAlt} w-fit px-3 py-1 rounded-md border-[2px] ${t.border} text-xs md:text-sm`}>
                        <Icon name="tag" size={14} /> {selectedContact.base}
                      </div>
                      <SituacaoBadge situacao={selectedContact.situacao} />
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2 shrink-0 absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto">
                {!isEditMode && !selectedContact.isNew && (
                  <button onClick={() => openEditModal(selectedContact)} className={`p-2 border-[3px] ${t.border} rounded-xl hover:bg-[#DCAE1D] transition-colors shadow-mondrian-btn ${t.text}`} title="Editar">
                    <Icon name="edit" size={20} />
                  </button>
                )}
                <button onClick={() => { setSelectedContact(null); setIsEditMode(false); }} className={`p-2 border-[3px] ${t.border} rounded-xl hover:bg-[#B32033] hover:text-white transition-colors shadow-mondrian-btn ${t.text}`} title="Fechar">
                  <Icon name="x" size={20} />
                </button>
              </div>
            </div>

            {isEditMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Liderança (Nome) *</label>
                    <input type="text" name="lideranca" value={formData.lideranca || ''} onChange={handleFormChange} className={inputClasses} required />
                  </div>
                  <div>
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Aba / Base *</label>
                    <select name="base" value={formData.base || 'Base Florianópolis'} onChange={handleFormChange} className={inputClasses}>
                      <option value="Base Florianópolis">Base Florianópolis</option>
                      <option value="Base Santa Catarina">Base Santa Catarina</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Município / Bairro</label>
                    <input type="text" name="municipio_bairro" value={formData.municipio_bairro || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Região</label>
                    <input type="text" name="regiao" value={formData.regiao || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  {formData.base === 'Base Florianópolis' && (
                    <div>
                      <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Distrito (Só Floripa)</label>
                      <input type="text" name="distrito" value={formData.distrito || ''} onChange={handleFormChange} className={inputClasses} />
                    </div>
                  )}
                  <div>
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Situação</label>
                    <select name="situacao" value={formData.situacao || ''} onChange={handleFormChange} className={inputClasses}>
                      <option value="">Selecione...</option>
                      <option value="1 - Potencial">1 - Potencial</option>
                      <option value="2 - Abordagem">2 - Abordagem</option>
                      <option value="3 - Pré alinhado">3 - Pré alinhado</option>
                      <option value="4 - Comprometido">4 - Comprometido</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Área de Atuação</label>
                    <input type="text" name="area_de_atuacao" value={formData.area_de_atuacao || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Temas</label>
                    <input type="text" name="temas" value={formData.temas || ''} readOnly className={`${inputClasses} opacity-60 cursor-not-allowed`} title="Preenchido automaticamente via fórmula na planilha" />
                  </div>
                  <div>
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Tema Institucional</label>
                    <input type="text" name="tema_institucional" value={formData.tema_institucional || ''} readOnly className={`${inputClasses} opacity-60 cursor-not-allowed`} title="Preenchido automaticamente via fórmula na planilha" />
                  </div>
                  <div>
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Articulador</label>
                    <input type="text" name="articulador" value={formData.articulador || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Telefone</label>
                    <input type="text" name="telefone" value={formData.telefone || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>E-mail</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} className={inputClasses} />
                  </div>
                </div>
                <div>
                  <label className={`text-[10px] md:text-xs font-bold uppercase ${t.textMuted}`}>Observações</label>
                  <textarea name="observacoes" value={formData.observacoes || ''} onChange={handleFormChange} rows="3" className={inputClasses}></textarea>
                </div>
                <div className={`mt-6 pt-6 border-t-[3px] ${t.border} flex flex-col sm:flex-row justify-between gap-3 sm:gap-4`}>
                  {formData.id && (
                    <button onClick={() => handleDeleteContact(formData.id)} disabled={isLoading} className={`${mondrianButton} bg-[#B32033] text-white w-full sm:w-auto order-last sm:order-first`}>
                      <Icon name="trash" size={20} /> <span className="hidden sm:inline">Excluir</span>
                    </button>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:ml-auto w-full sm:w-auto">
                    <button onClick={() => { setIsEditMode(false); if(!formData.id) setSelectedContact(null); }} className={`${mondrianButton} ${t.inputBgAlt} ${t.text} w-full sm:w-auto`}>Cancelar</button>
                    <button onClick={handleSaveContact} disabled={isLoading || !formData.lideranca} className={`${mondrianButton} bg-[#007577] text-white w-full sm:w-auto`}>
                      <Icon name="save" size={20} className={isLoading ? "animate-spin" : ""} /> {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {selectedContact.area_de_atuacao && (
                  <div className={`mb-6 p-3 md:p-4 ${t.inputBgAlt} border-[2px] ${t.border} rounded-lg flex items-center gap-3`}>
                    <span className="text-[#DCAE1D] shrink-0"><Icon name="briefcase" size={24} /></span>
                    <div>
                      <p className={`font-bold text-base md:text-lg leading-tight ${t.text}`}>{selectedContact.area_de_atuacao}</p>
                      <p className={`text-xs md:text-sm font-semibold ${t.textMuted}`}>Área de Atuação</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Localização</label>
                      <p className={`font-bold flex items-start gap-2 text-sm md:text-base ${t.text}`}>
                        <span className="text-[#007577] mt-0.5 shrink-0"><Icon name="map" size={16}/></span> 
                        <span>
                          <span className="block">{selectedContact.municipio_bairro} {selectedContact.distrito ? `/ ${selectedContact.distrito}` : ''}</span>
                          <span className={`text-xs md:text-sm ${t.textMuted}`}>{selectedContact.regiao}</span>
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Telefone</label>
                      <p className={`font-bold flex items-center gap-2 text-sm md:text-base break-all ${t.text}`}><span className="text-[#DCAE1D] shrink-0"><Icon name="phone" size={16}/></span> {selectedContact.telefone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">E-mail</label>
                      <p className={`font-bold flex items-center gap-2 text-sm md:text-base break-all ${t.text}`}><span className="text-[#B32033] shrink-0"><Icon name="mail" size={16}/></span> {selectedContact.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {selectedContact.articulador && (
                      <div>
                        <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Articulador(a)</label>
                        <p className={`font-bold flex items-center gap-2 text-base md:text-lg text-[#1A1A1A] dark:text-[#F4F4F0]`}>
                          <span className="text-[#B32033] shrink-0"><Icon name="usercheck" size={18} /></span> {selectedContact.articulador}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Tema Principal</label>
                      <p className={`font-bold text-sm md:text-base ${t.text}`}>{selectedContact.temas || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Tema Institucional</label>
                      <p className={`font-bold text-sm md:text-base ${t.text}`}>{selectedContact.tema_institucional || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className={`border-t-[3px] ${t.border} pt-4 md:pt-6`}>
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Observações</label>
                  <div className={`${t.inputBgAlt} p-3 md:p-4 rounded-lg border-[2px] ${t.border} font-medium ${t.text} text-sm md:text-lg leading-relaxed whitespace-pre-wrap`}>
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
    <div className={`min-h-screen ${t.bgApp} p-3 sm:p-4 md:p-8 font-sans selection:bg-[#DCAE1D] selection:text-[#1A1A1A] transition-colors duration-300 overflow-x-hidden`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .animation-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .shadow-mondrian { box-shadow: 5px 5px 0 0 var(--border-color); }
        .shadow-mondrian-btn { box-shadow: 3px 3px 0 0 var(--border-color); }
        .shadow-mondrian-btn:active:not(:disabled) { box-shadow: 0 0 0 0 transparent; transform: translate(3px, 3px); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: var(--border-color); border-radius: 4px; }
      `}} />

      <div className="max-w-6xl mx-auto">
        <header className={`mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end justify-between border-b-[4px] ${t.border} pb-4 md:pb-6 gap-4 relative`}>
          <div className="flex items-center gap-3 md:gap-4 relative z-10">
            <div className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0`}>
              <img src="https://raw.githubusercontent.com/killuixo/tabulum-sig-maplid/refs/heads/main/icon-192.png" alt="Ícone TABULUM" className="w-full h-full object-contain drop-shadow-md rounded-xl" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-4xl font-black uppercase tracking-tight ${t.text} leading-none`}>TABULUM</h1>
              <p className="text-sm md:text-lg font-bold text-[#007577] mt-1">Mapa de Lideranças</p>
            </div>
          </div>
          <div className="flex gap-2 relative z-10 self-start sm:self-auto ml-1 sm:ml-0 mt-2 sm:mt-0">
            <span className={`h-3 w-3 md:h-4 md:w-4 rounded-sm border-[2px] ${t.border} bg-[#B32033]`}></span>
            <span className={`h-3 w-3 md:h-4 md:w-4 rounded-sm border-[2px] ${t.border} bg-[#007577]`}></span>
            <span className={`h-3 w-3 md:h-4 md:w-4 rounded-sm border-[2px] ${t.border} bg-[#DCAE1D]`}></span>
          </div>
        </header>

        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          <button onClick={() => setView('dashboard')} className={`${mondrianButton} ${view === 'dashboard' ? 'bg-[#DCAE1D] text-[#1A1A1A]' : `${t.cardBg} ${t.text}`}`}>
            <Icon name="dashboard" size={20} /> <span className="truncate">Dashboard</span>
          </button>
          <button onClick={() => setView('directory')} className={`${mondrianButton} ${view === 'directory' ? 'bg-[#007577] text-white' : `${t.cardBg} ${t.text}`}`}>
            <Icon name="directory" size={20} /> <span className="truncate">Diretório</span>
          </button>
        </nav>

        {renderGlobalFilters()}

        <main>
          {view === 'dashboard' && renderDashboard()}
          {view === 'directory' && renderDirectory()}
        </main>
      </div>

      {renderModal()}
      
      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animation-fade-in">
          <div className={`${mondrianCard} w-full max-w-sm p-6 text-center shadow-2xl`}>
            <Icon name="alert" size={48} className={`mx-auto mb-4 ${dialog.type === 'confirm' ? 'text-[#DCAE1D]' : 'text-[#B32033]'}`} />
            <p className={`font-bold text-lg mb-6 ${t.text}`}>{dialog.message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {dialog.type === 'confirm' && (
                <button onClick={() => setDialog(null)} className={`${mondrianButton} ${t.inputBgAlt} ${t.text} flex-1`}>Cancelar</button>
              )}
              <button onClick={() => { if (dialog.onConfirm) dialog.onConfirm(); else setDialog(null); }} className={`${mondrianButton} ${dialog.type === 'confirm' ? 'bg-[#B32033]' : 'bg-[#007577]'} text-white flex-1`}>
                {dialog.type === 'confirm' ? 'Apagar' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```eof
