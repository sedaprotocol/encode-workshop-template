import { JSON, httpFetch } from "@seda-protocol/as-sdk/assembly";
import { Result } from "./result";

@json
class OkxData {
    last!: string;
}

@json
class OkxResponse {
    data!: OkxData[];
}

export function fetchOkx(a: string, b: string): Result {
    const promise = httpFetch(
        `https://www.okx.com/api/v5/market/ticker?instId=${a.toUpperCase()}-${b.toUpperCase()}`
    );

    const fulfilled = promise.fulfilled;

    if (fulfilled !== null) {
        const data = String.UTF8.decode(fulfilled.bytes.buffer);
        const response = JSON.parse<OkxResponse>(data);

        if (response.data.length > 0) {
            return Result.success(response.data[0].last);
        }
    }

    let message = "Failed to fetch Okx price";
    const rejected = promise.rejected;
    if (rejected) {
        const error = String.UTF8.decode(rejected.bytes.buffer);
        message = message + `: ${error}`;
    }

    return Result.failure(message);
}
