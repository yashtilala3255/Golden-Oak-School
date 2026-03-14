import { useState, useEffect } from 'react'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
    TrendingUp, TrendingDown, Users, Eye, MousePointerClick,
    Clock, Globe, Monitor, Smartphone, Tablet, Loader, RefreshCw
} from 'lucide-react'
import { supabase } from '../../supabaseClient'

/* ── Types ─────────────────────────────────────────────────── */
interface PageViewRow { page: string; device: string; source: string; created_at: string }
interface DayStat { day: string; visits: number; pageViews: number }
interface PageStat { page: string; views: number; pct: number }
interface DeviceStat { name: string; value: number; color: string }
interface SourceStat { source: string; visits: number; color: string }

const PAGE_LABELS: Record<string, string> = {
    '/': '/ (Home)',
    '/about': '/about',
    '/academics': '/academics',
    '/admissions': '/admissions',
    '/facilities': '/facilities',
    '/gallery': '/gallery',
    '/contact': '/contact',
}

const DEVICE_COLORS: Record<string, string> = {
    mobile: '#2D6A4F',
    desktop: '#C9A84C',
    tablet: '#3B82F6',
}

const SOURCE_COLORS: Record<string, string> = {
    direct: '#2D6A4F',
    google: '#EA4335',
    facebook: '#1877F2',
    instagram: '#E1306C',
    youtube: '#FF0000',
    whatsapp: '#25D366',
}

/** Returns a label for the last N days as 'd Mon' */
function lastNDays(n: number): string[] {
    return Array.from({ length: n }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (n - 1 - i))
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    })
}

