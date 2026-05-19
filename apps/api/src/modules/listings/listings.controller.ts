import {
  Controller, Get, Post, Delete,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateListingDto } from './dto/create-listing.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.listingsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/listings')
  myListings(@Request() req: any) {
    return this.listingsService.myListings(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateListingDto) {
    return this.listingsService.create({ ...dto, userId: req.user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.listingsService.delete(id, req.user.userId);
  }
}
