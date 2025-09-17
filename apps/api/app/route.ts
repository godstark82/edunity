import { errorResponse, successResponse } from "../utils/response-wraper";
<<<<<<< HEAD
<<<<<<< HEAD

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
=======
import { createServerSideClient } from "@edunity/supabase"
=======
>>>>>>> origin/main

export async function GET() {
  try {
    const result = {
      message: "Welcome to Edunity API",
      timestamp: new Date().toISOString(),
    };
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message || "Internal Server Error", 500);
  }
}  
>>>>>>> 4ea8be7cd528eb3f821fabd90e67b19d863602d9
