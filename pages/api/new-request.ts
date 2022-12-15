import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../src/lib/prismadb";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).send({ message: "Only POST requests allowed" });
	}

	const { name, email, images } = req.body;

	try {
		const imageName = images[0].split("/").at(-1);

		const newRequest = await prisma.requests.create({
			data: {
				userName: name,
				userEmail: email,
				imageName,
				imageUrl: images[0],
			},
		});

		return res.status(200).json({
			message: "Requisição criada!",
			requestId: newRequest.id,
		});
	} catch (error) {
		return res.status(400).send({
			error: (error as Error).message,
		});
	}
}
