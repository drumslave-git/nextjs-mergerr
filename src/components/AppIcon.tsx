import {App} from "@prisma/client"
import Image from "next/image"

export default function AppIcon({ app, size = 24 }: { app: App, size?: number }) {
  return <Image src={`/${app.type}.png`} alt={app.name} width={size} height={size} />
}