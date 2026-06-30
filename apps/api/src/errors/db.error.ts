import { DomainError } from "./common.error.ts";

export class DbError<T = null> extends DomainError<T> { }
