import {Data} from "@/common/api/TPDB/types"
import withApi, {NextRequestWithApi} from "@/lib/withApi"

async function getHandler(req: NextRequestWithApi, {params}: {params: {id: string, q: string}}) {
  const encoder = new TextEncoder()

  const readableStream = new ReadableStream({
    async start(controller) {
      const {q} = await params
      await req.api.tpdbSearch(q, async (data: Data[]) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      })
      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Encoding': 'none',
    },
  })
}

export const GET = withApi(getHandler)