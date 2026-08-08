// ─────────────────────────────────────────────
// i18n Context - Multi-language Support
// Languages: Indonesian (id), English (en)
// ─────────────────────────────────────────────
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Locale = 'id' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation dictionaries - Updated 2026
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // App Brand
    'app.name': 'Wee Wok The Tok',
    'app.tagline': 'Discover and deploy services instantly.',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.marketplace': 'Marketplace',
    'nav.deployments': 'Deployments',
    'nav.projects': 'Projects',
    'nav.settings': 'Settings',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Header
    'header.notifications': 'Notifications',
    'header.lightMode': 'Switch to light mode',
    'header.darkMode': 'Switch to dark mode',
    'header.profile': 'Profile',
    'header.signOut': 'Sign out',
    
    // Marketplace
    'marketplace.title': 'Marketplace',
    'marketplace.subtitle': 'Search, deploy, and manage your infrastructure.',
    'marketplace.searchPlaceholder': 'Search services, databases, tools...',
    'marketplace.searchButton': 'Search',
    'marketplace.categories': 'Categories',
    'marketplace.categoriesSubtitle': 'Explore services by category',
    'marketplace.services': 'Services',
    'marketplace.servicesFound': '{{count}} services found',
    'marketplace.noServices': 'No services found',
    'marketplace.adjustFilters': 'Try adjusting your search or filters',
    'marketplace.viewMode.grid': 'Grid view',
    'marketplace.viewMode.list': 'List view',
    'marketplace.deploy': 'Deploy',
    'marketplace.deploying': 'Deploying...',
    'marketplace.maturity.stable': 'Stable',
    'marketplace.maturity.beta': 'Beta',
    'marketplace.maturity.alpha': 'Alpha',
    'marketplace.pricing.free': 'Free',
    'marketplace.pricing.freemium': 'Freemium',
    'marketplace.pricing.paid': 'Paid',
    
    // Categories
    'category.automation': 'Automation',
    'category.ai-ml': 'AI/ML',
    'category.databases': 'Databases',
    'category.monitoring': 'Monitoring',
    'category.storage': 'Storage',
    'category.networking': 'Networking',
    'category.security': 'Security',
    'category.identity': 'Identity',
    'category.developer-tools': 'Dev Tools',
    'category.ci-cd': 'CI/CD',
    'category.search': 'Search',
    
    // Service detail
    'service.version': 'v{{version}}',
    'service.stars': '⭐ {{stars}}',
    'service.tags': 'Tags',
    'service.deployButton': 'Deploy',
    'service.startButton': 'Start',
    'service.stopButton': 'Stop',
    'service.restartButton': 'Restart',
    'service.scaleButton': 'Scale',
    'service.logs': 'Logs',
    'service.metrics': 'Metrics',
    'service.deployment': 'Deployment',
    'service.health': 'Health',
    'service.resources': 'Resources',
    
    // Dashboard
    'dashboard.title': 'Wee Wok The Tok',
    'dashboard.subtitle': 'Discover and deploy services instantly. Search, deploy, and manage your infrastructure.',
    'dashboard.categories': 'Categories',
    'dashboard.categoriesSubtitle': 'Explore services by category',
    'dashboard.featuredServices': 'Featured Services',
    'dashboard.featuredSubtitle': 'Popular services deployed this week',
    'dashboard.resourceUsage': 'Resource Usage',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.recentServices': 'Recent Services',
    'dashboard.deployNewService': 'Deploy New Service',
    'dashboard.addDatabase': 'Add Database',
    'dashboard.viewMetrics': 'View Metrics',
    'dashboard.manageBackups': 'Manage Backups',
    'dashboard.viewAll': 'View All',
    'dashboard.cpuUsage': 'CPU Usage',
    'dashboard.memory': 'Memory',
    'dashboard.disk': 'Disk',
    'dashboard.network': 'Network',
    
    // Deployments
    'deployments.title': 'Deployments',
    'deployments.status.running': 'Running',
    'deployments.status.stopped': 'Stopped',
    'deployments.status.deploying': 'Deploying',
    'deployments.status.failed': 'Failed',
    'deployments.cancel': 'Cancel',
    
    // Projects
    'projects.title': 'Projects',
    'projects.create': 'Create Project',
    'projects.name': 'Name',
    'projects.slug': 'Slug',
    'projects.description': 'Description',
    'projects.quotas': 'Quotas',
    'projects.members': 'Members',
    'projects.invite': 'Invite',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.appearance': 'Appearance',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signIn': 'Sign in',
    'auth.signUp': 'Sign up',
    
    // Common
    'common.all': 'All',
    'common.service': 'Service',
    'common.status': 'Status',
    'common.memory': 'Memory',
    'common.uptime': 'Uptime',
    'common.actions': 'Actions',
    'common.collapse': 'Collapse',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
    
    // Sharing
    'share.title': 'Share Deployment',
    'share.description': 'Share your deployed service with others',
    'share.copyLink': 'Copy Link',
    'share.copied': 'Link copied!',
    'share.qrCode': 'QR Code',
    'share.publicUrl': 'Public URL',
    'share.expires': 'Expires in {{time}}',
    'share.neverExpires': 'Never expires',
    
    // Footer
    'footer.openSource': 'Open source',
    'footer.selfHosted': 'Self-hosted',
    'footer.byoai': 'Bring your own AI',
  },
  
  id: {
    // App Brand
    'app.name': 'Wee Wok The Tok',
    'app.tagline': 'Temukan dan sebarkan layanan secara instan.',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.marketplace': 'Marketplace',
    'nav.deployments': 'Penempatan',
    'nav.projects': 'Proyek',
    'nav.settings': 'Pengaturan',
    'nav.login': 'Masuk',
    'nav.register': 'Daftar',
    
    // Header
    'header.notifications': 'Notifikasi',
    'header.lightMode': 'Beralih ke mode terang',
    'header.darkMode': 'Beralih ke mode gelap',
    'header.profile': 'Profil',
    'header.signOut': 'Keluar',
    
    // Marketplace
    'marketplace.title': 'Marketplace',
    'marketplace.subtitle': 'Cari, sebarkan, dan kelola infrastruktur Anda.',
    'marketplace.searchPlaceholder': 'Cari layanan, database, alat...',
    'marketplace.searchButton': 'Cari',
    'marketplace.categories': 'Kategori',
    'marketplace.categoriesSubtitle': 'Jelajahi layanan berdasarkan kategori',
    'marketplace.services': 'Layanan',
    'marketplace.servicesFound': '{{count}} layanan ditemukan',
    'marketplace.noServices': 'Tidak ada layanan ditemukan',
    'marketplace.adjustFilters': 'Coba atur pencarian atau filter Anda',
    'marketplace.viewMode.grid': 'Tampilan grid',
    'marketplace.viewMode.list': 'Tampilan daftar',
    'marketplace.deploy': 'Sebarkan',
    'marketplace.deploying': 'Menebarkan...',
    'marketplace.maturity.stable': 'Stabil',
    'marketplace.maturity.beta': 'Beta',
    'marketplace.maturity.alpha': 'Alpha',
    'marketplace.pricing.free': 'Gratis',
    'marketplace.pricing.freemium': 'Freemium',
    'marketplace.pricing.paid': 'Berbayar',
    
    // Categories
    'category.automation': 'Otomatisasi',
    'category.ai-ml': 'AI/ML',
    'category.databases': 'Database',
    'category.monitoring': 'Monitoring',
    'category.storage': 'Penyimpanan',
    'category.networking': 'Jaringan',
    'category.security': 'Keamanan',
    'category.identity': 'Identitas',
    'category.developer-tools': 'Alat Dev',
    'category.ci-cd': 'CI/CD',
    'category.search': 'Pencarian',
    
    // Service detail
    'service.version': 'v{{version}}',
    'service.stars': '⭐ {{stars}}',
    'service.tags': 'Tag',
    'service.deployButton': 'Sebarkan',
    'service.startButton': 'Mulai',
    'service.stopButton': 'Berhenti',
    'service.restartButton': 'Restart',
    'service.scaleButton': 'Skala',
    'service.logs': 'Log',
    'service.metrics': 'Metrik',
    'service.deployment': 'Penempatan',
    'service.health': 'Kesehatan',
    'service.resources': 'Sumber Daya',
    
    // Dashboard
    'dashboard.title': 'Wee Wok The Tok',
    'dashboard.subtitle': 'Temukan dan sebarkan layanan secara instan. Cari, sebarkan, dan kelola infrastruktur Anda.',
    'dashboard.categories': 'Kategori',
    'dashboard.categoriesSubtitle': 'Jelajahi layanan berdasarkan kategori',
    'dashboard.featuredServices': 'Layanan Unggulan',
    'dashboard.featuredSubtitle': 'Layanan populer yang dideploy minggu ini',
    'dashboard.resourceUsage': 'Penggunaan Sumber Daya',
    'dashboard.quickActions': 'Aksi Cepat',
    'dashboard.recentServices': 'Layanan Terbaru',
    'dashboard.deployNewService': 'Sebarkan Layanan Baru',
    'dashboard.addDatabase': 'Tambah Database',
    'dashboard.viewMetrics': 'Lihat Metrik',
    'dashboard.manageBackups': 'Kelola Backup',
    'dashboard.viewAll': 'Lihat Semua',
    'dashboard.cpuUsage': 'Penggunaan CPU',
    'dashboard.memory': 'Memori',
    'dashboard.disk': 'Disk',
    'dashboard.network': 'Jaringan',
    
    // Deployments
    'deployments.title': 'Penempatan',
    'deployments.status.running': 'Berjalan',
    'deployments.status.stopped': 'Berhenti',
    'deployments.status.deploying': 'Menebarkan',
    'deployments.status.failed': 'Gagal',
    'deployments.cancel': 'Batal',
    
    // Projects
    'projects.title': 'Proyek',
    'projects.create': 'Buat Proyek',
    'projects.name': 'Nama',
    'projects.slug': 'Slug',
    'projects.description': 'Deskripsi',
    'projects.quotas': 'Kuota',
    'projects.members': 'Anggota',
    'projects.invite': 'Undang',
    
    // Settings
    'settings.title': 'Pengaturan',
    'settings.language': 'Bahasa',
    'settings.theme': 'Tema',
    'settings.appearance': 'Tampilan',
    'settings.light': 'Terang',
    'settings.dark': 'Gelap',
    'settings.system': 'Sistem',
    
    // Auth
    'auth.login': 'Masuk',
    'auth.register': 'Daftar',
    'auth.email': 'Email',
    'auth.password': 'Kata Sandi',
    'auth.name': 'Nama',
    'auth.confirmPassword': 'Konfirmasi Kata Sandi',
    'auth.forgotPassword': 'Lupa kata sandi?',
    'auth.noAccount': 'Belum punya akun?',
    'auth.hasAccount': 'Sudah punya akun?',
    'auth.signIn': 'Masuk',
    'auth.signUp': 'Daftar',
    
    // Common
    'common.all': 'Semua',
    'common.service': 'Layanan',
    'common.status': 'Status',
    'common.memory': 'Memori',
    'common.uptime': 'Waktu Aktif',
    'common.actions': 'Aksi',
    'common.collapse': 'Kolaps',
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.view': 'Lihat',
    'common.loading': 'Memuat...',
    'common.error': 'Kesalahan',
    'common.success': 'Berhasil',
    'common.confirm': 'Konfirmasi',
    'common.close': 'Tutup',
    'common.back': 'Kembali',
    'common.next': 'Berikutnya',
    'common.previous': 'Sebelumnya',
    'common.search': 'Cari',
    'common.filter': 'Filter',
    'common.sort': 'Urutkan',
    'common.refresh': 'Refresh',
    
    // Sharing
    'share.title': 'Bagikan Penempatan',
    'share.description': 'Bagikan layanan yang Anda sebarkan dengan orang lain',
    'share.copyLink': 'Salin Tautan',
    'share.copied': 'Tautan disalin!',
    'share.qrCode': 'Kode QR',
    'share.publicUrl': 'URL Publik',
    'share.expires': 'Berakhir dalam {{time}}',
    'share.neverExpires': 'Tidak pernah berakhir',
    
    // Footer
    'footer.openSource': 'Sumber terbuka',
    'footer.selfHosted': 'Self-hosted',
    'footer.byoai': 'Bawa AI Anda sendiri',
  },
};

export function I18nProvider({ children, defaultLocale = 'en' }: { children: ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('locale') as Locale) || defaultLocale;
    }
    return defaultLocale;
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string, params?: Record<string, string>) => {
    let translation = translations[locale][key] || translations.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        translation = translation.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      });
    }
    
    return translation;
  };

  const setLocale = (newLocale: Locale) => setLocaleState(newLocale);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Helper for language options
export const languageOptions = [
  { code: 'en' as Locale, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'id' as Locale, name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
];