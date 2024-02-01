import type { OpenAiChatStreamResponse } from '$api/chat/+server'

export const streamResponses: OpenAiChatStreamResponse[] = [
  {
    'id':'chatcmpl-7fk6EXGWflbli7Xj3Bmv3dOhIq0Wk',
    'object':'chat.completion.chunk',
    'created':1690183010,
    'model':'gpt-3.5-turbo-0613',
    'choices':[
      {
        'index':0,
        'delta':{'content':'Hello '},
        'finish_reason':null
      }
    ],
  },
  {
    'id':'chatcmpl-7fk6EXGWflbli7Xj3Bmv3dOhIq0Wk',
    'object':'chat.completion.chunk',
    'created':1690183010,
    'model':'gpt-3.5-turbo-0613',
    'choices':[
      {
        'index':0,
        'delta':{'content':'World'},
        'finish_reason':null
      }
    ]
  },
  {
    'id':'chatcmpl-7fk6EXGWflbli7Xj3Bmv3dOhIq0Wk',
    'object':'chat.completion.chunk',
    'created':1690183010,
    'model':'gpt-3.5-turbo-0613',
    'choices':[
      {
        'index':0,
        'delta':{},
        'finish_reason':'stop'
      }
    ]
  }
]

