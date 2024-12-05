import withApi, {NextRequestWithApi} from "@/lib/withApi"

const getHandler = async (req: NextRequestWithApi, {params}: {params: {id: string, entity: 'rootFolder' | 'qualityProfile'}}) => {
  const {entity} = await params
  const resp = await req.api[entity].get()

  return Response.json(resp.data, {status: resp.status})
}

export const GET = withApi(getHandler)