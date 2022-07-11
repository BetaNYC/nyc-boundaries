import fs from 'fs'
import shp from 'shpjs'
import https from 'https'
import express from 'express'

require('dotenv').config({ path: '../.env' })

import datasets from './datasets.json'

const app = express()
const port = 3000

if (!fs.existsSync('files')) {
  fs.mkdirSync('files')
}

app.use(express.static('files'))
const server = app.listen(port, () =>
  console.log(`Static files listening on port ${port}!`)
)

async function downloadFile(url, dest) {
  //from https://futurestud.io/tutorials/node-js-how-to-download-a-file
  return await new Promise((resolve, reject) => {
    https
      .get(url, response => {
        const code = response.statusCode ?? 0

        if (code >= 400) {
          return reject(new Error(url + ': ' + dest))
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return downloadFile(response.headers.location, dest)
        }

        // save the file to disk
        const fileWriter = fs.createWriteStream(dest).on('finish', () => {
          resolve({})
        })

        response.pipe(fileWriter)
      })
      .on('error', error => {
        reject(error)
      })
  })
}

function saveFile(data, dest) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, data, function (err) {
      resolve()
      if (err) {
        reject(err)
      }
    })
  })
}

function getDataset(dataset) {
  return new Promise(async (resolve, reject) => {
    const { nameCol, nameAlt, id, url, datasetName } = dataset
    const fileName = `${id}.zip`
    const dest = `./files/${fileName}`
    //download zipped shapefile
    if (!fs.existsSync(dest)) {
      await downloadFile(url, dest).catch(err => reject(err))
    }

    //open zip and return new geojson with nameCol and nameAlt as properties
    const features = await shp(`http://localhost:3000/${fileName}`)
      .then(geojson => {
        let features
        if (Array.isArray(geojson)) {
          //for zips with more than one layer (Sanitation Districts)
          features = geojson.reduce(
            (features, collection) => [...features, ...collection.features],
            []
          )
        } else {
          features = geojson.features
        }
        console.log(`${datasetName} has ${features.length} features`)

        //restructure properties
        return features.map(feature => {
          const { geometry, properties } = feature
          const formatedFeature = {
            type: 'Feature',
            geometry,
            properties: {
              id
            }
          }

          if (nameCol in properties) {
            formatedFeature.properties['nameCol'] = String(properties[nameCol])
          } else {
            reject(
              `${datasetName} does not contain the field of ${nameCol} : ${properties}`
            )
          }

          if (nameAlt && nameAlt in properties) {
            formatedFeature.properties['nameAlt'] = String(properties[nameAlt])
          } else {
            ;`${datasetName} does not contain the field of ${nameAlt} : ${properties}`
          }

          return formatedFeature
        })
      })
      .catch(err => reject(err))

    resolve(features)
  })
}

async function main() {
  const featureCollection = await Promise.all(
    datasets.map(dataset => getDataset(dataset))
  )
    .then(collections => {
      //combine all collections to a single feature collection
      return {
        type: 'FeatureCollection',
        features: collections.reduce((prev, curr) => [...prev, ...curr], [])
      }
    })
    .catch(err => console.log(err))

  server.close()

  //save featureCollection
  await saveFile(JSON.stringify(featureCollection), './all_bounds.geojson')
}

main()
