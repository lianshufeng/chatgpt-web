import LocalStoreLegacy from './Indexdb'

export function createLocalStorage(options?: { expire?: number | null }) {
  const db = new LocalStoreLegacy()

  async function set(key: string, value: any) {
    await db.setItem(key, JSON.stringify(value))
  }
  async function get(key: string) {
    const value = await db.getItem(key)
    return value ? JSON.parse(value) : null
  }

  async function remove(key: string) {
    await db.removeItem(key)
  }

  async function clear() {
    await db.clear()
  }

  return { set, get, remove, clear }
}

export const ls = createLocalStorage()

export const ss = createLocalStorage({ expire: null })
