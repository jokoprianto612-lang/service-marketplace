// ─────────────────────────────────────────────
// Share Modal - Deployment Sharing
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, QrCode, Link2, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useI18n } from '../../context/I18nContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  deployment: {
    id: string;
    name: string;
    url?: string;
    publicUrl?: string;
    expiresAt?: string;
    isPublic: boolean;
  };
}

export function ShareModal({ isOpen, onClose, deployment }: ShareModalProps) {
  const { t } = useI18n();
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');

  useEffect(() => {
    if (isOpen && deployment.publicUrl) {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/shared/${deployment.id}`;
      setShareUrl(url);
      // Generate QR code using a free QR API
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`);
    }
  }, [isOpen, deployment]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getExpiryText = () => {
    if (!deployment.expiresAt) return t('share.neverExpires');
    const expiry = new Date(deployment.expiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return t('share.expired') || 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return t('share.expires', { time: `${days}d` });
    if (hours > 0) return t('share.expires', { time: `${hours}h` });
    return t('share.expires', { time: '<1h' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
      <div className="relative w-full max-w-md bg-white dark:bg-dark-900 rounded-2xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-200 dark:border-dark-700">
          <h2 id="share-modal-title" className="text-heading-md font-semibold text-dark-900 dark:text-dark-50">
            {t('share.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-600 dark:hover:text-dark-300 transition-colors"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Service Info */}
          <div className="flex items-center gap-3 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <Link2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-dark-900 dark:text-dark-50 truncate">{deployment.name}</p>
              <p className="text-sm text-dark-500 dark:text-dark-400">{t('share.description')}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-dark-200 dark:border-dark-700">
            <button
              onClick={() => setActiveTab('link')}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors',
                activeTab === 'link'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-dark-500 hover:text-dark-700 dark:hover:text-dark-300'
              )}
            >
              <Link2 className="inline-flex items-center gap-1 h-4 w-4" aria-hidden="true" />
              {t('share.publicUrl')}
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors',
                activeTab === 'qr'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-dark-500 hover:text-dark-700 dark:hover:text-dark-300'
              )}
            >
              <QrCode className="inline-flex items-center gap-1 h-4 w-4" aria-hidden="true" />
              {t('share.qrCode')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'link' && (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="input w-full pl-10 pr-12 bg-dark-50 dark:bg-dark-800 font-mono text-sm"
                    placeholder={t('share.publicUrl')}
                  />
                  <ExternalLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" aria-hidden="true" />
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      copied
                        ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50'
                    )}
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    {copied ? t('share.copied') : t('share.copyLink')}
                  </button>
                </div>

                {/* Expiry Info */}
                <div className="flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400 p-3 bg-dark-50 dark:bg-dark-800 rounded-lg">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{getExpiryText()}</span>
                  {deployment.isPublic && (
                    <>
                      <span className="text-dark-300 dark:text-dark-600">·</span>
                      <span className="text-primary-600 dark:text-primary-400">{t('share.public')}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-700">
                  <img
                    src={qrCodeUrl}
                    alt={`${t('share.qrCode')} for ${deployment.name}`}
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-center text-sm text-dark-500 dark:text-dark-400">
                  {t('share.scanToOpen')}
                </p>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = qrCodeUrl;
                    link.download = `${deployment.name}-qr.png`;
                    link.click();
                  }}
                  className="btn-secondary w-full"
                >
                  <ExternalLink className="inline h-4 w-4 mr-2" aria-hidden="true" />
                  {t('common.download')}
                </button>
              </div>
            )}
          </div>

          {/* Public Toggle */}
          <div className="pt-4 border-t border-dark-200 dark:border-dark-700">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-dark-900 dark:text-dark-500">{t('share.makePublic')}</p>
                <p className="text-sm text-dark-500 dark:text-dark-400">{t('share.makePublicDesc')}</p>
              </div>
              <input
                type="checkbox"
                checked={deployment.isPublic}
                onChange={e => console.log('Toggle public:', e.target.checked)}
                className="relative h-5 w-5 appearance-none rounded border border-dark-300 dark:border-dark-600 checked:bg-primary-600 checked:border-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-900"
                aria-label={t('share.makePublic')}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}