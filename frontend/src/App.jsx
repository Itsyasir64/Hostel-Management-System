import { useState } from "react";
import {
  ArrowUpRight,
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Residents", icon: Users },
  { label: "Properties", icon: Building2 },
  { label: "Room allocation", icon: BedDouble },
  { label: "Payments", icon: CreditCard },
  { label: "Requests", icon: MessageSquareText, count: 6 },
];

const stats = [
  { label: "Total residents", value: "1,284", change: "+8.2%", note: "vs last month", icon: Users, tone: "mint" },
  { label: "Occupancy rate", value: "86.4%", change: "+3.1%", note: "vs last month", icon: BedDouble, tone: "blue" },
  { label: "Collected this month", value: "$48,620", change: "+12.5%", note: "vs last month", icon: CreditCard, tone: "gold" },
  { label: "Open requests", value: "24", change: "-18.0%", note: "vs last month", icon: ClipboardList, tone: "coral" },
];

const residents = [
  { initials: "AM", name: "Aarav Mehta", room: "Cedar House · 204", status: "Checked in", color: "green", date: "Today, 09:42" },
  { initials: "SK", name: "Sofia Kim", room: "Maple Hall · 118", status: "Payment due", color: "amber", date: "Today, 08:16" },
  { initials: "JL", name: "Jonas Laurent", room: "Oak Residence · 307", status: "Checked in", color: "green", date: "Yesterday" },
  { initials: "NR", name: "Nadia Rahman", room: "Cedar House · 122", status: "Moving out", color: "purple", date: "Yesterday" },
];

const bars = [42, 58, 48, 65, 54, 72, 62, 79, 67, 88, 74, 92];

