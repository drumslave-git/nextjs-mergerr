import withApi, {NextRequestWithApi} from "@/lib/withApi"

const getHandler = async (req: NextRequestWithApi, {params} : {params: {id: string, movieId: string}}) => {
  const {movieId} = await params
  const resp = await req.api.movie.get(movieId)

  return Response.json(resp.data, {status: resp.status})
}

export const GET = withApi(getHandler)