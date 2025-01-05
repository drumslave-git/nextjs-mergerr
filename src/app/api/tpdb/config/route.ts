import {prisma} from "@/lib/prisma"
import withTPDBApi from "@/lib/withTPDBApi"
import {NextRequestWithTPDBApi} from "@/middleware/tpdbMiddleware"

const postHandler = async (req: NextRequestWithTPDBApi) => {
  const data = await req.json()
  if (!data.key) {
    return Response.json({ error: 'Key is required' }, { status: 400 })
  }
  let resp = await prisma.tPDB.findFirst()
  if(resp) {
    await prisma.tPDB.deleteMany()
  }
  resp = await prisma.tPDB.create({
    data: {
      key: data.key,
    }
  })
  return Response.json(resp)
}

const getHandler = async () => {
  const resp = await prisma.tPDB.findFirst()
  return Response.json({ key: resp?.key || '' })
}

export const POST = withTPDBApi(postHandler)
export const GET = withTPDBApi(getHandler)