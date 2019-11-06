import fs from 'fs';
import shp from 'shpjs';
import { http } from 'follow-redirects';
import express from 'express';

require('dotenv').config({ path: '../.env' });

import datasets from './datasets.json';

const app = express();
const port = 3000;

app.use(express.static('files'));
const server = app.listen(port, () =>
  console.log(`Static files listening on port ${port}!`)
);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = http
      .get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
          file.close(resolve(dest)); // close() is async, call cb after close completes.
        });
      })
      .on('error', function(err) {
        // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        reject(err.message);
      });
  });
}

function saveFile(data, dest) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, data, function(err) {
      resolve();
      if (err) {
        reject(err);
      }
    });
  });
}

function getDataset(dataset) {
  return new Promise(async (resolve, reject) => {
    const { nameCol, nameAlt, id, url, datasetName } = dataset;
    const fileName = `${id}.zip`;
    const dest = `./files/${fileName}`;
    //download zipped shapefile
    if (!fs.existsSync(dest)) {
      console.log(url, dest);
      await download(url, dest).catch(err => reject(err));
    }

    //open zip and return new geojson with nameCol and nameAlt as properties
    const features = await shp(`http://localhost:3000/${fileName}`)
      .then(geojson => {
        let features;
        if (Array.isArray(geojson)) {
          //for zips with more than one layer (Sanitation Districts)
          features = geojson.reduce(
            (features, collection) => [...features, ...collection.features],
            []
          );
        } else {
          features = geojson.features;
        }
        console.log(`${datasetName} has ${features.length} features`);

        //restructure properties
        return features.map(feature => {
          const { geometry, properties } = feature;
          const formatedFeature = {
            type: 'Feature',
            geometry,
            properties: {
              id
            }
          };

          if (nameCol in properties) {
            formatedFeature.properties['nameCol'] = String(properties[nameCol]);
          } else {
            reject(
              `${datasetName} does not contain the field of ${nameCol} : ${properties}`
            );
          }

          if (nameAlt && nameAlt in properties) {
            formatedFeature.properties['nameAlt'] = String(properties[nameAlt]);
          } else {
            `${datasetName} does not contain the field of ${nameAlt} : ${properties}`;
          }

          return formatedFeature;
        });
      })
      .catch(err => reject(err));

    resolve(features);
  });
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
      };
    })
    .catch(err => console.log(err));

  server.close();

  //save featureCollection
  await saveFile(JSON.stringify(featureCollection), './all_bounds.geojson');
}

main();
