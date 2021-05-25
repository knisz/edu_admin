'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',  //当前访问的后端接口地址
  BASE_API: '"http://localhost:8001"',  //当前访问的后端接口地址
})
