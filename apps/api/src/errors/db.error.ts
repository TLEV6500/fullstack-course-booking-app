import { DomainError } from "./common.error.ts";

export class DbError<T = null> extends DomainError<T> { }

export class DuplicateResourceError<T = null> extends DbError<T> { }
