import { mergeSchema, type ExtendedJsonSchema } from '../../src'


it("creates plain schema for object", () => {

    const schemaTemplate = {
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
    } satisfies ExtendedJsonSchema


    let merged: ExtendedJsonSchema = structuredClone(schemaTemplate)
    const keyList: Array<string> = []
    for (let i = 0; i < 10; i++) {
        const newSchema = structuredClone(schemaTemplate)
        newSchema.properties.test.enum[0] = i

        merged = mergeSchema({
            old: merged,
            new: newSchema,
            path: [],
            enumKeyList: keyList,
            params: { mergeLength: 10 }
        })


        if (i === 7) {
            expect(merged).toEqual({
                type: "object",
                properties: {
                    test: {
                        type: "number",
                        enum: [
                            123,
                            0,
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                        ],
                    },
                },
                additionalProperties: false,
                required: ["test"]
            })
        }
    }

    expect(merged).toEqual({
        type: "object",
        properties: {
            test: {
                type: "number",
                merged: true,
            },
        },
        additionalProperties: false,
        required: ["test"]
    })
})