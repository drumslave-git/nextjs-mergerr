import withTPDBApi from "@/lib/withTPDBApi"
import {NextRequestWithTPDBApi} from "@/middleware/tpdbMiddleware"

const getHandler = async (req: NextRequestWithTPDBApi) => {
  const resp = await req.tpdbAPI.user.auth()

  return Response.json(resp?.data || {message: 'no response data'}, { status: resp.status })
}

export const GET = withTPDBApi(getHandler)