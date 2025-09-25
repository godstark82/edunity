/**
 * @file This file contains a generic factory function for creating CRUD (Create, Read, Update, Delete) API route handlers in a Next.js application.
 * @module _common/crudFactory
 * @description It simplifies the process of creating standardized API endpoints by handling common logic like database client instantiation, request validation, pagination, and error handling.
 */

import { NextRequest, NextResponse } from "next/server";
import { z, ZodType } from "zod";
import { createServerSideClient } from "@edunity/supabase"; // Your Supabase client import
import { ApiResponse, ErrorCode, HttpStatus } from "@edunity/helpers"; // Your API helper import

/**
 * Defines the configuration required to generate CRUD handlers.

 * @template C - The Zod schema type for creating a resource.
 * @template U - The Zod schema type for updating a resource.
 */
interface CrudHandlersConfig<C extends ZodType, U extends ZodType> {
  /** The name of the database table to interact with. */
  tableName: string;
  /** A user-friendly name for the resource, used in error messages. Defaults to `tableName`. */
  resourceName?: string;
  /** The Zod schema for validating the request body on POST requests. */
  createSchema: C;
  /** The Zod schema for validating the request body on PUT requests. */
  updateSchema: U;
  /** An optional Supabase query string for GET requests to perform joins or select specific columns. Defaults to `*`. */
  selectQuery?: string;
  /** An optional asynchronous function to process data after it's fetched from the database. */
  afterGet?: (data: any[]) => Promise<any[]>;
  /** An optional asynchronous function to modify data before it's inserted into the database. */

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

 * A higher-order function that wraps API route handlers to provide centralized logic.
 * It handles Supabase client creation and global try-catch error handling.
 * @param request The incoming Next.js request object.
 * @param handler The specific API logic function to execute (e.g., GET, POST).
 * @returns A `NextResponse` object.

 * A higher-order function to handle common API logic like Supabase client
 * instantiation, global error handling, and authentication checks.

 */
async function handleRequest(
  request: NextRequest,
  handler: (

    supabaseClient: any,

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

 * @template C - The Zod schema type for creating a resource.
 * @template U - The Zod schema type for updating a resource.
 * @param config - The configuration object that defines the behavior of the generated handlers.
 * @returns An object containing the generated GET, POST, PUT, and DELETE handlers.

 */
export function createCrudHandlers<C extends ZodType, U extends ZodType>(
  config: CrudHandlersConfig<C, U>
) {
  const {
    tableName,

    resourceName = tableName, // Default resourceName to tableName if not provided
    createSchema,
    selectQuery,

    resourceName,
    createSchema,

    updateSchema,
    afterGet,
    beforeInsert,
  } = config;


  /**
   * Handles GET requests to fetch a paginated list of resources.
   * @param request The incoming Next.js request object.
   * @returns A `NextResponse` with the list of resources and pagination metadata.
   */
  const GET = async (request: NextRequest) => {
    return handleRequest(request, async (supabase, req) => {
      // Parse pagination parameters from the URL

  // --- GET (Paginated List) ---
  const GET = async (request: NextRequest) => {
    return handleRequest(request, async (supabase, req) => {

      const { searchParams } = req.nextUrl;
      const page = parseInt(searchParams.get("page") || "1", 10);
      const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;


      // Fetch data from Supabase
      const { data, error, count } = await supabase
        .from(tableName)
        .select(selectQuery || "*", { count: "exact" })

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


      // Apply post-processing hook if it exists

      const processedData = afterGet ? await afterGet(data) : data;

      return ApiResponse.success(processedData, HttpStatus.OK, {
        page,
        pageSize: data.length,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      });
    });
  };


  /**
   * Handles POST requests to create a new resource.
   * @param request The incoming Next.js request object.
   * @returns A `NextResponse` with the newly created resource.
   */
  const POST = async (request: NextRequest) => {
    return handleRequest(request, async (supabase, req) => {
      const body = await req.json();

      // Validate request body against the create schema

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


      // Apply pre-insertion hook if it exists

      const dataToInsert = beforeInsert
        ? await beforeInsert(validation.data)
        : validation.data;


      // Insert data into Supabase

      const { data, error } = await supabase
        .from(tableName)
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {

        // Handle specific database errors like unique constraint violations
        if (error.code === "23505") {

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


  /**
   * Handles PUT requests to update an existing resource.
   * @param request The incoming Next.js request object.
   * @returns A `NextResponse` with the updated resource.
   */

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

      // Validate request body against the update schema

      const validation = updateSchema.safeParse(body);
      if (!validation.success) {
        return ApiResponse.error(
          ErrorCode.VALIDATION_ERROR,
          "Invalid input.",
          HttpStatus.UNPROCESSABLE_ENTITY,
          validation.error.flatten()
        );
      }


      const { id, ...updateData } = validation.data as {
        id: string | number;
        [key: string]: any;
      };

      const { id, ...updateData } = validation.data as { id: string | number; [key: string]: any };

      if (Object.keys(updateData).length === 0) {
        return ApiResponse.error(
          ErrorCode.BAD_REQUEST,
          "No fields to update provided.",
          HttpStatus.BAD_REQUEST
        );
      }


      // Update data in Supabase

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


  /**
   * Handles DELETE requests to remove a resource by its ID.
   * @param request The incoming Next.js request object.
   * @returns A `NextResponse` with a success message.
   */

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


      // Delete data from Supabase

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

