import { initTRPC } from "@trpc/server";
import { OpenApiMeta, createOpenApiAwsLambdaHandler } from "trpc-openapi";
import { z } from "zod";
import { ApiHandler } from "sst/node/api";
import { useSession } from "sst/node/future/auth";
import { Todo } from "@chatgpt-plugin-starter/core/todo";
type TContext = {
  user: {
    userId: string;
  };
};
const t = initTRPC.meta<OpenApiMeta>().context<TContext>().create(); /* 👈 */
const todoSchema = z.object({
  userId: z.string().describe("The user's ID"),
  todoId: z.string().describe("The todo's ID"),
  text: z.string().describe("The todo's text"),
});
export const appRouter = t.router({
  listTodos: t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/todos",
        summary: "Get the list of todos",
      },
    })
    .input(z.never())
    .output(z.array(todoSchema).describe("The list of todos"))
    .query(({ ctx }) => {
      const userId = ctx.user.userId;
      return Todo.list(userId);
    }),
  addTodo: t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/todos",
        summary: "Add a todo to the list",
      },
    })
    .input(z.object({ text: z.string().describe("The new todo's text") }))
    .output(todoSchema)
    .mutation(({ ctx, input }) => {
      const userId = ctx.user.userId;
      return Todo.create({ userId, text: input.text });
    }),
  deleteTodo: t.procedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/todos",
        summary: "Delete a todo from the list",
      },
    })
    .input(z.object({ todoId: z.string().describe("The todo's ID") }))
    .output(todoSchema)
    .mutation(({ ctx, input }) => {
      const userId = ctx.user.userId;
      return Todo.del({ userId, todoId: input.todoId });
    }),
});

export type Router = typeof appRouter;

const trpc = createOpenApiAwsLambdaHandler({
  router: appRouter,
  createContext: async () => {
    const session = useSession();
    if (session.type === "user") {
      return {
        user: {
          userId: session.properties.userId,
        },
      };
    }
    throw new Error("Not authenticated");
  },
});

export const handler = ApiHandler(async (req, ctx) => {
  return trpc(req, ctx);
});
