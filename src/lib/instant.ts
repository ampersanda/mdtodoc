import { init } from "@instantdb/react";
import schema from "../../instant.schema";

const db = init({
  appId: "113a73e8-a7a3-4fdc-b806-30602c295eed",
  schema,
});

export default db;
