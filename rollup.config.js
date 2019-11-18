import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import replace from '@rollup/plugin-replace';

require('dotenv').config();

export default [
  {
    input: 'src/js/index.js',
    plugins: [
      replace({ API_KEY: `'${process.env.API_KEY}'` }),
      postcss({
        plugins: [
          postcssPresetEnv({
            browsers: ['last 1 version', 'ie >= 11']
          })
        ],
        extensions: ['.css']
      }),
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      process.env.NODE_ENV === 'production' && uglify(),
      process.env.NODE_ENV === 'development' &&
        serve({
          open: true,
          host: 'localhost',
          port: 3000,
          contentBase: ''
        })
    ],
    output: {
      file: 'build/bundle.js',
      format: 'umd',
      sourcemap: process.env.NODE_ENV === 'development' && 'inline',
      name: 'window',
      extend: true
    }
  }
];
