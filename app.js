const ASPECTS = [
  {
    id: 1,
    title: 'Resultaatgerichtheid',
    intro: 'Op de hoogte zijn van de leerdoelen van het project en de te leveren prestaties; weten hoe getoetst en beoordeeld wordt.',
    phases: {
      A: 'Een enkeling is op de hoogte.',
      B: 'Enkelen zijn op de hoogte.',
      C: 'Elk groepslid is op de hoogte.'
    }
  },
  {
    id: 2,
    title: 'Betrokkenheid en loyaliteit',
    phases: {
      A: 'Groepsleden hebben amper interesse in hoe de organisatie draait en doen niet meer dan wat van hen wordt gevraagd.',
      B: 'Groepsleden lezen de uitgereikte informatie, stellen daar af en toe een vraag over aan de begeleider en zijn bereid soms iets extra te doen.',
      C: 'Groepsleden zijn er goed van op de hoogte hoe de groep ervoor staat, denken actief mee en hebben veel over voor het werk.'
    }
  },
  {
    id: 3,
    title: 'Vernieuwend vermogen',
    phases: {
      A: 'De groep heeft geen interesse in verbetering of vernieuwing, komt zelf niet met ideeën, staat niet open voor suggesties van anderen.',
      B: 'Men komt af en toe met een verbeteringsvoorstel, kijkt de kat uit de boom en neemt kennis van wat gebeurt bij andere projectgroepen.',
      C: 'De groep komt zelf met voorstellen en suggesties voor verbetering of vernieuwing van aanpak en werkwijze en toont betrokkenheid tot en met de realisatie.'
    }
  },
  {
    id: 4,
    title: 'Klant-denken',
    phases: {
      A: 'De groep kan zich niet verplaatsen in de positie van de klant en voelt zich niet verantwoordelijk voor het oplossen van de problemen van de klant.',
      B: 'De groep kan verwoorden wat het probleem van de klant is en in welke richting oplossingen gezocht moeten worden.',
      C: 'De groep heeft zich het probleem van de klant eigen gemaakt en voelt zich verantwoordelijk voor de kwaliteit van het geleverde product.'
    }
  },
  {
    id: 5,
    title: 'Communicatiepatronen',
    phases: {
      A: 'De groep heeft geen behoefte aan overleg onderling of met anderen en wil geen feedback over haar functioneren.',
      B: 'De groep komt wekelijks bijeen omdat het zo hoort, maar weet niet goed wat te bespreken of te informeren.',
      C: 'De groep neemt zelf het initiatief tot overleggen, betrekt daarbij zonodig personen van buiten en wil feedback over haar functioneren.'
    }
  },
  {
    id: 6,
    title: 'Samenwerking',
    phases: {
      A: 'De groep hangt als los zand aan elkaar. Men werkt voor zichzelf en iedereen moet zichzelf maar redden.',
      B: 'Men kent elkaar redelijk en houdt daar rekening mee; men kan elkaar gedeeltelijk vervangen.',
      C: 'De groep heeft een hechte band, houdt rekening met elkaar en anticipeert op elkaars afwezigheid.'
    }
  },
  {
    id: 7,
    title: 'Conflicthantering',
    phases: {
      A: 'Tegenovergestelde meningen en gedrag zijn in de groep onbespreekbaar en discussie wordt vermeden.',
      B: 'Tegengestelde meningen en gedrag kunnen soms wel en soms niet besproken worden.',
      C: 'Tegengestelde meningen en gedrag zijn bespreekbaar, worden uitgepraat en leiden tot verbeteringen.'
    }
  },
  {
    id: 8,
    title: 'Sturen en coachen',
    phases: {
      A: 'De groep heeft een sterke behoefte aan sturing ten aanzien van taken en verantwoordelijkheden.',
      B: 'De groep heeft regelmatige twijfels of onenigheid en daarbij behoefte aan sturing van bovenaf.',
      C: 'De groep stuurt zichzelf ten aanzien van taken, verantwoordelijkheden en gedrag.'
    }
  },
  {
    id: 9,
    title: 'Omgangsvormen',
    phases: {
      A: 'Hoe zich te gedragen is onbespreekbaar; er is geen basis voor vertrouwen.',
      B: 'Over een aantal zaken bestaan gemeenschappelijke regels en normen, maar niet alles is bespreekbaar.',
      C: 'Omgangsvormen en gedrag zijn bespreekbaar; er is een brede basis van vertrouwen.'
    }
  }
];

