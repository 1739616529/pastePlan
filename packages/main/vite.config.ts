import { join } from 'path'
import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import esmodule from 'vite-plugin-esmodule'
import pkg from '../../package.json'
export default defineConfig({
	root: __dirname,
	plugins: [esmodule(['execa'])],
	resolve: {
		alias: {
			main: join(__dirname),
			project: join(__dirname, '../../'),
		},
	},
	build: {
		outDir: '../../dist/main',
		emptyOutDir: true,
		minify:
			process.env./* from mode option */ NODE_ENV ===
			'production',
		sourcemap: true,
		lib: {
			entry: 'index.ts',
			formats: ['cjs'],
			fileName: () => '[name].cjs',
		},
		rollupOptions: {
			external: [
				'electron',
				...builtinModules,
				...Object.keys(pkg.dependencies || {}),
			],
		},
	},
})
