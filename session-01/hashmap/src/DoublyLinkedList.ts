class KeyValue<K, V> {
    constructor(public key: K, public value: V) {}
}

class DoublyNode<K, V> {
    value: KeyValue<K, V>;
    next: DoublyNode<K, V> | null = null;
    prev: DoublyNode<K, V> | null = null;
  
    constructor(key: K, value: V) {
      this.value = new KeyValue(key, value);
    }
}
  
  class DoublyLinkedList<K, V> {
    private head: DoublyNode<K, V> | null = null;
    private tail: DoublyNode<K, V> | null = null;
  
    append(key: K, value: V): void {
      const newNode = new DoublyNode(key, value);
  
      if (!this.tail) {
        this.head = this.tail = newNode;
      } else {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
      }
    }
  
    get(key: K): V | undefined {
      let current = this.head;
      while (current) {
        if (current.value.key === key) return current.value.value;
        current = current.next;
      }
      return undefined;
    }
  
    remove(key: K): boolean {
      let current = this.head;
      while (current) {
        if (current.value.key === key) {
          if (current.prev) current.prev.next = current.next;
          else this.head = current.next;
  
          if (current.next) current.next.prev = current.prev;
          else this.tail = current.prev;
  
          return true;
        }
        current = current.next;
      }
      return false;
    }
  }
  

export { DoublyLinkedList} ;