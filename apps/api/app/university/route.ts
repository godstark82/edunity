import { NextRequest } from "next/server";
import { createServerSideClient } from "@edunity/supabase";
import { ApiResponse, ErrorCode, HttpStatus } from "@edunity/helpers"

export async function GET() {
    try {
        const supabase = await createServerSideClient();
        if (!supabase) {
            return ApiResponse.error(
                ErrorCode.SUPABASE_NOT_INITIALIZED,
                "Supabase client not initialized",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        const { data, error, count } = await supabase
            .from("university")
            .select("*", { count: "exact" });

        if (error) {
            return ApiResponse.error(
                ErrorCode.SUPABASE_QUERY_ERROR,
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return ApiResponse.success(
            data,
            HttpStatus.OK,
            {
                page: 1,
                pageSize: data.length,
                total: count ?? data.length,
                totalPages: 1,
            }
        );
    } catch (e: any) {
        return ApiResponse.error(
            ErrorCode.INTERNAL_SERVER_ERROR,
            e.message || "Unexpected error occurred",
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
