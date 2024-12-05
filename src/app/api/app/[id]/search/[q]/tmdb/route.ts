import withApi, {NextRequestWithApi} from "@/lib/withApi"

async function getHandler(req: NextRequestWithApi, {params}: {params: {id: string, q: string}}) {
  const encoder = new TextEncoder()

  const readableStream = new ReadableStream({
    async start(controller) {
      const {q} = await params
      await req.api.tmdbSearch(q, async (resp) => {
        resp.data.results = await Promise.all(resp.data.results.map(async (result) => {
          const movie = await req.api.movie.get(undefined, result.id)
          return {
            ...result,
            movieAdded: movie?.data?.at(0) !== undefined
          }
        }))
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(resp.data)}\n\n`))
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