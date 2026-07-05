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

  async function appendLine(container, text) {
    const line = document.createElement('div');
    line.className = 'terminal-line mb-1 text-slate-400';
    
    let html = text;
    html = html.replace(/(GET\s+)/g, '<span class="text-amber-400">$1</span>');
    html = html.replace(/(POST\s+)/g, '<span class="text-purple-400">$1</span>');
    html = html.replace(/(200 OK)/g, '<span class="text-emerald-400">$1</span>');
    html = html.replace(/(INFO:)/g, '<span class="text-blue-400">$1</span>');
    html = html.replace(/(\b\d{2}:\d{2}:\d{2}\b)/g, '<span class="text-slate-600">$1</span>');
    html = html.replace(/(\b\d+ms\b)/g, '<span class="text-slate-500">$1</span>');
    
    line.innerHTML = html;
    container.appendChild(line);
    await sleep(150);
  }

  async function runTerminalLoop(container) {
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
      await appendLine(container, log);
      await sleep(400);
    }
  }

  document.querySelectorAll('[data-terminal-loop]').forEach(runTerminalLoop);
}

// 2. Hover Tilt
function initTiltCards() {
  if (motionReduced) return;

  document.querySelectorAll('[data-tilt-card]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const angleX = (yc - y) / 10;
      const angleY = (x - xc) / 10;
      card.style.setProperty('--rx', `${angleX}deg`);
      card.style.setProperty('--ry', `${angleY}deg`);
      card.style.transform = `perspective(900px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-3px)`;
    });
    
    card.addEventListener('mouseleave', () => {
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
