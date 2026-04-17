import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Check,
  Search, 
  ClipboardList, 
  AlertTriangle, 
  ShoppingCart, 
  CheckCircle2, 
  XCircle, 
  EyeOff,
  Hash,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Download,
  Filter,
  Package,
  Menu,
  X,
  Map as MapIcon,
  List,
  Folder,
  Info,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Square,
  Trash2,
  Lock,
  Unlock,
  Camera,
  CameraOff,
  Lightbulb,
  Maximize2,
  Copy,
  Plus,
  Save,
  Upload,
  FilePlus,
  Settings,
  RefreshCw,
  Wrench,
  Eye,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Sun,
  Contrast,
  Droplets,
  Palette,
  RotateCcw,
  RotateCw,
  Image as ImageIcon,
  Minus,
  MoreHorizontal,
  Target,
  Edit3,
  FileText,
  Type,
  Clipboard,
  Database,
  Zap,
  Scissors,
  CloudDownload,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { storageService } from './services/storage';
import { PARTS_DATA, Part } from './partsData';
import { MACHINE_DATABASE } from './machineData';
import { supabase } from './services/Supabase';
import { DEFAULT_CATEGORY_GROUPS, EX1200_7_GROUPS, EX2600_7_GROUPS } from './constants/categoryGroups';

// Safe localStorage helper to prevent QuotaExceededError crashes
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      console.warn('LocalStorage quota exceeded for key:', key);
    } else {
      console.error('Error saving to localStorage:', e);
    }
  }
};

type ListType = 'order' | 'damaged';
type ViewMode = 'visual' | 'list' | 'bom';
export type Criticality = 'A' | 'B' | 'C';

export interface HighlightElement {
  id: string;
  type: 'circle' | 'arrow' | 'box' | 'text' | 'callout' | 'crop';
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  rotation?: number;
  length?: number;
  thickness?: number;
  photo?: string;
  color?: string;
  text?: string;
  fontSize?: number;
  detailX?: number;
  detailY?: number;
  detailRadius?: number;
}

interface SelectedItem {
  part: Part;
  type: ListType;
  timestamp: number;
  photo?: string;
  diagramCrop?: string;
  highlights?: HighlightElement[];
  criticality?: Criticality;
  quantity?: number;
}

interface InspectionInfo {
  model: string;
  sn: string;
  tag: string;
  delivery: string;
  customer: string;
  description: string;
  machineDown: boolean;
  inspectorName: string;
  hourMeter: string;
  date: string;
  conclusion: string;
}

const TRANSLATIONS = {
  en: {
    inspection: 'INSPECTION',
    photos: 'PHOTOS',
    technicalReport: 'TECHNICAL REPORT',
    inspectionInfo: 'INSPECTION INFORMATION',
    machineInfo: 'MACHINE INFORMATION',
    model: 'MODEL:',
    sn: 'SN:',
    tag: 'TAG:',
    delivery: 'DELIVERY:',
    customer: 'CUSTOMER:',
    description: 'DESCRIPTION:',
    machineDown: 'MACHINE DOWN?:',
    reportData: 'REPORT DATA',
    inspectionDate: 'INSPECTION DATE:',
    inspectorName: 'INSPECTOR NAME:',
    hourMeter: 'HOUR METER:',
    partNumber: 'PART NUMBER',
    qty: 'QTY',
    noPhoto: 'NO INSPECTION PHOTO',
    noDiagram: 'NO LINKED DIAGRAM',
    catalogRef: 'PARTS CATALOG REFERENCE',
    partsTable: 'PARTS TABLE (PART NUMBER)',
    partName: 'PART NAME',
    quantity: 'QUANTITY',
    associatedPhoto: 'ASSOCIATED PHOTO',
    conclusion: 'CONCLUSION',
    end: 'END',
    safetyQuote1: '"IF IT\'S NOT SAFE, DON\'T DO IT!"',
    safetyQuote2: '"THERE IS NOTHING SO IMPORTANT AND URGENT THAT IT CAN\'T BE DONE SAFELY"',
    yes: 'YES',
    no: 'NO',
    orderList: 'ORDER LIST',
    damageReport: 'DAMAGE REPORT',
    date: 'DATE:',
    totalItems: 'TOTAL ITEMS:',
    category: 'CATEGORY',
    sheet: 'SHEET',
    platform: 'PLATFORM: LANDCROSS INSPECTION',
    photoEvidence: 'PHOTOGRAPHIC EVIDENCE',
    item: 'ITEM',
    desc: 'DESCRIPTION:',
    photoError: '[ERROR PROCESSING IMAGE FOR PDF]',
    generatePDF: 'GENERATE PDF REPORT',
    resetPosition: 'RESET POSITION',
    machineData: 'MACHINE DATA',
    selectMachine: 'SELECT MACHINE',
    selectMachinePlaceholder: 'SELECT A MACHINE...',
    inspectionDescription: 'INSPECTION DESCRIPTION',
    machineDownQuestion: 'MACHINE DOWN?',
    inspectorData: 'INSPECTOR DATA',
    reportConclusion: 'REPORT CONCLUSION',
    conclusionPlaceholder: 'WRITE THE TECHNICAL CONCLUSION OF THE INSPECTION HERE...',
    backToInspect: 'BACK TO INSPECTION',
    noItems: 'NO ITEMS REGISTERED IN THIS LIST.',
    selectItemOnDiagram: 'SELECT AN ITEM ON THE DIAGRAM',
    exportPDF: 'EXPORT PDF',
    orders: 'ORDERS',
    damages: 'DAMAGES',
    copy: 'COPY',
    gallery: 'GALLERY',
    addEvidence: 'ADD EVIDENCE',
    highlightArea: 'HIGHLIGHT AREA',
    clickToHighlight: 'CLICK OR DRAG ON THE PHOTO TO POSITION THE HIGHLIGHT',
    circle: 'CIRCLE',
    arrow: 'ARROW',
    box: 'BOX',
    text: 'TEXT',
    callout: 'CALLOUT (A,B,C)',
    crop: 'CROP CIRCLE',
    circleSize: 'CIRCLE SIZE',
    arrowLength: 'ARROW LENGTH',
    arrowThickness: 'THICKNESS',
    highlightColor: 'COLOR',
    cropFromMain: 'CROP FROM MAIN PHOTO',
    addDetailPhoto: 'ADD DETAIL PHOTO',
    upload: 'UPLOAD PHOTO',
    removePhoto: 'REMOVE PHOTO',
    removeHighlight: 'REMOVE HIGHLIGHT',
    confirm: 'CONFIRM',
    restrictedAccess: 'RESTRICTED ACCESS',
    enterPin: 'ENTER DEVELOPER PIN TO CONTINUE.',
    cancel: 'CANCEL',
    enter: 'ENTER',
    newInspection: 'NEW INSPECTION (SAVES CURRENT AND CLEARS)',
    manageProjects: 'MANAGE PROJECTS',
    viewMode: 'VIEW MODE',
    editMode: 'IMAGE EDIT MODE',
    hideDetails: 'HIDE DETAILS (LARGER IMAGE)',
    showDetails: 'SHOW DETAILS',
    lockSettings: 'LOCK SETTINGS',
    unlockDevMode: 'UNLOCK DEVELOPER MODE',
    localSaveWarning: 'DATA IS SAVED LOCALLY IN THIS BROWSER.',
    clearAll: 'CLEAR ALL',
    syncing: 'SYNCING...',
    synced: 'SYNCED',
    offline: 'OFFLINE',
    masterMode: 'MASTER MODE',
    addMachine: 'ADD MACHINE',
    deleteMachine: 'DELETE MACHINE',
    hideMachine: 'HIDE MACHINE',
    showMachine: 'SHOW MACHINE',
    confirmDeleteMachine: 'ARE YOU SURE YOU WANT TO DELETE THIS MACHINE?',
    machineAdded: 'MACHINE ADDED SUCCESSFULLY!',
    machineDeleted: 'MACHINE DELETED SUCCESSFULLY!',
    showHiddenMachines: 'SHOW HIDDEN',
    defaultDescription: 'TECHNICAL INSPECTION',
    defaultConclusion: 'The inspection carried out on the {model} excavator, SN:{sn} with {hourMeter} hours of operation, showed conditions that require scheduled corrective intervention and some priority actions, mainly related to hydraulic leaks, hose integrity and fastening items.',
    criticality: 'CRITICALITY',
    highCriticality: 'A (HIGH CRITICALITY)',
    mediumCriticality: 'B (MEDIUM CRITICALITY)',
    lowCriticality: 'C (LOW CRITICALITY)',
    highCriticalityLabel: 'HIGH CRITICALITY',
    mediumCriticalityLabel: 'MEDIUM CRITICALITY',
    lowCriticalityLabel: 'LOW CRITICALITY',
    dataManagement: 'DATA MANAGEMENT',
    optimizeData: 'OPTIMIZE STORAGE',
    optimizing: 'OPTIMIZING...',
    optimizationSuccess: 'STORAGE OPTIMIZED SUCCESSFULLY!',
    storageUsed: 'STORAGE USED:',
    clearUnusedDiagrams: 'OPTIMIZE STORAGE (CLEAN UNUSED)',
    pruneOldData: 'PRUNE OLD DATA',
    compressionQuality: 'COMPRESSION QUALITY',
    photo: 'PHOTO',
    errorPhoto: '[PHOTO ERROR]',
    errorCatalog: '[CATALOG ERROR]',
  },
  pt: {
    inspection: 'INSPEÇÃO',
    photos: 'FOTOS',
    technicalReport: 'RELATÓRIO TÉCNICO',
    inspectionInfo: 'INFORMAÇÕES DA INSPEÇÃO',
    machineInfo: 'INFORMAÇÕES DA MÁQUINA',
    model: 'MODELO:',
    sn: 'SÉRIE:',
    tag: 'TAG:',
    delivery: 'ENTREGA:',
    customer: 'CLIENTE:',
    description: 'DESCRIÇÃO:',
    machineDown: 'MÁQUINA PARADA?:',
    reportData: 'DADOS DO RELATÓRIO',
    inspectionDate: 'DATA DA INSPEÇÃO:',
    inspectorName: 'NOME DO INSPETOR:',
    hourMeter: 'HORÍMETRO:',
    partNumber: 'NÚMERO DA PEÇA',
    qty: 'QTD',
    noPhoto: 'SEM FOTO DE INSPEÇÃO',
    noDiagram: 'SEM DIAGRAMA VINCULADO',
    catalogRef: 'REFERÊNCIA DO CATÁLOGO DE PEÇAS',
    partsTable: 'TABELA DE PEÇAS (PART NUMBER)',
    partName: 'NOME DA PEÇA',
    quantity: 'QUANTIDADE',
    associatedPhoto: 'FOTO ASSOCIADA',
    conclusion: 'CONCLUSÃO',
    end: 'FIM',
    safetyQuote1: '"SE NÃO É SEGURO, NÃO FAÇA!"',
    safetyQuote2: '"NÃO HÁ NADA TÃO IMPORTANTE E URGENTE QUE NÃO POSSA SER FEITO COM SEGURANÇA"',
    yes: 'SIM',
    no: 'NÃO',
    orderList: 'LISTA DE PEDIDOS',
    damageReport: 'RELATÓRIO DE AVARIAS',
    date: 'DATA:',
    totalItems: 'TOTAL DE ITENS:',
    category: 'CATEGORIA',
    sheet: 'SHEET',
    platform: 'PLATAFORMA: INSPEÇÃO LANDCROSS',
    photoEvidence: 'EVIDÊNCIAS FOTOGRÁFICAS',
    item: 'ITEM',
    desc: 'DESCRIÇÃO:',
    photoError: '[ERRO AO PROCESSAR IMAGEM PARA O PDF]',
    generatePDF: 'GERAR RELATÓRIO PDF',
    resetPosition: 'RESETAR POSIÇÃO',
    machineData: 'DADOS DA MÁQUINA',
    selectMachine: 'SELECIONAR MÁQUINA',
    selectMachinePlaceholder: 'SELECIONE UMA MÁQUINA...',
    inspectionDescription: 'DESCRIÇÃO DA INSPEÇÃO',
    machineDownQuestion: 'MÁQUINA PARADA?',
    inspectorData: 'DADOS DO INSPETOR',
    reportConclusion: 'CONCLUSÃO DO RELATÓRIO',
    conclusionPlaceholder: 'ESCREVA AQUI A CONCLUSÃO TÉCNICA DA INSPEÇÃO...',
    backToInspect: 'VOLTAR PARA INSPEÇÃO',
    noItems: 'NENHUM ITEM REGISTRADO NESTA LISTA.',
    selectItemOnDiagram: 'SELECIONE UM ITEM NO DIAGRAMA',
    exportPDF: 'EXPORTAR PDF',
    orders: 'PEDIDOS',
    damages: 'AVARIAS',
    copy: 'CÓPIA',
    gallery: 'GALERIA',
    addEvidence: 'ADICIONAR EVIDÊNCIA',
    highlightArea: 'DESTACAR ÁREA',
    clickToHighlight: 'CLIQUE OU ARRASTE NA FOTO PARA POSICIONAR O DESTAQUE',
    circle: 'CÍRCULO',
    arrow: 'SETA',
    box: 'CAIXA',
    text: 'TEXTO',
    callout: 'CHAMADA (A,B,C)',
    crop: 'CÍRCULO DE CORTE',
    circleSize: 'TAMANHO DO CÍRCULO',
    arrowLength: 'COMPRIMENTO DA SETA',
    arrowThickness: 'ESPESSURA',
    highlightColor: 'COR',
    cropFromMain: 'RECORTAR DA FOTO PRINCIPAL',
    addDetailPhoto: 'ADICIONAR FOTO DE DETALHE',
    upload: 'CARREGAR FOTO',
    removePhoto: 'REMOVER FOTO',
    removeHighlight: 'REMOVER DESTAQUE',
    confirm: 'CONFIRMAR',
    restrictedAccess: 'ACESSO RESTRITO',
    enterPin: 'DIGITE A SENHA DE DESENVOLVEDOR PARA CONTINUAR.',
    cancel: 'CANCELAR',
    enter: 'ENTRAR',
    newInspection: 'NOVA INSPEÇÃO (SALVA ATUAL E LIMPA)',
    manageProjects: 'GERENCIAR PROJETOS',
    viewMode: 'MODO VISUALIZAÇÃO',
    editMode: 'MODO EDIÇÃO DE IMAGEM',
    hideDetails: 'OCULTAR DETALHES (IMAGEM MAIOR)',
    showDetails: 'MOSTRAR DETALHES',
    lockSettings: 'BLOQUEAR CONFIGURAÇÕES',
    unlockDevMode: 'LIBERAR MODO DESENVOLVEDOR',
    localSaveWarning: 'OS DADOS SÃO SALVOS LOCALMENTE NESTE NAVEGADOR.',
    clearAll: 'LIMPAR TUDO',
    syncing: 'SINCRONIZANDO...',
    synced: 'SINCRONIZADO',
    offline: 'OFFLINE',
    masterMode: 'MODO MASTER',
    addMachine: 'ADICIONAR MÁQUINA',
    deleteMachine: 'EXCLUIR MÁQUINA',
    hideMachine: 'OCULTAR MÁQUINA',
    showMachine: 'MOSTRAR MÁQUINA',
    confirmDeleteMachine: 'TEM CERTEZA QUE DESEJA EXCLUIR ESTA MÁQUINA?',
    machineAdded: 'MÁQUINA ADICIONADA COM SUCESSO!',
    machineDeleted: 'MÁQUINA EXCLUÍDA COM SUCESSO!',
    showHiddenMachines: 'MOSTRAR OCULTAS',
    defaultDescription: 'INSPEÇÃO TÉCNICA',
    defaultConclusion: 'A inspeção realizada na escavadeira {model}, SN:{sn} com {hourMeter} horas de operação, apresentou condições que necessitam de intervenção corretiva programada e algumas ações prioritárias, principalmente relacionadas a vazamentos hidráulicos, integridade de mangueiras e itens de fixação.',
    criticality: 'CRITICIDADE',
    highCriticality: 'A (ALTA CRITICIDADE)',
    mediumCriticality: 'B (MÉDIA CRITICIDADE)',
    lowCriticality: 'C (BAIXA CRITICIDADE)',
    highCriticalityLabel: 'CRITICIDADE ALTA',
    mediumCriticalityLabel: 'CRITICIDADE MÉDIA',
    lowCriticalityLabel: 'CRITICIDADE BAIXA',
    dataManagement: 'GERENCIAMENTO DE DADOS',
    optimizeData: 'OTIMIZAR ARMAZENAMENTO',
    optimizing: 'OTIMIZANDO...',
    optimizationSuccess: 'ARMAZENAMENTO OTIMIZADO COM SUCESSO!',
    storageUsed: 'ESPAÇO UTILIZADO:',
    clearUnusedDiagrams: 'OTIMIZAR ESPAÇO (LIMPAR NÃO USADOS)',
    pruneOldData: 'LIMPAR DADOS ANTIGOS',
    compressionQuality: 'QUALIDADE DE COMPRESSÃO',
    photo: 'FOTO',
    errorPhoto: '[ERRO NA FOTO]',
    errorCatalog: '[ERRO NO CATÁLOGO]',
  }
};

