class IDBStorage {
  private static dbName = 'my-db'
  private static storeName = 'my-store'
  private dbPromise: Promise<IDBDatabase>

  constructor() {
    this.dbPromise = this.initDB()
  }

  private async initDB(): Promise<IDBDatabase> {
    const request = window.indexedDB.open(IDBStorage.dbName)
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result
        db.createObjectStore(IDBStorage.storeName)
      }
    })
  }

  private async withStore(type: IDBTransactionMode, callback: (store: IDBObjectStore) => void): Promise<void> {
    const db = await this.dbPromise
    const transaction = db.transaction(IDBStorage.storeName, type)
    const store = transaction.objectStore(IDBStorage.storeName)
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      callback(store)
    })
  }

  public async getItem(key: string): Promise<string | null> {
    let value: string | null = null
    await this.withStore('readonly', (store) => {
      const request = store.get(key)
      request.onsuccess = () => value = request.result
    })
    return value
  }

  public async setItem(key: string, value: string): Promise<void> {
    await this.withStore('readwrite', (store) => {
      store.put(value, key)
    })
  }

  public async removeItem(key: string): Promise<void> {
    await this.withStore('readwrite', (store) => {
      store.delete(key)
    })
  }

  public async clear(): Promise<void> {
    await this.withStore('readwrite', (store) => {
      store.clear()
    })
  }
}
export default IDBStorage
