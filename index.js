const express = require('express');
const app = express()
const volleyball = require('volleyball')
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const PORT = process.env.PORT || 3000

app.use(volleyball)

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String,
    potatoChip: String,
    number: Float
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  potatoChip: () => {
      return 'this is for potato chips ONLY';
  },
  number: () => {
      const num = (Math.random() * 100)
      return num
  }
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }));

app.listen(PORT, console.log('potato'))

