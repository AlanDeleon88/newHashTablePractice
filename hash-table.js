const sha256 = require('js-sha256');

class KeyValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {

  constructor(numBuckets = 4) {
    this.count = 0;
    this.capacity = numBuckets
    this.data = new Array(numBuckets).fill(null)


  }

  hash(key) {
    let hash = sha256(key).slice(0,8)

    return parseInt(hash, 16)
  }

  hashMod(key) {

    return this.hash(key) % this.capacity
  }

  insertNoCollisions(key, value) {
    let newPair = new KeyValuePair(key, value)
    if(this.data[this.hashMod(key)]) throw new Error('hash collision or same key/value pair already exists!')
    this.data[this.hashMod(key)] = newPair
    this.count++

  }

  insertWithHashCollisions(key, value) {
    let newPair = new KeyValuePair(key, value)
    let hashKey = this.hashMod(key)

    if(this.data[hashKey]){
      let current = this.data[hashKey]
      newPair.next = current
      this.data[hashKey] = newPair
      this.count++

    }
    else{
      this.data[hashKey] = newPair
      this.count++
    }


  }

  handleCollision(key,value, pair, hashKey){

    let current = this.data[hashKey]
    let head = this.data[hashKey]


    while(current && current.key !== key){

      current = current.next
    }
    if(current){
      current.value = value
    }
    else{
      pair.next = head
      this.data[hashKey] = pair
      this.count++
    }

  }

  insert(key, value) {
    let newPair = new KeyValuePair(key, value)
    let hashKey = this.hashMod(key)

    if(this.data[hashKey]){
      this.handleCollision(key,value, newPair, hashKey)

    }
    else{
      this.data[hashKey] = newPair
      this.count++

    }

  }

}


module.exports = HashTable;
