'use client'

import { useState, useEffect } from 'react'
import { createMessage, deleteMessage } from '../actions'
import { ClipboardIcon, ArrowTopRightOnSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function MessageForm() {
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Clean up expired messages on component mount
    const now = Date.now()
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('message_')) {
        const message = JSON.parse(localStorage.getItem(key) || '{}')
        if (message.expiresAt < now) {
          localStorage.removeItem(key)
        }
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await createMessage(message)
    if (result.success) {
      const { message: newMessage } = result
      localStorage.setItem(`message_${newMessage.id}`, JSON.stringify(newMessage))
      setLink(`${window.location.origin}/message/${newMessage.id}`)
      setMessage('')
    }
  }

  const truncateLink = (url: string) => {
    return url.length > 30 ? url.substring(0, 30) + '...' : url
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openLink = () => {
    window.open(link, '_blank')
  }

  const handleDelete = async () => {
    if (link) {
      const id = link.split('/').pop()
      if (id) {
        await deleteMessage(id)
        localStorage.removeItem(`message_${id}`)
        setLink('')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Your Message
        </label>
        <textarea
          id="message"
          className="input rounded-2xl resize-none w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your secret message here..."
          rows={4}
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Create One-Time Message
      </button>
      {link && (
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-gray-700">Share this link (expires in 1 minute):</p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              value={truncateLink(link)}
              readOnly
              className="input flex-grow w-full sm:w-auto"
              onClick={(e) => e.currentTarget.select()}
            />
            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={copyToClipboard}
                className="btn-secondary flex items-center justify-center w-full sm:w-12 h-12"
              >
                <ClipboardIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={openLink}
                className="btn-secondary flex items-center justify-center w-full sm:w-12 h-12"
              >
                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn-secondary flex items-center justify-center w-full sm:w-12 h-12"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          {copied && (
            <p className="text-sm text-green-600 animate-fade-in-out">
              Link copied to clipboard!
            </p>
          )}
        </div>
      )}
    </form>
  )
}

