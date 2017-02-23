'use strict'

const reekoh = require('reekoh')
const _plugin = new reekoh.plugins.ExceptionLogger()

let raygunClient =  null

_plugin.on('exception', (error) => {
  console.log('-exception- ', error )
  raygunClient.send(error, {}, (response) => {
    if (response.statusCode === 202) return

    console.error('Error on Raygun.', response.statusMessage)
    _plugin.logException(new Error(response.statusMessage))
  })
})

_plugin.once('ready', () => {
  console.log('-ready-')
  let raygun = require('raygun')
  raygunClient = new raygun.Client().init({ apiKey: _plugin.config.apiKey})

  _plugin.log('Raygun Exception Handler Initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
