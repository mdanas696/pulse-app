// ---- Data ----
const team = ["Aisha", "Karan", "Priya", "Devon", "Marcus"];
const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// load values 0-100+ (>100 = overloaded), seeded to tell a story
const loadData = {
  Aisha:  [65, 78, 92, 105, 112, 40, 20],
  Karan:  [40, 45, 50, 48, 55, 10, 5],
  Priya:  [70, 82, 88, 95, 90, 30, 15],
  Devon:  [30, 35, 40, 38, 42, 5, 0],
  Marcus: [88, 95, 108, 118, 120, 45, 25],
};

function loadColor(v) {
  // 0-60 teal, 60-90 amber blend, 90+ coral
  if (v <= 60) {
    const t = v / 60;
    return mix("#17544E", "#2DD4BF", t);
  } else if (v <= 90) {
    const t = (v - 60) / 30;
    return mix("#2DD4BF", "#FBBF24", t);
  } else {
    const t = Math.min((v - 90) / 40, 1);
    return mix("#FBBF24", "#FB6340", t);
  }
}
function mix(c1, c2, t) {
  const a = hexToRgb(c1), b = hexToRgb(c2);
  const r = Math.round(a[0] + (b[0]-a[0])*t);
  const g = Math.round(a[1] + (b[1]-a[1])*t);
  const bl = Math.round(a[2] + (b[2]-a[2])*t);
  return `rgb(${r},${g},${bl})`;
}
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n>>16)&255, (n>>8)&255, n&255];
}

function renderHeatmap() {
  const el = document.getElementById('heatmap');
  el.innerHTML = '';
  el.appendChild(document.createElement('div')); // corner
  days.forEach(d => {
    const lbl = document.createElement('div');
    lbl.className = 'heat-day-label';
    lbl.textContent = d;
    el.appendChild(lbl);
  });
  team.forEach(name => {
    const nameEl = document.createElement('div');
    nameEl.className = 'heat-name';
    nameEl.textContent = name;
    el.appendChild(nameEl);
    loadData[name].forEach(v => {
      const cell = document.createElement('div');
      cell.className = 'heat-cell';
      cell.style.background = loadColor(v);
      cell.textContent = v + '%';
      cell.title = `${name}: ${v}% capacity`;
      el.appendChild(cell);
    });
  });
}

// ---- Priority queue ----
const queue = [
  { title: "Fix checkout API timeout on high load", who: "Marcus", tag: "high" },
  { title: "Redesign onboarding flow — step 3 drop-off", who: "Aisha", tag: "high" },
  { title: "Write Q3 investor update draft", who: "Priya", tag: "med" },
  { title: "Migrate auth service to new provider", who: "Devon", tag: "med" },
  { title: "Update design tokens for dark mode", who: "Karan", tag: "low" },
];
function renderQueue() {
  const el = document.getElementById('queue-list');
  el.innerHTML = queue.map((q, i) => `
    <li class="queue-item">
      <span class="queue-rank">${String(i+1).padStart(2,'0')}</span>
      <div class="queue-body">
        <div class="queue-title">${q.title}</div>
        <div class="queue-meta">Assigned to ${q.who}</div>
      </div>
      <span class="tag ${q.tag}">${q.tag}</span>
    </li>
  `).join('');
}

