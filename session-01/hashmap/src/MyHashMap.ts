import { DoublyLinkedList } from "./DoublyLinkedList";
import md5 from './hashFunctions/md5';

class MyHashMap {
  private bucketSize = 1000;
  private maxItems = 100000;
  private itemCount = 0;

  private buckets: DoublyLinkedList<string, any>[] = [];
  private hashFunc: (key: string) => string;

  constructor(hashFunc: (key: string) => string = md5) {
    this.hashFunc = hashFunc;

    for (let i = 0; i < this.bucketSize; i++) {
      this.buckets[i] = new DoublyLinkedList<string, any>();
    }
  }

  private getBucketIndex(key: string): number {
    const hash = this.hashFunc(key);
    const numericHash = Array.from(hash).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return numericHash % this.bucketSize;
  }

  put(key: string, value: any): void {
    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];

    const existingValue = bucket.get(key);
    if (existingValue !== undefined) {
      bucket.remove(key);
      bucket.append(key, value); // Replace existing (to preserve order)
    } else {
      if (this.itemCount >= this.maxItems) {
        throw new Error("Maximum number of items (100,000) exceeded.");
      }
      bucket.append(key, value);
      this.itemCount++;
    }
  }

  get(key: string): any {
    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];

    const value = bucket.get(key);
    if (value !== undefined) {
      return value;
    }
    throw new Error(`Key "${key}" not found in HashMap.`);
  }

  remove(key: string): void {
    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];

    bucket.remove(key);
  }
}

export { MyHashMap };
