import withTMDBApi from "@/lib/withTMDBApi"
import {NextRequestWithTMDBApi} from "@/middleware/tmdbMiddleware"

const getHandler = async (req: NextRequestWithTMDBApi, {params}: {params: {type: 'tv' | 'movie'}}) => {
  const resp = await req.tmdbAPI.genres[params.type]()
  return Response.json(resp.data, {status: resp.status})
}

export const GET = withTMDBApi(getHandler)