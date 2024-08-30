import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : Task } |
  { 'err' : string };
export interface Task {
  'id' : bigint,
  'icon' : string,
  'text' : string,
  'completed' : boolean,
}
export interface _SERVICE {
  'addTask' : ActorMethod<[string, string], Result>,
  'getProgress' : ActorMethod<[], { 'total' : bigint, 'completed' : bigint }>,
  'getTasks' : ActorMethod<[], Array<Task>>,
  'toggleTask' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
