import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest-price')
  suggestPrice(
    @Body() body: { make: string; model: string; year: number; mileage: number },
  ) {
    return this.aiService.suggestPrice(body.make, body.model, body.year, body.mileage);
  }
}
