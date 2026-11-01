/**
 * Extension point for Phase 2.
 * All network calls should eventually live here.
 * Phase 1 uses in-memory + localStorage via the Zustand store.
 */

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; stub: true }

export const api = {
  /** Replace with POST /auth/login */
  async login(_email: string, _password: string): Promise<ApiResult<{ token: string }>> {
    return { ok: false, error: 'Auth API not wired — Phase 2', stub: true }
  },

  /** Replace with Socket.IO client */
  connectRealtime(): ApiResult<{ transport: 'mock' }> {
    return { ok: true, data: { transport: 'mock' } }
  },

  /** Replace with WebRTC signaling service */
  createCallSession(_channelId: string): ApiResult<{ sessionId: string }> {
    return { ok: false, error: 'WebRTC signaling Phase 2', stub: true }
  },
}
