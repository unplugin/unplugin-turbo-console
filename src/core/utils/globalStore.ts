class GlobalStore {
  private data: Record<string, unknown> = {}

  set<T = unknown>(key: string, value: T): void {
    this.data[key] = value
  }

  get<T = unknown>(key: string): T | undefined {
    return this.data[key] as T | undefined
  }

  remove(key: string): void {
    delete this.data[key]
  }

  clear(): void {
    this.data = {}
  }
}

const globalStore = new GlobalStore()
export default globalStore
