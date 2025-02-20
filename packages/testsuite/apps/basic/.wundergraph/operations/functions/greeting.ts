import { createOperation, z } from '../../generated/wundergraph.factory';

export default createOperation.query({
	input: z.object({
		name: z.string(),
	}),
	handler: async ({ input }) => {
		return 'Hello I am ' + input.name;
	},
});
