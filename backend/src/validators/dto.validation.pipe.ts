import {Injectable, ArgumentMetadata, PipeTransform, BadRequestException} from '@nestjs/common';
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
  
@Injectable()
export class DtoValidationPipe<T> implements PipeTransform<T> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException(
            `Validation failed: ${this.collectMessages(errors).join(", ")}`,
            );
        }
        return value;
    }
  
    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
  
    private collectMessages(errors: ValidationError[]) {
        const result: string[] = [];
        errors.forEach((error) => {
            for (const key in error.constraints) {
                if (typeof error.constraints[key] === "string") {
                    result.push(error.constraints[key]);
                }
            }
        });
        return result;
    }
}