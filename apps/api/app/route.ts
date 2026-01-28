import { errorResponse, successResponse } from "../utils/response-wraper";

/**
 * Handles the GET request for the API's root endpoint.
 *
 * This function serves as a simple health check or welcome message for the Edunity API.
 * It confirms that the API is running and reachable by returning a success message
 * along with the current server timestamp.
 *
 * @async
 * @returns {Promise<Response>} A Promise that resolves to a Response object.
 * On success, it returns a {@link successResponse} with a JSON payload containing
 * the welcome message and timestamp. On failure, it returns an {@link errorResponse}.
 *
 * @example
 * // Example of a successful response body:
 * {
 * "message": "Welcome to Edunity API",
 * "timestamp": "2025-09-20T18:01:18.123Z"
 * }
 *
 * @throws Will catch any internal errors and return a 500 "Internal Server Error" response.
 */
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