const state = {
  supabase: null,
  session: null,
  round: null,
  groupConfig: null,
  membership: null,
  responses: [],
  dashboardRows: [],
  decisions: []
};

const els = {
  tabs: document.querySelectorAll('.tab'),
  panels: {
    teacher: document.getElementById('teacherPanel'),
    student: document.getElementById('studentPanel'),
    dashboard: document.getElementById('dashboardPanel'),
    output: document.getElementById('outputPanel')
  },
  setupWarning: document.getElementById('setupWarning'),
  connectionStatus: document.getElementById('connectionStatus'),
  connectBtn: document.getElementById('connectBtn'),
  teacherForm: document.getElementById('teacherForm'),
  teacherMessage: document.getElementById('teacherMessage'),
  fillExampleCodeBtn: document.getElementById('fillExampleCodeBtn'),
  studentSetupForm: document.getElementById('studentSetupForm'),
  studentSetupMessage: document.getElementById('studentSetupMessage'),
  questionnaireCard: document.getElementById('questionnaireCard'),
  questionnaireList: document.getElementById('questionnaireList'),
  studentSessionInfo: document.getElementById('studentSessionInfo'),
  saveResponsesBtn: document.getElementById('saveResponsesBtn'),
  responseMessage: document.getElementById('responseMessage'),
  dashboardSessionInfo: document.getElementById('dashboardSessionInfo'),
  refreshDashboardBtn: document.getElementById('refreshDashboardBtn'),
  dashboardGate: document.getElementById('dashboardGate'),
  dashboardContent: document.getElementById('dashboardContent'),
  completionSummary: document.getElementById('completionSummary'),
  dashboardTables: document.getElementById('dashboardTables'),
  decisionsContainer: document.getElementById('decisionsContainer'),
  saveDecisionsBtn: document.getElementById('saveDecisionsBtn'),
  decisionsMessage: document.getElementById('decisionsMessage'),
  outputContent: document.getElementById('outputContent'),
  refreshOutputBtn: document.getElementById('refreshOutputBtn')
};

function showTab(tabName) {
  els.tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabName));
  Object.entries(els.panels).forEach(([name, panel]) => panel.classList.toggle('active', name === tabName));
}

els.tabs.forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.tab)));

function setMessage(el, text, type = 'ok') {
  el.textContent = text;
  el.className = `message ${type}`;
}

function safeCode(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 12);
}

function hasConfig() {
  return window.APP_CONFIG
    && window.APP_CONFIG.supabaseUrl
    && window.APP_CONFIG.supabaseAnonKey
    && !window.APP_CONFIG.supabaseUrl.includes('PLAK_HIER')
    && !window.APP_CONFIG.supabaseAnonKey.includes('PLAK_HIER');
}

async function connectSupabase() {
  if (!hasConfig()) {
    els.setupWarning.classList.remove('hidden');
    setMessage(els.studentSetupMessage, 'Vul eerst config.js in.', 'warn');
    return;
  }

  try {
    state.supabase = window.supabase.createClient(
      window.APP_CONFIG.supabaseUrl,
      window.APP_CONFIG.supabaseAnonKey
    );

    const { data: existingSession } = await state.supabase.auth.getSession();
    if (existingSession?.session) {
      state.session = existingSession.session;
    } else {
      const { data, error } = await state.supabase.auth.signInAnonymously();
      if (error) throw error;
      state.session = data.session;
    }

    els.setupWarning.classList.add('hidden');
    els.connectionStatus.textContent = 'Verbonden';
    els.connectionStatus.style.background = '#e8f7ef';
    els.connectionStatus.style.color = '#0f8a56';
    setMessage(els.teacherMessage, 'Verbonden met Supabase. Je kunt nu een ronde aanmaken.', 'ok');
  } catch (error) {
    console.error(error);
    els.connectionStatus.textContent = 'Verbinden mislukt';
    setMessage(els.teacherMessage, `Verbinden mislukt: ${error.message}`, 'error');
  }
}

els.connectBtn.addEventListener('click', connectSupabase);

