'use client'

import {MergeStatus} from "@/consts"
import {App, Merge} from "@prisma/client"
import {Dispatch, ReactNode, SetStateAction, createContext, useCallback, useContext, useEffect, useState} from "react"

type Context = {
  merge: (record: Record<string, any>, downloads: Record<string, any>[]) => Promise<Merge|null>
  listAppMerges: () => Promise<Merge[]>,
  merges: Merge[],
  deleteMerge: (merge: Merge) => Promise<void>
}

let pollingTimeout: any

const MergerrContext = createContext<Context>({
  merge: () => Promise.resolve(null),
  listAppMerges: () => Promise.resolve([]),
  merges: [],
  deleteMerge: () => Promise.resolve(),
})

const streamAppMerges = async (app: App, merges: Merge[], setMerges: Dispatch<SetStateAction<Merge[]>>) => {
  clearTimeout(pollingTimeout)
  let updatedMerges = merges
  await Promise.all(merges.filter(merge => merge.status === MergeStatus.running || merge.status === MergeStatus.created).map(async merge => {
    await fetch(`/api/app/${app.id}/merge/${merge.id}`).then(res => res.json())
      .then(data => {
        updatedMerges = updatedMerges.map(m => m.id === data.id ? data : m)
        setMerges(updatedMerges)
      })
      .catch(() => {
        updatedMerges = updatedMerges.filter(m => m.id !== m.id)
        setMerges(updatedMerges)
      })
  }))
  pollingTimeout = setTimeout(() => streamAppMerges(app, updatedMerges, setMerges), 3000)
}

export function MergerrProvider({children, app}: {children: ReactNode, app: App}) {
  const [merges, setMerges] = useState<Merge[]>([])

  const merge = useCallback((record: Record<string, any>, downloads: Record<string, any>[]) => {
    return fetch(`/api/app/${app.id}/merge`, {
      method: 'POST',
      body: JSON.stringify({
        inputs: downloads.map((download) => ({
          path: download.path,
          name: download.name,
        })),
        output: {
          path: record.movie.path,
          name: record.movie.cleanTitle,
          extension: downloads[0].path.split('.').pop(),
        },
      }),
    }).then(res => res.json())
  }, [app])

  const listAppMerges = useCallback(() => {
    return fetch(`/api/app/${app.id}/merge`).then(res => res.json()).then(data => {
      setMerges(data)
      streamAppMerges(app, data, setMerges)
      return data
    })
  }, [app])

  const deleteMerge = useCallback((merge: Merge) => {
    return fetch(`/api/app/${app.id}/merge/${merge.id}`, {method: 'DELETE'}).then(res => res.json()).then(data => {
      listAppMerges()
    })
  }, [app, listAppMerges])

  useEffect(() => {
    listAppMerges()
  }, [listAppMerges])

  return <MergerrContext.Provider value={{merge, listAppMerges, merges, deleteMerge}}>
    {children}
  </MergerrContext.Provider>
}

export function useMergerr() {
  return useContext(MergerrContext)
}