import { DurableObject } from "cloudflare:workers";

export class SessionManager extends DurableObject {
  async getSession(id: string) {
    return await this.ctx.storage.get(id);
  }
}