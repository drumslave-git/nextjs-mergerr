import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(req: Request) {
  const packageJsonPath = join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  return Response.json({ version: packageJson.version })
}