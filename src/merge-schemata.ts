import type { ExtendedJsonSchema, MergeSchemaOptions } from './type'

function getLimitForPath(opts: MergeSchemaOptions): number {
    const params = opts.params
    const pathKey = `mergeLength_${opts.path.join(".")}`

    if (pathKey in params) {
        return params[pathKey]
    }
    return params.mergeLength
}

export function mergeSchema(opts: MergeSchemaOptions): ExtendedJsonSchema {
    if (opts.path === undefined) {
        opts.path = []
    }


    const old = opts.old
    const newSchema = opts.new

    if (old.type === newSchema.type) {
        if (old.type == "object") {
            const oldProps = old.properties
            if (!oldProps) {
                debugger
                throw new Error("no properties on object")
            }
            const keysOld = Object.keys(oldProps)
            const newProps = newSchema.properties ?? {}
            const keysNew = new Set(Object.keys(newProps))

            const oldKeys = new Set(keysOld)
            keysNew.forEach(key => oldKeys.delete(key))
            keysOld.forEach(key => keysNew.delete(key))
            if (oldKeys.size == 0 && keysNew.size == 0) {
                old.required ??= []
                for (const key of keysOld) {
                    const oldKeyProp = oldProps[key]
                    const newKeyProp = newProps[key]
                    if (oldKeyProp && typeof oldKeyProp == "object" && newKeyProp && typeof newKeyProp == "object") {
                        mergeSchema({
                            ...opts,
                            old: oldKeyProp,
                            new: newKeyProp,
                            path: [...opts.path, key],
                        })
                    }

                    if (typeof old.required == "object" && !old.required.includes(key)) {
                        if (!old._optional?.includes(key)) {
                            old.required.push(key)
                        }
                    }
                }
                old.additionalProperties = false
                return old
            } else if (keysNew.size > 0) {
                old.required ??= []
                for (const key of keysOld) {
                    const oldKeyProp = oldProps[key]
                    const newKeyProp = newProps[key]
                    if (oldKeyProp && typeof oldKeyProp == "object" && newKeyProp && typeof newKeyProp == "object") {
                        mergeSchema({
                            ...opts,
                            old: oldKeyProp,
                            new: newKeyProp,
                            path: [...opts.path, key],
                        })
                    }

                    if (typeof old.required == "object" && !old.required.includes(key)) {
                        if (!old._optional?.includes(key)) {
                            old.required.push(key)
                        }
                    }
                }
                for (const newKey of keysNew) {
                    oldProps[newKey] = newProps[newKey]
                }
                return old
            } else if (oldKeys.size > 0) {
                old.required ??= []
                old._optional ??= []

                for (const okey of oldKeys) {
                    if (!old._optional.includes(okey)) {
                        old._optional.push(okey)
                    }
                    old.required = old.required?.filter(key => key !== okey)
                }
                for (const key of keysOld) {
                    const oldKeyProp = oldProps[key]
                    const newKeyProp = newProps[key]
                    if (oldKeyProp && typeof oldKeyProp == "object" && newKeyProp && typeof newKeyProp == "object") {
                        mergeSchema({
                            ...opts,
                            old: oldKeyProp,
                            new: newKeyProp,
                            path: [...opts.path, key],
                        })
                    }

                    if (typeof old.required == "object" && !old.required.includes(key)) {
                        if (!old._optional?.includes(key)) {
                            old.required.push(key)
                        }
                    }
                }
                return old
            }
            debugger
        } else if (old.type == "string") {
            if (old.format !== newSchema.format) {
                debugger;
            }
            if (old.merged) {
                return old
            }
            if (old.enum && newSchema.enum) {
                old.enum = [...new Set([...old.enum, ...newSchema.enum])]

                if (old.enum.every(val => typeof val == "string" && !isNaN(+new Date(val)))) {
                    old.format = "date-time"
                } else {
                    delete old.format
                }

                const limit = getLimitForPath(opts)
                if (old.enum.length > limit) {
                    old.merged = true
                    delete old.enum
                } else {
                    opts.enumKeyList?.push(opts.path.join("."))
                }

            }
        } else if (old.type == "number") {
            if (old.merged) {
                return old
            }
            if (old.enum && newSchema.enum) {
                old.enum = [...new Set([...old.enum, ...newSchema.enum])]

                const limit = getLimitForPath(opts)
                if (old.enum.length > limit) {
                    old.merged = true
                    delete old.enum
                } else {
                    opts.enumKeyList?.push(opts.path.join("."))
                }
            } else {
                debugger
            }
        } else {
            debugger
        }
        return old
    } else {
        debugger;
        return {
            oneOf: [
                old,
                newSchema
            ]
        }
    }
}
