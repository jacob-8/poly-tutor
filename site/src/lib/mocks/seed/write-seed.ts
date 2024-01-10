import { userString, youtube_channels, youtubes, youtube_transcripts, youtube_summaries, word_updates } from './tables'

function convert_to_sql_string(value: string | number | object) {
  if (typeof value === 'boolean')
    return `${value}`
  if (typeof value === 'string')
    return `'${value}'`
  if (typeof value === 'number')
    return `${value}`
  if (Array.isArray(value))
    return `'{${value.join(',')}}'`
  if (!value) // must come here to avoid snatching up 0, empty string, or false, but not after object
    return 'null'
  if (typeof value === 'object')
    return `'${JSON.stringify(value)}'::jsonb`
  throw new Error(`${value} has an unexpected value type: ${typeof value}`)
}

function write_sql_file_string(table_name: string, rows: object[]) {
  const column_names = Object.keys(rows[0]).sort()
  const column_names_string = `"${column_names.join('", "')}"`

  const values_string = rows.map(row => {
    const values = column_names.map(column => convert_to_sql_string(row[column]))
    return `(${values.join(', ')})`
  }).join(',\n')

  return `INSERT INTO ${table_name} (${column_names_string}) VALUES\n${values_string};`
}

if (import.meta.vitest) {
  test(write_sql_file_string, () => {
    const everything_mock = [
      {
        text: 'hello',
        boolean: true,
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
        real: 12.4,
        boolean: false,
        text: '', // order of keys doesn't matter
        int: 0,
        array: [],
        jsonb: {
          array: []
        },
      },
      {
      }
    ]
    expect(write_sql_file_string('everything', everything_mock)).toMatchFileSnapshot('./write-seed.test.sql')
  })
}

export function exportToSql() {
  const sql = `${userString}

${write_sql_file_string('youtube_channels', youtube_channels)}

${write_sql_file_string('youtubes', youtubes)}

${write_sql_file_string('youtube_transcripts', youtube_transcripts)}

${write_sql_file_string('youtube_summaries', youtube_summaries)}

${write_sql_file_string('word_updates', word_updates)}
`
  return sql
}
