import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BedDouble,
  Bell,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok)
    throw new Error(
      (await response.json().catch(() => ({}))).detail || "Request failed",
    );
  return response.status === 204 ? null : response.json();
};
const navItems = [
  ["Overview", LayoutDashboard],
  ["Residents", Users],
  ["Properties", Building2],
  ["Room allocation", BedDouble],
  ["Payments", CreditCard],
  ["Requests", MessageSquareText],
];
const emptyResident = {
  registration_number: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  department: "",
  semester: "",
  address: "",
};

export default function FunctionalApp() {
  const [active, setActive] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState({
    students: [],
    hostels: [],
    rooms: [],
    beds: [],
    allocations: [],
    fees: [],
    payments: [],
    complaints: [],
  });
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [
        students,
        hostels,
        rooms,
        beds,
        allocations,
        fees,
        payments,
        complaints,
      ] = await Promise.all([
        api("/api/students/"),
        api("/api/hostels/"),
        api("/api/rooms/rooms/"),
        api("/api/rooms/beds/"),
        api("/api/rooms/allocations/"),
        api("/api/fees/fees/"),
        api("/api/fees/payments/"),
        api("/api/complaints/"),
      ]);
      setData({
        students,
        hostels,
        rooms,
        beds,
        allocations,
        fees,
        payments,
        complaints,
      });
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };
  const navigate = (label) => {
    setActive(label);
    setMenuOpen(false);
  };
  const openComplaints = data.complaints.filter(
    (item) => item.status !== "resolved" && item.status !== "closed",
  ).length;
  const availableBeds = data.beds.filter(
    (bed) => bed.status === "available",
  ).length;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={20} />
          </div>
          <span>
            Lahore Group<span className="brand-dot">.</span>
          </span>
          <button className="close-menu" onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-icon">LH</div>
          <div>
            <strong>Lahore Group of Hostels</strong>
            <span>All properties</span>
          </div>
          <ChevronDown size={15} />
        </div>
        <nav className="primary-nav">
          <span className="nav-caption">Workspace</span>
          {navItems.map(([label, Icon]) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "active" : ""}`}
              onClick={() => navigate(label)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Requests" && <b>{openComplaints}</b>}
            </button>
          ))}
          <span className="nav-caption secondary">Manage</span>
          <button className="nav-item">
            <CalendarIcon />
            <span>Calendar</span>
          </button>
          <button className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={17} />
            </div>
            <div>
              <strong>Need a hand?</strong>
              <span>Visit the help center</span>
            </div>
            <ArrowUpRight size={15} />
          </div>
          <div className="profile-row">
            <div className="avatar avatar-profile">ER</div>
            <div className="profile-copy">
              <strong>Yasir</strong>
              <span>Administrator</span>
            </div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span>/</span>
            <strong>{active}</strong>
          </div>
          <div className="top-actions">
            <div className="search-box">
              <Search size={17} />
              <input placeholder="Search anything" />
            </div>
            <button className="icon-button">
              <Bell size={19} />
              <i />
            </button>
            <div className="top-avatar">YA</div>
          </div>
        </header>
        <div className="page-content">
          {notice && (
            <div
              className={`toast ${notice.includes("success") ? "success" : ""}`}
            >
              <span>{notice}</span>
              <button onClick={() => setNotice("")}>
                <X size={15} />
              </button>
            </div>
          )}
          {loading ? (
            <div className="loading-state">Loading your workspace...</div>
          ) : (
            <>
              {active === "Overview" && (
                <Overview data={data} navigate={navigate} />
              )}
              {active === "Residents" && (
                <Residents data={data} refresh={load} flash={flash} />
              )}
              {active === "Room allocation" && (
                <Allocations data={data} refresh={load} flash={flash} />
              )}
              {active === "Payments" && (
                <Payments data={data} refresh={load} flash={flash} />
              )}
              {active === "Requests" && (
                <Requests data={data} refresh={load} flash={flash} />
              )}
              {active === "Properties" && (
                <Properties data={data} refresh={load} flash={flash} />
              )}
            </>
          )}
          <footer>
            <span>Lahore Group Operations</span>
            <span>
              Live data <span className="sync-dot" />
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function Overview({ data, navigate }) {
  const occupied = data.beds.filter((bed) => bed.status === "occupied").length;
  const occupancy = data.beds.length
    ? Math.round((occupied / data.beds.length) * 100)
    : 0;
  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Thursday, August 27, 2026</p>
          <h1>
            Good morning, Yasir <span>✦</span>
          </h1>
          <p className="subheading">Your live hostel operations overview.</p>
        </div>
        <button className="export-button" onClick={() => navigate("Residents")}>
          <Plus size={16} /> Add resident
        </button>
      </section>
      <section className="stats-grid">
        <Stat
          label="Total residents"
          value={data.students.length}
          icon={Users}
          tone="mint"
        />
        <Stat
          label="Occupancy rate"
          value={`${occupancy}%`}
          icon={BedDouble}
          tone="blue"
        />
        <Stat
          label="Collected payments"
          value={`PKR ${data.payments.reduce((sum, item) => sum + Number(item.amount || 0), 0).toLocaleString()}`}
          icon={CreditCard}
          tone="gold"
        />
        <Stat
          label="Open requests"
          value={
            data.complaints.filter(
              (item) => item.status === "open" || item.status === "in_progress",
            ).length
          }
          icon={ClipboardList}
          tone="coral"
        />
      </section>
      <section className="dashboard-grid">
        <article className="panel property-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Live inventory</p>
              <h2>Room availability</h2>
            </div>
            <BedDouble size={20} color="#719384" />
          </div>
          <div className="availability-meter">
            <div style={{ width: `${occupancy}%` }} />
          </div>
          <div className="meter-labels">
            <strong>{availableLabel(data, occupied)} beds occupied</strong>
            <span>{data.beds.length - occupied} available</span>
          </div>
          <button
            className="text-link"
            onClick={() => navigate("Room allocation")}
          >
            Manage allocations <ArrowUpRight size={15} />
          </button>
        </article>
        <article className="panel property-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Your portfolio</p>
              <h2>Properties</h2>
            </div>
            <Building2 size={20} color="#719384" />
          </div>
          <div className="property-list">
            {data.hostels.length ? (
              data.hostels.map((hostel) => (
                <div className="property-row" key={hostel.id}>
                  <div className="property-thumb blue">
                    <Building2 size={19} />
                  </div>
                  <div className="property-info">
                    <strong>{hostel.name}</strong>
                    <span>{hostel.address}</span>
                  </div>
                  <div className="property-occupancy">
                    <strong>{hostel.total_rooms} rooms</strong>
                  </div>
                </div>
              ))
            ) : (
              <Empty text="No properties added yet" />
            )}
          </div>
          <button className="text-link" onClick={() => navigate("Properties")}>
            Manage properties <ArrowUpRight size={15} />
          </button>
        </article>
      </section>
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Needs attention</p>
            <h2>Recent requests</h2>
          </div>
          <button className="text-link" onClick={() => navigate("Requests")}>
            View all <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="request-list">
          {data.complaints.slice(0, 3).map((item) => (
            <div className="request-item" key={item.id}>
              <div className="request-icon coral">
                <MessageSquareText size={17} />
              </div>
              <div className="request-copy">
                <strong>{item.subject}</strong>
                <span>Resident #{item.student}</span>
              </div>
              <time>{item.status}</time>
            </div>
          ))}
          {!data.complaints.length && <Empty text="No requests yet" />}
        </div>
      </section>
    </>
  );
}
function availableLabel(data, occupied) {
  return `${occupied}/${data.beds.length || 0}`;
}
function Stat({ label, value, icon: Icon, tone }) {
  return (
    <article className="stat-card compact">
      <div className={`stat-icon ${tone}`}>
        <Icon size={20} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-change">
        <span>Live</span> from database
      </div>
    </article>
  );
}

function Residents({ data, refresh, flash }) {
  const [form, setForm] = useState(emptyResident);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [open, setOpen] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    try {
      let student;
      if (editing) {
        student = await api(`/api/students/${editing.id}/`, {
          method: "PATCH",
          body: JSON.stringify({
            registration_number: form.registration_number,
            father_name: form.father_name || "",
            phone: form.phone,
            department: form.department,
            semester: form.semester || null,
            address: form.address,
          }),
        });
      } else {
        const user = await api("/api/accounts/users/", {
          method: "POST",
          body: JSON.stringify({
            username: form.registration_number,
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            role: "student",
            password: "ChangeMe123!",
          }),
        });
        student = await api("/api/students/", {
          method: "POST",
          body: JSON.stringify({
            ...form,
            user: user.id,
            semester: form.semester || null,
          }),
        });
      }
      setForm(emptyResident);
      setEditing(null);
      setOpen(false);
      await refresh();
      flash("Resident saved successfully");
    } catch (error) {
      flash(error.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this resident record?")) return;
    try {
      await api(`/api/students/${id}/`, { method: "DELETE" });
      await refresh();
      flash("Resident deleted successfully");
    } catch (error) {
      flash(error.message);
    }
  };
  return (
    <CrudPage
      eyebrow="People directory"
      title="Residents"
      action="Add resident"
      onAdd={() => {
        setForm(emptyResident);
        setEditing(null);
        setOpen(true);
      }}
    >
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Room</th>
              <th>Registration</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.students.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="resident-name">
                    <div className="avatar avatar-green">{initials(item.name)}</div>
                    <strong>{item.name}</strong>
                  </div>
                </td>
                <td>{residentRoom(item.id, data) || "Not assigned"}</td>
                <td><strong>{item.registration_number}</strong></td>
                <td>{item.phone || "-"}</td>
                <td>
                  <button className="table-action" onClick={() => setViewing(item)}>View</button>
                  <button
                    className="table-action"
                    onClick={() => {
                      setEditing(item);
                      setForm({
                        ...emptyResident,
                        registration_number: item.registration_number,
                        phone: item.phone,
                        department: item.department,
                        semester: item.semester || "",
                        address: item.address,
                      });
                      setOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="table-action danger"
                    onClick={() => remove(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.students.length && (
          <Empty text="No residents yet. Add the first resident to begin." />
        )}
      </div>
      {open && (
        <ResidentModal
          form={form}
          setForm={setForm}
          submit={submit}
          editing={editing}
          close={() => setOpen(false)}
        />
      )}
      {viewing && <ResidentDetails student={viewing} room={residentRoom(viewing.id, data)} close={() => setViewing(null)} />}
    </CrudPage>
  );
}
function initials(name = "") { return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function residentRoom(studentId, data) {
  const allocation = data.allocations.find((item) => item.student === studentId && item.status === "active");
  if (!allocation) return "";
  const bed = data.beds.find((item) => item.id === allocation.bed);
  const room = bed && data.rooms.find((item) => item.id === bed.room);
  return room ? `Room ${room.room_number} · Bed ${bed.bed_number}` : "";
}
function ResidentDetails({ student, room, close }) {
  return <Modal title="Resident details" close={close}><div className="resident-detail-head"><div className="avatar avatar-green large-avatar">{initials(student.name)}</div><div><h3>{student.name}</h3><span>{student.email || "No email added"}</span></div></div><div className="details-grid"><Detail label="Registration number" value={student.registration_number} /><Detail label="Room" value={room || "Not assigned"} /><Detail label="Phone" value={student.phone || "Not provided"} /><Detail label="Department" value={student.department || "Not provided"} /><Detail label="Semester" value={student.semester || "Not provided"} /><Detail label="Father name" value={student.father_name || "Not provided"} /><Detail label="Address" value={student.address || "Not provided"} wide /></div></Modal>;
}
function Detail({ label, value, wide }) { return <div className={wide ? "detail-item wide" : "detail-item"}><span>{label}</span><strong>{value}</strong></div>; }
function ResidentModal({ form, setForm, submit, editing, close }) {
  const field = (key, label, type = "text") => (
    <label>
      {label}
      <input
        required={key === "registration_number"}
        type={type}
        value={form[key] || ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </label>
  );
  return (
    <Modal title={editing ? "Edit resident" : "Add resident"} close={close}>
      <form className="form-grid" onSubmit={submit}>
        {!editing && (
          <>
            {field("first_name", "First name")}
            {field("last_name", "Last name")}
            {field("email", "Email", "email")}
          </>
        )}
        {field("registration_number", "Registration number")}
        {field("phone", "Phone")}
        {field("department", "Department")}
        {field("semester", "Semester", "number")}
        <label className="full-field">
          Address
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={close}>
            Cancel
          </button>
          <button className="primary-button">
            <Check size={16} /> Save resident
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Allocations({ data, refresh, flash }) {
  const [form, setForm] = useState({
    student: "",
    bed: "",
    check_in_date: new Date().toISOString().slice(0, 10),
  });
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api("/api/rooms/allocations/", {
        method: "POST",
        body: JSON.stringify({ ...form, status: "active" }),
      });
      setForm({
        student: "",
        bed: "",
        check_in_date: new Date().toISOString().slice(0, 10),
      });
      await refresh();
      flash("Room allocation created successfully");
    } catch (error) {
      flash(error.message);
    }
  };
  return (
    <CrudPage eyebrow="Housing operations" title="Room allocation">
      <div className="split-content">
        <form className="entry-form" onSubmit={submit}>
          <h3>Assign a bed</h3>
          <p>
            Select a resident and an available bed to create an active
            allocation.
          </p>
          <label>
            Resident
            <select
              required
              value={form.student}
              onChange={(e) => setForm({ ...form, student: e.target.value })}
            >
              <option value="">Select resident</option>
              {data.students.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.registration_number} · #{item.user}
                </option>
              ))}
            </select>
          </label>
          <label>
            Available bed
            <select
              required
              value={form.bed}
              onChange={(e) => setForm({ ...form, bed: e.target.value })}
            >
              <option value="">Select bed</option>
              {data.beds
                .filter((item) => item.status === "available")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    Bed {item.bed_number} · Room #{item.room}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Check-in date
            <input
              type="date"
              required
              value={form.check_in_date}
              onChange={(e) =>
                setForm({ ...form, check_in_date: e.target.value })
              }
            />
          </label>
          <button className="primary-button">
            <Check size={16} /> Create allocation
          </button>
        </form>
        <RoomSetup data={data} refresh={refresh} flash={flash} />
        <div className="data-list">
          <div className="panel-header">
            <h3>Active allocations</h3>
            <span className="count-pill">{data.allocations.length}</span>
          </div>
          {data.allocations.map((item) => (
            <div className="data-row" key={item.id}>
              <div className="request-icon mint">
                <BedDouble size={17} />
              </div>
              <div>
                <strong>Resident #{item.student}</strong>
                <span>
                  Bed #{item.bed} · {item.check_in_date}
                </span>
              </div>
              <span className="status status-green">
                <span />
                {item.status}
              </span>
            </div>
          ))}
          {!data.allocations.length && (
            <Empty text="No allocations recorded yet" />
          )}
        </div>
      </div>
    </CrudPage>
  );
}

function Payments({ data, refresh, flash }) {
  const [form, setForm] = useState({
    fee: "",
    amount: "",
    payment_method: "cash",
  });
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api("/api/fees/payments/", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          fee: Number(form.fee),
          amount: Number(form.amount),
        }),
      });
      setForm({ fee: "", amount: "", payment_method: "cash" });
      await refresh();
      flash("Payment recorded successfully");
    } catch (error) {
      flash(error.message);
    }
  };
  return (
    <CrudPage eyebrow="Finance desk" title="Payments">
      <div className="split-content">
        <form className="entry-form" onSubmit={submit}>
          <h3>Record a payment</h3>
          <p>Log a payment against an outstanding fee invoice.</p>
          <label>
            Fee invoice
            <select
              required
              value={form.fee}
              onChange={(e) => setForm({ ...form, fee: e.target.value })}
            >
              <option value="">Select invoice</option>
              {data.fees.map((item) => (
                <option key={item.id} value={item.id}>
                  Invoice #{item.id} · PKR {item.amount} · Student #{item.student}
                </option>
              ))}
            </select>
          </label>
          <label>
            Amount
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </label>
          <label>
            Payment method
            <select
              value={form.payment_method}
              onChange={(e) =>
                setForm({ ...form, payment_method: e.target.value })
              }
            >
              <option>cash</option>
              <option>bank transfer</option>
              <option>card</option>
              <option>mobile money</option>
            </select>
          </label>
          <button className="primary-button">
            <Check size={16} /> Save payment
          </button>
        </form>
        <FeeSetup data={data} refresh={refresh} flash={flash} />
        <div className="data-list">
          <div className="panel-header">
            <h3>Payment history</h3>
            <span className="count-pill">{data.payments.length}</span>
          </div>
          {data.payments.map((item) => (
            <div className="data-row" key={item.id}>
              <div className="request-icon gold">
                <CreditCard size={17} />
              </div>
              <div>
                <strong>PKR {item.amount}</strong>
                <span>
                  Invoice #{item.fee} · {item.payment_method}
                </span>
              </div>
              <time>{item.payment_date}</time>
            </div>
          ))}
          {!data.payments.length && <Empty text="No payments recorded yet" />}
        </div>
      </div>
    </CrudPage>
  );
}

function RoomSetup({ data, refresh, flash }) {
  const [room, setRoom] = useState({ hostel: "", room_number: "", floor: 0 });
  const createRoom = async (event) => {
    event.preventDefault();
    try {
      await api("/api/rooms/rooms/", { method: "POST", body: JSON.stringify({ ...room, floor: Number(room.floor), capacity: 2, room_type: "standard" }) });
      setRoom({ hostel: "", room_number: "", floor: 0 });
      await refresh();
      flash("Room created with beds B1 and B2 successfully");
    } catch (error) { flash(error.message); }
  };
  return <form className="entry-form compact-form" onSubmit={createRoom}><h3>Add a room</h3><p>Every room is created with two beds: B1 and B2.</p><label>Property<select required value={room.hostel} onChange={(e) => setRoom({ ...room, hostel: e.target.value })}><option value="">Select property</option>{data.hostels.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Room number<input required value={room.room_number} onChange={(e) => setRoom({ ...room, room_number: e.target.value })} /></label><label>Floor<input type="number" min="0" value={room.floor} onChange={(e) => setRoom({ ...room, floor: e.target.value })} /></label><button className="secondary-button"><Plus size={15} /> Add room with B1 + B2</button></form>;
}

function FeeSetup({ data, refresh, flash }) {
  const [form, setForm] = useState({ student: "", amount: "", due_date: new Date().toISOString().slice(0, 10) });
  const submit = async (event) => { event.preventDefault(); try { await api("/api/fees/fees/", { method: "POST", body: JSON.stringify({ ...form, student: Number(form.student), amount: Number(form.amount), status: "pending" }) }); setForm({ student: "", amount: "", due_date: new Date().toISOString().slice(0, 10) }); await refresh(); flash("Fee invoice created successfully"); } catch (error) { flash(error.message); } };
  return <form className="entry-form compact-form" onSubmit={submit}><h3>Create an invoice</h3><label>Resident<select required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}><option value="">Select resident</option>{data.students.map((item) => <option key={item.id} value={item.id}>{item.registration_number} · #{item.user}</option>)}</select></label><label>Amount (PKR)<input required type="number" min="1" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label><label>Due date<input required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></label><button className="secondary-button"><Plus size={15} /> Create invoice</button></form>;
}

function Requests({ data, refresh, flash }) {
  const update = async (item, status) => {
    try {
      await api(`/api/complaints/${item.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await refresh();
      flash("Request status updated successfully");
    } catch (error) {
      flash(error.message);
    }
  };
  return (
    <CrudPage eyebrow="Service desk" title="Requests">
      <div className="request-list large-list">
        {data.complaints.map((item) => (
          <div className="request-card" key={item.id}>
            <div className="request-icon coral">
              <MessageSquareText size={18} />
            </div>
            <div className="request-copy">
              <strong>{item.subject}</strong>
              <span>Resident #{item.student}</span>
              <p>{item.description}</p>
            </div>
            <select
              value={item.status}
              onChange={(e) => update(item, e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        ))}
        {!data.complaints.length && <Empty text="No requests recorded yet" />}
      </div>
    </CrudPage>
  );
}

function Properties({ data, refresh, flash }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    gender: "mixed",
    total_rooms: 0,
  });
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api("/api/hostels/", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          total_rooms: Number(form.total_rooms),
        }),
      });
      setForm({ name: "", address: "", gender: "mixed", total_rooms: 0 });
      await refresh();
      flash("Property created successfully");
    } catch (error) {
      flash(error.message);
    }
  };
  return (
    <CrudPage eyebrow="Portfolio management" title="Properties">
      <div className="split-content">
        <form className="entry-form" onSubmit={submit}>
          <h3>Add a property</h3>
          <p>Set up a hostel before adding rooms and beds.</p>
          <label>
            Property name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Address
            <textarea
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
          <label>
            Gender
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="mixed">Mixed</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>
            Total rooms
            <input
              type="number"
              min="0"
              value={form.total_rooms}
              onChange={(e) =>
                setForm({ ...form, total_rooms: e.target.value })
              }
            />
          </label>
          <button className="primary-button">
            <Plus size={16} /> Add property
          </button>
        </form>
        <div className="data-list">
          {data.hostels.map((item) => (
            <div className="data-row" key={item.id}>
              <div className="property-thumb blue">
                <Building2 size={18} />
              </div>
              <div>
                <strong>{item.name}</strong>
                <span>{item.address}</span>
              </div>
              <strong>{item.total_rooms} rooms</strong>
            </div>
          ))}
          {!data.hostels.length && <Empty text="No properties yet" />}
        </div>
      </div>
    </CrudPage>
  );
}
function CrudPage({ eyebrow, title, action, onAdd, children }) {
  return (
    <>
      <section className="welcome-row page-title">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="subheading">
            Manage real records in your hostel database.
          </p>
        </div>
        {action && (
          <button className="export-button" onClick={onAdd}>
            <Plus size={16} /> {action}
          </button>
        )}
      </section>
      <section className="panel workspace-panel">{children}</section>
    </>
  );
}
function Modal({ title, close, children }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={close}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Empty({ text }) {
  return <div className="empty-state">{text}</div>;
}
function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
