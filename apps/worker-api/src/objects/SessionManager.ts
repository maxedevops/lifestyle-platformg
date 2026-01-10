export class SessionManager {
  state: DurableObjectState;
  sessions: Map<string, number>;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = new Map();
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (url.pathname === '/heartbeat' && userId) {
      this.sessions.set(userId, Date.now());
      return new Response(JSON.stringify({ active: this.sessions.size }));
    }

    if (url.pathname === '/active-count') {
      // Clean up stale sessions (> 30s)
      const now = Date.now();
      for (const [id, lastSeen] of this.sessions) {
        if (now - lastSeen > 30000) this.sessions.delete(id);
      }
      return new Response(JSON.stringify({ count: this.sessions.size }));
    }

    return new Response('Not Found', { status: 404 });
  }
}