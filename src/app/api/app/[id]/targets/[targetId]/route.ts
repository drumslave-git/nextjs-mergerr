import withApi, {NextApiRequestWithApi} from "@/lib/withApi"

async function getHandler(req: NextApiRequestWithApi, { params }: { params: { id: string, targetId: string } }) {
  const targetReq = await req.api.movie.get(params.targetId)

  return Response.json(targetReq.data, {status: targetReq.status})
}

export const GET = withApi(getHandler)