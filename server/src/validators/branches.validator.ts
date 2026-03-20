import { z } from "zod";
import { paginationSchema } from "../utils/pagination";

export const branchStatusFilter = z.enum(["open", "closed", "maintenance"]).optional();

export const getBranchesQuerySchema = paginationSchema.extend({
  status: branchStatusFilter,
});

export type GetBranchesQuery = z.infer<typeof getBranchesQuerySchema>;

export const nearestBranchesQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  limit: z.coerce.number().int().min(1).max(50).default(5),
});

export type NearestBranchesQuery = z.infer<typeof nearestBranchesQuerySchema>;
