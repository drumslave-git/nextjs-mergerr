import {prisma} from '@/lib/prisma'

export async function GET(req: Request, props: { params: Promise<{ id: string, mergeId: string }> }) {
  const params = await props.params;
  const merge = await prisma.merge.findUnique({
    where: {
      app_id: params.id,
      id: params.mergeId
    },
    include: {
      inputs: true
    }
  })

  if (!merge) {
    return Response.json({message: 'merge not found'}, {status: 404})
  }

  return Response.json(merge)
}

export async function DELETE(req: Request, props: { params: Promise<{id: string, mergeId: string}> }) {
  const params = await props.params;
  const result = await prisma.merge.delete({
    where: {
      id: params.mergeId,
      app_id: params.id
    }
  })

  if (!result) {
    return Response.json({message: 'merge not found'}, {status: 404})
  }

  return Response.json({message: 'ok'})
}