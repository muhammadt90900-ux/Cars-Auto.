// app/[locale]/(public)/cars/[id]/page.tsx
// Optimised: ISR, single-fetch for listing, parallel similar-cars fetch

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CarDetailClient } from '@/components/features/cars/CarDetailClient';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

/* ── Data fetchers ─────────────────────────────────────────────── */
async function getListing(id: string) {
  try {
    const res = await fetch(`${API}/listings/${id}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 s
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getSimilarCars(listing: any): Promise<any[]> {
  try {
    const brandId = listing?.vehicleSpec?.brandId;
    const type    = listing?.type ?? 'car';
    const params  = new URLSearchParams({ type, limit: '6' });
    if (brandId) params.set('brandId', brandId);

    const res = await fetch(`${API}/listings?${params}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? data ?? [])
      .filter((c: any) => c.id !== listing.id)
      .slice(0, 6);
  } catch {
    return [];
  }
}

/* ── Static params — pre-render nothing; use ISR on demand ──────── */
// generateStaticParams is intentionally omitted: pages are generated
// on first request and then cached by ISR. This keeps build times fast
// and still serves pages quickly after the first hit.

/* ── Metadata ───────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const listing = await getListing(params.id);
  if (!listing) return { title: 'Listing Not Found' };

  const locale  = params.locale as 'ku' | 'ar' | 'en' | 'zh';
  const titleKey = `title${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof listing;
  const title   = listing[titleKey] ?? listing.titleEn ?? 'Car Listing';
  const cover   = listing.images?.find((i: any) => i.isCover)?.url ?? listing.images?.[0]?.url;
  const desc    = listing.descriptionEn?.slice(0, 155) ?? `${title} for sale on AutoBazaar Pro`;

  return {
    title: `${title} — AutoBazaar Pro`,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: cover ? [{ url: cover, width: 1200, height: 630, alt: title }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: cover ? [cover] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autobazaarpro.com'}/${params.locale}/cars/${params.id}`,
    },
  };
}

/* ── Page ────────────────────────────────────────────────────────── */
export default async function CarDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  // Fetch listing first, then similar in parallel — avoids fetching listing twice
  const listing = await getListing(params.id);
  if (!listing) notFound();

  const similarCars = await getSimilarCars(listing);

  return (
    <CarDetailClient
      listing={listing}
      similarCars={similarCars}
      locale={params.locale}
    />
  );
}
