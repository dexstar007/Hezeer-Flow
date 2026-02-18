export type Language = 'en' | 'es';

export interface Translations {
  // Header
  appName: string;
  searchPlaceholder: string;
  newNote: string;
  graphView: string;
  exportVault: string;
  importVault: string;

  // Sidebar
  documents: string;
  tags: string;
  allTags: string;
  noDocuments: string;
  noTags: string;
  untitledNote: string;

  // Editor
  editor: string;
  preview: string;
  typeSlashForTemplates: string;
  save: string;
  cancel: string;
  deleteNote: string;
  confirmDelete: string;

  // Templates
  dailyNote: string;
  meetingTemplate: string;
  projectPlan: string;

  // AI Panel
  aiAssistant: string;
  chat: string;
  meetingSummarizer: string;
  ocrVision: string;
  ragChat: string;
  askQuestion: string;
  uploadAudio: string;
  uploadImage: string;
  uploadPdf: string;
  transcribing: string;
  analyzing: string;
  processing: string;

  // Backlinks
  mentionedIn: string;
  noBacklinks: string;

  // Graph
  knowledgeGraph: string;
  nodes: string;
  links: string;

  // Empty States
  noNotesYet: string;
  clickPlusToStart: string;
  noAiMessages: string;
  startConversation: string;

  // Buttons
  create: string;
  edit: string;
  delete: string;
  search: string;
  filter: string;
  clear: string;
  send: string;

  // Messages
  noteCreated: string;
  noteUpdated: string;
  noteDeleted: string;
  errorSaving: string;
  errorDeleting: string;

  // Onboarding
  welcome: string;
  welcomeDescription: string;
  enterApiKey: string;
  apiKeyPlaceholder: string;
  getStarted: string;
  skipForNow: string;

  // Meeting Features
  topics: string;
  actionItems: string;
  decisions: string;
  attendees: string;
  date: string;

  // Smart Editing
  summarize: string;
  formalize: string;
  translate: string;
  expand: string;
  simplify: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    appName: 'HezeerFlow',
    searchPlaceholder: 'Search notes...',
    newNote: 'New Note',
    graphView: 'Graph View',
    exportVault: 'Export Vault',
    importVault: 'Import Vault',

    // Sidebar
    documents: 'Documents',
    tags: 'Tags',
    allTags: 'All Tags',
    noDocuments: 'No documents yet',
    noTags: 'No tags yet',
    untitledNote: 'Untitled Note',

    // Editor
    editor: 'Editor',
    preview: 'Preview',
    typeSlashForTemplates: 'Type / for templates',
    save: 'Save',
    cancel: 'Cancel',
    deleteNote: 'Delete Note',
    confirmDelete: 'Are you sure you want to delete this note?',

    // Templates
    dailyNote: 'Daily Note',
    meetingTemplate: 'Meeting Template',
    projectPlan: 'Project Plan',

    // AI Panel
    aiAssistant: 'AI Assistant',
    chat: 'Chat',
    meetingSummarizer: 'Meeting Summarizer',
    ocrVision: 'OCR / Vision',
    ragChat: 'Chat with Notes',
    askQuestion: 'Ask a question about your notes...',
    uploadAudio: 'Upload Audio (MP3/WAV)',
    uploadImage: 'Upload Image',
    uploadPdf: 'Upload PDF',
    transcribing: 'Transcribing...',
    analyzing: 'Analyzing...',
    processing: 'Processing...',

    // Backlinks
    mentionedIn: 'Mentioned in...',
    noBacklinks: 'No backlinks yet',

    // Graph
    knowledgeGraph: 'Knowledge Graph',
    nodes: 'Nodes',
    links: 'Links',

    // Empty States
    noNotesYet: 'No notes yet',
    clickPlusToStart: 'Click + to start',
    noAiMessages: 'No messages yet',
    startConversation: 'Start a conversation with AI...',

    // Buttons
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    send: 'Send',

    // Messages
    noteCreated: 'Note created successfully',
    noteUpdated: 'Note updated successfully',
    noteDeleted: 'Note deleted successfully',
    errorSaving: 'Error saving note',
    errorDeleting: 'Error deleting note',

