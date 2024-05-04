# json-schema-merger
create json schema from pojo and merge schemas
https://www.npmjs.com/package/json-schema-merger


## Motivation

this was part of my smarthome development
the problem description was having an "unknown" node provide a series of json strings and then through analysis of the different jsons being able to create a schema (https://json-schema.org/) that describes the dataset

example:
emit1:
```json
    {
        "test":123
    }
```
emit2:
```json
    {
        "test":456
    }
```

then the resulting schema should describe an object that has a test property that can be either 123 or 456
or in ts:
```ts
   type schema={test:123|456}
```
if the value is a date or something hat frequently changes it should be collapsed from an enum/const/type union to a more generic type at latest after a few emits(i picked 10 as a default)


## create Schema

create a json schema from a json object:
```ts

const myRandomObject={
    test: 123
}

const schema=createSchema(myRandomObject)
/*
{
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
}
*/
```
by default all values are treated as constant values

this can be changed by passing a second argument to createSchema

```ts
createSchema(myRandomObject,{disableAssumeConst:true})
```


## schema merging

assuming 2 schemas of *similar* json objects 
this can be used to update and refine the initial schema

```ts
const schema1={...}
const schema2={...}

// currently modifies "old" schema
schema1 = mergeSchema({
    old: schema1,
    new: schema2,
    params: { mergeLength: 10 }
})
```
if the amount of different values for any given property exceed `mergeLength` it will be merged from an enum to a generic 

example:
```ts
{
    type:"string",
    enum:["1","2","3","...10"]
}
```
will be merged to just 
```ts
{
    type:"string"
    merged:true //indicator for future attempts
}
```

#### params

params support individual mergeLength per field in the form of 
a dot separated path string 
```ts
{
    a:{
        b:123
    }
}
```
=> 
```ts
{
    mergeLength: 10 
    "a.b":5
}
```

if `enumKeyList` is passed it will be filled with all found object paths (and can be used to generate the param list)


## Schema Validation

let say you have a schema defining what is allowed as an input
and a schema defining what is provided to that input

then u can use 



```ts
validateJsonSchemas({
    assigning:providingSchema
    target:inputSchema
})
```
then if the providing schema cannot be assigned (isnt a subset) of the inputSchema it will throw an error


## TODO:
- add more types to the schema and merging


