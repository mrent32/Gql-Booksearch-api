const express = require('express');
const {ApolloServer } = require('@apollo/server')
const {expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth')
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { typeDefs, resolvers} = require('./schemas')

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  params: authMiddleware
})

const startApolloserver = async () => {
  await server.start()



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/graphql', expressMiddleware(server, {
  context: authMiddleware
}))

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
    console.log(`Use GraphQl at http://localhost:${PORT}/graphql`);
  })
});
};

startApolloserver();
