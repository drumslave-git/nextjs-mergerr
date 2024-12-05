import {prisma} from "@/lib/prisma"

export const GET = async (req: Request, props: {params: Promise<{id: string}>}) => {
  const params = await props.params;
  const app = await prisma.app.findUnique({
    where: {
      id: params.id
    }
  })
  return Response.json(app)
}