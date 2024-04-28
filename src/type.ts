import type { JSONSchema6 } from 'json-schema'

export type ExtendedJsonSchema = JSONSchema6 & { merged?: boolean, _optional?: Array<string> }

export type MergeSchemaOptions = {
    old: ExtendedJsonSchema,
    new: ExtendedJsonSchema,
    /**
     * will fill a list of all found properties
     */
    enumKeyList?: Array<string>,
    path?: Array<string>,
    params: {
        mergeLength: number,
        [key: `mergeLength_${string}`]: number
    }
}
