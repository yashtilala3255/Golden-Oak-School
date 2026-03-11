import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Search, Mail, Phone, Calendar } from 'lucide-react'

interface ContactMsg {
    id: string
    name: string
    email: string
    phone: string
    subject: string
    message: string
    created_at: string
}

export default function ContactMessages() {
    const [messages, setMessages] = useState<ContactMsg[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setMessages(data as ContactMsg[])
        if (error) console.error(error)
        setLoading(false)
    }

    const deleteMessage = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return
        const { error } = await supabase.from('contact_messages').delete().eq('id', id)
        if (!error) {
            setMessages(prev => prev.filter(msg => msg.id !== id))
        }
    }

    const filteredMessages = messages.filter(msg =>
        (msg.name + msg.email + msg.phone + msg.subject + msg.message).toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="admin-page">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 className="page-title">Contact Messages</h1>
                    <p className="page-subtitle">View and manage message submissions from the website</p>
                </div>
            </header>

            <div className="card" style={{ marginBottom: 24, padding: 16 }}>
                <div style={{ position: 'relative', maxWidth: 400 }}>
                    <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="form-control"
                        style={{ paddingLeft: 40 }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
                ) : filteredMessages.length === 0 ? (
                    <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--gray-500)' }}>
                        No messages found.
                    </div>
                ) : (
                    filteredMessages.map(msg => (
                        <div key={msg.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--green-deep)', marginBottom: 4 }}>
                                        {msg.subject || 'No Subject'}
                                    </h3>
                                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)', fontWeight: 600, fontSize: '0.75rem' }}>
                                                {msg.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{msg.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Mail size={14} /> <a href={`mailto:${msg.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{msg.email}</a>
                                        </div>
                                        {msg.phone && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Phone size={14} /> <a href={`tel:${msg.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{msg.phone}</a>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Calendar size={14} /> {new Date(msg.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteMessage(msg.id)}
                                    style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Delete
                                </button>
                            </div>

                            <div style={{ background: 'var(--gray-50)', padding: 16, borderRadius: 'var(--radius)', color: 'var(--gray-700)', fontSize: '0.9375rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
