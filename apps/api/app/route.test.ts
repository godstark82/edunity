import { expect } from "@playwright/test";
import { describe, it } from "node:test";
import { GET } from "./route"; // Assuming GET is exported from route.ts
import { NextResponse } from "next/server";


describe("GET /", () => {
  it("should return a welcome message and a timestamp", async () => {
    const response = await GET();
    const json = await response.json();
    expect(json).toHaveProperty("message", "Welcome to Edunity API");
    expect(json).toHaveProperty("timestamp");666666666
    

  });

  
});

