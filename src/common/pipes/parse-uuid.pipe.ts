// src/common/pipes/parse-uuid.pipe.ts
import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseUuidPipe implements PipeTransform {
  transform(value: string) {
    // Any UUID format (v1-v5)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new BadRequestException(`Invalid UUID: ${value}`);
    }
    return value;
  }
}
