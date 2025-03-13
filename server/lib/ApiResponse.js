// API Response class for standardized successful responses
export default class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        if (data) this.data = data;
    }
}