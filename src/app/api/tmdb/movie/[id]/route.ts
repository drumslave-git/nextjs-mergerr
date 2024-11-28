import withTMDBApi from "@/lib/withTMDBApi"
import {NextRequestWithTMDBApi} from "@/middleware/tmdbMiddleware"

const getHandler = async (req: NextRequestWithTMDBApi, {params}: {params: {id: string}}) => {
  const resp = await req.tmdbAPI.movie.details(Number(params.id))

  return Response.json(resp.data, {status: resp.status})
}

export const GET = withTMDBApi(getHandler)