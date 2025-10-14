import MessageView from '../../components/MessageView'

export default function MessagePage({ params }: { params: { id: string } }) {
  return (
    <div className="card space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">One-Time Secret</h1>
      <p className="text-center text-gray-600">This message will be shown only once</p>
      <MessageView id={params.id} />
    </div>
  )
}

