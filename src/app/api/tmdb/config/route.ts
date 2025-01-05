import {prisma} from "@/lib/prisma"
import withTMDBApi from "@/lib/withTMDBApi"
import {NextRequestWithTMDBApi} from "@/middleware/tmdbMiddleware"

const postHandler = async (req: NextRequestWithTMDBApi) => {
  const data = await req.json()
  if (!data.key) {
    return Response.json({ error: 'Key is required' }, { status: 400 })
  }
  let resp = await prisma.tMDB.findFirst()
  if(resp) {
    await prisma.tMDB.deleteMany()
  }
  resp = await prisma.tMDB.create({
    data: {
      key: data.key,
    }
  })
  return Response.json(resp)
}

const getHandler = async () => {
  const resp = await prisma.tMDB.findFirst()

  return Response.json({key: resp?.key || ''})
}

export const POST = withTMDBApi(postHandler)
export const GET = withTMDBApi(getHandler)