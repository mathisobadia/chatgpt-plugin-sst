import { ulid } from "ulid";
import { Entity, type EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";
export * as Todo from "./todo";

export const TodoEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Todo",
      service: "Todo",
    },
    attributes: {
      userId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      todoId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      text: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["userId"],
        },
        sk: {
          field: "sk",
          composite: ["todoId"],
        },
      },
    },
  },
  Dynamo.Configuration
);

export type TodoEntityType = EntityItem<typeof TodoEntity>;

type CreateTodoInput = {
  userId: string;
  text: string;
};
export async function create({ userId, text }: CreateTodoInput) {
  const result = await TodoEntity.create({
    todoId: ulid(),
    userId,
    text,
  }).go();
  return result.data;
}

export async function list(userId: string) {
  const result = await TodoEntity.query.primary({ userId }).go();
  return result.data;
}

type DeleteTodoInput = {
  userId: string;
  todoId: string;
};
export async function del({ userId, todoId }: DeleteTodoInput) {
  const result = await TodoEntity.delete({ userId, todoId }).go();
  return result.data;
}
