import withTMDBApi from "@/lib/withTMDBApi"
import {NextRequestWithTMDBApi} from "@/middleware/tmdbMiddleware"

const getHandler = async (req: NextRequestWithTMDBApi) => {
  const resp = await req.tmdbAPI.configuration.details()
  return Response.json(resp.data, {status: resp.status})
}

export const GET = withTMDBApi(getHandler)