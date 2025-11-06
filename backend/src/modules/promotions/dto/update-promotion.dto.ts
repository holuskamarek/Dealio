import { IsString, IsOptional, IsNumber, IsDateString, IsArray, IsBoolean, Min, Max, MaxLength, MinLength } from 'class-validator';

export class UpdatePromotionDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Název musí mít alespoň 3 znaky' })
  @MaxLength(100, { message: 'Název nesmí přesáhnout 100 znaků' })
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Popis nesmí přesáhnout 500 znaků' })
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Sleva musí být alespoň 1%' })
  @Max(100, { message: 'Sleva nesmí přesáhnout 100%' })
  discount_percent?: number;

  @IsDateString({}, { message: 'Počáteční čas musí být validní ISO datum' })
  @IsOptional()
  start_datetime?: string;

  @IsDateString({}, { message: 'Koncový čas musí být validní ISO datum' })
  @IsOptional()
  end_datetime?: string;

  @IsArray()
  @IsOptional()
  target_hours?: string[];

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Limit musí být alespoň 1' })
  limit?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

