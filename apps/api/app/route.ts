import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "../utils/response-wraper";

export async function GET() {
  try { 
  const result = {
    message: "Welcome to Edunity API",
    timestamp: new Date().toISOString(),
  };  
  return successResponse(result);
  } catch (error:any) {
    return errorResponse(error.message || "Internal Server Error", 500);
}}  