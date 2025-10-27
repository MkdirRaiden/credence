import { ResponseInterceptor } from "@/common/interceptors/response.interceptor";
import { PrismaClientExceptionFilter } from "@/common/filters/prisma-exception.filter";
import { ValidationExceptionFilter } from "@/common/filters/validation-exception.filter";
import { AllExceptionsFilter } from "@/common/filters/all-exceptions.filter";

export const GLOBAL_INTERCEPTORS = [ResponseInterceptor];

export const GLOBAL_FILTERS = [
  PrismaClientExceptionFilter,
  ValidationExceptionFilter,
  AllExceptionsFilter,
];
