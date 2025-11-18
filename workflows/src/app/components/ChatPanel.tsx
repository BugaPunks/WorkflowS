'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: string;
  _count: {
    messages: number;
  };
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
  replies?: Array<{
    id: string;
    content: string;
    sender: {
      name: string;
    };
    createdAt: string;
  }>;
}

export default function ChatPanel() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChannels();
  }, [projectId]);

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChannels = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/chat/channels`);
      if (response.ok) {
        const data = await response.json();
        setChannels(data);
        // Auto-select first channel if available
        if (data.length > 0 && !selectedChannel) {
          setSelectedChannel(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeChatData = async () => {
    setInitializing(true);
    try {
      const response = await fetch('/api/init-chat');
      if (response.ok) {
        const data = await response.json();
        console.log('Chat initialized:', data);
        // Reload channels after initialization
        await fetchChannels();
      } else {
        console.error('Failed to initialize chat');
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setInitializing(false);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/chat/channels/${channelId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/chat/channels/${selectedChannel.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando chat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Channels Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Canales</h2>
          <p className="text-sm text-gray-600">Proyecto: {projectId}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {channels.length === 0 ? (
            <div className="p-4 text-center">
              <div className="text-gray-500 mb-4">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">No hay canales de chat aún</p>
              </div>
              <button
                onClick={initializeChatData}
                disabled={initializing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {initializing ? 'Inicializando...' : 'Crear Canal General'}
              </button>
            </div>
          ) : (
            channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                  selectedChannel?.id === channel.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{channel.name}</h3>
                    {channel.description && (
                      <p className="text-sm text-gray-600 truncate">{channel.description}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {channel._count.messages} mensajes
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + Nuevo Canal
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {selectedChannel && (
          <div className="bg-white border-b border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900">#{selectedChannel.name}</h3>
            {selectedChannel.description && (
              <p className="text-sm text-gray-600">{selectedChannel.description}</p>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {message.sender.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium text-gray-900">{message.sender.name}</span>
                  <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                </div>
                {message.replyTo && (
                  <div className="mt-2 p-2 bg-gray-100 rounded border-l-2 border-gray-300">
                    <p className="text-sm text-gray-600">
                      Respondiendo a <strong>{message.replyTo.sender.name}</strong>
                    </p>
                    <p className="text-sm text-gray-800 truncate">{message.replyTo.content}</p>
                  </div>
                )}
                <p className="text-gray-800 mt-1">{message.content}</p>
                {message.replies && message.replies.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-2 pl-4 border-l-2 border-gray-200">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">
                              {reply.sender.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-medium text-gray-700 text-sm">{reply.sender.name}</span>
                            <span className="text-xs text-gray-500">{formatTime(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {selectedChannel && (
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Mensaje en #${selectedChannel.name}...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}