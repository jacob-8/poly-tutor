import { readdirSync, statSync  } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Variants } from 'kitbook'
import { SvelteComponent } from 'svelte'

interface Module { variants: Variants<SvelteComponent> }

const _dirname = dirname(fileURLToPath(import.meta.url))

export async function importAllVariants(directory: string): Promise<Map<string, Module>> {
  const baseDirectory = join(_dirname, directory)

  const variantsFilepaths = findFiles(baseDirectory, '.variants.ts')

  const imports = variantsFilepaths.map(path => {
    return import(path).then(module => [path, module]) as Promise<[string, Module]>
  })

  const allVariants = await Promise.all(imports)
  return new Map(allVariants)
}

function findFiles(directory: string, ending: string): string[] {
  const files: string[] = []

  for (const file of readdirSync(directory)) {
    const filePath = join(directory, file)
    if (statSync(filePath).isDirectory())
      files.push(...findFiles(filePath, ending))
    else if (file.endsWith(ending))
      files.push(filePath)
  }

  return files
}
