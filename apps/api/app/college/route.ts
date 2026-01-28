/**
 * @file Defines the API route handlers for the 'collage' resource.
 * @module app/api/collage/route
 * @description This file leverages a generic CRUD factory to generate the standard
 * GET, POST, PUT, and DELETE handlers for the 'collage' table in the database.
 * It includes a custom query to join and retrieve data from the related 'university' table.
 */

import { createCrudHandlers } from "../_common/crudFactory";
import { collageInsertSchema, collageUpdateSchema } from "@edunity/supabase";

/**
 * Generates the API route handlers for the 'collage' database table.
 *
 * This function call configures and creates a set of standard RESTful API endpoints
 * by providing resource-specific details to a reusable factory.
 *
 * @property {string} tableName - The target table in the Supabase database, which is 'collage'.
 * @property {Zod.Schema} createSchema - The Zod schema used to validate the request body
 * when creating a new college. Imported from `@edunity/supabase`.
 * @property {Zod.Schema} updateSchema - The Zod schema used to validate the request body
 * when updating an existing college. It typically requires an 'id' and makes other fields optional.
 * @property {string} selectQuery - A Supabase-specific query string for GET requests.
 * - `*`: Selects all columns from the 'collage' table.
 * - `university(*)`: Performs a join to fetch all columns from the related 'university' table.
 * This assumes a foreign key relationship is defined in the database between the two tables.
 */
const { GET, POST, PUT, DELETE } = createCrudHandlers({
  tableName: "collage",
  createSchema: collageInsertSchema,
  updateSchema: collageUpdateSchema,
  selectQuery: `
    *,
    university(*)
  `,
});

/**
 * Exports the generated HTTP method handlers for use in a Next.js API route file.
 * These handlers connect incoming API requests to the corresponding database operations.
 */
export { GET, POST, PUT, DELETE };