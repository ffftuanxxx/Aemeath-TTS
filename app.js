(() => {
  'use strict';
  const data = window.AEMEATH_DEMO;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const label = key => `${data.models[key].name} · ${data.models[key].detail}`;
  const shortLabel = key => ({polestar:'Polestar · position-only',feedback:'Polestar · position-feedback',everbright:'Aemeath + Everbright',aemeath:'Aemeath',control:'Acoustic control',base:'Qwen3-TTS Base',index_raw:'IndexTTS2 · TN off',index_tn:'IndexTTS2 · TN on',cosy:'CosyVoice3',vox:'VoxCPM2',fire:'FireRedTTS3 · WeText',xtts:'XTTS-v2'})[key];
  const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
  let state = {section:'systems',id:data.cases[0].id,query:'',transcripts:false,expanded:false};
  let queue = [];
  const audioElements = () => [...document.querySelectorAll('#tracks audio')];
  const byModel = model => document.querySelector(`#tracks audio[data-model="${model}"]`);
  const currentCase = () => data.cases.find(item => item.id === state.id);
  const filtered = () => data.cases.filter(item => item.section === state.section &&
    `${item.id} ${item.title} ${item.topic} ${item.topic_zh} ${item.input}`.toLowerCase().includes(state.query.toLowerCase()));

  function stopAll(reset = true) {
    queue = [];
    audioElements().forEach(audio => {
      audio.pause();
      if (reset) { try { audio.currentTime = 0; } catch (_) {} }
    });
    $('play-pair').textContent = 'Play A → B';
    $('status').textContent = '';
  }

  async function playModel(model) {
    const audio = byModel(model);
    if (!audio) return;
    audio.currentTime = 0;
    try { await audio.play(); }
    catch (_) {
      queue = [];
      $('play-pair').textContent = 'Play A → B';
      $('status').textContent = 'Playback could not start. Use the audio player, and check that the audio folder was extracted beside index.html.';
    }
  }

  function wireAudio() {
    audioElements().forEach(audio => {
      const card = audio.closest('.track');
      audio.addEventListener('play', () => {
        audioElements().filter(other => other !== audio).forEach(other => other.pause());
        if (queue.length && queue[0] !== audio.dataset.model) queue = [];
        card.classList.add('now-playing');
        $('status').textContent = `Playing ${shortLabel(audio.dataset.model)} · sample #${state.id.padStart(5,'0')}`;
        $('play-pair').textContent = queue.length ? 'A/B playing…' : 'Play A → B';
      });
      audio.addEventListener('pause', () => card.classList.remove('now-playing'));
      audio.addEventListener('ended', () => {
        card.classList.remove('now-playing');
        if (queue[0] === audio.dataset.model) {
          queue.shift();
          if (queue.length) { playModel(queue[0]); return; }
        }
        $('play-pair').textContent = 'Play A → B';
        $('status').textContent = 'Playback complete.';
      });
      audio.addEventListener('error', () => {
        queue = [];
        $('play-pair').textContent = 'Play A → B';
        if (!card.querySelector('.audio-error')) {
          const note = document.createElement('p');
          note.className = 'audio-error';
          note.textContent = 'Audio unavailable. Extract the complete ZIP, including its audio folder.';
          card.append(note);
        }
      });
    });
  }

  function trackMarkup(track, item) {
    const model = data.models[track.model];
    const featured = track.model === item.featured_model;
    const prefix = featured ? '<div class="featured-tag"><img src="assets/Polestar.png" alt=""> FEATURED · POSITION-ONLY</div>' : '';
    const percent = (track.cer * 100).toFixed(1);
    const title = `${track.errors} character edits / ${track.reference_chars} reference characters`;
    const metric = model.ours || track.model === 'control' ? '' : `<div class="metric ${track.cer === 0 ? 'zero' : ''}" title="${title}"><small>CER ↓</small><b>${percent}%</b></div>`;
    return `<article class="track ${model.ours ? 'ours' : ''} ${featured ? 'featured' : ''}" data-model="${track.model}">
      <div class="track-head"><div class="track-identity">${prefix}<h5 class="track-name">${escape(model.name)}</h5><p class="track-detail">${escape(model.detail)}</p><span class="track-front">${escape(model.frontend)}</span></div>${metric}</div>
      <div class="player-wrap"><audio controls preload="metadata" src="${escape(track.wav)}" data-model="${track.model}" aria-label="${escape(label(track.model))}, sample ${item.id}">Your browser does not support audio. <a href="${escape(track.wav)}">Download WAV</a>.</audio><div class="track-meta"><span>${time(track.duration)} · ${(track.sample_rate/1000).toFixed(track.sample_rate%1000 ? 2 : 0)} kHz</span><a href="${escape(track.wav)}" download>WAV ↗</a></div></div>
      <details class="transcript" ${state.transcripts ? 'open' : ''}><summary>ASR transcript</summary><p lang="zh-Hans">${escape(track.asr)}</p></details>
    </article>`;
  }

  function renderSidebar() {
    const rows = filtered();
    $('case-count').textContent = `${rows.length} EXAMPLE${rows.length === 1 ? '' : 'S'}`;
    const all = data.cases.filter(item => item.section === state.section);
    $('case-list').innerHTML = rows.length ? rows.map(item => `<button class="case-button" data-id="${item.id}" aria-current="${item.id === state.id}"><span class="case-number">${String(all.indexOf(item)+1).padStart(2,'0')}</span><span><strong>${escape(item.title)}</strong><small>${escape(item.topic)} · #${item.id.padStart(5,'0')}</small></span></button>`).join('') : '<p class="empty-search">No matches. Try a sample ID or another word.</p>';
    $('case-list').querySelectorAll('button').forEach(button => button.addEventListener('click', () => selectCase(button.dataset.id)));
  }

  function renderCase() {
    stopAll();
    const item = currentCase();
    const rows = filtered();
    const index = rows.findIndex(row => row.id === state.id);
    $('case-meta').className = 'case-meta';
    $('case-meta').innerHTML = `<span class="topic-pill">${escape(item.topic)}</span><span>#${item.id.padStart(5,'0')}</span>`;
    $('case-position').textContent = index >= 0 ? `${index+1} / ${rows.length}` : '—';
    $('previous').disabled = index <= 0;
    $('next').disabled = index < 0 || index >= rows.length-1;
    $('next-bottom').disabled = $('next').disabled;
    $('case-title').textContent = item.title;
    $('case-cue').textContent = item.cue.replace(/^Listen for /, '');
    $('raw-input').textContent = item.input;
    $('reference-text').textContent = item.reference;
    document.querySelector('.text-pair').classList.toggle('expanded',state.expanded);
    $('expand-text').setAttribute('aria-expanded',String(state.expanded));
    $('expand-text').innerHTML = state.expanded ? 'Collapse text ↑' : 'Expand full text ↓';
    $('track-count').textContent = `${item.models.length} ${item.section === 'systems' ? 'systems' : 'variants'}`;
    $('tracks').innerHTML = item.models.map(track => trackMarkup(track,item)).join('');
    $('compare-model').innerHTML = item.models.filter(track => track.model !== item.featured_model).map(track => `<option value="${track.model}">${escape(shortLabel(track.model))}</option>`).join('');
    $('compare-model').value = item.section === 'systems' ? 'index_tn' : 'everbright';
    wireAudio();
    const targetHash = `#sample-${item.id.padStart(5,'0')}`;
    if (location.hash !== targetHash) {
      try { history.replaceState(null,'',targetHash); } catch (_) { /* file viewers may restrict history */ }
    }
  }

  function updateTabs() {
    document.querySelectorAll('.tabs button').forEach(button => {
      const selected = button.dataset.section === state.section;
      button.setAttribute('aria-selected',String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    $('example-panel').setAttribute('aria-labelledby',`tab-${state.section}`);
  }

  function selectCase(id) {
    state.id = id;
    state.expanded = false;
    renderSidebar();
    renderCase();
  }

  function changeSection(section) {
    state.section = section;
    state.query = '';
    $('search').value = '';
    state.id = data.cases.find(item => item.section === section).id;
    state.expanded = false;
    updateTabs();
    renderSidebar();
    renderCase();
  }

  function move(direction) {
    const rows=filtered(), index=rows.findIndex(item => item.id === state.id), next=rows[index+direction];
    if (next) selectCase(next.id);
  }

  document.querySelectorAll('.tabs button').forEach(button => {
    button.addEventListener('click', () => changeSection(button.dataset.section));
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        changeSection(state.section === 'systems' ? 'ablations' : 'systems');
        $(`tab-${state.section}`).focus();
      }
    });
  });
  $('previous').addEventListener('click', () => move(-1));
  $('next').addEventListener('click', () => move(1));
  $('next-bottom').addEventListener('click', () => move(1));
  $('search').addEventListener('input', () => {
    state.query = $('search').value.trim();
    const rows = filtered();
    if (rows.length && !rows.some(item => item.id === state.id)) state.id = rows[0].id;
    renderSidebar();
    renderCase();
  });
  $('expand-text').addEventListener('click', () => {
    state.expanded = !state.expanded;
    document.querySelector('.text-pair').classList.toggle('expanded',state.expanded);
    $('expand-text').setAttribute('aria-expanded',String(state.expanded));
    $('expand-text').textContent = state.expanded ? 'Collapse text ↑' : 'Expand full text ↓';
  });
  $('show-transcripts').addEventListener('change', () => {
    state.transcripts = $('show-transcripts').checked;
    document.querySelectorAll('.transcript').forEach(item => item.open = state.transcripts);
  });
  $('play-pair').addEventListener('click', () => {
    stopAll();
    queue = [currentCase().featured_model,$('compare-model').value];
    playModel(queue[0]);
  });
  $('stop-audio').addEventListener('click', () => stopAll());
  $('compare-model').addEventListener('change', () => stopAll());
  function restoreHash() {
    const match = location.hash.match(/^#sample-0*(\d+)$/);
    const item = match && data.cases.find(row => row.id === match[1]);
    if (!item) return;
    state.section = item.section;
    state.id = item.id;
    state.query = '';
    $('search').value = '';
    updateTabs();renderSidebar();renderCase();
  }
  window.addEventListener('hashchange',restoreHash);
  restoreHash();updateTabs();renderSidebar();renderCase();
})();
