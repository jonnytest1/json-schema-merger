

import { expectValidationError } from './validation-helper'

describe("object type", () => {

    it("throws on missing required properties", () => {
        expectValidationError({ type: "object" },
            {
                type: "object",
                properties: {
                    "test": {
                        type: "any"
                    }
                },
                required: ["test"]
            }, "property test is missing at /")
    })

})