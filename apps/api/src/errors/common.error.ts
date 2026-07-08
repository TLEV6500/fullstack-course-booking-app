import createHttpError from "http-errors";
import type { Nullish } from "../utils/types.ts";

export abstract class DomainError<PlaceholderType = null> extends Error {
    #placeholderValue: Nullish<PlaceholderType>;
    constructor(
        { placeholderValue, message, cause }
            : { placeholderValue?: Nullish<PlaceholderType>; message?: string; cause?: Error }
            = { placeholderValue: null, message: "" }) {
        super(message, { cause });
        this.#placeholderValue = placeholderValue;
    }

    get placeholderValue(): Nullish<PlaceholderType> {
        return this.#placeholderValue;
    }
    get message(): string {
        return super.message;
    }
}

export type ErrorMap = Map<typeof DomainError<any>, number>;

export function throwFailureAsHttpError<T>(resultOrFailure: T, errorMap: ErrorMap): Exclude<T, DomainError<any>>;
export function throwFailureAsHttpError<T>(resultOrFailure: T, statusCode: number, message?: string): Exclude<T, DomainError<any>>;
export function throwFailureAsHttpError<T>(resultOrFailure: T, statusCodeOrErrorMap: number | ErrorMap, message?: string): Exclude<T, DomainError<any>> {
    if (resultOrFailure instanceof DomainError) {
        let statusCode = 500;
        if (typeof statusCodeOrErrorMap === "number") statusCode = statusCodeOrErrorMap;
        else statusCode = statusCodeOrErrorMap.get(resultOrFailure.constructor as typeof DomainError<any>) ?? statusCode;
        throw createHttpError(statusCode, message ?? resultOrFailure);
    }
    else return resultOrFailure as any;
}

export const handleFailure = throwFailureAsHttpError


export class QueryError<T = null> extends DomainError<T> {}

export class UnauthorizedAccessError<T = null> extends DomainError<T> {}
