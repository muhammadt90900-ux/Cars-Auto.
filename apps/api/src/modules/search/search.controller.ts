import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(
    @Query('q') q: string,
    @Query('type') type: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.searchService.search(q ?? '', type, Number(page ?? 1), Number(limit ?? 20));
  }
}
