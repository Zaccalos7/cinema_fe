import {useEffect, useRef, useState} from 'react'
import {type Fetcher, type FetcherSubmitOptions, useFetcher} from 'react-router'

interface Polling {
  data: Fetcher['data']
  autoStart: boolean
  options: FetcherSubmitOptions
  /**
   * IN MS, DEFAULTS TO 30 SECONDS
   */
  interval?: number
  fetcherKey?: string
}

/**
 * @template T What you pass will be what will be casted as the data returned by the fetcher
 */

export const usePolling = <T>({
  interval = 30_000,
  data,
  autoStart,
  options,
  fetcherKey
}: Polling) => {
  const fetcher = useFetcher({key: fetcherKey})
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isPolling = useRef(false)
  const intervalSpeedRef = useRef(interval)
  const [isCurrentlyPolling, setIsCurrentlyPolling] = useState(false)
  const [lastCallTm, setLastCallTm] = useState(0)

  const setPollingInterval = (newInterval: number) => {
    intervalSpeedRef.current = newInterval
  }

  const submitter = () => {
    fetcher.submit(data, options)
    setLastCallTm(Math.floor(Date.now() / 1000))
  }

  const fire = (ignorePollingState = false) => {
    if (ignorePollingState) {
      submitter()
      return
    }
    if (isCurrentlyPolling) {
      stopPolling()
      startPolling()
    }
  }

  const startPolling = () => {
    if (isPolling.current) {
      return
    }
    isPolling.current = true
    setIsCurrentlyPolling(true)

    submitter()
  }

  const stopPolling = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsCurrentlyPolling(false)
    isPolling.current = false
  }

  useEffect(() => {
    if (fetcher.state === 'idle' && isPolling.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        submitter()
      }, intervalSpeedRef.current)
    }
  }, [fetcher])

  useEffect(() => {
    if (autoStart) {
      startPolling()
    }
    return () => stopPolling()
  }, [])

  return {
    data: fetcher.data as T,
    state: fetcher.state,
    start: startPolling,
    stop: stopPolling,
    /**
     * Fires a punctual submit of the fetcher
     * Polling won't be stopped not started
     */
    fire,
    /***
     * Doesn't stop nor start polling, if you wish to do so you have
     * to do it manually through start() and stop() methods
     */
    setPollingInterval,
    isCurrentlyPolling,
    lastFireTm: lastCallTm
  }
}
