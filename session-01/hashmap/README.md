# Home assignment 2 - Hash-Map 

This assignment implements a basic `HashMap` using a `DoublyLinkedList` for bucket storage and a pluggable hash function (defaulting to MD5 using Node.js `crypto` module).

---

## Installation

```bash
npm install
```

---

## Build the Project

```bash
npx tsc
```

> Make sure `tsconfig.json` is configured to output compiled JS files to a directory like `dist/`.

---

## Run the Assignment

```bash
node dist/index.js
```

Or, if you're running the compiled JS directly from root:

```bash
node index.js
```

## Code Example

```ts
const myMap = new MyHashMap();
myMap.put("abc", 123);
console.log(myMap.get("abc")); // 123
myMap.put("abc", 5050);
console.log(myMap.get("abc")); // 5050
try {
  console.log(myMap.get("foo"));
} catch (e) {
  console.log("non existing key");
}
myMap.remove("abc");
try {
  console.log(myMap.get("abc"));
} catch (e) {
  console.log("non existing key");
}
myMap.remove("bang");
```

---

## 📝 Notes

- Ensure TypeScript is installed (`npm install typescript --save-dev` or globally via `npm install -g typescript`).
- Requires Node.js version 14 or above.
- Use `@types/node` for proper type resolution with Node modules:

```bash
npm install --save-dev @types/node
```
