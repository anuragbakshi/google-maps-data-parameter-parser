function GmdpException(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, GmdpException);
    else
        this.stack = (new Error()).stack;
}

GmdpException.prototype = Object.create(Error.prototype);
GmdpException.prototype.name = "GmdpException";

module.exports = GmdpException;
