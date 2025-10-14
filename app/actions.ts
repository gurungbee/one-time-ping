'use server'

import { v4 as uuidv4 } from 'uuid'

interface Message {
  id: string
  content: string
  expiresAt: number
}

export async function createMessage(content: string) {
  const id = uuidv4()
  const expiresAt = Date.now() + 60000 // 1 minute from now

  const message: Message = { id, content, expiresAt }
  
  // We can't directly use localStorage in a server action, so we'll return the message object
  return { success: true, message }
}

export async function getMessage(id: string) {
  // We'll handle the actual retrieval in the client component
  return { success: true, id }
}

export async function deleteMessage(id: string) {
  // We'll handle the actual deletion in the client component
  return { success: true, id }
}
