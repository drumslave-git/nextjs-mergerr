import {prisma} from "@/lib/prisma"
import Edit from "@/components/EditApp"
import {App} from "@prisma/client"

export default async function EditApp(props: {params: Promise<{id: string}>}) {
  const params = await props.params
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