import { NextResponse } from "next/server";

function successResponse(data: any, statusCode = 200) {
  return NextResponse.json(
    {
      success: true,
      status: statusCode,
      data,
    },
    {
      status: statusCode,
    }
  );
}

<<<<<<< HEAD
function errorResponse(error: string, statusCode = 500) {
=======
function errorResponse(error: any, statusCode = 500) {
>>>>>>> 4ea8be7cd528eb3f821fabd90e67b19d863602d9
  return NextResponse.json(
    {
      success: false,
      status: statusCode,
      error,
    },
    {
      status: statusCode,
    }
  );

}

export { successResponse, errorResponse };