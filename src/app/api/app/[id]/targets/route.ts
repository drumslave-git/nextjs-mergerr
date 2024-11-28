import withApi, {NextRequestWithApi} from "@/lib/withApi"

async function getHandler(req: NextRequestWithApi) {
  const targetsReq = await req.api.movie.get()

  return Response.json(targetsReq.data, {status: targetsReq.status})
}

export const GET = withApi(getHandler)