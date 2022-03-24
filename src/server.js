const koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const axios = require('axios')
const qs = require('qs')

const config = require('../config')


const app = new koa()
const router = new Router()
app.use(bodyParser())

router.get('/', async (ctx, next) => {
    try {
        ctx.body = 'Hello World'
    }catch(err) {
        console.error(err);
    }
})

router.post('/auth/p/token', async (ctx, next) => {
    try {
        const response = await axios({
            method: 'post',
            url: config.apiUrl + '/oauth2/token',
            transformRequest: [function (data) {
                return qs.stringify(data)
            }],
            data: {
                grant_type: 'password',
                username: ctx.request.body.email,
                password: ctx.request.body.password
            },
            auth: {
                username: config.clientId,
                password: config.clientSecret
            }
        })
        ctx.body = response.data
    } catch(e) {
        console.error(e);
       ctx.status = e.response.status
         ctx.body = e.response.data
    }
})

router.post('/auth/r/token', async (ctx, next) => {
    try {
        const response = await axios({
            method: 'post',
            url: config.apiUrl + '/oauth2/refresh',
            transformRequest: [function (data) {
                return qs.stringify(data)
            }],
            data: {
                grant_type: 'refresh_token',
                refresh_token: ctx.request.body.refresh_token
            },
            auth: {
                username: config.clientId,
                password: config.clientSecret
            }
        })
        ctx.body = response.data
    } catch(e) {
        console.error(e);
       ctx.status = e.response.status
         ctx.body = e.response.data
    }
})


app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(3000, () => {
    console.log('server is running at port 3000')
})