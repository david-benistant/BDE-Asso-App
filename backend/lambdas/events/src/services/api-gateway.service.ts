class ApiGatewayService {
    response<T>(status: number, body?: T) {
        return {
            statusCode: status,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined
        };
    }
}

export default new ApiGatewayService();
