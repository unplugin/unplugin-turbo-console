import type { DevframeRpcClient } from 'devframe/client'
import { connectDevframe } from 'devframe/client'

export function useConsoleClient(onConnected: (client: DevframeRpcClient) => Promise<void>) {
  const client = shallowRef<DevframeRpcClient>()
  const status = ref<'pending' | 'error' | 'success' | 'unauthorized'>('pending')
  const error = ref<string>()
  const authCode = ref('')
  let disposed = false
  let unsubscribe: (() => void) | undefined
  let connecting: Promise<void> | undefined

  function showError(cause: unknown) {
    error.value = cause instanceof Error ? cause.message : String(cause)
    status.value = 'error'
  }

  function updateStatus() {
    const current = client.value
    if (!current || disposed) return
    if (current.status === 'connected') {
      connecting ??= (async () => {
        const state = await current.services.state()
        // state() 只保证本地状态可用；显式等待服务端快照，空列表也表示同步完成。
        const services = await current.call('devframe:rpc:server-state:get', 'devframe:services')
        if (disposed) return
        state.mutate(() => services ?? {})
        await onConnected(current)
      })()
        .then(() => {
          status.value = 'success'
        })
        .catch(showError)
        .finally(() => {
          connecting = undefined
        })
    } else if (current.status === 'unauthorized') {
      status.value = 'unauthorized'
      void current.requestAuthCode().catch(showError)
    } else if (current.status === 'connecting') {
      status.value = 'pending'
    } else {
      showError(current.connectionError ?? 'Connection closed. Reload to reconnect.')
    }
  }

  async function authenticate() {
    try {
      if (!(await client.value?.requestTrustWithCode(authCode.value))) {
        error.value = 'Invalid or expired code.'
      }
    } catch (cause) {
      showError(cause)
    }
  }

  onMounted(async () => {
    try {
      const current = await connectDevframe({
        baseURL: import.meta.dev ? '/__turbo_console/' : '/',
      })
      if (disposed) {
        current.close?.()
        return
      }
      client.value = current
      unsubscribe = current.events.on('connection:status', updateStatus)
      updateStatus()
    } catch (cause) {
      showError(cause)
    }
  })
  onBeforeUnmount(() => {
    disposed = true
    unsubscribe?.()
    client.value?.close?.()
  })
  return { client, status, error, authCode, authenticate, showError }
}
