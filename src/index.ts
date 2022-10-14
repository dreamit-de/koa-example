import { 
    GraphQLServer, 
    JsonLogger 
} from '@dreamit/graphql-server'
import { 
    userSchema, 
    userSchemaResolvers 
} from './ExampleSchemas'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

const graphqlServer = new GraphQLServer(
    {
        schema: userSchema,
        rootValue: userSchemaResolvers,
        logger:  new JsonLogger('koaServer', 'user-service'),
    }
)

const server = new Koa()
server.use(bodyParser())

server.use(async context => {
    await graphqlServer.handleRequestAndSendResponse(context.request , { 
        statusCode: context.response.status,
        setHeader: function(name, value) {
            context.response.set(name, value as string)
            return this 
        },
        removeHeader: function(name) {
            context.response.remove(name)
        },
        end: function(chunk) {
            context.body = chunk
            return this
        },
    })
})
  
server.listen(7070)
