import { prisma } from "../../../core/applications/database";
import { HttpError } from "../../../shared/helpers/http.error.helper";
import { Validation } from "../../../shared/helpers/validation.helper";
import { ConsolerResponse, CreateConsolerRequest } from "../models/consoler.model";
import { ConsolerValidation } from "../validations/consoler.validation";

export class ConsolerService {
    private static mapToResponse(c: any): ConsolerResponse {
        return {
            id: c.id,
            name: c.name,
            email: c.email,
            rate: c.rate,
            walet: c.walet,
            created_at: c.created_at,
            updated_at: c.updated_at
        };
    }

    static async create(req: CreateConsolerRequest): Promise<ConsolerResponse> {
        const validated = Validation.validate(
            ConsolerValidation.CREATE,
            req
        );

        // duplikasi email
        const isDuplicateEmail = await prisma.consoler.findFirst({
            where: {
                email: validated.email,
                deleted_at: null,
            },
        });

        if (isDuplicateEmail) {
            throw new HttpError("Email sudah digunakan", 400);
        }

        const consoler = await prisma.$transaction(async (tx) => {
            return tx.consoler.create({
                data: {
                    name: validated.name,
                    email: validated.email,
                    rate: validated.rate,
                    walet: 0,
                },
            });
        });

        return this.mapToResponse(consoler);
    }

    // get all data
    static async getAll(
        page: number,
        limit: number
    ): Promise<{ data: ConsolerResponse[]; totalItems: number }> {
        const skip = (page - 1) * limit;
        const data = await prisma.consoler.findMany({
            where: { deleted_at: null },
            orderBy: { created_at: "desc" },
            skip,
            take: limit,
        });
        const totalItems = await prisma.consoler.count({
            where: { deleted_at: null },
        });
        return {
            data: data.map(this.mapToResponse),
            totalItems,
        };
    }

    // get by id data
    static async getById(id: string): Promise<ConsolerResponse | null> {
        const { id: validId } = Validation.validate(
            ConsolerValidation.GET_BY_ID,
            { id }
        );

        const consoler = await prisma.consoler.findUnique({
            where: { id: validId, deleted_at: null },
        });
        return consoler ? this.mapToResponse(consoler) : null;
    }

    // update data
    static async update(req: CreateConsolerRequest & { id: string }): Promise<ConsolerResponse> {
        const validated = Validation.validate(
            ConsolerValidation.UPDATE,
            req
        );

        const existing = await prisma.consoler.findUnique({
            where: { id: validated.id, deleted_at: null },
        });

        if (!existing) {
            throw new HttpError("Data Consoler tidak ditemukan", 404);
        }

        // duplikasi email
        const isDuplicateEmail = await prisma.consoler.findFirst({
            where: {
                email: validated.email,
                deleted_at: null,
                id: { not: validated.id }
            },
        });

        if (isDuplicateEmail) {
            throw new HttpError("Email sudah digunakan", 400);
        }

        const consoler = await prisma.$transaction(async (tx) => {
            return tx.consoler.update({
                where: { id: validated.id, deleted_at: null },
                data: {
                    name: validated.name,
                    email: validated.email,
                    rate: validated.rate,
                }
            });
        });
        return this.mapToResponse(consoler);
    }

    // delete
    static async delete(id: string): Promise<void> {
        const { id: validId } = Validation.validate(
            ConsolerValidation.GET_BY_ID,
            { id }
        );

        await prisma.$transaction(async (tx) => {
            await tx.consoler.update({
                where: { id: validId },
                data: { deleted_at: new Date() },
            });
        });
    }
}