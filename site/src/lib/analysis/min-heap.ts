export class MinHeap<T> {
  private heap: T[]
  private comparator: (a: T, b: T) => number

  constructor(comparator: (a: T, b: T) => number) {
    this.heap = []
    this.comparator = comparator
  }

  private getLeftChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 1
  }

  private getRightChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 2
  }

  private getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2)
  }

  private swap(indexOne: number, indexTwo: number): void {
    [this.heap[indexOne], this.heap[indexTwo]] = [this.heap[indexTwo], this.heap[indexOne]]
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1
    while (this.getParentIndex(index) >= 0 && this.comparator(this.heap[this.getParentIndex(index)], this.heap[index]) > 0) {
      this.swap(this.getParentIndex(index), index)
      index = this.getParentIndex(index)
    }
  }

  private heapifyDown(): void {
    let index = 0
    let smallerChildIndex: number

    while (this.getLeftChildIndex(index) < this.heap.length) {
      smallerChildIndex = this.getLeftChildIndex(index)

      if (this.getRightChildIndex(index) < this.heap.length && this.comparator(this.heap[this.getRightChildIndex(index)], this.heap[smallerChildIndex]) < 0)
        smallerChildIndex = this.getRightChildIndex(index)


      if (this.comparator(this.heap[index], this.heap[smallerChildIndex]) < 0)
        break
      else
        this.swap(index, smallerChildIndex)


      index = smallerChildIndex
    }
  }

  public insert(item: T): void {
    this.heap.push(item)
    this.heapifyUp()
  }

  public extractMin(): T | null {
    if (this.heap.length === 0)
      return null


    const [minItem] = this.heap
    this.heap[0] = this.heap[this.heap.length - 1]
    this.heap.pop()
    this.heapifyDown()

    return minItem
  }

  public size(): number {
    return this.heap.length
  }

  public toArray(): T[] {
    return [...this.heap]
  }
}
