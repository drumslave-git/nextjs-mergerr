import tpdbMiddleware, {NextRequestWithTPDBApi} from "@/middleware/tpdbMiddleware"

export default function withTPDBApi(
  handler: (req: NextRequestWithTPDBApi, ...rest: any[]) => any | Promise<any>
) {
  return async (req: NextRequestWithTPDBApi, ...rest: any[]) => {
    await tpdbMiddleware(req)
    return handler(req, ...rest)
  }
}

