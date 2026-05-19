// apps/web/src/components/features/home/HeroSearch.tsx
import { Button } from '@auto-bazaar-pro/ui/components';
import { Search } from 'lucide-react';

export function HeroSearch() {
  return (
    <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-20 md:py-32">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Find Your Perfect Vehicle <br className="hidden md:block" />
          <span className="text-[#e94560]">Across the Middle East</span>
        </h1>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 max-w-2xl mx-auto mt-10">
          <Search className="w-6 h-6 text-white/70" />
          <input
            type="text"
            placeholder="Search cars, motorcycles, parts..."
            className="bg-transparent flex-1 text-white placeholder-white/50 outline-none"
          />
          <Button variant="accent">Search</Button>
        </div>
      </div>
    </div>
  );
}
