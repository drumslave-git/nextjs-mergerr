import {ApiEndpoints, AppType} from "@/consts"
import qs from "qs"
import {App} from "@prisma/client"

export default async function getTarget(app: App, targetId: string) {
  const apiEndPoint = ApiEndpoints[app.type as AppType].target
  const apiEndPointParams = qs.stringify({
    ...apiEndPoint.params,
    apiKey: app.api_key,
  })

  return await fetch(`${app.url}${apiEndPoint.uri}/${targetId}?${apiEndPointParams}`, {cache: "no-cache"})
}