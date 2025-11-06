import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsArray, Min, Max, MaxLength, MinLength } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty({ message: 'Název akce je povinný' })
  @MinLength(3, { message: 'Název musí mít alespoň 3 znaky' })
  @MaxLength(100, { message: 'Název nesmí přesáhnout 100 znaků' })
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Popis nesmí přesáhnout 500 znaků' })
  description?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Procento slevy je povinné' })
  @Min(1, { message: 'Sleva musí být alespoň 1%' })
  @Max(100, { message: 'Sleva nesmí přesáhnout 100%' })
  discount_percent!: number;

  @IsDateString({}, { message: 'Počáteční čas musí být validní ISO datum' })
  @IsNotEmpty({ message: 'Počáteční čas je povinný' })
  start_datetime!: string;

  @IsDateString({}, { message: 'Koncový čas musí být validní ISO datum' })
  @IsNotEmpty({ message: 'Koncový čas je povinný' })
  end_datetime!: string;

  @IsArray()
  @IsOptional()
  target_hours?: string[];

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Limit musí být alespoň 1' })
  limit?: number;

  @IsString()
  @IsNotEmpty({ message: 'ID podniku je povinné' })
  business_id!: string;
}

