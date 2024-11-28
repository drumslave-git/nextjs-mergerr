import withTMDBApi, {NextRequestWithTMDBApi} from "@/lib/withTMDBApi"

const getHandler = async (req: NextRequestWithTMDBApi, {params}: {params: {type: 'tv' | 'movie'}}) => {
  const resp = await req.tmdbAPI.genres[params.type]()
  return Response.json(resp.data, {status: resp.status})
}

export const GET = withTMDBApi(getHandler)