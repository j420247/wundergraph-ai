import { configureWunderGraphApplication, cors, EnvironmentVariable, introspect, templates } from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';

const countries = introspect.graphql({
	apiNamespace: 'countries',
	url: 'https://countries.trevorblades.com/',
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
	apis: [countries],
	server,
	operations,
	authentication: {
		tokenBased: {
			providers: [
				{
					jwksJSON: new EnvironmentVariable('JWKS_JSON'),
				},
			],
		},
		customClaims: {
			/** Implicit: string and required */
			tenantID: {
				jsonPath: 'teid',
			},
			shopID: {
				jsonPath: 'shop.id',
				type: 'int',
				required: false,
			},
			floatingPointValue: {
				jsonPath: 'f.f.f.f',
				type: 'float',
			},
			nonExistingDeepValue: {
				jsonPath: 'a.b.c.d.e.f.g.h.i',
			},
			country: {
				jsonPath: 'cc',
			},
			currency: {
				jsonPath: 'currency',
			},
		},
		publicClaims: ['SUBJECT', 'GIVEN_NAME', 'FAMILY_NAME', 'shopID'],
	},
	codeGenerators: [
		{
			templates: [
				// use all the typescript react templates to generate a client
				...templates.typescript.all,
			],
			// create-react-app expects all code to be inside /src
			// path: "../frontend/src/generated",
		},
	],
	cors: {
		...cors.allowAll,
		allowedOrigins: ['http://localhost:9991', 'http://127.0.0.1:9991'],
	},
	dotGraphQLConfig: {
		hasDotWunderGraphDirectory: false,
	},
	security: {
		enableGraphQLEndpoint: true,
	},
});