function dayKey(isoDate: string) {
    const d = new Date(isoDate)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function Analytics() {
    const [period, setPeriod] = useState<7 | 30>(7)
    const [rows, setRows] = useState<PageViewRow[]>([])
    const [loading, setLoading] = useState(true)
    const [contactCount, setContactCount] = useState(0)
    const [admissionCount, setAdmissionCount] = useState(0)

    const fetchData = async (days: number) => {
        setLoading(true)
        const since = new Date()
        since.setDate(since.getDate() - days)

        const [pvRes, ccRes, acRes] = await Promise.all([
            supabase.from('page_views').select('page,device,source,created_at').gte('created_at', since.toISOString()),
            supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
            supabase.from('admission_inquiries').select('id', { count: 'exact', head: true }),
        ])

        setRows(pvRes.data as PageViewRow[] ?? [])
        setContactCount(ccRes.count ?? 0)
        setAdmissionCount(acRes.count ?? 0)
        setLoading(false)
    }

    useEffect(() => { fetchData(period) }, [period])

    /* ── Aggregations ─────────────────────────────────────── */
    const totalPageViews = rows.length
    const days = lastNDays(period)

    // Daily chart
    const dailyMap: Record<string, { visits: Set<string>; views: number }> = {}
    days.forEach(d => { dailyMap[d] = { visits: new Set(), views: 0 } })
    rows.forEach(r => {
        const k = dayKey(r.created_at)
        if (dailyMap[k]) {
            dailyMap[k].views++
            // Use page+device as a rough "session" proxy
            dailyMap[k].visits.add(r.device + r.created_at.slice(0, 13))
        }
    })
    const dailyData: DayStat[] = days.map(d => ({
        day: d,
        visits: dailyMap[d]?.visits.size ?? 0,
        pageViews: dailyMap[d]?.views ?? 0,
    }))

    const totalVisits = dailyData.reduce((s, d) => s + d.visits, 0)
    const avgPages = totalVisits > 0 ? (totalPageViews / totalVisits).toFixed(1) : '0'

    // Top pages
    const pageMap: Record<string, number> = {}
    rows.forEach(r => { pageMap[r.page] = (pageMap[r.page] ?? 0) + 1 })
    const topPages: PageStat[] = Object.entries(pageMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([page, views], _, arr) => ({
            page: PAGE_LABELS[page] ?? page,
            views,
            pct: arr[0][1] > 0 ? Math.round(views / arr[0][1] * 100) : 0,
        }))

    // Devices
    const devMap: Record<string, number> = {}
    rows.forEach(r => { devMap[r.device] = (devMap[r.device] ?? 0) + 1 })
    const deviceData: DeviceStat[] = Object.entries(devMap).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: totalPageViews > 0 ? Math.round(count / totalPageViews * 100) : 0,
        color: DEVICE_COLORS[name] ?? '#9CA3AF',
    }))

    // Sources
    const srcMap: Record<string, number> = {}
    rows.forEach(r => { srcMap[r.source] = (srcMap[r.source] ?? 0) + 1 })
    const sourceData: SourceStat[] = Object.entries(srcMap)
        .sort((a, b) => b[1] - a[1])
        .map(([source, visits]) => ({
            source: source.charAt(0).toUpperCase() + source.slice(1),
            visits,
            color: SOURCE_COLORS[source] ?? '#9CA3AF',
        }))

    /* ── Stat cards ─────────────────────────────────────── */
    const STATS = [
        { label: 'Page Views', value: totalPageViews, sub: `Last ${period} days`, up: true, icon: <Eye size={22} />, color: 'var(--green-deep)', pale: 'var(--green-pale)' },
        { label: 'Sessions (approx.)', value: totalVisits, sub: 'Unique hour-device combos', up: true, icon: <Users size={22} />, color: 'var(--gold-dark)', pale: 'var(--gold-pale)' },
        { label: 'Pages / Session', value: avgPages, sub: 'Avg pages per visit', up: true, icon: <MousePointerClick size={22} />, color: '#3B82F6', pale: '#EFF6FF' },
        { label: 'Top Device', value: deviceData[0]?.name ?? '—', sub: `${deviceData[0]?.value ?? 0}% of traffic`, up: true, icon: <Monitor size={22} />, color: '#7C3AED', pale: '#F5F3FF' },
        { label: 'Contact Inquiries', value: contactCount, sub: 'Via contact form (all time)', up: true, icon: <Globe size={22} />, color: '#0EA5E9', pale: '#F0F9FF' },
        { label: 'Admission Requests', value: admissionCount, sub: 'Form fills (all time)', up: true, icon: <Clock size={22} />, color: '#DC2626', pale: '#FEF2F2' },
    ]

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Website Analytics</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>
                        {loading ? 'Loading…' : `${totalPageViews.toLocaleString()} page views in the last ${period} days`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 6, background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', padding: 4 }}>
                        {([7, 30] as const).map(p => (
                            <button key={p} onClick={() => setPeriod(p)} style={{ padding: '6px 18px', borderRadius: 'var(--radius-full)', border: 'none', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', background: period === p ? 'var(--green-deep)' : 'transparent', color: period === p ? 'white' : 'var(--gray-500)', transition: 'all 0.2s' }}>
                                {p === 7 ? '7 Days' : '30 Days'}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => fetchData(period)} style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--gray-200)', background: 'var(--white)', color: 'var(--gray-500)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem' }}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: 80, textAlign: 'center' }}>
                    <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--green-deep)', margin: '0 auto' }} />
                    <p style={{ color: 'var(--gray-400)', marginTop: 16, fontSize: '0.875rem' }}>Loading analytics data…</p>
                </div>
            ) : totalPageViews === 0 ? (
                <div style={{ padding: 80, textAlign: 'center', background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>📊</div>
                    <h3 style={{ color: 'var(--green-deep)', fontFamily: 'var(--font-serif)', marginBottom: 8 }}>No data yet</h3>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', maxWidth: 420, margin: '0 auto' }}>
                        Visit the public website pages (Home, About, Gallery…) in a browser. Every page visit will be logged here automatically.
                    </p>
                </div>
            ) : (
                <>
                    {/* Stat Cards — 3 col → 2 col → 1 col */}
                    <div className="admin-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                        {STATS.map((s, i) => (
                            <div key={i} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow)', borderTop: `3px solid ${s.color}`, display: 'flex', gap: 14, alignItems: 'center' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: s.pale, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{s.label}</div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                                    <div style={{ fontSize: '0.75rem', color: s.up ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {s.sub}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Daily Area Chart */}
                    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)', marginBottom: 24 }}>
                        <div style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 2 }}>Daily Page Views</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 20 }}>Every page load recorded from real visitors</div>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={dailyData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.8125rem' }} />
                                <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#2D6A4F" strokeWidth={2.5} fill="url(#gViews)" dot={{ r: 4, fill: '#2D6A4F' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Pages + Device Split — 2 col → 1 col */}
                    <div className="admin-2col-chart" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 24 }}>
                        {/* Top Pages */}
                        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)' }}>
                            <div style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 2 }}>Top Pages</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 20 }}>Most visited pages (real data)</div>
                            {topPages.length === 0 ? (
                                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>No page views yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {topPages.map((p, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '72%' }}>{p.page}</span>
                                                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--green-deep)', flexShrink: 0 }}>{p.views}</span>
                                                </div>
                                                <div style={{ height: 5, borderRadius: 99, background: 'var(--gray-100)' }}>
                                                    <div style={{ height: '100%', width: `${p.pct}%`, borderRadius: 99, background: i === 0 ? 'var(--green-deep)' : i < 3 ? 'var(--gold)' : 'var(--gray-300)', transition: 'width 0.6s ease' }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Device Split */}
                        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)' }}>
                            <div style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 2 }}>Device Breakdown</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 16 }}>How visitors access the site (real)</div>
                            {deviceData.length > 0 ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <PieChart width={180} height={180}>
                                            <Pie data={deviceData} cx={85} cy={85} innerRadius={50} outerRadius={82} paddingAngle={3} dataKey="value">
                                                {deviceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                            </Pie>
                                            <Tooltip formatter={(v: unknown) => [`${v}%`]} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                                        </PieChart>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                                        {deviceData.map((d, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                                                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        {d.name === 'Mobile' && <Smartphone size={14} />}
                                                        {d.name === 'Desktop' && <Monitor size={14} />}
                                                        {d.name === 'Tablet' && <Tablet size={14} />}
                                                        {d.name}
                                                    </span>
                                                </div>
                                                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-800)' }}>{d.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>No data yet.</p>}
                        </div>
                    </div>

                    {/* Traffic Sources */}
                    {sourceData.length > 0 && (
                        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)', marginBottom: 24 }}>
                            <div style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 2 }}>Traffic Sources</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 20 }}>Where visitors came from (based on referrer)</div>
                            <ResponsiveContainer width="100%" height={Math.max(160, sourceData.length * 44)}>
                                <BarChart data={sourceData} layout="vertical" margin={{ left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <YAxis type="category" dataKey="source" tick={{ fontSize: 12, fill: '#4B5563' }} axisLine={false} tickLine={false} width={100} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="visits" name="Views" radius={[0, 4, 4, 0]}>
                                        {sourceData.map((s, i) => <Cell key={i} fill={s.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </>
            )}

            {/* Footer note */}
            <div style={{ marginTop: 16, padding: '14px 20px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg,var(--green-pale),#FFFBEB)', border: '1px solid var(--gold-light)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <Globe size={18} style={{ color: 'var(--gold-dark)', flexShrink: 0 }} />
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', margin: 0 }}>
                    <strong style={{ color: 'var(--green-deep)' }}>Live tracking active.</strong> Every public page visit is automatically logged to Supabase.
                    Session count is approximated (unique device+hour combos). For IP-based unique visitors, consider adding <strong>Plausible.io</strong> or <strong>Google Analytics 4</strong>.
                </p>
            </div>
        </div>
    )
}