function App() {
  const [active, setActive] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [period, setPeriod] = useState("Last 12 months");

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={20} strokeWidth={2.4} /></div>
          <span>Lahore Group<span className="brand-dot">.</span></span>
          <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-icon">CH</div>
          <div><strong>Lahore Group of Hostels</strong><span>All properties</span></div>
          <ChevronDown size={15} />
        </div>
        <nav className="primary-nav">
          <span className="nav-caption">Workspace</span>
          {navItems.map(({ label, icon: Icon, count }) => (
            <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => { setActive(label); setMenuOpen(false); }}>
              <Icon size={18} strokeWidth={active === label ? 2.2 : 1.8} />
              <span>{label}</span>{count && <b>{count}</b>}
            </button>
          ))}
          <span className="nav-caption secondary">Manage</span>
          <button className="nav-item"><CalendarDays size={18} /><span>Calendar</span></button>
          <button className="nav-item"><Settings size={18} /><span>Settings</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><div><strong>Need a hand?</strong><span>Visit the help center</span></div><ArrowUpRight size={15} /></div>
          <button className="profile-row"><div className="avatar avatar-profile">YA</div><div className="profile-copy"><strong>Yasir</strong><span>Administrator</span></div><MoreHorizontal size={18} /></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{active}</strong></div>
          <div className="top-actions">
            <div className="search-box"><Search size={17} /><input placeholder="Search anything" /></div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell size={19} /><i /></button>
            {showNotifications && <div className="notification-popover"><strong>Notifications</strong><p><span className="notice-dot" /> 3 payment reminders need review</p><p><span className="notice-dot blue-dot" /> New request from Cedar House</p></div>}
            <div className="top-avatar">ER</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div><p className="eyebrow">Thursday, August 27, 2026</p><h1>Good morning, Yasir <span>✦</span></h1><p className="subheading">Here’s what’s happening across your properties today.</p></div>
            <button className="export-button"><ArrowUpRight size={16} /> Export report</button>
          </section>

          <section className="stats-grid">
            {stats.map(({ label, value, change, note, icon: Icon, tone }) => <article className="stat-card" key={label}><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div className="stat-label">{label}<span className="stat-menu">•••</span></div><div className="stat-value">{value}</div><div className="stat-change"><span className={change.startsWith("-") ? "down" : ""}>{change}</span> {note}</div></article>)}
          </section>

          <section className="dashboard-grid">
            <article className="panel occupancy-panel">
              <div className="panel-header"><div><p className="eyebrow">Capacity overview</p><h2>Occupancy trend</h2></div><div className="select-control"><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 12 months</option><option>Last 6 months</option><option>This year</option></select><ChevronDown size={14} /></div></div>
              <div className="chart-summary"><strong>86.4%</strong><span className="positive"><ArrowUpRight size={15} /> 3.1%</span><small>average occupancy</small></div>
              <div className="chart-wrap"><div className="y-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="bar-chart">{bars.map((height, index) => <div className="bar-column" key={index}><div className="bar-value" style={{ height: `${height}%` }}><span /></div><label>{["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][index]}</label></div>)}</div></div>
            </article>
            <article className="panel property-panel"><div className="panel-header"><div><p className="eyebrow">Across all properties</p><h2>Property snapshot</h2></div><button className="more-button" aria-label="More property options"><MoreHorizontal size={19} /></button></div><div className="property-list"><PropertyRow color="terracotta" name="Cedar House" location="North campus" occupancy="92%" rooms="248 / 270 rooms" /><PropertyRow color="blue" name="Maple Hall" location="East campus" occupancy="84%" rooms="214 / 256 rooms" /><PropertyRow color="olive" name="Oak Residence" location="South campus" occupancy="81%" rooms="186 / 230 rooms" /></div><button className="text-link">View all properties <ArrowUpRight size={15} /></button></article>
          </section>

          <section className="bottom-grid">
            <article className="panel residents-panel"><div className="panel-header"><div><p className="eyebrow">Latest activity</p><h2>Recent residents</h2></div><button className="text-link">View all <ArrowUpRight size={15} /></button></div><div className="table-wrap"><table><thead><tr><th>Resident</th><th>Room</th><th>Status</th><th>Last activity</th><th></th></tr></thead><tbody>{residents.map((resident) => <tr key={resident.name}><td><div className="resident-name"><div className={`avatar avatar-${resident.color}`}>{resident.initials}</div><strong>{resident.name}</strong></div></td><td>{resident.room}</td><td><span className={`status status-${resident.color}`}><span />{resident.status}</span></td><td className="muted">{resident.date}</td><td><button className="row-more" aria-label={`Options for ${resident.name}`}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></article>
            <article className="panel requests-panel"><div className="panel-header"><div><p className="eyebrow">Needs attention</p><h2>Open requests <span className="count-pill">6</span></h2></div><button className="more-button" aria-label="More request options"><MoreHorizontal size={19} /></button></div><div className="request-list"><RequestItem icon={<BedDouble size={17} />} title="Bed maintenance" detail="Maple Hall · Room 118" time="12 min ago" tone="coral" /><RequestItem icon={<CreditCard size={17} />} title="Payment review" detail="Sofia Kim · INV-2048" time="38 min ago" tone="gold" /><RequestItem icon={<MessageSquareText size={17} />} title="Noise complaint" detail="Oak Residence · Room 307" time="1 hr ago" tone="blue" /></div><button className="review-button">Review all requests <ArrowUpRight size={15} /></button></article>
          </section>
          <footer><span>Lahore Group Operations</span><span>Last synced just now <span className="sync-dot" /></span></footer>
        </div>
      </main>
    </div>
  );
}

function PropertyRow({ color, name, location, occupancy, rooms }) { return <div className="property-row"><div className={`property-thumb ${color}`}><Building2 size={19} /></div><div className="property-info"><strong>{name}</strong><span>{location}</span></div><div className="property-occupancy"><strong>{occupancy}</strong><span>{rooms}</span></div></div>; }
function RequestItem({ icon, title, detail, time, tone }) { return <div className="request-item"><div className={`request-icon ${tone}`}>{icon}</div><div className="request-copy"><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div>; }

export default App;
