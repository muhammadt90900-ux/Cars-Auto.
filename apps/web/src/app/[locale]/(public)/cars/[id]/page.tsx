import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

async function getListing(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CarDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const listing = await getListing(params.id);
  if (!listing) notFound();

  const t = await getTranslations('listing');
  const locale = params.locale as 'ku' | 'ar' | 'en' | 'zh';

  const title =
    listing[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}`] ??
    listing.titleEn;

  const cover = listing.images?.find((i: any) => i.isCover)?.url ?? listing.images?.[0]?.url;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Images */}
      {cover && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img src={cover} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Title & Price */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {listing.price.toLocaleString()} {listing.currency}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {listing.year && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500 mb-1">{t('year')}</div>
            <div className="font-semibold">{listing.year}</div>
          </div>
        )}
        {listing.mileage && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500 mb-1">{t('mileage')}</div>
            <div className="font-semibold">{listing.mileage.toLocaleString()} km</div>
          </div>
        )}
        {listing.fuelType && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500 mb-1">{t('fuel')}</div>
            <div className="font-semibold">{listing.fuelType}</div>
          </div>
        )}
        {listing.transmission && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500 mb-1">{t('transmission')}</div>
            <div className="font-semibold">{listing.transmission}</div>
          </div>
        )}
      </div>

      {/* Seller info */}
      {listing.user && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          {listing.user.avatar && (
            <img
              src={listing.user.avatar}
              alt={listing.user.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-semibold text-lg">{listing.user.name}</div>
            {listing.user.verified && (
              <span className="text-xs text-green-600 font-medium">✓ {t('verified')}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
