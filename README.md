# json-schema-merger
create json schema from pojo and merge schemas
https://www.npmjs.com/package/json-schema-merger


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


