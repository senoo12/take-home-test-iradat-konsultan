import { SalaryStatus, StatusAttendance } from "@prisma/client";
import { prisma } from "../../../core/applications/database";
import { HttpError } from "../../../shared/helpers/http.error.helper";
import { Validation } from "../../../shared/helpers/validation.helper";
import { AttendanceResponse, CreateAttendanceRequest } from "../models/attendance.model";
import { AttendanceValidation } from "../validations/attendance.validation";

export class AttendanceService {
    private static formatToDate(date: Date | null): string | null {
        console.log("FORMAT FUNCTION DIPANGGIL, VALUE:", date);
        if (!date) return null;
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }


    private static mapToResponse(a: any): AttendanceResponse {
        return {
            id: a.id,
            event: {
                id_event: a.event.id,
                name_event: a.event.name_event,
                description: a.event.description,
            },
            consoler: {
                id_consoler: a.consoler.id,
                name: a.consoler.name,
                email: a.consoler.email,
            },
            status_attendance: a.status_attendance,
            date_attendance: this.formatToDate(a.date_attendance),
            hours: a.hours,
            created_at: a.created_at,
            updated_at: a.updated_at
        };
    }
    
    // create
    static async create(req: CreateAttendanceRequest): Promise<AttendanceResponse> {
        const validated = Validation.validate(
            AttendanceValidation.CREATE,
            req
        );

        const existingEvent = await prisma.event.findFirst({
            where: {
                id: validated.id_event,
                deleted_at: null
            }
        });

        if (!existingEvent) {
            throw new HttpError("Event tidak ditemukan", 409);
        }

        const existingConsoler = await prisma.consoler.findFirst({
            where: {
                id: validated.id_consoler,
                deleted_at: null
            }
        });

        if (!existingConsoler) {
            throw new HttpError("Consoler tidak ditemukan", 409);
        }

        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                id_event: validated.id_event,
                id_consoler: validated.id_consoler,
                deleted_at: null
            }
        });

        if (existingAttendance) {
            throw new HttpError(
                "Attendance untuk event dan consoler ini sudah ada",
                409
            );
        }

        if (
            validated.status_attendance === "ABSENT" &&
            validated.date_attendance != null &&
            validated.hours != null
        ) {
            throw new HttpError(
                "date_attendance dan hours harus kosong jika status ABSENT",
                400
            );
        }

        if (
            validated.status_attendance === "PRESENT" &&
            (validated.date_attendance === null || validated.hours === null)
        ) {
            throw new HttpError(
                "date_attendance dan hours harus diisi jika status ABSENT",
                400
            );
        }

        const attendance = await prisma.$transaction(async (tx) => {
            const createdAttendance = await tx.attendance.create({
                data: {
                    id_event: validated.id_event,
                    id_consoler: validated.id_consoler,
                    status_attendance: validated.status_attendance as StatusAttendance,
                    date_attendance: validated.date_attendance ?? null,
                    hours: validated.hours
                },
                include: {
                    event: true,
                    consoler: true,
                }
            });

            if (validated.status_attendance === "PRESENT") {
                const existingSalary = await tx.salary.findUnique({
                    where: {
                        id_attandance: createdAttendance.id
                    }
                });

                if (existingSalary) {
                    throw new HttpError(
                        "Salary untuk attendance ini sudah ada, tidak boleh create double",
                        409
                    );
                }
                const salaryValue =
                    validated.hours * createdAttendance.consoler.rate;

                await tx.salary.create({
                    data: {
                        id_consoler: validated.id_consoler,
                        id_attandance: createdAttendance.id,
                        salary: salaryValue,
                        status: SalaryStatus.PENDING,
                    }
                });
            }

            return createdAttendance;
        });

        return this.mapToResponse(attendance);
    }

    // get all data
    static async getAll(
        page: number,
        limit: number
    ): Promise<{ data: AttendanceResponse[]; totalItems: number }> {
        const skip = (page - 1) * limit;
        const data = await prisma.attendance.findMany({
            where: { deleted_at: null },
            include: {
                consoler: true,
                event: true,
            },
            orderBy: { created_at: "desc" },
            skip,
            take: limit,
        });
        const totalItems = await prisma.attendance.count({
            where: { deleted_at: null },
        });
        return {
            data: data.map(a => this.mapToResponse(a)),
            totalItems,
        };
    }

    // get by id data
    static async getById(id: string): Promise<AttendanceResponse | null> {
        const { id: validId } = Validation.validate(
            AttendanceValidation.GET_BY_ID,
            { id }
        );

        const attendance = await prisma.attendance.findUnique({
            where: { id: validId, deleted_at: null },
            include: {
                consoler: true,
                event: true,
            },
        });
        return attendance ? this.mapToResponse(attendance) : null;
    }

    // update data
    static async update(
        req: CreateAttendanceRequest & { id: string }
    ): Promise<AttendanceResponse> {

        const validated = Validation.validate(
            AttendanceValidation.UPDATE,
            req
        );

        const existing = await prisma.attendance.findUnique({
            where: { id: validated.id },
            include: { consoler: true }
        });

        if (!existing) {
            throw new HttpError("Data Attendance tidak ditemukan", 404);
        }

        const existingConsoler = await prisma.consoler.findUnique({
            where: { id: validated.id_consoler },
        });

        if (!existingConsoler) {
            throw new HttpError("Data Consoler tidak ditemukan", 404);
        }

        const existingEvent = await prisma.event.findUnique({
            where: { id: validated.id_event },
        });

        if (!existingEvent) {
            throw new HttpError("Data Event tidak ditemukan", 404);
        }

        if (
            validated.status_attendance === "ABSENT" &&
            validated.date_attendance != null &&
            validated.hours != null
        ) {
            throw new HttpError(
                "date_attendance dan hours harus kosong jika status ABSENT",
                400
            );
        }

        if (
            validated.status_attendance === "PRESENT" &&
            (validated.date_attendance === null || validated.hours === null)
        ) {
            throw new HttpError(
                "date_attendance dan hours harus diisi jika status ABSENT",
                400
            );
        }

        const attendance = await prisma.$transaction(async (tx) => {
            const updatedAttendance = await tx.attendance.update({
                where: { id: validated.id, deleted_at: null },
                data: {
                    id_event: validated.id_event,
                    id_consoler: validated.id_consoler,
                    status_attendance: validated.status_attendance as StatusAttendance,
                    date_attendance: validated.date_attendance ?? null,
                    hours: validated.hours
                },
                include: {
                    event: true,
                    consoler: true,
                }
            });

            const existingSalary = await tx.salary.findUnique({
                where: {
                    id_attandance: updatedAttendance.id
                }
            });

            const isNowPresent = validated.status_attendance === "PRESENT";
            const wasPresent = existing.status_attendance === "PRESENT";

            if (!wasPresent && isNowPresent) {
                const salaryValue =
                    validated.hours * updatedAttendance.consoler.rate;

                await tx.salary.create({
                    data: {
                        id_consoler: validated.id_consoler,
                        id_attandance: updatedAttendance.id,
                        salary: salaryValue,
                        status: SalaryStatus.PENDING
                    }
                });
            }

            if (wasPresent && !isNowPresent && existingSalary) {
                await tx.salary.delete({
                    where: { id: existingSalary.id }
                });
            }

            if (wasPresent && isNowPresent && existingSalary) {
                const salaryValue =
                    validated.hours * updatedAttendance.consoler.rate;

                await tx.salary.update({
                    where: { id: existingSalary.id },
                    data: {
                        salary: salaryValue
                    }
                });
            }

            return updatedAttendance;
        });

        return this.mapToResponse(attendance);
    }

    // delete
    static async delete(id: string): Promise<void> {
        const { id: validId } = Validation.validate(
            AttendanceValidation.GET_BY_ID,
            { id }
        );

        await prisma.$transaction(async (tx) => {
            await tx.salary.updateMany({
                where: { id_attandance: validId, deleted_at: null},
                data: { deleted_at: new Date()}
            })

            await tx.attendance.update({
                where: { id: validId },
                data: { deleted_at: new Date() },
            });
        });
    }
}