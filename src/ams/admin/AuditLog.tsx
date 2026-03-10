import { useState, useEffect } from 'react'
import { Loader, AlertCircle, Filter } from 'lucide-react'
import { supabase } from '../../supabaseClient'

interface LogRow {
    id: string; action: string; table_name: string
    actor: string; details: string; created_at: string
}

const ACTION_BADGE: Record<string, string> = {
    INSERT: 'badge-success', UPDATE: 'badge-warning', DELETE: 'badge-danger',
    CREATE: 'badge-success', LOGIN: 'badge-info',
}

export default function AuditLog() {
    const [logs, setLogs] = useState<LogRow[]>([])
    const [loading, setLoading] = useState(true)
    const [actionFilter, setActionFilter] = useState('')
    const [tableFilter, setTableFilter] = useState('')

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true)
            let q = supabase
                .from('audit_logs')
                .select('id, action, table_name, actor, details, created_at')
                .order('created_at', { ascending: false })
                .limit(200)

            if (actionFilter) q = q.eq('action', actionFilter)
            if (tableFilter) q = q.eq('table_name', tableFilter)

            const { data, error } = await q
            if (!error) setLogs(data || [])
            setLoading(false)
        }
        fetchLogs()
    }, [actionFilter, tableFilter])

    const ACTIONS = ['INSERT', 'UPDATE', 'DELETE', 'LOGIN']
    const TABLES = ['students', 'teachers', 'attendance', 'classes', 'profiles']

    const formatTime = (ts: string) =>
        new Date(ts).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Audit Log</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>All system changes tracked in real time</p>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>{logs.length} records</span>
            </div>

            {/* Filters */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '16px 24px', boxShadow: 'var(--shadow)', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
                    <label className="form-label"><Filter size={12} style={{ display: 'inline', marginRight: 4 }} />Action</label>
                    <select className="form-control" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
                        <option value="">All Actions</option>
                        {ACTIONS.map(a => <option key={a}>{a}</option>)}
                    </select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
                    <label className="form-label">Table</label>
                    <select className="form-control" value={tableFilter} onChange={e => setTableFilter(e.target.value)}>
                        <option value="">All Tables</option>
                        {TABLES.map(t => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <button className="btn btn-outline-gold" onClick={() => { setActionFilter(''); setTableFilter('') }}>Clear Filters</button>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div style={{ padding: 48, textAlign: 'center' }}><Loader size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--green-deep)', margin: '0 auto' }} /></div>
                ) : logs.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>
                        <AlertCircle size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                        <p>No audit logs yet.</p>
                        <p style={{ fontSize: '0.8125rem', marginTop: 8 }}>
                            To enable audit logging, create an <code>audit_logs</code> table and database triggers in Supabase.
                        </p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr><th>#</th><th>Action</th><th>Table</th><th>Actor</th><th>Details</th><th>Timestamp</th></tr>
                        </thead>
                        <tbody>
                            {logs.map((log, i) => (
                                <tr key={log.id}>
                                    <td><span style={{ color: 'var(--gray-400)', fontWeight: 600 }}>#{i + 1}</span></td>
                                    <td><span className={`badge ${ACTION_BADGE[log.action] ?? 'badge-info'}`}>{log.action}</span></td>
                                    <td>
                                        <code style={{ background: 'var(--gray-100)', padding: '3px 8px', borderRadius: 4, fontSize: '0.8125rem', color: 'var(--green-deep)' }}>{log.table_name}</code>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.75rem', flexShrink: 0 }}>
                                                {log.actor?.charAt(0) ?? '?'}
                                            </div>
                                            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{log.actor || '—'}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.875rem', color: 'var(--gray-600)', maxWidth: 320 }}>{log.details}</td>
                                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>{formatTime(log.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
