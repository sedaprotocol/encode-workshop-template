import { JSON, httpFetch } from "@seda-protocol/as-sdk/assembly";
import { Result } from "./result";

@json
class BinanceResponse {
    price!: string;
}

export function fetchBinance(a: string, b: string): Result {
    const promise = httpFetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${a.toUpperCase()}${b.toUpperCase()}`
    );

    const fulfilled = promise.fulfilled;

    if (fulfilled !== null) {
        const data = String.UTF8.decode(fulfilled.bytes.buffer);
        const response = JSON.parse<BinanceResponse>(data);

        return Result.success(response.price);
    }

    let message = "Failed to fetch Binance price";
    const rejected = promise.rejected;
    if (rejected) {
        const error = String.UTF8.decode(rejected.bytes.buffer);
        message = message + `: ${error}`;
    }

    return Result.failure(message);
}
