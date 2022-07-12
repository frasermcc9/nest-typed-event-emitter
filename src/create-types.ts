import { EventEmitter2 } from "@nestjs/event-emitter";

export type EventBaseType = string | symbol | (symbol | string)[];

export interface IEventEmitter<TEventMap extends {}, TStrict = false> extends EventEmitter2 {
    emit<T extends keyof TEventMap>(event: (T | T[]) & EventBaseType, values: TEventMap[T]): boolean;
    emit(event: TStrict extends true ? never : EventBaseType, values: unknown): boolean;
    emitAsync<T extends keyof TEventMap>(event: (T | T[]) & EventBaseType, values: TEventMap[T]): Promise<any[]>;
    emitAsync(event: TStrict extends true ? never : EventBaseType, values: unknown): Promise<any[]>;
}
