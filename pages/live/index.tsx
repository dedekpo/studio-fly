import { Center, Flex, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

declare global {
	interface Window {
		showDirectoryPicker: any;
	}
}

export default function Live() {
	const { data: listRequest, isLoading } = useQuery(["listRequest"], () =>
		fetch(`/api/list-requests`)
			.then((response) => response.json())
			.catch((err) => {
				console.log(err.message);
			})
	);

	const downloadMutation = useMutation(
		async (downloadRequest: { requestId: string }) => {
			const res = await fetch(`/api/download-request`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(downloadRequest),
			});
			const apiRes = await res.json();
			if (!res.ok) throw apiRes.error;
			const imageUrl = apiRes.imageUrl;
			const imageName = apiRes.imageName;
			// downloadImage(imageUrl, imageName);
		},
		{
			onSuccess() {},
			onError: (error, variables, context) => {
				alert(`Ocorreu um erro: ${error}`);
			},
		}
	);

	const [files, setFiles] = useState<
		{
			key: any;
			value: any;
		}[]
	>([]);

	const [fileHandler, setFileHandler] = useState<any>();

	useEffect(() => {
		async function updateFiles() {
			const forFiles = [];

			for await (const [key, value] of fileHandler.entries()) {
				forFiles.push({ key, value });
			}

			setFiles(forFiles);
		}
		const interval = setInterval(() => {
			if (fileHandler) {
				updateFiles();
				listRequest.map((request: any) => {
					const contains =
						files.filter(
							(file) =>
								file.key.split(".")[0] ===
								request.imageName.split(".")[0]
						).length > 0;
					if (!contains) {
						downloadMutation.mutate({
							requestId: request.id,
						});
						console.log("escrevendo arquivo");
						writeFile(fileHandler, files[0].value);
					}
				});
				// console.log(listRequest);
				// console.log(files);
			}
		}, 10000);

		return () => clearInterval(interval);
	}, [downloadMutation, fileHandler, files, listRequest]);

	function downloadImage(imageUrl: string, imageName: string) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", imageUrl, true);
		xhr.responseType = "blob";
		xhr.onload = function () {
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL(this.response);
			var tag = document.createElement("a");
			tag.href = imageUrl;
			tag.target = "_blank";
			tag.download = imageName;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);
		};
		xhr.onerror = (err) => {
			alert("Failed to download picture");
		};
		xhr.send();
	}

	async function handleButtonClick() {
		const dirHandle = await window.showDirectoryPicker();

		setFileHandler(dirHandle);

		const forFiles = [];

		for await (const [key, value] of dirHandle.entries()) {
			forFiles.push({ key, value });
		}

		setFiles(forFiles);
	}

	// function handleButtonDownload() {
	// 	files.map((file) => {
	// 		downloadImage();
	// 	});
	// }

	if (isLoading) return <>Carregando...</>;

	return (
		<Center w="100vw" h="100vh">
			<Flex flexDir="column">
				<Button onClick={handleButtonClick}>Selecionar pasta</Button>
				{files.map((file, index) => (
					<div key={index}>{file.key}</div>
				))}
			</Flex>
			{/* <Button onClick={downloadImage}>Download</Button> */}
		</Center>
	);
}

async function writeFile(fileHandle: any, contents: any) {
	// Create a FileSystemWritableFileStream to write to.
	const writable = await fileHandle.createWritable();
	// Write the contents of the file to the stream.
	await writable.write(contents);
	// Close the file and write the contents to disk.
	await writable.close();
}
