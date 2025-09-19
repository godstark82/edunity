import { z } from "zod";
import { createCrudHandlers } from "../_common/crudFactory"; // Import our new factory

// 1. Define resource-specific schemas
const universitySchema = z.object({
  name: z.string(),
  metadata: z.json().optional(),
  // Add other fields from your 'university' table here
});

const updateUniversitySchema = universitySchema.partial().extend({
  id: z.string().uuid("Invalid UUID must be provided for updates"),
});

// 2. Generate the handlers by calling the factory with your configuration
const { GET, POST, PUT, DELETE } = createCrudHandlers({
  tableName: "collage",
  resourceName: "College",
  createSchema: universitySchema,
  updateSchema: updateUniversitySchema,
});

// 3. Export the generated handlers
export { GET, POST, PUT, DELETE };