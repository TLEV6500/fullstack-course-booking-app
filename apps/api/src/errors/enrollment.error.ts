import { DomainError } from "./common.error.ts";

export class EnrollmentNotFoundError<T = null> extends DomainError<T> { }
