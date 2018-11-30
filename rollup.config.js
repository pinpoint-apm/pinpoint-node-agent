import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import json from 'rollup-plugin-json'
import typescript from 'rollup-plugin-typescript2'
import tslint from 'rollup-plugin-tslint'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

export default {
    input: `src/${libraryName}.ts`,
    output: [
        {file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true},
        {file: pkg.module, format: 'es', sourcemap: true},
    ],
    external: [],
    watch: {
        include: 'src/**',
    },
    plugins: [
        // Allow json resolution
        json(),
        // Compile TypeScript files
        typescript({useTsconfigDeclarationDir: true}),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve(),

        // Resolve source maps to the original source
        sourceMaps(),
    ],
}
