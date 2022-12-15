import ReactS3Client from "react-aws-s3-typescript";

const config = {
	accessKeyId: "AKIA3EA275TNAGFP45MK",
	secretAccessKey: "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",
	bucketName: "bot2",
	// dirName: "files" /* optional */,
	region: "sa-east-1",
};

export async function uploadImagesToS3(images: FileList | undefined) {
	if (!images) return [];

	const s3 = new ReactS3Client(config);

	try {
		let imagesUrls: string[] = [];
		for (var i = 0; i < images.length; i++) {
			const res = await s3.uploadFile(images[i]);
			imagesUrls.push(res.location);
		}
		return imagesUrls;
	} catch (exception) {
		console.log(exception);
		/* handle the exception */
	}
}
