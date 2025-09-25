import { NextRequest, NextResponse } from "next/server";
import { z, ZodType } from "zod";
import { createServerSideClient } from "@edunity/supabase"; // Your Supabase client import
import { ApiResponse, ErrorCode, HttpStatus } from "@edunity/helpers"; // Your API helper import

/**
 * Defines the configuration required to generate CRUD handlers.
 */
interface CrudHandlersConfig<C extends ZodType, U extends ZodType> {
  tableName: string;
  resourceName: string;
  createSchema: C;
  updateSchema: U;
  // Optional hooks for custom logic (e.g., joining related data)
  afterGet?: (data: any[]) => Promise<any[]>;
  beforeInsert?: (data: z.infer<C>) => Promise<z.infer<C>>;
}

// Commet Added By VENOMLEADER

/**
 * A higher-order function to handle common API logic like Supabase client
 * instantiation, global error handling, and authentication checks.
 */
async function handleRequest(
  request: NextRequest,
  handler: (
    createServerSideClient: any,
    request: NextRequest
  ) => Promise<NextResponse>
) {
  try {
    const supabase = await createServerSideClient();
    if (!supabase) {
      return ApiResponse.error(
        ErrorCode.SUPABASE_NOT_INITIALIZED,
        "Supabase client not initialized",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // You can add global authentication checks here
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   return ApiResponse.error(ErrorCode.UNAUTHORIZED, "Authentication required.", HttpStatus.UNAUTHORIZED);
    // }

    // Correctly call the handler, passing the instantiated client and the original request
    return await handler(supabase, request);
  } catch (e: any) {
    console.error(`[API Factory Error]`, e);
    return ApiResponse.error(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "An unexpected error occurred.",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Creates a full set of generic CRUD API route handlers (GET, POST, PUT, DELETE).
 */
export function createCrudHandlers<C extends ZodType, U extends ZodType>(
  config: CrudHandlersConfig<C, U>
) {
  const {
    tableName,
    resourceName,
    createSchema,
    updateSchema,
    afterGet,
    beforeInsert,
  } = config;

  // --- GET (Paginated List) ---
  const GET = async (request: NextRequest) => {
    return handleRequest(request, async (supabase, req) => {
      const { searchParams } = req.nextUrl;
      const page = parseInt(searchParams.get("page") || "1", 10);
      const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from(tableName)
        .select("*", { count: "exact" })
        .range(from, to);

      if (error) {
        return ApiResponse.error(
          ErrorCode.SUPABASE_QUERY_ERROR,
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const processedData = afterGet ? await afterGet(data) : data;

      return ApiResponse.success(processedData, HttpStatus.OK, {
        page,
        pageSize: data.length,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      });
    });
  };

  // --- POST (Create New Resource) ---
  const POST = async (request: NextRequest) => {
    return handleRequest(request, async (supabase, req) => {
      const body = await req.json();
      const validation = createSchema.safeParse(body);
      if (!validation.success) {
        return ApiResponse.error(
          ErrorCode.VALIDATION_ERROR,
          "Invalid input.",
          HttpStatus.UNPROCESSABLE_ENTITY,
          validation.error.flatten()
        );
      }

      const dataToInsert = beforeInsert
        ? await beforeInsert(validation.data)
        : validation.data;

      const { data, error } = await supabase
        .from(tableName)
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          // Handle unique constraint violations
          return ApiResponse.error(
            ErrorCode.CONFLICT,
            `${resourceName} already exists.`,
            HttpStatus.CONFLICT,
            { details: error.details }
          );
        }
        return ApiResponse.error(
          ErrorCode.SUPABASE_QUERY_ERROR,
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      return ApiResponse.success(data, HttpStatus.CREATED);
    });
  };

  // --- PUT (Update Existing Resource) ---
  const PUT = async (request: NextRequest) => {
    return handleRequest(request, async (supabase, req) => {
      let body;
      try {
        // ✅ Wrap this call in a try...catch block
        body = await req.json();
      } catch (error) {
        return ApiResponse.error(
          ErrorCode.BAD_REQUEST,
          "Invalid JSON format in request body.",
          HttpStatus.BAD_REQUEST
        );
      }

      const validation = updateSchema.safeParse(body);
      if (!validation.success) {
        return ApiResponse.error(
          ErrorCode.VALIDATION_ERROR,
          "Invalid input.",
          HttpStatus.UNPROCESSABLE_ENTITY,
          validation.error.flatten()
        );
      }

      const { id, ...updateData } = validation.data as { id: string | number; [key: string]: any };
      if (Object.keys(updateData).length === 0) {
        return ApiResponse.error(
          ErrorCode.BAD_REQUEST,
          "No fields to update provided.",
          HttpStatus.BAD_REQUEST
        );
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return ApiResponse.error(
          ErrorCode.SUPABASE_QUERY_ERROR,
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      if (!data) {
        return ApiResponse.error(
          ErrorCode.NOT_FOUND,
          `${resourceName} with ID ${id} not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      return ApiResponse.success(data, HttpStatus.OK);
    });
  };

  // --- DELETE (Remove Resource) ---
  const DELETE = async (request: NextRequest) => {
    return handleRequest(request, async (supabase, req) => {
      const { id } = await req.json();
      if (!id || typeof id !== "string") {
        return ApiResponse.error(
          ErrorCode.BAD_REQUEST,
          "A valid 'id' is required for deletion.",
          HttpStatus.BAD_REQUEST
        );
      }

      const { error, count } = await supabase
        .from(tableName)
        .delete({ count: "exact" })
        .eq("id", id);

      if (error) {
        return ApiResponse.error(
          ErrorCode.SUPABASE_QUERY_ERROR,
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      if (count === 0) {
        return ApiResponse.error(
          ErrorCode.NOT_FOUND,
          `${resourceName} with ID ${id} not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      return ApiResponse.success(
        { message: `${resourceName} deleted successfully.` },
        HttpStatus.OK
      );
    });
  };

  return { GET, POST, PUT, DELETE };
}
