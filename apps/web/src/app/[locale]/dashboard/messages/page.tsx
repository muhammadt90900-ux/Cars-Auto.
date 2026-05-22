// apps/web/src/app/[locale]/dashboard/messages/page.tsx
'use client';

import { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';

const conversations = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    avatar: 'AH',
    lastMessage: "Is the Toyota Camry still available?",
    time: '2m',
    unread: 2,
    listing: 'Toyota Camry 2022',
    online: true,
  },
  {
    id: '2',
    name: 'Sara Ali',
    avatar: 'SA',
    lastMessage: 'Can you lower the price a bit?',
    time: '1h',
    unread: 0,
    listing: 'BMW 3 Series 2021',
    online: false,
  },
  {
    id: '3',
    name: 'Omar Khalid',
    avatar: 'OK',
    lastMessage: 'Thank you, I will visit tomorrow.',
    time: '3h',
    unread: 0,
    listing: 'Honda CR-V 2023',
    online: true,
  },
  {
    id: '4',
    name: 'Lana Mahdi',
    avatar: 'LM',
    lastMessage: 'What is the mileage?',
    time: '1d',
    unread: 1,
    listing: 'Mercedes C200 2020',
    online: false,
  },
];

const mockMessages = [
  { id: 1, from: 'them', text: 'Hello! Is the Toyota Camry 2022 still available?', time: '10:30 AM' },
  { id: 2, from: 'me', text: 'Yes, it is still available! Are you interested?', time: '10:32 AM' },
  { id: 3, from: 'them', text: 'Very much so. Can I schedule a viewing this weekend?', time: '10:35 AM' },
  { id: 4, from: 'me', text: 'Absolutely! Saturday afternoon works great for me.', time: '10:36 AM' },
  { id: 5, from: 'them', text: 'Is the Toyota Camry still available?', time: '10:38 AM' },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState<string | null>('1');
  const [input, setInput] = useState('');
  const [showList, setShowList] = useState(true);

  const activeConv = conversations.find((c) => c.id === selected);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Conversations List */}
      <div
        className={`${
          selected && !showList ? 'hidden md:flex' : 'flex'
        } flex-col w-full md:w-80 border-r border-gray-100 dark:border-white/5 bg-white dark:bg-[#0f0f1a]/80 flex-shrink-0`}
      >
        <div className="p-4 border-b border-gray-50 dark:border-white/5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#e94560]/20 focus:border-[#e94560]/40 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => { setSelected(conv.id); setShowList(false); }}
              className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50/50 dark:border-white/3 ${
                selected === conv.id ? 'bg-[#e94560]/5 dark:bg-[#e94560]/8' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e94560] to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {conv.avatar}
                </div>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0f0f1a]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{conv.name}</span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{conv.lastMessage}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#e94560] bg-[#e94560]/10 px-1.5 py-0.5 rounded-md truncate max-w-[140px]">{conv.listing}</span>
                  {conv.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#e94560] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      {selected && activeConv ? (
        <div className={`${showList ? 'hidden md:flex' : 'flex'} flex-col flex-1 bg-gray-50/50 dark:bg-transparent`}>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#0f0f1a]/80">
            <button
              onClick={() => setShowList(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e94560] to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {activeConv.avatar}
              </div>
              {activeConv.online && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0f0f1a]" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{activeConv.name}</p>
              <p className="text-[10px] text-gray-400">{activeConv.online ? 'Online' : 'Offline'} · {activeConv.listing}</p>
            </div>
            <div className="flex items-center gap-1">
              {[Phone, Video, MoreVertical].map((Icon, i) => (
                <button key={i} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.from === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.from === 'me'
                        ? 'bg-[#e94560] text-white rounded-tr-md shadow-lg shadow-[#e94560]/20'
                        : 'bg-white dark:bg-[#0f0f1a]/80 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-tl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0f0f1a]/80">
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setInput('')}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#e94560]/20 focus:border-[#e94560]/40 transition-all"
              />
              <button
                onClick={() => setInput('')}
                className="p-2.5 rounded-xl bg-[#e94560] hover:bg-[#d63d57] text-white transition-colors shadow-lg shadow-[#e94560]/25 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-col flex-1 items-center justify-center text-center text-gray-400 dark:text-gray-600">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-sm font-medium">Select a conversation</p>
        </div>
      )}
    </div>
  );
}
