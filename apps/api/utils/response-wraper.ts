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

function errorResponse(error: string, statusCode = 500) {
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