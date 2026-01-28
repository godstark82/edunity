/**
 * @file Defines the API route handlers for the 'department' resource.
 * @module app/api/department/route
 * @description This file uses a generic CRUD factory to generate the standard
 * GET, POST, PUT, and DELETE handlers for the 'department' table. It includes
 * a custom query to join and retrieve related data from both the 'collage'
 * and 'university' tables.
 */

import { createCrudHandlers } from "../_common/crudFactory";
import {
  departmentInsertSchema,
  departmentUpdateSchema,
} from "@edunity/supabase";

/**
 * Generates the API route handlers for the 'department' database table.
 *
 * This configuration creates a set of RESTful API endpoints by providing
 * the necessary details for the department resource to a reusable factory.
 *
 * @property {string} tableName - The target table in the Supabase database, which is 'department'.
 * @property {Zod.Schema} createSchema - The Zod schema (`departmentInsertSchema`) for validating
 * the request body when creating a new department.
 * @property {Zod.Schema} updateSchema - The Zod schema (`departmentUpdateSchema`) for validating
 * the request body when updating an existing department.
 * @property {string} selectQuery - A Supabase-specific query string for GET requests that performs multiple joins:
 * - `*`: Selects all columns from the 'department' table.
 * - `collage(*)`: Joins and selects all columns from the related 'collage' table.
 * - `university(*)`: Joins and selects all columns from the related 'university' table.
 * This assumes foreign key relationships are properly defined in the database schema.
 */
const { GET, POST, PUT, DELETE } = createCrudHandlers({
  tableName: "department",
  createSchema: departmentInsertSchema,
  updateSchema: departmentUpdateSchema,
  selectQuery: `
    *,
    collage(*),
    university(*)
  `,
});

/**
 * Exports the generated HTTP method handlers (GET, POST, PUT, DELETE) for use
 * in a Next.js API route file.
 */
export { GET, POST, PUT, DELETE };
