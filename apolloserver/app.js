const express = require('express');
const bodyParser = require('body-parser');
const Mongoose = require('mongoose');

const PORT = 8080;
const app = express();
const { apolloExpress, graphiqlExpress } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

Mongoose.Promise = global.Promise;
Mongoose.connect(
 "mongodb://inventoriku:inventoriku123123@103.161.185.61:55555/inventoriku?authMechanism=DEFAULT",
 (err) => {
  if (err) {
   return err;
  }
  return true;
 }
);

const seed = require('./seed');

seed();

const Schema = require('./schema');
const Resolvers = require('./resolvers');
const Connectors = require('./connectors');

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

app.use('/graphql', bodyParser.json(), apolloExpress({
  schema: executableSchema,
  context: {
    constructor: Connectors,
  },
  rootValue: 'Hello World',
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${PORT}/graphql`
));