function renderQuestionnaire() {
  els.questionnaireList.innerHTML = ASPECTS.map(aspect => {
    const response = state.responses.find(item => item.aspect_id === aspect.id) || {};
    return `
      <article class="aspect-card">
        <h3>${aspect.id}. ${aspect.title}</h3>
        ${aspect.intro ? `<p>${aspect.intro}</p>` : ''}
        <div class="phase-grid">
          <div class="phase-box"><strong>A</strong>: ${aspect.phases.A}</div>
          <div class="phase-box"><strong>B</strong>: ${aspect.phases.B}</div>
          <div class="phase-box"><strong>C</strong>: ${aspect.phases.C}</div>
        </div>
        <div class="choice-row">
          <div>
            <p><strong>Waar zit de groep nu volgens jou?</strong></p>
            <div class="choice-set">
              ${['A', 'B', 'C'].map(letter => `
                <label><input type="radio" name="current_${aspect.id}" value="${letter}" ${response.current_choice === letter ? 'checked' : ''}> ${letter}</label>
              `).join('')}
            </div>
          </div>
          <div>
            <p><strong>Waar wil jij individueel naartoe?</strong></p>
            <div class="choice-set">
              ${['A', 'B', 'C'].map(letter => `
                <label><input type="radio" name="desired_${aspect.id}" value="${letter}" ${response.desired_choice === letter ? 'checked' : ''}> ${letter}</label>
              `).join('')}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

async function createRound(event) {
  event.preventDefault();
  if (!state.supabase) return setMessage(els.teacherMessage, 'Klik eerst op "Verbind met Supabase".', 'warn');

  const title = document.getElementById('roundTitle').value.trim();
  const code = safeCode(document.getElementById('roundCode').value);

  if (!title || !code) {
    return setMessage(els.teacherMessage, 'Vul een titel en rondecode in.', 'warn');
  }

  const counts = [1, 2, 3, 4, 5].map(groupNumber => ({
    group_number: groupNumber,
    expected_students: Number(document.getElementById(`group${groupNumber}Count`).value || 0)
  }));

  try {
    const { data: round, error: roundError } = await state.supabase
      .from('rounds')
      .insert({
        title,
        code,
        created_by: state.session.user.id
      })
      .select()
      .single();

    if (roundError) throw roundError;

    const groupRows = counts.map(item => ({
      round_id: round.id,
      group_number: item.group_number,
      expected_students: item.expected_students
    }));

    const { error: groupsError } = await state.supabase.from('round_groups').insert(groupRows);
    if (groupsError) throw groupsError;

    setMessage(els.teacherMessage, `Ronde aangemaakt. Deel deze code met studenten: ${code}`, 'ok');
    document.getElementById('studentRoundCode').value = code;
    showTab('student');
  } catch (error) {
    console.error(error);
    setMessage(els.teacherMessage, `Aanmaken mislukt: ${error.message}`, 'error');
  }
}

els.teacherForm.addEventListener('submit', createRound);
els.fillExampleCodeBtn.addEventListener('click', () => {
  document.getElementById('roundCode').value = `TEAM${Math.floor(100 + Math.random() * 900)}`;
});

async function startStudentSession(event) {
  event.preventDefault();
  if (!state.supabase) return setMessage(els.studentSetupMessage, 'Klik eerst op "Verbind met Supabase".', 'warn');

  const code = safeCode(document.getElementById('studentRoundCode').value);
  const groupNumber = Number(document.getElementById('studentGroup').value);
  const initials = document.getElementById('studentInitials').value.trim().toUpperCase();

  if (!code || !groupNumber || !initials) {
    return setMessage(els.studentSetupMessage, 'Vul rondecode, groep en beginletter(s) in.', 'warn');
  }

  try {
    const { data: round, error: roundError } = await state.supabase
      .from('rounds')
      .select('*')
      .eq('code', code)
      .single();

    if (roundError || !round) throw new Error('Rondecode niet gevonden.');

    const { data: groupConfig, error: groupError } = await state.supabase
      .from('round_groups')
      .select('*')
      .eq('round_id', round.id)
      .eq('group_number', groupNumber)
      .single();

    if (groupError || !groupConfig) throw new Error('Groep niet gevonden in deze ronde.');

    const membershipPayload = {
      round_id: round.id,
      group_number: groupNumber,
      user_id: state.session.user.id,
      initials
    };

    const { data: membership, error: membershipError } = await state.supabase
      .from('student_memberships')
      .upsert(membershipPayload, { onConflict: 'round_id,group_number,user_id' })
      .select()
      .single();

    if (membershipError) throw membershipError;

    const { data: responses, error: responseError } = await state.supabase
      .from('responses')
      .select('*')
      .eq('round_id', round.id)
      .eq('group_number', groupNumber)
      .eq('user_id', state.session.user.id);

    if (responseError) throw responseError;

    state.round = round;
    state.groupConfig = groupConfig;
    state.membership = membership;
    state.responses = responses || [];

    els.studentSessionInfo.textContent = `Ronde ${round.code} · Groep ${groupNumber} · Student ${initials}`;
    els.questionnaireCard.classList.remove('hidden');
    setMessage(els.studentSetupMessage, 'Sessie gekoppeld. Vul nu de vragenlijst in.', 'ok');

    renderQuestionnaire();
    await refreshDashboard();
    await refreshOutput();
  } catch (error) {
    console.error(error);
    setMessage(els.studentSetupMessage, `Starten mislukt: ${error.message}`, 'error');
  }
}

els.studentSetupForm.addEventListener('submit', startStudentSession);

async function saveResponses() {
  if (!state.supabase || !state.round || !state.membership) {
    return setMessage(els.responseMessage, 'Koppel eerst een studentensessie.', 'warn');
  }

  const rows = [];
  for (const aspect of ASPECTS) {
    const currentChoice = document.querySelector(`input[name="current_${aspect.id}"]:checked`)?.value || null;
    const desiredChoice = document.querySelector(`input[name="desired_${aspect.id}"]:checked`)?.value || null;
    if (!currentChoice || !desiredChoice) {
      return setMessage(els.responseMessage, `Vul bij aspect "${aspect.title}" beide keuzes in.`, 'warn');
    }
    rows.push({
      round_id: state.round.id,
      group_number: state.membership.group_number,
      user_id: state.session.user.id,
      initials: state.membership.initials,
      aspect_id: aspect.id,
      current_choice: currentChoice,
      desired_choice: desiredChoice
    });
  }

  try {
    const { error } = await state.supabase.from('responses').upsert(rows, {
      onConflict: 'round_id,group_number,user_id,aspect_id'
    });
    if (error) throw error;

    state.responses = rows;
    setMessage(els.responseMessage, 'Antwoorden opgeslagen. Het dashboard wordt nu ververst.', 'ok');
    await refreshDashboard();
    await refreshOutput();
    showTab('dashboard');
  } catch (error) {
    console.error(error);
    setMessage(els.responseMessage, `Opslaan mislukt: ${error.message}`, 'error');
  }
}

els.saveResponsesBtn.addEventListener('click', saveResponses);

async function refreshDashboard() {
  if (!state.supabase || !state.round || !state.membership) {
    els.dashboardGate.textContent = 'Nog geen gekoppelde studentensessie.';
    els.dashboardContent.classList.add('hidden');
    return;
  }

  els.dashboardSessionInfo.textContent = `Ronde ${state.round.code} · Groep ${state.membership.group_number} · Student ${state.membership.initials}`;

  try {
    const [{ data: members, error: membersError }, { data: allResponses, error: responsesError }, { data: decisions, error: decisionsError }] = await Promise.all([
      state.supabase.from('student_memberships').select('*').eq('round_id', state.round.id).eq('group_number', state.membership.group_number),
      state.supabase.from('responses').select('*').eq('round_id', state.round.id).eq('group_number', state.membership.group_number).order('initials'),
      state.supabase.from('group_decisions').select('*').eq('round_id', state.round.id).eq('group_number', state.membership.group_number)
    ]);

    if (membersError) throw membersError;
    if (responsesError) throw responsesError;
    if (decisionsError) throw decisionsError;

    state.dashboardRows = allResponses || [];
    state.decisions = decisions || [];

    const uniqueStudents = new Map();
    (members || []).forEach(member => uniqueStudents.set(member.user_id, member));
    const respondedStudents = new Set((allResponses || []).map(row => row.user_id));
    const expected = Number(state.groupConfig.expected_students || 0);
    const actualMembers = uniqueStudents.size;
    const completedMembers = respondedStudents.size;
    const ready = expected > 0 ? completedMembers >= expected : completedMembers > 0;

    els.completionSummary.innerHTML = `
      <div class="summary-tile"><strong>Verwacht</strong><br>${expected}</div>
      <div class="summary-tile"><strong>In groep gekoppeld</strong><br>${actualMembers}</div>
      <div class="summary-tile"><strong>Vragenlijst ingevuld</strong><br>${completedMembers}</div>
      <div class="summary-tile"><strong>Status</strong><br>${ready ? 'Dashboard zichtbaar' : 'Nog wachten'}</div>
    `;

    if (!ready) {
      els.dashboardGate.innerHTML = `Het dashboard wordt zichtbaar zodra <strong>${expected}</strong> student(en) uit deze groep hebben ingevuld. Nu klaar: <strong>${completedMembers}</strong>.`;
      els.dashboardContent.classList.add('hidden');
      return;
    }

    els.dashboardGate.textContent = 'Alle verwachte studenten hebben ingevuld. Bespreek nu samen per aspect welke gezamenlijke optie de groep kiest.';
    els.dashboardContent.classList.remove('hidden');

    renderDashboardTables(uniqueStudents, allResponses || []);
    renderDecisions(decisions || []);
    await refreshOutput();
  } catch (error) {
    console.error(error);
    els.dashboardGate.textContent = `Dashboard laden mislukt: ${error.message}`;
    els.dashboardContent.classList.add('hidden');
  }
}

function renderDashboardTables(membersMap, rows) {
  const memberList = Array.from(membersMap.values()).sort((a, b) => a.initials.localeCompare(b.initials));
  const groupedByAspect = new Map();
  rows.forEach(row => {
    const key = row.aspect_id;
    if (!groupedByAspect.has(key)) groupedByAspect.set(key, []);
    groupedByAspect.get(key).push(row);
  });

  els.dashboardTables.innerHTML = ASPECTS.map(aspect => {
    const entries = groupedByAspect.get(aspect.id) || [];
    const byUser = new Map(entries.map(entry => [entry.user_id, entry]));
    return `
      <div class="table-wrap">
        <h3>${aspect.id}. ${aspect.title}</h3>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Waar zitten we nu?</th>
              <th>Waar wil ik individueel naartoe?</th>
            </tr>
          </thead>
          <tbody>
            ${memberList.map(member => {
              const row = byUser.get(member.user_id);
              return `
                <tr>
                  <td>${member.initials}</td>
                  <td>${row?.current_choice || '—'}</td>
                  <td>${row?.desired_choice || '—'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }).join('');
}

function renderDecisions(decisions) {
  els.decisionsContainer.innerHTML = ASPECTS.map(aspect => {
    const saved = decisions.find(item => item.aspect_id === aspect.id) || {};
    return `
      <article class="aspect-card">
        <h3>${aspect.id}. ${aspect.title}</h3>
        <div class="choice-set">
          ${['A', 'B', 'C'].map(letter => `
            <label><input type="radio" name="decision_${aspect.id}" value="${letter}" ${saved.selected_choice === letter ? 'checked' : ''}> ${letter}</label>
          `).join('')}
        </div>
        <div class="grid-form" style="margin-top:14px">
          <label>
            Wat gaan jullie doen of wat gaat er gebeuren?
            <textarea id="what_${aspect.id}">${saved.what_text || ''}</textarea>
          </label>
          <label>
            Hoe gaan jullie het doen of hoe verloopt de taak?
            <textarea id="how_${aspect.id}">${saved.how_text || ''}</textarea>
          </label>
          <label>
            Waar vindt het plaats?
            <textarea id="where_${aspect.id}">${saved.where_text || ''}</textarea>
          </label>
          <label>
            Wanneer doen jullie het? Benoem altijd een duidelijke begin- en eindtijd.
            <textarea id="when_${aspect.id}">${saved.when_text || ''}</textarea>
          </label>
          <label>
            Wie zet dit in het scrumbord?
            <input type="text" id="scrum_${aspect.id}" value="${saved.scrum_owner || ''}" placeholder="Naam of initialen" />
          </label>
          <label>
            Wie doen mee of met wie ben je?
            <textarea id="who_${aspect.id}">${saved.who_text || ''}</textarea>
          </label>
        </div>
      </article>
    `;
  }).join('');
}

async function saveDecisions() {
  if (!state.supabase || !state.round || !state.membership) {
    return setMessage(els.decisionsMessage, 'Koppel eerst een studentensessie.', 'warn');
  }

  const rows = [];
  for (const aspect of ASPECTS) {
    const selectedChoice = document.querySelector(`input[name="decision_${aspect.id}"]:checked`)?.value || null;
    if (!selectedChoice) {
      return setMessage(els.decisionsMessage, `Kies bij "${aspect.title}" samen A, B of C.`, 'warn');
    }

    const payload = {
      round_id: state.round.id,
      group_number: state.membership.group_number,
      aspect_id: aspect.id,
      selected_choice: selectedChoice,
      what_text: document.getElementById(`what_${aspect.id}`).value.trim(),
      how_text: document.getElementById(`how_${aspect.id}`).value.trim(),
      where_text: document.getElementById(`where_${aspect.id}`).value.trim(),
      when_text: document.getElementById(`when_${aspect.id}`).value.trim(),
      scrum_owner: document.getElementById(`scrum_${aspect.id}`).value.trim(),
      who_text: document.getElementById(`who_${aspect.id}`).value.trim(),
      updated_by: state.session.user.id
    };

    if (!payload.what_text || !payload.how_text || !payload.where_text || !payload.when_text || !payload.scrum_owner || !payload.who_text) {
      return setMessage(els.decisionsMessage, `Vul bij "${aspect.title}" alle planvelden in.`, 'warn');
    }

    rows.push(payload);
  }

  try {
    const { error } = await state.supabase.from('group_decisions').upsert(rows, {
      onConflict: 'round_id,group_number,aspect_id'
    });
    if (error) throw error;

    setMessage(els.decisionsMessage, 'Gezamenlijke keuzes en plannen opgeslagen.', 'ok');
    await refreshDashboard();
    await refreshOutput();
    showTab('output');
  } catch (error) {
    console.error(error);
    setMessage(els.decisionsMessage, `Opslaan mislukt: ${error.message}`, 'error');
  }
}

els.saveDecisionsBtn.addEventListener('click', saveDecisions);
els.refreshDashboardBtn.addEventListener('click', refreshDashboard);
els.refreshOutputBtn.addEventListener('click', refreshOutput);

async function refreshOutput() {
  if (!state.supabase || !state.round || !state.membership) {
    els.outputContent.innerHTML = '<p class="small">Koppel eerst een studentensessie.</p>';
    return;
  }

  try {
    const { data: decisions, error } = await state.supabase
      .from('group_decisions')
      .select('*')
      .eq('round_id', state.round.id)
      .eq('group_number', state.membership.group_number)
      .order('aspect_id');

    if (error) throw error;

    if (!decisions || decisions.length === 0) {
      els.outputContent.innerHTML = '<p class="small">Er zijn nog geen gezamenlijke keuzes opgeslagen.</p>';
      return;
    }

    const checklistItems = decisions.map(item => {
      const aspect = ASPECTS.find(a => a.id === item.aspect_id);
      return `
        <li>
          <strong>${aspect.title}</strong> → kies ${item.selected_choice}. ${escapeHtml(item.what_text)} | ${escapeHtml(item.how_text)} | ${escapeHtml(item.where_text)} | ${escapeHtml(item.when_text)} | Met: ${escapeHtml(item.who_text)}.
        </li>
      `;
    }).join('');

    const scrumBlocks = decisions.map(item => {
      const aspect = ASPECTS.find(a => a.id === item.aspect_id);
      return `
        <div class="output-block">
          <h3>${aspect.id}. ${aspect.title}</h3>
          <p><strong>Gezamenlijke keuze:</strong> ${item.selected_choice}</p>
          <p><strong>Wat:</strong> ${escapeHtml(item.what_text)}</p>
          <p><strong>Hoe:</strong> ${escapeHtml(item.how_text)}</p>
          <p><strong>Waar:</strong> ${escapeHtml(item.where_text)}</p>
          <p><strong>Wanneer:</strong> ${escapeHtml(item.when_text)}</p>
          <p><strong>Wie doen mee:</strong> ${escapeHtml(item.who_text)}</p>
          <p><strong>Wie zet dit in het scrumbord:</strong> ${escapeHtml(item.scrum_owner)}</p>
        </div>
      `;
    }).join('');

    els.outputContent.innerHTML = `
      <div class="output-block">
        <h3>Checklist van afspraken</h3>
        <ul class="checklist">${checklistItems}</ul>
      </div>
      <div class="output-block">
        <h3>Overzicht voor het scrumbord</h3>
        <p class="notice strong">Reminder: zet dit in het scrumbord en controleer dat begin- en eindtijd duidelijk zijn. Spreek ook af wie het erin zet.</p>
        ${scrumBlocks}
      </div>
    `;
  } catch (error) {
    console.error(error);
    els.outputContent.innerHTML = `<p class="message error">Output laden mislukt: ${error.message}</p>`;
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

setInterval(() => {
  if (state.membership && state.supabase) {
    refreshDashboard();
  }
}, (window.APP_CONFIG && window.APP_CONFIG.refreshIntervalMs) || 8000);

if (!hasConfig()) {
  els.setupWarning.classList.remove('hidden');
} else {
  els.setupWarning.classList.add('hidden');
}
