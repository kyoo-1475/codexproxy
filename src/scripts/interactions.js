const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Terminal Loop
function initTerminalLoop() {
  const commands = [
    '$ export CODEX_PROXY_UPSTREAM_BASE_URL=http://127.0.0.1:11434',
    '$ export CODEX_PROXY_UPSTREAM_MODEL=llama3.1:70b',
    '$ python -m codex_proxy_for_all_models'
  ];

  const intro = [
    'Codex Proxy for All Models',
    'Lightweight proxy for Codex IDE / CLI',
    'Pure Python. Zero dependencies.',
    '',
    '12:41:02 INFO: Starting Codex Proxy...',
    '12:41:02 INFO: Mode: single_upstream',
    '12:41:02 INFO: Upstream: http://127.0.0.1:11434',
    '12:41:02 INFO: Model: llama3.1:70b',
    '12:41:02 INFO: Listening on http://127.0.0.1:8787',
    ''
  ];

  const logs = [
    '12:41:02 GET  /models      200 OK 132ms',
    '12:41:03 POST /responses   200 OK 825ms',
    '12:41:05 POST /responses   200 OK 643ms',
    '12:41:08 POST /responses   200 OK 512ms'
  ];

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Time generator for live logs
  let currentSecond = 8;
  let currentMinute = 41;
  let currentHour = 12;

  function getNextTimestamp() {
    currentSecond += Math.floor(Math.random() * 4) + 1;
    if (currentSecond >= 60) {
      currentSecond -= 60;
      currentMinute += 1;
      if (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour = (currentHour + 1) % 24;
      }
    }
    const h = String(currentHour).padStart(2, '0');
    const m = String(currentMinute).padStart(2, '0');
    const s = String(currentSecond).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function generateLiveLog() {
    const isPost = Math.random() > 0.3;
    const method = isPost ? 'POST' : 'GET ';
    const path = isPost ? '/responses  ' : '/models     ';
    const latency = Math.floor(Math.random() * 500) + 100;
    return `${getNextTimestamp()} ${method} ${path} 200 OK ${latency}ms`;
  }

  async function typeLine(container, text, speed = 12) {
    const line = document.createElement('div');
    line.className = 'terminal-line mb-1';
    container.appendChild(line);

    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';

    if (text.startsWith('$ ')) {
      const prefix = document.createElement('span');
      prefix.className = 'text-emerald-400 shrink-0 mr-2';
      prefix.textContent = '$';
      line.appendChild(prefix);
      
      const cmdText = text.substring(2);
      const span = document.createElement('span');
      line.appendChild(span);
      line.appendChild(cursor);
      
      for (const char of cmdText) {
        span.textContent += char;
        await sleep(speed);
      }
    } else {
      const span = document.createElement('span');
      line.appendChild(span);
      line.appendChild(cursor);
      for (const char of text) {
        span.textContent += char;
        await sleep(speed);
      }
    }
    cursor.remove();
  }

  async function appendLine(container, text, isLiveLog = false) {
    const line = document.createElement('div');
    line.className = 'terminal-line mb-1 text-slate-400';
    if (isLiveLog) {
      line.classList.add('terminal-log-line');
    }
    
    let html = text;
    html = html.replace(/(GET\s+)/g, '<span class="text-amber-400">$1</span>');
    html = html.replace(/(POST\s+)/g, '<span class="text-purple-400">$1</span>');
    html = html.replace(/(200 OK)/g, '<span class="text-emerald-400">$1</span>');
    html = html.replace(/(INFO:)/g, '<span class="text-blue-400">$1</span>');
    html = html.replace(/(\b\d{2}:\d{2}:\d{2}\b)/g, '<span class="text-slate-600">$1</span>');
    html = html.replace(/(\b\d+ms\b)/g, '<span class="text-slate-500">$1</span>');
    
    line.innerHTML = html;
    container.appendChild(line);

    if (isLiveLog) {
      const liveLogs = container.querySelectorAll('.terminal-log-line');
      if (liveLogs.length > 8) {
        liveLogs[0].remove();
      }
    }
    await sleep(150);
  }

  async function runTerminalLoop(container) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.info('[CodexProxy] terminal loop started');
    }

    if (motionReduced) {
      let staticHtml = '';
      commands.forEach(cmd => {
        staticHtml += `<div class="mb-1"><span class="text-emerald-400 mr-2">$</span><span>${cmd.substring(2)}</span></div>`;
      });
      staticHtml += '<div class="mb-1"></div>';
      intro.forEach(line => {
        staticHtml += `<div class="mb-1 text-slate-400">${line.replace(/(INFO:)/g, '<span class="text-blue-400">$1</span>')}</div>`;
      });
      logs.forEach(log => {
        let l = log.replace(/(GET\s+)/g, '<span class="text-amber-400">$1</span>')
                   .replace(/(POST\s+)/g, '<span class="text-purple-400">$1</span>')
                   .replace(/(200 OK)/g, '<span class="text-emerald-400">$1</span>');
        staticHtml += `<div class="mb-1 text-slate-400">${l}</div>`;
      });
      container.innerHTML = staticHtml;
      return;
    }

    container.innerHTML = '';

    for (const command of commands) {
      await typeLine(container, command, 12);
      await sleep(200);
    }

    await sleep(300);

    for (const line of intro) {
      await appendLine(container, line);
    }

    for (const log of logs) {
      await appendLine(container, log, true);
      await sleep(400);
    }

    // Continuous logging loop
    while (true) {
      const waitTime = 1200 + Math.random() * 600;
      await sleep(waitTime);
      const newLog = generateLiveLog();
      await appendLine(container, newLog, true);
    }
  }

  document.querySelectorAll('[data-terminal-loop]').forEach(runTerminalLoop);
}

