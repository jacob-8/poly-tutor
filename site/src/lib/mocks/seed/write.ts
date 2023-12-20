import { writeFileSync } from 'fs'
import { userString, youtube_channels, youtubes, youtube_transcripts, youtube_summaries } from './values'

function convert_to_sql_string(value: string | number | object) {
  if (typeof value === 'string')
    return `'${value}'`
  if (typeof value === 'number' || value === null)
    return `${value}`
  if (Array.isArray(value))
    return `'{${value.join(',')}}'`
  if (typeof value === 'object')
    return `'${JSON.stringify(value)}'::jsonb`
  throw new Error(`${value} has an unexpected value type: ${typeof value}`)
}

function write_sql_file_string(table_name: string, rows: object[]) {
  const column_names = Object.keys(rows[0])
  const column_names_string = `"${column_names.join('", "')}"`
  const values_string = rows.map(row => {
    const values = Object.values(row).map(convert_to_sql_string)
    return `(${values.join(', ')})`
  }).join(',\n')
  return `INSERT INTO ${table_name} (${column_names_string}) VALUES\n${values_string};`
}

if (import.meta.vitest) {
  test(write_sql_file_string, () => {
    const everything_mock = [
      {
        text: 'hello',
        real: 12.4,
        int: 2,
        array: [1,2],
        jsonb: {
          a: {
            b: 1
          }
        },
      },
      {
        text: null,
        real: 12.4,
        int: 2,
        array: [],
        jsonb: {
          array: []
        },
      },
    ]
    expect(write_sql_file_string('everything', everything_mock)).toMatchFileSnapshot('./write.test.sql')
  })
}

export function exportToSql() {
  const sql = `${userString}

${write_sql_file_string('youtube_channels', youtube_channels)}

${write_sql_file_string('youtubes', youtubes)}

${write_sql_file_string('youtube_transcripts', youtube_transcripts)}

${write_sql_file_string('youtube_summaries', youtube_summaries)}
`
  writeFileSync('./supabase/seed.sql', sql)
}
