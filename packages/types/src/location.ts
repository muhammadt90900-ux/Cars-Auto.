// packages/types/src/location.ts
export interface Location {
  id: string;
  country: string; // 'IQ' | 'KRI' | 'UAE' | 'CN'
  governorate?: string;
  city: string;
  name: MultiLangContent;
  lat: number;
  lng: number;
}
