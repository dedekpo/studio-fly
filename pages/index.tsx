import { Button, Center, Input, Flex, Text, Image } from "@chakra-ui/react";
import Router from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { uploadImagesToS3 } from "../src/utils/uploadImagesToS3";

export default function Home() {
	const [productImages, setProductImages] = useState<FileList>();
	const [selectedImages, setSelectedImages] = useState<any[]>([]);

	// const queryClient = useQueryClient();
	const mutation = useMutation(
		async (newRequest: {
			name: string;
			email: string;
			images: string[] | undefined;
		}) => {
			const res = await fetch(`/api/new-request`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newRequest),
			});
			const apiRes = await res.json();
			if (!res.ok) throw apiRes.error;
			Router.push(`/${apiRes.requestId}`);
		},
		{
			onSuccess() {
				setSelectedImages([]);
				// queryClient.invalidateQueries(["listaProdutos"]);
			},
			onError: (error, variables, context) => {
				alert(`Ocorreu um erro: ${error}`);
			},
		}
	);

	const {
		handleSubmit,
		register,
		reset,
		formState: { isSubmitting },
	} = useForm<any>();

	async function onSubmit(values: any) {
		const imageUrls = await uploadImagesToS3(productImages);
		mutation.mutate({
			name: values.name,
			email: values.email,
			images: imageUrls,
		});
		reset();
		return;
	}

	function onImagesSelect(event: any) {
		if (event.target.files && event.target.files[0]) {
			let images: any[] = [];
			for (var i = 0; i < event.target.files.length; i++) {
				var url = URL.createObjectURL(event.target.files[i]);
				images.push(url);
			}
			setSelectedImages(images);
			setProductImages(event.target.files);
		}
	}

	return (
		<form onSubmit={(e) => handleSubmit(onSubmit)(e)}>
			<Center w="100vw" h="100vh">
				<Flex flexDir="column" gap={3} w={{ base: "90%", md: "50%" }}>
					<Text textAlign="center" fontWeight="bold" fontSize="3xl">
						Studio Fly
					</Text>
					<Text color="gray.500" textAlign="center" mb="50px">
						Lorem ipsum, dolor sit amet consectetur adipisicing
						elit. Eaque ratione nostrum sapiente inventore tempora
						quibusdam sint, voluptas aliquam perferendis officiis
						repellendus sequi est, quis error similique, recusandae
						provident alias fugit.
					</Text>
					<Input
						placeholder="Nome"
						{...register("name", {
							required: "Por favor, preencha o seu nome",
						})}
					/>
					<Input
						placeholder="E-mail"
						type="email"
						{...register("email", {
							required: "Por favor, preencha o seu e-mail",
						})}
					/>
					<Input
						type="file"
						accept="image/png, image/jpeg, image/jpg"
						onChange={onImagesSelect}
						sx={{
							"::file-selector-button": {
								height: 10,
								padding: 0,
								mr: 4,
								background: "none",
								border: "none",
								fontWeight: "bold",
							},
						}}
					/>
					{selectedImages.map((image, index) => (
						<Image
							key={index}
							alt=""
							src={image}
							boxSize="150px"
							objectFit="cover"
							objectPosition="center"
						/>
					))}
					<Button
						type="submit"
						isLoading={isSubmitting}
						colorScheme="purple"
						w="full"
					>
						Enviar
					</Button>
				</Flex>
			</Center>
		</form>
	);
}
