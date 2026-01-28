/**
 * @file Defines the API route handlers for the 'university' resource.
 * @module app/api/university/route
 * @description This file utilizes a generic CRUD factory to generate the standard
 * GET, POST, PUT, and DELETE handlers for the 'university' table.
 */

import { createCrudHandlers } from "../_common/crudFactory";
import {
  universityInsertSchema,
  universityUpdateSchema,
} from "@edunity/supabase";

/**
 * Generates the API route handlers for the 'university' database table.
 *
 * This call to `createCrudHandlers` configures a set of RESTful API endpoints
 * by providing the necessary details for the university resource to a reusable factory.
 *
 * @property {string} tableName - Specifies the target table in the Supabase database, which is 'university'.
 * @property {Zod.Schema} createSchema - The Zod schema (`universityInsertSchema`) used to validate the
 * request body when creating a new university.
 * @property {Zod.Schema} updateSchema - The Zod schema (`universityUpdateSchema`) used to validate the
 * request body when updating an existing university.
 * @property {string} selectQuery - The query string for GET requests. In this case, `*` selects all
 * columns from the 'university' table.
 */
const { GET, POST, PUT, DELETE } = createCrudHandlers({
  tableName: "university",
  createSchema: universityInsertSchema,
  updateSchema: universityUpdateSchema,
  selectQuery: `
    *
  `,
});

/**
 * Exports the generated HTTP method handlers (GET, POST, PUT, DELETE) for use
 * in a Next.js API route file.
 */
export { GET, POST, PUT, DELETE };
