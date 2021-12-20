class ErrorMessage {
    public getErrorMessage(error: ErrorObject) {
        if (error.message.includes("required"))
            return {
                requiredFields: Object.keys(error.errors)
            }

        if (error.message.includes("duplicate key error collection"))
            return {
                duplicateKeys: Object.keys(error.keyPattern)
            }

        if (error.message.includes("Cast to ObjectId failed"))
            return {
                invalidId: error.value
            }

        if (error.message.includes("jwt must be provided"))
            return {
                message: error.message
            }

        if (error.message.includes('Cast to date failed for value "Invalid Date"')) {
            return {
                invalidDate: "Invalid Date Format in some data provided, try (YYYY-MM-DD)"
            }
        }

        if (error.message.includes("Invalid branch code"))
            return {
                cbuGenerationError: error.message
            }

        if (error.message.includes("User validation failed: branchCode")) {
            return {
                InvalidLength: error.message
            }
        }

        return "Unknown error"
    }
}

interface ErrorObject {
    message: string
    errors: Object
    keyPattern: Object
    value: string
}


const errorMessage = new ErrorMessage();

export { errorMessage, ErrorObject };