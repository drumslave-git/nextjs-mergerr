import withApi, {NextRequestWithApi} from "@/lib/withApi"

const getHandler = async (req: NextRequestWithApi, {params}: {params: {id: string}}) => {
  const resp = await req.api.rootFolder.get()

  return Response.json(resp.data, {status: resp.status})
}

export const GET = withApi(getHandler)