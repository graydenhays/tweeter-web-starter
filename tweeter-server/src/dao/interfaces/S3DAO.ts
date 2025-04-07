export interface S3DAO {
	readonly BUCKET: string;
	readonly REGION: string;

	putImage(
		fileName: string,
		imageStringBase64Encoded: string
	): Promise<string>
}