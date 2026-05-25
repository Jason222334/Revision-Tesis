import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  programId: string;
}
