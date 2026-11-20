/**
 * THE SDG RANKING - Multi-Page Controller & Static Router
 * Supports SDG Overview, Target Pages, and Indicator Pages with Breadcrumbs
 */

let SDG_DATA = {};

// Active state
let currentRoute = {
  type: "sdg",
  sdg: "17",
  target: null,
  indicator: null
};

// DOM Elements
const navCards = document.querySelectorAll(".sdg-nav-card");
const contentContainer = document.getElementById("sdg-content-area");
const breadcrumbContainer = document.getElementById("site-breadcrumb");
const mainHeadingTitle = document.getElementById("main-heading-title");

/**
 * SVG for box with arrow icon (clean icon-only view button)
 */
const BOX_ARROW_ICON_SVG = `
  <svg class="box-arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
`;

/**
 * Generate a clean URL slug from ID
 */
function slugify(str) {
  if (!str) return "";
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

/**
 * Parse an indicator entry into structured details
 */
function parseIndicator(ind) {
  const text = typeof ind === "string" ? ind : (ind.text || "");
  const match = text.match(/^((?:\d+(?:\.[a-zA-Z0-9]+)+(?:\s+to\s+\d+(?:\.[a-zA-Z0-9]+)+)?)|[A-Z]\.)\s*(.*)$/);

  if (match) {
    return {
      number: match[1],
      title: match[2] || match[1],
      raw: text,
      subItems: (typeof ind === "object" && ind.subItems) ? ind.subItems : []
    };
  }

  return {
    number: "",
    title: text,
    raw: text,
    subItems: (typeof ind === "object" && ind.subItems) ? ind.subItems : []
  };
}

/**
 * Format point number inside indicator text to bold
 */
function formatPointText(text) {
  if (!text) return "";
  const escaped = escapeHtml(text);
  const pointRegex = /^((?:\d+(?:\.[a-zA-Z0-9]+)+(?:\s+to\s+\d+(?:\.[a-zA-Z0-9]+)+)?)|[A-Z]\.)(\s+|$)/;
  return escaped.replace(pointRegex, (match, point, space) => {
    return `<strong class="indicator-point-num">${point}</strong>${space}`;
  });
}

/**
 * Build URL for a route
 */
function buildRouteUrl(route) {
  const base = window.location.pathname.replace(/\/$/, "");
  // Using query params ensures full cross-browser compatibility across static hosts
  if (route.type === "indicator") {
    return `?sdg=${encodeURIComponent(route.sdg)}&target=${encodeURIComponent(route.target)}&indicator=${encodeURIComponent(route.indicator)}`;
  }
  if (route.type === "target") {
    return `?sdg=${encodeURIComponent(route.sdg)}&target=${encodeURIComponent(route.target)}`;
  }
  return `?sdg=${encodeURIComponent(route.sdg)}`;
}

/**
 * Render Breadcrumbs
 */
function updateBreadcrumbs(crumbs) {
  if (!breadcrumbContainer) return;

  const crumbsHtml = crumbs.map((crumb, idx) => {
    const isLast = idx === crumbs.length - 1;
    if (isLast) {
      return `<span class="current">${escapeHtml(crumb.label)}</span>`;
    }
    return `
      <a href="${escapeHtml(crumb.url || "#")}" 
         class="breadcrumb-link" 
         data-route="${escapeHtml(crumb.route)}"
         ${crumb.sdg ? `data-sdg="${escapeHtml(crumb.sdg)}"` : ""}
         ${crumb.target ? `data-target="${escapeHtml(crumb.target)}"` : ""}
         ${crumb.indicator ? `data-indicator="${escapeHtml(crumb.indicator)}"` : ""}
      >${escapeHtml(crumb.label)}</a>
      <span class="sep">/</span>
    `;
  }).join("");

  breadcrumbContainer.innerHTML = crumbsHtml;
}

/**
 * Render SDG Overview Page (Displays targets + indicators directly without dropdown)
 */
function renderSdgMainView(sdg) {
  const crumbs = [
    { label: "Home", route: "home", url: "./" },
    { label: "THE SDG Ranking", route: "sdg", sdg: sdg.num, url: buildRouteUrl({ type: "sdg", sdg: sdg.num }) },
    { label: `SDG ${sdg.num} - ${sdg.name}` }
  ];
  updateBreadcrumbs(crumbs);

  if (mainHeadingTitle) {
    mainHeadingTitle.textContent = "THE SDG Ranking";
  }

  const targetsHtml = (sdg.targets || []).map(target => {
    const hasIndicators = target.indicators && target.indicators.length > 0;

    const indicatorsListHtml = hasIndicators
      ? target.indicators.map(ind => {
          const parsed = parseIndicator(ind);
          const indId = parsed.number || parsed.title;
          const indUrl = buildRouteUrl({ type: "indicator", sdg: sdg.num, target: target.id, indicator: indId });

          let subItemsHtml = "";
          if (parsed.subItems && parsed.subItems.length > 0) {
            subItemsHtml = parsed.subItems.map(sub => {
              const subParsed = parseIndicator(sub);
              const subId = subParsed.number || subParsed.title;
              const subUrl = buildRouteUrl({ type: "indicator", sdg: sdg.num, target: target.id, indicator: subId });
              return `
                <div class="indicator-item indicator-subitem">
                  <div class="indicator-item-left">
                    <span class="indicator-bullet indicator-bullet-sub"></span>
                    <span class="indicator-text">${formatPointText(subParsed.raw)}</span>
                  </div>
                  <div class="indicator-item-right">
                    <a href="${subUrl}"
                       class="icon-view-btn"
                       title="View ${escapeHtml(subId)}"
                       data-route="indicator"
                       data-sdg="${escapeHtml(sdg.num)}"
                       data-target="${escapeHtml(target.id)}"
                       data-indicator="${escapeHtml(subId)}">
                      ${BOX_ARROW_ICON_SVG}
                    </a>
                  </div>
                </div>
              `;
            }).join("");
          }

          return `
            <div class="indicator-item">
              <div class="indicator-item-left">
                <span class="indicator-bullet"></span>
                <span class="indicator-text">${formatPointText(parsed.raw)}</span>
              </div>
              <div class="indicator-item-right">
                <a href="${indUrl}"
                   class="icon-view-btn"
                   title="View ${escapeHtml(indId)}"
                   data-route="indicator"
                   data-sdg="${escapeHtml(sdg.num)}"
                   data-target="${escapeHtml(target.id)}"
                   data-indicator="${escapeHtml(indId)}">
                  ${BOX_ARROW_ICON_SVG}
                </a>
              </div>
            </div>
            ${subItemsHtml}
          `;
        }).join("")
      : "";

    const targetUrl = buildRouteUrl({ type: "target", sdg: sdg.num, target: target.id });

    return `
      <article class="target-row" data-target-id="${escapeHtml(target.id)}">
        <div class="target-header-meta">
          <span class="target-label">Target</span>
          <span class="target-id">${escapeHtml(target.id)}</span>
        </div>

        <div class="target-desc-row">
          <div class="target-desc-text">${escapeHtml(target.desc)}</div>
          <div class="target-actions">
            <a href="${targetUrl}"
               class="icon-view-btn"
               title="View Target ${escapeHtml(target.id)}"
               data-route="target"
               data-sdg="${escapeHtml(sdg.num)}"
               data-target="${escapeHtml(target.id)}">
              ${BOX_ARROW_ICON_SVG}
            </a>
          </div>
        </div>

        ${hasIndicators ? `
          <div class="indicators-content">
            ${indicatorsListHtml}
          </div>
        ` : ""}
      </article>
    `;
  }).join("");

  contentContainer.innerHTML = `
    <div class="content-animated">
      <div class="detail-header-card">
        <h2 class="detail-sub-header ${sdg.num === "17" ? "sdg-17-sub-header" : ""}">
          <span class="detail-number-prefix ${sdg.num === "17" ? "sdg-17-prefix" : ""}">
            ${escapeHtml(sdg.num)}
          </span>
          <span class="detail-title-text ${sdg.num === "17" ? "sdg-17-title" : ""}">
            ${escapeHtml(sdg.title)}
          </span>
        </h2>

        ${sdg.description ? `
          <div class="detail-intro-block">
            <p class="detail-intro-text">${escapeHtml(sdg.description)}</p>
          </div>
        ` : ""}
      </div>

      <div class="targets-list">
        ${targetsHtml}
      </div>
    </div>
  `;
}

/**
 * Render Target Webpage
 */
function renderTargetView(sdg, targetId) {
  const target = (sdg.targets || []).find(t => String(t.id) === String(targetId) || slugify(t.id) === slugify(targetId));

  if (!target) {
    renderSdgMainView(sdg);
    return;
  }

  const crumbs = [
    { label: "Home", route: "home", url: "./" },
    { label: "THE SDG Ranking", route: "sdg", sdg: sdg.num, url: buildRouteUrl({ type: "sdg", sdg: sdg.num }) },
    { label: `SDG ${sdg.num}`, route: "sdg", sdg: sdg.num, url: buildRouteUrl({ type: "sdg", sdg: sdg.num }) },
    { label: `Target ${target.id}` }
  ];
  updateBreadcrumbs(crumbs);

  if (mainHeadingTitle) {
    mainHeadingTitle.textContent = `Target ${target.id}`;
  }

  const indicatorsListHtml = (target.indicators || []).map(ind => {
    const parsed = parseIndicator(ind);
    const indId = parsed.number || parsed.title;
    const indUrl = buildRouteUrl({ type: "indicator", sdg: sdg.num, target: target.id, indicator: indId });

    return `
      <div class="indicator-item">
        <div class="indicator-item-left">
          <span class="indicator-bullet"></span>
          <span class="indicator-text">${formatPointText(parsed.raw)}</span>
        </div>
        <div class="indicator-item-right">
          <a href="${indUrl}"
             class="icon-view-btn"
             title="View ${escapeHtml(indId)}"
             data-route="indicator"
             data-sdg="${escapeHtml(sdg.num)}"
             data-target="${escapeHtml(target.id)}"
             data-indicator="${escapeHtml(indId)}">
            ${BOX_ARROW_ICON_SVG}
          </a>
        </div>
      </div>
    `;
  }).join("");

  contentContainer.innerHTML = `
    <div class="subpage-container">
      <div>
        <a href="${buildRouteUrl({ type: "sdg", sdg: sdg.num })}" 
           class="back-nav-link" 
           data-route="sdg" 
           data-sdg="${escapeHtml(sdg.num)}">
          ← Back to SDG ${escapeHtml(sdg.num)} (${escapeHtml(sdg.name)})
        </a>
      </div>

      <div class="subpage-header-card">
        <span class="subpage-badge">Target ${escapeHtml(target.id)}</span>
        <h2 class="subpage-title">${escapeHtml(target.desc)}</h2>
        <p class="subpage-subtitle">SDG ${escapeHtml(sdg.num)}: ${escapeHtml(sdg.name)}</p>
      </div>

      <div class="subpage-content-card">
        <h3>Target Indicators & Performance Metrics</h3>
        <p class="writeup-prose" style="margin-bottom: 16px; color: #64748b; font-size: 13.5px;">
          Below are the specific indicators monitored under Target ${escapeHtml(target.id)}. Click on any indicator's view icon to examine detailed institutional records, policies, and supporting evidence.
        </p>

        <div class="indicators-content">
          ${indicatorsListHtml || "<p style='color:#94a3b8;font-size:13px;'>No specific sub-indicators listed for this target.</p>"}
        </div>
      </div>

      <div class="subpage-footer-nav">
        <a href="${buildRouteUrl({ type: "sdg", sdg: sdg.num })}" 
           class="nav-btn outline" 
           data-route="sdg" 
           data-sdg="${escapeHtml(sdg.num)}">
          ← Back to SDG ${escapeHtml(sdg.num)} Overview
        </a>
      </div>
    </div>
  `;
}

/**
 * Render Indicator Webpage
 */
function renderIndicatorView(sdg, targetId, indicatorId) {
  const target = (sdg.targets || []).find(t => String(t.id) === String(targetId) || slugify(t.id) === slugify(targetId));

  if (!target) {
    renderSdgMainView(sdg);
    return;
  }

  // Find indicator in target
  let foundIndicator = null;
  (target.indicators || []).forEach(ind => {
    const parsed = parseIndicator(ind);
    const indSlug = slugify(parsed.number) || slugify(parsed.title);
    if (parsed.number === indicatorId || parsed.title === indicatorId || parsed.raw === indicatorId || indSlug === slugify(indicatorId)) {
      foundIndicator = parsed;
    } else if (parsed.subItems) {
      parsed.subItems.forEach(sub => {
        const subParsed = parseIndicator(sub);
        const subSlug = slugify(subParsed.number) || slugify(subParsed.title);
        if (subParsed.number === indicatorId || subParsed.title === indicatorId || subParsed.raw === indicatorId || subSlug === slugify(indicatorId)) {
          foundIndicator = subParsed;
        }
      });
    }
  });

  const displayPoint = foundIndicator ? (foundIndicator.number || indicatorId) : indicatorId;
  const displayTitle = foundIndicator ? foundIndicator.title : indicatorId;

  const crumbs = [
    { label: "Home", route: "home", url: "./" },
    { label: "THE SDG Ranking", route: "sdg", sdg: sdg.num, url: buildRouteUrl({ type: "sdg", sdg: sdg.num }) },
    { label: `SDG ${sdg.num}`, route: "sdg", sdg: sdg.num, url: buildRouteUrl({ type: "sdg", sdg: sdg.num }) },
    { label: `Target ${target.id}`, route: "target", sdg: sdg.num, target: target.id, url: buildRouteUrl({ type: "target", sdg: sdg.num, target: target.id }) },
    { label: `${displayPoint}` }
  ];
  updateBreadcrumbs(crumbs);

  if (mainHeadingTitle) {
    mainHeadingTitle.textContent = `${displayPoint}`;
  }

  contentContainer.innerHTML = `
    <div class="subpage-container">
      <div>
        <a href="${buildRouteUrl({ type: "target", sdg: sdg.num, target: target.id })}" 
           class="back-nav-link" 
           data-route="target" 
           data-sdg="${escapeHtml(sdg.num)}" 
           data-target="${escapeHtml(target.id)}">
          ← Back to Target ${escapeHtml(target.id)}
        </a>
      </div>

      <div class="subpage-header-card">
        <span class="subpage-badge">Indicator ${escapeHtml(displayPoint)}</span>
        <h2 class="subpage-title">${escapeHtml(displayTitle)}</h2>
        <p class="subpage-subtitle">
          SDG ${escapeHtml(sdg.num)} (${escapeHtml(sdg.name)}) &nbsp;•&nbsp; Target ${escapeHtml(target.id)}: ${escapeHtml(target.desc)}
        </p>
      </div>

      <div class="subpage-content-card">
        <h3>Indicator Details & Scope</h3>
        <div class="writeup-prose">
          <p>
            This section documents the university's institutional performance, policies, and community outreach addressing 
            <strong>${escapeHtml(displayTitle)}</strong> in accordance with Times Higher Education (THE) Impact Rankings criteria.
          </p>
          <p>
            The dedicated coordinator team reviews annual progress, cross-departmental initiatives, and external stakeholder partnerships to ensure full transparency and compliance across all reported metrics.
          </p>
        </div>
      </div>

      <div class="subpage-content-card">
        <h3>Supporting Evidences & Records</h3>
        <div class="evidences-grid">
          <div class="evidence-box">
            <div class="evidence-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div class="evidence-info">
              <h4>Institutional Policies & Reports</h4>
              <p>Approved statutes, university policies, and verified documentation.</p>
            </div>
          </div>

          <div class="evidence-box">
            <div class="evidence-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div class="evidence-info">
              <h4>Activity & Event Evidence</h4>
              <p>Geotagged photographs, program reports, and community outreach.</p>
            </div>
          </div>

          <div class="evidence-box">
            <div class="evidence-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <div class="evidence-info">
              <h4>Impact & Metric Benchmarks</h4>
              <p>Audited figures, beneficiary statistics, and progress ratios.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="subpage-footer-nav">
        <a href="${buildRouteUrl({ type: "target", sdg: sdg.num, target: target.id })}" 
           class="nav-btn outline" 
           data-route="target" 
           data-sdg="${escapeHtml(sdg.num)}" 
           data-target="${escapeHtml(target.id)}">
          ← Back to Target ${escapeHtml(target.id)}
        </a>

        <a href="${buildRouteUrl({ type: "sdg", sdg: sdg.num })}" 
           class="nav-btn solid" 
           data-route="sdg" 
           data-sdg="${escapeHtml(sdg.num)}">
          SDG ${escapeHtml(sdg.num)} Overview →
        </a>
      </div>
    </div>
  `;
}

/**
 * Navigate to route and update URL
 */
function navigateTo(route, push = true) {
  currentRoute = route;

  if (push) {
    const url = buildRouteUrl(route);
    history.pushState(route, "", url);
  }

  const sdg = SDG_DATA[route.sdg] || SDG_DATA["17"] || Object.values(SDG_DATA)[0];

  if (!sdg) return;

  // Set theme colors
  document.documentElement.style.setProperty("--theme-color", sdg.color);
  document.documentElement.style.setProperty("--theme-light", sdg.colorLight);
  document.documentElement.style.setProperty("--theme-border", sdg.colorBorder);

  // Update Left Navigation Cards
  navCards.forEach(card => {
    const cardKey = card.getAttribute("data-sdg");
    const isActive = cardKey === sdg.num;
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  // Render proper view
  if (route.type === "indicator" && route.target && route.indicator) {
    renderIndicatorView(sdg, route.target, route.indicator);
  } else if (route.type === "target" && route.target) {
    renderTargetView(sdg, route.target);
  } else {
    renderSdgMainView(sdg);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Parse current URL location to determine initial route
 * Supports query params (?sdg=17&target=17.1...), clean path (/sdg/17/17-1/...), and hash
 */
function parseCurrentUrlRoute() {
  const params = new URLSearchParams(window.location.search);
  const sdgParam = params.get("sdg");
  const targetParam = params.get("target");
  const indicatorParam = params.get("indicator");

  if (sdgParam) {
    if (targetParam && indicatorParam) {
      return { type: "indicator", sdg: sdgParam, target: targetParam, indicator: indicatorParam };
    }
    if (targetParam) {
      return { type: "target", sdg: sdgParam, target: targetParam };
    }
    return { type: "sdg", sdg: sdgParam };
  }

  // Parse path-based routes: /sdg/:sdg/:target/:indicator
  const path = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
  const parts = path.split("/").filter(Boolean);
  const sdgIdx = parts.indexOf("sdg");

  if (sdgIdx !== -1 && parts.length > sdgIdx + 1) {
    const sdgId = parts[sdgIdx + 1];
    const targetSlug = parts[sdgIdx + 2];
    const indicatorSlug = parts[sdgIdx + 3];

    if (indicatorSlug) {
      return { type: "indicator", sdg: sdgId, target: targetSlug, indicator: indicatorSlug };
    }
    if (targetSlug) {
      return { type: "target", sdg: sdgId, target: targetSlug };
    }
    return { type: "sdg", sdg: sdgId };
  }

  // Fallback to hash
  const hash = window.location.hash.replace("#sdg-", "");
  if (hash && SDG_DATA[hash]) {
    return { type: "sdg", sdg: hash };
  }

  return { type: "sdg", sdg: "17" in SDG_DATA ? "17" : Object.keys(SDG_DATA)[0] };
}

/**
 * Global link click handler for internal SPA routing
 */
function handleLinkClick(e) {
  const targetLink = e.target.closest("a[data-route]");
  if (!targetLink) return;

  e.preventDefault();

  const routeType = targetLink.getAttribute("data-route");
  const sdg = targetLink.getAttribute("data-sdg") || currentRoute.sdg || "17";
  const target = targetLink.getAttribute("data-target");
  const indicator = targetLink.getAttribute("data-indicator");

  if (routeType === "indicator") {
    navigateTo({ type: "indicator", sdg, target, indicator });
  } else if (routeType === "target") {
    navigateTo({ type: "target", sdg, target });
  } else if (routeType === "sdg" || routeType === "home") {
    navigateTo({ type: "sdg", sdg });
  }
}

/**
 * Load SDG data from embedded script or fetch
 */
async function loadSdgData() {
  const embeddedScript = document.getElementById("sdg-embedded-data");
  if (embeddedScript && embeddedScript.textContent.trim()) {
    try {
      return JSON.parse(embeddedScript.textContent);
    } catch (e) {
      console.warn("Failed to parse embedded data:", e);
    }
  }

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  let prefix = "./";
  if (pathParts.length > 0) {
    const lastIsFile = pathParts[pathParts.length - 1].includes(".");
    const dirDepth = lastIsFile ? pathParts.length - 1 : pathParts.length;
    if (dirDepth > 0) {
      prefix = "../".repeat(dirDepth);
    }
  }

  const response = await fetch(prefix + "sdg_data.json?t=" + Date.now(), { cache: "no-store" });
  if (!response.ok) throw new Error("Status: " + response.status);
  return await response.json();
}

/**
 * Initialize application
 */
async function init() {
  try {
    SDG_DATA = await loadSdgData();

    // Bind Sidebar Card Click Events
    navCards.forEach(card => {
      card.addEventListener("click", () => {
        const key = card.getAttribute("data-sdg");
        if (key) {
          navigateTo({ type: "sdg", sdg: key });
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Listen to all link clicks
    document.addEventListener("click", handleLinkClick);

    // Listen to browser popstate (back/forward)
    window.addEventListener("popstate", (e) => {
      if (e.state) {
        navigateTo(e.state, false);
      } else {
        navigateTo(parseCurrentUrlRoute(), false);
      }
    });

    // Initial render
    const initialRoute = parseCurrentUrlRoute();
    navigateTo(initialRoute, false);

  } catch (error) {
    console.error("Initialization error:", error);
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div style="padding:25px;color:#b91c1c;">
          <h3>Unable to load SDG data</h3>
          <p>${escapeHtml(error.message)}</p>
        </div>
      `;
    }
  }
}

/**
 * Safe HTML escaping
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", init);
