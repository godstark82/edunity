// utils/ApiResponse.ts
import { NextResponse } from "next/server";

/**
 * Enum for HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Enum for standardized error codes
 */
export enum ErrorCode {
  // Generic
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  BAD_REQUEST = "BAD_REQUEST",

  // Supabase related
  SUPABASE_NOT_INITIALIZED = "SUPABASE_NOT_INITIALIZED",
  SUPABASE_QUERY_ERROR = "SUPABASE_QUERY_ERROR",
  SUPABASE_CONNECTION_ERROR = "SUPABASE_CONNECTION_ERROR",

  // Database / resource conflicts
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
  CONFLICT = "CONFLICT",

  // System level
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

/**
 * Response structure interfaces
 */
interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  pagination?: PaginationMeta;
}

export interface FailureResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details: any;
  };
}

/**
 * Main API Response wrapper
 */
export class ApiResponse {
  static success<T>(
    data: T,
    status: HttpStatus = HttpStatus.OK,
    pagination?: PaginationMeta
  ) {
    const body: SuccessResponse<T> = {
      success: true,
      data,
      ...(pagination ? { pagination } : {}),
    };
    return NextResponse.json(body, { status });
  }

  static error(
    code: ErrorCode,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    details: any = {}
  ) {
    const body: FailureResponse = {
      success: false,
      error: { code, message, details },
    };
    return NextResponse.json(body, { status });
  }
}
