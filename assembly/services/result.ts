@json
export class Result {
    success: boolean;
    value: string;

    private constructor(success: boolean, value: string) {
        this.success = success;
        this.value = value;
    }

    static success(value: string): Result {
        return new Result(true, value);
    }

    static failure(message: string): Result {
        return new Result(false, message);
    }
}
