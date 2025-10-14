'use client'

import { useState, useEffect } from 'react'

interface MessageViewProps {
  id: string;
}

export default function MessageView({ id }: MessageViewProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    const storedMessage = localStorage.getItem(`message_${id}`)
    if (storedMessage) {
      const parsedMessage = JSON.parse(storedMessage)
      if (Date.now() > parsedMessage.expiresAt) {
        setError('Message has expired')
        localStorage.removeItem(`message_${id}`)
      } else {
        setMessage(parsedMessage.content)
        localStorage.removeItem(`message_${id}`)
        const remainingTime = Math.ceil((parsedMessage.expiresAt - Date.now()) / 1000)
        setTimeLeft(remainingTime > 0 ? remainingTime : 60)
      }
    } else {
      setError('Message not found or already viewed')
    }
  }, [id])

  useEffect(() => {
    if (message) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [message])

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <p className="mt-4 text-gray-600">This message may have expired or been viewed already.</p>
      </div>
    )
  }

  if (!message) {
    return <p className="text-center">Loading...</p>
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 rounded-2xl p-6">
        <p className="text-gray-800 text-lg">{message}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">
          This message will self-destruct in{' '}
          <span className="font-medium text-blue-500">{timeLeft}</span> seconds
        </p>
      </div>
    </div>
  )
}
