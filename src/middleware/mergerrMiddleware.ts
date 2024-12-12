import {MergerrAPI} from "@/common/api/Mergerr/api"
import {prisma} from "@/lib/prisma"
import {NextRequestWithMergerrApi} from "@/lib/withMergerrApi"

export default async function mergerrMiddleware(
  req: NextRequestWithMergerrApi,
  id: string
) {
  if (!id) {
    return Response.json({ message: 'appId is required' }, {status: 404})
  }

  const app = await prisma.app.findUnique({
    where: {
      id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  req.mergerrAPI = new MergerrAPI(app.id)
}