    // Onboarding
    welcome: 'Welcome to HezeerFlow',
    welcomeDescription: 'Your personal knowledge base powered by AI. Connect your ideas, chat with your notes, and let AI help you organize your thoughts.',
    enterApiKey: 'Enter your GLM API Key',
    apiKeyPlaceholder: 'glm-xxxxxxxxxxxxxxxx',
    getStarted: 'Get Started',
    skipForNow: 'Skip for Now',

    // Meeting Features
    topics: 'Topics',
    actionItems: 'Action Items',
    decisions: 'Decisions',
    attendees: 'Attendees',
    date: 'Date',

    // Smart Editing
    summarize: 'Summarize',
    formalize: 'Formalize',
    translate: 'Translate',
    expand: 'Expand',
    simplify: 'Simplify',
  },
  es: {
    // Header
    appName: 'HezeerFlow',
    searchPlaceholder: 'Buscar notas...',
    newNote: 'Nueva Nota',
    graphView: 'Vista de Gráfico',
    exportVault: 'Exportar Bóveda',
    importVault: 'Importar Bóveda',

    // Sidebar
    documents: 'Documentos',
    tags: 'Etiquetas',
    allTags: 'Todas las Etiquetas',
    noDocuments: 'Aún no hay documentos',
    noTags: 'Aún no hay etiquetas',
    untitledNote: 'Nota Sin Título',

    // Editor
    editor: 'Editor',
    preview: 'Vista Previa',
    typeSlashForTemplates: 'Escribe / para plantillas',
    save: 'Guardar',
    cancel: 'Cancelar',
    deleteNote: 'Eliminar Nota',
    confirmDelete: '¿Estás seguro de que quieres eliminar esta nota?',

    // Templates
    dailyNote: 'Nota Diaria',
    meetingTemplate: 'Plantilla de Reunión',
    projectPlan: 'Plan de Proyecto',

    // AI Panel
    aiAssistant: 'Asistente IA',
    chat: 'Chat',
    meetingSummarizer: 'Resumen de Reuniones',
    ocrVision: 'OCR / Visión',
    ragChat: 'Chat con Notas',
    askQuestion: 'Haz una pregunta sobre tus notas...',
    uploadAudio: 'Subir Audio (MP3/WAV)',
    uploadImage: 'Subir Imagen',
    uploadPdf: 'Subir PDF',
    transcribing: 'Transcribiendo...',
    analyzing: 'Analizando...',
    processing: 'Procesando...',

    // Backlinks
    mentionedIn: 'Mencionado en...',
    noBacklinks: 'Aún no hay enlaces inversos',

    // Graph
    knowledgeGraph: 'Gráfico de Conocimiento',
    nodes: 'Nodos',
    links: 'Enlaces',

    // Empty States
    noNotesYet: 'Aún no hay notas',
    clickPlusToStart: 'Haz clic en + para comenzar',
    noAiMessages: 'Aún no hay mensajes',
    startConversation: 'Inicia una conversación con la IA...',

    // Buttons
    create: 'Crear',
    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Buscar',
    filter: 'Filtrar',
    clear: 'Limpiar',
    send: 'Enviar',

    // Messages
    noteCreated: 'Nota creada exitosamente',
    noteUpdated: 'Nota actualizada exitosamente',
    noteDeleted: 'Nota eliminada exitosamente',
    errorSaving: 'Error al guardar la nota',
    errorDeleting: 'Error al eliminar la nota',

    // Onboarding
    welcome: 'Bienvenido a HezeerFlow',
    welcomeDescription: 'Tu base de conocimientos personal potenciada por IA. Conecta tus ideas, chatea con tus notas y deja que la IA te ayude a organizar tus pensamientos.',
    enterApiKey: 'Ingresa tu clave de API de GLM',
    apiKeyPlaceholder: 'glm-xxxxxxxxxxxxxxxx',
    getStarted: 'Comenzar',
    skipForNow: 'Omitir por Ahora',

    // Meeting Features
    topics: 'Temas',
    actionItems: 'Elementos de Acción',
    decisions: 'Decisiones',
    attendees: 'Asistentes',
    date: 'Fecha',

    // Smart Editing
    summarize: 'Resumir',
    formalize: 'Formalizar',
    translate: 'Traducir',
    expand: 'Expandir',
    simplify: 'Simplificar',
  },
};
