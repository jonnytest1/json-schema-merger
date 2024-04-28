import type { ValidationContext } from './type'

export class SchemaMatchingError extends Error {


    constructor(public context: ValidationContext, message: string) {
        super(message)
        console.warn(message)
    }


    toMessageString() {
        return `${this.message} at /${this.context.path.join("/")}`
    }
}
