class ApiResponse<T> {
    statusCode: number
    data: T
    message: string
    success: boolean

    constructor(
        statusCode: number,
        data: T,
        message: string,
        success: boolean
    ) {
            
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode < 400
        this.success = success
    }
}

export { ApiResponse }