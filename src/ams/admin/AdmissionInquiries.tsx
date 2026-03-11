import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Inbox, Search, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react'

interface Inquiry {
    id: string
    parent_name: string
    student_name: string
    grade_applying: string
    phone: string
    email: string
    message: string
    status: 'pending' | 'contacted' | 'admitted' | 'rejected'
    created_at: string
}

const STATUS_COLORS = {
    pending: { bg: '#FEF3C7', text: '#92400E', icon: <Clock size={14} /> },
    contacted: { bg: '#DBEAFE', text: '#1E40AF', icon: <Inbox size={14} /> },
    admitted: { bg: '#DCFCE7', text: '#166534', icon: <CheckCircle size={14} /> },
    rejected: { bg: '#FEE2E2', text: '#991B1B', icon: <XCircle size={14} /> },
}

export default function AdmissionInquiries() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    useEffect(() => {
        fetchInquiries()
    }, [])

    const fetchInquiries = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('admission_inquiries')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setInquiries(data as Inquiry[])
        if (error) console.error(error)
        setLoading(false)
    }

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('admission_inquiries')
            .update({ status: newStatus })
            .eq('id', id)

        if (!error) {
            setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus as Inquiry['status'] } : inq))
        } else {
            alert('Failed to update status.')
        }
    }

    const deleteInquiry = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return
        const { error } = await supabase.from('admission_inquiries').delete().eq('id', id)
        if (!error) {
            setInquiries(prev => prev.filter(inq => inq.id !== id))
        }
    }

    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch = (inq.parent_name + inq.student_name + inq.phone + inq.email).toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || inq.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="admin-page">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 className="page-title">Admission Inquiries</h1>
                    <p className="page-subtitle">Manage online admission requests</p>
                </div>
            </header>

            <div className="card" style={{ marginBottom: 24, padding: 16 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or email..."
                            className="form-control"
                            style={{ paddingLeft: 40 }}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="form-control"
                        style={{ width: 180 }}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="admitted">Admitted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Student / Grade</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Parent Contact</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
                            ) : filteredInquiries.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--gray-500)' }}>No inquiries found.</td></tr>
                            ) : (
                                filteredInquiries.map(inq => (
                                    <tr key={inq.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                        <td style={{ padding: '16px 24px', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                            {new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{inq.student_name}</div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: 2 }}>{inq.grade_applying}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{inq.parent_name}</div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: 2 }}>{inq.phone}</div>
                                            {inq.email && <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>{inq.email}</div>}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <select
                                                    value={inq.status}
                                                    onChange={(e) => updateStatus(inq.id, e.target.value)}
                                                    style={{
                                                        appearance: 'none',
                                                        background: STATUS_COLORS[inq.status].bg,
                                                        color: STATUS_COLORS[inq.status].text,
                                                        border: 'none',
                                                        padding: '6px 28px 6px 12px',
                                                        borderRadius: 99,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        textTransform: 'capitalize'
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="admitted">Admitted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: STATUS_COLORS[inq.status].text }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            {inq.message && (
                                                <button
                                                    onClick={() => alert(`Message from ${inq.parent_name}:\n\n${inq.message}`)}
                                                    className="btn btn-outline"
                                                    style={{ padding: '6px 12px', fontSize: '0.75rem', marginRight: 8 }}
                                                >
                                                    View Msg
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteInquiry(inq.id)}
                                                style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontWeight: 600 }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
