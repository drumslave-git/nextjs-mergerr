import {prisma} from "@/lib/prisma"
import withTMDBApi, {NextRequestWithTMDBApi} from "@/lib/withTMDBApi"

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

export const POST = withTMDBApi(postHandler)