import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Eye, MessageSquare, Image, Bell, Globe, Settings,
    TrendingUp, Loader, Activity, ArrowRight, CheckCircle, Clock, UsersRound
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../../supabaseClient'

interface DayStat { day: string; views: number }
interface Announcement { id: string; title: string; category: string; active: boolean; created_at: string }
interface ContactMsg { id: string; name: string; subject: string; created_at: string }

function dayLabel(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
function lastNDays(n: number) {
    return Array.from({ length: n }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (n - 1 - i))
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    })
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)

    // Counts
    const [pvCount, setPvCount] = useState(0)
    const [pvToday, setPvToday] = useState(0)
    const [msgCount, setMsgCount] = useState(0)
    const [inquiryCount, setInquiryCount] = useState(0)
    const [annCount, setAnnCount] = useState(0)
    const [annActive, setAnnActive] = useState(0)

    // Timeline
    const [dailyViews, setDailyViews] = useState<DayStat[]>([])

    // Recent items
    const [recentAnn, setRecentAnn] = useState<Announcement[]>([])
    const [recentMsg, setRecentMsg] = useState<ContactMsg[]>([])

    useEffect(() => {
        const load = async () => {
            const since7 = new Date(); since7.setDate(since7.getDate() - 7)
            const since30 = new Date(); since30.setDate(since30.getDate() - 30)
            const todayISO = new Date().toISOString().split('T')[0]

            const [pvAll, pvTodayRes, msgRes, galleryRes, annRes, recentMsgRes] = await Promise.all([
                supabase.from('page_views').select('created_at').gte('created_at', since30.toISOString()),
                supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', `${todayISO}T00:00:00`),
                supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
                supabase.from('admission_inquiries').select('id', { count: 'exact', head: true }),
                supabase.from('announcements').select('id,title,category,active,created_at').order('created_at', { ascending: false }).limit(5),
                supabase.from('contact_messages').select('id,name,subject,created_at').order('created_at', { ascending: false }).limit(5),
            ])

            setPvCount((pvAll.data ?? []).length)
            setPvToday(pvTodayRes.count ?? 0)
            setMsgCount(msgRes.count ?? 0)
            setInquiryCount(galleryRes.count ?? 0)

            const anns: Announcement[] = annRes.data ?? []
            setAnnCount(anns.length)
            setAnnActive(anns.filter(a => a.active).length)
            setRecentAnn(anns)
            setRecentMsg(recentMsgRes.data ?? [])

            // Build 7-day chart
            const days = lastNDays(7)
            const pvRows = pvAll.data ?? []
            const chartData: DayStat[] = days.map(d => ({
                day: d,
                views: pvRows.filter(r => dayLabel(r.created_at) === d).length,
            }))
            setDailyViews(chartData)

            setLoading(false)
        }
        load()
    }, [])

    const now = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const STAT_CARDS = [
        { label: 'Page Views (30d)', value: pvCount, sub: `${pvToday} today`, icon: <Eye size={22} />, color: '#2D6A4F', pale: '#F0FDF4', link: '/ams/admin/analytics' },
        { label: 'Admission Inquiries', value: inquiryCount, sub: 'Total applications', icon: <UsersRound size={22} />, color: '#7C3AED', pale: '#F5F3FF', link: '/ams/admin/inquiries' },
        { label: 'Contact Messages', value: msgCount, sub: 'Total inquiries', icon: <MessageSquare size={22} />, color: '#0EA5E9', pale: '#F0F9FF', link: '/ams/admin/messages' },
        { label: 'Announcements', value: annActive, sub: `${annCount} total, ${annActive} active`, icon: <Bell size={22} />, color: '#C9A84C', pale: '#FFFBEB', link: '/ams/admin/website' },
    ]

    const QUICK_LINKS = [
        { label: 'Manage Website Content', desc: 'Edit logo, hero text, about, gallery', icon: <Globe size={20} />, to: '/ams/admin/website', color: 'var(--green-deep)' },
        { label: 'Website Analytics', desc: 'Traffic, top pages, devices', icon: <TrendingUp size={20} />, to: '/ams/admin/analytics', color: '#3B82F6' },
        { label: 'Audit Log', desc: 'Track all admin actions', icon: <Activity size={20} />, to: '/ams/admin/audit', color: '#7C3AED' },
        { label: 'Site Settings', desc: 'School name, logo, contact, map', icon: <Settings size={20} />, to: '/ams/admin/website', color: '#C9A84C' },
    ]

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--green-deep)', fontWeight: 700 }}>Dashboard Overview</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 4 }}>
                        Golden Oak School · {now}
                    </p>
                </div>
                {!loading && pvToday > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 'var(--radius-full)', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', fontSize: '0.8125rem', fontWeight: 600 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                        {pvToday} visitor{pvToday !== 1 ? 's' : ''} today
                    </div>
                )}
            </div>

            {loading ? (
                <div style={{ padding: 80, textAlign: 'center' }}>
                    <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--green-deep)', margin: '0 auto' }} />
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
                        {STAT_CARDS.map((s, i) => (
                            <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.07}s`, borderTop: `3px solid ${s.color}`, cursor: s.link ? 'pointer' : 'default' }}
                                onClick={() => s.link && (window.location.href = s.link)}>
                                <div className="stat-icon" style={{ background: s.pale, color: s.color }}>{s.icon}</div>
                                <div>
                                    <div className="stat-number">{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2 }}>{s.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart + Quick Links */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, marginBottom: 24 }}>
                        {/* 7-day page views area chart */}
                        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <div style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '1rem' }}>Website Traffic (Last 7 Days)</div>
                                <Link to="/ams/admin/analytics" style={{ fontSize: '0.8125rem', color: 'var(--green-mid)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Full analytics <ArrowRight size={13} /></Link>
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 20 }}>Page views per day (real tracking)</div>
                            {pvCount === 0 ? (
                                <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--gray-400)' }}>
                                    <Eye size={36} style={{ opacity: 0.3 }} />
                                    <span style={{ fontSize: '0.875rem' }}>No visits recorded yet — visit the public website to start tracking</span>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={dailyViews} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gDash" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.25} />
                                                <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="views" name="Page Views" stroke="#2D6A4F" strokeWidth={2.5} fill="url(#gDash)" dot={{ r: 4, fill: '#2D6A4F' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)' }}>
                            <div style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 4, fontSize: '1rem' }}>Quick Actions</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 20 }}>Jump to common admin tasks</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {QUICK_LINKS.map((q, i) => (
                                    <Link key={i} to={q.to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-100)', textDecoration: 'none', transition: 'all 0.18s', background: 'var(--gray-50)' }}
                                        onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = q.color; (e.currentTarget as HTMLElement).style.borderColor = q.color; (e.currentTarget as HTMLElement).querySelectorAll('span, div').forEach(el => ((el as HTMLElement).style.color = 'white')) }}
                                        onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gray-50)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-100)'; (e.currentTarget as HTMLElement).querySelectorAll('span, div').forEach(el => ((el as HTMLElement).style.color = '')) }}
                                    >
                                        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${q.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: q.color, flexShrink: 0 }}>{q.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{q.label}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{q.desc}</div>
                                        </div>
                                        <ArrowRight size={15} style={{ color: 'var(--gray-300)', flexShrink: 0 }} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Announcements + Contact Messages */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Recent Announcements */}
                        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: 700, color: 'var(--green-deep)' }}>Recent Announcements</div>
                                <Link to="/ams/admin/website" style={{ fontSize: '0.8125rem', color: 'var(--green-mid)', fontWeight: 600, textDecoration: 'none' }}>Manage →</Link>
                            </div>
                            {recentAnn.length === 0 ? (
                                <div style={{ padding: '28px 24px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>No announcements yet.</div>
                            ) : recentAnn.map((a, i) => (
                                <div key={i} style={{ padding: '14px 24px', borderBottom: '1px solid var(--gray-50)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.active ? '#22C55E' : '#D1D5DB', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Clock size={11} /> {new Date(a.created_at).toLocaleDateString('en-IN')} · {a.category}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: a.active ? '#DCFCE7' : '#F3F4F6', color: a.active ? '#166534' : '#6B7280', flexShrink: 0 }}>
                                        {a.active ? 'Live' : 'Hidden'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Recent Contact Messages */}
                        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: 700, color: 'var(--green-deep)' }}>Recent Contact Messages</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#92400E', borderRadius: 99, padding: '2px 10px', fontWeight: 600 }}>{msgCount} total</span>
                                    <Link to="/ams/admin/messages" style={{ fontSize: '0.8125rem', color: 'var(--green-mid)', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
                                </div>
                            </div>
                            {recentMsg.length === 0 ? (
                                <div style={{ padding: '28px 24px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                                    <CheckCircle size={28} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                                    <br />No contact messages yet.
                                </div>
                            ) : recentMsg.map((m, i) => (
                                <div key={i} style={{ padding: '14px 24px', borderBottom: '1px solid var(--gray-50)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green-mid),var(--green-deep))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                                        {m.name?.charAt(0)?.toUpperCase() ?? '?'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-800)' }}>{m.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', flexShrink: 0 }}>{new Date(m.created_at).toLocaleDateString('en-IN')}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
