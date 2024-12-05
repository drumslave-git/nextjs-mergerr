import withTMDBApi from "@/lib/withTMDBApi"
import {NextRequestWithTMDBApi} from "@/middleware/tmdbMiddleware"

const getHandler = async (req: NextRequestWithTMDBApi, {params}: {params: {type: 'tv' | 'movie'}}) => {
  const {type} = await params
  const resp = await req.tmdbAPI.genres[type]()
  return Response.json(resp.data, {status: resp.status})
}

export const GET = withTMDBApi(getHandler)