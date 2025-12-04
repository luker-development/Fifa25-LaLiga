export class AppError extends Error {
    status;
    details;
    constructor(message, status = 400, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}
