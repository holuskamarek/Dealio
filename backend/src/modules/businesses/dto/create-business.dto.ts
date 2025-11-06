import { IsString, IsNotEmpty, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';

export enum BusinessType {
  KAVARNA = 'kavarna',
  BISTRO = 'bistro',
  RESTAURACE = 'restaurace',
  PIZZERIE = 'pizzerie',
  CUKRARNA = 'cukrarna',
  HOSPODA = 'hospoda',
  KVETINARSTVI = 'kvetinarstvi',
  KADERNICTVI = 'kadernictvi',
  OSTATNI = 'ostatni',
}

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty({ message: 'Název podniku je povinný' })
  @MinLength(3, { message: 'Název musí mít alespoň 3 znaky' })
  @MaxLength(100, { message: 'Název nesmí přesáhnout 100 znaků' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Adresa je povinná' })
  @MinLength(5, { message: 'Adresa musí mít alespoň 5 znaků' })
  @MaxLength(200, { message: 'Adresa nesmí přesáhnout 200 znaků' })
  address!: string;

  @IsEnum(BusinessType, { message: 'Typ podniku musí být jeden z: kavarna, bistro, restaurace, pizzerie, cukrarna, hospoda, kvetinarna, kadernictvi, saloon, ostatni' })
  @IsNotEmpty({ message: 'Typ podniku je povinný' })
  type!: BusinessType;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Telefonní číslo nesmí přesáhnout 20 znaků' })
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Web nesmí přesáhnout 200 znaků' })
  website?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Popis nesmí přesáhnout 500 znaků' })
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Otevírací doba nesmí přesáhnout 500 znaků' })
  opening_hours?: string;
}

