import {prisma} from "@/lib/prisma"

export async function POST(req: Request) {
  const  {id, ...data} = await req.json()
  let app
  if (id) {
    app = await prisma.app.update({
      where: {
        id,
      },
      data,
    })
  } else {
    app = await prisma.app.create({
      data,
    })
  }

  return Response.json(app)
}