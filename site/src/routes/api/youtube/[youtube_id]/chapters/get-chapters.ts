interface YouTubeInitialData {
  engagementPanels: {
    engagementPanelSectionListRenderer: {
      panelIdentifier?: string
      content?: {
        macroMarkersListRenderer: {
          contents?: {
            macroMarkersInfoItemRenderer?: any // if key exists in first content item, indicates they are auto generated, mark it true and skip the first item in the array
            macroMarkersListItemRenderer: {
              title: {
                simpleText: string
              },
              // timeDescription: {
              //   simpleText: string // not using to avoid having to parse 34:21 type times
              // },
              timeRangeStartMillis: number // not using but could switch to use this
              repeatButton: {
                toggleButtonRenderer: {
                  defaultServiceEndpoint: {
                    repeatChapterCommand: {
                      startTimeMs: string // "0"
                      endTimeMs: string // "2000"
                    }
                  }
                }
              },
              thumbnail: {
                thumbnails: {
                  url: string
                  width: number
                  height: number
                }[]
              }
            }
          }[]
        }
      }
    }
  }[]
}

export interface YoutubeChapter {
  title: string;
  start_ms: number;
  end_ms: number;
  thumbnails: {
      url: string;
      width: number;
      height: number;
  }[];
}

export function parse_data_from_html(html: string): YouTubeInitialData {
  const ytInitialDataRE = /var ytInitialData = (?<json>.*?);<\/script>/
  const match = ytInitialDataRE.exec(html)

  if (!(match?.groups?.json))
    throw new Error('ytInitialData not found')

  try {
    return JSON.parse(match.groups.json) as YouTubeInitialData
  } catch (e) {
    console.error(e)
    throw new Error('ytInitialData could not be JSON parsed')
  }
}

export function extract_chapters_from_youtube_initial_data(youtube_initial_data: YouTubeInitialData): YoutubeChapter[] | null {
  const { engagementPanels } = youtube_initial_data
  const chapters_engagement_panel = engagementPanels.find(panel => panel.engagementPanelSectionListRenderer.panelIdentifier === 'engagement-panel-macro-markers-description-chapters')
  const { contents } = chapters_engagement_panel.engagementPanelSectionListRenderer.content.macroMarkersListRenderer
  if (!contents) return null
  const chapters_are_autogenerated = !!contents[0].macroMarkersInfoItemRenderer
  const chapters = contents.slice(chapters_are_autogenerated ? 1 : 0)
  const my_chapters = chapters.map(({macroMarkersListItemRenderer: chapter}) => {
    return {
      title: chapter.title.simpleText,
      start_ms: parseInt(chapter.repeatButton.toggleButtonRenderer.defaultServiceEndpoint.repeatChapterCommand.startTimeMs),
      end_ms: parseInt(chapter.repeatButton.toggleButtonRenderer.defaultServiceEndpoint.repeatChapterCommand.endTimeMs),
      thumbnails: chapter.thumbnail.thumbnails,
    }
  })
  return my_chapters
}

if (import.meta.vitest) {
  test(parse_data_from_html, () => {
    const html = `<!DOCTYPE html>
<html>
<body>
<script nonce="foo">if (window.ytcsi) { window.ytcsi.tick('pdc', null, ''); }</script>
<script 
    nonce="foo">var ytInitialData = { "responseContext": "hi", "timestamp": { "seconds": "1706320712", "nanos": 393284299 } };</script>
</body>
</html>`
    expect(parse_data_from_html(html)).toMatchInlineSnapshot(`
        {
          "responseContext": "hi",
          "timestamp": {
            "nanos": 393284299,
            "seconds": "1706320712",
          },
        }
      `)
  })

  test(extract_chapters_from_youtube_initial_data, async () => {
    const ytMockInitialData = await (await import('$lib/mocks/data/yt-mock-initial-data')).default

    expect(extract_chapters_from_youtube_initial_data(ytMockInitialData)).toMatchInlineSnapshot(`
      [
        {
          "end_ms": 344000,
          "start_ms": 0,
          "thumbnails": [
            {
              "height": 94,
              "url": "https://i.ytimg.com/vi/6Yl9fKx-J4A/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLA5D0hYIkhR4idkfEAWc5MMTynTOw",
              "width": 168,
            },
            {
              "height": 188,
              "url": "https://i.ytimg.com/vi/6Yl9fKx-J4A/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLABujfW6UxKCOxd3gXM_0rosW7XXg",
              "width": 336,
            },
          ],
          "title": "一 开",
        },
        {
          "end_ms": 866000,
          "start_ms": 344000,
          "thumbnails": [
            {
              "height": 94,
              "url": "https://i.ytimg.com/vi/6Yl9fKx-J4A/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLA5D0hYIkhR4idkfEAWc5MMTynTOw",
              "width": 168,
            },
            {
              "height": 188,
              "url": "https://i.ytimg.com/vi/6Yl9fKx-J4A/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLABujfW6UxKCOxd3gXM_0rosW7XXg",
              "width": 336,
            },
          ],
          "title": "二 父",
        },
      ]
    `)
  })
}