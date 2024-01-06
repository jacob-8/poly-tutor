export function sort_definitions(definitions: string): string[] {
  return definitions.split('/').sort((a, b) => {
    if (a.includes('surname') || a.startsWith('variant') || a.startsWith('old variant')) return 1
    if (b.includes('surname') || b.startsWith('variant') || b.startsWith('old variant')) return -1
    return 0
  })
}

if (import.meta.vitest) {
  describe(sort_definitions, () => {
    test('places surname at the end', () => {
      const result = sort_definitions('surname Guo/country/nation/state/national')

      expect(result).toEqual([
        'country', 'nation', 'state', 'national',
        'surname Guo',
      ])
    })
  })
}
