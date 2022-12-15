import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../src/lib/prismadb";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { requestId } = req.query;

	const requests = await prisma.requests.findMany({
		where: {
			status: "WAITING",
		},
	});

	return res.status(200).json(requests);
}
