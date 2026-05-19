import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  // بۆ ئەوەی کاردەکات پێویستە OPENAI_API_KEY لە .env بنووسیت
  async suggestPrice(make: string, model: string, year: number, mileage: number): Promise<number> {
    // ئەمە placeholder ە — دواتر OpenAI API زیاد بکە
    const basePrice = 15000;
    const agePenalty = (new Date().getFullYear() - year) * 500;
    const mileagePenalty = mileage * 0.01;
    return Math.max(basePrice - agePenalty - mileagePenalty, 1000);
  }

  async detectSpam(text: string): Promise<boolean> {
    const spamWords = ['scam', 'free money', 'click here', 'guaranteed'];
    return spamWords.some(w => text.toLowerCase().includes(w));
  }
}
