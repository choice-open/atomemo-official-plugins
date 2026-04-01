const fs = require('fs')
const path = require('path')

function walk(dir) {
  const results = []
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const full = path.join(dir, d.name)
    if (d.isDirectory()) {
      results.push(...walk(full))
    } else if (d.isFile() && full.endsWith('.ts')) {
      results.push(full)
    }
  })
  return results
}

const root = path.join(__dirname, '..', 'src')
const files = walk(root)
const issues = []
for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8')
  const lines = raw.split(/\r?\n/)
  lines.forEach((line, idx) => {
    if (/ui:\s*\{\s*component/.test(line) || /ui:\s*\{/.test(line)) {
      // look back up to 8 lines for display_name
      let found = false
      for (let i = Math.max(0, idx - 8); i <= idx + 1; i++) {
        if (lines[i] && /display_name\s*:\s*t?\(?.*/.test(lines[i])) {
          found = true
          break
        }
      }
      if (!found) {
        issues.push({ file, line: idx + 1, snippet: lines.slice(Math.max(0, idx - 4), idx + 5).join('\n') })
      }
    }
  })
}

if (issues.length === 0) {
  console.log('No missing display_name nearby ui blocks (heuristic check)')
  process.exit(0)
}
console.log('Potential missing display_name occurrences:')
for (const it of issues) {
  console.log('\n---')
  console.log(it.file + ':' + it.line)
  console.log(it.snippet)
}
process.exit(0)
