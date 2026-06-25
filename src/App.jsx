import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// CONFIGURAÇÃO DE URL SEGURA
// ==========================================
const GOOGLE_SHEETS_WEBAPP_URL = 
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SHEETS_URL) || 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SHEETS_URL) || 
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SHEETS_URL) || 
  ""; 

// --- ÍCONES SVG NATIVOS ---
const Icon = ({ path, className = "w-6 h-6", onClick, size, style }) => (
  <svg onClick={onClick} style={{ width: size, height: size, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" className={className}>
    {path}
  </svg>
);
const SearchIcon = (p) => <Icon {...p} path={<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>} />;
const MapPinIcon = (p) => <Icon {...p} path={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>} />;
const UserIcon = (p) => <Icon {...p} path={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />;
const TagIcon = (p) => <Icon {...p} path={<><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></>} />;
const EditIcon = (p) => <Icon {...p} path={<><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></>} />;
const SaveIcon = (p) => <Icon {...p} path={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />;
const XIcon = (p) => <Icon {...p} path={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>} />;
const SettingsIcon = (p) => <Icon {...p} path={<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>} />;
const LogInIcon = (p) => <Icon {...p} path={<><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></>} />;
const LogOutIcon = (p) => <Icon {...p} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>} />;
const CheckCircleIcon = (p) => <Icon {...p} path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} />;
const AlertTriangleIcon = (p) => <Icon {...p} path={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></>} />;
const RefreshCwIcon = (p) => <Icon {...p} path={<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></>} />;
const UploadCloudIcon = (p) => <Icon {...p} path={<><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></>} />;
const LayoutDashboardIcon = (p) => <Icon {...p} path={<><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></>} />;
const TableIcon = (p) => <Icon {...p} path={<><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></>} />;
const BriefcaseIcon = (p) => <Icon {...p} path={<><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>} />;
const PlusIcon = (p) => <Icon {...p} path={<><path d="M5 12h14"/><path d="M12 5v14"/></>} />;
const TrashIcon = (p) => <Icon {...p} path={<><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></>} />;

const INITIAL_MOCK_DATA = [
  { id: "mock_1", base: "Base Florianópolis", lideranca: "Fátima Lima", municipio_bairro: "Armação", regiao: "Sul", distrito: "Pântano do Sul", situacao: "3 - Pré alinhado", area_de_atuacao: "Cultura/Teatro", temas: "Cultura", tema_institucional: "FUNDO SOCIAL", articulador: "Guto", telefone: "48984692944", email: "costadelimafatima@gmail.com", observacoes: "" },
  { id: "mock_2", base: "Base Santa Catarina", lideranca: "Amilton", municipio_bairro: "Santo Amaro da Imperatriz", regiao: "GRANDE FLORIANÓPOLIS", distrito: "", situacao: "4 - Comprometido", area_de_atuacao: "Agricultor Orgânico", temas: "Agroecologia", tema_institucional: "AGRICULTURA", articulador: "Toninho", telefone: "48996905764", email: "", observacoes: "" },
];

const MAP_COORDINATES = {
  SC: {
    "Florianópolis": { x: 88, y: 55 }, "Santo Amaro da Imperatriz": { x: 85, y: 55 },
    "São José": { x: 87, y: 54 }, "Palhoça": { x: 86, y: 56 }, "Joinville": { x: 85, y: 20 },
    "Chapecó": { x: 15, y: 45 }, "Criciúma": { x: 80, y: 85 }, "Lages": { x: 55, y: 65 },
    "Blumenau": { x: 75, y: 35 }, "Itajaí": { x: 85, y: 35 }, "Garopaba": { x: 87, y: 65 }
  },
  FLN: {
    "Centro": { x: 45, y: 45 }, "Sul da Ilha": { x: 55, y: 75 }, "Campeche": { x: 58, y: 70 },
    "Armação": { x: 60, y: 85 }, "Rio Tavares": { x: 55, y: 65 }, "Norte da Ilha": { x: 50, y: 20 },
    "Ingleses": { x: 65, y: 15 }, "Canasvieiras": { x: 45, y: 10 }, "Continente": { x: 30, y: 42 },
    "Coqueiros": { x: 32, y: 45 }, "Lagoa da Conceição": { x: 65, y: 45 }, "Trindade": { x: 48, y: 40 }
  }
};

export default function App() {
  const [contacts, setContacts] = useState(INITIAL_MOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estados de Tela Neo-Brutalistas
  const [currentView, setCurrentView] = useState('list'); // 'list', 'dashboard', 'detail', 'edit', 'settings'
  const [selectedContact, setSelectedContact] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  
  // Filtros Globais
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBase, setFilterBase] = useState('Todas');
  const [filterTemas, setFilterTemas] = useState('Todos');
  const [filterSituacao, setFilterSituacao] = useState('Todas');
  const [filterArticulador, setFilterArticulador] = useState('Todos');
  
  // Filtros Territoriais
  const [filterDistrito, setFilterDistrito] = useState('Todos');
  const [filterRegiao, setFilterRegiao] = useState('Todas');
  const [filterMunicipioBairro, setFilterMunicipioBairro] = useState('Todas');

  const [mapScope, setMapScope] = useState('SC');
  const [localSyncUrl, setLocalSyncUrl] = useState(() => localStorage.getItem('tabulum_liderancas_sync') || GOOGLE_SHEETS_WEBAPP_URL);

  // Modais
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // Listas Únicas
  const bases = ['Todas', 'Base Florianópolis', 'Base Santa Catarina'];
  const temasExtraidos = ['Todos', ...new Set(contacts.map(c => c.temas).filter(Boolean))].sort();
  const situacoesExtraidas = ['Todas', ...new Set(contacts.map(c => c.situacao).filter(Boolean))].sort();
  const articuladoresExtraidos = ['Todos', ...new Set(contacts.map(c => c.articulador).filter(Boolean))].sort();
  const distritosExtraidos = ['Todos', ...new Set(contacts.filter(c => c.base === 'Base Florianópolis').map(c => c.distrito).filter(Boolean))].sort();
  const bairrosExtraidos = ['Todas', ...new Set(contacts.filter(c => c.base === 'Base Florianópolis').map(c => c.municipio_bairro).filter(Boolean))].sort();
  const regioesExtraidas = ['Todas', ...new Set(contacts.filter(c => c.base === 'Base Santa Catarina').map(c => c.regiao).filter(Boolean))].sort();
  const municipiosExtraidos = ['Todas', ...new Set(contacts.filter(c => c.base === 'Base Santa Catarina').map(c => c.municipio_bairro).filter(Boolean))].sort();

  useEffect(() => {
    document.title = "TABULUM - Lideranças";
    const storedAuth = sessionStorage.getItem('tabulum_liderancas_auth');
    if (storedAuth === 'true') setIsAdmin(true);

    if (localSyncUrl) syncWithCloud();
  }, []);

  useEffect(() => {
    setFilterDistrito('Todos');
    setFilterRegiao('Todas');
    setFilterMunicipioBairro('Todas');
    if (filterBase === 'Base Florianópolis') setMapScope('FLN');
    else if (filterBase === 'Base Santa Catarina') setMapScope('SC');
  }, [filterBase]);

  // --- FUNÇÕES DE DADOS ---
  const syncWithCloud = async () => {
    if (!localSyncUrl) return;
    setLoading(true);
    try {
      const res = await fetch(localSyncUrl);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setContacts(data);
    } catch (e) {
      console.error("Erro ao sincronizar:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveToCloud = async (action, dataPayload) => {
    if (!localSyncUrl) return;
    try {
      await fetch(localSyncUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ _action: action, ...dataPayload })
      });
      await syncWithCloud();
    } catch (e) {
      console.error("Erro ao salvar na nuvem:", e);
      alert("Ocorreu um erro ao comunicar com a planilha.");
    }
  };

  const handleSaveContact = async () => {
    if (!editingContact) return;
    setLoading(true);
    const isNew = !editingContact.id;
    const contactToSave = { ...editingContact };
    
    if (isNew) {
      contactToSave.id = "temp_" + Date.now(); 
      setContacts(prev => [...prev, contactToSave]);
    } else {
      setContacts(prev => prev.map(c => String(c.id) === String(contactToSave.id) ? contactToSave : c));
    }
    
    setSelectedContact(contactToSave);
    setCurrentView('detail');
    setEditingContact(null);
    await saveToCloud('update', contactToSave);
    setLoading(false);
  };

  const handleDeleteContact = (id) => {
    confirmAction("Apagar Liderança", "Tem certeza que deseja apagar permanentemente este contato da base?", async () => {
      setLoading(true);
      setContacts(prev => prev.filter(c => String(c.id) !== String(id)));
      setCurrentView('list');
      setEditingContact(null);
      await saveToCloud('delete', { id });
      setLoading(false);
    });
  };

  const handleLogin = () => {
    if (loginInput === 'admin') {
      setIsAdmin(true);
      sessionStorage.setItem('tabulum_liderancas_auth', 'true');
      setShowLoginModal(false);
      setLoginInput('');
    } else {
      alert("Senha incorreta.");
    }
  };

  const confirmAction = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true, title, message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  // --- FILTROS ---
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchesBase = filterBase === 'Todas' || c.base === filterBase;
      const matchesArticulador = filterArticulador === 'Todos' || c.articulador === filterArticulador;
      const matchesRegiao = filterRegiao === 'Todas' || c.regiao === filterRegiao;
      const matchesDistrito = filterDistrito === 'Todos' || c.distrito === filterDistrito;
      const matchesMunBairro = filterMunicipioBairro === 'Todas' || c.municipio_bairro === filterMunicipioBairro;
      const matchesTemas = filterTemas === 'Todos' || c.temas === filterTemas;
      const matchesSituacao = filterSituacao === 'Todas' || c.situacao === filterSituacao;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (c.lideranca && c.lideranca.toLowerCase().includes(searchLower)) ||
        (c.municipio_bairro && c.municipio_bairro.toLowerCase().includes(searchLower)) ||
        (c.area_de_atuacao && c.area_de_atuacao.toLowerCase().includes(searchLower));
        
      return matchesBase && matchesArticulador && matchesRegiao && matchesDistrito && 
             matchesMunBairro && matchesTemas && matchesSituacao && matchesSearch;
    });
  }, [contacts, filterBase, filterArticulador, filterRegiao, filterDistrito, filterMunicipioBairro, filterTemas, filterSituacao, searchTerm]);

  // --- COMPONENTES COMPARTILHADOS NEO-BRUTALISTAS ---
  const Navbar = () => (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer group" onClick={() => setCurrentView('list')}>
            <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center mr-3 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform group-hover:scale-110">
               <UserIcon className="h-6 w-6 text-black" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-black hidden sm:block">TABULUM <span className="text-teal-700">Lideranças</span></span>
          </div>
          <div className="flex items-center space-x-3">
            {isAdmin ? (
              <>
                <button onClick={() => {
                  setEditingContact({
                    id: '', base: 'Base Florianópolis', lideranca: '', municipio_bairro: '', regiao: '', distrito: '', situacao: '', area_de_atuacao: '', temas: '', tema_institucional: '', articulador: filterArticulador !== 'Todos' ? filterArticulador : '', telefone: '', email: '', observacoes: ''
                  });
                  setCurrentView('edit');
                }} className="hidden sm:flex items-center bg-teal-600 border-2 border-black px-4 py-2 font-black text-white uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-teal-700 transition-transform active:translate-y-1 active:shadow-none">
                  <PlusIcon className="h-4 w-4 mr-2" /> Novo Contato
                </button>
                <button onClick={() => setCurrentView('settings')} className="bg-amber-400 border-2 border-black p-2 hover:bg-amber-500 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform active:translate-y-1 active:shadow-none" title="Ajustes">
                  <SettingsIcon className="h-5 w-5 text-black" />
                </button>
                <button onClick={() => { setIsAdmin(false); sessionStorage.removeItem('tabulum_liderancas_auth'); }} className="bg-rose-700 border-2 border-black p-2 hover:bg-rose-800 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform active:translate-y-1 active:shadow-none" title="Sair">
                  <LogOutIcon className="h-5 w-5 text-white" />
                </button>
              </>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="flex items-center bg-amber-400 border-2 border-black px-4 py-2 font-black text-black uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-amber-500 transition-transform active:translate-y-1 active:shadow-none">
                <LogInIcon className="h-4 w-4 mr-2" /> Acesso
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const HeaderSwitcher = ({ title }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">{title}</h1>
        <div className="flex border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <button 
            onClick={() => setCurrentView('list')}
            className={`p-2 flex items-center font-bold uppercase text-xs border-r-2 border-black transition-colors ${currentView === 'list' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <TableIcon className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Diretório</span>
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`p-2 flex items-center font-bold uppercase text-xs transition-colors ${currentView === 'dashboard' ? 'bg-amber-400 text-black' : 'hover:bg-gray-100'}`}
          >
            <LayoutDashboardIcon className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      </div>
      {isAdmin && currentView === 'list' && (
        <button onClick={() => syncWithCloud()} disabled={loading}
          className="flex items-center px-4 py-2 bg-teal-600 text-white font-bold uppercase border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-teal-700 transition-transform active:translate-y-1 active:shadow-none">
          <RefreshCwIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Sincronizar</span>
        </button>
      )}
    </div>
  );

  const FilterBar = () => (
    <div className="bg-white p-4 border-4 border-black mb-8 flex flex-wrap gap-4 items-center shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
      <div className="flex-1 min-w-[200px] relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input 
          type="text" 
          placeholder="Buscar liderança, local..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-rose-700 font-medium"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <select className="px-3 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-teal-600 font-bold uppercase text-xs cursor-pointer max-w-[150px] truncate"
        value={filterBase} onChange={(e) => setFilterBase(e.target.value)}>
        {bases.map(b => <option key={b} value={b}>{b}</option>)}
      </select>

      {filterBase === 'Base Florianópolis' && (
        <>
          <select className="px-3 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-teal-600 font-bold uppercase text-xs cursor-pointer max-w-[120px] truncate" value={filterDistrito} onChange={(e) => setFilterDistrito(e.target.value)}>
            <option value="Todos">Distrito</option>{distritosExtraidos.filter(d => d!=='Todos').map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="px-3 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-teal-600 font-bold uppercase text-xs cursor-pointer max-w-[120px] truncate" value={filterMunicipioBairro} onChange={(e) => setFilterMunicipioBairro(e.target.value)}>
            <option value="Todas">Bairro</option>{bairrosExtraidos.filter(b => b!=='Todas').map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </>
      )}

      {filterBase === 'Base Santa Catarina' && (
        <>
          <select className="px-3 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-teal-600 font-bold uppercase text-xs cursor-pointer max-w-[120px] truncate" value={filterRegiao} onChange={(e) => setFilterRegiao(e.target.value)}>
            <option value="Todas">Região</option>{regioesExtraidas.filter(r => r!=='Todas').map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="px-3 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-teal-600 font-bold uppercase text-xs cursor-pointer max-w-[120px] truncate" value={filterMunicipioBairro} onChange={(e) => setFilterMunicipioBairro(e.target.value)}>
            <option value="Todas">Município</option>{municipiosExtraidos.filter(m => m!=='Todas').map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </>
      )}

      <select className="px-3 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-amber-500 font-bold uppercase text-xs cursor-pointer max-w-[120px] truncate"
        value={filterTemas} onChange={(e) => setFilterTemas(e.target.value)}>
        <option value="Todos">Tema</option>
        {temasExtraidos.filter(t => t!=='Todos').map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <select className="px-3 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-amber-500 font-bold uppercase text-xs cursor-pointer max-w-[120px] truncate"
        value={filterSituacao} onChange={(e) => setFilterSituacao(e.target.value)}>
        <option value="Todas">Situação</option>
        {situacoesExtraidas.filter(s => s!=='Todas').map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select className="px-3 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-rose-700 font-bold uppercase text-xs cursor-pointer max-w-[120px] truncate"
        value={filterArticulador} onChange={(e) => setFilterArticulador(e.target.value)}>
        <option value="Todos">Articulador</option>
        {articuladoresExtraidos.filter(a => a!=='Todos').map(a => <option key={a} value={a}>{a}</option>)}
      </select>

      <button onClick={() => { setSearchTerm(''); setFilterBase('Todas'); setFilterTemas('Todos'); setFilterSituacao('Todas'); setFilterArticulador('Todos'); }}
        className="bg-rose-700 p-2 text-white border-2 border-black hover:bg-rose-800 transition-colors" title="Limpar filtros">
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );

  const SituacaoBadge = ({ situacao }) => {
    if (!situacao) return <span className="text-gray-400 italic text-xs">Indefinida</span>;
    let cor = "bg-gray-200 text-black";
    if (situacao.includes("4 -")) cor = "bg-teal-600 text-white";
    else if (situacao.includes("3 -")) cor = "bg-amber-400 text-black";
    else if (situacao.includes("1 -") || situacao.includes("2 -")) cor = "bg-rose-700 text-white";
    return <span className={`inline-block border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase ${cor}`}>{situacao}</span>;
  };

  // --- VIEWS ---
  const ListView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <HeaderSwitcher title="Diretório de Lideranças" />
      <FilterBar />

      <div className="bg-white border-4 border-black overflow-x-auto shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <table className="min-w-full border-collapse">
          <thead className="bg-amber-400 border-b-4 border-black">
            <tr>
              <th className="w-2 px-0 py-0 border-r-2 border-black"></th>
              <th className="px-4 py-3 text-left text-xs font-black text-black uppercase border-r-2 border-black">Liderança</th>
              <th className="px-4 py-3 text-left text-xs font-black text-black uppercase border-r-2 border-black">Localização</th>
              <th className="px-4 py-3 text-left text-xs font-black text-black uppercase border-r-2 border-black">Área / Tema</th>
              <th className="px-4 py-3 text-left text-xs font-black text-black uppercase border-r-2 border-black">Situação</th>
              <th className="px-4 py-3 text-left text-xs font-black text-black uppercase">Articulador</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredContacts.map((c) => (
              <tr key={c.id} onClick={() => { setSelectedContact(c); setCurrentView('detail'); }}
                className="hover:bg-amber-50 cursor-pointer border-b-2 border-black transition-colors group">
                <td className={`w-2 px-0 py-0 ${c.base.includes('Florianópolis') ? 'bg-teal-600' : 'bg-amber-400'} border-r-2 border-black`}></td>
                <td className="px-4 py-3 text-sm font-bold text-black border-r-2 border-gray-200">
                  {c.lideranca}
                </td>
                <td className="px-4 py-3 text-xs font-medium border-r-2 border-gray-200">
                  <div className="flex items-center text-teal-800">
                    <MapPinIcon className="h-3 w-3 mr-1" /> {c.municipio_bairro} {c.distrito ? `- ${c.distrito}` : ''}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs border-r-2 border-gray-200 max-w-[200px] truncate">
                  <span className="font-bold block truncate">{c.area_de_atuacao || '-'}</span>
                  <span className="text-[10px] uppercase text-gray-500 font-bold flex items-center mt-1"><TagIcon className="h-3 w-3 mr-1" /> {c.temas || 'Sem Tema'}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap border-r-2 border-gray-200">
                  <SituacaoBadge situacao={c.situacao} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-bold text-rose-700 flex items-center">
                    <UserIcon className="h-3 w-3 mr-1" /> {c.articulador || '-'}
                  </span>
                </td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-12 text-center font-bold text-gray-500 uppercase">Nenhum contato encontrado.</td></tr>
            )}
          </tbody>
        </table>
        <div className="bg-gray-100 px-6 py-3 font-bold text-sm text-black flex justify-between">
          <span>{filteredContacts.length} Registros Filtrados</span>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => {
    const floripaCount = filteredContacts.filter(c => c.base === 'Base Florianópolis').length;
    const scCount = filteredContacts.filter(c => c.base === 'Base Santa Catarina').length;
    
    const temaCounts = filteredContacts.reduce((acc, curr) => { if(curr.temas) acc[curr.temas] = (acc[curr.temas] || 0) + 1; return acc; }, {});
    const topTemas = Object.entries(temaCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const situacaoCounts = filteredContacts.reduce((acc, curr) => { if(curr.situacao) acc[curr.situacao] = (acc[curr.situacao] || 0) + 1; return acc; }, {});
    const topSituacoes = Object.entries(situacaoCounts).sort((a, b) => a[0].localeCompare(b[0]));

    const heatPoints = {};
    filteredContacts.forEach(c => {
      if (mapScope === 'FLN' && c.base !== 'Base Florianópolis') return;
      if (mapScope === 'SC' && c.base !== 'Base Santa Catarina') return; 
      const locName = c.municipio_bairro;
      const coords = MAP_COORDINATES[mapScope][locName];
      if (coords) {
        if (!heatPoints[locName]) heatPoints[locName] = { ...coords, count: 0, label: locName };
        heatPoints[locName].count += 1;
      }
    });
    const maxCount = Math.max(1, ...Object.values(heatPoints).map(p => p.count));

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
        <HeaderSwitcher title="Dashboard Estatístico" />
        <FilterBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-amber-400 border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <p className="text-black font-black uppercase text-sm tracking-widest border-b-4 border-black pb-2 mb-4">Total Filtrado</p>
              <h2 className="text-5xl font-black text-black leading-none">{filteredContacts.length}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-teal-600 text-white border-4 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                 <p className="font-black uppercase text-[10px] tracking-widest mb-2 flex items-center"><MapPinIcon className="h-3 w-3 mr-1"/> Floripa</p>
                 <h2 className="text-3xl font-black">{floripaCount}</h2>
               </div>
               <div className="bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                 <p className="font-black uppercase text-[10px] tracking-widest mb-2 flex items-center"><MapPinIcon className="h-3 w-3 mr-1"/> S. Catarina</p>
                 <h2 className="text-3xl font-black">{scCount}</h2>
               </div>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <p className="text-black font-black uppercase text-sm tracking-widest border-b-4 border-black pb-2 mb-6">Status de Alinhamento</p>
              <div className="space-y-4">
                {topSituacoes.length > 0 ? topSituacoes.map(([nome, count]) => {
                  const pct = Math.max((count / filteredContacts.length) * 100, 5);
                  let colorClass = 'bg-gray-200';
                  if (nome.includes('4 -')) colorClass = 'bg-teal-600';
                  else if (nome.includes('3 -')) colorClass = 'bg-amber-400';
                  else if (nome.includes('1 -') || nome.includes('2 -')) colorClass = 'bg-rose-700';
                  return (
                    <div key={nome}>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                        <span>{nome}</span><span>{count}</span>
                      </div>
                      <div className="h-4 w-full bg-gray-100 border-2 border-black">
                        <div className={`h-full ${colorClass} border-r-2 border-black`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                }) : <p className="text-sm font-bold text-gray-500 uppercase">Sem dados.</p>}
              </div>
            </div>
            
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <p className="text-black font-black uppercase text-sm tracking-widest border-b-4 border-black pb-2 mb-6">Top Temas</p>
              <div className="space-y-4">
                {topTemas.length > 0 ? topTemas.map(([nome, count]) => {
                  const max = Math.max(...topTemas.map(t => t[1]));
                  const pct = Math.max((count / max) * 100, 5);
                  return (
                    <div key={nome}>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                        <span className="truncate pr-2">{nome}</span><span>{count}</span>
                      </div>
                      <div className="h-4 w-full bg-gray-100 border-2 border-black">
                        <div className="h-full bg-black border-r-2 border-black" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                }) : <p className="text-sm font-bold text-gray-500 uppercase">Sem dados.</p>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col relative overflow-hidden h-[600px] lg:h-auto">
            <div className="bg-black border-b-4 border-black p-4 flex justify-between items-center z-10 flex-wrap gap-4">
              <p className="text-white font-black uppercase tracking-widest flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-amber-400" /> Densidade Territorial
              </p>
              <div className="flex border-2 border-white bg-black">
                <button onClick={() => setMapScope('SC')} className={`px-4 py-1 font-bold text-xs uppercase border-r-2 border-white transition-colors ${mapScope === 'SC' ? 'bg-amber-400 text-black' : 'text-white hover:bg-gray-800'}`}>SC</button>
                <button onClick={() => setMapScope('FLN')} className={`px-4 py-1 font-bold text-xs uppercase transition-colors ${mapScope === 'FLN' ? 'bg-teal-600 text-white' : 'text-white hover:bg-gray-800'}`}>Floripa</button>
              </div>
            </div>
            
            <div className="flex-1 bg-[#e5e5e5] relative overflow-hidden flex items-center justify-center p-4">
               <div className={`relative w-full ${mapScope === 'SC' ? 'aspect-video max-w-2xl' : 'aspect-[3/4] max-w-sm'}`}>
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {mapScope === 'SC' ? (
                      <polygon points="5,45 35,30 65,20 85,10 95,40 98,55 90,85 75,95 55,75 25,65 5,60" fill="#000" />
                    ) : (
                      <>
                        <polygon points="5,35 35,35 40,55 25,65 5,65" fill="#000" />
                        <polygon points="45,15 65,10 75,40 85,70 70,95 55,85 50,60 40,40" fill="#000" />
                      </>
                    )}
                  </svg>
                  {Object.values(heatPoints).map((pt, i) => {
                    const intensity = pt.count / maxCount;
                    const size = 20 + (intensity * 40); 
                    const color = mapScope === 'FLN' ? '#0d9488' : '#be123c'; // teal-600 ou rose-700
                    return (
                      <div key={i} className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group cursor-crosshair" style={{ top: `${pt.y}%`, left: `${pt.x}%`, width: size, height: size }}>
                        <div className="absolute inset-0 rounded-full animate-pulse opacity-40" style={{ backgroundColor: color }}></div>
                        <div className="absolute inset-2 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]" style={{ backgroundColor: color }}></div>
                        <div className="absolute top-full mt-2 w-max max-w-[150px] bg-white text-black text-xs font-black px-2 py-1 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-[2px_2px_0_0_rgba(0,0,0,1)] uppercase">
                          {pt.label}: {pt.count}
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DetailView = () => {
    const isEditing = currentView === 'edit';
    const data = isEditing ? editingContact : selectedContact;
    if (!data) return null;

    const handleInputChange = (field, value) => setEditingContact(prev => ({ ...prev, [field]: value }));

    const InfoField = ({ label, field, icon: IconComponent, type = 'text', color = 'teal', options = null }) => {
      const value = data[field];
      const colorClass = color === 'teal' ? 'text-teal-700' : color === 'rose' ? 'text-rose-700' : 'text-amber-600';
      
      if (isEditing) {
        return (
          <div className="mb-4">
            <label className={`block text-[10px] font-black uppercase mb-1 ${colorClass}`}>{label}</label>
            {type === 'textarea' ? (
              <textarea className="w-full p-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-rose-700 font-medium"
                rows="3" value={value || ''} onChange={(e) => handleInputChange(field, e.target.value)} />
            ) : options ? (
              <select className="w-full p-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-rose-700 font-medium cursor-pointer"
                value={value || ''} onChange={(e) => handleInputChange(field, e.target.value)}>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type="text" className="w-full p-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none focus:border-rose-700 font-medium"
                value={value || ''} onChange={(e) => handleInputChange(field, e.target.value)} />
            )}
          </div>
        );
      }
      return (
        <div className="mb-4 bg-white p-3 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] relative">
          <label className={`block text-[10px] font-black uppercase tracking-wider mb-1 flex items-center ${colorClass}`}>
            {IconComponent && <IconComponent className="h-3 w-3 mr-1" />} {label}
          </label>
          <div className="text-black font-bold text-sm">
            {field === 'situacao' ? <SituacaoBadge situacao={value} /> : value || <span className="text-gray-400 italic font-normal">N/A</span>}
          </div>
        </div>
      );
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-right-4">
        <button onClick={() => { setCurrentView('list'); setEditingContact(null); }}
          className="bg-black text-white px-4 py-2 font-bold uppercase text-xs border-2 border-black hover:bg-gray-800 mb-6 flex items-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          &larr; Voltar
        </button>

        <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
          <div className={`absolute top-0 left-0 bottom-0 w-4 ${data.base === 'Base Florianópolis' ? 'bg-teal-600' : 'bg-amber-400'} border-r-4 border-black hidden md:block`}></div>
          
          <div className="bg-rose-700 border-b-4 border-black p-6 md:pl-10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <p className="text-white font-bold uppercase text-[10px] mb-1 tracking-wider">Ficha de Liderança</p>
              <h2 className="text-4xl font-black text-white tracking-tighter">
                {isEditing && !data.id ? 'Novo Contato' : data.lideranca}
              </h2>
            </div>
            {isAdmin && !isEditing && (
              <button onClick={() => { setEditingContact({ ...selectedContact }); setCurrentView('edit'); }}
                className="bg-amber-400 text-black border-2 border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-amber-500 transition-transform active:translate-y-1 active:shadow-none flex items-center shrink-0">
                <EditIcon className="h-5 w-5 mr-2" /> Editar Ficha
              </button>
            )}
            {isAdmin && isEditing && (
              <div className="flex space-x-3 shrink-0">
                <button onClick={() => { setCurrentView('list'); setEditingContact(null); }}
                  className="bg-white text-black border-2 border-black px-4 py-2 font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-gray-100 transition-transform active:translate-y-1 active:shadow-none flex items-center">
                  <XIcon className="h-5 w-5 mr-2" /> Cancela
                </button>
                <button onClick={handleSaveContact} disabled={loading}
                  className="bg-teal-500 text-black border-2 border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-teal-600 transition-transform active:translate-y-1 active:shadow-none flex items-center">
                  {loading ? <RefreshCwIcon className="h-5 w-5 mr-2 animate-spin" /> : <SaveIcon className="h-5 w-5 mr-2" />} Salvar
                </button>
              </div>
            )}
          </div>

          <div className="p-6 md:pl-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-4">
            {isEditing && (
               <div className="col-span-1 md:col-span-2">
                 <InfoField label="Nome da Liderança *" field="lideranca" color="rose" />
               </div>
            )}

            <div className="space-y-3 bg-gray-50 border-2 border-black p-4 relative pt-6">
              <div className="bg-black text-white font-black uppercase text-[10px] py-1 px-3 absolute -top-3 left-3 border-2 border-black shadow-[2px_2px_0_0_rgba(255,255,255,1)]">Território</div>
              <InfoField label="Aba / Base" field="base" options={['Base Florianópolis', 'Base Santa Catarina']} color="rose" />
              <InfoField label="Município / Bairro" field="municipio_bairro" icon={MapPinIcon} color="teal" />
              <div className="grid grid-cols-2 gap-2">
                <InfoField label="Região" field="regiao" />
                <InfoField label="Distrito (Fpolis)" field="distrito" />
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 border-2 border-black p-4 relative pt-6">
              <div className="bg-black text-white font-black uppercase text-[10px] py-1 px-3 absolute -top-3 left-3 border-2 border-black shadow-[2px_2px_0_0_rgba(255,255,255,1)]">Atuação & Alinhamento</div>
              <InfoField label="Área de Atuação" field="area_de_atuacao" icon={BriefcaseIcon} color="amber" />
              <div className="grid grid-cols-2 gap-2">
                <InfoField label="Tema Principal" field="temas" icon={TagIcon} color="teal" />
                <InfoField label="Tema Institucional" field="tema_institucional" />
              </div>
              <InfoField label="Situação / Status" field="situacao" color="rose" />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-3 bg-teal-50 border-2 border-black p-4 relative pt-6">
              <div className="bg-teal-600 text-white font-black uppercase text-[10px] py-1 px-3 absolute -top-3 left-3 border-2 border-black shadow-[2px_2px_0_0_rgba(255,255,255,1)]">Contato & Articulação</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="Telefone" field="telefone" color="rose" />
                <InfoField label="Email" field="email" />
                <InfoField label="Articulador" field="articulador" icon={UserIcon} color="teal" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-3 bg-amber-50 border-2 border-black p-4 relative pt-6">
              <div className="bg-amber-400 text-black font-black uppercase text-[10px] py-1 px-3 absolute -top-3 left-3 border-2 border-black shadow-[2px_2px_0_0_rgba(255,255,255,1)]">Observações Livres</div>
              <InfoField label="Anotações" field="observacoes" type="textarea" />
            </div>

            {isEditing && data.id && (
              <div className="col-span-1 md:col-span-2 pt-4 border-t-4 border-black border-dashed flex justify-end">
                <button onClick={() => handleDeleteContact(data.id)} className="bg-rose-700 text-white border-2 border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-rose-800 transition-transform active:translate-y-1 active:shadow-none flex items-center">
                  <TrashIcon className="h-5 w-5 mr-2" /> Apagar Registro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SettingsView = () => {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in">
        <button onClick={() => setCurrentView('list')} className="bg-black text-white px-4 py-2 font-bold uppercase text-xs border-2 border-black hover:bg-gray-800 mb-6 flex items-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          &larr; Voltar
        </button>

        <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <div className="bg-teal-600 border-b-4 border-black p-6">
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center"><SettingsIcon className="mr-3 h-8 w-8" /> Configurações</h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="bg-amber-400 border-4 border-black text-black p-4 flex items-start shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <AlertTriangleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
              <p className="text-sm font-bold">A URL da planilha Google agora pode ser gerenciada pelas Variáveis de Ambiente ou inserida manualmente abaixo para testes.</p>
            </div>
            
            <div className="border-2 border-black p-6 bg-gray-50">
              <h3 className="text-xl font-black uppercase text-teal-700 border-b-4 border-black pb-2 mb-4 flex items-center"><UploadCloudIcon className="h-6 w-6 mr-2" /> Sincronização Google Sheets</h3>
              <div className="flex flex-col space-y-3">
                <input type="text" value={localSyncUrl} onChange={(e) => {
                    setLocalSyncUrl(e.target.value);
                    localStorage.setItem('tabulum_liderancas_sync', e.target.value);
                  }} placeholder="https://script.google.com/macros/s/..." 
                  className="w-full p-3 bg-white border-2 border-black rounded-none focus:outline-none focus:border-teal-600 font-medium" />
                <button onClick={syncWithCloud} disabled={loading || !localSyncUrl} className="bg-teal-600 text-white font-black uppercase px-6 py-3 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-teal-700 transition-transform active:translate-y-1 active:shadow-none whitespace-nowrap self-start">
                  {loading ? 'Sincronizando...' : 'Testar Sincronização'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] font-sans text-gray-900 selection:bg-amber-400 selection:text-black pb-12">
      <Navbar />
      <main>
        {currentView === 'list' && <ListView />}
        {currentView === 'dashboard' && <DashboardView />}
        {(currentView === 'detail' || currentView === 'edit') && <DetailView />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* MODAL DE LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black shadow-[16px_16px_0_0_rgba(0,0,0,1)] p-8 w-full max-w-sm m-4 relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 bg-white border-2 border-black p-1 hover:bg-rose-700 hover:text-white transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-black text-black uppercase mb-2 flex items-center tracking-tighter"><LogInIcon className="mr-3 h-8 w-8 text-teal-600" /> Acesso</h3>
            <div className="w-16 h-2 bg-amber-400 border-2 border-black mb-6"></div>
            <input type="password" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="Senha" className="w-full p-4 bg-gray-50 border-4 border-black rounded-none focus:outline-none focus:border-teal-600 font-medium mb-6" />
            <button onClick={handleLogin} className="w-full bg-teal-600 text-white font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-teal-700 hover:-translate-y-1 transition-transform active:translate-y-1 active:shadow-none">Entrar</button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black shadow-[16px_16px_0_0_rgba(0,0,0,1)] p-8 w-full max-w-md m-4 relative">
            <h3 className="text-2xl font-black text-black uppercase mb-4 tracking-tighter">{confirmModal.title}</h3>
            <p className="text-black font-medium mb-8 border-l-4 border-rose-700 pl-4">{confirmModal.message}</p>
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })} className="px-6 py-3 bg-white text-black font-black uppercase border-4 border-black hover:bg-gray-100 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform active:translate-y-1 active:shadow-none text-center">Cancelar</button>
              <button onClick={confirmModal.onConfirm} className="px-6 py-3 bg-rose-700 text-white font-black uppercase border-4 border-black hover:bg-rose-800 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform active:translate-y-1 active:shadow-none flex items-center justify-center"><CheckCircleIcon className="h-5 w-5 mr-2" /> Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```eof
