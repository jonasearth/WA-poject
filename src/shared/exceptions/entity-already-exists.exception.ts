import { ConflictException } from './conflict.exception';

export class EntityAlreadyExistsError extends ConflictException {}
