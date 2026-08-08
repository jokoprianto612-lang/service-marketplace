// ─────────────────────────────────────────────
// i18n Context - Multi-language Support
// Languages: English (en), Indonesian (id), Mandarin (zh)
// ─────────────────────────────────────────────
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Locale = 'en' | 'id' | 'zh';

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
    'nav.menu': 'Menu',
    'nav.title': 'Wee Wok The Tok',
    
    // Header
    'header.notifications': 'Notifications',
    'header.lightMode': 'Switch to light mode',
    'header.darkMode': 'Switch to dark mode',
    'header.profile': 'Profile',
    'header.signOut': 'Sign out',
    'header.user': 'User',
    
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
    'nav.menu': 'Menu',
    'nav.title': 'Wee Wok The Tok',
    
    // Header
    'header.notifications': 'Notifikasi',
    'header.lightMode': 'Beralih ke mode terang',
    'header.darkMode': 'Beralih ke mode gelap',
    'header.profile': 'Profil',
    'header.signOut': 'Keluar',
    'header.user': 'Pengguna',
    
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
  
  zh: {
    // App Brand
    'app.name': 'Wee Wok The Tok',
    'app.tagline': '即时发现并部署服务。',
    
    // Navigation
    'nav.dashboard': '仪表板',
    'nav.marketplace': '市场',
    'nav.deployments': '部署',
    'nav.projects': '项目',
    'nav.settings': '设置',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.menu': '菜单',
    'nav.title': 'Wee Wok The Tok',
    
    // Header
    'header.notifications': '通知',
    'header.lightMode': '切换到浅色模式',
    'header.darkMode': '切换到深色模式',
    'header.profile': '个人资料',
    'header.signOut': '登出',
    'header.user': '用户',
    
    // Marketplace
    'marketplace.title': '市场',
    'marketplace.subtitle': '搜索、部署和管理您的基础设施。',
    'marketplace.searchPlaceholder': '搜索服务、数据库、工具...',
    'marketplace.searchButton': '搜索',
    'marketplace.categories': '分类',
    'marketplace.categoriesSubtitle': '按分类浏览服务',
    'marketplace.services': '服务',
    'marketplace.servicesFound': '找到 {{count}} 个服务',
    'marketplace.noServices': '未找到服务',
    'marketplace.adjustFilters': '尝试调整搜索或筛选条件',
    'marketplace.viewMode.grid': '网格视图',
    'marketplace.viewMode.list': '列表视图',
    'marketplace.deploy': '部署',
    'marketplace.deploying': '部署中...',
    'marketplace.maturity.stable': '稳定版',
    'marketplace.maturity.beta': '测试版',
    'marketplace.maturity.alpha': '内测版',
    'marketplace.pricing.free': '免费',
    'marketplace.pricing.freemium': '免费增值',
    'marketplace.pricing.paid': '付费',
    
    // Categories
    'category.automation': '自动化',
    'category.ai-ml': 'AI/ML',
    'category.databases': '数据库',
    'category.monitoring': '监控',
    'category.storage': '存储',
    'category.networking': '网络',
    'category.security': '安全',
    'category.identity': '身份',
    'category.developer-tools': '开发工具',
    'category.ci-cd': 'CI/CD',
    'category.search': '搜索',
    
    // Service detail
    'service.version': 'v{{version}}',
    'service.stars': '⭐ {{stars}}',
    'service.tags': '标签',
    'service.deployButton': '部署',
    'service.startButton': '启动',
    'service.stopButton': '停止',
    'service.restartButton': '重启',
    'service.scaleButton': '扩缩容',
    'service.logs': '日志',
    'service.metrics': '指标',
    'service.deployment': '部署',
    'service.health': '健康',
    'service.resources': '资源',
    
    // Dashboard
    'dashboard.title': 'Wee Wok The Tok',
    'dashboard.subtitle': '即时发现并部署服务。搜索、部署和管理您的基础设施。',
    'dashboard.categories': '分类',
    'dashboard.categoriesSubtitle': '按分类浏览服务',
    'dashboard.featuredServices': '特色服务',
    'dashboard.featuredSubtitle': '本周热门部署服务',
    'dashboard.resourceUsage': '资源使用',
    'dashboard.quickActions': '快速操作',
    'dashboard.recentServices': '最近服务',
    'dashboard.deployNewService': '部署新服务',
    'dashboard.addDatabase': '添加数据库',
    'dashboard.viewMetrics': '查看指标',
    'dashboard.manageBackups': '管理备份',
    'dashboard.viewAll': '查看全部',
    'dashboard.cpuUsage': 'CPU 使用率',
    'dashboard.memory': '内存',
    'dashboard.disk': '磁盘',
    'dashboard.network': '网络',
    
    // Deployments
    'deployments.title': '部署记录',
    'deployments.status.running': '运行中',
    'deployments.status.stopped': '已停止',
    'deployments.status.deploying': '部署中',
    'deployments.status.failed': '失败',
    'deployments.cancel': '取消',
    
    // Projects
    'projects.title': '项目',
    'projects.create': '创建项目',
    'projects.name': '名称',
    'projects.slug': '标识符',
    'projects.description': '描述',
    'projects.quotas': '配额',
    'projects.members': '成员',
    'projects.invite': '邀请',
    
    // Settings
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.theme': '主题',
    'settings.appearance': '外观',
    'settings.light': '浅色',
    'settings.dark': '深色',
    'settings.system': '跟随系统',
    
    // Auth
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.name': '姓名',
    'auth.confirmPassword': '确认密码',
    'auth.forgotPassword': '忘记密码？',
    'auth.noAccount': '没有账号？',
    'auth.hasAccount': '已有账号？',
    'auth.signIn': '登录',
    'auth.signUp': '注册',
    
    // Common
    'common.all': '全部',
    'common.service': '服务',
    'common.status': '状态',
    'common.memory': '内存',
    'common.uptime': '运行时间',
    'common.actions': '操作',
    'common.collapse': '折叠',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.view': '查看',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.confirm': '确认',
    'common.close': '关闭',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.refresh': '刷新',
    
    // Sharing
    'share.title': '分享部署',
    'share.description': '与他人分享您部署的服务',
    'share.copyLink': '复制链接',
    'share.copied': '链接已复制！',
    'share.qrCode': '二维码',
    'share.publicUrl': '公开链接',
    'share.expires': '{{time}} 后过期',
    'share.neverExpires': '永不过期',
    
    // Footer
    'footer.openSource': '开源',
    'footer.selfHosted': '自托管',
    'footer.byoai': '自带 AI',
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

// Helper for language options - NVIDIA Build style
export const languageOptions = [
  { code: 'en' as Locale, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'id' as Locale, name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'zh' as Locale, name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
];