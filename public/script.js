"use strict";

/* The browser only sends raw input and shows what the SERVER says.
   All validation lives in validators/studentValidator.js on the server. */
let students = [];
const FIELDS = ["name", "email", "mobile", "age", "course", "city"];
const $ = id => document.getElementById(id);
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function api(url, method = "GET", body) {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : {},
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

async function refresh() {
  try {
    const r = await api("/api/students");
    students = r.ok ? r.data : [];
  } catch { banner("Cannot reach the server.", false); }
  render();
}

function showErrors(errors = {}) {
  FIELDS.forEach(f => {
    $("e-" + f).textContent = errors[f] || "";
    $(f).classList.toggle("bad", Boolean(errors[f]));
  });
}
function banner(msg, ok) {
  const b = $("banner");
  b.textContent = msg;
  b.className = ok ? "ok" : "fail";
  setTimeout(() => (b.className = ""), 3500);
}

function render() {
  const q = $("search").value.trim().toLowerCase();
  const course = $("filter").value;
  const visible = students.filter(s =>
    (!course || s.course === course) &&
    (s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
  );

  $("tbody").innerHTML = visible.map(s => `
    <tr>
      <td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.email)}</td><td>${s.mobile}</td><td>${s.course}</td>
      <td><button class="del" data-id="${s.id}" aria-label="Delete ${escapeHtml(s.name)}">Delete</button></td>
    </tr>`).join("");
  $("empty").hidden = visible.length > 0;

  const counts = students.reduce((a, s) => ((a[s.course] = (a[s.course] || 0) + 1), a), {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const avg = students.length ? (students.reduce((sum, s) => sum + s.age, 0) / students.length).toFixed(1) : "–";
  $("s-count").textContent = students.length;
  $("s-avg").textContent = avg;
  $("s-top").textContent = top ? top[0] : "–";
  $("json").textContent = JSON.stringify(students, null, 2);
}

$("form").addEventListener("submit", async ev => {
  ev.preventDefault();
  const payload = Object.fromEntries(FIELDS.map(f => [f, $(f).value]));
  try {
    const { ok, data } = await api("/api/students", "POST", payload);
    if (!ok) {
      showErrors(data.errors);
      banner(data.errors?._form || "Server rejected the data. Fix the highlighted fields.", false);
      return;
    }
    showErrors();
    ev.target.reset();
    banner("Student registered on the server.", true);
    refresh();
  } catch { banner("Cannot reach the server.", false); }
});

$("tbody").addEventListener("click", async ev => {
  const id = ev.target.dataset.id;
  if (!id) return;
  if (confirm("Delete this student?")) { await api("/api/students/" + id, "DELETE"); refresh(); }
});
["search", "filter"].forEach(id => $(id).addEventListener("input", render));

refresh();
