import { RequestOptions } from "https";
import { URL } from "url";
import { request as request_ } from "https";

export function request(options: string | RequestOptions | URL, data?: string | Buffer, encoding?: BufferEncoding) {
	const buffers: Buffer[] = [];

	return new Promise<Buffer>(resolve =>
		request_(options, res => res
			.on("data", (buffer: Buffer) => buffers.push(buffer))
			.on("end", () => resolve(Buffer.concat(buffers)))
		).end(data) // I don't know what typescript is complaining about when you remove the `!`
	);
}
