export function is_chinese(text: string): boolean {
  const chinese = /[\u4E00-\u9FA5]+/
  return chinese.test(text)
}

if (import.meta.vitest) {
  test(is_chinese, () => {
    expect(is_chinese('我')).toBe(true)
    expect(is_chinese('是')).toBe(true)
    expect(is_chinese('Hello 是')).toBe(true)

    expect(is_chinese('Hello')).toBe(false)
    expect(is_chinese('?')).toBe(false)
    expect(is_chinese('，')).toBe(false)
    expect(is_chinese('？')).toBe(false)
  })
}
