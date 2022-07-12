# Nest Typed Event Emitter

![npm](https://img.shields.io/npm/v/nest-typed-event-emitter)

## Why

The default NestJS event emitter system does not directly support strict hinting
for events. This package aims to add minimal support for having type-hinted
events, with strict typing if desired.

## How

First, define an interface for your events

```ts
// Your Event Map, with EventName => Types
export interface EventMap {
    purchase: number;
    paid: number;
}
```

Next, use the package to create listeners and emitters that wrap the normal
NestJS entities.

```ts
import { IEventEmitter, createTypedListener } from "nest-typed-event-emitter";

// API to define the typed emitters
export type MyEventEmitter = IEventEmitter<EventMap>;
// Pass true to the second type parameter to make the emitters strict
export type MyStrictEventEmitter = IEventEmitter<EventMap, true>;

// API to define the typed listeners
const MyListener = createTypedListener<EventMap>();
// Pass true to the second type parameter to make the listeners strict
const MyStrictListener = createTypedListener<EventMap, true>();
```


Next, use the listeners you defined in place of the usual `@OnEvent()`.

```ts
// Listener class
class Listeners {
    /**
     * This will type hint, but allow any value to be passed
     */
    @MyListener("paid") // allowed
    @MyListener("paidasdf") //allowed
    public onSleepAdded(event: EventMap["paid"]) {}

    /**
     * This will type hint and forbid values not in the event map.
     */
    @MyStrictListener("purchasef") // error
    @MyStrictListener("purchase") // allowed
    public onSleepAddedStrict(event: EventMap["purchase"]) {}
}
```

Finally, use the `@InjectEventEmitter()` decorator to get access to the emitter.
You can then annotate it with the custom event emitter type you made in the
second part.

```ts
import { Injectable } from "@nestjs/common";
import { InjectEventEmitter } from "nest-typed-event-emitter";

// Emitter class
@Injectable()
class Service {
    constructor(
        @InjectEventEmitter() private readonly emitter: MyEventEmitter,
        @InjectEventEmitter() private readonly strictEmitter: MyStrictEventEmitter
    ) {}

    onPurchase() {
        this.emitter.emit("purchase", 4); // allowed
        this.emitter.emit("something-else", 12); //allowed
        this.emitter.emit("purchase", "12"); //allowed

        this.strictEmitter.emit("paid", 5); //allowed
        this.strictEmitter.emit("ashjknfl", 34); //error
        this.strictEmitter.emit("paid", "34"); //error
    }
}
```

Remember to add the normal NestJS event emitter module into your app, i.e.

```ts
import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
```