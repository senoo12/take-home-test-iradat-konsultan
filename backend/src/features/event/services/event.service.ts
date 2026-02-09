import { prisma } from "../../../core/applications/database";
import { HttpError } from "../../../shared/helpers/http.error.helper";
import { Validation } from "../../../shared/helpers/validation.helper";
import { CreateEventRequest, EventResponse } from "../models/event.model";
import { EventValidation } from "../validations/event.validation";

export class EventService {
    private static formatToTime(date: Date): string {
        return date.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }

    private static formatToDate(date: Date): string {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    private static mapToResponse(e: any): EventResponse {
        return {
            id: e.id,
            name_event: e.name_event,
            description: e.description,
            start_time: this.formatToTime(e.start_time),
            end_time: this.formatToTime(e.end_time),
            date: this.formatToDate(e.date),
            created_at: e.created_at,
            updated_at: e.updated_at
        };
    }

    static async create(req: CreateEventRequest): Promise<EventResponse> {
        const validated = Validation.validate(
            EventValidation.CREATE,
            req
        );

        const event = await prisma.$transaction(async (tx) => {
            return tx.event.create({
                data: {
                    name_event: validated.name_event,
                    description: validated.description,
                    start_time: new Date(validated.start_time),
                    end_time: new Date(validated.end_time),
                    date: new Date(String(validated.date)),
                },
            });
        });

        return this.mapToResponse(event);
    }

    // get all data
    static async getAll(
        page: number,
        limit: number
    ): Promise<{ data: EventResponse[]; totalItems: number }> {
        const skip = (page - 1) * limit;
        const data = await prisma.event.findMany({
            where: { deleted_at: null },
            orderBy: { created_at: "desc" },
            skip,
            take: limit,
        });
        const totalItems = await prisma.event.count({
            where: { deleted_at: null },
        });
        return {
            data: data.map((e) => this.mapToResponse(e)),
            totalItems,
        };
    }

    // get by id data
    static async getById(id: string): Promise<EventResponse | null> {
        const { id: validId } = Validation.validate(
            EventValidation.GET_BY_ID,
            { id }
        );

        const event = await prisma.event.findUnique({
            where: { id: validId, deleted_at: null },
        });
        return event ? this.mapToResponse(event) : null;
    }

    // update data
    static async update(req: CreateEventRequest & { id: string }): Promise<EventResponse> {
        const validated = Validation.validate(
            EventValidation.UPDATE,
            req
        );

        const existing = await prisma.event.findUnique({
            where: { id: validated.id, deleted_at: null },
        });

        if (!existing) {
            throw new HttpError("Data Event tidak ditemukan", 404);
        }

        const event = await prisma.$transaction(async (tx) => {
            return tx.event.update({
                where: { id: validated.id, deleted_at: null },
                data: {
                    name_event: validated.name_event,
                    description: validated.description,
                    start_time: new Date(validated.start_time),
                    end_time: new Date(validated.end_time),
                    date: new Date(String(validated.date)),
                }
            });
        });
        return this.mapToResponse(event);
    }

    // delete
    static async delete(id: string): Promise<void> {
        const { id: validId } = Validation.validate(
            EventValidation.GET_BY_ID,
            { id }
        );

        await prisma.$transaction(async (tx) => {
            await tx.event.update({
                where: { id: validId },
                data: { deleted_at: new Date() },
            });
        });
    }
}