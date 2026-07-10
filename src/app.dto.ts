import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendMailDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

    @IsString()
  @IsOptional()
  material: string; 


      @IsString()
  @IsOptional()
  deliveryTarget:string

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  type: string; // enquiry / complaint / feedback

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}