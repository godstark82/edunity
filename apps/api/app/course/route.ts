/**
 * @file Defines the API route handlers for the 'course' resource.
 * @module app/api/course/route
 * @description This file leverages a generic CRUD factory to generate the standard
 * GET, POST, PUT, and DELETE handlers for the 'course' table in the database.
 */

import { createCrudHandlers } from "../_common/crudFactory";
import { courseInsertSchema, courseUpdateSchema } from "@edunity/supabase";

/**
 * Generates the API route handlers for the 'course' database table.
 *
 * This function call configures and creates a set of standard RESTful API endpoints
 * by providing resource-specific details to a reusable factory.
 *
 * @property {string} tableName - The target table in the Supabase database, which is 'course'.
 * @property {Zod.Schema} createSchema - The Zod schema (`courseInsertSchema`) used to validate
 * the request body when creating a new course.
 * @property {Zod.Schema} updateSchema - The Zod schema (`courseUpdateSchema`) used to validate
 * the request body when updating an existing course.
 * @property {string} selectQuery - The query string for GET requests. In this case, `*` selects
 * all columns from the 'course' table.
 */
const { GET, POST, PUT, DELETE } = createCrudHandlers({
  tableName: "course",
  createSchema: courseInsertSchema,
  updateSchema: courseUpdateSchema,
  selectQuery: `
    *
  `,
});

/**
 * Exports the generated HTTP method handlers (GET, POST, PUT, DELETE) for use
 * in a Next.js API route file.
 */
export { GET, POST, PUT, DELETE };
