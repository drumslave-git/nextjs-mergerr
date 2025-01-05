import withTPDBApi from "@/lib/withTPDBApi"
import {NextRequestWithTPDBApi} from "@/middleware/tpdbMiddleware"

const getHandler = async (req: NextRequestWithTPDBApi, {params}: {params: {identifier: string}}) => {
  const {identifier} = await params
  const resp = await req.tpdbAPI.movie.get(identifier)

  return Response.json(resp.data, { status: resp.status })
}

export const GET = withTPDBApi(getHandler)