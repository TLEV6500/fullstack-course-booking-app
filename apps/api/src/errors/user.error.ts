import { DomainError } from "./common.error.ts";

export class UserNotFoundError<T = null> extends DomainError<T> { }

export class AuthenticationFailedError<T = null> extends DomainError<T> {}

export class UserUpdateFailedError<T = null> extends DomainError<T> { }

export class UserCreationFailedError<T = null> extends DomainError<T> { }
