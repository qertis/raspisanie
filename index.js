const https = require('https')
/**
 * @description Yandex Raspisanie Node API
 * @see https://tech.yandex.ru/rasp/doc/reference/schedule-point-point-docpage/
 */
module.exports = class Raspisanie {
  /**
   * @private
   * @returns {String}
   */
  get _options() {
    const self = this
    return {
      host: 'api.rasp.yandex.net',
      method: 'GET',
      agent: false,
      get path() {
        let path = '/v1.0/search/'
        path += `?apikey=${self.RASP_API_KEY}`
        path += `&format=${self.format}`
        path += `&from=${self.from}`
        path += `&to=${self.to}`
        path += `&lang=${self.lang}`
        if (self.date) path += `&date=${self.date}`
        if (self.transportTypes)
          path += `&transport_types${self.transportTypes}`
        if (self.system) path += `&system${self.system}`
        if (self.path) path += `&path${self.path}`
        return path
      }
    }
  }
  /**
   * @public
   * @param {object} obj
   * @returns {Promise}
   */
  request({ from, to, path, system, transportTypes, date, lang = 'ru', format = 'json' }) {
    this.from = from
    this.to = to
    this.lang = lang
    this.format = format
    this.date = date
    this.transportTypes = transportTypes
    this.system = system
    this.path = path
    return new Promise((resolve, reject) => {
      https
        .request(this._options)
        .on('error', error => {
          return reject(error)
        })
        .on('response', async res => {
          try {
            const data = await this._processResponse(res)
            return resolve(data)
          } catch (error) {
            return reject(error)
          }
        })
        .end()
    })
  }
  /**
   * @constructor
   * @param {String} RASP_API_KEY
   */
  constructor(RASP_API_KEY) {
    this.RASP_API_KEY = RASP_API_KEY
  }
  /**
   * @private
   * @param {*} res
   * @returns {Promise}
   */
  _processResponse(res) {
    return new Promise((resolve, reject) => {
      let data = ''
      res
        .on('error', onError)
        .on('data', onData)
        .on('end', onEnd)
      /**
       * @param {Error} error
       */
      function onError(error) {
        reject(error)
      }
      /**
       * @param {Buffer} chunk
       */
      function onData(chunk) {
        data += chunk
      }
      function onEnd() {
        try {
          data = JSON.parse(data.toString('utf-8'))
          if (data.error) reject(data.error)
          else resolve(data)
        } catch (error) {
          reject(error)
        }
      }
    })
  }
}