// 2. Hover Tilt
function initTiltCards() {
  if (motionReduced) return;

  document.querySelectorAll('[data-tilt-card]').forEach(card => {
    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Relative pointer position normalized from -0.5 to 0.5
      const px = (x / rect.width) - 0.5;
      const py = (y / rect.height) - 0.5;
      
      const maxRotate = 4;
      const rx = -py * maxRotate;
      const ry = px * maxRotate;
      
      card.style.setProperty('--rx', `${rx}deg`);
      card.style.setProperty('--ry', `${ry}deg`);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// 3. Scroll Reveal
function initScrollReveal() {
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll, .stagger-item').forEach(el => {
    if (motionReduced) {
      el.classList.add('is-visible');
    } else {
      revealObserver.observe(el);
    }
  });
}

// 4. Copy Buttons
function initCopyButtons() {
  document.querySelectorAll('[data-copy-button]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const container = btn.closest('.p-4') || btn.parentElement.parentElement;
      if (!container) return;
      const codeElement = container.querySelector('code') || container.querySelector('pre');
      if (!codeElement) return;
      const text = codeElement.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.innerHTML;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>`;
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      } catch(e) {}
    });
  });
}

// 5. Quick Start Tabs
function initQuickStartTabs() {
  const buttons = document.querySelectorAll('[data-tab-target]');
  const contents = document.querySelectorAll('[data-tab-content]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-tab-target');

      contents.forEach((content) => {
        if (content.getAttribute('data-tab-content') === target) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });

      buttons.forEach((btn) => {
        if (btn === button) {
          btn.classList.remove('text-slate-400');
          btn.classList.add('bg-slate-800', 'text-white');
        } else {
          btn.classList.remove('bg-slate-800', 'text-white');
          btn.classList.add('text-slate-400');
        }
      });
    });
  });
}

// Initialize all
function initAll() {
  initTerminalLoop();
  initTiltCards();
  initScrollReveal();
  initCopyButtons();
  initQuickStartTabs();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
