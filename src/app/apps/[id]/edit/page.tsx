import {prisma} from "@/lib/prisma"
import Edit from "@/components/EditApp"
import {App} from "@prisma/client"

export default async function EditApp({params}: {params: {id: string}}) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return <h1>App not found</h1>
  }

  return (
    <Edit app={app as unknown as App} />
  )
}