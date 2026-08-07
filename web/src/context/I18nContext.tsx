// ─────────────────────────────────────────────
// i18n Context - Multi-language Support
// Languages: Indonesian (id), English (en), Mandarin (zh)
// ─────────────────────────────────────────────
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Locale = 'id' | 'en' | 'zh';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Locale, Record<string, string>> = {
  en: {
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
    'marketplace.subtitle': 'Discover and deploy services instantly. Search, deploy, and manage your infrastructure.',
    'marketplace.searchPlaceholder': 'Search services, databases, tools...',
    'marketplace.searchButton': 'Search',
    'marketplace.categories': 'Categories',
    'marketplace.categoriesSubtitle': 'Explore services by category',
    'marketplace.services': 'Services',
    'marketplace.servicesFound': '{{count}} {{count === 1 ? "service" : "services"}} found',
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
    'nav.dashboard': 'Dashboard',
    'nav.marketplace': 'Marketplace',
    'nav.deployments': 'Penempatan',
    'nav.projects': 'Proyek',
    'nav.settings': 'Pengaturan',
    'nav.login': 'Masuk',
    'nav.register': 'Daftar',
    
    'header.notifications': 'Notifikasi',
    'header.lightMode': 'Beralih ke mode terang',
    'header.darkMode': 'Beralih ke mode gelap',
    'header.profile': 'Profil',
    'header.signOut': 'Keluar',
    
    'marketplace.title': 'Marketplace',
    'marketplace.subtitle': 'Temukan dan sebarkan layanan secara instan. Cari, sebarkan, dan kelola infrastruktur Anda.',
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
    
    'deployments.title': 'Penempatan',
    'deployments.status.running': 'Berjalan',
    'deployments.status.stopped': 'Berhenti',
    'deployments.status.deploying': 'Menebarkan',
    'deployments.status.failed': 'Gagal',
    'deployments.cancel': 'Batal',
    
    'projects.title': 'Proyek',
    'projects.create': 'Buat Proyek',
    'projects.name': 'Nama',
    'projects.slug': 'Slug',
    'projects.description': 'Deskripsi',
    'projects.quotas': 'Kuota',
    'projects.members': 'Anggota',
    'projects.invite': 'Undang',
    
    'settings.title': 'Pengaturan',
    'settings.language': 'Bahasa',
    'settings.theme': 'Tema',
    'settings.appearance': 'Tampilan',
    'settings.light': 'Terang',
    'settings.dark': 'Gelap',
    'settings.system': 'Sistem',
    
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
    
    'share.title': 'Bagikan Penempatan',
    'share.description': 'Bagikan layanan yang Anda sebarkan dengan orang lain',
    'share.copyLink': 'Salin Tautan',
    'share.copied': 'Tautan disalin!',
    'share.qrCode': 'Kode QR',
    'share.publicUrl': 'URL Publik',
    'share.expires': 'Berakhir dalam {{time}}',
    'share.neverExpires': 'Tidak pernah berakhir',
    
    'footer.openSource': 'Sumber terbuka',
    'footer.selfHosted': 'Self-hosted',
    'footer.byoai': 'Bawa AI Anda sendiri',
  },
  
  zh: {
    'nav.dashboard': '仪表板',
    'nav.marketplace': '市场',
    'nav.deployments': '部署',
    'nav.projects': '项目',
    'nav.settings': '设置',
    'nav.login': '登录',
    'nav.register': '注册',
    
    'header.notifications': '通知',
    'header.lightMode': '切换到浅色模式',
    'header.darkMode': '切换到深色模式',
    'header.profile': '个人资料',
    'header.signOut': '登出',
    
    'marketplace.title': '服务市场',
    'marketplace.subtitle': '即时发现并部署服务。搜索、部署和管理您的基础设施。',
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
    
    'deployments.title': '部署记录',
    'deployments.status.running': '运行中',
    'deployments.status.stopped': '已停止',
    'deployments.status.deploying': '部署中',
    'deployments.status.failed': '失败',
    'deployments.cancel': '取消',
    
    'projects.title': '项目',
    'projects.create': '创建项目',
    'projects.name': '名称',
    'projects.slug': '标识符',
    'projects.description': '描述',
    'projects.quotas': '配额',
    'projects.members': '成员',
    'projects.invite': '邀请',
    
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.theme': '主题',
    'settings.appearance': '外观',
    'settings.light': '浅色',
    'settings.dark': '深色',
    'settings.system': '跟随系统',
    
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
    
    'share.title': '分享部署',
    'share.description': '与他人分享您部署的服务',
    'share.copyLink': '复制链接',
    'share.copied': '链接已复制！',
    'share.qrCode': '二维码',
    'share.publicUrl': '公开链接',
    'share.expires': '{{time}} 后过期',
    'share.neverExpires': '永不过期',
    
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

// Helper for language options
export const languageOptions = [
  { code: 'en' as Locale, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'id' as Locale, name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'zh' as Locale, name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
];