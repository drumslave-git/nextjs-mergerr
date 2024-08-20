import getTarget from "@/common/api/getTarget"
import {prisma} from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string, targetId: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })
  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const targetReq = await getTarget(app, params.targetId)

  return Response.json(await targetReq.json(), {status: targetReq.status})
}