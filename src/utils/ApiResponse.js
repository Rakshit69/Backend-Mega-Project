class ApiResponse{
    constructor(
        statuscode,
        data = null,
        message = "success",

    ) {
        this.message = message;
        this.statuscode = statuscode;
        this.data = data;
        this.success = statuscode < 400;

    }
}

export { ApiResponse };
