import withApi, {NextRequestWithApi} from "@/lib/withApi"

const getHandler = async (req: NextRequestWithApi) => {
  const tmdbId = req.nextUrl.searchParams.get('tmdbId')
  const resp = await req.api.movie.get(undefined, tmdbId ? Number(tmdbId) : undefined)
  return Response.json(resp.data, {status: resp.status})
}

const postHandler = async (req: NextRequestWithApi) => {
  const {tmdbId, options} = await req.json()
  const resp = await req.api.addByTMDB(tmdbId, options)
  return Response.json(resp.data, {status: resp.status})
}

export const GET = withApi(getHandler)
export const POST = withApi(postHandler)