(function () {
  const content = window.PORTFOLIO_CONTENT || null;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const themes = ["terminal", "lord", "monarch"];
  const themeLabels = {
    terminal: "Terminal",
    lord: "Lord",
    monarch: "Monarch"
  };
  const state = {
    motionPaused: prefersReducedMotion.matches,
    theme: readPreferredTheme(),
    activityIndex: 0,
    activityTimer: null,
    animationFrame: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function readPreferredTheme() {
    try {
      const stored = window.localStorage.getItem("portfolio-theme");
      if (stored === "red") return "lord";
      return themes.includes(stored) ? stored : "terminal";
    } catch (_error) {
      return "terminal";
    }
  }

  function writePreferredTheme() {
    try {
      window.localStorage.setItem("portfolio-theme", state.theme);
    } catch (_error) {
      // Local files or strict browser settings may block storage; the toggle still works for the current page.
    }
  }

  function cssVar(name) {
    return window.getComputedStyle(document.body).getPropertyValue(name).trim();
  }

  function canvasPalette() {
    return ["--cyan", "--green", "--pink", "--amber", "--blue"].map(cssVar).filter(Boolean);
  }

  function applyTheme({ persist = false, refreshCanvas = false } = {}) {
    document.body.classList.toggle("theme-lord", state.theme === "lord");
    document.body.classList.toggle("theme-monarch", state.theme === "monarch");
    if (persist) writePreferredTheme();
    if (refreshCanvas && !state.motionPaused) {
      stopCanvas();
      startCanvas();
    }
  }

  function el(tag, options = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key === "html") node.innerHTML = value;
      else if (key === "dataset") Object.assign(node.dataset, value);
      else node.setAttribute(key, value);
    });
    children.filter(Boolean).forEach((child) => {
      node.append(child.nodeType ? child : document.createTextNode(child));
    });
    return node;
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node && value) node.textContent = value;
  }

  function joinSearchTerms(...parts) {
    return parts.flat(4).filter(Boolean).join(" ").toLowerCase();
  }

  function render() {
    document.title = `${content.profile.name} | ${content.profile.role}`;
    const description = $('meta[name="description"]');
    if (description) description.setAttribute("content", content.profile.summary);

    setText("#brand-name", content.profile.handle);
    setText("#profile-kicker", content.profile.kicker);
    setText("#hero-title", content.profile.name);
    $("#hero-title").dataset.text = content.profile.name;
    setText("#profile-role", content.profile.role);
    setText("#profile-summary", content.profile.summary);
    setText("#terminal-whoami", content.profile.handle);
    setText("#contact-copy", content.profile.contactCopy);
    setText("#footer-line", content.profile.footer);

    renderActions();
    renderSignals();
    renderExperience();
    renderSkills();
    renderProjects();
    renderWriteups();
    renderContact();
    setupSearch();
    setupReveal();
    renderActivity(true);
  }

  function renderActions() {
    const target = $("#hero-actions");
    target.replaceChildren(
      ...content.profile.actions.map((action) =>
        el("a", { href: action.href, text: action.label, target: isExternal(action.href) ? "_blank" : null, rel: isExternal(action.href) ? "noreferrer" : null })
      )
    );
  }

  function renderSignals() {
    const target = $("#signal-strip");
    target.replaceChildren(
      ...content.signals.map((signal) =>
        el("article", { className: "signal-card reveal", dataset: { search: joinSearchTerms(signal.label, signal.value) } }, [
          el("span", { text: signal.label }),
          el("strong", { text: signal.value })
        ])
      )
    );
  }

  function renderExperience() {
    const target = $("#experience-list");
    target.replaceChildren(
      ...content.experience.map((item) =>
        el("article", { className: "experience-card reveal", dataset: { search: joinSearchTerms(item.role, item.organization, item.period, item.location, item.bullets, item.tags) } }, [
          el("div", { className: "meta" }, [
            el("div", { text: item.period }),
            el("div", { text: item.location })
          ]),
          el("div", {}, [
            el("h4", { className: "card-title", text: item.role }),
            el("p", { className: "card-kicker", text: item.organization }),
            el("ul", { className: "bullet-list" }, item.bullets.map((bullet) => el("li", { text: bullet }))),
            renderTags(item.tags)
          ])
        ])
      )
    );
  }

  function renderSkills() {
    const target = $("#skill-grid");
    target.replaceChildren(
      ...content.skills.map((skill) =>
        el("article", { className: "skill-card reveal", dataset: { search: joinSearchTerms(skill.group, skill.items) } }, [
          el("h4", { className: "card-title", text: skill.group }),
          el("ul", {}, skill.items.map((item) => el("li", { text: item })))
        ])
      )
    );
  }

  function renderProjects() {
    const target = $("#project-grid");
    target.replaceChildren(
      ...content.projects.map((project) =>
        el("article", { className: "project-card reveal", dataset: { search: joinSearchTerms(project.title, project.status, project.summary, project.tags) } }, [
          el("span", { className: "status-pill", text: project.status }),
          el("h3", { className: "card-title", text: project.title }),
          el("p", { text: project.summary }),
          renderTags(project.tags),
          el("a", { className: "card-link", href: project.href, text: project.cta, target: isExternal(project.href) ? "_blank" : null, rel: isExternal(project.href) ? "noreferrer" : null })
        ])
      )
    );
  }

  function renderWriteups() {
    const target = $("#writeup-grid");
    target.replaceChildren(
      ...content.writeups.map((writeup) =>
        el("article", { className: "writeup-card reveal", dataset: { search: joinSearchTerms(writeup.title, writeup.event, writeup.date, writeup.status, writeup.summary, writeup.tags) } }, [
          el("span", { className: "status-pill", text: writeup.status }),
          el("h3", { className: "card-title", text: writeup.title }),
          el("p", { className: "card-kicker", text: `${writeup.event} / ${writeup.date}` }),
          el("p", { text: writeup.summary }),
          renderTags(writeup.tags),
          el("a", { className: "card-link", href: writeup.href, text: writeup.cta, target: isExternal(writeup.href) ? "_blank" : null, rel: isExternal(writeup.href) ? "noreferrer" : null })
        ])
      )
    );
  }

  function renderContact() {
    const target = $("#contact-links");
    target.replaceChildren(
      ...content.contact.map((contact) =>
        el("a", { href: contact.href, text: contact.label, target: isExternal(contact.href) ? "_blank" : null, rel: isExternal(contact.href) ? "noreferrer" : null })
      )
    );
  }

  function renderTags(tags) {
    return el("ul", { className: "tag-list" }, tags.map((tag) => el("li", { text: tag })));
  }

  function setupSearch() {
    const input = $("#command-input");
    const count = $("#query-count");
    const indexed = $$("[data-search]");
    count.textContent = `${indexed.length} indexed`;

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      let visible = 0;
      indexed.forEach((node) => {
        const matched = !query || node.dataset.search.includes(query);
        node.dataset.hidden = String(!matched);
        if (matched) visible += 1;
      });
      count.textContent = query ? `${visible} matched` : `${indexed.length} indexed`;
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "/" && document.activeElement !== input && !isTypingTarget(document.activeElement)) {
        event.preventDefault();
        input.focus();
      }
    });
  }

  function setupReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function setupThemeToggle() {
    const buttons = $$(".hud-btn");
    if (!buttons.length) return;

    const sync = () => {
      buttons.forEach((btn) => {
        const theme = btn.dataset.theme;
        const isActive = state.theme === theme;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedTheme = btn.dataset.theme;
        if (themes.includes(selectedTheme)) {
          state.theme = selectedTheme;
          applyTheme({ persist: true, refreshCanvas: true });
          sync();
        }
      });
    });

    sync();
  }

  function setupMotionToggle() {
    const button = $("#motion-toggle");
    if (!button) return;
    const apply = () => {
      document.body.classList.toggle("motion-paused", state.motionPaused);
      button.setAttribute("aria-pressed", String(state.motionPaused));
      button.textContent = state.motionPaused ? "Resume motion" : "Pause motion";
      if (state.motionPaused) {
        stopCanvas();
        stopActivity();
      } else {
        startCanvas();
        startActivity();
      }
    };

    button.addEventListener("click", () => {
      state.motionPaused = !state.motionPaused;
      apply();
    });

    apply();
  }

  function renderActivity(reset = false) {
    const target = $("#signal-log");
    if (reset) target.replaceChildren();
    const items = content.activity.slice(state.activityIndex, state.activityIndex + 4);
    const wrapped = items.length === 4 ? items : items.concat(content.activity.slice(0, 4 - items.length));
    target.replaceChildren(...wrapped.map((line) => el("li", { text: line })));
    state.activityIndex = (state.activityIndex + 1) % content.activity.length;
  }

  function startActivity() {
    stopActivity();
    state.activityTimer = window.setInterval(() => renderActivity(), 2600);
  }

  function stopActivity() {
    if (state.activityTimer) window.clearInterval(state.activityTimer);
    state.activityTimer = null;
  }

  function startCanvas() {
    if (state.motionPaused || state.animationFrame) return;

    const canvas = $("#signal-canvas");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const glyphsByTheme = {
      terminal: "01ABCDEF{}[]/<>#$",
      lord: "01LORDHK{}[]/<>#$",
      monarch: "01RANKGATEKEY[]<>/*"
    };
    const glyphs = glyphsByTheme[state.theme] || glyphsByTheme.terminal;
    const palette = canvasPalette();
    const packetCount = state.theme === "monarch" ? 58 : 82;
    const packets = Array.from({ length: packetCount }, () => makePacket(false, window.innerWidth, window.innerHeight, palette));
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      context.fillStyle = cssVar("--canvas-wash") || "rgba(5, 6, 9, 0.52)";
      context.fillRect(0, 0, width, height);

      drawGrid(context, width, height);
      packets.forEach((packet) => {
        packet.x += packet.vx;
        packet.y += packet.vy;

        if (state.theme === "monarch") {
          packet.angle = (packet.angle || 0) + 0.005;
        }

        let outOfBounds = false;
        if (state.theme === "lord" || state.theme === "monarch") {
          if (packet.y < -30 || packet.x < -30 || packet.x > width + 30) {
            outOfBounds = true;
          }
        } else {
          if (packet.x > width + 80 || packet.y > height + 80 || packet.y < -80) {
            outOfBounds = true;
          }
        }

        if (outOfBounds) {
          Object.assign(packet, makePacket(true, width, height, palette));
        }

        context.globalAlpha = packet.alpha;

        if (state.theme === "lord") {
          // Render glowing fiery embers with trailing wind-trace gradients
          context.beginPath();
          const tailGrad = context.createLinearGradient(packet.x, packet.y, packet.x - packet.vx * 3, packet.y - packet.vy * 3);
          tailGrad.addColorStop(0, packet.color);
          tailGrad.addColorStop(1, "rgba(255, 30, 30, 0)");
          context.strokeStyle = tailGrad;
          context.lineWidth = packet.size / 3.5;
          context.lineCap = "round";
          context.moveTo(packet.x, packet.y);
          context.lineTo(packet.x - packet.vx * 3.5, packet.y - packet.vy * 3.5);
          context.stroke();

          // Combustion core
          context.beginPath();
          context.arc(packet.x, packet.y, packet.size / 4.5, 0, Math.PI * 2);
          context.fillStyle = "#fffcf9";
          context.shadowColor = packet.color;
          context.shadowBlur = 14;
          context.fill();
          context.shadowBlur = 0;
        } else if (state.theme === "monarch") {
          // Render crackling, jagged neon electrical discharge arcs
          context.beginPath();
          context.strokeStyle = packet.color;
          context.lineWidth = 1.2 + Math.random() * 0.8;
          context.shadowColor = packet.color;
          context.shadowBlur = 14;
          context.lineCap = "round";
          context.lineJoin = "round";
          
          context.moveTo(packet.x, packet.y);
          
          let cx = packet.x;
          let cy = packet.y;
          const segmentCount = 3 + Math.floor(Math.random() * 2);
          for (let i = 0; i < segmentCount; i++) {
            cx += -8 + Math.random() * 16;
            cy += -packet.size * 0.85 + Math.random() * 4;
            context.lineTo(cx, cy);
          }
          context.stroke();
          
          if (Math.random() > 0.45) {
            context.beginPath();
            context.arc(packet.x, packet.y, 1.8, 0, Math.PI * 2);
            context.fillStyle = "#ffffff";
            context.fill();
          }
          context.shadowBlur = 0;
        } else {
          context.fillStyle = packet.color;
          context.font = `${packet.size}px Cascadia Code, Consolas, monospace`;
          context.fillText(glyphs[packet.glyph], packet.x, packet.y);
          context.globalAlpha = packet.alpha * 0.38;
          context.fillRect(packet.x - 42, packet.y + 7, 34, 1);
        }
      });

      context.globalAlpha = 1;
      state.animationFrame = window.requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    draw();
  }

  function stopCanvas() {
    if (state.animationFrame) window.cancelAnimationFrame(state.animationFrame);
    state.animationFrame = null;
    const canvas = $("#signal-canvas");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawGrid(context, width, height) {
    const spacing = 82;
    context.globalAlpha = 0.24;
    context.strokeStyle = cssVar("--grid-glow") || "rgba(98, 255, 226, 0.16)";
    context.lineWidth = 1;
    context.beginPath();
    for (let x = 0; x < width; x += spacing) {
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }
    for (let y = 0; y < height; y += spacing) {
      context.moveTo(0, y);
      context.lineTo(width, y);
    }
    context.stroke();
    context.globalAlpha = 1;
  }

  function makePacket(fromEdge = false, width = window.innerWidth, height = window.innerHeight, colors = canvasPalette()) {
    if (!colors.length) colors = ["#62ffe2", "#9dff6f", "#ff4fd8", "#ffd166", "#7aa8ff"];
    const theme = state.theme;

    if (theme === "lord") {
      return {
        x: Math.random() * width,
        y: fromEdge ? height + 20 + Math.random() * 50 : Math.random() * height,
        vx: -0.25 + Math.random() * 0.5,
        vy: -0.6 - Math.random() * 1.2,
        size: 4 + Math.random() * 10,
        color: ["#ff1e1e", "#ffaa00", "#ff6200", "#ff0044"][Math.floor(Math.random() * 4)],
        alpha: 0.25 + Math.random() * 0.65,
        weight: 1
      };
    } else if (theme === "monarch") {
      return {
        x: Math.random() * width,
        y: fromEdge ? height + 30 + Math.random() * 50 : Math.random() * height,
        vx: -0.15 + Math.random() * 0.3,
        vy: -1.2 - Math.random() * 1.8,
        size: 6 + Math.random() * 12,
        color: ["#52cfff", "#aa77ff", "#6f4eff", "#2d6eff"][Math.floor(Math.random() * 4)],
        alpha: 0.3 + Math.random() * 0.55,
        angle: Math.random() * Math.PI,
        weight: 1
      };
    } else {
      return {
        x: fromEdge ? -80 - Math.random() * 50 : Math.random() * width,
        y: Math.random() * height,
        vx: 0.45 + Math.random() * 0.9,
        vy: -0.05 + Math.random() * 0.1,
        size: 9 + Math.random() * 10,
        glyph: Math.floor(Math.random() * 16),
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.2 + Math.random() * 0.5
      };
    }
  }

  function isExternal(href) {
    return /^https?:\/\//.test(href);
  }

  function isTypingTarget(node) {
    if (!node) return false;
    return ["INPUT", "TEXTAREA", "SELECT"].includes(node.tagName) || node.isContentEditable;
  }

  applyTheme();

  if (content) {
    render();
    setupThemeToggle();
    setupMotionToggle();
  } else if (!state.motionPaused) {
    startCanvas();
  }
})();
