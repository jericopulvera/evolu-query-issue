import { minLength, maxLength, Schema, brand, nullable } from '@effect/schema/Schema';
import {
  SqliteBoolean,
  createEvolu,
  id,
  table,
  database,
  String,
  NonEmptyString1000
} from '@evolu/react';

export const String5000 = String.pipe(minLength(0), maxLength(5000), brand('String5000'));
export type String5000 = Schema.To<typeof String5000>;

const TodoId = id('Todo');
type TodoId = Schema.To<typeof TodoId>;

const TodoTable = table({
  id: TodoId,
  name: NonEmptyString1000,
  description: String5000,
  done: SqliteBoolean,
  deleted: nullable(SqliteBoolean),
});
export type TodoTable = Schema.To<typeof TodoTable>;

const Database = database({
  todo: TodoTable,
});

export type Database = Schema.To<typeof Database>;

export const evolu = createEvolu(Database);
