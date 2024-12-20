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
    const oldSchema: ExtendedJsonSchema = {
        oneOf: [
            structuredClone(schemaTemplate),
            {
                type: "string"
            }
        ]
    }

    let merged: ExtendedJsonSchema = structuredClone(oldSchema)
    const keyList: Array<string> = []
    for (let i = 0; i < 10; i++) {
        const newSchema: ExtendedJsonSchema = structuredClone(schemaTemplate);

        merged = mergeSchema({
            old: merged,
            new: newSchema,
            path: [],
            enumKeyList: keyList,
            params: { mergeLength: 10 }
        })


        if (i === 7) {
            expect(merged).toEqual(oldSchema)
        }
    }

    expect(merged).toEqual(oldSchema)
})