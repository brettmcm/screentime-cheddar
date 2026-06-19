import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn } from 'node:child_process'

const root = process.cwd()
const githubRegistry = 'https://npm.pkg.github.com'
const githubPackageName = '@figma/screentime-cheddar-ds'

const packageJsonPath = join(root, 'package.json')
const readmePath = join(root, 'README.md')
const distPath = join(root, 'dist')

const rawPackageJson = await readFile(packageJsonPath, 'utf8')
const packageJson = JSON.parse(rawPackageJson)
packageJson.name = githubPackageName
delete packageJson.publishConfig

const stagingDir = await mkdtemp(join(tmpdir(), 'cheddar-ds-github-publish-'))

try {
  await cp(distPath, join(stagingDir, 'dist'), { recursive: true })
  await cp(readmePath, join(stagingDir, 'README.md'))
  await writeFile(join(stagingDir, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)

  await new Promise((resolve, reject) => {
    const child = spawn(
      'npm',
      ['publish', stagingDir, '--registry', githubRegistry, '--ignore-scripts'],
      { stdio: 'inherit', shell: false },
    )
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`npm publish failed with exit code ${code ?? 'unknown'}`))
    })
    child.on('error', reject)
  })
} finally {
  await rm(stagingDir, { recursive: true, force: true })
}
