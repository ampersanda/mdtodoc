import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    documents: i.entity({
      markdown: i.string(),
      createdAt: i.number(),
    }),
  },
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
