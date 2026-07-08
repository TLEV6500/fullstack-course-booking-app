import { DomainError } from "./common.error.ts";

export class CourseCreationError<T = null> extends DomainError<T> { }

export class CourseNotFoundError<T = null> extends DomainError<T> { }
