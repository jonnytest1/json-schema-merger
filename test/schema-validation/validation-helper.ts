import { SchemaMatchingError } from '../../src/schema-matching-error'
import { validateJsonSchemas } from '../../src/schema-validation'
import type { ExtendedJsonSchema } from '../../src/type'

export function expectValidationError(assigningSchema: ExtendedJsonSchema, targetSchema: ExtendedJsonSchema, error: string) {
    try {
        validateJsonSchemas({
            assigning: assigningSchema,
            target: targetSchema
        })
        expect(true).toBeFalsy()
    } catch (e) {
        expect(e).toBeInstanceOf(SchemaMatchingError)
        const err = e as SchemaMatchingError
        expect(err.toMessageString()).toBe(error)
    }
}

