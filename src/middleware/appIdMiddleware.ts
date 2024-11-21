import {RadarrAPI} from "@/common/api/RadarrApi"
import {prisma} from "@/lib/prisma"
import {NextApiRequestWithApi} from "@/lib/withApi"

export default async function appIdMiddleware(
  req: NextApiRequestWithApi,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return Response.json({ message: 'appId is required' }, {status: 404})
  }

  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  // You can add a variable to the request object for use in route handlers
  req.api = new RadarrAPI({
    apiKey: app.api_key,
    baseUrl: app.url
  })
}