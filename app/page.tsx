import MessageForm from './components/MessageForm'

export default function Home() {
  return (
    <div className="card space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">One-Time Secret</h1>
      <p className="text-center text-gray-600">Create a secure, self-destructing message</p>
      <MessageForm />
    </div>
  )
}

