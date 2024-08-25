import type { ExtendedJsonSchema } from '../../src/type'
import { expectValidationError } from './validation-helper'


describe("schema valdiation", () => {

    it("validates object types", () => {
        const assigningSChema: ExtendedJsonSchema = {
            type: "string"
        }
        const targetSchema: ExtendedJsonSchema = {
            type: "number"
        }
        expectValidationError(assigningSChema, targetSchema, "different schema Types number and string at /")
    })
    it("validates object types recursively", () => {
        const assigningSChema: ExtendedJsonSchema = {
            type: "object",
            properties: {
                test: {
                    type: "string"
                }
            }
        }
        const targetSchema: ExtendedJsonSchema = {
            type: "object",
            properties: {
                test: {
                    type: "number"
                }
            }
        }
        expectValidationError(assigningSChema, targetSchema, "different schema Types number and string at /test")
    })
})