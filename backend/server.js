<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nexara — Staff Panel</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#0a0a0f; --surface:#12121a; --border:#1e1e2e;
      --accent:#7c3aed; --accent2:#06b6d4; --text:#e2e2f0;
      --muted:#6b6b8a; --danger:#ef4444; --success:#22c55e;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
    }

    header {
      display:flex; justify-content:space-between; align-items:center;
      padding:14px 28px;
      background:var(--surface);
      border-bottom:1px solid var(--border);
    }
    .logo { font-family:Syne; font-weight:800; }

    .container {
      max-width:1100px;
      margin:0 auto;
      padding:30px 20px;
    }

    h1 { font-family:Syne; margin-bottom:6px; }
    .subtitle { color:var(--muted); font-size:0.8rem; margin-bottom:25px; }

    .section {
      background:var(--surface);
      border:1px solid var(--border);
      border-radius:12px;
      margin-bottom:20px;
      overflow:hidden;
    }
    .section-header {
      padding:16px;
      border-bottom:1px solid var(--border);
      display:flex;
      justify-content:space-between;
      align-items:center;
    }
    .section-header strong { font-family:Syne; }

    table { width:100%; border-collapse:collapse; }
    th, td {
      padding:12px;
      border-bottom:1px solid #1a1a25;
      font-size:0.8rem;
      text-align:left;
    }
    th { color:var(--muted); font-size:0.7rem; text-transform:uppercase; }

    .badge {
      padding:3px 8px;
      border-radius:20px;
      font-size:0.7rem;
      font-weight:600;
    }
    .pending   { background:rgba(250,204,21,0.15); color:#facc15; }
    .resolved  { background:rgba(34,197,94,0.15);  color:var(--success); }
    .dismissed { background:rgba(107,107,138,0.15);color:var(--muted); }

    .role-badge {
      padding:2px 8px;
      border-radius:20px;
      font-size:0.68rem;
      font-weight:700;
      text-transform:uppercase;
    }
    .role-founder   { background:rgba(250,204,21,0.2);  color:#facc15; }
    .role-manager   { background:rgba(249,115,22,0.2);  color:#f97316; }
    .role-admin     { background:rgba(239,68,68,0.2);   color:#f87171; }
    .role-moderator { background:rgba(59,130,246,0.2);  color:#60a5fa; }
    .role-vip       { background:rgba(168,85,247,0.2);  color:#c084fc; }
    .role-user      { background:rgba(107,107,138,0.15);color:var(--muted); }

    .action-btns { display:flex; gap:6px; flex-wrap:wrap; }

    button {
      cursor:pointer;
      border:none;
      padding:6px 10px;
      border-radius:6px;
      font-size:0.75rem;
      font-family:inherit;
      transition: opacity 0.15s;
    }
    button:hover { opacity:0.85; }
    button:disabled { opacity:0.4; cursor:not-allowed; }

    .btn-resolve  { background:rgba(34,197,94,0.2);  color:var(--success); }
    .btn-dismiss  { background:rgba(107,107,138,0.15);color:var(--muted); }
    .btn-ban      { background:rgba(239,68,68,0.2);  color:#f87171; }
    .btn-unban    { background:rgba(34,197,94,0.2);  color:var(--success); }
    .btn-chats    { background:rgba(6,182,212,0.15); color:var(--accent2); }
    .btn-role     { background:rgba(124,58,237,0.15);color:#a78bfa; }
    .btn-search   { background:var(--accent); color:#fff; padding:8px 16px; }

    .search {
      display:flex;
      gap:10px;
      padding:12px;
      border-bottom:1px solid var(--border);
    }
    input {
      flex:1;
      padding:8px 12px;
      background:var(--bg);
      border:1px solid var(--border);
      color:var(--text);
      border-radius:8px;
      font-family:inherit;
      font-size:0.85rem;
      outline:none;
    }
    input:focus { border-color:var(--accent); }

    select {
      background:var(--bg);
      border:1px solid var(--border);
      color:var(--text);
      padding:6px 8px;
      border-radius:6px;
      font-family:inherit;
      font-size:0.75rem;
    }

    .empty { padding:20px; text-align:center; color:var(--muted); font-size:0.8rem; }

    #access { display:none; text-align:center; padding:60px; color:var(--danger); }

    /* Chat modal */
    .modal-overlay {
      display:none;
      position:fixed; inset:0; z-index:100;
      background:rgba(0,0,0,0.7);
      align-items:center; justify-content:center;
    }
    .modal-overlay.open { display:flex; }
    .modal {
      background:var(--surface);
      border:1px solid var(--border);
      border-radius:16px;
      padding:24px;
      max-width:500px;
      width:90%;
      max-height:70vh;
      display:flex;
      flex-direction:column;
    }
    .modal h3 { font-family:Syne; margin-bottom:14px; }
    .chat-log {
      flex:1;
      overflow-y:auto;
      display:flex;
      flex-direction:column;
      gap:8px;
      margin-bottom:14px;
    }
    .chat-log::-webkit-scrollbar { width:4px; }
    .chat-log::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }
    .chat-entry {
      padding:8px 12px;
      background:var(--bg);
      border:1px solid var(--border);
      border-radius:8px;
      font-size:0.8rem;
      line-height:1.4;
    }
    .chat-entry .who { color:var(--accent2); font-size:0.7rem; margin-bottom:2px; }
    .modal-close {
      background:var(--bg);
      border:1px solid var(--border);
      color:var(--text);
      padding:8px 20px;
      border-radius:8px;
      align-self:flex-end;
    }
  </style>
</head>

<body>

<header>
  <div class="logo">Nexara</div>
  <a href="chat.html" style="color:var(--muted); text-decoration:none; font-size:0.85rem;">← Back to Chat</a>
</header>

<div id="access">
  <h2>Access Denied</h2>
  <p style="color:var(--muted);margin-top:10px;font-size:0.85rem;">You don't have permission to view this page.</p>
</div>

<div class="container" id="app" style="display:none">
  <h1>Staff Dashboard</h1>
  <div class="subtitle" id="sub">Loading…</div>

  <!-- Reports -->
  <div class="section">
    <div class="section-header">
      <strong>Reports</strong>
      <button onclick="loadReports()" style="background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:5px 10px;border-radius:6px;font-size:0.75rem;">↻ Refresh</button>
    </div>
    <div id="reports"><div class="empty">Loading…</div></div>
  </div>

  <!-- User Search -->
  <div class="section">
    <div class="section-header">
      <strong>User Search</strong>
    </div>
    <div class="search">
      <input id="searchInput" placeholder="Search by username or email…" onkeydown="if(event.key==='Enter')searchUsers()"/>
      <button class="btn-search" onclick="searchUsers()">Search</button>
    </div>
    <div id="users"></div>
  </div>
</div>

<!-- Chat log modal -->
<div class="modal-overlay" id="chat-modal">
  <div class="modal">
    <h3>Recent Messages</h3>
    <div class="chat-log" id="chat-log-content"></div>
    <button class="modal-close" onclick="closeChatModal()">Close</button>
  </div>
</div>

<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, getDocs,
  collection, query, where, orderBy, limit,
  updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { firebaseConfig } from "./js/config.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

const STAFF = ["moderator","admin","manager","founder"];
const CAN_BAN = ["admin","manager","founder"];
const CAN_ROLE = ["manager","founder"];
const ALL_ROLES = ["user","vip","moderator","admin","manager","founder"];

let me = null;

function roleBadge(role) {
  if (!role) return "";
  return `<span class="role-badge role-${role}">${role}</span>`;
}

/* ── Auth ── */
onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "index.html";

  const snap = await getDoc(doc(db, "users", user.uid));
  me = snap.data();

  if (!me || !STAFF.includes(me.role)) {
    document.getElementById("access").style.display = "block";
    return;
  }

  document.getElementById("app").style.display = "block";
  document.getElementById("sub").innerHTML =
    `Logged in as <b>${me.displayName}</b> ${roleBadge(me.role)}`;

  loadReports();
});

/* ── Reports ── */
async function loadReports() {
  document.getElementById("reports").innerHTML = `<div class="empty">Loading…</div>`;

  try {
    const q = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snap = await getDocs(q);
    const reports = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (!reports.length) {
      document.getElementById("reports").innerHTML = `<div class="empty">No reports yet.</div>`;
      return;
    }

    document.getElementById("reports").innerHTML = `
      <table>
        <tr>
          <th>Reason</th>
          <th>Reporter</th>
          <th>Reported</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        ${reports.map(r => `
          <tr>
            <td>${r.reason || "—"}</td>
            <td>${r.reporterName || r.reporterId?.slice(0,8) || "—"}</td>
            <td>${r.reportedUserName || r.reportedSocketId || "—"}</td>
            <td><span class="badge ${r.status || 'pending'}">${r.status || "pending"}</span></td>
            <td>
              <div class="action-btns">
                ${r.reporterId && r.reportedUserId ? `
                  <button class="btn-chats" onclick="viewChats('${r.reporterId}','${r.reportedUserId}')">Chats</button>
                ` : ""}
                ${r.status === "pending" ? `
                  <button class="btn-resolve" onclick="setStatus('${r.id}','resolved')">Resolve</button>
                  <button class="btn-dismiss" onclick="setStatus('${r.id}','dismissed')">Dismiss</button>
                ` : ""}
                ${CAN_BAN.includes(me.role) && r.reportedUserId ? `
                  <button class="btn-ban" onclick="banUser('${r.reportedUserId}', '${r.id}')">Ban User</button>
                ` : ""}
              </div>
            </td>
          </tr>
        `).join("")}
      </table>
    `;
  } catch (e) {
    document.getElementById("reports").innerHTML = `<div class="empty" style="color:var(--danger)">Error loading reports: ${e.message}</div>`;
  }
}

window.loadReports = loadReports;

/* ── Set report status ── */
window.setStatus = async (id, status) => {
  await updateDoc(doc(db, "reports", id), {
    status,
    resolvedBy: me.displayName,
    resolvedAt: serverTimestamp()
  });
  loadReports();
};

/* ── Ban user ── */
window.banUser = async (uid, reportId) => {
  if (!uid || !CAN_BAN.includes(me.role)) return;
  if (!confirm("Ban this user? They will be signed out immediately.")) return;

  await updateDoc(doc(db, "users", uid), { banned: true });

  // Auto-resolve the report if given
  if (reportId) {
    await updateDoc(doc(db, "reports", reportId), {
      status: "resolved",
      resolvedBy: me.displayName,
      resolvedAt: serverTimestamp()
    });
  }
  loadReports();
};

/* ── Search Users ── */
window.searchUsers = async () => {
  const val = document.getElementById("searchInput").value.trim();   // ← was broken
  if (!val) return;

  document.getElementById("users").innerHTML = `<div class="empty">Searching…</div>`;

  try {
    // Try display name first, then email
    let results = [];

    const byName = await getDocs(query(
      collection(db, "users"),
      where("displayName", "==", val),
      limit(10)
    ));
    results = [...byName.docs];

    if (!results.length) {
      const byEmail = await getDocs(query(
        collection(db, "users"),
        where("email", "==", val),
        limit(10)
      ));
      results = [...byEmail.docs];
    }

    if (!results.length) {
      document.getElementById("users").innerHTML = `<div class="empty">No users found.</div>`;
      return;
    }

    document.getElementById("users").innerHTML = `
      <table>
        <tr>
          <th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
        </tr>
        ${results.map(d => {
          const u = d.data();
          return `
            <tr>
              <td><b>${u.displayName || "—"}</b></td>
              <td>${u.email || "—"}</td>
              <td>${roleBadge(u.role || "user")}</td>
              <td>${u.banned
                ? `<span style="color:var(--danger);font-size:0.75rem">Banned</span>`
                : `<span style="color:var(--success);font-size:0.75rem">Active</span>`}</td>
              <td>
                <div class="action-btns">
                  ${CAN_BAN.includes(me.role) ? (
                    u.banned
                      ? `<button class="btn-unban" onclick="toggleBan('${d.id}', false)">Unban</button>`
                      : `<button class="btn-ban"   onclick="toggleBan('${d.id}', true)">Ban</button>`
                  ) : ""}
                  ${CAN_ROLE.includes(me.role) ? `
                    <select onchange="changeRole('${d.id}', this.value)">
                      ${ALL_ROLES.map(r =>
                        `<option value="${r}" ${r === (u.role||"user") ? "selected" : ""}>${r}</option>`
                      ).join("")}
                    </select>
                    <button class="btn-role" onclick="changeRoleFromSelect('${d.id}', this)">Set Role</button>
                  ` : ""}
                </div>
              </td>
            </tr>
          `;
        }).join("")}
      </table>
    `;
  } catch (e) {
    document.getElementById("users").innerHTML = `<div class="empty" style="color:var(--danger)">Error: ${e.message}</div>`;
  }
};

/* ── Ban / Unban ── */
window.toggleBan = async (uid, ban) => {
  if (!CAN_BAN.includes(me.role)) return;
  if (ban && !confirm("Ban this user?")) return;
  await updateDoc(doc(db, "users", uid), { banned: ban });
  searchUsers();
};

/* ── Role change ── */
window.changeRole = (uid, role) => {
  // Just stores selection — actual write via Set Role button
  window._pendingRoles = window._pendingRoles || {};
  window._pendingRoles[uid] = role;
};

window.changeRoleFromSelect = async (uid, btn) => {
  if (!CAN_ROLE.includes(me.role)) return;
  const row    = btn.closest("tr");
  const select = row.querySelector("select");
  const role   = select.value;

  // Prevent setting someone to founder unless you are founder
  if (role === "founder" && me.role !== "founder") {
    alert("Only the founder can assign the founder role.");
    return;
  }
  if (!confirm(`Set this user's role to "${role}"?`)) return;
  await updateDoc(doc(db, "users", uid), { role });
  searchUsers();
};

/* ── View Chats ── */
window.viewChats = async (a, b) => {
  if (!a || !b) return;

  document.getElementById("chat-log-content").innerHTML = "Loading…";
  document.getElementById("chat-modal").classList.add("open");

  try {
    const chatId = [a, b].sort().join("_");
    const snap = await getDocs(
      query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "desc"),
        limit(20)
      )
    );

    const msgs = snap.docs.map(d => d.data()).reverse();

    if (!msgs.length) {
      document.getElementById("chat-log-content").innerHTML =
        `<div class="empty">No messages found.</div>`;
      return;
    }

    document.getElementById("chat-log-content").innerHTML =
      msgs.map(m => `
        <div class="chat-entry">
          <div class="who">${m.senderName || "Unknown"}</div>
          <div>${m.message || ""}</div>
        </div>
      `).join("");
  } catch (e) {
    document.getElementById("chat-log-content").innerHTML =
      `<div class="empty" style="color:var(--danger)">Error: ${e.message}</div>`;
  }
};

window.closeChatModal = () => {
  document.getElementById("chat-modal").classList.remove("open");
};
</script>

</body>
</html>