import type { ExtendedJsonSchema } from './type'


export interface CreateSchemaOptions {
    /**
     * whether values shouldnt be parsed as const (this would keep the value in the "enum" array)
     * (within in the context of this package it would then be optionally removed by merging)
     */
    disableAssumeConst?: boolean
}

export function createSchema(schemaOBject: unknown, options: CreateSchemaOptions = {}): ExtendedJsonSchema {
    const schema: ExtendedJsonSchema = {}

    if (typeof schemaOBject == "object") {
        schema.type = "object"
        schema.properties ??= {}
        schema.additionalProperties = false
        schema.required = []
        for (const key in schemaOBject) {
            schema.properties[key] = createSchema(schemaOBject[key], options)
            schema.required.push(key)

        }
    } else if (typeof schemaOBject == "string") {
        schema.type = "string"

        if (!options.disableAssumeConst) {
            schema.enum ??= []
            schema.enum.push(schemaOBject)
        }

        if (!isNaN(+new Date(schemaOBject))) {
            delete schema.enum
            schema.format = "date-time"
        }

    } else if (typeof schemaOBject == "number") {
        schema.type = "number"
        if (!options.disableAssumeConst) {
            schema.enum ??= []
            schema.enum.push(schemaOBject)
        }
    }
    return schema
}
