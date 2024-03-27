export class IdGenerator {
  private current: bigint;

  constructor() {
    this.current = BigInt(0); // 使用BigInt以支持大数字
  }

  // 获取下一个ID
  nextId() {
    const id = this.current;
    this.current += BigInt(1);
    return id;
  }

  // 重置生成器
  reset() {
    this.current = BigInt(0);
  }
}
