import {prisma} from "@/lib/prisma"

export async function POST(req: Request) {
  const  {id, ...data} = await req.json()
  const normalizedData = {
    ...data,
    type: data.type.toLowerCase()
  }
  let app
  if (id) {
    app = await prisma.app.update({
      where: {
        id,
      },
      data: normalizedData,
    })
  } else {
    app = await prisma.app.create({
      data: normalizedData,
    })
  }

  return Response.json(app)
}