// ---- Board ----
const boardData = {
  "Backlog": [
    { title: "Set up analytics for new pricing page", who: "D", color: "#2DD4BF" },
    { title: "Draft customer interview questions", who: "P", color: "#FBBF24" },
  ],
  "In Progress": [
    { title: "Fix checkout API timeout on high load", who: "M", color: "#FB6340" },
    { title: "Redesign onboarding flow — step 3", who: "A", color: "#FB6340" },
    { title: "Migrate auth service to new provider", who: "D", color: "#2DD4BF" },
  ],
  "Review": [
    { title: "Update design tokens for dark mode", who: "K", color: "#FBBF24" },
  ],
  "Done": [
    { title: "Ship weekly capacity email digest", who: "M", color: "#2DD4BF" },
    { title: "Write Q2 retro notes", who: "P", color: "#FBBF24" },
  ],
};
function renderBoard() {
  const el = document.getElementById('board');
  el.innerHTML = Object.entries(boardData).map(([col, cards]) => `
    <div class="board-col">
      <div class="board-col-head">
        <h3>${col}</h3>
        <span class="board-count">${cards.length}</span>
      </div>
      ${cards.map(c => `
        <div class="card">
          <div class="card-title">${c.title}</div>
          <div class="card-footer">
            <div class="card-avatar" style="background:${c.color}">${c.who}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

// ---- AI Insights (simulated) ----
const insightPool = [
  { icon: "⚠", title: "Marcus is at 120% capacity Friday", body: "Move \"Migrate auth service\" to Devon (currently at 42%). Same skillset, no deadline conflict — frees up 14 hours before the sprint review." },
  { icon: "↻", title: "Redistribute onboarding work", body: "Aisha and Priya are both above 90% this week. Split \"Redesign onboarding flow\" into two smaller tickets so Karan (55% load) can pick up the analytics half." },
  { icon: "◆", title: "Deadline risk on checkout fix", body: "At current velocity, the checkout API fix won't land before Friday's release window. Recommend pulling in Devon as a second reviewer today, not Thursday." },
  { icon: "●", title: "Burnout signal detected", body: "Marcus has been above 100% capacity for 3 consecutive days. Historically this precedes a 2x increase in review turnaround time — worth a check-in before it compounds." },
  { icon: "▲", title: "Quick win available", body: "\"Update design tokens for dark mode\" is low-effort and unblocks 2 other tickets in Review. Suggest prioritizing it over new Backlog items this week." },
];
let insightIdx = 0;
function renderInitialInsights() {
  const el = document.getElementById('insight-list');
  el.innerHTML = insightPool.slice(0, 3).map(cardHtml).join('');
}
function cardHtml(ins) {
  return `
    <div class="insight-card">
      <div class="insight-icon">${ins.icon}</div>
      <div class="insight-body">
        <h4>${ins.title}</h4>
        <p>${ins.body}</p>
      </div>
    </div>`;
}
document.getElementById('generate-btn').addEventListener('click', () => {
  const el = document.getElementById('insight-list');
  const ins = insightPool[insightIdx % insightPool.length];
  insightIdx++;
  const card = document.createElement('div');
  card.className = 'insight-card typing';
  card.innerHTML = `<div class="insight-icon">${ins.icon}</div><div class="insight-body"><h4>${ins.title}</h4><p></p></div>`;
  el.prepend(card);
  const p = card.querySelector('p');
  let i = 0;
  const full = ins.body;
  const type = setInterval(() => {
    p.textContent = full.slice(0, i++);
    if (i > full.length) { clearInterval(type); card.classList.remove('typing'); }
  }, 12);
});

// ---- Focus tasks ----
const focusTasks = [
  "Fix checkout API timeout on high load",
  "Review Devon's auth migration PR",
  "Reply to design feedback from Priya",
];
function renderFocusTasks() {
  const el = document.getElementById('focus-task-list');
  el.innerHTML = focusTasks.map((t, i) => `
    <div class="focus-task">
      <span class="focus-task-num">${i+1}</span>
      <span>${t}</span>
    </div>
  `).join('');
}

// ---- Timer ----
let timerInterval = null;
let secondsLeft = 25 * 60;
const CIRCUM = 2 * Math.PI * 52;
function updateTimerDisplay() {
  const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const s = String(secondsLeft % 60).padStart(2, '0');
  document.getElementById('timer-text').textContent = `${m}:${s}`;
  const pct = secondsLeft / (25 * 60);
  document.getElementById('ring-fg').style.strokeDasharray = CIRCUM;
  document.getElementById('ring-fg').style.strokeDashoffset = CIRCUM * (1 - pct);
}
document.getElementById('timer-start').addEventListener('click', (e) => {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; e.target.textContent = "Start focus block"; return; }
  e.target.textContent = "Pause";
  timerInterval = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) { clearInterval(timerInterval); timerInterval = null; secondsLeft = 25*60; }
    updateTimerDisplay();
  }, 1000);
});

// ---- Nav ----
const titles = {
  dashboard: ["Overview", "This week at a glance"],
  board: ["Task Board", "Everything the team is shipping"],
  insights: ["AI Insights", "What Pulse is noticing right now"],
  focus: ["Focus Mode", "One task at a time"],
};
document.querySelectorAll('.rail-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + view).classList.add('active');
    document.getElementById('view-eyebrow').textContent = titles[view][0];
    document.getElementById('view-title').textContent = titles[view][1];
  });
});

// ---- Init ----
renderHeatmap();
renderQueue();
renderBoard();
renderInitialInsights();
renderFocusTasks();
updateTimerDisplay();
