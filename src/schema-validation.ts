import { SchemaMatchingError } from './schema-matching-error'
import type { ExtendedJsonSchema, ValidationContext } from './type'


/**
 * check whether a certain json-schema is a subset of another json schema
 */
export function validateJsonSchemas(context: ValidationContext) {
    if (!context.initialAssigning) {
        context.initialAssigning = context.assigning
    }
    if (!context.initialTarget) {
        context.initialTarget = context.target
    }
    if (context.path === undefined) {
        context.path = []
    }

    const target = context.target
    const assigning = context.assigning

    if (target.$ref || assigning.$ref) {
        debugger
    }

    if (!target.type || !assigning.type) {
        throw new SchemaMatchingError(context, "invalid schema type")
    }
    if (target.type !== assigning.type) {
        throw new SchemaMatchingError(context, `different schema Types ${target.type} and ${assigning.type}`)
    }
    if (target.type === "object") {
        const targetProps = target.properties ?? {}
        const assigningProps = assigning.properties ?? {}

        const requiredTargetProps = new Set(target.required ?? [])
        const requiredAssigningProps = new Set(assigning.required ?? [])
        for (const property in targetProps) {
            if (!(property in assigningProps)) {
                if (requiredTargetProps.has(property)) {
                    throw new SchemaMatchingError(context, `property ${property} is missing`)
                }
            } else {
                validateJsonSchemas({
                    target: targetProps[property] as ExtendedJsonSchema,
                    assigning: assigningProps[property] as ExtendedJsonSchema,
                    path: [...context.path, property]
                })
            }


            if (requiredTargetProps.has(property)) {
                if (!requiredAssigningProps.has(property)) {
                    throw new SchemaMatchingError(context, `property ${property} is required in target type but optional in assigning type`)
                }
            }

        }
    } else if (target.type === "number") {
        if (target.const) {
            debugger
        }
        if (target.enum) {
            debugger
        }
    } else if (target.type === "boolean") {
        if (target.const) {
            debugger
        }
        if (target.enum) {
            debugger
        }
    } else if (target.type === "string") {
        if (target.const) {
            debugger
        }
        if (target.enum) {
            if (assigning.const) {
                if (!target.enum.includes(assigning.const)) {
                    throw new SchemaMatchingError(context, `constant '${assigning.const}' is not part of the target enum ${target.enum.join(",")}`)
                }
            } else {
                throw new SchemaMatchingError(context, `target needs enum but 'string' might not be part of it (${target.enum.join(",")})`)
            }
        }
        if (target.format) {
            debugger
        }
    } else {
        debugger
    }

}