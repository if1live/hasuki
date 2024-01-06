import { Kysely } from "kysely";
import { DB } from "../tables/codegen.js";

export class AuthorRepository {
  constructor(private readonly db: Kysely<DB>) {}
}
