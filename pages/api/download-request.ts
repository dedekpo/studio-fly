import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../src/lib/prismadb";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).send({ message: "Only POST requests allowed" });
	}

	const { requestId } = req.body;

	try {
		const updatedRequest = await prisma.requests.update({
			where: {
				id: requestId,
			},
			data: {
				status: "PROCESSING",
			},
		});

		return res.status(200).json({
			message: "Requisição criada!",
			imageUrl: updatedRequest.imageUrl,
			imageName: updatedRequest.imageName,
		});
	} catch (error) {
		return res.status(400).send({
			error: (error as Error).message,
		});
	}
}
