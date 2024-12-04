import withApi, {NextRequestWithApi} from "@/lib/withApi"

const getHandler = async (req: NextRequestWithApi, {params} : {params: {id: string, movieId: string}}) => {
  const resp = await req.api.movie.get(params.movieId)

  return Response.json(resp.data, {status: resp.status})
}

export const GET = withApi(getHandler)