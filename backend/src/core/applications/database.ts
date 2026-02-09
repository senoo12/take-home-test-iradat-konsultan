import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);

const basePrisma = new PrismaClient({ adapter });

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      // Use explicit parameter typing to satisfy the compiler
      async $allOperations({ 
        model, 
        operation, 
        args, 
        query 
      }: { 
        model: string, 
        operation: string, 
        args: any, 
        query: (args: any) => Promise<any> 
      }) {
        const filterOperations = [
          "findMany",
          "findFirst",
          "findFirstOrThrow",
          "findUnique",
          "findUniqueOrThrow",
          "count",
        ];

        if (filterOperations.includes(operation)) {
          // Ensure args is an object before spreading
          const queryArgs = args || {};

          queryArgs.where = {
            ...queryArgs.where,
            deleted_at: null,
          };

          return query(queryArgs);
        }

        return query(args);
      },
    },
  },
});