// apps/api/src/modules/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsString({ message: 'ناو دەبێت دەق بێت' })
  @MinLength(2, { message: 'ناو دەبێت لانیکەم ٢ پیت بێت' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: 'ئیمەیڵی دروست بنووسە' })
  @Transform(({ value }) => value?.trim()?.toLowerCase())
  email: string;

  @IsString()
  @MinLength(6, { message: 'پاسوۆرد دەبێت لانیکەم ٦ پیت بێت' })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+\d\s\-()]{7,20}$/, { message: 'ژمارەی تەلەفۆن دروست نییە' })
  @Transform(({ value }) => value?.trim() || undefined)
  phone?: string;
}
