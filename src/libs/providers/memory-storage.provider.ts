/**
 * Storage Data interface
 */
export interface StorageData {
  key: string;
  value: string;
}

/**
 * The Storage DOM API is implemented with a memory database.
 */
export class MemoryStorageProvider implements Storage {
  [name: string]: any;

  storage: StorageData[] = [];

  readonly length: number;

  private static instance: MemoryStorageProvider;

  /**
   * The singleton getter.
   */
  public static getInstance(): MemoryStorageProvider {
    if (!this.instance) {
      this.instance = new MemoryStorageProvider();
    }

    return this.instance;
  }

  clear(): void {
    this.storage = [];
  }

  private getObject(key: string): StorageData | null {
    return this.storage.find((elm) => elm.key === key) || null;
  }

  getItem(key: string): string | null {
    return this.getObject(key)?.value || null;
  }

  key(index: number): string | null {
    if (!this.storage[index])
      throw new Error("Index exceeded the data storage");
    return this.storage[index].key;
  }

  removeItem(key: string): void {
    this.storage = this.storage.reduce<StorageData[]>((prevValue, elm) => {
      if (elm.key !== key) {
        prevValue.push(elm);
      }

      return prevValue;
    }, []);
  }

  setItem(key: string, value: string): void {
    const item = this.getObject(key);

    if (item) {
      item.value = value;
      return;
    }

    this.storage.push({
      value,
      key,
    });
  }
}
