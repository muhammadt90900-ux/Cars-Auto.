// apps/web/src/components/shared/Footer.tsx
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer({ className }: { className?: string }) {
  const t = useTranslations('common');
  return (
    <footer className={`bg-[#1a1a2e] text-white py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">AutoBazaar Pro</h3>
          <p className="text-sm text-gray-400">{t('tagline')}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Marketplace</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/cars">Cars</Link></li>
            <li><Link href="/motorcycles">Motorcycles</Link></li>
            <li><Link href="/spare-parts">Spare Parts</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
