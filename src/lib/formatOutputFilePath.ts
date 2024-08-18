import path from "path"
import fs from "fs"

export type MergeOutputFile = {
  path: string | undefined
  imported: boolean
  exists: boolean
}

export default function formatOutputFile(item: Record<string, any>) {
  const result: MergeOutputFile = {
    path: undefined,
    imported: false,
    exists: false,
  }
  result.path = item.movie?.movieFile?.path
  if (result.path) {
    result.imported = true
  } else {
    const pathParts = [item.movie?.path, item.movie?.cleanTitle].filter(Boolean)
    if (pathParts.length  === 2) {
      result.path = path.join(...pathParts)
      result.path += '.mkv'
    }
  }
  if (result.path) {
    result.exists = fs.existsSync(result.path)
  }
  return result
}