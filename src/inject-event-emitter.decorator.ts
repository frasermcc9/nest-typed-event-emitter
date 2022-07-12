import { Inject } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

export const InjectEventEmitter = () => Inject(EventEmitter2);
