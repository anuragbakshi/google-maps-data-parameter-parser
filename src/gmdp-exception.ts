export class GmdpException extends Error {
    name = "GmdpException";

    constructor(message: string) {
        super(message);

        // Use V8's native method if available, otherwise fallback
        if ("captureStackTrace" in Error) {
            Error.captureStackTrace(this, GmdpException);
        }
    }
}
