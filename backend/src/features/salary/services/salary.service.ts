import { SalaryStatus, StatusAttendance } from "@prisma/client";
import { prisma } from "../../../core/applications/database";
import { HttpError } from "../../../shared/helpers/http.error.helper";
import { Validation } from "../../../shared/helpers/validation.helper";
import { CreateSalaryRequest, SalaryResponse, TotalSalaryResponse } from "../models/salary.model";
import { SalaryValidation } from "../validations/salary.validation";

export class SalaryService {
    private static mapToResponse(s: any): SalaryResponse {
        return {
            id: s.id,
            consoler: {
                id_consoler: s.consoler.id,
                name: s.consoler.name,
                email: s.consoler.email,
                rate: s.consoler.rate,
            },
            total_salary: s.total_salary,
            date_paid: s.date_paid,
            status: s.status,
            created_at: s.created_at,
            updated_at: s.updated_at
        };
    }

    private static mapToResponseTotalSalary(s: any): TotalSalaryResponse {
        const totalSalary = (s.salary.total_salary_pending || 0) + (s.salary.total_salary_paid || 0);
        return {
            name: s.consoler.name,
            email: s.consoler.email,
            rate: s.consoler.rate,
            total_hours_attendance: s.attendance.total_hours_attendance,
            salary: {
                total_salary_pending: s.salary.total_salary_pending,
                total_salary_paid: s.salary.total_salary_paid,
                total_salary: totalSalary,
            }
        };
    }

    // get all data
    static async getAll(
        page: number,
        limit: number
    ): Promise<{ data: SalaryResponse[]; totalItems: number }> {
        const skip = (page - 1) * limit;
        const data = await prisma.salary.findMany({
            where: { deleted_at: null },
            include: { consoler: true },
            orderBy: { created_at: "desc" },
            skip,
            take: limit,
        });
        const totalItems = await prisma.salary.count({
            where: { deleted_at: null },
        });
        return {
            data: data.map(this.mapToResponse),
            totalItems,
        };
    }

    // get by id data
    static async getById(id: string): Promise<SalaryResponse | null> {
        const { id: validId } = Validation.validate(
            SalaryValidation.GET_BY_ID,
            { id }
        );

        const salary = await prisma.salary.findUnique({
            where: { id: validId, deleted_at: null },
            include: {
                consoler: true,
            }
        });
        return  salary ? this.mapToResponse(salary) : null;
    }

    // get total salary
    static async getTotalSalary(id_consoler: string): Promise<TotalSalaryResponse | null> {
        const { id_consoler: validId } = Validation.validate(
            SalaryValidation.GET_TOTAL_SALARY,
            { id_consoler }
        );

        const consoler = await prisma.consoler.findUnique({
            where: { id: validId }
        });

        if (!consoler) {
            return null;
        }

        const pending = await prisma.salary.aggregate({
            where: {
                id_consoler: validId,
                deleted_at: null,
                status: SalaryStatus.PENDING
            },
            _sum: { salary: true }
        });

        const paid = await prisma.salary.aggregate({
            where: {
                id_consoler: validId,
                deleted_at: null,
                status: SalaryStatus.PAID
            },
            _sum: { salary: true }
        });

        const totalHours = await prisma.attendance.aggregate({
            where: {
                id_consoler: validId,
                deleted_at: null,
                status_attendance: StatusAttendance.PRESENT
            },
            _sum: { hours: true }
        });

        const result = {
            consoler,
            attendance: { total_hours_attendance: totalHours._sum.hours ?? 0 },
            salary: {
                total_salary_pending: pending._sum.salary ?? 0,
                total_salary_paid: paid._sum.salary ?? 0
            }
        };

        return this.mapToResponseTotalSalary(result);
    }

    // update data
    static async update(req: { id: string; status: SalaryStatus }): Promise<SalaryResponse> {
        const validated = Validation.validate(
            SalaryValidation.UPDATE_STATUS,
            req
        );

        const existing = await prisma.salary.findUnique({
            where: { id: validated.id, deleted_at: null },
            include: {
                consoler: true,
                attandance: true
            }
        });

        if (!existing) {
            throw new HttpError("Data Salary tidak ditemukan", 404);
        }

        // 🔒 VALIDASI: kalau sudah PAID, tidak bisa diubah lagi
        if (existing.status === SalaryStatus.PAID) {
            throw new HttpError(
                "Salary yang sudah PAID tidak dapat diubah",
                400
            );
        }

        const salary = await prisma.$transaction(async (tx) => {
            return tx.salary.update({
                where: { id: validated.id },
                data: {
                    status: validated.status as SalaryStatus,
                    date_paid: validated.status === SalaryStatus.PAID 
                        ? new Date() 
                        : null
                },
                include: {
                    consoler: true,
                    attandance: true
                }
            });
        });

        return this.mapToResponse(salary);
    }
}