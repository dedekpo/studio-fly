import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../src/lib/prismadb";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { requestId } = req.query;

	const request = await prisma.requests.findUnique({
		where: {
			id: requestId as string,
		},
		select: {
			id: true,
			userName: true,
			videoUrl: true,
		},
	});

	return res.status(200).json(request);
}
