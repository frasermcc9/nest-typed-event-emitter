import { OnEvent } from "@nestjs/event-emitter";
import { OnEventOptions } from "@nestjs/event-emitter/dist/interfaces";
import { EventBaseType } from "./create-types";

type TypedListener<T> =
    | ((event: (keyof T | (keyof T)[]) & EventBaseType, options?: OnEventOptions) => MethodDecorator) &
          ((event: EventBaseType, options?: OnEventOptions) => MethodDecorator);

type StrictTypedListener<T> = (event: (keyof T | (keyof T)[]) & EventBaseType, options?: OnEventOptions) => MethodDecorator;

export function createTypedListener<T extends {}, TStrict extends boolean = false>(): TStrict extends true
    ? StrictTypedListener<T>
    : TypedListener<T> {
    return (event: EventBaseType, options?: OnEventOptions) => OnEvent(event, options);
}
