import { Flex, Center, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function Request() {
	const router = useRouter();
	const { requestId } = router.query;

	const { data: request, isLoading } = useQuery(["request", requestId], () =>
		fetch(`/api/get-request?requestId=${requestId}`)
			.then((response) => response.json())
			.catch((err) => {
				console.log(err.message);
			})
	);

	if (isLoading) return <>Carregando...</>;

	return (
		<Center w="100vw" h="100vh">
			<Flex
				flexDir="column"
				w="70%"
				textAlign="center"
				fontSize="xl"
				align="center"
			>
				<Text fontWeight="bold">Olá {request.userName}!</Text>
				{request.videoUrl ? (
					<>
						<Text mb="20px">⬇️ Aqui está o seu vídeo ⬇️</Text>
						<video width="720" height="480" controls>
							<source src={request.videoUrl} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
					</>
				) : (
					<Text color="gray.500">
						{"Seu vídeo está em processamento. Volte mais tarde ;)"}
					</Text>
				)}
			</Flex>
		</Center>
	);
}
