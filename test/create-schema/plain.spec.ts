import { createSchema } from "@lib"

describe("create-schema", () => {

    it("creates plain schema for object", () => {
        const schema = createSchema({
            test: 123
        })

        expect(schema).toStrictEqual({
            type: "object",
            properties: {
                test: {
                    type: "number",
                    enum: [
                        123,
                    ],
                },
            },
            additionalProperties: false,
            required: [
                "test",
            ],
        })
    })

})