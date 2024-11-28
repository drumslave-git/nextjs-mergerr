import withTMDBApi, {NextRequestWithTMDBApi} from "@/lib/withTMDBApi"

const getHandler = async (req: NextRequestWithTMDBApi) => {
  const resp = await req.tmdbAPI.auth.authentication()
  return Response.json(resp.data, {status: resp.status})
}

export const GET = withTMDBApi(getHandler)