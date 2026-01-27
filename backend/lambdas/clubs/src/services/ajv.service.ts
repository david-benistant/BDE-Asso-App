import { TSchema } from "@sinclair/typebox";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import ApiError, { ApiErrorStatus } from "@services/errors.service";

class AjvService {
    private ajv = new Ajv({ allErrors: true });

    constructor() {
        addFormats(this.ajv);
    }

    validate(schema: TSchema, data: any) {
        const validate = this.ajv.compile(schema);

        if (!validate(data)) {
            console.log(validate.errors);
            throw new ApiError(
                400,
                ApiErrorStatus.BAD_REQUEST,
                validate.errors,
            );
        }
    }
}

export default new AjvService();
