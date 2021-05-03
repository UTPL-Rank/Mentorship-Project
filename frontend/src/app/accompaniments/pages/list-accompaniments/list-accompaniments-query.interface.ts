export interface ListAccompanimentsQuery {
    mentorId?: string;
    studentId?: string;
    page?: number;
    important?: boolean;
    limit?: number;
}
