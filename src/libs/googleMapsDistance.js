'use strict'

const { waterfall, translate } = require('./library')

const axios = require('axios')

/**
 * Module that calculate the distance between two zip codes
 * @param {String} zipCodeStart Start/initial zip code
 * @param {String} zipCodeDestiny Final/destiny zip code
 * @returns Object with routes
 */
module.exports = (zipCodeStart, zipCodeDestiny) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          if (!zipCodeStart) return reject(translate('lib.zip.empty'))
          else if (zipCodeStart.trim().length < 8) reject(translate('lib.zip.size'))
          if (!zipCodeDestiny) return reject(translate('lib.zip.empty'))
          else if (zipCodeDestiny.trim().length < 8) reject(translate('lib.zip.size'))
          else done(null)
        },
        (done) => {
          //Insert the hyphen to search
          zipCodeStart = !zipCodeStart.includes('-') ? `${new String(zipCodeStart).trim().substring(0, 5)}-${new String(zipCodeStart).trim().substring(5, zipCodeStart.length)}` : zipCodeStart
          zipCodeDestiny = !zipCodeDestiny.includes('-') ? `${new String(zipCodeDestiny).trim().substring(0, 5)}-${new String(zipCodeDestiny).trim().substring(5, zipCodeDestiny.length)}` : zipCodeDestiny

          const url = `https://www.google.com/maps/dir/${zipCodeStart}/${zipCodeDestiny}` //Replace all ocurrences
          axios(url)
            .then(async response => {
              const html = response.data
              const addressInfo = html.split('"]],[[[0,\\"')[1].split(',\\"') //Array with instructions
              let routes = []
              /**
               * Contains the index of second route (if have third or more)
               */
              //let indexNextRoute = 178

              for (let x = 0;x < addressInfo.length;x++) {
                try {
                  if (addressInfo[x].split('\\"')[0] != '' && //Cannot be null
                    !addressInfo[x].split('\\"')[0].includes('\\') && //Cannot have backslash ('\') chars
                    addressInfo[x].split('\\"')[0].trim().length != 41 && //Cannot have 41 (hex chars)
                    !addressInfo[x].split('\\"')[0].includes('min') &&  //Cannot contains 'minutes' on name/description
                    addressInfo[x + 1].split('\\"')[0].includes('km')) { //Next position need to have 'kilometers' metric
                    routes.push({
                      road: addressInfo[x].split('\\"')[0],
                      nearDistance: addressInfo[x + 1].split('\\"')[0],
                      estimatedTime: addressInfo[x + 2].split('\\"')[0],
                      note: x == 0 ? html.split(',null,null,null,null,null,null,null,null,null,null,[[2,[\\"')[1].split('\\"]]]')[0] : null //This information will exist only in the first route
                    })
                  }
                }
                catch (err) {
                  //console.log(`Erro on line ${x}: ${err}`)
                }
              }

              // if (addressInfo[0].split('\\"')[0] != '') { //First route
              //   routes.push({
              //     road: addressInfo[0].split('\\"')[0],
              //     nearDistance: addressInfo[1].split('\\"')[0],
              //     estimatedTime: addressInfo[2].split('\\"')[0],
              //     note: html.split(',null,null,null,null,null,null,null,null,null,null,[[2,[\\"')[1].split('\\"]]]')[0]
              //   })
              // }
              // if (addressInfo[indexNextRoute].split('\\"')[0] != '' && addressInfo[indexNextRoute + 1].split('\\"')[0].includes('km')) { //Second route
              //   routes.push({
              //     road: addressInfo[indexNextRoute].split('\\"')[0],
              //     nearDistance: addressInfo[indexNextRoute + 1].split('\\"')[0],
              //     estimatedTime: addressInfo[indexNextRoute + 2].split('\\"')[0],
              //     note: ''
              //   })
              // }
              // //If have only two routes, the index of the seconde route will be in the index bellow, otherwise, will be in the index before (178)
              // indexNextRoute = 188
              // if (addressInfo[indexNextRoute].split('\\"')[0] != '' && addressInfo[indexNextRoute + 1].split('\\"')[0].includes('km')) { //If have Second route
              //   routes.push({
              //     road: addressInfo[indexNextRoute].split('\\"')[0],
              //     nearDistance: addressInfo[indexNextRoute + 1].split('\\"')[0],
              //     estimatedTime: addressInfo[indexNextRoute + 2].split('\\"')[0],
              //     note: ''
              //   })
              // }
              // indexNextRoute = 353 //For third routes (other maybe indexes with information: 431, 376)
              // if (addressInfo[indexNextRoute].split('\\"')[0] != '' && addressInfo[indexNextRoute + 1].split('\\"')[0].includes('km')) { //Third route
              //   routes.push({
              //     road: addressInfo[indexNextRoute].split('\\"')[0],
              //     nearDistance: addressInfo[indexNextRoute + 1].split('\\"')[0],
              //     estimatedTime: addressInfo[indexNextRoute + 2].split('\\"')[0],
              //     note: ''
              //   })
              // }

              if (routes != [] && routes.length > 0) {
                let payload = {
                  status: true,
                  //TODO: Need implement own block in json for success and erros on this module
                  message: translate('lib.zip.success'),
                  data: {
                    startPoint: zipCodeStart,
                    destinyPoint: zipCodeDestiny,
                    routes: routes
                  }
                }
                resolve(payload)
              }
              else {
                resolve({
                  status: false,
                  mensage: '',
                  data: []
                })
              }
            })
            .catch((err) =>
              done(err)
            )
        },
      ],
      (err) => {
        reject(err)
      }
    )
  })
}