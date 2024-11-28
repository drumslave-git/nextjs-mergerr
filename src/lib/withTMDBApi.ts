import tmdbMiddleware, {NextRequestWithTMDBApi} from '@/middleware/tmdbMiddleware'

export default function withTMDBApi(
  handler: (req: NextRequestWithTMDBApi, ...rest: any[]) => any | Promise<any>
) {
  return async (req: NextRequestWithTMDBApi, ...rest: any[]) => {
    await tmdbMiddleware(req)
    return handler(req, ...rest)
  }
}

