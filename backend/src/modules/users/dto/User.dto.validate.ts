import { IsEmpty, IsString, IsEmail, IsIn } from "class-validator";

export class UserDtoValidate {
    @IsEmpty() @IsString() @IsEmail()
    email: string;
  
    @IsEmpty() @IsString()
    passwordHash: string;
  
    @IsEmpty() @IsString()
    name: string;
  
    @IsString()
    contactPhone: string;
  
    @IsString() @IsIn(['client', 'admin', 'manager'])
    role: string;
}