const BOMTable = ({ parts, onUpdate, onAdd, onPaste, onDelete, isAdmin, reportLanguage }: { 
  parts: Part[], 
  onUpdate: (id: string, updates: Partial<Part>) => void,
  onAdd: () => void,
  onPaste: () => void,
  onDelete: (id: string) => void,
  isAdmin: boolean,
  reportLanguage: 'en' | 'pt'
}) => {
  return (
    <div className="flex flex-col h-full bg-zinc-950/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Lista de Peças (BOM)</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Edição e Gerenciamento de Part Numbers</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button 
              onClick={onPaste}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <Clipboard size={14} className="text-landcros" />
              Colar BOM
            </button>
            <button 
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-landcros text-white rounded-xl hover:bg-landcros/90 transition-all text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-landcros/20"
            >
              <Plus size={14} />
              Novo Item
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <th className="px-4 py-2">Sheet</th>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Foto</th>
              <th className="px-4 py-2">Part Number</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2">{TRANSLATIONS[reportLanguage].qty}</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id} className="group bg-white/5 hover:bg-white/10 transition-all rounded-xl overflow-hidden">
                <td className="px-4 py-3 first:rounded-l-xl">
                  <input 
                    type="text" 
                    value={part.sheet}
                    onChange={(e) => onUpdate(part.id, { sheet: e.target.value })}
                    readOnly={!isAdmin}
                    className={`bg-transparent text-zinc-500 font-mono font-bold text-[10px] w-12 focus:outline-none ${isAdmin ? 'focus:text-landcros' : 'cursor-default'}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="text" 
                    value={part.itemNumber}
                    onChange={(e) => onUpdate(part.id, { itemNumber: e.target.value })}
                    readOnly={!isAdmin}
                    className={`bg-transparent text-white font-mono font-bold text-sm w-12 focus:outline-none ${isAdmin ? 'focus:text-landcros' : 'cursor-default'}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="relative group/photo w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                    {part.photo ? (
                      <img src={part.photo} alt={part.description} className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={14} className="text-zinc-600" />
                    )}
                    {isAdmin && (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Upload size={12} className="text-white" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                onUpdate(part.id, { photo: base64 });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="text" 
                    value={part.partNumber}
                    onChange={(e) => onUpdate(part.id, { partNumber: e.target.value })}
                    readOnly={!isAdmin}
                    className={`bg-transparent text-white font-bold text-sm w-full focus:outline-none ${isAdmin ? 'focus:text-landcros' : 'cursor-default'}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="text" 
                    value={part.description}
                    onChange={(e) => onUpdate(part.id, { description: e.target.value })}
                    readOnly={!isAdmin}
                    className={`bg-transparent text-zinc-400 text-xs w-full focus:outline-none ${isAdmin ? 'focus:text-white' : 'cursor-default'}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onUpdate(part.id, { quantity: Math.max(1, (part.quantity || 1) - 1) })}
                      disabled={!isAdmin}
                      className={`p-1 hover:bg-white/10 rounded transition-all ${!isAdmin ? 'opacity-20 cursor-default' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-[10px] font-black text-white w-4 text-center">{part.quantity || 1}</span>
                    <button 
                      onClick={() => onUpdate(part.id, { quantity: (part.quantity || 1) + 1 })}
                      disabled={!isAdmin}
                      className={`p-1 hover:bg-white/10 rounded transition-all ${!isAdmin ? 'opacity-20 cursor-default' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 last:rounded-r-xl text-right">
                  {isAdmin && (
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onDelete(part.id)}
                        className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                        title="Excluir Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {parts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
            <Package size={48} className="mb-4 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Nenhum item no BOM desta categoria</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Algo deu errado</h1>
          <p className="text-zinc-400 text-sm max-w-md mb-8">
            Ocorreu um erro inesperado na aplicação. Tente recarregar a página ou selecionar outro modelo de máquina.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Recarregar App
          </button>
          {this.state.error && (
            <pre className="mt-8 p-4 bg-zinc-900 rounded-lg text-left text-[10px] text-zinc-500 font-mono overflow-auto max-w-full">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const [inspectionInfo, setInspectionInfo] = useState<InspectionInfo>(() => {
    const saved = localStorage.getItem('inspectionInfo');
    return saved ? JSON.parse(saved) : {
      model: 'EX1200-7-BH',
      sn: '007433',
      tag: 'EH132',
      delivery: '2024',
      customer: 'U/M',
      description: 'Technical Inspection',
      machineDown: false,
      inspectorName: 'WARLEN SILVA',
      hourMeter: '76268,1',
      date: new Date().toISOString().split('T')[0],
      conclusion: ''
    };
  });

  const currentModel = inspectionInfo.model || 'EX1200-7-BH';
  const lastModelRef = useRef(currentModel);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [sheetSearchTerm, setSheetSearchTerm] = useState('');
  const [globalSheetSearchTerm, setGlobalSheetSearchTerm] = useState('');
  const [showNoSheetFound, setShowNoSheetFound] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [storageSize, setStorageSize] = useState(0);
  const [storageSizeHeavy, setStorageSizeHeavy] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const saved = localStorage.getItem(`selectedCategory_${currentModel}`);
    if (saved) return saved;
    const firstCat = PARTS_DATA.find(p => p.model === currentModel)?.category;
    if (firstCat) return firstCat;
    if (PARTS_DATA.length > 0) return PARTS_DATA[0].category;
    return 'GERAL';
  });
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(() => {
    const saved = localStorage.getItem(`selectedItems_${currentModel}`);
    if (saved) return JSON.parse(saved);
    // Fallback to global if scoped doesn't exist (migration)
    const global = localStorage.getItem('selectedItems');
    return global ? JSON.parse(global) : [];
  });

  const calculateStorageSize = async () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        total += (localStorage.getItem(key) || '').length;
      }
    }
    setStorageSize(total);
    
    try {
      const heavySize = await storageService.getEstimatedSize();
      setStorageSizeHeavy(heavySize);
    } catch (e) {
      console.error('Error calculating heavy storage size:', e);
    }
  };

  useEffect(() => {
    if (showDataModal) {
      calculateStorageSize();
    }
  }, [showDataModal]);

  const optimizeStorage = async () => {
    setIsOptimizing(true);
    try {
      // 1. Optimize Diagram Images
      const nextDiagrams = { ...diagramImages };
      for (const [key, base64] of Object.entries(nextDiagrams)) {
        if (typeof base64 === 'string' && base64.startsWith('data:image')) {
          // Re-compress with lower quality (0.5) and smaller max width (1000)
          nextDiagrams[key] = await compressImage(base64, 1000, 0.5);
        }
      }
      setDiagramImages(nextDiagrams);

      // 2. Optimize Selected Items Photos
      const nextSelectedItems = await Promise.all(selectedItems.map(async (item) => {
        let nextPhoto = item.photo;
        let nextHighlights = item.highlights;

        if (item.photo && item.photo.startsWith('data:image')) {
          nextPhoto = await compressImage(item.photo, 800, 0.4);
        }

        if (item.highlights) {
          nextHighlights = await Promise.all(item.highlights.map(async (h) => {
            if (h.photo && h.photo.startsWith('data:image')) {
              return { ...h, photo: await compressImage(h.photo, 400, 0.4) };
            }
            return h;
          }));
        }

        return { ...item, photo: nextPhoto, highlights: nextHighlights };
      }));
      setSelectedItems(nextSelectedItems);

      // 3. Run thorough cleanup (Deletion of unused)
      await runThoroughCleanup(true); // Silent mode

      alert(TRANSLATIONS[reportLanguage].optimizationSuccess);
      calculateStorageSize();
    } catch (error) {
      console.error("Optimization failed:", error);
      alert(reportLanguage === 'pt' ? "Erro ao otimizar dados." : "Error optimizing data.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const runThoroughCleanup = async (silent = false) => {
    try {
      console.log('Starting thorough cleanup...');
      const usedDiagramKeys = new Set<string>();
      const usedPhotoIds = new Set<string>();
      
      // 1. Identify all models that have any data stored
      const discoveredModels = new Set<string>();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('_')) {
          const parts = key.split('_');
          const model = parts[parts.length - 1];
          // Simple heuristic for model names (usually uppercase, has dashes/numbers)
          if (model && model.length > 3 && model === model.toUpperCase()) {
            discoveredModels.add(model);
          }
        }
      }

      const models = Array.from(new Set([
        ...machines.map(m => m.model),
        inspectionInfo.model,
        currentModel,
        ...Array.from(discoveredModels)
      ])).filter(Boolean);
      
      console.log('Models identified for asset retention:', models);

      // 2. For each model, find all used diagrams and photos
      for (const model of models) {
        // --- Diagrams ---
        const base = Array.from(new Set(PARTS_DATA.filter(p => p.model === model).map(p => p.category)));
        const savedCustom = localStorage.getItem(`customCategories_${model}`);
        const custom = savedCustom ? JSON.parse(savedCustom) : [];
        const savedDeleted = localStorage.getItem(`deletedCategories_${model}`);
        const deleted = savedDeleted ? JSON.parse(savedDeleted) : [];
        const allCats = [...base, ...custom].filter(c => !deleted.includes(c));
        
        allCats.forEach(cat => {
          usedDiagramKeys.add(`${model}:${cat}`);
          usedDiagramKeys.add(cat); // Legacy non-scoped
        });

        // --- Photos ---
        const savedItems = localStorage.getItem(`selectedItems_${model}`);
        if (savedItems) {
          try {
            const items: SelectedItem[] = JSON.parse(savedItems);
            items.forEach(item => {
              if (item && item.part) {
                const ts = item.timestamp;
                const pid = item.part.id;
                if (item.photo) usedPhotoIds.add(`photo_${ts}_${pid}`);
                if (item.diagramCrop) usedPhotoIds.add(`crop_${ts}_${pid}`);
                if (item.highlights) {
                  item.highlights.forEach(h => {
                    if (h.photo) usedPhotoIds.add(`highlight_${h.id}`);
                  });
                }
              }
            });
          } catch (e) {
            console.error(`Error parsing items for model ${model}:`, e);
          }
        }
      }

      // 3. Sync diagramImages state and IndexedDB
      const allIndexedDBImages = await storageService.getAllDiagramImages();
      const nextDiagrams: Record<string, string> = {};
      let removedDiagrams = 0;

      Object.entries(allIndexedDBImages).forEach(([key, val]) => {
        if (usedDiagramKeys.has(key)) {
          nextDiagrams[key] = val;
        } else {
          removedDiagrams++;
        }
      });
      
      console.log(`Cleanup: Keeping ${Object.keys(nextDiagrams).length} diagrams, removing ${removedDiagrams}.`);
      setDiagramImages(nextDiagrams);
      
      // Sync IndexedDB
      await storageService.syncDiagramImages(nextDiagrams);
      await storageService.syncItemPhotos(usedPhotoIds);
      
      // 4. Aggressive LocalStorage Cleanup
      const lsKeysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        
        // Remove ANY key containing heavy base64 data that should be in IndexedDB
        const val = localStorage.getItem(key) || '';
        if (val.length > 50000 && val.includes('data:image')) {
          if (key.includes('diagramImages') || key.includes('selectedItems')) {
            lsKeysToRemove.push(key);
          }
        }

        // Specifically target known legacy keys
        if (key === 'diagramImages' || key === 'itemPhotos' || key === 'allHeavyData') {
          lsKeysToRemove.push(key);
        }
      }
      
      // Strip photos from all selectedItems keys in localStorage to be safe
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key === 'selectedItems' || key.startsWith('selectedItems_'))) {
          try {
            const saved = localStorage.getItem(key);
            if (saved && saved.includes('data:image')) {
              const items = JSON.parse(saved);
              const stripped = items.map((item: any) => ({
                ...item,
                photo: undefined,
                diagramCrop: undefined,
                highlights: item.highlights?.map((h: any) => ({ ...h, photo: undefined }))
              }));
              localStorage.setItem(key, JSON.stringify(stripped));
            }
          } catch (e) {}
        }
      }

      if (lsKeysToRemove.length > 0) {
        console.log(`Removing ${lsKeysToRemove.length} heavy keys from localStorage.`);
        lsKeysToRemove.forEach(k => localStorage.removeItem(k));
      }

      if (!silent) {
        const msg = reportLanguage === 'pt' 
          ? `Limpeza concluída!\n- Diagramas removidos: ${removedDiagrams}\n- Chaves do LocalStorage limpas: ${lsKeysToRemove.length}\nO espaço utilizado deve diminuir agora.`
          : `Cleanup complete!\n- Diagrams removed: ${removedDiagrams}\n- LocalStorage keys cleared: ${lsKeysToRemove.length}\nStorage space should decrease now.`;
        alert(msg);
        calculateStorageSize();
      }
    } catch (error) {
      console.error('Error during thorough cleanup:', error);
      if (!silent) {
        alert(reportLanguage === 'pt' ? 'Erro crítico durante a limpeza. Verifique o console.' : 'Critical error during cleanup. Check console.');
      }
    }
  };

  const clearUnusedDiagrams = async () => {
    const isPt = reportLanguage === 'pt';
    if (!confirm(isPt ? 'Isso removerá diagramas e fotos de categorias/itens que não estão sendo usados em NENHUMA máquina. Continuar?' : 'This will remove diagrams and photos for categories/items not currently in use in ANY machine. Continue?')) return;
    await runThoroughCleanup(false);
  };

  const pruneOldData = () => {
    const isPt = reportLanguage === 'pt';
    if (!confirm(isPt ? 'Isso removerá dados de modelos que não estão na sua lista de máquinas. Continuar?' : 'This will remove data for models not in your machines list. Continue?')) return;
    
    const activeModels = new Set(machines.map(m => m.model));
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Scoped keys end with _${model}
      const parts = key.split('_');
      if (parts.length > 1) {
        const model = parts[parts.length - 1];
        // Check if this looks like a model-scoped key
        if (model && !activeModels.has(model)) {
          // We only want to prune if it's one of our known scoped keys
          const baseKey = parts.slice(0, -1).join('_');
          const knownScopedKeys = [
            'selectedItems', 'customCategories', 'selectedCategories', 
            'selectedGroups', 'categoryGroups', 'categoryRenames', 
            'selectedCategory', 'selectedGroup', 'deletedCategories', 
            'imgConfigs', 'customPositions', 'clonedParts', 
            'imgFilters', 'excludedParts', 'savedConfigs', 
            'individualHotspotSizes', 'leaderLines', 'imageMasks', 
            'partOverrides', 'diagramImages'
          ];
          
          if (knownScopedKeys.includes(baseKey)) {
            keysToRemove.push(key);
          }
        }
      }
    }
    
    keysToRemove.forEach(k => localStorage.removeItem(k));
    alert(isPt ? `${keysToRemove.length} chaves removidas do localStorage.` : `${keysToRemove.length} keys removed from localStorage.`);
    calculateStorageSize();
  };

  const [isPasteBomModalOpen, setIsPasteBomModalOpen] = useState(false);
  const [bomPasteText, setBomPasteText] = useState('');
  const [isPasteCategoriesModalOpen, setIsPasteCategoriesModalOpen] = useState(false);
  const [categoriesPasteText, setCategoriesPasteText] = useState('');
  const [isSheetListModalOpen, setIsSheetListModalOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(`customCategories_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('customCategories');
    return global ? JSON.parse(global) : [];
  });
  const [deletedCategories, setDeletedCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(`deletedCategories_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('deletedCategories');
    return global ? JSON.parse(global) : [];
  });

  const getInitialCategoryGroups = (model: string, customCats: string[] = []) => {
    const baseCategories = Array.from(new Set(PARTS_DATA.filter(p => p.model === model).map(p => p.category)));
    
    // Also include categories from clonedParts if they exist in localStorage
    // This prevents manually added categories from disappearing during a reset
    try {
      const savedCloned = localStorage.getItem('clonedParts');
      if (savedCloned) {
        const parsed = JSON.parse(savedCloned);
        Object.keys(parsed).forEach(key => {
          if (key.startsWith(`${model}:`)) {
            const cat = key.split(':')[1];
            if (cat && !baseCategories.includes(cat)) {
              baseCategories.push(cat);
            }
          }
        });
      }
    } catch (e) {}

    const initialGroups: Record<string, string[]> = {};
    
    // Choose source groups based on model
    const sourceGroups = model.startsWith('EX1200-7') 
      ? EX1200_7_GROUPS 
      : model.startsWith('EX2600-7') 
        ? EX2600_7_GROUPS 
        : DEFAULT_CATEGORY_GROUPS;
    
    // Initialize groups from sourceGroups
    Object.entries(sourceGroups).forEach(([groupName, cats]) => {
      const relevantCats = (cats as string[]).filter(c => baseCategories.includes(c));
      initialGroups[groupName] = relevantCats;
    });

    // Add custom categories to their own group or a default group
    if (customCats.length > 0) {
      const defaultGroup = model.startsWith('EX2600-7') ? "OPTIONAL PARTS" : "CUSTOM";
      initialGroups[defaultGroup] = [...(initialGroups[defaultGroup] || []), ...customCats];
    }

    // Add any base categories that weren't in sourceGroups to a "GERAL" group
    const assignedCats = new Set(Object.values(initialGroups).flat());
    const unassignedCats = baseCategories.filter(c => !assignedCats.has(c));
    
    if (unassignedCats.length > 0) {
      const defaultGroup = model.startsWith('EX2600-7') ? "OPTIONAL PARTS" : "GERAL";
      initialGroups[defaultGroup] = [...(initialGroups[defaultGroup] || []), ...unassignedCats];
    }

    return initialGroups;
  };

  const [categoryGroups, setCategoryGroups] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem(`categoryGroups_${currentModel}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Force reset if model-specific groups are mismatched
      if (currentModel.startsWith('EX1200-7')) {
        if (parsed['UPPERSTRUCTURE'] || parsed['ENGINE UNIT']) {
          return getInitialCategoryGroups(currentModel, customCategories);
        }
      } else if (currentModel.startsWith('EX2600-7')) {
        // Force reset if it's an old version of EX2600-7 groups (missing new UNDERCARRIAGE sheets)
        const isOutdatedUndercarriage = parsed['UNDERCARRIAGE'] && 
          parsed['UNDERCARRIAGE'].length < 5 && 
          !parsed['UNDERCARRIAGE'].includes('TRAVEL DEVICE');

        if (parsed['FRAME, COVER'] || parsed['HYDRAULIC SYSTEM'] || !parsed['BACK HOE FRONT ATTACHMENTS'] || isOutdatedUndercarriage) {
          console.log('Detected outdated EX2600-7 groups, resetting to defaults');
          return getInitialCategoryGroups(currentModel, customCategories);
        }
      }
      
      // Ensure all custom categories are in at least one group
      const assignedCats = new Set(Object.values(parsed).flat());
      const missingCustomCats = customCategories.filter(c => !assignedCats.has(c));
      if (missingCustomCats.length > 0) {
        const defaultGroup = currentModel.startsWith('EX2600-7') ? "OPTIONAL PARTS" : "CUSTOM";
        parsed[defaultGroup] = [...(parsed[defaultGroup] || []), ...missingCustomCats];
      }

      // Migration for EX2600-7: Rename "CUSTOM" to "OPTIONAL PARTS" if it exists
      if (currentModel.startsWith('EX2600-7') && parsed["CUSTOM"]) {
        parsed["OPTIONAL PARTS"] = [...(parsed["OPTIONAL PARTS"] || []), ...parsed["CUSTOM"]];
        delete parsed["CUSTOM"];
      }
      // Migration for EX2600-7: Rename "GERAL" to "OPTIONAL PARTS" if it exists
      if (currentModel.startsWith('EX2600-7') && parsed["GERAL"]) {
        parsed["OPTIONAL PARTS"] = [...(parsed["OPTIONAL PARTS"] || []), ...parsed["GERAL"]];
        delete parsed["GERAL"];
      }
      
      return parsed;
    }
    const global = localStorage.getItem('categoryGroups');
    if (global) {
      const parsed = JSON.parse(global);
      // Force reset if model-specific groups are mismatched
      if (currentModel.startsWith('EX1200-7')) {
        if (parsed['UPPERSTRUCTURE'] || parsed['ENGINE UNIT']) {
          return getInitialCategoryGroups(currentModel, customCategories);
        }
      } else if (currentModel.startsWith('EX2600-7')) {
        if (parsed['FRAME, COVER'] || parsed['HYDRAULIC SYSTEM'] || !parsed['BACK HOE FRONT ATTACHMENTS']) {
          return getInitialCategoryGroups(currentModel, customCategories);
        }
      }
      return parsed;
    }
    return getInitialCategoryGroups(currentModel, customCategories);
  });

  const sortedGroupNames = useMemo(() => {
    return Object.keys(categoryGroups).sort((a, b) => a.localeCompare(b));
  }, [categoryGroups]);
  const [selectedGroup, setSelectedGroup] = useState<string>(() => {
    const saved = localStorage.getItem(`selectedGroup_${currentModel}`);
    if (saved && categoryGroups[saved]) return saved;
    const global = localStorage.getItem('selectedGroup');
    if (global && categoryGroups[global]) return global;
    return sortedGroupNames[0] || 'FRAME, COVER';
  });

  useEffect(() => {
    if (lastModelRef.current === currentModel) {
      safeSetItem(`selectedGroup_${currentModel}`, selectedGroup);
    }
  }, [selectedGroup, currentModel]);

  const getScopedKey = (cat: string) => {
    const model = inspectionInfo?.model || 'EX1200-7-BH';
    const category = cat || 'GERAL';
    return `${model}:${category}`;
  };

  const [excludedParts, setExcludedParts] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem(`excludedParts_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('excludedParts');
    return global ? JSON.parse(global) : {};
  });

  // Data Migration: Move data from unscoped keys to scoped keys if scoped keys are empty
  useEffect(() => {
    const migrateData = () => {
      const model = inspectionInfo.model;
      if (!model) return;

      const migrateKey = (state: any, setState: Function, storageKey: string) => {
        let changed = false;
        const next = { ...state };
        
        // Find all keys that are NOT scoped (don't contain a colon)
        Object.keys(next).forEach(key => {
          if (!key.includes(':')) {
            const scopedKey = `${model}:${key}`;
            // If the scoped key is empty, move the data
            if (!next[scopedKey] || (Array.isArray(next[scopedKey]) && next[scopedKey].length === 0) || (typeof next[scopedKey] === 'object' && Object.keys(next[scopedKey]).length === 0)) {
              next[scopedKey] = next[key];
              changed = true;
              console.log(`Migrated ${storageKey} from ${key} to ${scopedKey}`);
            }
          }
        });

        if (changed) {
          setState(next);
          safeSetItem(storageKey, JSON.stringify(next));
        }
      };

      migrateKey(diagramImages, setDiagramImages, 'diagramImages');
      migrateKey(imgConfigs, setImgConfigs, 'imgConfigs');
      migrateKey(savedConfigs, setSavedConfigs, 'savedConfigs');
      migrateKey(customPositions, setCustomPositions, 'customPositions');
      migrateKey(imgFilters, setImgFilters, 'imgFilters');
      migrateKey(leaderLines, setLeaderLines, 'leaderLines');
      migrateKey(imageMasks, setImageMasks, 'imageMasks');
      migrateKey(clonedParts, setClonedParts, 'clonedParts');
    };

    migrateData();
  }, [inspectionInfo.model]);

  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);

  const moveCategoryToGroup = (category: string, targetGroup: string) => {
    if (!category || !targetGroup) return;
    
    setCategoryGroups(prev => {
      const next = { ...prev };
      let changed = false;
      
      // Remove from all groups first to avoid duplicates
      Object.keys(next).forEach(group => {
        const initialCount = next[group].length;
        next[group] = next[group].filter(c => c !== category);
        if (next[group].length !== initialCount) changed = true;
      });
      
      // Add to target group
      if (!next[targetGroup]) next[targetGroup] = [];
      if (!next[targetGroup].includes(category)) {
        next[targetGroup] = [...next[targetGroup], category];
        changed = true;
      }
      
      if (changed) {
        safeSetItem(`categoryGroups_${currentModel}`, JSON.stringify(next));
        broadcastUpdate({ categoryGroups: next });
      }
      
      return next;
    });
    
    // Switch to the target group and category
    setSelectedGroup(targetGroup);
    setSelectedCategory(category);
    addSyncLog(`Sheet "${category}" movida para o grupo "${targetGroup}".`);
  };

  const [reportLanguage, setReportLanguage] = useState<'pt' | 'en'>(() => {
    const saved = localStorage.getItem('reportLanguage');
    return (saved as 'pt' | 'en') || 'pt';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('visual');
  const [focusedPart, setFocusedPart] = useState<Part | null>(null);
  // Persistent State with LocalStorage
  const [diagramImages, setDiagramImages] = useState<Record<string, string | null>>({});

  const [clonedParts, setClonedParts] = useState<Record<string, Part[]>>(() => {
    const global = localStorage.getItem('clonedParts');
    try {
      if (global) {
        const parsed = JSON.parse(global);
        // If it's an array (old format), wrap it in a record
        if (Array.isArray(parsed)) {
          console.log('Migrating clonedParts from array to record format');
          return { [getScopedKey('GERAL')]: parsed };
        }
        return parsed;
      }
      
      // Fallback to scoped key for older versions
      const savedScoped = localStorage.getItem(`clonedParts_${currentModel}`);
      if (savedScoped) {
        const parsed = JSON.parse(savedScoped);
        if (Array.isArray(parsed)) {
          return { [getScopedKey('GERAL')]: parsed };
        }
        return parsed;
      }
      
      return {};
    } catch (e) {
      console.error('Error parsing clonedParts from localStorage:', e);
      return {};
    }
  });

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadAllHeavyData = async () => {
      try {
        console.log('Starting initial load from IndexedDB...');
        
        // 1. Load Diagram Images
        const images = await storageService.getAllDiagramImages();
        if (Object.keys(images).length > 0) {
          setDiagramImages(images);
          console.log('Loaded diagram images from IndexedDB:', Object.keys(images).length);
        } else {
          // Fallback to localStorage for migration
          const saved = localStorage.getItem('diagramImages');
          if (saved) {
            const parsed = JSON.parse(saved);
            setDiagramImages(parsed);
            // Migrate to IndexedDB
            for (const [key, val] of Object.entries(parsed)) {
              if (val) await storageService.saveDiagramImage(key, val as string);
            }
            // Clear from localStorage after migration to free up space
            localStorage.removeItem('diagramImages');
            console.log('Migrated diagram images from localStorage to IndexedDB');
          }
        }

        // 2. Load Cloned Parts
        const savedClonedParts = await storageService.getClonedParts();
        if (savedClonedParts && Object.keys(savedClonedParts).length > 0) {
          setClonedParts(prev => {
            // Merge IndexedDB data with current state (which might have localStorage data)
            // IndexedDB is the source of truth for photos, but we don't want to lose 
            // anything that might be in localStorage but not in IndexedDB for some reason.
            const next = { ...prev, ...savedClonedParts };
            console.log('Loaded and merged cloned parts from IndexedDB:', Object.keys(savedClonedParts).length, 'categories');
            return next;
          });
        } else {
          console.log('No cloned parts found in IndexedDB, keeping localStorage version');
        }

        // 3. Handle selectedItems photos migration/loading
        const scopedItemsKey = `selectedItems_${currentModel}`;
        const savedItems = localStorage.getItem(scopedItemsKey) || localStorage.getItem('selectedItems');
        if (savedItems) {
          const items: SelectedItem[] = JSON.parse(savedItems);
          const updatedItems = await Promise.all(items.map(async (item) => {
            const photoId = `photo_${item.timestamp}_${item.part.id}`;
            const cropId = `crop_${item.timestamp}_${item.part.id}`;
            
            let photo = item.photo;
            let diagramCrop = item.diagramCrop;

            // Check IndexedDB first
            const storedPhoto = await storageService.getItemPhoto(photoId);
            const storedCrop = await storageService.getItemPhoto(cropId);

            if (storedPhoto) photo = storedPhoto;
            else if (photo) await storageService.saveItemPhoto(photoId, photo);

            if (storedCrop) diagramCrop = storedCrop;
            else if (diagramCrop) await storageService.saveItemPhoto(cropId, diagramCrop);

            // Also load highlight photos
            let updatedHighlights = item.highlights;
            if (item.highlights) {
              updatedHighlights = await Promise.all(item.highlights.map(async (h) => {
                const storedHPhoto = await storageService.getItemPhoto(`highlight_${h.id}`);
                return { ...h, photo: storedHPhoto || h.photo };
              }));
            }

            return { ...item, photo, diagramCrop, highlights: updatedHighlights };
          }));
          setSelectedItems(updatedItems);
          console.log('Loaded selected items photos from IndexedDB');
        }

        setIsInitialLoadComplete(true);
        console.log('Initial load complete!');
      } catch (e) {
        console.error("Failed to load from IndexedDB", e);
        // Even if it fails, we should probably allow saving after some time 
        // or handle it gracefully. For now, let's just set it to true so the app works.
        setIsInitialLoadComplete(true);
      }
    };
    loadAllHeavyData();
  }, []);

  const [imgConfigs, setImgConfigs] = useState<Record<string, { scale: number, x: number, y: number, rotation?: number, isLocked?: boolean }>>(() => {
    const saved = localStorage.getItem(`imgConfigs_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('imgConfigs');
    return global ? JSON.parse(global) : {};
  });

  const [savedConfigs, setSavedConfigs] = useState<Record<string, { scale: number, x: number, y: number, rotation?: number, isLocked?: boolean }>>(() => {
    const saved = localStorage.getItem(`savedConfigs_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('savedConfigs');
    return global ? JSON.parse(global) : {};
  });

  const [customPositions, setCustomPositions] = useState<Record<string, Record<string, { top: string, left: string }>>>(() => {
    const saved = localStorage.getItem(`customPositions_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('customPositions');
    return global ? JSON.parse(global) : {};
  });

  const [imgFilters, setImgFilters] = useState<Record<string, { brightness: number, contrast: number, grayscale: number }>>(() => {
    const saved = localStorage.getItem(`imgFilters_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('imgFilters');
    return global ? JSON.parse(global) : {};
  });

  const [partOverrides, setPartOverrides] = useState<Record<string, Partial<Part>>>(() => {
    const saved = localStorage.getItem(`partOverrides_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('partOverrides');
    return global ? JSON.parse(global) : {};
  });

  const [dragKey, setDragKey] = useState(0);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBlueprintMode, setIsBlueprintMode] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [hotspotSize, setHotspotSize] = useState(() => {
    const saved = localStorage.getItem('hotspotSize');
    return saved ? parseInt(saved) : 36; // Default w-9 h-9 is 36px
  });
  const [individualHotspotSizes, setIndividualHotspotSizes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(`individualHotspotSizes_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('individualHotspotSizes');
    return global ? JSON.parse(global) : {};
  });
  const [leaderLines, setLeaderLines] = useState<Record<string, Record<string, { top: string, left: string, isSolid?: boolean, color?: string }>>>(() => {
    const saved = localStorage.getItem(`leaderLines_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('leaderLines');
    return global ? JSON.parse(global) : {};
  });
  const [imageMasks, setImageMasks] = useState<Record<string, { id: string, x: number, y: number, w: number, h: number, color?: string }[]>>(() => {
    const saved = localStorage.getItem(`imageMasks_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('imageMasks');
    return global ? JSON.parse(global) : {};
  });
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [eraserSize, setEraserSize] = useState(20);
  const [eraserColor, setEraserColor] = useState('#ffffff');
  const [isErasing, setIsErasing] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [splashScreenImage, setSplashScreenImage] = useState(() => {
    const saved = localStorage.getItem('splashScreenImage');
    return saved || 'https://images.unsplash.com/photo-1535916707207-35f97e715e1c?q=80&w=2070&auto=format&fit=crop';
  });
  const [showSplashSettings, setShowSplashSettings] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [categoryToRename, setCategoryToRename] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState('');
  const [tempCategoryName, setTempCategoryName] = useState('');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(`selectedCategories_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('selectedCategories');
    return global ? JSON.parse(global) : [];
  });
  const [selectedGroups, setSelectedGroups] = useState<string[]>(() => {
    const saved = localStorage.getItem(`selectedGroups_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('selectedGroups');
    return global ? JSON.parse(global) : [];
  });
  const [categoryRenames, setCategoryRenames] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`categoryRenames_${currentModel}`);
    if (saved) return JSON.parse(saved);
    const global = localStorage.getItem('categoryRenames');
    return global ? JSON.parse(global) : {};
  });
  const [newSheetName, setNewSheetName] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [syncStatus, setSyncStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'unconfigured'>('connecting');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isRemoteUpdate = useRef(false);



  const parseBomText = (text: string) => {
    const lines = text.split('\n');
    const newParts: Part[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Tenta dividir por tabulação primeiro (comum ao copiar do Excel/Tabelas)
      let parts = trimmedLine.split('\t');
      
      // Se não houver tabs, tenta dividir por múltiplos espaços
      if (parts.length < 3) {
        parts = trimmedLine.split(/\s{2,}/);
      }
      
      // Se ainda assim for pouco, tenta por espaço simples
      if (parts.length < 3) {
        parts = trimmedLine.split(/\s+/);
      }

      // Pular cabeçalhos comuns
      const lineLower = trimmedLine.toLowerCase();
      if (lineLower.includes('key parts') || lineLower.includes('code') || lineLower.includes('part no') || lineLower.includes('part name')) continue;

      let itemNumber = '';
      let partNumber = '';
      let description = '';

      // Lógica baseada na imagem do usuário: KeyParts, Code, PartNo, PartName
      if (parts.length >= 4) {
        // Se a primeira coluna for vazia ou muito curta (Key Parts), pegamos as próximas
        if (parts[0].length <= 2 && isNaN(Number(parts[0]))) {
          itemNumber = parts[1];
          partNumber = parts[2];
          description = parts[3];
        } else {
          itemNumber = parts[0];
          partNumber = parts[1];
          description = parts[2];
        }
      } else if (parts.length >= 3) {
        itemNumber = parts[0];
        partNumber = parts[1];
        description = parts[2];
      } else if (parts.length === 2) {
        partNumber = parts[0];
        description = parts[1];
        itemNumber = (newParts.length + 1).toString();
      }

      if (partNumber && partNumber.length > 2) {
        newParts.push({
          id: `clone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${newParts.length}`,
          itemNumber: itemNumber.trim() || (newParts.length + 1).toString(),
          partNumber: partNumber.trim(),
          description: description.trim() || 'Sem descrição',
          sheet: selectedCategory,
          category: selectedCategory,
          model: inspectionInfo.model
        });
      }
    }
    return newParts;
  };

  const handlePasteBom = () => {
    const newParts = parseBomText(bomPasteText);
    if (newParts.length === 0) {
      alert("Nenhuma peça válida encontrada. Certifique-se de copiar as colunas de Código, Part Number e Nome.");
      return;
    }
    
    console.log(`Pasting ${newParts.length} parts into category: ${selectedCategory}`);
    const scopedKey = getScopedKey(selectedCategory);
    setClonedParts(prev => {
      const next = { ...prev, [scopedKey]: [...(prev[scopedKey] || []), ...newParts] };
      console.log('Updated clonedParts state locally. Total parts in category:', next[scopedKey].length);
      
      // Immediately broadcast the update to ensure it's saved to Supabase
      setTimeout(() => {
        broadcastUpdate({
          clonedParts: next,
          inspectionInfo,
          selectedItems,
          diagramImages,
          individualHotspotSizes,
          leaderLines,
          imageMasks,
          partOverrides
        });
      }, 100);
      
      return next;
    });
    
    setIsPasteBomModalOpen(false);
    setBomPasteText('');
    addSyncLog(`${newParts.length} peças importadas para a categoria ${selectedCategory}.`);
    
    // Force a save check by updating a state that's in the save dependency array
    console.log('Forcing sync to cloud...');
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-translate description and conclusion if they are defaults
  useEffect(() => {
    const prevLang = reportLanguage === 'pt' ? 'en' : 'pt';
    const currentT = TRANSLATIONS[reportLanguage];
    const prevT = TRANSLATIONS[prevLang];

    setInspectionInfo(prev => {
      let newDescription = prev.description;
      let newConclusion = prev.conclusion;

      // If description is the default of the previous language, update it
      if (prev.description === prevT.defaultDescription) {
        newDescription = currentT.defaultDescription;
      }

      // If conclusion is empty or matches the previous default (with placeholders replaced)
      // This is a bit tricky because of placeholders, but we can try a simple check
      const prevDefaultConclusion = prevT.defaultConclusion
        .replace('{model}', prev.model)
        .replace('{sn}', prev.sn)
        .replace('{hourMeter}', prev.hourMeter);
      
      if (prev.conclusion === prevDefaultConclusion || prev.conclusion === '') {
        // We don't auto-fill conclusion if it was empty, unless the user wants it?
        // Actually, let's only update if it matched the previous default.
        if (prev.conclusion === prevDefaultConclusion) {
          newConclusion = currentT.defaultConclusion
            .replace('{model}', prev.model)
            .replace('{sn}', prev.sn)
            .replace('{hourMeter}', prev.hourMeter);
        }
      }

      if (newDescription !== prev.description || newConclusion !== prev.conclusion) {
        return { ...prev, description: newDescription, conclusion: newConclusion };
      }
      return prev;
    });
  }, [reportLanguage]);

  const addSyncLog = (msg: string) => {
    setSyncLog(prev => [msg, ...prev].slice(0, 50));
    console.log(`[SYNC] ${msg}`);
  };

  const [activeTab, setActiveTab] = useState<'inspect' | 'order' | 'damaged' | 'projects' | 'report'>('report');
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [projectName, setProjectName] = useState(() => localStorage.getItem('projectName') || 'Nova Inspeção');
  const [adminPin, setAdminPin] = useState(() => {
    const saved = localStorage.getItem('adminPin');
    if (saved === '1234') {
      safeSetItem('adminPin', '13072015');
      return '13072015';
    }
    return saved || '13072015';
  });

  const [editingHighlightItem, setEditingHighlightItem] = useState<string | null>(null);
  const [activeHighlightTool, setActiveHighlightTool] = useState<'circle' | 'arrow' | 'box' | 'text' | 'callout' | 'crop'>('circle');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDraggingHighlight, setIsDraggingHighlight] = useState(false);
  const [highlightDragKey, setHighlightDragKey] = useState(0);
  const [highlightZoom, setHighlightZoom] = useState(1);
  const [highlightPan, setHighlightPan] = useState({ x: 0, y: 0 });
  const [machines, setMachines] = useState<any[]>(() => {
    const saved = localStorage.getItem('machines');
    const savedMachines = saved ? JSON.parse(saved) : [];
    
    // Merge MACHINE_DATABASE with saved machines to ensure new models are always available
    const merged = [...MACHINE_DATABASE];
    savedMachines.forEach((sm: any) => {
      if (!merged.find(m => m.tag === sm.tag)) {
        merged.push(sm);
      }
    });

    // Filter to only include EX1200-7 and EX2600-7 models as requested
    return merged.filter(m => 
      m.model.toUpperCase().includes('EX1200-7') || 
      m.model.toUpperCase().includes('EX2600-7')
    );
  });

  const updateMachine = () => {
    if (!inspectionInfo.tag) return;
    
    const newMachines = machines.map(m => 
      m.tag === inspectionInfo.tag 
        ? { 
            ...m, 
            model: inspectionInfo.model, 
            sn: inspectionInfo.sn, 
            delivery: inspectionInfo.delivery,
            customer: inspectionInfo.customer 
          }
        : m
    );
    
    setMachines(newMachines);
    safeSetItem('machines', JSON.stringify(newMachines));
    if (supabase) broadcastUpdate({ machines: newMachines });
    alert(reportLanguage === 'pt' ? 'Dados da máquina atualizados com sucesso!' : 'Machine data updated successfully!');
  };

  const [imageAspectRatio, setImageAspectRatio] = useState<number>(16/9);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Update container size on resize
  useEffect(() => {
    if (!diagramContainerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(diagramContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const processRemoteRow = (key: string, value: string) => {
    try {
      const val = JSON.parse(value);
      if (key.startsWith('diagramImage_')) {
        const cat = key.replace('diagramImage_', '');
        setDiagramImages(prev => {
          const next = { ...prev, [cat]: val };
          return next;
        });
      } else {
        // Handle scoped keys (e.g., selectedItems_EX1200-7-BH)
        let baseKey = key;
        let modelSuffix = '';
        
        if (key.includes('_')) {
          const parts = key.split('_');
          // Check if the last part looks like a model ID
          const lastPart = parts[parts.length - 1];
          if (lastPart.startsWith('EX') || lastPart.includes('-')) {
            modelSuffix = lastPart;
            baseKey = parts.slice(0, -1).join('_');
          }
        }

        const setters: Record<string, (v: any) => void> = {
          imgConfigs: setImgConfigs,
          savedConfigs: setSavedConfigs,
          customPositions: setCustomPositions,
          imgFilters: setImgFilters,
          hotspotSize: setHotspotSize,
          individualHotspotSizes: setIndividualHotspotSizes,
          customCategories: setCustomCategories,
          projectName: setProjectName,
          inspectionInfo: setInspectionInfo,
          selectedItems: setSelectedItems,
          clonedParts: setClonedParts,
          categoryRenames: setCategoryRenames,
          leaderLines: setLeaderLines,
          imageMasks: setImageMasks,
          selectedCategories: setSelectedCategories,
          selectedGroups: setSelectedGroups,
          categoryGroups: setCategoryGroups,
          excludedParts: setExcludedParts,
          deletedCategories: setDeletedCategories
        };

        if (setters[baseKey]) {
          // Only update state if it's a global key OR if it matches the current model
          if (!modelSuffix || modelSuffix === currentModel) {
            setters[baseKey](val);
          }
          // Always save to localStorage with the full key
          safeSetItem(key, typeof val === 'string' ? val : JSON.stringify(val));
        }
      }
    } catch (e) {
      console.error(`Error processing remote key ${key}:`, e);
    }
  };

  // Sync state with Supabase
  useEffect(() => {
    if (!supabase) {
      setSyncStatus('unconfigured');
      return;
    }

    setSyncStatus('connecting');

    // 1. Fetch initial state
    const fetchInitialState = async () => {
      const { data, error } = await supabase
        .from('app_state')
        .select('*');
      
      if (error) {
        console.error("Supabase fetch error:", error);
        setSyncError(error.message);
        setSyncStatus('disconnected');
        return;
      }

      setSyncError(null);

      if (data && data.length > 0) {
        isRemoteUpdate.current = true;
        data.forEach(row => processRemoteRow(row.key, row.value));
        setTimeout(() => { isRemoteUpdate.current = false; }, 2000);
      }
      setSyncStatus('connected');
    };

    fetchInitialState();

    // 2. Subscribe to real-time updates (Broadcast + DB Changes)
    const channel = supabase.channel('app_changes')
      .on('broadcast', { event: 'UPDATE_STATE' }, ({ payload }) => {
        isRemoteUpdate.current = true;
        Object.entries(payload).forEach(([key, val]) => {
          const setters: Record<string, (v: any) => void> = {
            imgConfigs: setImgConfigs,
            savedConfigs: setSavedConfigs,
            customPositions: setCustomPositions,
            imgFilters: setImgFilters,
            hotspotSize: setHotspotSize,
            individualHotspotSizes: setIndividualHotspotSizes,
            customCategories: setCustomCategories,
            projectName: setProjectName,
            inspectionInfo: setInspectionInfo,
            selectedItems: setSelectedItems,
            clonedParts: setClonedParts,
            categoryRenames: setCategoryRenames,
            leaderLines: setLeaderLines,
            imageMasks: setImageMasks,
            selectedCategories: setSelectedCategories,
            selectedGroups: setSelectedGroups,
            categoryGroups: setCategoryGroups,
            excludedParts: setExcludedParts
          };
          if (setters[key]) {
            setters[key](val);
            safeSetItem(key, typeof val === 'string' ? val : JSON.stringify(val));
          }
        });
        setTimeout(() => { isRemoteUpdate.current = false; }, 2000);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_state' }, (payload) => {
        if (isRemoteUpdate.current) return;
        const row = payload.new as { key: string, value: string };
        if (row && row.key) {
          isRemoteUpdate.current = true;
          processRemoteRow(row.key, row.value);
          setTimeout(() => { isRemoteUpdate.current = false; }, 2000);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setSyncStatus('connected');
        if (status === 'CLOSED') setSyncStatus('disconnected');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stripHeavyData = (data: any): any => {
    if (!data) return data;
    if (Array.isArray(data)) {
      return data.map(item => stripHeavyData(item));
    }
    if (typeof data === 'object') {
      const next: any = {};
      for (const [key, val] of Object.entries(data)) {
        if (key === 'photo' || key === 'diagramCrop' || key === 'base64') {
          next[key] = undefined;
        } else {
          next[key] = stripHeavyData(val);
        }
      }
      return next;
    }
    return data;
  };

  const broadcastUpdate = async (updates: Record<string, any>) => {
    if (isRemoteUpdate.current || !supabase) return;

    // Strip heavy data (photos) before broadcasting/saving to cloud
    // Heavy data is stored in IndexedDB and should not be synced to the cloud DB
    // to avoid payload size limits and performance issues.
    const finalUpdates = stripHeavyData({ ...updates });
    delete finalUpdates.diagramImages;
    const imageUpdates: Record<string, any> = {};
    
    if (updates.diagramImages) {
      Object.entries(updates.diagramImages).forEach(([cat, img]) => {
        if (img) imageUpdates[`diagramImage_${cat}`] = img;
      });
    }

    const allUpdates = { ...finalUpdates, ...imageUpdates };
    const entries = Object.entries(allUpdates);
    
    setIsSyncing(true);
    setSyncProgress({ current: 0, total: entries.length });

    // Broadcast real-time (small payload only)
    const broadcastPayload = { ...finalUpdates };
    await supabase.channel('app_changes').send({
      type: 'broadcast',
      event: 'UPDATE_STATE',
      payload: broadcastPayload
    });

    // Persist to DB sequentially to avoid payload size errors
    let count = 0;
    for (const [key, value] of entries) {
      try {
        const { error } = await supabase.from('app_state').upsert({
          key,
          value: JSON.stringify(value)
        });
        
        if (error) {
          addSyncLog(`ERRO ao salvar ${key}: ${error.message}`);
        } else {
          addSyncLog(`Sucesso ao salvar ${key}`);
        }
        
        count++;
        setSyncProgress({ current: count, total: entries.length });
      } catch (e) {
        addSyncLog(`FALHA CRÍTICA ao salvar ${key}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const recoverFromCloud = async () => {
    if (!supabase) return;
    if (!confirm(reportLanguage === 'pt' ? 'Deseja tentar recuperar todos os dados da nuvem? Isso substituirá seus dados locais atuais.' : 'Do you want to try recovering all data from the cloud? This will overwrite your current local data.')) return;
    
    setIsSyncing(true);
    try {
      const { data, error } = await supabase
        .from('app_state')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        isRemoteUpdate.current = true;
        data.forEach(row => processRemoteRow(row.key, row.value));
        setTimeout(() => { isRemoteUpdate.current = false; }, 2000);
        alert(reportLanguage === 'pt' ? 'Dados recuperados com sucesso!' : 'Data recovered successfully!');
      } else {
        alert(reportLanguage === 'pt' ? 'Nenhum dado encontrado na nuvem.' : 'No data found in the cloud.');
      }
    } catch (e) {
      console.error("Recovery error:", e);
      alert('Erro ao recuperar: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setIsSyncing(false);
    }
  };

  const clearCloudData = async () => {
    if (!supabase || !confirm('Isso apagará todas as fotos e posições da NUVEM. Os dados locais serão mantidos até você recarregar. Continuar?')) return;
    const { error } = await supabase.from('app_state').delete().neq('key', 'keep_alive');
    if (error) alert('Erro ao limpar: ' + error.message);
    else alert('Dados da nuvem limpos com sucesso!');
  };

  const handleDeleteCategory = (cat: string) => {
    if (customCategories.includes(cat)) {
      setCustomCategories(prev => prev.filter(c => c !== cat));
    } else {
      setDeletedCategories(prev => [...prev, cat]);
    }
    
    // Clean up associated data
    const scopedKey = getScopedKey(cat);
    setDiagramImages(prev => {
      const next = { ...prev };
      delete next[scopedKey];
      delete next[cat];
      return next;
    });
    
    // Delete from IndexedDB
    storageService.deleteDiagramImage(scopedKey);
    storageService.deleteDiagramImage(cat);

    setClonedParts(prev => {
      const next = { ...prev };
      delete next[scopedKey];
      delete next[cat];
      return next;
    });

    // Switch to first available category
    const model = inspectionInfo.model;
    const baseCats = Array.from(new Set(PARTS_DATA.filter(p => p.model === model).map(p => p.category)));
    const remainingCats = [...baseCats, ...customCategories].filter(c => c !== cat && !deletedCategories.includes(c));
    if (remainingCats.length > 0) {
      setSelectedCategory(remainingCats[0]);
    }
    
    setShowDeleteCategoryModal(false);
    setCategoryToDelete('');
    addSyncLog(`Categoria ${cat} excluída.`);
  };

  // Detect image aspect ratio
  useEffect(() => {
    const currentImg = diagramImages[getScopedKey(selectedCategory)];
    if (currentImg) {
      const img = new Image();
      img.onload = () => {
        setImageAspectRatio(img.width / img.height);
      };
      img.src = currentImg;
    } else {
      setImageAspectRatio(16/9);
    }
  }, [diagramImages, selectedCategory, inspectionInfo.model]);

  useEffect(() => {
    if (!isAdmin) {
      setIsAdjusting(false);
      setIsEditMode(false);
      // Load saved configs into current configs when exiting admin mode
      setImgConfigs(prev => {
        const next = { ...prev };
        Object.keys(savedConfigs).forEach(cat => {
          next[cat] = savedConfigs[cat];
        });
        return next;
      });
    }
  }, [isAdmin, savedConfigs]);

  // Model switching logic: Reload data when currentModel changes
  useEffect(() => {
    if (lastModelRef.current !== currentModel && isInitialLoadComplete) {
      console.log('Model switched from', lastModelRef.current, 'to', currentModel, '- Reloading data');
      
      const loadScoped = (key: string, defaultValue: any, setter: Function) => {
        const scopedKey = `${key}_${currentModel}`;
        const saved = localStorage.getItem(scopedKey);
        if (saved) {
          let parsed = JSON.parse(saved);
          // Force reset if model-specific groups are mismatched
          if (key === 'categoryGroups') {
            if (currentModel.startsWith('EX1200-7')) {
              if (parsed['UPPERSTRUCTURE'] || parsed['ENGINE UNIT']) {
                parsed = getInitialCategoryGroups(currentModel);
                localStorage.setItem(scopedKey, JSON.stringify(parsed));
              }
            } else if (currentModel.startsWith('EX2600-7')) {
              if (parsed['FRAME, COVER'] || parsed['HYDRAULIC SYSTEM'] || !parsed['BACK HOE FRONT ATTACHMENTS']) {
                parsed = getInitialCategoryGroups(currentModel);
                localStorage.setItem(scopedKey, JSON.stringify(parsed));
              }
            }
          }
          setter(parsed);
        } else {
          // Fallback to global if scoped doesn't exist (migration)
          const global = localStorage.getItem(key);
          let parsed = defaultValue;
          
          if (global) {
            try {
              const globalParsed = JSON.parse(global);
              // Only use global fallback if it's not model-specific data that might be mismatched
              if (key !== 'categoryGroups' && key !== 'selectedItems') {
                parsed = globalParsed;
              }
            } catch (e) {
              console.error(`Error parsing global ${key}:`, e);
            }
          }
          setter(parsed);
        }
      };

      loadScoped('selectedItems', [], setSelectedItems);
      loadScoped('categoryGroups', getInitialCategoryGroups(currentModel, customCategories), setCategoryGroups);
      loadScoped('customCategories', [], setCustomCategories);
      loadScoped('deletedCategories', [], setDeletedCategories);
      loadScoped('selectedCategories', [], setSelectedCategories);
      loadScoped('selectedGroups', [], setSelectedGroups);
      loadScoped('categoryRenames', {}, setCategoryRenames);
      loadScoped('partOverrides', {}, setPartOverrides);
      loadScoped('excludedParts', {}, setExcludedParts);
      // clonedParts is only in IndexedDB
      loadScoped('imgConfigs', {}, setImgConfigs);
      loadScoped('savedConfigs', {}, setSavedConfigs);
      loadScoped('customPositions', {}, setCustomPositions);
      loadScoped('imgFilters', {}, setImgFilters);
      loadScoped('leaderLines', {}, setLeaderLines);
      loadScoped('imageMasks', {}, setImageMasks);
      // diagramImages is only in IndexedDB
      loadScoped('individualHotspotSizes', {}, setIndividualHotspotSizes);
      
      // Reload heavy data from IndexedDB for the new model
      const reloadHeavyData = async () => {
        try {
          const images = await storageService.getAllDiagramImages();
          setDiagramImages(images);

          const cloned = await storageService.getClonedParts();
          if (cloned && Object.keys(cloned).length > 0) {
            setClonedParts(prev => ({ ...prev, ...cloned }));
          }

          // Load photos for the new model's selectedItems
          const savedItems = localStorage.getItem(`selectedItems_${currentModel}`);
          if (savedItems) {
            const items: SelectedItem[] = JSON.parse(savedItems);
            const updatedItems = await Promise.all(items.map(async (item) => {
              const photoId = `photo_${item.timestamp}_${item.part.id}`;
              const cropId = `crop_${item.timestamp}_${item.part.id}`;
              const photo = await storageService.getItemPhoto(photoId);
              const crop = await storageService.getItemPhoto(cropId);
              
              const updatedHighlights = item.highlights ? await Promise.all(item.highlights.map(async (h) => {
                const hPhoto = await storageService.getItemPhoto(`highlight_${h.id}`);
                return { ...h, photo: hPhoto || undefined };
              })) : [];

              return { 
                ...item, 
                photo: photo || undefined, 
                diagramCrop: crop || undefined,
                highlights: updatedHighlights
              };
            }));
            setSelectedItems(updatedItems);
          }
        } catch (e) {
          console.error('Error reloading heavy data on model switch:', e);
        }
      };
      reloadHeavyData();
      
      const savedCat = localStorage.getItem(`selectedCategory_${currentModel}`);
      if (savedCat) {
        setSelectedCategory(savedCat);
      } else {
        const firstCat = PARTS_DATA.find(p => p.model === currentModel)?.category;
        setSelectedCategory(firstCat || 'GERAL');
      }

      const savedGroup = localStorage.getItem(`selectedGroup_${currentModel}`);
      const currentGroups = getInitialCategoryGroups(currentModel);
      if (savedGroup && currentGroups[savedGroup]) {
        setSelectedGroup(savedGroup);
      } else {
        const firstGroup = Object.keys(currentGroups)[0];
        setSelectedGroup(firstGroup || (currentModel.startsWith('EX1200-7') ? 'FRAME, COVER' : 'UPPERSTRUCTURE'));
      }

      lastModelRef.current = currentModel;
    }
  }, [currentModel, isInitialLoadComplete]);

  useEffect(() => {
    const save = async () => {
      if (!isInitialLoadComplete) {
        console.log('Skipping save: initial load not complete');
        return;
      }
      
      // Prevent saving old model's data to new model's key during switch
      if (lastModelRef.current !== currentModel) {
        console.log('Skipping save: model switch in progress', { last: lastModelRef.current, current: currentModel });
        return;
      }

      // Additional safety: don't save if clonedParts is empty but we know we have data in IndexedDB
      // This handles the case where state hasn't loaded yet
      if (Object.keys(clonedParts).length === 0) {
        const dbCloned = await storageService.getClonedParts();
        if (dbCloned && Object.keys(dbCloned).length > 0) {
          console.log('Skipping save: clonedParts state is empty but DB has data');
          return;
        }
      }

      try {
        console.log('Starting save process...', { 
          clonedPartsCount: Object.keys(clonedParts).length,
          selectedItemsCount: selectedItems.length 
        });
        setSaveStatus('saving');

        // Save heavy data to IndexedDB
        for (const [key, val] of Object.entries(diagramImages)) {
          if (val) await storageService.saveDiagramImage(key, val as string);
        }
        
        // Sync IndexedDB to remove deleted images from storage
        const validImages: Record<string, string> = {};
        Object.entries(diagramImages).forEach(([k, v]) => {
          if (v) validImages[k] = v;
        });
        await storageService.syncDiagramImages(validImages);

        // Save clonedParts to IndexedDB
        await storageService.saveClonedParts(clonedParts);

        // Save to localStorage as a quick fallback
        const strippedClonedParts: Record<string, Part[]> = {};
        Object.keys(clonedParts).forEach(key => {
          strippedClonedParts[key] = clonedParts[key].map(p => ({
            ...p,
            photo: undefined // Strip photo for localStorage
          }));
        });
        safeSetItem('clonedParts', JSON.stringify(strippedClonedParts));
        
        // Clean up old scoped keys to prevent confusion
        localStorage.removeItem(`clonedParts_${currentModel}`);

        // Save selectedItems photos to IndexedDB
        await Promise.all(selectedItems.map(async (item) => {
          const photoId = `photo_${item.timestamp}_${item.part.id}`;
          const cropId = `crop_${item.timestamp}_${item.part.id}`;
          if (item.photo) await storageService.saveItemPhoto(photoId, item.photo);
          if (item.diagramCrop) await storageService.saveItemPhoto(cropId, item.diagramCrop);
          if (item.highlights) {
            await Promise.all(item.highlights.map(async (h) => {
              if (h.photo) await storageService.saveItemPhoto(`highlight_${h.id}`, h.photo);
            }));
          }
        }));

        // Prepare data for localStorage (stripping heavy base64)
        const strippedItems = selectedItems.map(item => ({
          ...item,
          photo: undefined,
          diagramCrop: undefined,
          highlights: item.highlights?.map(h => ({ ...h, photo: undefined }))
        }));

        const scopedData: Record<string, any> = {
          selectedItems: strippedItems,
          customCategories,
          selectedCategories,
          selectedGroups,
          categoryGroups,
          categoryRenames,
          selectedCategory,
          selectedGroup,
          deletedCategories,
          imgConfigs,
          customPositions,
          // clonedParts is only in IndexedDB
          imgFilters,
          excludedParts,
          savedConfigs,
          individualHotspotSizes,
          leaderLines,
          imageMasks,
          partOverrides,
          // diagramImages is only in IndexedDB
        };

        const globalData: Record<string, any> = {
          inspectionInfo,
          projectName,
          adminPin,
          hotspotSize,
          machines
        };

        // Save scoped data
        Object.entries(scopedData).forEach(([key, value]) => {
          safeSetItem(`${key}_${currentModel}`, JSON.stringify(value));
        });

        // Save global data
        Object.entries(globalData).forEach(([key, value]) => {
          try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            safeSetItem(key, stringValue);
          } catch (e) {
            console.error(`Error stringifying/saving ${key}:`, e);
          }
        });

        // Broadcast changes
        if (supabase && !isRemoteUpdate.current) {
          console.log('Broadcasting update to Supabase...');
          
          // Prepare data for cloud sync with scoped keys
          const cloudData: Record<string, any> = {
            ...globalData,
            diagramImages,
            clonedParts
          };
          
          // Add scoped keys to cloudData
          Object.entries(scopedData).forEach(([key, value]) => {
            cloudData[`${key}_${currentModel}`] = value;
          });

          await broadcastUpdate(cloudData);
        }

        console.log('Save complete!');
        setTimeout(() => setSaveStatus('saved'), 500);
      } catch (e) {
        console.error('Storage error', e);
        setSaveStatus('error');
      }
    };

    const timeout = setTimeout(save, 1000);
    return () => clearTimeout(timeout);
  }, [
    diagramImages, 
    imgConfigs, 
    customPositions, 
    selectedItems, 
    clonedParts, 
    imgFilters, 
    inspectionInfo, 
    projectName, 
    adminPin, 
    isAdmin, 
    savedConfigs,
    hotspotSize, 
    individualHotspotSizes,
    customCategories,
    selectedCategories,
    selectedGroups,
    categoryGroups,
    categoryRenames,
    selectedCategory,
    selectedGroup,
    deletedCategories,
    partOverrides,
    excludedParts,
    leaderLines,
    imageMasks,
    machines,
    currentModel,
    isInitialLoadComplete
  ]);

  const exportProject = () => {
    try {
      const data = {
        projectName,
        diagramImages,
        imgConfigs,
        imgFilters,
        customPositions,
        selectedItems,
        clonedParts,
        customCategories,
        inspectionInfo,
        version: '1.2'
      };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.landcros`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert(reportLanguage === 'pt' ? 'Erro ao exportar projeto. O arquivo pode ser muito grande.' : 'Error exporting project. The file might be too large.');
    }
  };

  const importProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.diagramImages) {
          setDiagramImages(data.diagramImages);
          for (const [key, val] of Object.entries(data.diagramImages)) {
            if (val) await storageService.saveDiagramImage(key, val as string);
          }
        }
        if (data.imgConfigs) setImgConfigs(data.imgConfigs);
        if (data.customPositions) setCustomPositions(data.customPositions);
        if (data.selectedItems) {
          setSelectedItems(data.selectedItems);
          for (const item of data.selectedItems as SelectedItem[]) {
            const photoId = `photo_${item.timestamp}_${item.part.id}`;
            const cropId = `crop_${item.timestamp}_${item.part.id}`;
            if (item.photo) await storageService.saveItemPhoto(photoId, item.photo);
            if (item.diagramCrop) await storageService.saveItemPhoto(cropId, item.diagramCrop);
            if (item.highlights) {
              for (const h of item.highlights) {
                if (h.photo) await storageService.saveItemPhoto(`highlight_${h.id}`, h.photo);
              }
            }
          }
        }
        if (data.clonedParts) setClonedParts(data.clonedParts);
        if (data.imgFilters) setImgFilters(data.imgFilters);
        if (data.customCategories) setCustomCategories(data.customCategories);
        if (data.inspectionInfo) setInspectionInfo(data.inspectionInfo);
        if (data.projectName) setProjectName(data.projectName);
        alert('Projeto importado com sucesso!');
      } catch (err) {
        alert('Erro ao importar projeto. Arquivo inválido.');
      }
    };
    reader.readAsText(file);
  };

  const startNewProject = async () => {
    // Auto-export before clearing
    exportProject();
    
    // Clear ONLY item photos from IndexedDB
    await storageService.clearItemPhotos();

    // Clear ONLY inspection-specific data
    setSelectedItems([]);
    setFocusedPart(null);
    setSearchTerm('');
    
    setInspectionInfo(prev => ({
      ...prev,
      sn: '',
      tag: '',
      delivery: '',
      customer: '',
      description: TRANSLATIONS[reportLanguage].defaultDescription,
      machineDown: false,
      hourMeter: '',
      date: new Date().toISOString().split('T')[0],
      conclusion: ''
    }));
    
    // Reset project name with new date/time
    const now = new Date();
    setProjectName('Inspeção ' + now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    // Reset view to inspection mode
    setActiveTab('inspect');
    setIsEditMode(false);
    setShowNewProjectModal(false);
    
    alert('Nova inspeção iniciada. O backup da anterior foi salvo na sua pasta de downloads.');
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setIsEditMode(false);
      setIsAdjusting(false);
      if (activeTab === 'projects') setActiveTab('inspect');
      return;
    }
    setPinInput('');
    setShowPinModal(true);
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedPin = pinInput.trim();
    const currentPin = adminPin.trim();

    if (trimmedPin === currentPin || trimmedPin === '13072015' || trimmedPin === 'RESET_PIN_MASTER') {
      if (trimmedPin === 'RESET_PIN_MASTER' || (trimmedPin === '13072015' && currentPin !== '13072015')) {
        setAdminPin('13072015');
        safeSetItem('adminPin', '13072015');
        if (trimmedPin === 'RESET_PIN_MASTER') alert('Senha resetada para o padrão: 13072015');
      }
      setIsAdmin(true);
      setShowPinModal(false);
      alert('Modo Desenvolvedor Ativado!');
    } else {
      alert('Senha Incorreta. Acesso negado.');
      setPinInput('');
    }
  };

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isStartingCamera = React.useRef(false);

  const startCamera = async () => {
    if (isStartingCamera.current) return;
    isStartingCamera.current = true;
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Seu navegador não suporta acesso à câmera.");
      setIsCameraOpen(false);
      isStartingCamera.current = false;
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode }, 
        audio: false 
      });
      setCameraStream(stream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (isCameraOpen) {
        alert("Não foi possível acessar a câmera. Verifique as permissões.");
        setIsCameraOpen(false);
      }
    } finally {
      isStartingCamera.current = false;
    }
  };

  const toggleCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    if (isCameraOpen && !cameraStream) {
      startCamera();
    }
  }, [facingMode, isCameraOpen, cameraStream]);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isCameraOpen, cameraStream]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        if (focusedPart) {
          setSelectedItems(prev => {
            const exists = prev.find(i => i.part.id === focusedPart.id);
            if (exists) {
              return prev.map(item => 
                item.part.id === focusedPart.id ? { ...item, photo: dataUrl } : item
              );
            }
            // If not in selected items, we should probably add it as 'damaged' or 'order' by default?
            // Actually, the UI only shows photo upload if it's already selected.
            return prev;
          });
        }
        stopCamera();
      }
    }
  };

  const handleMachineChange = (tag: string) => {
    const machine = machines.find(m => m.tag === tag);
    if (machine) {
      setInspectionInfo(prev => ({
        ...prev,
        tag: machine.tag || '',
        model: machine.model || '',
        sn: machine.sn || '',
        delivery: machine.delivery || '',
        customer: machine.customer || prev.customer || ''
      }));
    } else {
      setInspectionInfo(prev => ({ ...prev, tag: tag || '' }));
    }
  };

  const addMachine = () => {
    const newTag = prompt(reportLanguage === 'pt' ? 'Digite a TAG da nova máquina:' : 'Enter the TAG for the new machine:');
    if (!newTag) return;
    
    if (machines.some(m => m.tag === newTag)) {
      alert(reportLanguage === 'pt' ? 'Esta TAG já existe!' : 'This TAG already exists!');
      return;
    }

    const newModel = prompt(reportLanguage === 'pt' ? 'Digite o MODELO da máquina:' : 'Enter the machine MODEL:', inspectionInfo.model) || '';
    const newSN = prompt(reportLanguage === 'pt' ? 'Digite o NÚMERO DE SÉRIE (SN):' : 'Enter the SERIAL NUMBER (SN):', inspectionInfo.sn) || '';
    const newDelivery = prompt(reportLanguage === 'pt' ? 'Digite o ANO DE ENTREGA:' : 'Enter the DELIVERY YEAR:', inspectionInfo.delivery) || '';
    const newCustomer = prompt(reportLanguage === 'pt' ? 'Digite o NOME DO CLIENTE:' : 'Enter the CUSTOMER NAME:', inspectionInfo.customer) || '';

    const newMachine = {
      tag: newTag,
      model: newModel,
      sn: newSN,
      delivery: newDelivery,
      customer: newCustomer
    };

    const newMachines = [...machines, newMachine];
    setMachines(newMachines);
    safeSetItem('machines', JSON.stringify(newMachines));
    
    // Auto-select the new machine
    handleMachineChange(newTag);
    
    if (supabase) broadcastUpdate({ machines: newMachines });
    alert(TRANSLATIONS[reportLanguage].machineAdded);
    
    // Automatically switch to inspection tab to start working
    setActiveTab('inspect');
  };

  const deleteMachine = (tag: string) => {
    if (!confirm(TRANSLATIONS[reportLanguage].confirmDeleteMachine)) return;
    
    const newMachines = machines.filter(m => m.tag !== tag);
    setMachines(newMachines);
    safeSetItem('machines', JSON.stringify(newMachines));
    if (supabase) broadcastUpdate({ machines: newMachines });
    alert(TRANSLATIONS[reportLanguage].machineDeleted);
  };

  const handleResetZoom = () => {
    const saved = savedConfigs[getScopedKey(selectedCategory)] || { scale: 1, x: 0, y: 0, rotation: 0 };
    setImgConfigs(prev => ({ ...prev, [getScopedKey(selectedCategory)]: saved }));
  };

  const handleRotateCw = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setImgConfigs(prev => {
      const current = prev[getScopedKey(selectedCategory)] || { scale: 1, x: 0, y: 0, rotation: 0 };
      return {
        ...prev,
        [getScopedKey(selectedCategory)]: { ...current, rotation: (current.rotation || 0) + 90 }
      };
    });
  };

  const handleRotateCcw = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setImgConfigs(prev => {
      const current = prev[getScopedKey(selectedCategory)] || { scale: 1, x: 0, y: 0, rotation: 0 };
      return {
        ...prev,
        [getScopedKey(selectedCategory)]: { ...current, rotation: (current.rotation || 0) - 90 }
      };
    });
  };

  const saveCurrentAsMaster = () => {
    const current = imgConfigs[getScopedKey(selectedCategory)] || { scale: 1, x: 0, y: 0, rotation: 0 };
    setSavedConfigs(prev => ({ ...prev, [getScopedKey(selectedCategory)]: current }));
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 500);
    alert('Configuração Mestre salva para esta categoria!');
  };

  const currentImg = diagramImages[getScopedKey(selectedCategory)] || null;
  const currentConfig = imgConfigs[getScopedKey(selectedCategory)] || savedConfigs[getScopedKey(selectedCategory)] || { scale: 1, x: 0, y: 0, rotation: 0 };
  const currentFilters = imgFilters[getScopedKey(selectedCategory)] || { brightness: 100, contrast: 100, grayscale: 0 };
  const currentCustomPos = customPositions[getScopedKey(selectedCategory)] || {};
  const currentLeaderLines = leaderLines[getScopedKey(selectedCategory)] || {};
  const currentClones = clonedParts[getScopedKey(selectedCategory)] || [];
  const currentMasks = imageMasks[getScopedKey(selectedCategory)] || [];

  const allCategories = useMemo(() => {
    const base = Array.from(new Set(PARTS_DATA.filter(p => p.model === inspectionInfo.model).map(p => p.category)));
    
    // Create a map of category to its first sheet number for sorting
    const categoryToSheet: Record<string, string> = {};
    PARTS_DATA.filter(p => p.model === inspectionInfo.model).forEach(p => {
      if (!categoryToSheet[p.category] || p.sheet < categoryToSheet[p.category]) {
        categoryToSheet[p.category] = p.sheet;
      }
    });

    // Include all categories from categoryGroups
    const groupCategories = Object.values(categoryGroups).flat() as string[];
    
    // Case-insensitive deduplication for customCategories and groupCategories against base
    const lowerBase = base.map(c => c.toLowerCase());
    const combinedCustom = [...customCategories, ...groupCategories];
    const uniqueCustom = combinedCustom.filter(c => c && !lowerBase.includes(c.toLowerCase()));
    
    // Final deduplication
    const finalCustom: string[] = [];
    const seen = new Set<string>();
    for (const c of uniqueCustom) {
      if (c && !seen.has(c.toLowerCase())) {
        finalCustom.push(c);
        seen.add(c.toLowerCase());
      }
    }

    const result = [...base, ...finalCustom].filter(c => !deletedCategories.includes(c)).sort((a, b) => {
      const sheetA = categoryToSheet[a];
      const sheetB = categoryToSheet[b];

      // If both have sheets, sort numerically/alphabetically by sheet string
      if (sheetA && sheetB) {
        return sheetA.localeCompare(sheetB, undefined, { numeric: true, sensitivity: 'base' });
      }
      // Categories with sheets come before those without
      if (sheetA) return -1;
      if (sheetB) return 1;
      // Both don't have sheets, sort alphabetically by name
      return a.localeCompare(b);
    });
    
    return result.length > 0 ? result : ['GERAL'];
  }, [customCategories, inspectionInfo.model, categoryGroups, deletedCategories]);

  const visibleCategories = useMemo(() => {
    const lowerSelected = selectedCategories.map(s => s?.toLowerCase() || '');
    
    // In developer mode (isAdmin), show all categories.
    // In user mode, show only selected categories AND only if their group is selected.
    // If no groups are selected, show all categories by default (release access).
    if (isAdmin || selectedGroups.length === 0) return allCategories;

    return allCategories.filter(cat => {
      if (!cat) return false;
      const isCatSelected = lowerSelected.includes(cat.toLowerCase());
      
      // Find which group this category belongs to
      const group = Object.entries(categoryGroups).find(([_, cats]) => 
        (cats as string[]).map(c => c?.toLowerCase() || '').includes(cat.toLowerCase())
      )?.[0];
      
      const isGroupSelected = group ? selectedGroups.includes(group) : false;
      
      return isCatSelected && isGroupSelected;
    });
  }, [allCategories, selectedCategories, selectedGroups, isAdmin, categoryGroups]);

  const categories = useMemo(() => {
    const filtered = visibleCategories;
    
    // Filter by selectedGroup
    if (selectedGroup && categoryGroups[selectedGroup]) {
      const groupCats = categoryGroups[selectedGroup].map(c => c?.toLowerCase() || '');
      return filtered.filter(cat => cat && groupCats.includes(cat.toLowerCase()));
    }
    
    return filtered;
  }, [visibleCategories, selectedGroup, categoryGroups]);

  useEffect(() => {
    if (!selectedCategory) return;
    const groupCats = categoryGroups[selectedGroup]?.map(c => c.toLowerCase()) || [];
    const exists = groupCats.includes(selectedCategory.toLowerCase());
    if (!exists && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [selectedGroup, categories, categoryGroups]);

  useEffect(() => {
    if (!selectedCategory) return;
    const exists = categories.some(c => c && c.toLowerCase() === selectedCategory.toLowerCase());
    if (!exists && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [inspectionInfo.model, categories, selectedCategory]);

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const handleResetCategory = () => {
    const scopedKey = getScopedKey(selectedCategory);
    const rawKey = selectedCategory;
    
    // 1. Clear custom positions for this category
    const nextCustomPositions = { ...customPositions };
    delete nextCustomPositions[scopedKey];
    
    const nextClonedParts = { ...clonedParts };
    nextClonedParts[scopedKey] = [];
    if (nextClonedParts[rawKey]) delete nextClonedParts[rawKey];
    
    const nextLeaderLines = { ...leaderLines };
    nextLeaderLines[scopedKey] = {};
    if (nextLeaderLines[rawKey]) delete nextLeaderLines[rawKey];

    const nextImageMasks = { ...imageMasks };
    nextImageMasks[scopedKey] = [];
    if (nextImageMasks[rawKey]) delete nextImageMasks[rawKey];

    // 5. Exclude ALL base parts of this category (this is what "clears" the image)
    const model = inspectionInfo.model;
    const basePartsInCategory = PARTS_DATA.filter(p => p.category === selectedCategory && p.model === model);
    const nextExcludedParts = { 
      ...excludedParts, 
      [scopedKey]: basePartsInCategory.map(p => p.id) 
    };
    setExcludedParts(nextExcludedParts);

    // Clear selected items for this category (selectedItems is an ARRAY)
    const partsInCategoryIds = new Set(basePartsInCategory.map(p => p.id));
    const clones = clonedParts[scopedKey] || [];
    const cloneIds = new Set<string>(clones.map(p => p.id));
    
    const nextSelectedItems = selectedItems.filter(item => 
      !partsInCategoryIds.has(item.part.id) && !cloneIds.has(item.part.id)
    );

    // Clear individual hotspot sizes (individualHotspotSizes is a RECORD)
    const nextIndividualSizes = { ...individualHotspotSizes };
    partsInCategoryIds.forEach((id: string) => delete nextIndividualSizes[id]);
    cloneIds.forEach((id: string) => delete nextIndividualSizes[id]);

    // Update local states
    setCustomPositions(nextCustomPositions);
    setClonedParts(nextClonedParts);
    setLeaderLines(nextLeaderLines);
    setImageMasks(nextImageMasks);
    setSelectedItems(nextSelectedItems);
    setIndividualHotspotSizes(nextIndividualSizes);
    setExcludedParts(nextExcludedParts);
    
    // Broadcast all changes
    broadcastUpdate({
      customPositions: nextCustomPositions,
      clonedParts: nextClonedParts,
      leaderLines: nextLeaderLines,
      imageMasks: nextImageMasks,
      selectedItems: nextSelectedItems,
      individualHotspotSizes: nextIndividualSizes,
      excludedParts: nextExcludedParts
    });
    
    setIsConfirmingReset(false);
  };

  const innerContainerRef = React.useRef<HTMLDivElement>(null);

  const handleDragEnd = (partId: string, info: any) => {
    if (!innerContainerRef.current) return;
    
    // Get the bounding box of the transformed container
    const rect = innerContainerRef.current.getBoundingClientRect();
    
    // Calculate position relative to the CURRENT visible size of the container
    // We use info.point which is the absolute viewport coordinate
    let left = ((info.point.x - rect.left) / rect.width) * 100;
    let top = ((info.point.y - rect.top) / rect.height) * 100;

    // Clamp values to prevent disappearing (1% margin)
    left = Math.max(1, Math.min(99, left));
    top = Math.max(1, Math.min(99, top));

    // Update state and key in a single batch to avoid jumping
    const scopedKey = getScopedKey(selectedCategory);
    const nextCustomPositions = {
      ...customPositions,
      [scopedKey]: {
        ...(customPositions[scopedKey] || {}),
        [partId]: { top: `${top.toFixed(6)}%`, left: `${left.toFixed(6)}%` }
      }
    };
    setCustomPositions(nextCustomPositions);
    broadcastUpdate({ customPositions: nextCustomPositions });

    // Increment dragKey to reset the motion.div transform
    setDragKey(prev => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedPart || !isAdmin || isEditMode || !isAdjusting) return;
      
      const step = e.shiftKey ? 0.01 : 0.1; // 0.01% for very fine, 0.1% for normal
      let dx = 0;
      let dy = 0;

      if (e.key === 'ArrowLeft') dx = -step;
      else if (e.key === 'ArrowRight') dx = step;
      else if (e.key === 'ArrowUp') dy = -step;
      else if (e.key === 'ArrowDown') dy = step;

      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        setCustomPositions(prev => {
          const scopedKey = getScopedKey(selectedCategory);
          const currentPos = (prev[scopedKey] || {})[focusedPart.id] || getHotspotPos(focusedPart);
          
          const currentLeft = parseFloat(currentPos.left);
          const currentTop = parseFloat(currentPos.top);

          return {
            ...prev,
            [scopedKey]: {
              ...(prev[scopedKey] || {}),
              [focusedPart.id]: {
                top: `${(currentTop + dy).toFixed(6)}%`,
                left: `${(currentLeft + dx).toFixed(6)}%`
              }
            }
          };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedPart, isAdmin, isEditMode, isAdjusting, selectedCategory]);

  const handleHighlightDragEnd = (partId: string, elementId: string, info: any, containerRef: React.RefObject<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate position as percentage of container dimensions (0-100)
    // This ensures the center of the element stays exactly where the user drops it
    let x = ((info.point.x - rect.left) / rect.width) * 100;
    let y = ((info.point.y - rect.top) / rect.height) * 100;

    // Constrain to 0-100 to stay within container
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setSelectedItems(prev => prev.map(item => 
      item.part.id === partId 
        ? { 
            ...item, 
            highlights: item.highlights?.map(h => 
              h.id === elementId ? { ...h, x, y } : h
            ) 
          } 
        : item
    ));

    setHighlightDragKey(prev => prev + 1);
  };

  const handleTargetDragEnd = (partId: string, info: any) => {
    if (!innerContainerRef.current) return;
    const rect = innerContainerRef.current.getBoundingClientRect();
    let left = ((info.point.x - rect.left) / rect.width) * 100;
    let top = ((info.point.y - rect.top) / rect.height) * 100;
    left = Math.max(1, Math.min(99, left));
    top = Math.max(1, Math.min(99, top));

    const scopedKey = getScopedKey(selectedCategory);
    setLeaderLines(prev => ({
      ...prev,
      [scopedKey]: {
        ...(prev[scopedKey] || {}),
        [partId]: { 
          ...(prev[scopedKey]?.[partId] || {}),
          top: `${top.toFixed(6)}%`, 
          left: `${left.toFixed(6)}%`,
          color: prev[scopedKey]?.[partId]?.color || "#F27D26"
        }
      }
    }));
    setDragKey(prev => prev + 1);
  };

  const addMaskAtPoint = (clientX: number, clientY: number) => {
    if (!isEraserMode || !innerContainerRef.current) return;
    const rect = innerContainerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    const newMask = {
      id: `mask-${Date.now()}-${Math.random()}`,
      x,
      y,
      w: (eraserSize / rect.width) * 100,
      h: (eraserSize / rect.height) * 100,
      color: eraserColor
    };

    const scopedKey = getScopedKey(selectedCategory);
    setImageMasks(prev => ({
      ...prev,
      [scopedKey]: [...(prev[scopedKey] || []), newMask]
    }));
  };

  const handleEraserMouseDown = (e: React.MouseEvent) => {
    if (!isEraserMode) return;
    setIsErasing(true);
    addMaskAtPoint(e.clientX, e.clientY);
  };

  const handleEraserMouseMove = (e: React.MouseEvent) => {
    if (!isEraserMode || !isErasing) return;
    addMaskAtPoint(e.clientX, e.clientY);
  };

  const handleEraserMouseUp = () => {
    setIsErasing(false);
  };

  const compressImage = (base64: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }
        // Using 0.4 quality to ensure the base64 string is small enough for DB limits
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const img = new Image();
        img.onload = async () => {
          setImageAspectRatio(img.width / img.height);
          const compressed = await compressImage(result);
          
          // Delete old image from IndexedDB if it exists to free up space immediately
          const scopedKey = getScopedKey(selectedCategory);
          await storageService.deleteDiagramImage(scopedKey);
          
          setDiagramImages(prev => ({ ...prev, [scopedKey]: compressed }));
          setImgConfigs(prev => ({ ...prev, [scopedKey]: { scale: 1, x: 0, y: 0 } }));
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = (val: string, forceGroup?: string) => {
    console.log('handleAddCategory called with:', { val, forceGroup });
    const trimmedVal = val.trim();
    if (!trimmedVal) {
      console.log('handleAddCategory: Empty value, returning.');
      return;
    }

    // Reset filters to show the new category
    setFocusedPart(null);
    setSearchTerm('');
    setItemSearchTerm('');

    const lowerVal = trimmedVal.toLowerCase();
    console.log('handleAddCategory: Lowercase value:', lowerVal);
    
    // Determine which group to use: 
    // 1. Use forceGroup if provided (from the specific group input)
    // 2. Use existing group if it's already active
    // 3. Fallback to master list check
    // 4. Final fallback to selectedGroup or "GERAL"
    
    let targetGroup = forceGroup;
    
    // Check if it's already in our ACTIVE groups
    let existingGroup = '';
    for (const [groupName, cats] of Object.entries(categoryGroups)) {
      if ((cats as string[]).some(c => c.toLowerCase() === lowerVal)) {
        existingGroup = groupName;
        break;
      }
    }

    if (existingGroup) {
      targetGroup = existingGroup;
    }

    // If no group found yet, try to find in master list
    if (!targetGroup) {
      const sourceGroups = currentModel.startsWith('EX1200-7') 
        ? EX1200_7_GROUPS 
        : currentModel.startsWith('EX2600-7')
          ? EX2600_7_GROUPS
          : DEFAULT_CATEGORY_GROUPS;
      for (const [groupName, cats] of Object.entries(sourceGroups)) {
        if ((cats as string[]).some(c => c.toLowerCase() === lowerVal)) {
          targetGroup = groupName;
          break;
        }
      }
    }

    // Final fallback
    if (!targetGroup) targetGroup = selectedGroup || "GERAL";
    console.log('handleAddCategory: Target group determined:', targetGroup);

    // Remove from deletedCategories if it was there
    setDeletedCategories(prev => prev.filter(c => c.toLowerCase() !== lowerVal));

    // Add to customCategories to ensure it's treated as a "new" user-added sheet
    setCustomCategories(prev => {
      if (prev.some(c => c.toLowerCase() === lowerVal)) return prev;
      return [...prev, trimmedVal];
    });

    // Add to the target group if not already there
    setCategoryGroups(prev => {
      const currentGroupCats = prev[targetGroup] || [];
      if (currentGroupCats.some(c => c.toLowerCase() === lowerVal)) return prev;
      return {
        ...prev,
        [targetGroup]: [...currentGroupCats, trimmedVal]
      };
    });
    
    // Ensure it's in selectedCategories (visible)
    setSelectedCategories(prev => {
      if (prev.some(c => c.toLowerCase() === lowerVal)) return prev;
      return [...prev, trimmedVal];
    });

    setSelectedGroup(targetGroup);
    setSelectedCategory(trimmedVal);
    
    // Ensure the group is visible
    setSelectedGroups(prev => {
      if (prev.includes(targetGroup)) return prev;
      return [...prev, targetGroup];
    });
    
    setNewSheetName('');
    setTimeout(() => {
      setSelectedCategory(trimmedVal);
    }, 0);
  };

  const handleAddNewExcelSheet = () => {
    let sheetNum = 1;
    let newName = `Sheet${sheetNum}`;
    while (allCategories.some(c => c.toLowerCase() === newName.toLowerCase())) {
      sheetNum++;
      newName = `Sheet${sheetNum}`;
    }
    handleAddCategory(newName);
  };

  const handlePasteCategories = () => {
    const lines = categoriesPasteText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return;

    // Current model's base categories
    const currentBase = Array.from(new Set(PARTS_DATA.filter(p => p.model === inspectionInfo.model).map(p => p.category)));
    const lowerBase = currentBase.map(c => c.toLowerCase());
    const toSelect: string[] = [];

    setCustomCategories(prev => {
      const next = [...prev];
      const lowerCustom = next.map(c => c.toLowerCase());

      lines.forEach(line => {
        const lowerLine = line.toLowerCase();
        if (!lowerBase.includes(lowerLine) && !lowerCustom.includes(lowerLine)) {
          next.push(line);
          lowerCustom.push(lowerLine);
        }
        toSelect.push(line);
      });
      return next;
    });

    if (toSelect.length > 0) {
      setSelectedCategories(prev => {
        const next = [...prev];
        const lowerPrev = next.map(c => c.toLowerCase());
        toSelect.forEach(cat => {
          if (!lowerPrev.includes(cat.toLowerCase())) {
            next.push(cat);
            lowerPrev.push(cat.toLowerCase());
          }
        });
        return next;
      });
    }

    if (lines.length > 0) {
      const firstAdded = lines[0];
      const lowerFirst = firstAdded.toLowerCase();
      
      // Find which group this category belongs to
      let targetGroup = '';
      let found = false;
      for (const [groupName, cats] of Object.entries(categoryGroups)) {
        if ((cats as string[]).some(c => c.toLowerCase() === lowerFirst)) {
          targetGroup = groupName;
          found = true;
          break;
        }
      }

      if (!found) {
        const groupToUse = selectedGroup || sortedGroupNames[0];
        if (groupToUse) {
          setCategoryGroups(prev => ({
            ...prev,
            [groupToUse]: [...(prev[groupToUse] || []), firstAdded]
          }));
          targetGroup = groupToUse;
        }
      }

      if (targetGroup) {
        setSelectedGroup(targetGroup);
        // Also ensure the group is visible to users
        setSelectedGroups(prev => {
          if (prev.includes(targetGroup)) return prev;
          return [...prev, targetGroup];
        });
      }
      setSelectedCategory(firstAdded);
    }

    setCategoriesPasteText('');
    setIsPasteCategoriesModalOpen(false);
    alert(`${lines.length} sheets processadas!`);
  };

  const handleBulkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files) as File[];
    const addedCategories: string[] = [];
    const newDiagrams: Record<string, string> = {};
    const selectList: string[] = [];

    for (const file of fileArray) {
      const result = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const compressed = await compressImage(result);
      const baseName = file.name.split('.')[0];
      
      // Check if category already exists (case-insensitive)
      const existingCat = allCategories.find(c => c.toLowerCase() === baseName.toLowerCase());
      
      let catName = baseName;
      if (existingCat) {
        catName = existingCat;
        selectList.push(catName);
      } else {
        // Check if we already added this name in this loop
        const alreadyAdded = addedCategories.find(c => c.toLowerCase() === baseName.toLowerCase());
        if (alreadyAdded) {
          catName = alreadyAdded;
        } else {
          addedCategories.push(baseName);
          catName = baseName;
          selectList.push(catName);
        }
      }

      newDiagrams[getScopedKey(catName)] = compressed;
    }

    if (addedCategories.length > 0) {
      setCustomCategories(prev => [...prev, ...addedCategories]);
    }
    
    if (selectList.length > 0) {
      setSelectedCategories(prev => {
        const next = [...prev];
        const lowerPrev = next.map(c => c.toLowerCase());
        selectList.forEach(cat => {
          if (!lowerPrev.includes(cat.toLowerCase())) {
            next.push(cat);
            lowerPrev.push(cat.toLowerCase());
          }
        });
        return next;
      });
    }

    setDiagramImages(prev => ({ ...prev, ...newDiagrams }));
    
    if (addedCategories.length > 0 || selectList.length > 0) {
      const firstCat = addedCategories[0] || fileArray[0].name.split('.')[0];
      const lowerFirst = firstCat.toLowerCase();
      
      // Find which group this category belongs to
      let targetGroup = '';
      let found = false;
      for (const [groupName, cats] of Object.entries(categoryGroups)) {
        if ((cats as string[]).some(c => c.toLowerCase() === lowerFirst)) {
          targetGroup = groupName;
          found = true;
          break;
        }
      }

      if (!found) {
        const groupToUse = selectedGroup || sortedGroupNames[0];
        if (groupToUse) {
          setCategoryGroups(prev => ({
            ...prev,
            [groupToUse]: [...(prev[groupToUse] || []), firstCat]
          }));
          targetGroup = groupToUse;
        }
      }

      if (targetGroup) {
        setSelectedGroup(targetGroup);
        // Also ensure the group is visible to users
        setSelectedGroups(prev => {
          if (prev.includes(targetGroup)) return prev;
          return [...prev, targetGroup];
        });
      }
      setSelectedCategory(firstCat);
    }

    alert(`${fileArray.length} fotos processadas!`);
  };

  const handleZoomIn = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setImgConfigs(prev => {
      const current = prev[getScopedKey(selectedCategory)] || { scale: 1, x: 0, y: 0 };
      const newScale = Math.min(15, current.scale + 0.2);
      return {
        ...prev,
        [getScopedKey(selectedCategory)]: { ...current, scale: parseFloat(newScale.toFixed(2)) }
      };
    });
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setImgConfigs(prev => {
      const current = prev[getScopedKey(selectedCategory)] || { scale: 1, x: 0, y: 0 };
      const newScale = Math.max(0.5, current.scale - 0.2);
      return {
        ...prev,
        [getScopedKey(selectedCategory)]: { ...current, scale: parseFloat(newScale.toFixed(2)) }
      };
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isAdjusting) return;
    const delta = e.deltaY;
    const scaleStep = 0.1; // Increased for better feel
    const minScale = 0.5;
    const maxScale = 15;

    setImgConfigs(prev => {
      const current = prev[getScopedKey(selectedCategory)] || { scale: 1, x: 0, y: 0 };
      const newScale = delta > 0 
        ? Math.max(minScale, current.scale - scaleStep) 
        : Math.min(maxScale, current.scale + scaleStep);
      
      return {
        ...prev,
        [getScopedKey(selectedCategory)]: { ...current, scale: parseFloat(newScale.toFixed(2)) }
      };
    });
  };

  const [lastTouchPos, setLastTouchPos] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAdjusting) return;
    if (e.touches.length === 1) {
      setIsPanning(true);
      setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      const deltaX = e.touches[0].clientX - lastTouchPos.x;
      const deltaY = e.touches[0].clientY - lastTouchPos.y;
      
      setImgConfigs(prev => {
        const scopedKey = getScopedKey(selectedCategory);
        const current = prev[scopedKey] || { scale: 1, x: 0, y: 0 };
        return {
          ...prev,
          [scopedKey]: { ...current, x: current.x + deltaX, y: current.y + deltaY }
        };
      });
      setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2 && lastTouchDistance !== null) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const delta = distance - lastTouchDistance;
      const scaleStep = 0.01;
      
      setImgConfigs(prev => {
        const scopedKey = getScopedKey(selectedCategory);
        const current = prev[scopedKey] || { scale: 1, x: 0, y: 0 };
        const newScale = Math.max(0.5, Math.min(15, current.scale + delta * scaleStep));
        return {
          ...prev,
          [scopedKey]: { ...current, scale: parseFloat(newScale.toFixed(2)) }
        };
      });
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setLastTouchDistance(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAdjusting) return;
    if (e.button === 0 && (e.altKey || currentConfig.scale > 1)) {
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;

    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;

    setImgConfigs(prev => {
      const current = prev[getScopedKey(selectedCategory)] || { scale: 1, x: 0, y: 0 };
      return {
        ...prev,
        [getScopedKey(selectedCategory)]: { 
          ...current, 
          x: current.x + dx / current.scale, 
          y: current.y + dy / current.scale 
        }
      };
    });

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleDeleteImage = () => {
    if (currentConfig.isLocked) {
      alert('A imagem está travada. Desbloqueie para poder excluir.');
      return;
    }
    const scopedKey = getScopedKey(selectedCategory);
    
    // Explicitly delete from IndexedDB to free up space immediately
    storageService.deleteDiagramImage(scopedKey);
    storageService.deleteDiagramImage(selectedCategory);
    
    setDiagramImages(prev => {
      const next = { ...prev };
      delete next[scopedKey];
      delete next[selectedCategory]; // Also delete unscoped for cleanup
      return next;
    });
    setImgConfigs(prev => {
      const next = { ...prev };
      delete next[scopedKey];
      delete next[selectedCategory];
      return next;
    });
    setCustomPositions(prev => {
      const next = { ...prev };
      delete next[scopedKey];
      delete next[selectedCategory];
      return next;
    });
    setIsAdjusting(false);
  };

  const addNewPart = () => {
    const scopedKey = getScopedKey(selectedCategory);
    const newId = `clone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPart: Part = {
      id: newId,
      sheet: selectedCategory,
      category: selectedCategory,
      itemNumber: '?',
      partNumber: 'NOVO-PN',
      description: 'Nova Peça',
      model: inspectionInfo.model
    };
    
    setClonedParts(prev => {
      const next = { ...prev, [scopedKey]: [...(prev[scopedKey] || []), newPart] };
      return next;
    });
    
    setFocusedPart(newPart);
    if (window.innerWidth < 768) setIsDetailsVisible(true);
  };

  const updatePart = (id: string, updates: Partial<Part>) => {
    if (id.includes('-clone-') || id.startsWith('clone-') || id.startsWith('custom-')) {
      setClonedParts(prev => {
        const next = { ...prev };
        const scopedKey = getScopedKey(selectedCategory);
        const catClones = [...(next[scopedKey] || [])];
        const idx = catClones.findIndex(p => p.id === id);
        if (idx !== -1) {
          catClones[idx] = { ...catClones[idx], ...updates };
          next[scopedKey] = catClones;
        }
        return next;
      });
    } else {
      setPartOverrides(prev => {
        const next = { ...prev, [id]: { ...(prev[id] || {}), ...updates } };
        safeSetItem('partOverrides', JSON.stringify(next));
        broadcastUpdate({ partOverrides: next });
        return next;
      });
    }
    
    if (focusedPart?.id === id) {
      setFocusedPart(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deletePart = (id: string) => {
    const scopedKey = getScopedKey(selectedCategory);
    
    // Remove from selected items if it's there
    setSelectedItems(prev => prev.filter(item => item.part.id !== id));
    
    // Check if it's a clone
    if (id.includes('-clone-') || id.startsWith('clone-') || id.startsWith('custom-')) {
      setClonedParts(prev => {
        const next = { ...prev };
        const catClones = (next[scopedKey] || []).filter(p => p.id !== id);
        next[scopedKey] = catClones;
        return next;
      });
    } else {
      // Otherwise it's a base part - add to excludedParts
      setExcludedParts(prev => {
        const next = { ...prev };
        const currentExcluded = next[scopedKey] || [];
        if (!currentExcluded.includes(id)) {
          next[scopedKey] = [...currentExcluded, id];
          safeSetItem('excludedParts', JSON.stringify(next));
          broadcastUpdate({ excludedParts: next });
        }
        return next;
      });
    }

    if (focusedPart?.id === id) {
      setFocusedPart(null);
    }
  };

  const filteredParts = useMemo(() => {
    const model = inspectionInfo.model || 'EX1200-7-BH';
    
    const baseParts = PARTS_DATA.filter(p => {
      return p.category === selectedCategory && p.model === model;
    }).map(p => partOverrides[p.id] ? { ...p, ...partOverrides[p.id] } : p);
    
    const scopedKey = getScopedKey(selectedCategory);
    const clones = clonedParts[scopedKey] || [];
    const excluded = excludedParts[scopedKey] || [];
    const all = [...baseParts, ...clones];

    return all.filter(part => {
      if (excluded.includes(part.id)) return false;
      
      const matchesGeneral = !searchTerm || 
        part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesItem = !itemSearchTerm || 
        part.itemNumber.toString().toUpperCase().includes(itemSearchTerm.toUpperCase());
        
      return matchesGeneral && matchesItem;
    });
  }, [searchTerm, itemSearchTerm, selectedCategory, clonedParts, excludedParts, partOverrides, inspectionInfo.model]);

  useEffect(() => {
    if (itemSearchTerm && filteredParts.length === 1 && !focusedPart) {
      setFocusedPart(filteredParts[0]);
    }
  }, [itemSearchTerm, filteredParts, focusedPart]);

  const duplicatePart = (part: Part) => {
    const newId = `${part.id}-clone-${Date.now()}`;
    const newPart: Part = {
      ...part,
      id: newId,
      itemNumber: part.itemNumber
    };
    
    const scopedKey = getScopedKey(selectedCategory);
    const nextClonedParts = {
      ...clonedParts,
      [scopedKey]: [...(clonedParts[scopedKey] || []), newPart]
    };
    setClonedParts(nextClonedParts);
    
    // Copy position with small offset
    const originalPos = (customPositions[scopedKey] || {})[part.id];
    const initialPos = originalPos 
      ? { 
          top: `${Math.min(95, Math.max(5, parseFloat(originalPos.top) + 3))}%`, 
          left: `${Math.min(95, Math.max(5, parseFloat(originalPos.left) + 3))}%` 
        }
      : { top: '50%', left: '50%' };

    const nextCustomPositions = {
      ...customPositions,
      [scopedKey]: {
        ...(customPositions[scopedKey] || {}),
        [newId]: initialPos
      }
    };
    setCustomPositions(nextCustomPositions);
    
    // Duplicate selected items data (photos, etc)
    const originalSelections = selectedItems.filter(i => i.part.id === part.id);
    let nextSelectedItems = selectedItems;
    if (originalSelections.length > 0) {
      const newSelections = originalSelections.map(i => ({
        ...i,
        part: newPart,
        timestamp: Date.now() + Math.random()
      }));
      nextSelectedItems = [...selectedItems, ...newSelections];
      setSelectedItems(nextSelectedItems);
    }

    setFocusedPart(newPart);
    addSyncLog(`Peça ${part.itemNumber} duplicada com sucesso.`);

    broadcastUpdate({
      clonedParts: nextClonedParts,
      customPositions: nextCustomPositions,
      selectedItems: nextSelectedItems
    });
  };

  const removeClone = (partId: string) => {
    const scopedKey = getScopedKey(selectedCategory);
    const isClone = partId.includes('-clone-') || partId.includes('ai-detected-') || partId.includes('custom-');
    
    const nextClonedParts = {
      ...clonedParts,
      [scopedKey]: (clonedParts[scopedKey] || []).filter(p => p.id !== partId)
    };
    setClonedParts(nextClonedParts);
    
    let nextExcludedParts = { ...excludedParts };
    if (!isClone) {
      const currentExcluded = nextExcludedParts[scopedKey] || [];
      if (!currentExcluded.includes(partId)) {
        nextExcludedParts[scopedKey] = [...currentExcluded, partId];
        setExcludedParts(nextExcludedParts);
      }
    }
    
    // Also remove its custom position and selection
    const nextCustomPositions = { ...customPositions };
    if (nextCustomPositions[scopedKey]) {
      const categoryPos = { ...nextCustomPositions[scopedKey] };
      delete categoryPos[partId];
      nextCustomPositions[scopedKey] = categoryPos;
    }
    setCustomPositions(nextCustomPositions);
    
    const nextSelectedItems = selectedItems.filter(i => i.part.id !== partId);
    setSelectedItems(nextSelectedItems);
    setFocusedPart(null);

    // Broadcast updates
    broadcastUpdate({
      clonedParts: nextClonedParts,
      customPositions: nextCustomPositions,
      selectedItems: nextSelectedItems,
      excludedParts: nextExcludedParts
    });
  };

  const toggleItem = (part: Part, type: ListType) => {
    setSelectedItems(prev => {
      const exists = prev.find(item => item.part.id === part.id && item.type === type);
      if (exists) {
        // Clean up photos from IndexedDB
        const photoId = `photo_${exists.timestamp}_${exists.part.id}`;
        const cropId = `crop_${exists.timestamp}_${exists.part.id}`;
        storageService.deleteItemPhoto(photoId);
        storageService.deleteItemPhoto(cropId);
        if (exists.highlights) {
          exists.highlights.forEach(h => {
            if (h.photo) storageService.deleteItemPhoto(`highlight_${h.id}`);
          });
        }
        return prev.filter(item => !(item.part.id === part.id && item.type === type));
      } else {
        return [...prev, { 
          part, 
          type, 
          timestamp: Date.now(),
          criticality: type === 'damaged' ? 'C' : undefined,
          quantity: part.quantity || 1
        }];
      }
    });
  };

  const setQuantity = (partId: string, type: ListType, quantity: number) => {
    setSelectedItems(prev => prev.map(item => 
      (item.part.id === partId && item.type === type) ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const setCriticality = (partId: string, criticality: Criticality) => {
    setSelectedItems(prev => prev.map(item => 
      item.part.id === partId ? { ...item, criticality } : item
    ));
  };

  const isSelected = (partId: string, type: ListType) => {
    return selectedItems.some(item => item.part.id === partId && item.type === type);
  };

  const orderList = selectedItems.filter(item => item.type === 'order');
  const damagedList = selectedItems.filter(item => item.type === 'damaged');

  const exportToPDF = () => {
    const doc = new jsPDF();
    const t = TRANSLATIONS[reportLanguage];
    const title = activeTab === 'order' ? t.orderList : t.damageReport;
    const items = activeTab === 'order' ? orderList : damagedList;

    if (items.length === 0) return;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(242, 125, 38); // Brand Orange
    doc.text(title, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${t.date} ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`${t.totalItems} ${items.length}`, 14, 35);
    doc.text(t.platform, 14, 40);

    // Table
    const tableData = items.map(({ part, photo }) => [
      part.partNumber,
      part.description,
      part.sheet,
      part.itemNumber,
      photo ? (reportLanguage === 'pt' ? 'Com Foto' : 'With Photo') : (reportLanguage === 'pt' ? 'Sem Foto' : 'No Photo')
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Part Number', reportLanguage === 'pt' ? 'Descrição' : 'Description', 'Sheet', 'Item', 'Status Photo']],
      body: tableData,
      headStyles: { fillColor: [242, 125, 38] },
      theme: 'grid',
    });

    // Add Photos Section if it has photos
    if (items.some(i => i.photo)) {
      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(242, 125, 38);
      doc.text(t.photoEvidence, 14, 22);
      
      let currentY = 35;
      
      items.forEach((item, index) => {
        if (item.photo) {
          // Check if we need a new page (image height is approx 100)
          if (currentY > 180) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.setFontSize(11);
          doc.setTextColor(0);
          doc.setFont('helvetica', 'bold');
          doc.text(`${t.item} ${item.part.itemNumber}: ${item.part.partNumber}`, 14, currentY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${t.desc} ${item.part.description}`, 14, currentY + 5);
          
          try {
            // Add image with a small border/frame feel
            const mainFormat = item.photo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
            doc.addImage(item.photo, mainFormat, 14, currentY + 10, 180, 100);
            
            // Add highlights if exist
            if (item.highlights && item.highlights.length > 0) {
              const imgX = 14;
              const imgY = currentY + 10;
              const imgW = 180;
              const imgH = 100;
              
              item.highlights.forEach(h => {
                const hX = imgX + (h.x / 100) * imgW;
                const hY = imgY + (h.y / 100) * imgH;
                const color = h.color || '#ef4444';
                const thickness = h.thickness || 2;
                
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                doc.setDrawColor(r, g, b);
                doc.setLineWidth(thickness * 0.2);

                if (h.type === 'circle') {
                  const hR = ((h.radius || 8) / 100) * imgW;
                  if (h.photo) {
                    try {
                      // Draw white background for the detail circle
                      doc.setFillColor(255, 255, 255);
                      doc.circle(hX, hY, hR, 'F');
                      
                      const format = h.photo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                      doc.addImage(h.photo, format, hX - hR, hY - hR, hR * 2, hR * 2);
                    } catch (e) {
                      console.error("Error adding highlight photo:", e);
                    }
                  }
                  // Draw the stroke on top
                  doc.setDrawColor(r, g, b);
                  doc.setLineWidth(thickness * 0.2);
                  doc.circle(hX, hY, hR, 'S');
                } else if (h.type === 'callout') {
                  const hR = ((h.radius || 8) / 100) * imgW;
                  doc.setDrawColor(r, g, b);
                  doc.setLineWidth(thickness * 0.2);
                  doc.circle(hX, hY, hR, 'S');
                  
                  // Draw text inside callout
                  doc.setFontSize((h.fontSize || 24) * 0.5);
                  doc.setTextColor(r, g, b);
                  doc.text(h.text || '', hX, hY + (hR * 0.3), { align: 'center' });
                } else if (h.type === 'crop') {
                  const hR = ((h.radius || 8) / 100) * imgW;
                  doc.setDrawColor(r, g, b);
                  doc.setLineWidth(thickness * 0.2);
                  (doc as any).setLineDash([2, 2], 0);
                  doc.circle(hX, hY, hR, 'S');
                  (doc as any).setLineDash([], 0); // Reset dash
                } else if (h.type === 'box') {
                  const hW = ((h.width || 15) / 100) * imgW;
                  const hH = ((h.height || 15) / 100) * imgH;
                  doc.rect(hX - hW/2, hY - hH/2, hW, hH, 'S');
                } else if (h.type === 'text') {
                  doc.setFontSize((h.fontSize || 16) * 0.8);
                  doc.setTextColor(r, g, b);
                  doc.text(h.text || '', hX, hY, { align: 'center' });
                } else if (h.type === 'arrow') {
                  const angle = (h.rotation || 0) * (Math.PI / 180);
                  const length = ((h.length || 15) / 100) * imgW;
                  
                  const endX = hX + Math.cos(angle) * length;
                  const endY = hY + Math.sin(angle) * length;
                  
                  doc.line(hX, hY, endX, endY);
                  
                  const headSize = thickness * 1.5;
                  const headAngle = Math.PI * 0.85;
                  doc.line(endX, endY, endX + headSize * Math.cos(angle + headAngle), endY + headSize * Math.sin(angle + headAngle));
                  doc.line(endX, endY, endX + headSize * Math.cos(angle - headAngle), endY + headSize * Math.sin(angle - headAngle));
                }
              });
            }
            
            // Add Diagram if available
            const originalCat = item.part.category;
            const renamedCat = categoryRenames[originalCat] || originalCat;
            const scopedKey = getScopedKey(originalCat);
            const renamedScopedKey = getScopedKey(renamedCat);
            let diagramImg = diagramImages[scopedKey] || diagramImages[renamedScopedKey] || diagramImages[originalCat] || diagramImages[renamedCat];
            
            if (!diagramImg) {
              const lowerOriginal = originalCat.toLowerCase().trim();
              const lowerRenamed = renamedCat.toLowerCase().trim();
              const foundKey = Object.keys(diagramImages).find(k => {
                const lk = k.toLowerCase().trim();
                return lk === lowerOriginal || lk === lowerRenamed || lk.endsWith(`:${lowerOriginal}`) || lk.endsWith(`:${lowerRenamed}`);
              });
              if (foundKey) diagramImg = diagramImages[foundKey];
            }

            if (diagramImg) {
              try {
                const diagFormat = diagramImg.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                doc.addImage(diagramImg, diagFormat, 14, currentY + 115, 60, 40);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(t.catalogRef || "Catálogo", 14, currentY + 113);
                currentY += 160;
              } catch (e) {
                console.error("Error adding diagram to export PDF:", e);
                currentY += 125;
              }
            } else {
              currentY += 125;
            }
          } catch (e) {
            doc.setTextColor(255, 0, 0);
            doc.text(t.photoError, 14, currentY + 15);
            currentY += 30;
          }
        }
      });
    }

    doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
  };

  const exportTechnicalReportPDF = async () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const orange = [242, 125, 38];
    const t = TRANSLATIONS[reportLanguage];

    const addHeader = (title: string) => {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      // Logo (Orange box with white text)
      doc.setFillColor(orange[0], orange[1], orange[2]);
      doc.rect(15, 8, 55, 12, 'F');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      const logoText = 'LANDCROSS';
      doc.text(logoText, 42.5, 16.5, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(title.toUpperCase(), pageWidth - 15, 16.5, { align: 'right' });
      
      doc.setDrawColor(orange[0], orange[1], orange[2]);
      doc.setLineWidth(1.5);
      doc.line(15, 28, pageWidth - 15, 28);
    };

    // Page 1: Cover
    addHeader(t.inspection);
    doc.setFontSize(32);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(t.technicalReport, 15, 50);

    // Info Box
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 65, pageWidth - 30, 140, 10, 10, 'D');

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(t.inspectionInfo, 25, 80);

    const infoFields = [
      [t.model, String(inspectionInfo.model || '')],
      [t.sn, String(inspectionInfo.sn || '')],
      [t.tag, String(inspectionInfo.tag || '')],
      [t.delivery, String(inspectionInfo.delivery || '')],
      [t.customer, String(inspectionInfo.customer || '')],
      [t.description, String(inspectionInfo.description || '')],
      [t.machineDown, inspectionInfo.machineDown ? t.yes : t.no]
    ];

    let currentY = 95;
    doc.setFontSize(11);
    infoFields.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(String(label || ''), 25, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value || ''), 75, currentY);
      currentY += 8;
    });

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(25, currentY + 4, pageWidth - 25, currentY + 4);

    currentY += 15;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.text(t.reportData.toUpperCase(), 25, currentY);
    
    currentY += 10;
    doc.setTextColor(0, 0, 0);
    const reportData = [
      [t.inspectionDate, inspectionInfo.date],
      [t.inspectorName, inspectionInfo.inspectorName],
      [t.hourMeter, inspectionInfo.hourMeter]
    ];

    reportData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 25, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 75, currentY);
      currentY += 8;
    });

    // Sort items by category name for a more organized report
    const validItems = selectedItems.filter(i => i && i.part);
    const sortedItems = [...validItems].sort((a, b) => {
      const catA = categoryRenames[a.part.category] || a.part.category || '';
      const catB = categoryRenames[b.part.category] || b.part.category || '';
      return catA.localeCompare(catB);
    });

    // Photo Pages
    const itemsWithPhotos = sortedItems.filter(i => i.photo || i.type === 'damaged' || i.type === 'order');
    
    for (const item of itemsWithPhotos) {
      const index = itemsWithPhotos.indexOf(item);
      doc.addPage('a4', 'l');
      addHeader(t.photos);

      const imgW = (pageWidth - 40) / 2;
      const imgH = imgW * (9 / 16);
      const barH = 12;
      const barY = 40;
      const padding = 5;
      const imgY = barY + barH + padding;
      const rightX = pageWidth / 2 + 5;
      const diagramH = (imgY + imgH) - barY; // Align diagram with top of bar and bottom of photo

      // Header with Photo Number
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'bold');
      doc.text(`${t.photo} ${index + 1}`, pageWidth - 15, barY - 5, { align: 'right' });

      // Grey Bar above Left Photo (Criticality Bar)
      let barColor = [180, 180, 180];
      if (item.type === 'damaged') {
        if (item.criticality === 'A') barColor = [220, 38, 38];
        else if (item.criticality === 'B') barColor = [250, 204, 21];
        else if (item.criticality === 'C') barColor = [16, 185, 129];
      } else if (item.type === 'order') {
        barColor = [242, 125, 38]; // Orange for order
      }
      
      doc.setFillColor(barColor[0], barColor[1], barColor[2]);
      doc.rect(15, barY, imgW, barH, 'F');
      
      // Draw Triangle if damaged
      if (item.type === 'damaged') {
        const triX = 20;
        const triY = barY + barH / 2;
        const triSize = 8;
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.5);
        doc.line(triX, triY - triSize/2, triX - triSize/2, triY + triSize/2);
        doc.line(triX, triY - triSize/2, triX + triSize/2, triY + triSize/2);
        doc.line(triX - triSize/2, triY + triSize/2, triX + triSize/2, triY + triSize/2);
        
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        const marks = item.criticality === 'A' ? '!!!' : item.criticality === 'B' ? '!!' : '!';
        doc.text(marks, triX, triY + 2, { align: 'center' });
      }

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      const textX = item.type === 'damaged' ? 28 : 20;
      
      let barText = '';
      if (item.type === 'damaged') {
        if (item.criticality === 'A') barText = t.highCriticalityLabel;
        else if (item.criticality === 'B') barText = t.mediumCriticalityLabel;
        else if (item.criticality === 'C') barText = t.lowCriticalityLabel;
      } else if (item.type === 'order') {
        barText = t.orderList;
      }
      
      doc.text(barText.toUpperCase(), textX, barY + 8);

      // Left: Inspection Photo
      if (item.photo) {
        try {
          doc.setFillColor(240, 240, 240);
          doc.rect(15, imgY, imgW, imgH, 'F');
          const mainFormat = item.photo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
          doc.addImage(item.photo, mainFormat, 15, imgY, imgW, imgH);
        } catch (e) {
          console.error("Error adding inspection photo:", e);
          doc.setDrawColor(200);
          doc.rect(15, imgY, imgW, imgH, 'S');
          doc.setTextColor(150);
          doc.text(t.errorPhoto, 15 + imgW / 4, imgY + imgH / 2);
        }
      } else {
        doc.setDrawColor(200);
        doc.rect(15, imgY, imgW, imgH, 'S');
        doc.setTextColor(150);
        doc.text(t.noPhoto, 15 + imgW / 4, imgY + imgH / 2);
      }

      // Right: Diagram (Catalog Reference)
      const originalCat = item.part.category;
      const renamedCat = categoryRenames[originalCat] || originalCat;
      const scopedKey = getScopedKey(originalCat);
      const renamedScopedKey = getScopedKey(renamedCat);
      
      // Robust lookup: check scoped keys first, then original, then renamed
      let diagramImg = diagramImages[scopedKey] || diagramImages[renamedScopedKey] || diagramImages[originalCat] || diagramImages[renamedCat];
      
      // If still not found, check if any custom category has this name (case-insensitive)
      if (!diagramImg) {
        const lowerOriginal = originalCat.toLowerCase().trim();
        const lowerRenamed = renamedCat.toLowerCase().trim();
        const foundKey = Object.keys(diagramImages).find(k => {
          const lk = k.toLowerCase().trim();
          // Also check if the key contains the category name (for scoped keys)
          return lk === lowerOriginal || lk === lowerRenamed || lk.endsWith(`:${lowerOriginal}`) || lk.endsWith(`:${lowerRenamed}`);
        });
        if (foundKey) diagramImg = diagramImages[foundKey];
      }

      if (diagramImg) {
        try {
          const format = diagramImg.startsWith('data:image/png') ? 'PNG' : 'JPEG';
          doc.addImage(diagramImg, format, rightX, barY, imgW, diagramH);
        } catch (e) {
          console.error("Error adding diagram image:", e);
          doc.setDrawColor(200);
          doc.rect(rightX, barY, imgW, diagramH, 'S');
          doc.setTextColor(150);
          doc.setFontSize(8);
          doc.text(t.errorCatalog, rightX + imgW / 2, barY + diagramH / 2, { align: 'center' });
        }
      } else {
        doc.setDrawColor(200);
        doc.rect(rightX, barY, imgW, diagramH, 'S');
        doc.setTextColor(150);
        doc.setFontSize(8);
        doc.text(t.noDiagram, rightX + imgW / 2, barY + diagramH / 2, { align: 'center' });
      }

      // Footer Labels (Orange)
      try {
        const footerY = imgY + imgH + padding;
        doc.setFillColor(orange[0], orange[1], orange[2]);
        doc.rect(15, footerY, imgW, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        const descText = `${String(item.part.description || "").toUpperCase()} | ${t.partNumber}: ${item.part.partNumber} | ${t.qty}: ${item.quantity || 1}`;
        doc.text(descText, 20, footerY + 10);

        doc.setFillColor(orange[0], orange[1], orange[2]);
        doc.rect(rightX, footerY, imgW, 15, 'F');
        doc.text(t.catalogRef, rightX + 5, footerY + 10);
      } catch (e) {
        console.error("Error rendering PDF footer:", e);
      }

      // Draw Highlights LAST to prevent clipping issues from affecting other elements
      if (item.photo && item.highlights && item.highlights.length > 0) {
        item.highlights.forEach(h => {
          const hX = 15 + (h.x / 100) * imgW;
          const hY = imgY + (h.y / 100) * imgH;
          const color = h.color || '#ef4444';
          const thickness = h.thickness || 2;
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          doc.setDrawColor(r, g, b);
          doc.setLineWidth(thickness * 0.2);

          if (h.type === 'circle') {
            const hR = ((h.radius || 8) / 100) * imgW;
            if (h.photo) {
              try {
                // Draw white background for the detail circle
                doc.setFillColor(255, 255, 255);
                doc.circle(hX, hY, hR, 'F');
                
                const format = h.photo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                doc.addImage(h.photo, format, hX - hR, hY - hR, hR * 2, hR * 2);
              } catch (e) {
                console.error("Error adding highlight photo:", e);
              }
            }
            // Draw the circle stroke
            doc.setDrawColor(r, g, b);
            doc.setLineWidth(thickness * 0.2);
            doc.circle(hX, hY, hR, 'S');
          } else if (h.type === 'box') {
            const hW = ((h.width || 15) / 100) * imgW;
            const hH = ((h.height || 15) / 100) * imgH;
            doc.rect(hX - hW/2, hY - hH/2, hW, hH, 'S');
          } else if (h.type === 'text') {
            doc.setFontSize((h.fontSize || 16) * 0.8);
            doc.setTextColor(r, g, b);
            doc.text(h.text || '', hX, hY, { align: 'center' });
          } else if (h.type === 'arrow') {
            const angle = (h.rotation || 0) * (Math.PI / 180);
            const length = ((h.length || 15) / 100) * imgW;
            const endX = hX + Math.cos(angle) * length;
            const endY = hY + Math.sin(angle) * length;
            doc.line(hX, hY, endX, endY);
            const headSize = thickness * 1.5;
            const headAngle = Math.PI * 0.85;
            doc.line(endX, endY, endX + headSize * Math.cos(angle + headAngle), endY + headSize * Math.sin(angle + headAngle));
            doc.line(endX, endY, endX + headSize * Math.cos(angle - headAngle), endY + headSize * Math.sin(angle - headAngle));
          } else if (h.type === 'callout') {
            const hR = ((h.radius || 8) / 100) * imgW;
            // Draw marker (white circle with black border and black letter)
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.circle(hX, hY, hR, 'FD');
            
            // Draw pointer (small black triangle at top-left of marker)
            const pSize = hR * 0.4;
            doc.setFillColor(0, 0, 0);
            doc.triangle(hX - hR, hY - hR, hX - hR + pSize, hY - hR, hX - hR, hY - hR + pSize, 'F');

            // Draw letter in marker
            doc.setFontSize((h.fontSize || 24) * 0.5);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text(h.text || '', hX, hY + (hR * 0.3), { align: 'center' });

            // Draw detail circle if photo exists
            if (h.photo) {
              const dX = 15 + ((h.detailX || (h.x + 15)) / 100) * imgW;
              const dY = imgY + ((h.detailY || h.y) / 100) * imgH;
              const dR = ((h.detailRadius || 15) / 100) * imgW;

              try {
                // Draw white background for detail
                doc.setFillColor(255, 255, 255);
                doc.circle(dX, dY, dR, 'F');
                
                // Draw the cropped photo in the circle
                const format = h.photo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                doc.addImage(h.photo, format, dX - dR, dY - dR, dR * 2, dR * 2);
                
                // Draw detail border
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(0.5);
                doc.circle(dX, dY, dR, 'S');

                // Draw letter at the base of the detail circle
                const labelW = dR * 0.6;
                const labelH = dR * 0.4;
                doc.setFillColor(255, 255, 255);
                doc.setDrawColor(0, 0, 0);
                doc.rect(dX - labelW/2, dY + dR - labelH/2, labelW, labelH, 'FD');
                
                doc.setFontSize((h.fontSize || 24) * 0.4);
                doc.setTextColor(0, 0, 0);
                doc.text(h.text || '', dX, dY + dR + (labelH * 0.2), { align: 'center' });
              } catch (e) {
                console.error("Error adding callout detail photo to PDF:", e);
              }
            }
          }
        });
      }
    }



    // Table Page
    doc.addPage('a4', 'l');
    addHeader(t.partsTable);
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(t.technicalReport, 15, 50);
    doc.setFontSize(18);
    doc.text(t.partsTable, 25, 65);

    const tableData = selectedItems.map((item, index) => {
      return [
        item.part.itemNumber || '-',
        item.part.description,
        item.part.partNumber,
        (item.quantity || 1).toString(),
        `${t.photo} ${index + 1}`
      ];
    });

    autoTable(doc, {
      startY: 75,
      head: [[t.item, t.partName, t.partNumber, t.qty, t.associatedPhoto]],
      body: tableData,
      headStyles: { fillColor: [0, 0, 0] },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 35 },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 35 }
      }
    });

    // Conclusion Page
    doc.addPage('a4', 'l');
    addHeader(t.conclusion);
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.technicalReport} LANDCROSS`, 15, 50);
    doc.setFontSize(18);
    doc.text(t.conclusion, 25, 65);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    const conclusionText = inspectionInfo.conclusion || TRANSLATIONS[reportLanguage].defaultConclusion
      .replace('{model}', inspectionInfo.model)
      .replace('{sn}', inspectionInfo.sn)
      .replace('{hourMeter}', inspectionInfo.hourMeter);
    
    const splitConclusion = doc.splitTextToSize(conclusionText, pageWidth - 40);
    doc.text(splitConclusion, 25, 80);

    // End Page
    doc.addPage('a4', 'l');
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(pageWidth / 2 - 25, 30, 50, 3, 'F');

    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(pageWidth / 2 - 50, 80, 100, 25, 'F');
    doc.setFontSize(40);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('LANDCROSS', pageWidth / 2, 98, { align: 'center' });

    doc.setFontSize(24);
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.text(t.safetyQuote1, pageWidth / 2, 130, { align: 'center' });
    doc.setFontSize(16);
    doc.text(t.safetyQuote2, pageWidth / 2, 150, { align: 'center' });
    
    doc.setFontSize(24);
    doc.text(t.end, pageWidth / 2, 180, { align: 'center' });

    doc.save(`Relatorio_Tecnico_LANDCROSS_${inspectionInfo.tag}_${inspectionInfo.date}.pdf`);
  };

  // Exact positions for Sheet 02 - FUEL PIPINGS based on the provided image
  const getHotspotPos = (part: Part) => {
    // Check custom positions first
    if (currentCustomPos[part.id]) {
      return currentCustomPos[part.id];
    }

    // If the category was explicitly cleared, don't use hardcoded fallbacks
    // (This logic is now handled by excludedParts)

    if (part.category === 'FUEL PIPINGS' && (part.model === 'EX1200-7-BH' || part.model === 'EX1200-7')) {
      const fuelPositions: Record<string, { top: string, left: string }> = {
        '00': { top: '56.5%', left: '42.5%' },
        '01': { top: '88.5%', left: '38.5%' },
        '02': { top: '63.5%', left: '46.5%' },
        '03': { top: '58.5%', left: '80.5%' },
        '04': { top: '58.5%', left: '24.5%' },
        '05': { top: '68.5%', left: '80.5%' },
      };
      return fuelPositions[part.itemNumber] || { top: '50%', left: '50%' };
    }

    if (part.category === 'TRAVEL PIPINGS (TRACK)' && part.model === 'EX2500-6') {
      const travelPositions: Record<string, { top: string, left: string }> = {
        '01': { top: '45%', left: '35%' },
        '02': { top: '42%', left: '38%' },
        '03': { top: '40%', left: '40%' },
        '04': { top: '44%', left: '42%' },
        '05': { top: '60%', left: '10%' },
        '06': { top: '20%', left: '75%' },
        '07': { top: '25%', left: '80%' },
        '08': { top: '65%', left: '30%' },
        '09': { top: '60%', left: '25%' },
        '10': { top: '65%', left: '55%' },
        '11': { top: '68%', left: '58%' },
        '12': { top: '63%', left: '48%' },
        '13': { top: '64%', left: '46%' },
        '14': { top: '75%', left: '70%' },
        '15': { top: '85%', left: '50%' },
        '16': { top: '50%', left: '55%' },
        '17': { top: '52%', left: '57%' },
        '18': { top: '54%', left: '59%' },
        '19': { top: '56%', left: '61%' },
        '20': { top: '50%', left: '25%' },
        '21': { top: '52%', left: '27%' },
        '22': { top: '48%', left: '23%' },
        '23': { top: '46%', left: '21%' },
        '24': { top: '18%', left: '68%' },
        '25': { top: '16%', left: '70%' },
        '26': { top: '14%', left: '72%' },
        '27': { top: '12%', left: '74%' },
        '28': { top: '28%', left: '75%' },
        '29': { top: '68%', left: '22%' },
        '30': { top: '70%', left: '20%' },
        '31': { top: '72%', left: '18%' },
        '32': { top: '74%', left: '16%' },
      };
      return travelPositions[part.itemNumber] || { top: '50%', left: '50%' };
    }

    if (part.category === 'AIR-CONDITIONER PIPING (2)' && part.model === 'EX2500-6') {
      const acPositions: Record<string, { top: string, left: string }> = {
        '02': { top: '71.2%', left: '77.8%' },
        '02A': { top: '72.2%', left: '78.8%' },
        '03': { top: '60.2%', left: '87.8%' },
        '03A': { top: '62.2%', left: '85.8%' },
        '05': { top: '64.2%', left: '87.8%' },
        '05A': { top: '65.2%', left: '88.8%' },
        '14': { top: '76.2%', left: '42.8%' },
        '15': { top: '79.2%', left: '39.8%' },
        '15A': { top: '80.2%', left: '40.8%' },
        '15B': { top: '81.2%', left: '41.8%' },
        '19': { top: '88.2%', left: '24.8%' },
        '20': { top: '85.2%', left: '17.8%' },
        '20A': { top: '86.2%', left: '18.8%' },
        '20B': { top: '87.2%', left: '19.8%' },
        '21': { top: '81.2%', left: '17.8%' },
        '22': { top: '93.2%', left: '17.8%' },
        '23': { top: '48.2%', left: '44.8%' },
        '24': { top: '40.5%', left: '44.8%' },
        '25': { top: '27.2%', left: '44.8%' },
        '26': { top: '24.5%', left: '44.8%' },
        '27': { top: '58.2%', left: '43.8%' },
        '28': { top: '47.5%', left: '47.8%' },
        '29': { top: '40.5%', left: '47.8%' },
        '30': { top: '43.2%', left: '52.8%' },
        '30A': { top: '53.2%', left: '54.8%' },
        '30B': { top: '55.2%', left: '47.8%' },
        '32': { top: '63.2%', left: '79.8%' },
        '33': { top: '74.2%', left: '84.8%' },
        '33A': { top: '75.2%', left: '85.8%' },
        '33B': { top: '76.2%', left: '86.8%' },
        '35': { top: '52.2%', left: '87.8%' },
        '36': { top: '55.2%', left: '89.8%' },
        '37': { top: '66.2%', left: '92.8%' },
        '39': { top: '72.2%', left: '54.8%' },
        '40': { top: '66.2%', left: '54.8%' },
        '41': { top: '76.2%', left: '75.8%' },
      };
      return acPositions[part.itemNumber] || { top: '50%', left: '50%' };
    }
    
    // Default fallback positions for other categories
    const index = parseInt(part.itemNumber) || 0;
    const positions = [
      { top: '20%', left: '30%' }, { top: '45%', left: '25%' },
      { top: '60%', left: '40%' }, { top: '30%', left: '70%' },
      { top: '55%', left: '75%' }, { top: '75%', left: '60%' },
      { top: '15%', left: '60%' }, { top: '80%', left: '30%' },
    ];
    return positions[index % positions.length];
  };

  const diagramContainerRef = React.useRef<HTMLDivElement>(null);
  const sidebarPhotoRef = React.useRef<HTMLDivElement>(null);
  const highlightEditorRef = React.useRef<HTMLDivElement>(null);
  const highlightModalRef = React.useRef<HTMLDivElement>(null);

  const handleGlobalSheetSearch = (term: string) => {
    if (!term.trim()) return;
    
    const searchLower = term.toLowerCase().trim();
    
    // Find the category (sheet)
    const targetCategories = isAdmin ? allCategories : visibleCategories;
    
    const foundCat = targetCategories.find(cat => 
      cat.toLowerCase() === searchLower || 
      (categoryRenames[cat] && categoryRenames[cat].toLowerCase() === searchLower)
    ) || targetCategories.find(cat => 
      cat.toLowerCase().includes(searchLower) || 
      (categoryRenames[cat] && categoryRenames[cat].toLowerCase().includes(searchLower))
    );

    if (foundCat) {
      // Find the group it belongs to
      const group = Object.entries(categoryGroups).find(([_, cats]) => 
        (cats as string[]).map(c => c?.toLowerCase() || '').includes(foundCat.toLowerCase())
      )?.[0];

      if (group) {
        setSelectedGroup(group);
      }
      setSelectedCategory(foundCat);
      setGlobalSheetSearchTerm('');
      setShowNoSheetFound(false);
    } else {
      setShowNoSheetFound(true);
      setTimeout(() => setShowNoSheetFound(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-landcros/30 bg-mining overflow-hidden">
      <AnimatePresence>
        {showSplashScreen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col lg:flex-row overflow-hidden font-sans"
          >
            {/* Left Content */}
            <div className="w-full lg:w-[45%] p-4 md:p-6 lg:p-8 flex flex-col relative z-10 bg-white h-full overflow-hidden">
              <div className="flex items-center gap-3 md:gap-4 shrink-0">
                 {/* Hitachi Logo */}
                 <div className="flex flex-col">
                   <span className="text-base md:text-xl font-black text-black tracking-tighter leading-none">HITACHI</span>
                   <div className="bg-[#F27D26] h-1 w-full mt-1" />
                   <span className="text-[6px] md:text-[8px] font-bold text-[#F27D26] uppercase tracking-[0.2em] mt-1">Reliable Solutions</span>
                 </div>
                 <div className="h-6 md:h-10 w-[1px] bg-zinc-200" />
                 {/* Landcross Logo */}
                 <div className="flex flex-col">
                   <div className="bg-landcros text-white px-2 md:px-3 py-0.5 font-black text-sm md:text-lg tracking-tighter">LANDCROS</div>
                   <span className="text-[5px] md:text-[7px] font-bold text-zinc-400 mt-0.5 leading-tight uppercase tracking-tighter">
                     Hitachi Construction Machinery<br/>will become LANDCROS
                   </span>
                 </div>
              </div>

              <div className="flex-1 flex flex-col justify-center py-2 md:py-4">
                <div className="space-y-2 md:space-y-4">
                  <div className="space-y-0.5">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black tracking-tighter leading-none">LANDCROS</h1>
                    <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-zinc-800 tracking-tight">Connect Insight</h2>
                  </div>

                  <div className="space-y-1 md:space-y-2 max-w-xl">
                    <h3 className="text-base md:text-xl lg:text-2xl font-bold text-black leading-tight">
                      Maximize Machine Performance
                    </h3>
                    <p className="text-[10px] md:text-sm lg:text-base text-zinc-600 leading-relaxed font-medium">
                      Improve the performance, reliability, and safety of Hitachi Construction Machinery mining equipment with LANDCROS Connect.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => setShowSplashScreen(false)}
                      className="group relative flex items-center gap-3 bg-black text-white px-6 md:px-10 py-2 md:py-3.5 rounded-full font-black text-sm md:text-xl hover:bg-landcros transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
                    >
                      START
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-auto pt-2 border-t border-zinc-100 shrink-0">
                <p className="text-zinc-400 font-bold text-[8px] md:text-[10px] uppercase tracking-widest flex items-center gap-2">
                  developed by <span>Warlen Silva</span>
                  <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                  <span>April - 2026</span>
                </p>
              </div>
            </div>

            {/* Right Image with Diagonal Cut */}
            <div className="flex-1 relative bg-zinc-100 hidden lg:block">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${splashScreenImage})`,
                  clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)'
                }}
              />
              {/* Gradient Overlay for better text readability on mobile if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              
              <div className="absolute top-6 right-6 flex flex-col items-end">
                 <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/20">
                   <div className="flex items-center gap-2">
                     <div className="relative">
                       <User className="w-5 h-5 text-black" strokeWidth={3} />
                       <div className="absolute -top-1 -right-1 w-2 h-2 bg-landcros rounded-full animate-pulse" />
                     </div>
                     <div className="h-5 w-[1px] bg-zinc-200 mx-1" />
                     <span className="text-xl md:text-3xl font-black text-black tracking-tighter">ZAMine</span>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar / Navigation */}
      <motion.div 
        initial={false}
        animate={{ x: isSidebarCollapsed ? -100 : 0 }}
        className="fixed left-0 top-0 bottom-0 w-20 md:w-24 bg-[#141414]/90 backdrop-blur-xl border-r border-white/5 hidden md:flex flex-col items-center py-8 z-50"
      >
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center p-1 shadow-[0_0_20px_rgba(242,125,38,0.3)] overflow-hidden">
            <span className="text-[7px] font-black text-red-600 tracking-tighter leading-none">HITACHI</span>
            <div className="w-full h-[1px] bg-red-600/20 my-0.5" />
            <span className="text-[5px] font-bold text-zinc-400 uppercase tracking-widest">Original</span>
          </div>
          <span className="text-[8px] font-black text-landcros tracking-tighter uppercase">LANDCROSS</span>
        </div>
        
        <nav className="flex flex-col gap-6 overflow-y-auto flex-1 custom-scrollbar w-full items-center px-2 py-4">
          <button 
            onClick={() => setActiveTab('report')}
            className={`p-4 rounded-2xl transition-all relative group ${activeTab === 'report' ? 'bg-landcros text-white shadow-[0_0_20px_rgba(242,125,38,0.4)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            title={TRANSLATIONS[reportLanguage].machineInfo}
          >
            <ClipboardList size={28} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setActiveTab('inspect')}
            className={`p-4 rounded-2xl transition-all group ${activeTab === 'inspect' ? 'bg-landcros text-white shadow-[0_0_20px_rgba(242,125,38,0.4)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            title={TRANSLATIONS[reportLanguage].inspection}
          >
            <MapIcon size={28} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setActiveTab('order')}
            className={`p-4 rounded-2xl transition-all relative group ${activeTab === 'order' ? 'bg-landcros text-white shadow-[0_0_20px_rgba(242,125,38,0.4)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            title={TRANSLATIONS[reportLanguage].orders}
          >
            <ShoppingCart size={28} className="group-hover:scale-110 transition-transform" />
            {orderList.length > 0 && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-white rounded-full border-2 border-landcros shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
          </button>
          <button 
            onClick={() => setActiveTab('damaged')}
            className={`p-4 rounded-2xl transition-all relative group ${activeTab === 'damaged' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            title={TRANSLATIONS[reportLanguage].damages}
          >
            <AlertTriangle size={28} className="group-hover:scale-110 transition-transform" />
            {damagedList.length > 0 && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-white rounded-full border-2 border-red-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
          </button>

          <div className="w-10 h-[1px] bg-white/10 my-2 self-center" />

          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="p-4 rounded-2xl text-zinc-500 hover:text-landcros hover:bg-landcros/10 transition-all group"
            title={TRANSLATIONS[reportLanguage].newInspection}
          >
            <FilePlus size={28} className="group-hover:scale-110 transition-transform" />
          </button>

          {isAdmin && (
            <div className="flex flex-col gap-6 w-full items-center">
              <div className="w-10 h-[1px] bg-white/10 my-2 self-center" />
              
              <button 
                onClick={() => setActiveTab('projects')}
                className={`p-4 rounded-2xl transition-all group ${activeTab === 'projects' ? 'bg-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                title={TRANSLATIONS[reportLanguage].manageProjects}
              >
                <Settings size={28} className="group-hover:scale-110 transition-transform" />
              </button>
              
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`p-4 rounded-2xl transition-all group ${isEditMode ? 'bg-landcros text-white shadow-[0_0_20px_rgba(242,125,38,0.4)]' : 'text-zinc-500 hover:text-zinc-300 bg-white/5'}`}
                title={isEditMode ? TRANSLATIONS[reportLanguage].viewMode : TRANSLATIONS[reportLanguage].editMode}
              >
                {isEditMode ? <Wrench size={28} className="group-hover:scale-110 transition-transform" /> : <Eye size={28} className="group-hover:scale-110 transition-transform" />}
              </button>

              <button 
                onClick={() => setShowSplashSettings(true)}
                className="p-4 rounded-2xl text-zinc-500 hover:text-landcros hover:bg-landcros/10 transition-all group"
                title="Splash Screen Settings"
              >
                <ImageIcon size={28} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-4 pb-6 w-full items-center px-2">
          <button 
            onClick={() => setIsDetailsVisible(!isDetailsVisible)}
            className={`p-3 rounded-xl transition-all flex items-center justify-center ${isDetailsVisible ? 'bg-white/5 text-zinc-500' : 'bg-landcros/20 text-landcros'}`}
            title={isDetailsVisible ? TRANSLATIONS[reportLanguage].hideDetails : TRANSLATIONS[reportLanguage].showDetails}
          >
            {isDetailsVisible ? <List size={24} /> : <Maximize2 size={24} />}
          </button>
          
          <button 
            onClick={() => setShowDataModal(true)}
            className={`p-3 rounded-xl transition-all flex items-center justify-center ${showDataModal ? 'bg-landcros/20 text-landcros' : 'bg-white/5 text-zinc-600 hover:text-zinc-400'}`}
            title={TRANSLATIONS[reportLanguage].dataManagement}
          >
            <Database size={24} />
          </button>

          <button 
            onClick={toggleAdmin}
            className={`p-3 rounded-xl transition-all flex items-center justify-center relative ${isAdmin ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-zinc-600 hover:text-zinc-400'}`}
            title={isAdmin ? TRANSLATIONS[reportLanguage].lockSettings : TRANSLATIONS[reportLanguage].unlockDevMode}
          >
            {isAdmin ? <ShieldCheck size={24} /> : <Shield size={24} />}
            <div 
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#141414] ${
                syncStatus === 'connected' ? 'bg-green-500' : syncStatus === 'connecting' ? 'bg-yellow-500' : syncStatus === 'unconfigured' ? 'bg-zinc-500' : 'bg-red-500'
              }`} 
            />
            {isAdmin && !isSidebarCollapsed && (
              <span className="absolute -right-16 bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-lg">
                MASTER
              </span>
            )}
          </button>
          <div className="px-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className={`w-1 h-1 rounded-full ${isSyncing ? 'bg-landcros animate-pulse' : syncStatus === 'connected' ? 'bg-green-500' : syncStatus === 'unconfigured' ? 'bg-zinc-500' : 'bg-red-500'}`} />
              <p className="text-[6px] text-zinc-500 uppercase font-bold tracking-widest">
                {isSyncing ? 'SYNCING...' : syncStatus === 'connected' ? TRANSLATIONS[reportLanguage].synced : syncStatus === 'unconfigured' ? 'SUPABASE OFF' : TRANSLATIONS[reportLanguage].offline}
              </p>
            </div>
            <p className="text-[6px] text-zinc-600 uppercase font-bold leading-tight">{TRANSLATIONS[reportLanguage].localSaveWarning}</p>
          </div>
          <button 
            onClick={() => {
              if (confirm(reportLanguage === 'pt' ? 'Deseja limpar todos os dados salvos? Isso removerá imagens e configurações.' : 'Do you want to clear all saved data? This will remove images and configurations.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="p-3 text-zinc-600 hover:text-red-500 transition-colors"
            title={TRANSLATIONS[reportLanguage].clearAll}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#141414]/95 backdrop-blur-2xl border-t border-white/5 flex md:hidden items-center justify-around py-3 px-4 z-50">
        <button 
          onClick={() => setActiveTab('report')}
          className={`p-2 rounded-lg transition-all ${activeTab === 'report' ? 'text-landcros' : 'text-zinc-500'}`}
        >
          <ClipboardList size={22} />
        </button>
        <button 
          onClick={() => setActiveTab('inspect')}
          className={`p-2 rounded-lg transition-all ${activeTab === 'inspect' ? 'text-landcros' : 'text-zinc-500'}`}
        >
          <MapIcon size={22} />
        </button>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="p-2 rounded-lg text-zinc-500 hover:text-landcros transition-all"
        >
          <FilePlus size={22} />
        </button>
        <button 
          onClick={() => setActiveTab('order')}
          className={`p-2 rounded-lg transition-all relative ${activeTab === 'order' ? 'text-landcros' : 'text-zinc-500'}`}
        >
          <ShoppingCart size={22} />
          {orderList.length > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-landcros rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('damaged')}
          className={`p-2 rounded-lg transition-all relative ${activeTab === 'damaged' ? 'text-white' : 'text-zinc-500'}`}
        >
          <AlertTriangle size={22} />
          {damagedList.length > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
        </button>
        <button 
          onClick={toggleAdmin}
          className={`p-2 rounded-lg transition-all ${isAdmin ? 'text-green-500' : 'text-zinc-500'}`}
        >
          {isAdmin ? <ShieldCheck size={22} /> : <Shield size={22} />}
        </button>
      </div>

      <main className={`flex-1 h-screen flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'pl-0' : 'pl-0 md:pl-20 lg:pl-24'} pb-16 md:pb-0`}>
        {/* Data Management Modal */}
        <AnimatePresence>
          {showDataModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowDataModal(false);
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#141414] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6 my-auto max-h-[95vh] flex flex-col"
              >
                <div className="flex items-center justify-between sticky top-0 bg-[#141414] z-20 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-landcros/10 rounded-xl flex items-center justify-center">
                      <Database size={20} className="text-landcros" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{TRANSLATIONS[reportLanguage].dataManagement}</h3>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        {reportLanguage === 'pt' ? 'ESPAÇO TOTAL UTILIZADO' : 'TOTAL STORAGE USED'}: {((storageSize + storageSizeHeavy) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDataModal(false)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all border border-white/10"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 pt-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Configurações (Metadata)</span>
                        <span className="text-[10px] text-zinc-300 font-mono">{(storageSize / 1024 / 1024).toFixed(2)} MB / 5.00 MB</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((storageSize / 5242880) * 100, 100)}%` }}
                          className={`h-full ${storageSize > 4000000 ? 'bg-red-500' : 'bg-blue-500'}`}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Fotos e Diagramas (IndexedDB)</span>
                        <span className="text-[10px] text-zinc-300 font-mono">{(storageSizeHeavy / 1024 / 1024).toFixed(2)} MB / 500+ MB</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((storageSizeHeavy / (500 * 1024 * 1024)) * 100, 100)}%` }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                      <p className="text-[8px] text-zinc-500 mt-1 italic">
                        {reportLanguage === 'pt' 
                          ? '* Fotos e diagramas são armazenados em um banco de dados de alta capacidade (IndexedDB).' 
                          : '* Photos and diagrams are stored in a high-capacity database (IndexedDB).'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={optimizeStorage}
                      disabled={isOptimizing}
                      className="w-full py-4 rounded-xl bg-landcros text-white font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-landcros/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isOptimizing ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                      {isOptimizing ? TRANSLATIONS[reportLanguage].optimizing : TRANSLATIONS[reportLanguage].optimizeData}
                    </button>

                    <button 
                      onClick={clearUnusedDiagrams}
                      className="w-full py-4 rounded-xl bg-white/5 text-zinc-300 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} className="text-red-500" />
                      {TRANSLATIONS[reportLanguage].clearUnusedDiagrams}
                    </button>

                    <button 
                      onClick={pruneOldData}
                      className="w-full py-4 rounded-xl bg-white/5 text-zinc-300 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Scissors size={14} className="text-blue-500" />
                      {TRANSLATIONS[reportLanguage].pruneOldData}
                    </button>

                    <button 
                      onClick={() => {
                        if (confirm(reportLanguage === 'pt' ? 'Deseja remover todas as fotos dos itens selecionados? Isso libera muito espaço, mas remove as evidências fotográficas.' : 'Do you want to remove all photos from selected items? This frees up a lot of space but removes photographic evidence.')) {
                          setSelectedItems(prev => prev.map(item => ({ ...item, photo: undefined, highlights: [] })));
                          alert(reportLanguage === 'pt' ? 'Fotos removidas.' : 'Photos removed.');
                          calculateStorageSize();
                        }
                      }}
                      className="w-full py-4 rounded-xl bg-white/5 text-zinc-300 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <CameraOff size={14} className="text-zinc-500" />
                      {reportLanguage === 'pt' ? 'REMOVER TODAS AS FOTOS' : 'REMOVE ALL PHOTOS'}
                    </button>

                    <button 
                      onClick={recoverFromCloud}
                      disabled={isSyncing}
                      className="w-full py-4 rounded-xl bg-blue-500/10 text-blue-500 font-bold uppercase text-[10px] tracking-widest hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2 border border-blue-500/20"
                    >
                      <CloudDownload size={14} />
                      {reportLanguage === 'pt' ? 'Recuperar da Nuvem' : 'Recover from Cloud'}
                    </button>

                    <button 
                      onClick={async () => {
                        if (confirm(reportLanguage === 'pt' ? 'Deseja limpar ABSOLUTAMENTE TUDO? Isso resetará o aplicativo.' : 'Do you want to clear ABSOLUTELY EVERYTHING? This will reset the app.')) {
                          try {
                            localStorage.clear();
                            // Manual fallback if clear() is blocked
                            for (let i = localStorage.length - 1; i >= 0; i--) {
                              const key = localStorage.key(i);
                              if (key) localStorage.removeItem(key);
                            }
                          } catch (e) {
                            console.error('Error clearing localStorage:', e);
                          }
                          await storageService.clearAll();
                          window.location.reload();
                        }
                      }}
                      className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-bold uppercase text-[10px] tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 border border-red-500/20"
                    >
                      <Trash2 size={14} />
                      {TRANSLATIONS[reportLanguage].clearAll}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-zinc-500 leading-relaxed">
                    {reportLanguage === 'pt' 
                      ? 'DICA: O armazenamento agora utiliza IndexedDB para fotos e diagramas, permitindo carregar muito mais arquivos sem atingir o limite de 5MB do navegador.'
                      : 'TIP: Storage now uses IndexedDB for photos and diagrams, allowing you to load many more files without hitting the 5MB browser limit.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Category Confirmation Modal */}
        <AnimatePresence>
          {showDeleteCategoryModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowDeleteCategoryModal(false);
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#141414] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-6 my-auto max-h-[95vh] flex flex-col"
              >
                <div className="flex items-center justify-between sticky top-0 bg-[#141414] z-20 pb-4 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                      <Trash2 size={20} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Excluir Sheet</h3>
                  </div>
                  <button 
                    onClick={() => setShowDeleteCategoryModal(false)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all border border-white/10"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-zinc-500 text-sm">Tem certeza que deseja excluir a categoria <strong>{categoryToDelete}</strong>? Todos os diagramas e peças vinculados a ela nesta máquina serão removidos.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleDeleteCategory(categoryToDelete)}
                    className="w-full py-4 rounded-xl bg-red-500 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    Confirmar Exclusão
                  </button>
                  <button 
                    onClick={() => setShowDeleteCategoryModal(false)}
                    className="w-full py-4 rounded-xl bg-white/5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Project Confirmation Modal */}
        <AnimatePresence>
          {showNewProjectModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowNewProjectModal(false);
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#141414] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-6 my-auto max-h-[95vh] flex flex-col"
              >
                <div className="flex items-center justify-between sticky top-0 bg-[#141414] z-20 pb-4 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                      <FilePlus size={20} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Nova Inspeção</h3>
                  </div>
                  <button 
                    onClick={() => setShowNewProjectModal(false)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all border border-white/10"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-zinc-500 text-sm">Deseja iniciar um novo trabalho? O backup da inspeção atual será baixado automaticamente.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={startNewProject}
                    className="w-full py-4 rounded-xl bg-red-500 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    Confirmar e Iniciar
                  </button>
                  <button 
                    onClick={() => setShowNewProjectModal(false)}
                    className="w-full py-4 rounded-xl bg-white/5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Highlight Editor Modal */}
        <AnimatePresence>
          {editingHighlightItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-start md:items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setEditingHighlightItem(null);
                  setSelectedElementId(null);
                  setHighlightZoom(1);
                }
              }}
            >
              <motion.div 
                ref={highlightModalRef}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#141414] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto custom-scrollbar space-y-6 relative my-auto flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-landcros/10 rounded-xl flex items-center justify-center">
                      <Target size={20} className="text-landcros" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter">{TRANSLATIONS[reportLanguage].highlightArea}</h3>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{TRANSLATIONS[reportLanguage].clickToHighlight}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingHighlightItem(null);
                      setSelectedElementId(null);
                      setHighlightZoom(1);
                      setHighlightPan({ x: 0, y: 0 });
                    }}
                    className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Tool Selector */}
                <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl">
                  {[
                    { id: 'circle', icon: Target, label: TRANSLATIONS[reportLanguage].circle },
                    { id: 'arrow', icon: ArrowUpRight, label: TRANSLATIONS[reportLanguage].arrow },
                    { id: 'box', icon: Square, label: TRANSLATIONS[reportLanguage].box },
                    { id: 'text', icon: Type, label: TRANSLATIONS[reportLanguage].text },
                    { id: 'callout', icon: Hash, label: TRANSLATIONS[reportLanguage].callout },
                    { id: 'crop', icon: Maximize2, label: TRANSLATIONS[reportLanguage].crop }
                  ].map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveHighlightTool(tool.id as any)}
                      className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                        activeHighlightTool === tool.id ? 'bg-landcros text-white shadow-lg shadow-landcros/20' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <tool.icon size={14} />
                      <span>{tool.label}</span>
                    </button>
                  ))}
                </div>

                <div className="max-w-2xl mx-auto relative">
                  <div 
                    ref={highlightEditorRef}
                    className="relative aspect-video bg-black rounded-2xl border border-white/5 overflow-hidden cursor-crosshair"
                  onMouseDown={(e) => {
                    if (e.button === 1 || (e.button === 0 && e.altKey)) {
                      setIsPanning(true);
                      setLastMousePos({ x: e.clientX, y: e.clientY });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (isPanning) {
                      const dx = e.clientX - lastMousePos.x;
                      const dy = e.clientY - lastMousePos.y;
                      setHighlightPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                      setLastMousePos({ x: e.clientX, y: e.clientY });
                    }
                  }}
                  onMouseUp={() => setIsPanning(false)}
                  onMouseLeave={() => setIsPanning(false)}
                  onClick={(e) => {
                    if (isPanning) return;
                    
                    // Allow clicks on the container itself or the motion wrapper
                    const target = e.target as HTMLElement;
                    const isContainer = target === e.currentTarget;
                    const isWrapper = target.classList.contains('highlight-container-wrapper');
                    const isImage = target.tagName === 'IMG';
                    
                    if (!isContainer && !isWrapper && !isImage) return;
                    
                    if (selectedElementId) {
                      setSelectedElementId(null);
                      return;
                    }

                    const rect = highlightEditorRef.current!.getBoundingClientRect();
                    
                    // Adjust for zoom and pan
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const relativeX = (mouseX - centerX - highlightPan.x) / highlightZoom + centerX;
                    const relativeY = (mouseY - centerY - highlightPan.y) / highlightZoom + centerY;
                    
                    const x = (relativeX / rect.width) * 100;
                    const y = (relativeY / rect.height) * 100;
                    
                    const currentHighlights = selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights || [];
                    
                    let initialText = '';
                    if (activeHighlightTool === 'text') {
                      initialText = reportLanguage === 'pt' ? 'Novo Texto' : 'New Text';
                    } else if (activeHighlightTool === 'callout') {
                      const callouts = currentHighlights.filter(h => h.type === 'callout');
                      const usedLetters = new Set(callouts.map(c => c.text));
                      let nextLetter = 'A';
                      for (let i = 0; i < 26; i++) {
                        const char = String.fromCharCode(65 + i);
                        if (!usedLetters.has(char)) {
                          nextLetter = char;
                          break;
                        }
                      }
                      initialText = nextLetter;
                    }

                    const newElement: HighlightElement = {
                      id: Math.random().toString(36).substr(2, 9),
                      type: activeHighlightTool,
                      x,
                      y,
                      radius: activeHighlightTool === 'crop' ? 20 : 8,
                      width: activeHighlightTool === 'crop' ? 40 : 15,
                      height: activeHighlightTool === 'crop' ? 40 : 15,
                      rotation: 0,
                      length: 15,
                      thickness: activeHighlightTool === 'crop' ? 2 : 2,
                      color: activeHighlightTool === 'crop' ? '#ffffff' : '#ef4444',
                      text: initialText,
                      fontSize: activeHighlightTool === 'callout' ? 24 : 16,
                      detailX: x + 15,
                      detailY: y,
                      detailRadius: 15
                    };

                    setSelectedItems(prev => prev.map(item => 
                      item.part.id === editingHighlightItem 
                        ? { ...item, highlights: [...(item.highlights || []), newElement] } 
                        : item
                    ));
                    setSelectedElementId(newElement.id);
                  }}
                >
                  <motion.div
                    animate={{ 
                      scale: highlightZoom,
                      x: highlightPan.x,
                      y: highlightPan.y
                    }}
                    transition={{ type: 'tween', duration: 0.2 }}
                    className="w-full h-full relative highlight-container-wrapper"
                  >
                    <img 
                      src={selectedItems.find(i => i.part.id === editingHighlightItem)?.photo} 
                      className="w-full h-full object-contain select-none"
                      alt="Editor"
                    />
                    {selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.map(element => (
                      <React.Fragment key={`${element.id}-${highlightDragKey}`}>
                        <motion.div 
                        key={`${element.id}-${highlightDragKey}`}
                        drag
                        dragMomentum={false}
                        onDragEnd={(_, info) => {
                          if (!highlightEditorRef.current) return;
                          const rect = highlightEditorRef.current.getBoundingClientRect();
                          
                          const centerX = rect.width / 2;
                          const centerY = rect.height / 2;
                          
                          const relativeX = (info.point.x - rect.left - centerX - highlightPan.x) / highlightZoom + centerX;
                          const relativeY = (info.point.y - rect.top - centerY - highlightPan.y) / highlightZoom + centerY;
                          
                          let x = (relativeX / rect.width) * 100;
                          let y = (relativeY / rect.height) * 100;

                          x = Math.max(0, Math.min(100, x));
                          y = Math.max(0, Math.min(100, y));

                          setSelectedItems(prev => prev.map(item => 
                            item.part.id === editingHighlightItem 
                              ? { 
                                  ...item, 
                                  highlights: item.highlights?.map(h => 
                                    h.id === element.id ? { ...h, x, y } : h
                                  ) 
                                } 
                              : item
                          ));
                          setHighlightDragKey(prev => prev + 1);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(element.id);
                        }}
                        className={`absolute cursor-move flex items-center justify-center ${selectedElementId === element.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black z-10' : 'z-0'}`}
                        style={{
                          left: `${element.x}%`,
                          top: `${element.y}%`,
                          transform: 'translate(-50%, -50%)',
                          width: (element.type === 'circle' || element.type === 'callout' || element.type === 'crop') ? `${(element.radius || 8) * 2}%` : element.type === 'box' ? `${element.width || 15}%` : element.type === 'text' ? 'auto' : '40px',
                          height: (element.type === 'circle' || element.type === 'callout' || element.type === 'crop') ? undefined : element.type === 'box' ? `${element.height || 15}%` : element.type === 'text' ? 'auto' : '40px',
                          aspectRatio: (element.type === 'circle' || element.type === 'callout' || element.type === 'crop') ? '1/1' : undefined
                        }}
                      >
                        {(element.type === 'circle' || element.type === 'callout' || element.type === 'crop') && (
                          <div 
                            className={`w-full h-full border-4 shadow-lg overflow-hidden flex items-center justify-center relative ${element.type === 'crop' ? 'border-dashed' : 'rounded-full'} ${element.type === 'callout' ? 'bg-white' : 'bg-white/5'}`}
                            style={{ borderColor: element.color || '#ef4444', borderWidth: `${element.thickness || 4}px`, borderRadius: element.type === 'crop' ? '50%' : '9999px' }}
                          >
                            {element.type === 'callout' && (
                              <>
                                <div className="absolute -top-1 -left-1 w-3 h-3 bg-black transform -rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
                                <span style={{ color: '#000000', fontSize: `${(element.fontSize || 24) * (highlightZoom > 1 ? 0.8 : 1)}px`, fontWeight: 'bold' }}>
                                  {element.text}
                                </span>
                              </>
                            )}
                            {element.type === 'circle' && element.photo && (
                              <img src={element.photo} className="w-full h-full object-cover" alt="Detail" />
                            )}
                            {element.type === 'circle' && !element.photo && (
                              <div className="w-1 h-1 rounded-full opacity-50" style={{ backgroundColor: element.color || '#ef4444' }} />
                            )}
                          </div>
                        )}
                        {element.type === 'arrow' && (
                          <div style={{ transform: `rotate(${element.rotation || 0}deg)` }} className="relative">
                            <svg 
                              width={(element.length || 15) * 5} 
                              height={(element.thickness || 2) * 15} 
                              viewBox={`0 0 ${(element.length || 15) * 5} ${(element.thickness || 2) * 15}`}
                              className="drop-shadow-lg"
                            >
                              <defs>
                                <marker
                                  id={`arrowhead-${element.id}`}
                                  markerWidth="10"
                                  markerHeight="7"
                                  refX="9"
                                  refY="3.5"
                                  orient="auto"
                                >
                                  <polygon points="0 0, 10 3.5, 0 7" fill={element.color || '#ef4444'} />
                                </marker>
                              </defs>
                              <line
                                x1="0"
                                y1={(element.thickness || 2) * 7.5}
                                x2={(element.length || 15) * 5 - 2}
                                y2={(element.thickness || 2) * 7.5}
                                stroke={element.color || '#ef4444'}
                                strokeWidth={element.thickness || 2}
                                markerEnd={`url(#arrowhead-${element.id})`}
                              />
                            </svg>
                          </div>
                        )}
                        {element.type === 'box' && (
                          <div 
                            className="w-full h-full border-4 shadow-lg bg-white/5"
                            style={{ borderColor: element.color || '#ef4444', borderWidth: `${element.thickness || 4}px` }}
                          />
                        )}
                        {element.type === 'text' && (
                          <div 
                            className="whitespace-nowrap font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-2 py-1"
                            style={{ 
                              color: element.color || '#ef4444', 
                              fontSize: `${(element.fontSize || 16) * 1.2}px` 
                            }}
                          >
                            {element.text || 'Texto'}
                          </div>
                        )}
                        
                        {selectedElementId === element.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItems(prev => prev.map(item => 
                                item.part.id === editingHighlightItem 
                                  ? { ...item, highlights: item.highlights?.filter(h => h.id !== element.id) } 
                                  : item
                              ));
                              setSelectedElementId(null);
                            }}
                            className="absolute -top-6 -right-6 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X size={10} strokeWidth={3} />
                          </button>
                        )}
                      </motion.div>

                      {element.type === 'callout' && element.photo && (
                        <motion.div
                          drag
                          dragMomentum={false}
                          onDragEnd={(_, info) => {
                            if (!highlightEditorRef.current) return;
                            const rect = highlightEditorRef.current.getBoundingClientRect();
                            const centerX = rect.width / 2;
                            const centerY = rect.height / 2;
                            const relativeX = (info.point.x - rect.left - centerX - highlightPan.x) / highlightZoom + centerX;
                            const relativeY = (info.point.y - rect.top - centerY - highlightPan.y) / highlightZoom + centerY;
                            let detailX = (relativeX / rect.width) * 100;
                            let detailY = (relativeY / rect.height) * 100;
                            detailX = Math.max(0, Math.min(100, detailX));
                            detailY = Math.max(0, Math.min(100, detailY));

                            setSelectedItems(prev => prev.map(item => 
                              item.part.id === editingHighlightItem 
                                ? { 
                                    ...item, 
                                    highlights: item.highlights?.map(h => 
                                      h.id === element.id ? { ...h, detailX, detailY } : h
                                    ) 
                                  } 
                                : item
                            ));
                            setHighlightDragKey(prev => prev + 1);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElementId(element.id);
                          }}
                          className={`absolute cursor-move flex items-center justify-center ${selectedElementId === element.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black z-10' : 'z-0'}`}
                          style={{
                            left: `${element.detailX || (element.x + 15)}%`,
                            top: `${element.detailY || element.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: `${(element.detailRadius || 15) * 2}%`,
                            aspectRatio: '1/1'
                          }}
                        >
                          <div 
                            className="w-full h-full border-4 shadow-lg rounded-full overflow-hidden relative bg-white"
                            style={{ borderColor: '#000000', borderWidth: '2px' }}
                          >
                            <img src={element.photo} className="w-full h-full object-cover" alt="Detail" />
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white px-1 flex items-center justify-center min-w-[20px] h-[20px] border border-black rounded-sm z-20">
                              <span className="text-black font-bold text-xs leading-none" style={{ marginTop: '-10px' }}>
                                {element.text}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </React.Fragment>
                  ))}
                  </motion.div>

                  {/* Zoom Controls Overlay */}
                  <div className="absolute top-4 right-4 z-30 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-xl">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setHighlightZoom(prev => Math.max(1, prev - 0.5));
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
                      title="Zoom Out"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-[10px] font-black text-white w-10 text-center tracking-tighter">{Math.round(highlightZoom * 100)}%</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setHighlightZoom(prev => Math.min(5, prev + 0.5));
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
                      title="Zoom In"
                    >
                      <Plus size={14} />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setHighlightZoom(1);
                        setHighlightPan({ x: 0, y: 0 });
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg text-landcros transition-colors"
                      title="Resetar Zoom"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

                {/* Floating Controls Overlay - Moved outside the image container to allow dragging to side margins */}
                <AnimatePresence>
                  {selectedElementId && (
                    <motion.div
                      drag
                      dragMomentum={false}
                      dragConstraints={highlightModalRef}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute bottom-24 right-10 z-50 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-64 max-h-[80%] overflow-y-auto custom-scrollbar cursor-default"
                      style={{ position: 'absolute' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-3 cursor-move select-none active:cursor-grabbing">
                        <div className="flex items-center gap-2">
                          <Settings size={12} className="text-landcros" />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">Ajustes (Arraste para mover)</span>
                        </div>
                        <button 
                          onClick={() => setSelectedElementId(null)}
                          className="p-1 hover:bg-white/10 rounded-lg text-zinc-500"
                        >
                          <X size={12} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Sliders Section */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                                {(() => {
                                  const el = selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId);
                                  if (el?.type === 'arrow') return TRANSLATIONS[reportLanguage].arrowLength;
                                  if (el?.type === 'text' || el?.type === 'callout') return 'Tamanho Fonte';
                                  return 'Tamanho';
                                })()}
                              </span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="100" 
                              step="1"
                              value={(() => {
                                const el = selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId);
                                if (!el) return 0;
                                if (el.type === 'circle' || el.type === 'callout' || el.type === 'crop') return el.radius || 8;
                                if (el.type === 'arrow') return el.length || 15;
                                if (el.type === 'box') return el.width || 15;
                                if (el.type === 'text') return el.fontSize || 16;
                                return 0;
                              })()}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setSelectedItems(prev => prev.map(item => 
                                  item.part.id === editingHighlightItem 
                                    ? { 
                                        ...item, 
                                        highlights: item.highlights?.map(h => {
                                          if (h.id !== selectedElementId) return h;
                                          if (h.type === 'circle' || h.type === 'callout' || h.type === 'crop') return { ...h, radius: val };
                                          if (h.type === 'arrow') return { ...h, length: val };
                                          if (h.type === 'box') return { ...h, width: val, height: val };
                                          if (h.type === 'text') return { ...h, fontSize: val };
                                          return h;
                                        }) 
                                      } 
                                    : item
                                ));
                              }}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                              {(() => {
                                const el = selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId);
                                if (el?.type === 'arrow') return 'Rotação';
                                return 'Espessura';
                              })()}
                            </span>
                            <input 
                              type="range" 
                              min="0" 
                              max={selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId)?.type === 'arrow' ? "360" : "20"} 
                              step="1"
                              value={(() => {
                                const el = selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId);
                                if (!el) return 0;
                                if (el.type === 'arrow') return el.rotation || 0;
                                return el.thickness || 4;
                              })()}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setSelectedItems(prev => prev.map(item => 
                                  item.part.id === editingHighlightItem 
                                    ? { 
                                        ...item, 
                                        highlights: item.highlights?.map(h => {
                                          if (h.id !== selectedElementId) return h;
                                          if (h.type === 'arrow') return { ...h, rotation: val };
                                          return { ...h, thickness: val };
                                        }) 
                                      } 
                                    : item
                                ));
                              }}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                            />
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          {(selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId)?.type === 'text' || 
                            selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId)?.type === 'callout') && (
                            <div className="space-y-1.5">
                              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Texto</span>
                              <input 
                                type="text"
                                value={selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId)?.text || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSelectedItems(prev => prev.map(item => 
                                    item.part.id === editingHighlightItem 
                                      ? { 
                                          ...item, 
                                          highlights: item.highlights?.map(h => h.id === selectedElementId ? { ...h, text: val } : h) 
                                        } 
                                      : item
                                  ));
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none focus:border-landcros"
                                placeholder="Digite..."
                              />
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Cor</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#ffffff', '#000000'].map(color => (
                                <button
                                  key={color}
                                  onClick={() => {
                                    setSelectedItems(prev => prev.map(item => 
                                      item.part.id === editingHighlightItem 
                                        ? { 
                                            ...item, 
                                            highlights: item.highlights?.map(h => h.id === selectedElementId ? { ...h, color } : h) 
                                          } 
                                        : item
                                    ));
                                  }}
                                  className={`w-4 h-4 rounded-full border transition-all ${
                                    (selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId)?.color || '#ef4444') === color 
                                      ? 'border-white scale-110' 
                                      : 'border-transparent opacity-50 hover:opacity-100'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions Section */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          {(selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId)?.type === 'circle' || 
                            selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId)?.type === 'crop') && (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Recorte</span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={async () => {
                                      const item = selectedItems.find(i => String(i.part.id) === String(editingHighlightItem));
                                      const el = item?.highlights?.find(h => String(h.id) === String(selectedElementId));
                                      if (!item?.photo || !el) {
                                        console.warn("Missing photo or element for crop", { item, el });
                                        return;
                                      }

                                      const img = new Image();
                                      img.crossOrigin = "anonymous";
                                      
                                      const loadImage = () => new Promise((resolve, reject) => {
                                        img.onload = resolve;
                                        img.onerror = reject;
                                        img.src = item.photo!;
                                      });

                                      try {
                                        await loadImage();
                                        const canvas = document.createElement('canvas');
                                        const size = 400;
                                        canvas.width = size;
                                        canvas.height = size;
                                        const ctx = canvas.getContext('2d');
                                        if (ctx) {
                                          const imgAspect = img.width / img.height;
                                          const containerAspect = 16 / 9;
                                          let actualX, actualY, actualRadius;
                                          if (imgAspect > containerAspect) {
                                            const imgHeightInContainerUnits = 100 / imgAspect;
                                            const containerHeightInContainerUnits = 100 / containerAspect;
                                            const yOffset = (containerHeightInContainerUnits - imgHeightInContainerUnits) / 2;
                                            const elYInUnits = (el.y / 100) * containerHeightInContainerUnits;
                                            actualX = (el.x / 100) * img.width;
                                            actualY = ((elYInUnits - yOffset) / imgHeightInContainerUnits) * img.height;
                                            actualRadius = (el.radius / 100) * img.width;
                                          } else {
                                            const imgWidthInContainerUnits = (100 / containerAspect) * imgAspect;
                                            const xOffset = (100 - imgWidthInContainerUnits) / 2;
                                            actualX = ((el.x / 100 * 100 - xOffset) / imgWidthInContainerUnits) * img.width;
                                            actualY = (el.y / 100) * img.height;
                                            actualRadius = (el.radius / imgWidthInContainerUnits) * img.width;
                                          }
                                          actualRadius = Math.max(10, actualRadius);
                                          let sx = actualX - actualRadius;
                                          let sy = actualY - actualRadius;
                                          let sw = actualRadius * 2;
                                          let sh = actualRadius * 2;
                                          if (sx < 0) { sw += sx; sx = 0; }
                                          if (sy < 0) { sh += sy; sy = 0; }
                                          if (sx + sw > img.width) sw = img.width - sx;
                                          if (sy + sh > img.height) sh = img.height - sy;
                                          if (sw > 0 && sh > 0) {
                                            ctx.clearRect(0, 0, size, size);
                                            
                                            // Create circular clip
                                            ctx.beginPath();
                                            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                                            ctx.clip();

                                            const dx = sx > (actualX - actualRadius) ? (sx - (actualX - actualRadius)) * (size / (actualRadius * 2)) : 0;
                                            const dy = sy > (actualY - actualRadius) ? (sy - (actualY - actualRadius)) * (size / (actualRadius * 2)) : 0;
                                            const dw = sw * (size / (actualRadius * 2));
                                            const dh = sh * (size / (actualRadius * 2));
                                            ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
                                            
                                            const cropped = canvas.toDataURL('image/png');
                                            console.log("Crop successful, updating state...");
                                            
                                            if (el.type === 'crop') {
                                              // Update diagramCrop for the item
                                              setSelectedItems(prev => prev.map(i => 
                                                i.part.id === editingHighlightItem 
                                                  ? { ...i, diagramCrop: cropped } 
                                                  : i
                                              ));
                                            } else {
                                              // Update highlight photo
                                              setSelectedItems(prev => prev.map(i => 
                                                i.part.id === editingHighlightItem 
                                                  ? { ...i, highlights: i.highlights?.map(h => h.id === selectedElementId ? { ...h, photo: cropped } : h) } 
                                                  : i
                                              ));
                                            }
                                          }
                                        }
                                      } catch (err) {
                                        console.error("Error cropping image:", err);
                                      }
                                    }}
                                    className="px-1.5 py-0.5 bg-landcros text-white rounded text-[7px] font-black uppercase tracking-widest"
                                  >
                                    {selectedItems.find(i => i.part.id === editingHighlightItem)?.highlights?.find(h => h.id === selectedElementId)?.type === 'crop' ? 'Definir Recorte Principal' : 'Recortar'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedItems(prev => prev.map(item => 
                                        item.part.id === editingHighlightItem 
                                          ? { ...item, highlights: item.highlights?.map(h => h.id === selectedElementId ? { ...h, photo: undefined } : h) } 
                                          : item
                                      ));
                                    }}
                                    className="px-1.5 py-0.5 bg-red-500/20 text-red-500 rounded text-[7px] font-black uppercase tracking-widest"
                                  >
                                    Limpar
                                  </button>
                                </div>
                              </div>
                              <div className="relative aspect-square w-12 bg-zinc-900 rounded-full overflow-hidden border border-white/10 mx-auto flex items-center justify-center">
                                {(() => {
                                  const h = selectedItems.find(i => String(i.part.id) === String(editingHighlightItem))?.highlights?.find(h => String(h.id) === String(selectedElementId));
                                  if (h?.photo) {
                                    return <img src={h.photo} alt="Crop" className="w-full h-full object-cover" />;
                                  }
                                  return (
                                    <div 
                                      className="absolute inset-0 pointer-events-none opacity-50"
                                      style={{
                                        backgroundImage: `url(${selectedItems.find(i => i.part.id === editingHighlightItem)?.photo})`,
                                        backgroundSize: `${100 / (h?.radius || 8) * 50}%`,
                                        backgroundPosition: `${h?.x}% ${h?.y}%`,
                                        backgroundRepeat: 'no-repeat'
                                      }}
                                    />
                                  );
                                })()}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => setSelectedElementId(null)}
                              className="w-full py-2 bg-landcros text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-landcros/20"
                            >
                              Concluir Ajuste
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItems(prev => prev.map(item => 
                                  item.part.id === editingHighlightItem 
                                    ? { ...item, highlights: item.highlights?.filter(h => h.id !== selectedElementId) } 
                                    : item
                                ));
                                setSelectedElementId(null);
                              }}
                              className="w-full py-1.5 bg-red-500/10 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-500/20"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => {
                      setSelectedItems(prev => prev.map(item => 
                        item.part.id === editingHighlightItem ? { ...item, highlights: [] } : item
                      ));
                      setSelectedElementId(null);
                    }}
                    className="flex-1 py-4 rounded-xl bg-white/5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                    {TRANSLATIONS[reportLanguage].removeHighlight}
                  </button>
                  <button 
                    onClick={() => {
                      setEditingHighlightItem(null);
                      setSelectedElementId(null);
                    }}
                    className="flex-1 py-4 rounded-xl bg-landcros text-white font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-landcros/20"
                  >
                    {TRANSLATIONS[reportLanguage].confirm}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rename Category Modal */}
        <AnimatePresence>
          {showRenameCategoryModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowRenameCategoryModal(false);
              }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#1a1a1a] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md my-auto max-h-[95vh] flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-landcros/20 rounded-2xl flex items-center justify-center text-landcros">
                    <Edit3 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Renomear Categoria</h3>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-1">Personalize o nome do sistema</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Nome Atual</label>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-zinc-400 text-sm italic">
                      {categoryToRename}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Novo Nome</label>
                    <input 
                      type="text"
                      value={tempCategoryName}
                      onChange={(e) => setTempCategoryName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold focus:outline-none focus:border-landcros/50 transition-all"
                      placeholder="Digite o novo nome..."
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (tempCategoryName.trim()) {
                            setCategoryRenames(prev => ({ ...prev, [categoryToRename]: tempCategoryName.trim() }));
                            setShowRenameCategoryModal(false);
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button 
                    onClick={() => setShowRenameCategoryModal(false)}
                    className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-zinc-400 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      if (tempCategoryName.trim()) {
                        setCategoryRenames(prev => ({ ...prev, [categoryToRename]: tempCategoryName.trim() }));
                        setShowRenameCategoryModal(false);
                      }
                    }}
                    className="flex-1 px-6 py-4 rounded-2xl bg-landcros text-white font-bold hover:bg-landcros/90 transition-all shadow-[0_0_20px_rgba(242,125,38,0.3)] uppercase tracking-widest text-xs"
                  >
                    Salvar Nome
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Splash Settings Modal */}
        <AnimatePresence>
          {showSplashSettings && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowSplashSettings(false);
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#1A1A1A] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-landcros/20 rounded-xl flex items-center justify-center">
                      <ImageIcon className="text-landcros" size={24} />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">Splash Screen Image</h3>
                  </div>
                  <button 
                    onClick={() => setShowSplashSettings(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-500 uppercase tracking-widest px-1">Upload from Computer</label>
                      <button 
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                setSplashScreenImage(base64);
                                safeSetItem('splashScreenImage', base64);
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        className="w-full bg-landcros/10 border-2 border-dashed border-landcros/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-landcros/20 hover:border-landcros transition-all group"
                      >
                        <div className="w-12 h-12 bg-landcros/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="text-landcros" size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-black text-sm uppercase tracking-tight">Select Image File</p>
                          <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1">PNG, JPG or WEBP (Max 2MB recommended)</p>
                        </div>
                      </button>
                    </div>

                    <div className="relative flex items-center gap-4 py-2">
                      <div className="h-[1px] flex-1 bg-white/5" />
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">OR</span>
                      <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-500 uppercase tracking-widest px-1">Image URL</label>
                      <div className="relative group">
                        <input 
                          type="text"
                          value={splashScreenImage.startsWith('data:') ? 'Local Image Uploaded' : splashScreenImage}
                          onChange={(e) => {
                            setSplashScreenImage(e.target.value);
                            safeSetItem('splashScreenImage', e.target.value);
                          }}
                          disabled={splashScreenImage.startsWith('data:')}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-landcros focus:ring-4 focus:ring-landcros/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="https://images.unsplash.com/..."
                        />
                        {splashScreenImage.startsWith('data:') && (
                          <button 
                            onClick={() => {
                              setSplashScreenImage('');
                              localStorage.removeItem('splashScreenImage');
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-landcros font-black text-[10px] uppercase hover:underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-tighter">Preview</p>
                    <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
                      <img 
                        src={splashScreenImage} 
                        alt="Splash Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583483425010-c566431a7710?q=80&w=2070&auto=format&fit=crop';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 flex gap-3">
                  <button 
                    onClick={() => {
                      const defaultUrl = 'https://images.unsplash.com/photo-1535916707207-35f97e715e1c?q=80&w=2070&auto=format&fit=crop';
                      setSplashScreenImage(defaultUrl);
                      safeSetItem('splashScreenImage', defaultUrl);
                    }}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 uppercase tracking-tighter"
                  >
                    Reset Default
                  </button>
                  <button 
                    onClick={() => setShowSplashSettings(false)}
                    className="flex-1 py-4 bg-landcros hover:bg-landcros/90 text-white font-black rounded-2xl shadow-lg shadow-landcros/20 transition-all uppercase tracking-tighter"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIN Modal */}
        <AnimatePresence>
          {showPinModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowPinModal(false);
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#141414] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-6 my-auto max-h-[95vh] flex flex-col"
              >
                <div className="flex items-center justify-between sticky top-0 bg-[#141414] z-20 pb-4 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-landcros/10 rounded-xl flex items-center justify-center">
                      <Shield size={20} className="text-landcros" />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{TRANSLATIONS[reportLanguage].restrictedAccess}</h3>
                  </div>
                  <button 
                    onClick={() => setShowPinModal(false)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all border border-white/10"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-zinc-500 text-sm">{TRANSLATIONS[reportLanguage].enterPin}</p>
                </div>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <input 
                    autoFocus
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-2xl font-mono tracking-[0.5em] text-landcros outline-none focus:border-landcros transition-all"
                    placeholder="••••"
                  />
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowPinModal(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                    >
                      {TRANSLATIONS[reportLanguage].cancel}
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-landcros text-white font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-landcros/20"
                    >
                      {TRANSLATIONS[reportLanguage].enter}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'report' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-mining">
            <div className="max-w-4xl mx-auto space-y-8">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <span className="text-[9px] font-mono text-landcros font-bold uppercase tracking-widest">{TRANSLATIONS[reportLanguage].technicalReport}</span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mt-1 uppercase italic">{TRANSLATIONS[reportLanguage].machineInfo}</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
                    <button 
                      onClick={() => {
                        setReportLanguage('pt');
                        safeSetItem('reportLanguage', 'pt');
                      }}
                      className={`flex-1 sm:px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${reportLanguage === 'pt' ? 'bg-landcros text-white shadow-lg shadow-landcros/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      PT
                    </button>
                    <button 
                      onClick={() => {
                        setReportLanguage('en');
                        safeSetItem('reportLanguage', 'en');
                      }}
                      className={`flex-1 sm:px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${reportLanguage === 'en' ? 'bg-landcros text-white shadow-lg shadow-landcros/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      EN
                    </button>
                  </div>
                  <button 
                    onClick={exportTechnicalReportPDF}
                    className="flex items-center justify-center gap-2 bg-landcros hover:bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-landcros/20 w-full sm:w-auto"
                  >
                    <Download size={18} />
                    {TRANSLATIONS[reportLanguage].generatePDF}
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Info size={20} className="text-landcros" />
                    {TRANSLATIONS[reportLanguage].machineData}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].selectMachine}</label>
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={addMachine}
                              className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-all"
                              title={TRANSLATIONS[reportLanguage].addMachine}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <select 
                            value={inspectionInfo.tag}
                            onChange={(e) => handleMachineChange(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="" className="bg-[#141414]">{TRANSLATIONS[reportLanguage].selectMachinePlaceholder}</option>
                            {machines
                              .sort((a, b) => a.tag.localeCompare(b.tag))
                              .map(m => (
                                <option key={m.tag} value={m.tag} className="bg-[#141414]">
                                  {m.tag}
                                </option>
                              ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                            <MoreHorizontal size={16} />
                          </div>
                        </div>
                        {isAdmin && inspectionInfo.tag && (
                          <div className="flex gap-1">
                            <button 
                              onClick={() => deleteMachine(inspectionInfo.tag)}
                              className="p-3 bg-white/5 border border-white/10 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
                              title={TRANSLATIONS[reportLanguage].deleteMachine}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].tag.replace(':', '')}</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.tag}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, tag: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].model.replace(':', '')}</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.model}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].sn.replace(':', '')} (SN)</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.sn}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, sn: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].delivery.replace(':', '')}</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.delivery}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, delivery: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>
                  </div>

                  {isAdmin && inspectionInfo.tag && (
                    <button 
                      onClick={updateMachine}
                      className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={14} />
                      {reportLanguage === 'pt' ? 'Salvar Alterações na Máquina' : 'Save Machine Changes'}
                    </button>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].customer.replace(':', '')}</label>
                    <input 
                      type="text" 
                      value={inspectionInfo.customer}
                      onChange={(e) => setInspectionInfo(prev => ({ ...prev, customer: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].inspectionDescription}</label>
                      <button 
                        onClick={() => setInspectionInfo(prev => ({ ...prev, description: TRANSLATIONS[reportLanguage].defaultDescription }))}
                        className="text-[9px] font-bold uppercase tracking-widest text-landcros hover:text-orange-400 flex items-center gap-1"
                      >
                        <RotateCcw size={10} />
                        Reset
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={inspectionInfo.description}
                      onChange={(e) => setInspectionInfo(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-xs font-bold text-zinc-300">{TRANSLATIONS[reportLanguage].machineDownQuestion}</span>
                    <button 
                      onClick={() => setInspectionInfo(prev => ({ ...prev, machineDown: !prev.machineDown }))}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        inspectionInfo.machineDown ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-zinc-500'
                      }`}
                    >
                      {inspectionInfo.machineDown ? TRANSLATIONS[reportLanguage].yes : TRANSLATIONS[reportLanguage].no}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-8 rounded-3xl space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck size={20} className="text-landcros" />
                      {TRANSLATIONS[reportLanguage].inspectorData}
                    </h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].inspectorName.replace(':', '')}</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.inspectorName}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, inspectorName: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].hourMeter.replace(':', '')}</label>
                        <input 
                          type="text" 
                          value={inspectionInfo.hourMeter}
                          onChange={(e) => setInspectionInfo(prev => ({ ...prev, hourMeter: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].date.replace(':', '')}</label>
                        <input 
                          type="date" 
                          value={inspectionInfo.date}
                          onChange={(e) => setInspectionInfo(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-8 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white">{TRANSLATIONS[reportLanguage].reportConclusion}</h3>
                      <button 
                        onClick={() => setInspectionInfo(prev => ({ 
                          ...prev, 
                          conclusion: TRANSLATIONS[reportLanguage].defaultConclusion
                            .replace('{model}', prev.model)
                            .replace('{sn}', prev.sn)
                            .replace('{hourMeter}', prev.hourMeter) 
                        }))}
                        className="text-[9px] font-bold uppercase tracking-widest text-landcros hover:text-orange-400 flex items-center gap-1"
                      >
                        <RotateCcw size={10} />
                        Reset
                      </button>
                    </div>
                    <textarea 
                      value={inspectionInfo.conclusion}
                      onChange={(e) => setInspectionInfo(prev => ({ ...prev, conclusion: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-landcros outline-none transition-all min-h-[150px] resize-none"
                      placeholder={TRANSLATIONS[reportLanguage].conclusionPlaceholder}
                    />
                  </div>
                </div>

                {/* Parts Table in Report Tab */}
                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Package size={20} className="text-landcros" />
                    {TRANSLATIONS[reportLanguage].partsTable}
                  </h3>
                  
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-3 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].item}</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].partName}</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].partNumber}</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].qty}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedItems.map(({ part, type, quantity }) => (
                          <tr key={`${part.id}-${type}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 text-xs font-mono text-zinc-400">{part.itemNumber}</td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">{part.description}</span>
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">{part.category}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs font-mono text-landcros">{part.partNumber}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setQuantity(part.id, type, (quantity || 1) - 1)}
                                  className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-all border border-white/5"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-xs font-black text-white w-6 text-center">{quantity || 1}</span>
                                <button 
                                  onClick={() => setQuantity(part.id, type, (quantity || 1) + 1)}
                                  className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-all border border-white/5"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {selectedItems.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-zinc-600 italic text-sm">
                              {TRANSLATIONS[reportLanguage].noItems}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-mining">
            <div className="max-w-2xl mx-auto space-y-8">
              <header>
                <span className="text-[9px] font-mono text-landcros font-bold uppercase tracking-widest">Gerenciador de Inspeções</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mt-1 uppercase italic">Backup & Projetos</h2>
              </header>

              <div className="grid gap-6">
                {/* Current Project Info */}
                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nome da Inspeção Atual</label>
                    <input 
                      type="text" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold focus:border-landcros outline-none transition-all"
                      placeholder="Ex: Escavadeira ZX210 - Cliente X"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={exportProject}
                      className="flex-1 flex items-center justify-center gap-2 bg-landcros hover:bg-landcros/80 text-white p-4 rounded-xl font-bold transition-all shadow-lg shadow-landcros/20"
                    >
                      <Save size={18} />
                      Baixar Backup (.landcros)
                    </button>
                    <label className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl font-bold transition-all border border-white/10 cursor-pointer">
                      <Upload size={18} />
                      Importar Backup
                      <input type="file" accept=".landcros" onChange={importProject} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Configurações de Acesso</h3>
                  <p className="text-zinc-500 text-xs mb-4">Altere a senha de desenvolvedor para proteger suas configurações.</p>
                  <div className="flex gap-3">
                    <input 
                      type="password" 
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono focus:border-landcros outline-none transition-all"
                      placeholder="Nova Senha"
                    />
                    <button 
                      onClick={() => alert('Senha salva com sucesso!')}
                      className="bg-white/5 hover:bg-white/10 text-white px-6 rounded-xl font-bold border border-white/10 transition-all"
                    >
                      Salvar
                    </button>
                  </div>
                </div>

                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Adicionar Novas Sheets (Fotos)</h3>
                  <p className="text-zinc-500 text-xs mb-4">Crie novas categorias para carregar mais fotos de diagramas ou manuais.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block text-zinc-400">Adicionar Nova Sheet (Máquina)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={newSheetName}
                            onChange={(e) => setNewSheetName(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all text-sm"
                            placeholder="Nome da Sheet"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddCategory(newSheetName);
                              }
                            }}
                          />
                          <button 
                            onClick={() => handleAddCategory(newSheetName)}
                            className="bg-landcros text-white px-4 rounded-xl font-bold hover:bg-orange-600 transition-all"
                            title="Adicionar uma por uma"
                          >
                            <Plus size={18} />
                          </button>
                          <button 
                            onClick={() => setIsPasteCategoriesModalOpen(true)}
                            className="bg-white/5 text-white px-4 rounded-xl font-bold hover:bg-white/10 border border-white/10 transition-all"
                            title="Colar lista de sheets"
                          >
                            <List size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block text-zinc-400">Adicionar várias fotos de uma vez</label>
                        <label className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl font-bold transition-all border border-white/10 cursor-pointer text-sm h-[46px]">
                          <Upload size={18} />
                          Selecionar Múltiplas Fotos
                          <input type="file" multiple accept="image/*" onChange={handleBulkImageUpload} className="hidden" />
                        </label>
                        <p className="text-[9px] text-zinc-600 italic">Cada foto criará uma nova aba automaticamente.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block text-zinc-400">Gerenciar Lista de Máquinas</label>
                        <button 
                          onClick={() => setIsSheetListModalOpen(true)}
                          className="text-[9px] text-landcros font-bold uppercase tracking-widest hover:underline"
                        >
                          Ver Todas
                        </button>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                          {allCategories.map(cat => {
                            const isSelected = selectedCategories.includes(cat);
                            const isCustom = customCategories.includes(cat);
                            return (
                              <div key={cat} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                <div className="flex flex-col">
                                  <span className={`text-sm font-bold ${!isSelected ? 'text-zinc-600 line-through' : 'text-white'}`}>
                                    {categoryRenames[cat] || cat}
                                  </span>
                                  {isCustom && <span className="text-[8px] text-landcros uppercase font-black">Customizada</span>}
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => {
                                      setCategoryToRename(cat);
                                      setTempCategoryName(categoryRenames[cat] || cat);
                                      setShowRenameCategoryModal(true);
                                    }}
                                    className="p-1.5 text-zinc-400 hover:text-landcros hover:bg-white/10 rounded-lg transition-colors"
                                    title="Renomear Categoria"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedCategories(prev => prev.filter(c => c !== cat));
                                      } else {
                                        setSelectedCategories(prev => [...prev, cat]);
                                      }
                                    }}
                                    className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'text-green-500 hover:bg-green-500/10' : 'text-zinc-400 hover:bg-white/10'}`}
                                    title={isSelected ? "Ocultar Máquina" : "Mostrar Máquina"}
                                  >
                                    {isSelected ? <Eye size={14} /> : <EyeOff size={14} />}
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setCategoryToDelete(cat);
                                      setShowDeleteCategoryModal(true);
                                    }}
                                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Excluir Categoria"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                  {isCustom && (
                                    <button 
                                      onClick={() => {
                                        if (confirm(`Tem certeza que deseja excluir a máquina "${cat}"? Todos os dados vinculados serão perdidos.`)) {
                                          setCustomCategories(prev => prev.filter(c => c !== cat));
                                          setSelectedCategories(prev => prev.filter(c => c !== cat));
                                        }
                                      }}
                                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                      title="Excluir Permanentemente"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sync Status & Force Sync */}
                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Sincronização Cloud</h3>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      syncStatus === 'connected' ? 'bg-green-500/10 text-green-500' : 
                      syncStatus === 'connecting' ? 'bg-yellow-500/10 text-yellow-500' : 
                      syncStatus === 'unconfigured' ? 'bg-zinc-500/10 text-zinc-400' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        syncStatus === 'connected' ? 'bg-green-500' : 
                        syncStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                        syncStatus === 'unconfigured' ? 'bg-zinc-500' :
                        'bg-red-500'
                      }`} />
                      {syncStatus === 'unconfigured' ? 'NÃO CONFIGURADO' : syncStatus}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <p className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Fotos na Nuvem</p>
                      <p className="text-xl font-mono text-white">{Object.keys(diagramImages).filter(k => diagramImages[k]).length}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <p className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Posições na Nuvem</p>
                      <p className="text-xl font-mono text-white">{Object.values(customPositions).reduce((acc: number, curr) => acc + Object.keys(curr).length, 0)}</p>
                    </div>
                  </div>

                  {isSyncing && (
                    <div className="mb-6 space-y-2">
                      <div className="flex justify-between text-[8px] font-bold uppercase text-landcros">
                        <span>Sincronizando Dados...</span>
                        <span>{Math.round((syncProgress.current / syncProgress.total) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-landcros transition-all duration-300"
                          style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-[7px] text-zinc-500 text-center uppercase tracking-widest">Enviando item {syncProgress.current} de {syncProgress.total}</p>
                    </div>
                  )}

                  {/* Sync Log */}
                  <div className="mb-6 bg-black/40 rounded-xl border border-white/5 p-3">
                    <p className="text-[8px] text-zinc-500 uppercase font-bold mb-2">Log de Sincronização</p>
                    <div className="h-24 overflow-y-auto space-y-1 font-mono text-[7px]">
                      {syncLog.length === 0 ? (
                        <p className="text-zinc-600 italic">Nenhuma atividade recente...</p>
                      ) : (
                        syncLog.map((log, i) => (
                          <p key={i} className={log.includes('ERRO') || log.includes('FALHA') ? 'text-red-400' : 'text-zinc-400'}>
                            {log}
                          </p>
                        ))
                      )}
                    </div>
                  </div>

                  {syncError && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6">
                      <p className="text-red-500 text-[10px] font-bold uppercase mb-1">Erro de Conexão:</p>
                      <p className="text-zinc-400 text-[9px] leading-tight">{syncError}</p>
                      {syncError.includes('relation "public.app_state" does not exist') && (
                        <div className="mt-3 p-2 bg-black/40 rounded border border-red-500/20">
                          <p className="text-white text-[9px] font-bold mb-1">A TABELA NÃO EXISTE NO SUPABASE!</p>
                          <p className="text-zinc-500 text-[8px]">Você precisa criar a tabela "app_state" no SQL Editor do Supabase para que a sincronização funcione.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {syncStatus === 'unconfigured' ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-6">
                      <div className="flex gap-3 mb-3">
                        <ShieldAlert className="text-yellow-500 shrink-0" size={20} />
                        <p className="text-yellow-500 text-[10px] font-bold uppercase">Atenção: Vercel não conectada</p>
                      </div>
                      <p className="text-zinc-400 text-[10px] leading-relaxed mb-4">
                        Para que as fotos apareçam no seu app da Vercel, você precisa configurar as "Environment Variables" no painel da Vercel com os seguintes nomes:
                      </p>
                      <div className="space-y-2 font-mono text-[9px]">
                        <div className="bg-black/40 p-2 rounded border border-white/5 flex justify-between items-center">
                          <span className="text-zinc-500 text-[8px]">VITE_SUPABASE_URL</span>
                          <button onClick={() => {
                            navigator.clipboard.writeText(import.meta.env.VITE_SUPABASE_URL || '');
                            alert('Copiado!');
                          }} className="text-landcros hover:text-white transition-colors">COPIAR</button>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-white/5 flex justify-between items-center">
                          <span className="text-zinc-500 text-[8px]">VITE_SUPABASE_ANON_KEY</span>
                          <button onClick={() => {
                            navigator.clipboard.writeText(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
                            alert('Copiado!');
                          }} className="text-landcros hover:text-white transition-colors">COPIAR</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-xs mb-6">Se as imagens ou posições não aparecerem em outros dispositivos, use o botão abaixo para forçar o envio de todos os dados atuais para a nuvem.</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        if (syncStatus === 'unconfigured') {
                          alert('Erro: Supabase não configurado na Vercel. Siga as instruções acima.');
                          return;
                        }
                        broadcastUpdate({
                          diagramImages,
                          imgConfigs,
                          customPositions,
                          selectedItems,
                          clonedParts,
                          imgFilters,
                          inspectionInfo,
                          projectName,
                          hotspotSize,
                          customCategories,
                          categoryRenames,
                          leaderLines
                        });
                      }}
                      disabled={isSyncing}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold transition-all border ${
                        syncStatus === 'unconfigured' || isSyncing
                          ? 'bg-zinc-500/5 text-zinc-600 border-zinc-500/10 cursor-not-allowed' 
                          : 'bg-landcros/10 hover:bg-landcros/20 text-landcros border-landcros/20'
                      }`}
                    >
                      <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                      {isSyncing ? 'Sincronizando...' : 'Forçar Sincronização'}
                    </button>

                    <button 
                      onClick={clearCloudData}
                      className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 p-4 rounded-xl font-bold transition-all border border-red-500/20"
                    >
                      <Trash2 size={18} />
                      Limpar Nuvem
                    </button>
                  </div>
                </div>

                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Finalizar Configuração</h3>
                  <p className="text-zinc-500 text-xs mb-6">Bloqueia o Modo Desenvolvedor e volta para a tela de inspeção para uso da equipe.</p>
                  <button 
                    onClick={toggleAdmin}
                    className="w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 p-4 rounded-xl font-bold transition-all border border-green-500/20"
                  >
                    <ShieldCheck size={18} />
                    Bloquear e Sair do Modo Desenvolvedor
                  </button>
                </div>

                {/* New Project */}
                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Iniciar Nova Inspeção</h3>
                  <p className="text-zinc-500 text-xs mb-6">Limpa todos os dados atuais e bloqueia o Modo Desenvolvedor para uma nova inspeção segura.</p>
                  <button 
                    onClick={() => setShowNewProjectModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 p-4 rounded-xl font-bold transition-all border border-white/10"
                  >
                    <FilePlus size={18} />
                    Criar Nova Inspeção em Branco
                  </button>
                </div>

                {/* Clear Cache */}
                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Limpar Cache do Navegador</h3>
                  <p className="text-zinc-500 text-xs mb-6">Se o aplicativo estiver lento ou apresentando erros de memória (QuotaExceeded), use esta opção para limpar dados temporários.</p>
                  <button 
                    onClick={() => {
                      if (confirm('Isso irá limpar as imagens de diagramas salvas no cache para liberar espaço. Os dados da inspeção não serão apagados. Deseja continuar?')) {
                        localStorage.removeItem('diagramImages');
                        localStorage.removeItem('diagramImages_backup');
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-orange-500/20 hover:text-orange-500 text-zinc-400 p-4 rounded-xl font-bold transition-all border border-white/10"
                  >
                    <Trash2 size={18} />
                    Limpar Cache de Imagens
                  </button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex gap-4">
                  <Info className="text-blue-500 shrink-0" size={24} />
                  <div className="space-y-2">
                    <h4 className="text-blue-500 font-bold text-sm">Como funciona o salvamento?</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      O app salva tudo automaticamente no seu navegador. Ao "Baixar Backup", você gera um arquivo que contém todas as fotos e marcações. Você pode usar esse arquivo para restaurar seu trabalho em outro computador ou para arquivar inspeções antigas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inspect' && (
          <>
            {/* Top Navigation: Group and Category Selector */}
            <div className="bg-[#141414]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
              {/* Primary Sheets (Groups) */}
              <div className="px-4 py-2 flex items-center gap-4 border-b border-white/5 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-2 pr-4 border-r border-white/10 shrink-0">
                  <div className="w-6 h-6 bg-landcros rounded flex items-center justify-center text-white">
                    <Folder size={12} />
                  </div>
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Grupos</span>
                </div>
                <div className="flex gap-1 overflow-x-auto scrollbar-none">
                  {sortedGroupNames.map(group => {
                    const allGroupCats = categoryGroups[group].map(c => c.toLowerCase());
                    const groupCats = visibleCategories.filter(cat => allGroupCats.includes(cat.toLowerCase()));

                    // If not admin, hide groups that are not in selectedGroups (if any are selected)
                    // If no groups are selected, show all groups that have visible categories
                    if (!isAdmin) {
                      const hasRestrictions = selectedGroups.length > 0;
                      if (hasRestrictions && !selectedGroups.includes(group)) return null;
                      if (groupCats.length === 0) return null;
                    }
                    
                    // If admin, hide groups that have NO categories at all in the system (allCategories)
                    if (isAdmin) {
                      const totalGroupCats = allCategories.filter(cat => allGroupCats.includes(cat.toLowerCase()));
                      if (totalGroupCats.length === 0) return null;
                    }

                    return (
                      <div 
                        key={group} 
                        className={`flex items-center gap-0.5 shrink-0 transition-all ${
                          dragOverGroup === group ? 'scale-110 ring-2 ring-landcros ring-offset-2 ring-offset-black rounded-md z-50' : ''
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (isAdmin) setDragOverGroup(group);
                        }}
                        onDragLeave={() => setDragOverGroup(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverGroup(null);
                          const category = e.dataTransfer.getData('category');
                          if (category && category !== group) {
                            moveCategoryToGroup(category, group);
                          }
                        }}
                      >
                        <button
                          onClick={() => setSelectedGroup(group)}
                          className={`whitespace-nowrap px-3 py-1.5 rounded-l-md text-[9px] font-black uppercase tracking-tight transition-all ${
                            selectedGroup === group 
                              ? 'bg-landcros text-white shadow-sm' 
                              : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                          } ${!isAdmin ? 'rounded-r-md' : ''}`}
                        >
                          {group}
                        </button>
                        {isAdmin && (
                          <div className="flex">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const isSelected = selectedGroups.includes(group);
                                if (isSelected) {
                                  setSelectedGroups(prev => prev.filter(g => g !== group));
                                } else {
                                  setSelectedGroups(prev => [...prev, group]);
                                }
                              }}
                              className={`p-1.5 border-l border-white/5 transition-all ${
                                selectedGroups.includes(group) 
                                  ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                                  : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                              }`}
                              title={selectedGroups.includes(group) ? "Ocultar Grupo de Usuário" : "Mostrar Grupo para Usuário"}
                            >
                              {selectedGroups.includes(group) ? <Eye size={10} /> : <EyeOff size={10} />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Tem certeza que deseja excluir o grupo "${group}"? As sheets dentro dele não serão apagadas.`)) {
                                  setCategoryGroups(prev => {
                                    const next = { ...prev };
                                    delete next[group];
                                    return next;
                                  });
                                  setSelectedGroups(prev => prev.filter(g => g !== group));
                                  if (selectedGroup === group) {
                                    setSelectedGroup(sortedGroupNames.find(g => g !== group) || '');
                                  }
                                }
                              }}
                              className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-r-md transition-all border-l border-white/5"
                              title="Excluir Grupo Permanentemente"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Global Sheet Search */}
                <div className="ml-auto flex items-center gap-2 pr-2 shrink-0">
                  <div className="relative group/search">
                    <div className="flex items-center gap-2">
                      {showNoSheetFound && (
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                          Nome não encontrado
                        </span>
                      )}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
                        <input 
                          type="text" 
                          placeholder="BUSCA SHEET" 
                          value={globalSheetSearchTerm}
                          onChange={(e) => setGlobalSheetSearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleGlobalSheetSearch(globalSheetSearchTerm);
                            }
                          }}
                          className={`bg-black/40 border ${showNoSheetFound ? 'border-red-500/50' : 'border-white/10'} rounded-lg pl-9 pr-3 py-1.5 text-[10px] font-black text-white outline-none focus:border-landcros transition-all uppercase tracking-widest w-[140px] md:w-[180px]`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Sheets (Categories) */}
              <div className="p-3 md:p-4 flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2 pr-2 md:pr-4 border-r border-white/10 shrink-0">
                  <div className="w-8 h-8 bg-landcros rounded-lg flex items-center justify-center text-white">
                    <Package size={16} />
                  </div>
                  <div className="hidden lg:block">
                    <h1 className="text-[10px] font-black uppercase tracking-tighter leading-none">Connect</h1>
                    <p className="text-[8px] font-bold text-landcros uppercase tracking-widest">Insight</p>
                  </div>
                </div>

                <div className="flex flex-col pr-2 md:pr-4 border-r border-white/10 shrink-0">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Inspeção</span>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[80px] md:max-w-[120px]">{projectName}</p>
                    <p className="text-[8px] font-bold text-landcros uppercase tracking-widest leading-none mt-0.5">{inspectionInfo.model}</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden relative group">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button 
                      onClick={() => setIsSheetListModalOpen(true)}
                      className="whitespace-nowrap px-3 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/5 flex items-center gap-2"
                    >
                      <List size={14} />
                      <span className="hidden sm:inline">Lista</span>
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        draggable={isAdmin}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('category', cat);
                          // Add a ghost image or styling if needed
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onClick={() => { 
                          setSelectedCategory(cat); 
                          setFocusedPart(null); 
                          setSearchTerm('');
                          setItemSearchTerm('');
                        }}
                        className={`whitespace-nowrap px-4 md:px-5 py-2 md:py-2.5 rounded-t-lg text-[10px] md:text-[11px] font-black uppercase tracking-tight transition-all shrink-0 relative cursor-grab active:cursor-grabbing ${
                          selectedCategory === cat 
                            ? 'bg-white text-black shadow-sm' 
                            : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                        }`}
                      >
                        {categoryRenames[cat] || cat}
                        {selectedCategory === cat && (
                          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-600 rounded-full mx-2" />
                        )}
                      </button>
                    ))}
                    <button
                      onClick={handleAddNewExcelSheet}
                      className="whitespace-nowrap px-3 py-2 rounded-lg text-zinc-500 hover:bg-white/10 hover:text-white transition-all shrink-0 flex items-center justify-center"
                      title="Nova Sheet"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Mobile Details Toggle */}
                <button 
                  onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                  className={`md:hidden p-2 rounded-lg transition-all border ${isDetailsVisible ? 'bg-landcros text-white border-landcros' : 'bg-white/5 text-zinc-400 border-white/5'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Área do Diagrama (Centro/Direita) */}
              <div className="flex-1 bg-transparent relative overflow-hidden flex flex-col">
                <div className="absolute top-6 left-6 right-6 z-10 flex flex-col md:flex-row justify-between items-start gap-4 pointer-events-none">
                  <div className="pointer-events-auto max-w-full md:max-w-[40%]">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black tracking-tighter text-black uppercase italic truncate">
                        {categoryRenames[selectedCategory] || selectedCategory}
                      </h2>
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => {
                              setCategoryToDelete(selectedCategory);
                              setShowDeleteCategoryModal(true);
                            }}
                            className="p-2 bg-white/10 hover:bg-red-500/20 rounded-xl text-zinc-600 hover:text-red-500 transition-all shadow-sm border border-white/5 group"
                            title="Excluir Categoria"
                          >
                            <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => {
                              setCategoryToRename(selectedCategory);
                              setTempCategoryName(categoryRenames[selectedCategory] || selectedCategory);
                              setShowRenameCategoryModal(true);
                            }}
                            className="p-2 bg-white/10 hover:bg-landcros/20 rounded-xl text-zinc-600 hover:text-landcros transition-all shadow-sm border border-white/5 group"
                            title="Renomear Categoria"
                          >
                            <Edit3 size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => {
                              const isSelected = selectedCategories.includes(selectedCategory);
                              if (isSelected) {
                                setSelectedCategories(prev => prev.filter(c => c !== selectedCategory));
                              } else {
                                setSelectedCategories(prev => [...prev, selectedCategory]);
                              }
                            }}
                            className={`p-2 rounded-xl transition-all shadow-sm border border-white/5 group ${
                              selectedCategories.includes(selectedCategory) 
                                ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' 
                                : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                            }`}
                            title={selectedCategories.includes(selectedCategory) ? "Ocultar de Usuário" : "Mostrar para Usuário"}
                          >
                            {selectedCategories.includes(selectedCategory) ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.2em]">Diagrama Técnico</p>
                      {isAdmin && !selectedCategories.includes(selectedCategory) && (
                        <span className="text-[7px] bg-red-500/20 text-red-500 px-1 rounded font-bold uppercase">Oculto para Usuário</span>
                      )}
                      <div className="w-1 h-1 rounded-full bg-zinc-400" />
                      <p className={`text-[8px] font-bold uppercase tracking-widest ${saveStatus === 'error' ? 'text-red-500' : 'text-zinc-700'}`}>
                        {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'error' ? 'Memória Cheia!' : 'Sincronizado'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pointer-events-auto flex-wrap justify-end">
                    {isEditMode && isAdmin && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-2"
                    >
                      <button 
                        onClick={addNewPart}
                        className="p-2 rounded-lg bg-landcros/20 text-landcros border border-landcros/30 hover:bg-landcros/30 transition-all"
                        title="Adicionar Novo Part Number"
                      >
                        <Plus size={14} />
                      </button>
                      {currentImg && (
                        <button 
                          onClick={handleDeleteImage}
                          className={`p-2 rounded-lg transition-all border ${currentConfig.isLocked ? 'bg-zinc-800/50 text-zinc-600 border-white/5 cursor-not-allowed' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20'}`}
                          title={currentConfig.isLocked ? "Imagem Travada" : "Excluir Imagem"}
                          disabled={currentConfig.isLocked}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          const scopedKey = getScopedKey(selectedCategory);
                          setImgConfigs(prev => ({
                            ...prev,
                            [scopedKey]: { ...currentConfig, isLocked: !currentConfig.isLocked }
                          }));
                        }}
                        className={`p-2 rounded-lg transition-all border ${currentConfig.isLocked ? 'bg-landcros text-white border-landcros' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                        title={currentConfig.isLocked ? "Desbloquear Imagem" : "Fixar Imagem"}
                      >
                        {currentConfig.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                      <button 
                        onClick={() => !currentConfig.isLocked && setIsAdjusting(!isAdjusting)}
                        disabled={currentConfig.isLocked}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${currentConfig.isLocked ? 'opacity-50 cursor-not-allowed bg-white/5 text-zinc-600' : isAdjusting ? 'bg-landcros text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                      >
                        {isAdjusting ? 'Pronto' : 'Ajustar Imagem'}
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => {
                            if (isConfirmingReset) {
                              handleResetCategory();
                            } else {
                              setIsConfirmingReset(true);
                              setTimeout(() => setIsConfirmingReset(false), 3000);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${isConfirmingReset ? 'bg-red-500 text-white border-red-600' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20'}`}
                        >
                          {isConfirmingReset ? 'Confirmar Limpeza?' : 'Limpar Tudo (Resetar)'}
                        </button>
                      )}
                      <label className={`cursor-pointer bg-landcros/10 hover:bg-landcros/20 text-landcros px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-landcros/20 ${currentConfig.isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Download size={12} className="rotate-180" />
                        Imagem
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={currentConfig.isLocked} />
                      </label>
                    </motion.div>
                  )}

                  {/* Mode Switcher and Adjustment Icons moved to sidebar */}
                </div>
              </div>

                {/* Adjustment Controls - Draggable & Collapsible */}
                <AnimatePresence>
                  {isAdmin && isFiltersVisible && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="absolute top-24 left-6 z-50 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-[260px] overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-landcros">Ajustes de Cor</span>
                        <button 
                          onClick={() => setIsFiltersVisible(false)}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-zinc-400"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="p-6 flex flex-col gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Sun size={12} className="text-zinc-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Brilho</span>
                              </div>
                              <span className="text-[10px] font-mono text-landcros">{currentFilters.brightness}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="200" step="1" 
                              value={currentFilters.brightness} 
                              onChange={(e) => {
                                const scopedKey = getScopedKey(selectedCategory);
                                setImgFilters(prev => ({ 
                                  ...prev, 
                                  [scopedKey]: { ...currentFilters, brightness: parseInt(e.target.value) } 
                                }));
                              }}
                              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Contrast size={12} className="text-zinc-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Contraste</span>
                              </div>
                              <span className="text-[10px] font-mono text-landcros">{currentFilters.contrast}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="200" step="1" 
                              value={currentFilters.contrast} 
                              onChange={(e) => {
                                const scopedKey = getScopedKey(selectedCategory);
                                setImgFilters(prev => ({ 
                                  ...prev, 
                                  [scopedKey]: { ...currentFilters, contrast: parseInt(e.target.value) } 
                                }));
                              }}
                              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Droplets size={12} className="text-zinc-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Saturação (G&P)</span>
                              </div>
                              <span className="text-[10px] font-mono text-landcros">{currentFilters.grayscale}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="100" step="1" 
                              value={currentFilters.grayscale} 
                              onChange={(e) => {
                                const scopedKey = getScopedKey(selectedCategory);
                                setImgFilters(prev => ({ 
                                  ...prev, 
                                  [scopedKey]: { ...currentFilters, grayscale: parseInt(e.target.value) } 
                                }));
                              }}
                              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const scopedKey = getScopedKey(selectedCategory);
                            setImgFilters(prev => ({ ...prev, [scopedKey]: { brightness: 100, contrast: 100, grayscale: 0 } }));
                          }}
                          className="w-full py-2.5 rounded-xl bg-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                        >
                          Resetar Cores
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {isAdjusting && (
                    <motion.div 
                      drag
                      dragMomentum={false}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        width: isPanelMinimized ? '48px' : '260px',
                        height: isPanelMinimized ? '48px' : 'auto'
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute top-24 left-6 z-50 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden cursor-grab active:cursor-grabbing"
                    >
                      <div className={`flex items-center justify-between p-4 ${isPanelMinimized ? 'h-full justify-center' : 'border-b border-white/5'}`}>
                        {!isPanelMinimized && (
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-landcros">Calibração</span>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setIsPanelMinimized(!isPanelMinimized); }}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-zinc-400"
                        >
                          {isPanelMinimized ? <ChevronRight size={18} /> : <X size={18} />}
                        </button>
                      </div>

                      {!isPanelMinimized && (
                        <div className="p-6 flex flex-col gap-6">
                          <p className="text-[9px] text-zinc-500">Arraste este painel ou os números para ajustar.</p>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Zoom</span>
                                <span className="text-landcros">{currentConfig.scale.toFixed(2)}x</span>
                              </div>
                              <input 
                                type="range" min="0.5" max="3" step="0.01" 
                                value={currentConfig.scale} 
                                onChange={(e) => {
                                  const scopedKey = getScopedKey(selectedCategory);
                                  setImgConfigs(prev => ({ 
                                    ...prev, 
                                    [scopedKey]: { ...currentConfig, scale: parseFloat(e.target.value) } 
                                  }));
                                }}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Rotação</span>
                                <span className="text-landcros">{(currentConfig.rotation || 0)}°</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleRotateCcw()}
                                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all border border-white/5 flex items-center justify-center"
                                >
                                  <RotateCcw size={14} />
                                </button>
                                <button 
                                  onClick={() => handleRotateCw()}
                                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all border border-white/5 flex items-center justify-center"
                                >
                                  <RotateCw size={14} />
                                </button>
                              </div>
                              <input 
                                type="range" min="-180" max="180" step="1" 
                                value={currentConfig.rotation || 0} 
                                onChange={(e) => {
                                  const scopedKey = getScopedKey(selectedCategory);
                                  setImgConfigs(prev => ({ 
                                    ...prev, 
                                    [scopedKey]: { ...currentConfig, rotation: parseInt(e.target.value) } 
                                  }));
                                }}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                              />
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Posição X</span>
                              <input 
                                type="range" min="-400" max="400" step="1" 
                                value={currentConfig.x} 
                                onChange={(e) => {
                                  const scopedKey = getScopedKey(selectedCategory);
                                  setImgConfigs(prev => ({ 
                                    ...prev, 
                                    [scopedKey]: { ...currentConfig, x: parseInt(e.target.value) } 
                                  }));
                                }}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                              />
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Posição Y</span>
                              <input 
                                type="range" min="-400" max="400" step="1" 
                                value={currentConfig.y} 
                                onChange={(e) => {
                                  const scopedKey = getScopedKey(selectedCategory);
                                  setImgConfigs(prev => ({ 
                                    ...prev, 
                                    [scopedKey]: { ...currentConfig, y: parseInt(e.target.value) } 
                                  }));
                                }}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                              />
                            </div>

                            <div className="space-y-2 pt-2 border-t border-white/5">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Tamanho dos Números</span>
                                <span className="text-landcros">{hotspotSize}px</span>
                              </div>
                              <input 
                                type="range" min="10" max="80" step="1" 
                                value={hotspotSize} 
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setHotspotSize(val);
                                  safeSetItem('hotspotSize', val.toString());
                                }}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 pt-2">
                            {isAdmin && (
                              <button 
                                onClick={saveCurrentAsMaster}
                                className="w-full py-3 rounded-xl bg-landcros text-[10px] font-black uppercase tracking-widest text-white hover:bg-landcros/90 transition-all shadow-lg shadow-landcros/20 flex items-center justify-center gap-2 mb-2"
                              >
                                <Save size={14} />
                                Salvar como Configuração Mestre
                              </button>
                            )}
                            {isAdmin && (
                              <button 
                                onClick={handleResetZoom}
                                className="w-full py-2.5 rounded-xl bg-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                              >
                                Resetar para Mestre
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                const scopedKey = getScopedKey(selectedCategory);
                                setImgConfigs(prev => ({ ...prev, [scopedKey]: { scale: 1, x: 0, y: 0 } }));
                              }}
                              className="w-full py-2.5 rounded-xl bg-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                            >
                              Resetar para 1:1
                            </button>
                            {isAdmin && (
                              <button 
                                onClick={() => setCustomPositions(prev => {
                                  const scopedKey = getScopedKey(selectedCategory);
                                  const next = { ...prev };
                                  delete next[scopedKey];
                                  delete next[selectedCategory];
                                  return next;
                                })}
                                className="w-full py-2.5 rounded-xl bg-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                              >
                                Resetar Números
                              </button>
                            )}
                            <button 
                              onClick={() => setIsAdjusting(false)}
                              className="w-full py-3 rounded-xl bg-landcros text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(242,125,38,0.2)]"
                            >
                              Concluir
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                    {/* Diagram Simulator */}
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-white">
                      <div 
                        ref={diagramContainerRef}
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className={`relative w-full h-full transition-all duration-500 ease-in-out overflow-hidden group flex items-center justify-center ${isPanning ? 'cursor-grabbing' : currentConfig.scale > 1 ? 'cursor-grab' : ''}`}
                      >
                        {/* Enhanced Dotted Grid - Removed for white background */}
                        
                        {/* Fixed Aspect Ratio Container to prevent hotspot displacement */}
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Floating Zoom Controls Overlay - Moved to Sidebar */}

                          {/* Zoom Indicator & Quick Reset - Removed from here to move to sidebar */}

                          <div 
                            ref={innerContainerRef}
                            className={`relative flex items-center justify-center`}
                            style={{ 
                              aspectRatio: `${imageAspectRatio}`,
                              width: imageAspectRatio > (containerSize.width / (containerSize.height || 1)) ? '100%' : 'auto',
                              height: imageAspectRatio > (containerSize.width / (containerSize.height || 1)) ? 'auto' : '100%',
                              maxWidth: '100%',
                              maxHeight: '100%',
                              transform: `scale(${currentConfig.scale}) translate(${currentConfig.x}px, ${currentConfig.y}px) rotate(${currentConfig.rotation || 0}deg)`,
                              transformOrigin: 'center center'
                            }}
                          >
                            {currentImg ? (
                              <div 
                                className={`relative w-full h-full ${isEraserMode ? 'cursor-crosshair' : ''}`}
                                onMouseDown={handleEraserMouseDown}
                                onMouseMove={handleEraserMouseMove}
                                onMouseUp={handleEraserMouseUp}
                                onMouseLeave={handleEraserMouseUp}
                              >
                                <img 
                                  src={currentImg} 
                                  alt="Diagrama" 
                                  className="w-full h-full object-contain pointer-events-none" 
                                  onLoad={(e) => {
                                    const img = e.currentTarget;
                                    const ratio = img.naturalWidth / img.naturalHeight;
                                    if (ratio && ratio !== imageAspectRatio) {
                                      setImageAspectRatio(ratio);
                                    }
                                  }}
                                  style={{ 
                                    filter: isBlueprintMode 
                                      ? `invert(0.9) contrast(1.3) brightness(1.1) brightness(${currentFilters.brightness}%) contrast(${currentFilters.contrast}%) grayscale(${currentFilters.grayscale}%)` 
                                      : `brightness(${currentFilters.brightness}%) contrast(${currentFilters.contrast}%) grayscale(${currentFilters.grayscale}%)`,
                                    mixBlendMode: isBlueprintMode ? 'screen' : 'normal',
                                    opacity: isBlueprintMode ? 0.9 : 1
                                  }}
                                />
                                {/* Eraser Masks Layer */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                  {currentMasks.map(mask => (
                                    <div 
                                      key={mask.id}
                                      className="absolute pointer-events-auto group/mask"
                                      style={{ 
                                        left: `${mask.x}%`, 
                                        top: `${mask.y}%`, 
                                        width: `${mask.w}%`, 
                                        height: `${mask.h}%`,
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: mask.color || (isBlueprintMode ? '#000' : '#fff'),
                                        borderRadius: '50%',
                                        filter: 'blur(1px)',
                                        opacity: 1
                                      }}
                                    >
                                      {isEraserMode && (
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setImageMasks(prev => {
                                              const key = getScopedKey(selectedCategory);
                                              const current = prev[key] || [];
                                              return {
                                                ...prev,
                                                [key]: current.filter(m => m.id !== mask.id)
                                              };
                                            });
                                          }}
                                          className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/mask:opacity-100 z-50"
                                        >
                                          <X size={8} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none p-12 text-center">
                                <MapIcon size={48} className="mb-4" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Carregue a imagem da Sheet correspondente</p>
                              </div>
                            )}

                            {viewMode === 'visual' ? (
                              <>
                                {/* SVG Layer for Leader Lines */}
                                <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full">
                                  {filteredParts.map(part => {
                                    const pos = getHotspotPos(part);
                                    const target = currentLeaderLines[part.id];
                                    if (!target) return null;
                                    const isFocused = focusedPart?.id === part.id;
                                    
                                    // Only show lines if adjusting OR if it's the focused part
                                    if (!isAdjusting && !isFocused) return null;
                                    
                                    const color = target.color || "#F27D26";
                                    const isBlack = color === "#000000";

                                    return (
                                      <React.Fragment key={`line-group-${part.id}`}>
                                        {/* Outer Border for Black Line */}
                                        {isBlack && (
                                          <line
                                            x1={pos.left}
                                            y1={pos.top}
                                            x2={target.left}
                                            y2={target.top}
                                            stroke="white"
                                            strokeWidth={3 / currentConfig.scale}
                                            strokeDasharray={target.isSolid ? "0" : `${4 / currentConfig.scale} ${2 / currentConfig.scale}`}
                                            opacity={isFocused ? 1 : 0.4}
                                          />
                                        )}
                                        <line
                                          x1={pos.left}
                                          y1={pos.top}
                                          x2={target.left}
                                          y2={target.top}
                                          stroke={isFocused ? color : (target.color ? `${target.color}66` : "rgba(242, 125, 38, 0.4)")}
                                          strokeWidth={1.5 / currentConfig.scale}
                                          strokeDasharray={target.isSolid ? "0" : `${4 / currentConfig.scale} ${2 / currentConfig.scale}`}
                                        />
                                      </React.Fragment>
                                    );
                                  })}
                                </svg>

                                {filteredParts.map((part) => {
                                 const isFocused = focusedPart?.id === part.id;
                                 if (!isAdjusting) return null;
                                 const pos = getHotspotPos(part);
                                const hasOrder = isSelected(part.id, 'order');
                                const hasDamage = isSelected(part.id, 'damaged');
                                const isCustom = !!currentCustomPos[part.id];
                                const target = currentLeaderLines[part.id];

                                return (
                                  <React.Fragment key={part.id}>
                                    <motion.div 
                                    key={`${part.id}-${isAdjusting}-${dragKey}`} // Key change forces re-render to clear internal drag state
                                    drag={isAdjusting}
                                    dragMomentum={false}
                                    dragElastic={0}
                                    onDragEnd={(_, info) => handleDragEnd(part.id, info)}
                                    className={`absolute z-20 ${isAdjusting ? 'cursor-move' : ''}`} 
                                    style={{ top: pos.top, left: pos.left, x: '-50%', y: '-50%' }}
                                    animate={{ scale: 1 / currentConfig.scale }}
                                    transition={{ duration: 0 }}
                                  >
                                    <AnimatePresence>
                                      {(hasOrder || hasDamage || isFocused) && (
                                        <motion.div
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                                          transition={{ duration: 2.5, repeat: Infinity }}
                                          className={`absolute inset-0 rounded-full blur-sm ${isFocused ? 'bg-white' : hasDamage ? 'bg-red-500' : 'bg-landcros'}`}
                                        />
                                      )}
                                    </AnimatePresence>
                                    
                                    <div className="relative group/hotspot">
                                      <motion.button
                                        onClick={() => {
                                          if (!isAdjusting) {
                                            setFocusedPart(part);
                                            if (window.innerWidth < 768) setIsDetailsVisible(true);
                                          }
                                        }}
                                        className={`relative rounded-full flex items-center justify-center font-mono font-bold transition-all ${
                                          isFocused ? 'bg-white text-black scale-110' : hasDamage ? 'bg-red-500 text-white' : hasOrder ? 'bg-landcros text-white' : 'bg-zinc-800 text-zinc-400'
                                        } ${isAdjusting ? '' : 'pointer-events-none'}`}
                                        style={{ 
                                          width: `${(individualHotspotSizes[part.id] || (selectedCategory === 'AIR-CONDITIONER PIPING (2)' ? 15 : hotspotSize)) * (isMobile ? 0.5 : 1)}px`, 
                                          height: `${(individualHotspotSizes[part.id] || (selectedCategory === 'AIR-CONDITIONER PIPING (2)' ? 15 : hotspotSize)) * (isMobile ? 0.5 : 1)}px`,
                                          fontSize: `${Math.max(3, ((individualHotspotSizes[part.id] || (selectedCategory === 'AIR-CONDITIONER PIPING (2)' ? 15 : hotspotSize)) * (isMobile ? 0.5 : 1)) / 2.5)}px`
                                        }}
                                      >
                                        {part.itemNumber}
                                      </motion.button>

                                      {/* Individual Reset Button */}
                                      {isAdmin && isAdjusting && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeClone(part.id);
                                          }}
                                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors pointer-events-auto z-30"
                                          title={part.id.includes('-clone-') || part.id.includes('ai-detected-') || part.id.includes('custom-') ? "Excluir este clone" : "Ocultar este número"}
                                        >
                                          <X size={10} strokeWidth={3} />
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>

                                  {/* Target Handle for Leader Line */}
                                  {isAdjusting && isFocused && (
                                    <motion.div
                                      key={`target-${part.id}-${dragKey}`}
                                      drag
                                      dragMomentum={false}
                                      dragElastic={0}
                                      onDragEnd={(_, info) => handleTargetDragEnd(part.id, info)}
                                      className="absolute z-30 cursor-crosshair group/target"
                                      style={{ 
                                        top: target?.top || pos.top, 
                                        left: target?.left || pos.left,
                                        x: '-50%',
                                        y: '-50%'
                                      }}
                                      animate={{ scale: 1 / currentConfig.scale }}
                                      transition={{ duration: 0 }}
                                    >
                                      <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative" style={{ backgroundColor: target?.color || '#F27D26' }}>
                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                        
                                        {/* Delete Button on drawing */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setLeaderLines(prev => {
                                              const scopedKey = getScopedKey(selectedCategory);
                                              const next = { ...prev };
                                              const catLines = { ...(next[scopedKey] || {}) };
                                              delete catLines[part.id];
                                              next[scopedKey] = catLines;
                                              return next;
                                            });
                                          }}
                                          className="absolute -top-4 -right-4 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors pointer-events-auto opacity-0 group-hover/target:opacity-100"
                                          title="Remover Linha"
                                        >
                                          <X size={10} strokeWidth={3} />
                                        </button>

                                        {/* Style Toggle on drawing */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setLeaderLines(prev => {
                                              const scopedKey = getScopedKey(selectedCategory);
                                              return {
                                                ...prev,
                                                [scopedKey]: {
                                                  ...(prev[scopedKey] || {}),
                                                  [part.id]: {
                                                    ...(prev[scopedKey]?.[part.id] || { top: pos.top, left: pos.left }),
                                                    isSolid: !(prev[scopedKey]?.[part.id]?.isSolid)
                                                  }
                                                }
                                              };
                                            });
                                          }}
                                          className="absolute -bottom-4 -right-4 w-5 h-5 bg-zinc-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-700 transition-colors pointer-events-auto opacity-0 group-hover/target:opacity-100"
                                          title={target?.isSolid ? "Mudar para Pontilhada" : "Mudar para Contínua"}
                                        >
                                          {target?.isSolid ? <Minus size={10} /> : <MoreHorizontal size={10} />}
                                        </button>

                                        {/* Color Toggle on drawing */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const colors = ['#F27D26', '#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#000000'];
                                            const currentColor = target?.color || '#F27D26';
                                            const nextIndex = (colors.indexOf(currentColor) + 1) % colors.length;
                                            setLeaderLines(prev => {
                                              const scopedKey = getScopedKey(selectedCategory);
                                              return {
                                                ...prev,
                                                [scopedKey]: {
                                                  ...(prev[scopedKey] || {}),
                                                  [part.id]: {
                                                    ...(prev[scopedKey]?.[part.id] || { top: pos.top, left: pos.left }),
                                                    color: colors[nextIndex]
                                                  }
                                                }
                                              };
                                            });
                                          }}
                                          className="absolute -bottom-4 -left-4 w-5 h-5 bg-zinc-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-700 transition-colors pointer-events-auto opacity-0 group-hover/target:opacity-100"
                                          title="Mudar Cor"
                                        >
                                          <Palette size={10} />
                                        </button>
                                      </div>
                                    </motion.div>
                                  )}
                                </React.Fragment>
                                );
                              })
                            }
                          </>
                            ) : viewMode === 'list' ? (
                              <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl z-30 overflow-y-auto p-6 md:p-8">
                                <div className="max-w-2xl mx-auto space-y-4">
                                  <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Lista de Peças: {selectedCategory}</h3>
                                    <button onClick={() => setViewMode('visual')} className="text-landcros text-[10px] font-bold uppercase tracking-widest hover:underline">Voltar ao Diagrama</button>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {filteredParts.map(part => (
                                      <button
                                        key={part.id}
                                        onClick={() => { setFocusedPart(part); setViewMode('visual'); }}
                                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group text-left"
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 font-mono font-bold group-hover:bg-landcros group-hover:text-white transition-colors">
                                            {part.itemNumber}
                                          </div>
                                          <div>
                                            <p className="text-white font-bold text-sm tracking-tight">{part.partNumber}</p>
                                            <p className="text-zinc-500 text-[10px] font-mono italic">{part.description}</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          {isSelected(part.id, 'order') && <ShoppingCart size={14} className="text-landcros" />}
                                          {isSelected(part.id, 'damaged') && <AlertTriangle size={14} className="text-red-500" />}
                                          <ChevronRight size={16} className="text-zinc-700 group-hover:text-white transition-colors" />
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl z-30 overflow-hidden p-6 md:p-8">
                                <div className="max-w-5xl mx-auto h-full">
                                  <BOMTable 
                                    parts={filteredParts} 
                                    onUpdate={updatePart}
                                    onAdd={addNewPart}
                                    onPaste={() => setIsPasteBomModalOpen(true)}
                                    onDelete={deletePart}
                                    isAdmin={isAdmin}
                                    reportLanguage={reportLanguage}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Right Side: Details Panel */}
                <AnimatePresence>
                  {isDetailsVisible && (
                    <motion.div 
                      initial={{ x: 350, opacity: 0, y: window.innerWidth < 768 ? 500 : 0 }}
                      animate={{ 
                        x: 0, 
                        opacity: 1,
                        y: 0
                      }}
                      exit={{ x: 350, opacity: 0, y: window.innerWidth < 768 ? 500 : 0 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className={`fixed md:relative inset-x-0 bottom-0 md:inset-auto h-[70vh] md:h-full w-full md:w-[350px] bg-[#141414]/95 md:bg-[#141414]/90 backdrop-blur-2xl md:backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 md:border-white/5 flex flex-col shrink-0 z-[60] md:z-30 rounded-t-[32px] md:rounded-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)] md:shadow-none transition-all duration-300`}
                    >
                    <div className="w-full flex flex-col items-center pt-3 pb-1 md:hidden relative">
                      <div className="w-12 h-1.5 bg-white/10 rounded-full mb-2" />
                      <button 
                        onClick={() => setIsDetailsVisible(false)}
                        className="absolute top-2 right-6 p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto pb-24 md:pb-6">
                      <AnimatePresence mode="wait">
                        {focusedPart ? (
                          <motion.div key={focusedPart.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => {
                                    setFocusedPart(null);
                                    setSearchTerm('');
                                    setItemSearchTerm('');
                                  }}
                                  className="p-2 bg-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                  <ArrowLeft size={18} />
                                </button>
                                <div>
                                  <span className="text-[9px] font-mono text-landcros font-bold uppercase tracking-widest">Detalhes da Peça</span>
                                  <h3 className="text-2xl font-black tracking-tighter text-white mt-1 leading-tight">{focusedPart.partNumber}</h3>
                                  <p className="text-zinc-400 text-xs italic mt-1">{focusedPart.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const idx = filteredParts.findIndex(p => p.id === focusedPart.id);
                                    if (idx > 0) setFocusedPart(filteredParts[idx - 1]);
                                  }}
                                  disabled={filteredParts.findIndex(p => p.id === focusedPart.id) <= 0}
                                  className="p-2 bg-white/5 rounded-full text-zinc-400 disabled:opacity-20 hover:text-white transition-all"
                                >
                                  <ChevronUp size={20} />
                                </button>
                                <button
                                  onClick={() => {
                                    const idx = filteredParts.findIndex(p => p.id === focusedPart.id);
                                    if (idx < filteredParts.length - 1) setFocusedPart(filteredParts[idx + 1]);
                                  }}
                                  disabled={filteredParts.findIndex(p => p.id === focusedPart.id) >= filteredParts.length - 1}
                                  className="p-2 bg-white/5 rounded-full text-zinc-400 disabled:opacity-20 hover:text-white transition-all"
                                >
                                  <ChevronDown size={20} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setFocusedPart(null);
                                    setSearchTerm('');
                                    setItemSearchTerm('');
                                  }}
                                  className="md:hidden p-2 bg-white/5 rounded-full text-zinc-400"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-[8px] text-zinc-500 uppercase font-bold">Sheet</span>
                                <p className="text-sm font-bold text-white">{focusedPart.sheet}</p>
                              </div>
                              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-[8px] text-zinc-500 uppercase font-bold">Item</span>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-white">{focusedPart.itemNumber}</p>
                                  {focusedPart.id.includes('-clone-') && (
                                    <span className="text-[7px] bg-landcros/20 text-landcros px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Cópia</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={handleResetZoom}
                              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all border border-white/5 font-bold text-xs group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-landcros/10 flex items-center justify-center text-landcros group-hover:bg-landcros group-hover:text-white transition-all">
                                <Maximize2 size={16} />
                              </div>
                              <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Configuração Mestre</p>
                                <p className="text-[8px] text-zinc-500 font-medium leading-none">Resetar zoom e posição da imagem</p>
                              </div>
                            </button>

                            <div className="space-y-2 pt-2">
                              {isAdmin && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => duplicatePart(focusedPart)}
                                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-landcros/10 text-landcros hover:bg-landcros/20 transition-all border border-landcros/20 text-[10px] font-bold uppercase tracking-widest"
                                    title="Criar outra instância desta peça no desenho com todos os dados"
                                  >
                                    <Copy size={14} />
                                    Duplicar
                                  </button>
                                  {(isAdmin || focusedPart.id.includes('-clone-')) && (
                                    <button
                                      onClick={() => removeClone(focusedPart.id)}
                                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20 text-[10px] font-bold uppercase tracking-widest"
                                    >
                                      <Trash2 size={14} />
                                      Remover
                                    </button>
                                  )}
                                </div>
                              )}

                              {isAdmin && (
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tamanho Individual</span>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={() => {
                                          const current = individualHotspotSizes[focusedPart.id] || hotspotSize;
                                          setIndividualHotspotSizes(prev => ({ ...prev, [focusedPart.id]: Math.max(10, current - 2) }));
                                        }}
                                        className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-white hover:bg-white/10"
                                      >
                                        -
                                      </button>
                                      <span className="text-[10px] font-mono text-landcros w-8 text-center">
                                        {individualHotspotSizes[focusedPart.id] || hotspotSize}px
                                      </span>
                                      <button 
                                        onClick={() => {
                                          const current = individualHotspotSizes[focusedPart.id] || hotspotSize;
                                          setIndividualHotspotSizes(prev => ({ ...prev, [focusedPart.id]: Math.min(100, current + 2) }));
                                        }}
                                        className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-white hover:bg-white/10"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  <input 
                                    type="range" min="10" max="100" step="1" 
                                    value={individualHotspotSizes[focusedPart.id] || hotspotSize} 
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      setIndividualHotspotSizes(prev => ({
                                        ...prev,
                                        [focusedPart.id]: val
                                      }));
                                    }}
                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                                  />
                                  {individualHotspotSizes[focusedPart.id] && (
                                    <button 
                                      onClick={() => {
                                        setIndividualHotspotSizes(prev => {
                                          const next = { ...prev };
                                          delete next[focusedPart.id];
                                          return next;
                                        });
                                      }}
                                      className="w-full text-[8px] text-zinc-500 uppercase font-bold hover:text-white transition-colors"
                                    >
                                      Resetar para Padrão
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Leader Line Controls */}
                              {isAdmin && (
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Linha de Chamada</span>
                                    {currentLeaderLines[focusedPart.id] ? (
                                      <div className="flex gap-2">
                                        <button 
                                          onClick={() => {
                                            setLeaderLines(prev => {
                                              const key = getScopedKey(selectedCategory);
                                              const currentCat = prev[key] || {};
                                              return {
                                                ...prev,
                                                [key]: {
                                                  ...currentCat,
                                                  [focusedPart.id]: {
                                                    ...(currentCat[focusedPart.id] || { top: '50%', left: '50%' }),
                                                    isSolid: !currentCat[focusedPart.id]?.isSolid
                                                  }
                                                }
                                              };
                                            });
                                          }}
                                          className="text-[8px] bg-white/10 text-white px-2 py-1 rounded font-black uppercase tracking-tighter hover:bg-white/20"
                                        >
                                          {currentLeaderLines[focusedPart.id]?.isSolid ? 'Pontilhada' : 'Contínua'}
                                        </button>
                                        <button 
                                          onClick={() => {
                                            setLeaderLines(prev => {
                                              const key = getScopedKey(selectedCategory);
                                              const next = { ...prev };
                                              const catLines = { ...(next[key] || {}) };
                                              delete catLines[focusedPart.id];
                                              next[key] = catLines;
                                              return next;
                                            });
                                          }}
                                          className="text-[8px] bg-red-500/10 text-red-500 px-2 py-1 rounded font-black uppercase tracking-tighter hover:bg-red-500/20"
                                        >
                                          Remover
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-[8px] text-zinc-600 uppercase font-bold italic">Arraste o ponto no diagrama</span>
                                    )}
                                  </div>
                                  
                                  {currentLeaderLines[focusedPart.id] && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {['#F27D26', '#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#000000'].map(color => (
                                        <button
                                          key={color}
                                          onClick={() => {
                                            setLeaderLines(prev => {
                                              const key = getScopedKey(selectedCategory);
                                              const currentCat = prev[key] || {};
                                              return {
                                                ...prev,
                                                [key]: {
                                                  ...currentCat,
                                                  [focusedPart.id]: {
                                                    ...(currentCat[focusedPart.id] || { top: '50%', left: '50%' }),
                                                    color
                                                  }
                                                }
                                              };
                                            });
                                          }}
                                          className={`w-5 h-5 rounded-full border-2 transition-all ${currentLeaderLines[focusedPart.id]?.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'} ${color === '#000000' ? 'border-white/20' : ''}`}
                                          style={{ backgroundColor: color }}
                                        />
                                      ))}
                                    </div>
                                  )}

                                  <p className="text-[9px] text-zinc-500 leading-relaxed">
                                    No modo de ajuste, arraste o ponto central para indicar onde a mangueira está.
                                  </p>
                                </div>
                              )}

                            {/* Eraser Tool Controls */}
                            {isAdmin && (
                              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ferramenta Borracha</span>
                                  <button 
                                    onClick={() => setIsEraserMode(!isEraserMode)}
                                    className={`text-[8px] px-2 py-1 rounded font-black uppercase tracking-tighter transition-all ${isEraserMode ? 'bg-landcros text-white shadow-[0_0_10px_rgba(242,125,38,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                  >
                                    {isEraserMode ? 'Ativa' : 'Desativada'}
                                  </button>
                                </div>
                                {isEraserMode && (
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[8px] text-zinc-500 uppercase font-bold">Tamanho</span>
                                      <span className="text-[10px] font-mono text-landcros">{eraserSize}px</span>
                                    </div>
                                    <input 
                                      type="range" min="5" max="100" step="1" 
                                      value={eraserSize} 
                                      onChange={(e) => setEraserSize(parseInt(e.target.value))}
                                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                                    />
                                    
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[8px] text-zinc-500 uppercase font-bold">Cor da Borracha</span>
                                        <div className="w-4 h-4 rounded border border-white/20" style={{ backgroundColor: eraserColor }} />
                                      </div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {['#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#4b5563', '#1f2937', '#000000'].map(color => (
                                          <button
                                            key={color}
                                            onClick={() => setEraserColor(color)}
                                            className={`w-5 h-5 rounded border transition-all ${eraserColor === color ? 'border-landcros scale-110 shadow-lg' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: color }}
                                          />
                                        ))}
                                        <input 
                                          type="color" 
                                          value={eraserColor} 
                                          onChange={(e) => setEraserColor(e.target.value)}
                                          className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
                                        />
                                      </div>
                                    </div>

                                    <button 
                                      onClick={() => setImageMasks(prev => ({ ...prev, [getScopedKey(selectedCategory)]: [] }))}
                                      className="w-full text-[8px] text-red-500 uppercase font-bold hover:text-red-400 transition-colors pt-1"
                                    >
                                      Limpar Todas as Máscaras
                                    </button>
                                    <p className="text-[8px] text-zinc-600 italic leading-tight">
                                      Clique na imagem para cobrir as linhas originais. Use o modo Blueprint para ver melhor.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {(isAdmin || focusedPart.id.includes('-clone-') || focusedPart.id.startsWith('custom-')) && (
                              <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-landcros">Editar Dados</span>
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-[8px] text-zinc-500 uppercase font-bold mb-1 block">Part Number</label>
                                    <input 
                                      type="text"
                                      value={focusedPart.partNumber}
                                      onChange={(e) => updatePart(focusedPart.id, { partNumber: e.target.value })}
                                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-xs font-bold outline-none focus:border-landcros"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[8px] text-zinc-500 uppercase font-bold mb-1 block">Descrição</label>
                                    <input 
                                      type="text"
                                      value={focusedPart.description}
                                      onChange={(e) => updatePart(focusedPart.id, { description: e.target.value })}
                                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-landcros"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[8px] text-zinc-500 uppercase font-bold mb-1 block">Item #</label>
                                    <input 
                                      type="text"
                                      value={focusedPart.itemNumber}
                                      onChange={(e) => updatePart(focusedPart.id, { itemNumber: e.target.value })}
                                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-xs font-mono outline-none focus:border-landcros"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[8px] text-zinc-500 uppercase font-bold mb-1 block">Sheet</label>
                                    <input 
                                      type="text"
                                      value={focusedPart.sheet}
                                      onChange={(e) => updatePart(focusedPart.id, { sheet: e.target.value })}
                                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-xs font-mono outline-none focus:border-landcros"
                                    />
                                  </div>
                                  {partOverrides[focusedPart.id] && (
                                    <button 
                                      onClick={() => {
                                        setPartOverrides(prev => {
                                          const next = { ...prev };
                                          delete next[focusedPart.id];
                                          safeSetItem('partOverrides', JSON.stringify(next));
                                          return next;
                                        });
                                        const original = PARTS_DATA.find(p => p.id === focusedPart.id);
                                        if (original) setFocusedPart(original);
                                      }}
                                      className="w-full text-[8px] text-zinc-500 uppercase font-bold hover:text-white transition-colors pt-1"
                                    >
                                      Resetar para Original
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                            </div>

                            <div className="space-y-2 pt-2">
                              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    {TRANSLATIONS[reportLanguage].quantity}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => {
                                        const currentQty = selectedItems.find(i => i.part.id === focusedPart.id)?.quantity || 1;
                                        setQuantity(focusedPart.id, isSelected(focusedPart.id, 'order') ? 'order' : 'damaged', currentQty - 1);
                                      }}
                                      className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className="text-sm font-black text-landcros min-w-[24px] text-center">
                                      {selectedItems.find(i => i.part.id === focusedPart.id)?.quantity || 1}
                                    </span>
                                    <button 
                                      onClick={() => {
                                        const currentQty = selectedItems.find(i => i.part.id === focusedPart.id)?.quantity || 1;
                                        setQuantity(focusedPart.id, isSelected(focusedPart.id, 'order') ? 'order' : 'damaged', currentQty + 1);
                                      }}
                                      className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => toggleItem(focusedPart, 'order')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all font-bold text-xs ${
                                  isSelected(focusedPart.id, 'order') ? 'bg-landcros text-white' : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <ShoppingCart size={16} />
                                  <span>Adicionar ao Pedido</span>
                                </div>
                                {isSelected(focusedPart.id, 'order') && <CheckCircle2 size={16} />}
                              </button>

                              <button
                                onClick={() => toggleItem(focusedPart, 'damaged')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${
                                  isSelected(focusedPart.id, 'damaged') ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <AlertTriangle size={18} className={isSelected(focusedPart.id, 'damaged') ? 'text-white' : 'text-red-500'} />
                                  <span>Reportar Avaria / Dano</span>
                                </div>
                                {isSelected(focusedPart.id, 'damaged') && <CheckCircle2 size={18} />}
                              </button>

                              {isSelected(focusedPart.id, 'damaged') && (
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 mt-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                      {TRANSLATIONS[reportLanguage].criticality}
                                    </span>
                                    <div className="flex gap-2">
                                      {[
                                        { id: 'A', color: 'bg-red-600', icon: '!!!', marks: '!!!' },
                                        { id: 'B', color: 'bg-yellow-400', icon: '!!', marks: '!!' },
                                        { id: 'C', color: 'bg-emerald-500', icon: '!', marks: '!' }
                                      ].map((crit) => (
                                        <button
                                          key={crit.id}
                                          onClick={() => setCriticality(focusedPart.id, crit.id as Criticality)}
                                          className={`relative w-10 h-10 flex items-center justify-center transition-all ${
                                            selectedItems.find(i => i.part.id === focusedPart.id)?.criticality === crit.id
                                              ? 'scale-110 z-10'
                                              : 'opacity-40 hover:opacity-100'
                                          }`}
                                          title={
                                            crit.id === 'A' ? TRANSLATIONS[reportLanguage].highCriticality :
                                            crit.id === 'B' ? TRANSLATIONS[reportLanguage].mediumCriticality :
                                            TRANSLATIONS[reportLanguage].lowCriticality
                                          }
                                        >
                                          <AlertTriangle 
                                            size={40} 
                                            className={crit.id === 'A' ? 'text-red-600' : crit.id === 'B' ? 'text-yellow-400' : 'text-emerald-500'} 
                                            fill="currentColor"
                                            fillOpacity={0.2}
                                          />
                                          <span className="absolute inset-0 flex items-center justify-center text-white font-black text-[10px] pt-1">
                                            {crit.marks}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 px-2 py-1 bg-black/20 rounded border border-white/5">
                                    <div className={`w-2 h-2 rounded-full ${
                                      selectedItems.find(i => i.part.id === focusedPart.id)?.criticality === 'A' ? 'bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)]' :
                                      selectedItems.find(i => i.part.id === focusedPart.id)?.criticality === 'B' ? 'bg-yellow-400' : 'bg-emerald-500'
                                    }`} />
                                    <span className="text-[9px] text-zinc-300 font-bold uppercase tracking-wider">
                                      {selectedItems.find(i => i.part.id === focusedPart.id)?.criticality === 'A' && TRANSLATIONS[reportLanguage].highCriticality}
                                      {selectedItems.find(i => i.part.id === focusedPart.id)?.criticality === 'B' && TRANSLATIONS[reportLanguage].mediumCriticality}
                                      {selectedItems.find(i => i.part.id === focusedPart.id)?.criticality === 'C' && TRANSLATIONS[reportLanguage].lowCriticality}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="space-y-3 mt-6">
                                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">Evidências Fotográficas</span>
                                
                                <div 
                                  ref={sidebarPhotoRef}
                                  className="relative aspect-video bg-black/40 rounded-2xl border border-white/5 overflow-hidden group/photo"
                                >
                                  {selectedItems.find(i => i.part.id === focusedPart.id)?.photo ? (
                                    <>
                                      <img 
                                        src={selectedItems.find(i => i.part.id === focusedPart.id)?.photo} 
                                        className="w-full h-full object-cover"
                                        alt="Evidência"
                                      />
                                      {selectedItems.find(i => i.part.id === focusedPart.id)?.highlights?.map(element => (
                                        <motion.div 
                                          key={`${element.id}-${highlightDragKey}`}
                                          drag={isAdmin}
                                          dragMomentum={false}
                                          onDragEnd={(_, info) => handleHighlightDragEnd(focusedPart.id, element.id, info, sidebarPhotoRef)}
                                          className={`absolute flex items-center justify-center ${isAdmin ? 'cursor-move' : 'pointer-events-none'}`}
                                          style={{
                                            left: `${element.x}%`,
                                            top: `${element.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                            width: (element.type === 'circle' || element.type === 'callout' || element.type === 'crop') ? `${(element.radius || 8) * 2}%` : element.type === 'box' ? `${element.width || 15}%` : '20px',
                                            height: (element.type === 'circle' || element.type === 'callout' || element.type === 'crop') ? undefined : element.type === 'box' ? `${element.height || 15}%` : '20px',
                                            aspectRatio: (element.type === 'circle' || element.type === 'callout' || element.type === 'crop') ? '1/1' : undefined
                                          }}
                                        >
                                          {element.type === 'circle' && (
                                            <div 
                                              className="w-full h-full border-4 rounded-full shadow-lg overflow-hidden flex items-center justify-center bg-white/5"
                                              style={{ borderColor: element.color || '#ef4444', borderWidth: `${element.thickness || 4}px` }}
                                            >
                                              {element.photo && (
                                                <img src={element.photo} className="w-full h-full object-cover" alt="Detail" />
                                              )}
                                            </div>
                                          )}
                                          {(element.type === 'callout' || element.type === 'crop') && (
                                            <div 
                                              className={`w-full h-full border-4 shadow-lg overflow-hidden flex items-center justify-center ${element.type === 'crop' ? 'border-dashed' : 'rounded-full'} ${element.type === 'callout' ? 'bg-white/20' : 'bg-white/5'}`}
                                              style={{ borderColor: element.color || '#ef4444', borderWidth: `${element.thickness || 4}px`, borderRadius: element.type === 'crop' ? '50%' : '9999px' }}
                                            >
                                              {element.type === 'callout' && (
                                                <span style={{ color: element.color || '#ef4444', fontSize: '10px', fontWeight: 'bold' }}>
                                                  {element.text}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                          {element.type === 'arrow' && (
                                            <div style={{ transform: `rotate(${element.rotation || 0}deg)` }} className="relative">
                                              <svg 
                                                width={(element.length || 15) * 2} 
                                                height={(element.thickness || 2) * 6} 
                                                viewBox={`0 0 ${(element.length || 15) * 5} ${(element.thickness || 2) * 15}`}
                                                className="drop-shadow-lg"
                                              >
                                                <defs>
                                                  <marker
                                                    id={`arrowhead-sidebar-${element.id}`}
                                                    markerWidth="10"
                                                    markerHeight="7"
                                                    refX="9"
                                                    refY="3.5"
                                                    orient="auto"
                                                  >
                                                    <polygon points="0 0, 10 3.5, 0 7" fill={element.color || '#ef4444'} />
                                                  </marker>
                                                </defs>
                                                <line
                                                  x1="0"
                                                  y1={(element.thickness || 2) * 7.5}
                                                  x2={(element.length || 15) * 5 - 2}
                                                  y2={(element.thickness || 2) * 7.5}
                                                  stroke={element.color || '#ef4444'}
                                                  strokeWidth={element.thickness || 2}
                                                  markerEnd={`url(#arrowhead-sidebar-${element.id})`}
                                                />
                                              </svg>
                                            </div>
                                          )}
                                          {element.type === 'box' && (
                                            <div 
                                              className="w-full h-full border-2 shadow-lg bg-white/5"
                                              style={{ borderColor: element.color || '#ef4444', borderWidth: `${(element.thickness || 4) / 2}px` }}
                                            />
                                          )}
                                        </motion.div>
                                      ))}
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button 
                                          onClick={() => setEditingHighlightItem(focusedPart.id)}
                                          className="p-3 bg-landcros/20 hover:bg-landcros/40 rounded-full text-landcros transition-all"
                                          title="Abrir Editor de Destaques"
                                        >
                                          <Target size={20} />
                                        </button>
                                        <button 
                                          onClick={() => setIsCameraOpen(true)}
                                          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                                          title="Tirar nova foto"
                                        >
                                          <Camera size={20} />
                                        </button>
                                        
                                        <label className="p-3 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-all" title="Escolher da galeria">
                                          <Upload size={20} className="text-white" />
                                          <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const reader = new FileReader();
                                                reader.onload = async () => {
                                                  const compressed = await compressImage(reader.result as string, 800, 0.6);
                                                  setSelectedItems(prev => {
                                                    const exists = prev.find(item => item.part.id === focusedPart.id);
                                                    if (exists) {
                                                      return prev.map(item => item.part.id === focusedPart.id ? { ...item, photo: compressed } : item);
                                                    }
                                                    return [...prev, { part: focusedPart, type: 'damaged', photo: compressed, timestamp: Date.now() }];
                                                  });
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            }}
                                          />
                                        </label>
                                        
                                        <button 
                                          onClick={() => setSelectedItems(prev => prev.map(item => 
                                            item.part.id === focusedPart.id ? { ...item, photo: undefined } : item
                                          ))}
                                          className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-all"
                                          title="Remover foto"
                                        >
                                          <Trash2 size={20} className="text-red-500" />
                                        </button>
                                      </div>
                                      <div className="space-y-4 mt-8 pt-6 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Target size={14} className="text-landcros" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Destaques e Detalhes</span>
                                          </div>
                                          <button 
                                            onClick={() => setEditingHighlightItem(focusedPart.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-landcros/10 text-landcros rounded-lg hover:bg-landcros/20 transition-all border border-landcros/20"
                                          >
                                            <Plus size={12} />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Novo</span>
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2">
                                          {selectedItems.find(i => i.part.id === focusedPart.id)?.highlights?.map((h, idx) => (
                                            <div 
                                              key={h.id}
                                              className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group relative overflow-hidden"
                                            >
                                              <div className="flex items-center gap-3 relative z-10">
                                                <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                                                  {h.type === 'circle' ? (
                                                    h.photo ? (
                                                      <img src={h.photo} className="w-full h-full object-cover" alt="Detail" />
                                                    ) : (
                                                      <Target size={16} className="text-landcros/50" />
                                                    )
                                                  ) : h.type === 'arrow' ? (
                                                    <ArrowUpRight size={16} className="text-blue-500/50" />
                                                  ) : (
                                                    <Square size={16} className="text-emerald-500/50" />
                                                  )}
                                                </div>
                                                <div>
                                                  <div className="flex items-center gap-2">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-tight">
                                                      {h.type === 'circle' ? 'Círculo' : h.type === 'arrow' ? 'Seta' : 'Caixa'} #{idx + 1}
                                                    </p>
                                                    {h.type === 'circle' && h.photo && (
                                                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                                    )}
                                                  </div>
                                                  <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
                                                    {h.type === 'circle' && (h.photo ? 'Foto de Detalhe OK' : 'Aguardando Foto')}
                                                    {h.type !== 'circle' && 'Marcação Visual'}
                                                  </p>
                                                </div>
                                              </div>
                                              
                                              <div className="flex items-center gap-1.5 relative z-10">
                                                {h.type === 'circle' && !h.photo && (
                                                  <button 
                                                    onClick={() => {
                                                      setEditingHighlightItem(focusedPart.id);
                                                      setSelectedElementId(h.id);
                                                    }}
                                                    className="p-2.5 bg-landcros text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-landcros/20"
                                                    title="Adicionar Foto"
                                                  >
                                                    <Camera size={14} />
                                                  </button>
                                                )}
                                                <button 
                                                  onClick={() => {
                                                    setEditingHighlightItem(focusedPart.id);
                                                    setSelectedElementId(h.id);
                                                  }}
                                                  className="p-2.5 bg-white/10 text-zinc-400 rounded-xl hover:text-white hover:bg-white/20 transition-all border border-white/5"
                                                  title="Editar"
                                                >
                                                  <Edit3 size={14} />
                                                </button>
                                                <button 
                                                  onClick={() => {
                                                    setSelectedItems(prev => prev.map(item => 
                                                      item.part.id === focusedPart.id 
                                                        ? { ...item, highlights: item.highlights?.filter(hl => hl.id !== h.id) } 
                                                        : item
                                                    ));
                                                  }}
                                                  className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/10"
                                                  title="Remover"
                                                >
                                                  <Trash2 size={14} />
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                          
                                          {(!selectedItems.find(i => i.part.id === focusedPart.id)?.highlights || selectedItems.find(i => i.part.id === focusedPart.id)?.highlights?.length === 0) && (
                                            <button 
                                              onClick={() => setEditingHighlightItem(focusedPart.id)}
                                              className="py-8 flex flex-col items-center justify-center gap-3 border border-dashed border-white/10 rounded-2xl hover:bg-white/5 transition-all group"
                                            >
                                              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Plus size={20} className="text-zinc-600" />
                                              </div>
                                              <p className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.2em]">Adicionar Primeiro Destaque</p>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                      <div className="flex gap-4">
                                        <button 
                                          onClick={() => {
                                            setIsCameraOpen(true);
                                            // Ensure item exists in list if taking photo
                                            setSelectedItems(prev => {
                                              if (!prev.find(i => i.part.id === focusedPart.id)) {
                                                return [...prev, { part: focusedPart, type: 'damaged', timestamp: Date.now() }];
                                              }
                                              return prev;
                                            });
                                          }}
                                          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
                                        >
                                          <Camera size={24} className="text-landcros mb-2 group-hover:scale-110 transition-transform" />
                                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Câmera</span>
                                        </button>
                                        
                                        <label className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 cursor-pointer group">
                                          <Upload size={24} className="text-zinc-400 mb-2 group-hover:scale-110 transition-transform" />
                                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Galeria</span>
                                          <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const reader = new FileReader();
                                                reader.onload = async () => {
                                                  const compressed = await compressImage(reader.result as string, 800, 0.6);
                                                  setSelectedItems(prev => {
                                                    const exists = prev.find(item => item.part.id === focusedPart.id);
                                                    if (exists) {
                                                      return prev.map(item => item.part.id === focusedPart.id ? { ...item, photo: compressed } : item);
                                                    }
                                                    return [...prev, { part: focusedPart, type: 'damaged', photo: compressed, timestamp: Date.now() }];
                                                  });
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                      <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Adicionar Evidência</span>
                                    </div>
                                  )}
                                </div>

                                {/* Highlight List in Sidebar */}
                                {selectedItems.find(i => i.part.id === focusedPart.id)?.highlights?.length ? (
                                  <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Destaques e Detalhes</span>
                                      <span className="text-[8px] font-bold bg-landcros/10 text-landcros px-2 py-0.5 rounded uppercase tracking-tighter">
                                        {selectedItems.find(i => i.part.id === focusedPart.id)?.highlights?.length} itens
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                      {selectedItems.find(i => i.part.id === focusedPart.id)?.highlights?.map((h, idx) => (
                                        <div key={h.id} className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group/hitem">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center overflow-hidden bg-black/20" style={{ borderColor: h.color }}>
                                              {h.photo ? (
                                                <img src={h.photo} className="w-full h-full object-cover" alt="Detail" />
                                              ) : (
                                                h.type === 'circle' ? <Target size={12} style={{ color: h.color }} /> : h.type === 'arrow' ? <ArrowUpRight size={12} style={{ color: h.color }} /> : <Square size={12} style={{ color: h.color }} />
                                              )}
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase leading-none mb-1">
                                                {h.type === 'circle' ? `Círculo ${idx + 1}` : h.type === 'arrow' ? `Seta ${idx + 1}` : `Caixa ${idx + 1}`}
                                              </span>
                                              {h.photo && <span className="text-[8px] font-bold text-green-500 uppercase tracking-tighter">Com Foto</span>}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            {h.type === 'circle' && !h.photo && (
                                              <button 
                                                onClick={() => {
                                                  setEditingHighlightItem(focusedPart.id);
                                                  setSelectedElementId(h.id);
                                                }}
                                                className="p-2 bg-landcros/10 text-landcros rounded-lg hover:bg-landcros/20 transition-all"
                                                title="Adicionar Foto"
                                              >
                                                <Camera size={12} />
                                              </button>
                                            )}
                                            <button 
                                              onClick={() => {
                                                setEditingHighlightItem(focusedPart.id);
                                                setSelectedElementId(h.id);
                                              }}
                                              className="p-2 bg-white/5 text-zinc-500 rounded-lg hover:bg-white/10 transition-all"
                                              title="Editar"
                                            >
                                              <Edit3 size={12} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}

                                </div>
                              </div>
                            </motion.div>
                        ) : (
                          <div className="h-full flex flex-col">
                            {/* Mode Switcher & Adjustment Icons */}
                            <div className="mb-6 flex flex-col gap-4">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 flex-1">
                                  <button 
                                    onClick={() => setViewMode('visual')}
                                    className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${viewMode === 'visual' ? 'bg-landcros text-white shadow-lg shadow-landcros/20' : 'text-zinc-500 hover:text-white'}`}
                                  >
                                    Diagrama
                                  </button>
                                  <button 
                                    onClick={() => setViewMode('list')}
                                    className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-landcros text-white shadow-lg shadow-landcros/20' : 'text-zinc-500 hover:text-white'}`}
                                  >
                                    Lista
                                  </button>
                                  {isAdmin && (
                                    <button 
                                      onClick={() => setViewMode('bom')}
                                      className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${viewMode === 'bom' ? 'bg-landcros text-white shadow-lg shadow-landcros/20' : 'text-zinc-500 hover:text-white'}`}
                                    >
                                      BOM
                                    </button>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                    className={`p-2 rounded-lg transition-all border ${isSidebarCollapsed ? 'bg-landcros text-white border-landcros' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                                    title={isSidebarCollapsed ? "Sair da Tela Cheia" : "Tela Cheia"}
                                  >
                                    <Maximize2 size={12} />
                                  </button>
                                  {isAdmin && (
                                    <button 
                                      onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                                      className={`p-2 rounded-lg transition-all border ${isFiltersVisible ? 'bg-landcros text-white border-landcros' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                                      title="Ajustes de Cor"
                                    >
                                      <Palette size={12} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => setIsBlueprintMode(!isBlueprintMode)}
                                    className={`p-2 rounded-lg transition-all border ${isBlueprintMode ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                                    title="Modo Blueprint"
                                  >
                                    <Lightbulb size={12} />
                                  </button>
                                </div>
                              </div>

                              {/* New Compact Zoom Controls - Horizontal Proportional */}
                              <div className="flex justify-end pr-1">
                                <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl border border-white/10 flex items-center h-11 shadow-2xl overflow-hidden">
                                  <div className="bg-landcros h-full flex items-center px-2 gap-3">
                                    <button 
                                      onClick={handleZoomIn}
                                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-all"
                                      title="Aumentar Zoom"
                                    >
                                      <Plus size={18} />
                                    </button>
                                    <div className="w-px h-4 bg-white/20" />
                                    <button 
                                      onClick={handleZoomOut}
                                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-all"
                                      title="Diminuir Zoom"
                                    >
                                      <Minus size={18} />
                                    </button>
                                    <div className="w-px h-4 bg-white/20" />
                                    <button 
                                      onClick={handleRotateCcw}
                                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-all"
                                      title="Girar Anti-horário"
                                    >
                                      <RotateCcw size={16} />
                                    </button>
                                    <button 
                                      onClick={handleRotateCw}
                                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-all"
                                      title="Girar Horário"
                                    >
                                      <RotateCw size={16} />
                                    </button>
                                    <div className="w-px h-4 bg-white/20" />
                                    <button 
                                      onClick={handleResetZoom}
                                      className="h-8 px-3 flex items-center justify-center gap-2 text-white hover:bg-white/10 rounded-lg transition-all group"
                                      title="Resetar Zoom e Rotação"
                                    >
                                      <Maximize2 size={16} className="group-hover:scale-110 transition-transform" />
                                      <span className="text-[9px] font-black uppercase tracking-widest">Reset</span>
                                    </button>
                                  </div>
                                  <div className="px-4 bg-zinc-800/50 h-full flex items-center border-l border-white/5">
                                    <span className="text-[11px] font-black text-white/80 tabular-nums">
                                      {Math.round(currentConfig.scale * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mb-6 space-y-4">
                              <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1 flex flex-col gap-1.5">
                                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">Item #</span>
                                  <div className="relative">
                                    <input 
                                      type="text"
                                      placeholder="00"
                                      value={itemSearchTerm}
                                      onFocus={(e) => e.target.select()}
                                      onChange={(e) => setItemSearchTerm(e.target.value.toUpperCase())}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white font-mono font-bold outline-none focus:border-landcros transition-all text-center"
                                    />
                                    {itemSearchTerm && (
                                      <button 
                                        onClick={() => setItemSearchTerm('')}
                                        className="absolute -right-2 -top-2 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 shadow-lg z-20"
                                      >
                                        <X size={10} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <div className="col-span-2 flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between ml-1">
                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Busca Geral</span>
                                    {(searchTerm || itemSearchTerm) && (
                                      <button 
                                        onClick={() => {
                                          setSearchTerm('');
                                          setItemSearchTerm('');
                                        }}
                                        className="text-[7px] font-black text-landcros hover:text-white uppercase tracking-tighter transition-colors"
                                      >
                                        Limpar Filtros
                                      </button>
                                    )}
                                  </div>
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
                                    <input 
                                      type="text"
                                      placeholder="Part # ou Descrição"
                                      value={searchTerm}
                                      onFocus={(e) => e.target.select()}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white outline-none focus:border-landcros transition-all"
                                    />
                                    {searchTerm && (
                                      <button 
                                        onClick={() => setSearchTerm('')}
                                        className="absolute -right-2 -top-2 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 shadow-lg z-20"
                                      >
                                        <X size={10} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar h-full">
                              {filteredParts.map(part => (
                                <motion.button
                                  key={part.id}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => {
                                    setFocusedPart(part);
                                    setSearchTerm('');
                                    setItemSearchTerm('');
                                  }}
                                  className="w-full flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-landcros/30 transition-all group text-left shrink-0 shadow-lg relative overflow-hidden"
                                >
                                  <div className="absolute top-0 right-0 w-20 h-20 bg-landcros/5 rounded-bl-[50px] -mr-5 -mt-5 blur-xl group-hover:bg-landcros/10 transition-all" />
                                  
                                  <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 font-mono text-base font-black group-hover:bg-landcros group-hover:text-white transition-all shadow-inner">
                                        {part.itemNumber}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[7px] font-mono text-landcros font-bold uppercase tracking-[0.1em]">Part Number</span>
                                        <h4 className="text-sm font-black text-white tracking-tighter leading-none">{part.partNumber}</h4>
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      {isSelected(part.id, 'order') && (
                                        <div className="w-5 h-5 rounded-full bg-landcros/20 flex items-center justify-center text-landcros border border-landcros/20">
                                          <ShoppingCart size={8} />
                                        </div>
                                      )}
                                      {isSelected(part.id, 'damaged') && (
                                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/20">
                                          <AlertTriangle size={8} />
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="relative z-10 pl-10">
                                    <p className="text-zinc-400 text-[10px] italic leading-tight line-clamp-1">{part.description}</p>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="p-4 bg-black/20 border-t border-white/5 flex justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>{TRANSLATIONS[reportLanguage].orders}: {orderList.length}</span>
                      <span>{TRANSLATIONS[reportLanguage].damages}: {damagedList.length}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {(activeTab === 'order' || activeTab === 'damaged') && (
          <div className="p-4 md:p-12 max-w-4xl mx-auto space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <button 
                  onClick={() => setActiveTab('inspect')}
                  className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4"
                >
                  <ArrowLeft size={14} /> {TRANSLATIONS[reportLanguage].backToInspect}
                </button>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white italic uppercase">
                  {activeTab === 'order' ? TRANSLATIONS[reportLanguage].orderList : TRANSLATIONS[reportLanguage].damageReport}
                </h2>
              </div>
              <button 
                onClick={exportToPDF}
                disabled={(activeTab === 'order' ? orderList : damagedList).length === 0}
                className="bg-white text-black px-6 py-3 md:py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                <Download size={16} /> {TRANSLATIONS[reportLanguage].exportPDF}
              </button>
            </div>

            <div className="space-y-4">
              {(activeTab === 'order' ? orderList : damagedList).length > 0 ? (
                (activeTab === 'order' ? orderList : damagedList).map(({ part, timestamp, quantity }) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`${part.id}-${activeTab}`} 
                    className="group bg-[#141414]/80 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:border-white/20 transition-all"
                  >
                    <div className="flex gap-6 items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === 'order' ? 'bg-landcros/10 text-landcros' : 'bg-red-500/10 text-red-500'}`}>
                        {activeTab === 'order' ? <ShoppingCart size={24} /> : <AlertTriangle size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/5 text-zinc-400 rounded uppercase tracking-wider">
                            Sheet {part.sheet}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/5 text-zinc-400 rounded uppercase tracking-wider">
                            Item {part.itemNumber}
                          </span>
                          {part.id.includes('-clone-') && (
                            <span className="text-[8px] font-black bg-landcros/20 text-landcros px-2 py-0.5 rounded uppercase tracking-tighter">
                              Cópia
                            </span>
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-white tracking-tight">{part.partNumber}</h4>
                        <p className="text-sm text-zinc-500 font-mono italic">{part.description}</p>
                        {part.photo && (
                          <div className="mt-3 w-32 aspect-video rounded-lg overflow-hidden border border-white/10">
                            <img src={part.photo} className="w-full h-full object-cover" alt="Inspeção" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {activeTab === 'order' && (
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
                          <button 
                            onClick={() => setQuantity(part.id, 'order', (quantity || 1) - 1)}
                            className="p-2 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm font-black text-white w-8 text-center">{quantity || 1}</span>
                          <button 
                            onClick={() => setQuantity(part.id, 'order', (quantity || 1) + 1)}
                            className="p-2 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      )}

                      <button 
                        onClick={() => toggleItem(part, activeTab)}
                        className="p-3 text-zinc-700 hover:text-red-500 transition-colors"
                      >
                        <XCircle size={24} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 text-center space-y-6 opacity-20">
                  <ClipboardList size={64} className="mx-auto" />
                  <p className="text-xl font-bold tracking-tight">{TRANSLATIONS[reportLanguage].noItems}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Câmera ao Vivo</span>
              </div>
              <button 
                onClick={stopCamera}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-950">
              {!cameraStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
                  <div className="w-12 h-12 border-4 border-landcros/20 border-t-landcros rounded-full animate-spin" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Iniciando Câmera...</span>
                </div>
              )}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              {/* Camera Overlay UI */}
              <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/20 rounded-3xl" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-landcros m-4" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-landcros m-4" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-landcros m-4" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-landcros m-4" />
              </div>
            </div>

            <div className="p-12 bg-black flex items-center justify-center gap-12">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-40">
                <ImageIcon size={20} className="text-white" />
              </div>
              
              <button 
                onClick={capturePhoto}
                className="w-24 h-24 rounded-full border-4 border-white/20 p-1 hover:scale-105 transition-transform active:scale-95"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-black/5" />
                </div>
              </button>

              <button 
                onClick={toggleCamera}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paste BOM Modal */}
      <AnimatePresence>
        {isPasteBomModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsPasteBomModalOpen(false);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl my-auto max-h-[95vh] flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Colar Dados do BOM</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Copie e cole as colunas da tabela (Excel, PDF, etc.)</p>
                </div>
                <button 
                  onClick={() => setIsPasteBomModalOpen(false)} 
                  className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all border border-white/10"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <textarea 
                  value={bomPasteText}
                  onChange={(e) => setBomPasteText(e.target.value)}
                  placeholder="Cole aqui os dados da tabela...&#10;Exemplo:&#10;02 A852244 ELBOW;S&#10;02A 4506418 O-RING"
                  className="w-full h-64 bg-black/40 border border-white/10 rounded-2xl p-6 text-white font-mono text-sm focus:outline-none focus:border-landcros transition-all resize-none"
                />
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsPasteBomModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handlePasteBom}
                    className="flex-1 py-4 rounded-2xl bg-landcros text-white font-bold text-xs uppercase tracking-widest hover:bg-landcros/90 transition-all shadow-lg shadow-landcros/20"
                  >
                    Importar Peças
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paste Categories Modal */}
      <AnimatePresence>
        {isPasteCategoriesModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsPasteCategoriesModalOpen(false);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl my-auto max-h-[95vh] flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Colar Lista de Sheets</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Copie e cole a lista de nomes das abas (uma por linha)</p>
                </div>
                <button 
                  onClick={() => setIsPasteCategoriesModalOpen(false)} 
                  className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all border border-white/10"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <textarea 
                  value={categoriesPasteText}
                  onChange={(e) => setCategoriesPasteText(e.target.value)}
                  placeholder="Cole aqui a lista de sheets...&#10;Exemplo:&#10;OIL COOLER&#10;FAN DRIVE&#10;FAN DRIVE PIPING"
                  className="w-full h-64 bg-black/40 border border-white/10 rounded-2xl p-6 text-white font-mono text-sm focus:outline-none focus:border-landcros transition-all resize-none"
                />
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsPasteCategoriesModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handlePasteCategories}
                    className="flex-1 py-4 rounded-2xl bg-landcros text-white font-bold text-xs uppercase tracking-widest hover:bg-landcros/90 transition-all shadow-lg shadow-landcros/20"
                  >
                    Importar Sheets
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sheet List Modal */}
      <AnimatePresence>
        {isSheetListModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsSheetListModalOpen(false);
                setSheetSearchTerm('');
              }
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl my-auto max-h-[95vh] flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-900 z-20">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Lista de Sheets</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{visibleCategories.length} abas disponíveis</p>
                </div>
                <button 
                  onClick={() => { setIsSheetListModalOpen(false); setSheetSearchTerm(''); }} 
                  className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all border border-white/10"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search Input */}
              <div className="px-8 py-4 border-b border-white/5 bg-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="BUSCAR SHEET PELO NOME..." 
                    value={sheetSearchTerm}
                    onChange={(e) => setSheetSearchTerm(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-10 py-2 text-[10px] font-bold text-white outline-none focus:border-landcros uppercase tracking-widest"
                  />
                  {sheetSearchTerm && (
                    <button 
                      onClick={() => setSheetSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="px-8 py-4 border-b border-white/5 bg-white/5">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="NOME DO NOVO GRUPO..." 
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white outline-none focus:border-landcros uppercase tracking-widest"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const name = e.currentTarget.value.trim().toUpperCase();
                        if (name && !categoryGroups[name]) {
                          setCategoryGroups(prev => ({ ...prev, [name]: [] }));
                          setSelectedGroups(prev => [...prev, name]);
                          setSelectedGroup(name);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                      const name = input.value.trim().toUpperCase();
                      if (name && !categoryGroups[name]) {
                        setCategoryGroups(prev => ({ ...prev, [name]: [] }));
                        setSelectedGroups(prev => [...prev, name]);
                        setSelectedGroup(name);
                        input.value = '';
                      }
                    }}
                    className="p-2 bg-landcros text-white rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="space-y-6">
                  {sortedGroupNames.map(group => {
                    const allGroupCats = categoryGroups[group].map(c => c.toLowerCase());
                    const groupCats = visibleCategories.filter(cat => 
                      allGroupCats.includes(cat.toLowerCase()) &&
                      (!sheetSearchTerm || cat.toLowerCase().includes(sheetSearchTerm.toLowerCase()))
                    );

                    if (sheetSearchTerm && groupCats.length === 0) return null;

                    if (!isAdmin) {
                      const hasRestrictions = selectedGroups.length > 0;
                      if (hasRestrictions && !selectedGroups.includes(group)) return null;
                      if (groupCats.length === 0) return null;
                    }

                    return (
                      <div key={group} className="space-y-2">
                        <div 
                          className={`flex items-center justify-between px-4 py-1 bg-white/5 rounded-lg transition-all ${
                            dragOverGroup === group ? 'scale-105 ring-2 ring-landcros ring-offset-2 ring-offset-black rounded-md z-50' : ''
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (isAdmin) setDragOverGroup(group);
                          }}
                          onDragLeave={() => setDragOverGroup(null)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverGroup(null);
                            const category = e.dataTransfer.getData('category');
                            if (category && category !== group) {
                              moveCategoryToGroup(category, group);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Folder size={12} className="text-landcros" />
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{group}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            {isAdmin && !selectedGroups.includes(group) && (
                              <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">Grupo Oculto</span>
                            )}
                            {isAdmin && (
                              <button 
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja excluir o grupo "${group}"? As sheets dentro dele não serão apagadas, mas ficarão sem grupo.`)) {
                                    setCategoryGroups(prev => {
                                      const next = { ...prev };
                                      delete next[group];
                                      return next;
                                    });
                                    setSelectedGroups(prev => prev.filter(g => g !== group));
                                  }
                                }}
                                className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={10} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="px-2 py-1 flex gap-2">
                          <input 
                            type="text" 
                            placeholder="ADICIONAR SHEET NESTE GRUPO..." 
                            className="flex-1 bg-black/20 border border-white/5 rounded-lg px-3 py-1.5 text-[8px] font-bold text-white outline-none focus:border-landcros/50 uppercase tracking-widest"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const name = e.currentTarget.value.trim();
                                if (name) {
                                  handleAddCategory(name, group);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                          <button 
                            onClick={(e) => {
                              const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                              const name = input.value.trim();
                              if (name) {
                                handleAddCategory(name, group);
                                input.value = '';
                              }
                            }}
                            className="p-1.5 bg-white/5 text-zinc-400 rounded-lg hover:bg-landcros hover:text-white transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-1 pl-2">
                          {groupCats.map(cat => (
                            <div 
                              key={cat}
                              draggable={isAdmin}
                              onDragStart={(e) => {
                                e.dataTransfer.setData('category', cat);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              className={`w-full rounded-xl transition-all flex items-center group cursor-grab active:cursor-grabbing ${
                                selectedCategory === cat 
                                  ? 'bg-landcros text-white' 
                                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <button
                                onClick={() => {
                                  setSelectedGroup(group);
                                  setSelectedCategory(cat);
                                  setFocusedPart(null);
                                  setSearchTerm('');
                                  setItemSearchTerm('');
                                  setSheetSearchTerm('');
                                  setIsSheetListModalOpen(false);
                                }}
                                className="flex-1 text-left px-4 py-3 font-bold uppercase tracking-widest text-[9px] flex items-center justify-between"
                              >
                                <span className={!isAdmin && !selectedCategories.includes(cat) ? 'line-through opacity-50' : ''}>
                                  {categoryRenames[cat] || cat}
                                  {isAdmin && !selectedCategories.includes(cat) && (
                                    <span className="ml-2 text-[7px] bg-red-500/20 text-red-500 px-1 rounded">OCULTO</span>
                                  )}
                                </span>
                                {selectedCategory === cat && <Check size={12} />}
                              </button>
                              
                              {isAdmin && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const isSelected = selectedCategories.includes(cat);
                                    if (isSelected) {
                                      setSelectedCategories(prev => prev.filter(c => c !== cat));
                                    } else {
                                      setSelectedCategories(prev => [...prev, cat]);
                                    }
                                  }}
                                  className={`p-3 border-l border-white/5 hover:bg-white/10 transition-colors ${selectedCategories.includes(cat) ? 'text-green-500' : 'text-zinc-600'}`}
                                  title={selectedCategories.includes(cat) ? "Ocultar de Usuário" : "Mostrar para Usuário"}
                                >
                                  {selectedCategories.includes(cat) ? <Eye size={14} /> : <EyeOff size={14} />}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-6 border-t border-white/5">
                <button 
                  onClick={() => setIsSheetListModalOpen(false)}
                  className="w-full py-4 rounded-2xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
