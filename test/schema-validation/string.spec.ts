
import { expectValidationError } from './validation-helper'

describe("string type", () => {

    it("throws on mismatched enum", () => {
        expectValidationError({ type: "string", const: "test" },
            {
                type: "string",
                enum: ["a", "b"]
            }, "constant 'test' is not part of the target enum a,b at /")
    })

})