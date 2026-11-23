import staticSdgData from "./sdg_data.json";

/**
 * THE SDG RANKING - Multi-Page Controller & Static Router
 * Flow:
 * 1. logo (Home View - 4 logos horizontally centered)
 * 2. 1 details (SDG Overview - SDG description, target list, switcher)
 * 3. 1.1 details (Target View - Target metrics, annexures, indicators list)
 * 4. 1.1.1 details (Indicator View - Full institutional write-up, data & evidence)
 */

let SDG_DATA = {};

// Active state
let currentRoute = {
  type: "home",
  sdg: null,
  target: null,
  indicator: null
};

// DOM Elements
const contentContainer = document.getElementById("sdg-content-area");
const breadcrumbContainer = document.getElementById("site-breadcrumb");
const mainHeadingTitle = document.getElementById("main-heading-title");

/**
 * SVG for box with arrow icon (clean inline icon-only view button)
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

  const base = {
    subtitle: (typeof ind === "object" && ind.subtitle) ? ind.subtitle : "",
    description: (typeof ind === "object" && ind.description) ? ind.description : null,
    contentBlocks: (typeof ind === "object" && ind.contentBlocks) ? ind.contentBlocks : null,
    url: (typeof ind === "object" && (ind.url || ind.file)) ? (ind.url || ind.file) : "",
    directUrl: (typeof ind === "object" && (ind.directUrl || ind.externalUrl)) ? (ind.directUrl || ind.externalUrl) : "",
    policyName: (typeof ind === "object" && ind.policyName) ? ind.policyName : "",
    subItems: (typeof ind === "object" && ind.subItems) ? ind.subItems : []
  };

  if (match) {
    return {
      ...base,
      number: (typeof ind === "object" && ind.number) ? ind.number : match[1],
      title: (typeof ind === "object" && ind.title) ? ind.title : (match[2] || match[1]),
      raw: text
    };
  }

  return {
    ...base,
    number: (typeof ind === "object" && ind.number) ? ind.number : "",
    title: (typeof ind === "object" && ind.title) ? ind.title : text,
    raw: text
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
  if (route.type === "indicator") {
    return `?sdg=${encodeURIComponent(route.sdg)}&target=${encodeURIComponent(route.target)}&indicator=${encodeURIComponent(route.indicator)}`;
  }
  if (route.type === "target") {
    return `?sdg=${encodeURIComponent(route.sdg)}&target=${encodeURIComponent(route.target)}`;
  }
  if (route.type === "sdg") {
    return `?sdg=${encodeURIComponent(route.sdg)}`;
  }
  return `./`;
}

/**
 * Render Breadcrumbs: Always shows ONLY Home / THE SDG Ranking
 */
function updateBreadcrumbs(sdgNum) {
  if (!breadcrumbContainer) return;
  const targetSdg = sdgNum || (currentRoute && currentRoute.sdg) || "1";
  breadcrumbContainer.innerHTML = `
    <a href="./" class="breadcrumb-link" data-route="home">Home</a>
    <span class="sep">/</span>
    <a href="${buildRouteUrl({ type: 'sdg', sdg: targetSdg })}" 
       class="breadcrumb-link" 
       data-route="sdg" 
       data-sdg="${escapeHtml(targetSdg)}">THE SDG Ranking</a>
  `;
}

/**
 * Render Home View (Initial state: ONLY 4 logos horizontally centered)
 */
function renderHomeView() {
  updateBreadcrumbs();

  if (mainHeadingTitle) {
    mainHeadingTitle.textContent = "THE SDG Ranking";
  }

  // Set default neutral theme
  document.documentElement.style.setProperty("--theme-color", "#0f172a");
  document.documentElement.style.setProperty("--theme-light", "rgba(15, 23, 42, 0.05)");
  document.documentElement.style.setProperty("--theme-border", "rgba(15, 23, 42, 0.15)");

  contentContainer.innerHTML = `
    <div class="home-logos-wrapper content-animated">
      <div class="home-logos-grid" role="region" aria-label="Sustainable Development Goals Selection">
        
        <!-- Card 1: SDG 1 -->
        <a href="?sdg=1" class="home-sdg-card" data-route="sdg" data-sdg="1" title="SDG 1 - No Poverty" aria-label="SDG 1 No Poverty" style="--card-bg: #D80218; --card-glow: rgba(216, 2, 24, 0.4);">
          <img src="images/sdg-1.webp" alt="SDG 1 - No Poverty" loading="eager" />
        </a>

        <!-- Card 2: SDG 4 -->
        <a href="?sdg=4" class="home-sdg-card" data-route="sdg" data-sdg="4" title="SDG 4 - Quality Education" aria-label="SDG 4 Quality Education" style="--card-bg: #BB021A; --card-glow: rgba(187, 2, 26, 0.4);">
          <img src="images/sdg-4.webp" alt="SDG 4 - Quality Education" loading="eager" />
        </a>

        <!-- Card 3: SDG 10 -->
        <a href="?sdg=10" class="home-sdg-card" data-route="sdg" data-sdg="10" title="SDG 10 - Reduced Inequalities" aria-label="SDG 10 Reduced Inequalities" style="--card-bg: #DE0375; --card-glow: rgba(222, 3, 117, 0.4);">
          <img src="images/sdg-10.webp" alt="SDG 10 - Reduced Inequalities" loading="eager" />
        </a>

        <!-- Card 4: SDG 17 -->
        <a href="?sdg=17" class="home-sdg-card" data-route="sdg" data-sdg="17" title="SDG 17 - Partnerships for the Goals" aria-label="SDG 17 Partnerships for the Goals" style="--card-bg: #002763; --card-glow: rgba(0, 39, 99, 0.4);">
          <img src="images/sdg-17.webp" alt="SDG 17 - Partnerships for the Goals" loading="eager" />
        </a>

      </div>
    </div>
  `;
}

/**
 * Render Horizontal Top Switcher for SDG Pages
 */
function renderSdgSwitcherHtml(activeSdgNum) {
  const sdgsList = [
    { num: "1", name: "No Poverty", img: "images/sdg-1.webp", glow: "rgba(216, 2, 24, 0.4)" },
    { num: "4", name: "Quality Education", img: "images/sdg-4.webp", glow: "rgba(187, 2, 26, 0.4)" },
    { num: "10", name: "Reduced Inequalities", img: "images/sdg-10.webp", glow: "rgba(222, 3, 117, 0.4)" },
    { num: "17", name: "Partnerships for the Goals", img: "images/sdg-17.webp", glow: "rgba(0, 39, 99, 0.4)" }
  ];

  return `
    <nav class="sdg-horizontal-nav" role="tablist" aria-label="SDG Switcher">
      ${sdgsList.map(s => `
        <a href="${buildRouteUrl({ type: 'sdg', sdg: s.num })}" 
           class="sdg-nav-pill ${s.num === activeSdgNum ? 'active' : ''}" 
           data-route="sdg" 
           data-sdg="${s.num}" 
           title="SDG ${s.num} - ${s.name}" 
           aria-label="SDG ${s.num} ${s.name}"
           style="--card-glow: ${s.glow};">
          <img src="${s.img}" alt="SDG ${s.num}" loading="lazy" />
        </a>
      `).join("")}
    </nav>
  `;
}

/**
 * Render SDG Overview Page ("1 details")
 * Displays SDG description and the list of targets.
 */
function renderSdgMainView(sdg) {
  updateBreadcrumbs(sdg.num);

  if (mainHeadingTitle) {
    mainHeadingTitle.textContent = "THE SDG Ranking";
  }

  const targetsHtml = (sdg.targets || []).map(target => {
    const hasIndicators = target.indicators && target.indicators.length > 0;

    const indicatorsListHtml = hasIndicators
      ? target.indicators.map(ind => {
        const parsed = parseIndicator(ind);
        const indId = parsed.number || parsed.title;
        const hasDirectPage = ["10.6.7", "10.6.8", "10.6.9"].includes(String(parsed.number));
        const isDirectPdf = !hasDirectPage && ((String(sdg.num) === "10" && String(target.id) === "10.6") || !!parsed.directUrl);
        const targetUrl = (isDirectPdf && (parsed.directUrl || parsed.url || parsed.file))
          ? (parsed.directUrl || parsed.url || parsed.file)
          : buildRouteUrl({ type: "indicator", sdg: sdg.num, target: target.id, indicator: indId });

        let subItemsHtml = "";
        if (parsed.subItems && parsed.subItems.length > 0) {
          subItemsHtml = parsed.subItems.map(sub => {
            const subParsed = parseIndicator(sub);
            const subId = subParsed.number || subParsed.title;
            const subHasDirectPage = ["10.6.7", "10.6.8", "10.6.9"].includes(String(subParsed.number));
            const subDirectPdf = !subHasDirectPage && ((String(sdg.num) === "10" && String(target.id) === "10.6") || !!subParsed.directUrl);
            const subUrl = (subDirectPdf && (subParsed.directUrl || subParsed.url || subParsed.file))
              ? (subParsed.directUrl || subParsed.url || subParsed.file)
              : buildRouteUrl({ type: "indicator", sdg: sdg.num, target: target.id, indicator: subId });
            return `
                <div class="indicator-item indicator-subitem">
                  <div class="indicator-item-left">
                    <span class="indicator-bullet indicator-bullet-sub"></span>
                    <a href="${subUrl}"
                       class="indicator-title-link"
                       title="${subDirectPdf ? `Open PDF: ${escapeHtml(subParsed.policyName || subParsed.raw)}` : `View ${escapeHtml(subId)}`}"
                       ${subDirectPdf ? 'target="_blank" rel="noopener noreferrer"' : `data-route="indicator" data-sdg="${escapeHtml(sdg.num)}" data-target="${escapeHtml(target.id)}" data-indicator="${escapeHtml(subId)}"`}>
                      <span class="indicator-text">${formatPointText(subParsed.raw)}</span>
                      <span class="inline-view-icon">${BOX_ARROW_ICON_SVG}</span>
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
                <a href="${targetUrl}"
                   class="indicator-title-link"
                   title="${isDirectPdf ? `Open PDF: ${escapeHtml(parsed.policyName || parsed.raw)}` : `View ${escapeHtml(indId)}`}"
                   ${isDirectPdf ? 'target="_blank" rel="noopener noreferrer"' : `data-route="indicator" data-sdg="${escapeHtml(sdg.num)}" data-target="${escapeHtml(target.id)}" data-indicator="${escapeHtml(indId)}"`}>
                  <span class="indicator-text">${formatPointText(parsed.raw)}</span>
                  <span class="inline-view-icon">${BOX_ARROW_ICON_SVG}</span>
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
          <span class="target-pipe"></span>
          <span class="target-id">${escapeHtml(target.id)}</span>
        </div>

        <div class="target-desc-row">
          <a href="${targetUrl}"
             class="target-title-link"
             title="View Target ${escapeHtml(target.id)}"
             data-route="target"
             data-sdg="${escapeHtml(sdg.num)}"
             data-target="${escapeHtml(target.id)}">
            <span class="target-desc-text">${escapeHtml(target.desc)}</span>
            <span class="inline-view-icon">${BOX_ARROW_ICON_SVG}</span>
          </a>
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
    <div class="content-animated centered-layout">
      
      <div class="subpage-back-row">
        <a href="./" class="back-nav-link" data-route="home">
          ← Back to All SDGs
        </a>
      </div>

      ${renderSdgSwitcherHtml(sdg.num)}

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
            ${Array.isArray(sdg.description)
        ? sdg.description.map(p => `<p class="detail-intro-text">${escapeHtml(p)}</p>`).join("")
        : sdg.description.split("\n\n").map(p => `<p class="detail-intro-text">${escapeHtml(p)}</p>`).join("")
      }
            ${sdg.url ? `
              <p class="detail-intro-source">
                <a href="${escapeHtml(sdg.url)}" target="_blank" rel="noopener noreferrer" class="detail-intro-link">
                  ${escapeHtml(sdg.url)}
                </a>
              </p>
            ` : ""}
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
 * Render Target Webpage ("1.1 details")
 * Displays Target title, Annexure review tables, and Indicator drilldown list.
 */
function renderTargetView(sdg, targetId) {
  const target = (sdg.targets || []).find(t => String(t.id) === String(targetId) || slugify(t.id) === slugify(targetId));

  if (!target) {
    renderSdgMainView(sdg);
    return;
  }

  updateBreadcrumbs(sdg.num);

  if (mainHeadingTitle) {
    mainHeadingTitle.textContent = "THE SDG Ranking";
  }

  const indicatorsListHtml = (target.indicators || []).map(ind => {
    const parsed = parseIndicator(ind);
    const indId = parsed.number || parsed.title;
    const hasDirectPage = ["10.6.7", "10.6.8", "10.6.9"].includes(String(parsed.number));
    const isDirectPdf = !hasDirectPage && ((String(sdg.num) === "10" && String(target.id) === "10.6") || !!parsed.directUrl);
    const targetUrl = (isDirectPdf && (parsed.directUrl || parsed.url || parsed.file))
      ? (parsed.directUrl || parsed.url || parsed.file)
      : buildRouteUrl({ type: "indicator", sdg: sdg.num, target: target.id, indicator: indId });

    return `
      <div class="indicator-item">
        <div class="indicator-item-left">
          <span class="indicator-bullet"></span>
          <a href="${targetUrl}"
             class="indicator-title-link"
             title="${isDirectPdf ? `Open PDF: ${escapeHtml(parsed.policyName || parsed.raw)}` : `View ${escapeHtml(indId)}`}"
             ${isDirectPdf ? 'target="_blank" rel="noopener noreferrer"' : `data-route="indicator" data-sdg="${escapeHtml(sdg.num)}" data-target="${escapeHtml(target.id)}" data-indicator="${escapeHtml(indId)}"`}>
            <span class="indicator-text">${formatPointText(parsed.raw)}</span>
            <span class="inline-view-icon">${BOX_ARROW_ICON_SVG}</span>
          </a>
        </div>
      </div>
    `;
  }).join("");

  let metricsTableHtml = "";
  if (target.metricsTable && target.metricsTable.length > 0) {
    metricsTableHtml = `
      <div class="subpage-content-card">
        <h3>Research on Poverty Summary ${target.annexure ? `(${escapeHtml(target.annexure)})` : ""}</h3>
        <div class="data-table-container">
          <table class="data-grid-table">
            <thead>
              <tr>
                <th style="width: 70%;">Publication / Citation Metric</th>
                <th class="col-center" style="width: 30%;">Institutional Value</th>
              </tr>
            </thead>
            <tbody>
              ${target.metricsTable.map(m => `
                <tr>
                  <td><strong>${escapeHtml(m.metric)}</strong></td>
                  <td class="col-center"><span class="badge-yes">${escapeHtml(m.value)}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  let evidenceTableHtml = "";
  if (target.evidenceTable && target.evidenceTable.length > 0) {
    evidenceTableHtml = `
      <div class="subpage-content-card">
        <h3>Institutional Evidence & Specificity Review ${target.annexure ? `(${escapeHtml(target.annexure)})` : ""}</h3>
        <p class="writeup-prose" style="margin-bottom: 12px; color: #64748b; font-size: 13.5px;">
          Times Higher Education (THE) Impact Rankings evidence audit table:
        </p>
        <div class="data-table-container">
          <table class="data-grid-table">
            <thead>
              <tr>
                <th class="col-center" style="width: 60px;">Sl. No</th>
                <th>Evidence Details</th>
                <th class="col-center">Exists</th>
                <th class="col-center">Specificity</th>
                <th class="col-center">Public</th>
                <th class="col-center">Not Provided</th>
              </tr>
            </thead>
            <tbody>
              ${target.evidenceTable.map(row => `
                <tr>
                  <td class="col-center"><strong>${escapeHtml(row.sl)}</strong></td>
                  <td>${escapeHtml(row.details)}</td>
                  <td class="col-center"><span class="badge-yes">${escapeHtml(row.exists)}</span></td>
                  <td class="col-center"><strong>${escapeHtml(row.specificity)}</strong></td>
                  <td class="col-center"><span class="badge-yes">${escapeHtml(row.public)}</span></td>
                  <td class="col-center">${escapeHtml(row.notProvided || "-")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        ${target.url ? `
          <div style="margin-top: 14px;">
            <a href="${escapeHtml(target.url)}" target="_blank" rel="noopener noreferrer" class="nav-btn outline" style="display: inline-flex; align-items: center; gap: 8px;">
              <span>Official University Scholarship Portal</span>
              ${BOX_ARROW_ICON_SVG}
            </a>
          </div>
        ` : ""}
      </div>
    `;
  }

  contentContainer.innerHTML = `
    <div class="subpage-container content-animated centered-layout" data-sdg-num="${escapeHtml(sdg.num)}" data-target-id="${escapeHtml(target.id)}">
      <div class="subpage-back-row">
        <a href="${buildRouteUrl({ type: "sdg", sdg: sdg.num })}" 
           class="back-nav-link" 
           data-route="sdg" 
           data-sdg="${escapeHtml(sdg.num)}">
          ← Back to SDG ${escapeHtml(sdg.num)} (${escapeHtml(sdg.name)})
        </a>
      </div>

      <div class="subpage-header-card">
        <p class="subpage-subtitle" style="margin: 0 0 10px 0; font-size: 13.5px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
          SDG ${escapeHtml(sdg.num)}: ${escapeHtml(sdg.name)}
        </p>
        <div class="target-header-meta" style="margin-bottom: 8px;">
          <span class="target-pipe"></span>
          <span class="target-id">${escapeHtml(target.id)}</span>
          ${target.annexure ? `<span class="target-annexure-tag">(${escapeHtml(target.annexure)})</span>` : ""}
        </div>
        <h2 class="subpage-title">${escapeHtml(target.desc)}</h2>
        ${(String(sdg.num) === "17" ? String(target.id) === "17.3" : !((String(sdg.num) === "1" && (String(target.id) === "1.1" || String(target.id) === "1.4")) || (String(sdg.num) === "4" && String(target.id) === "4.3"))) && (target.url || target.file) ? `
          <div style="margin-top: 14px;">
            <a href="${escapeHtml(target.url || target.file)}" target="_blank" rel="noopener noreferrer" class="file-action-btn" style="padding: 7px 14px; font-size: 13px;" title="View PDF">
              <span>View PDF</span>
              ${BOX_ARROW_ICON_SVG}
            </a>
          </div>
        ` : ""}
      </div>

      ${target.description ? `
        <div class="subpage-content-card">
          <h3>Target Scope & Institutional Leadership</h3>
          <div class="writeup-prose">
            ${Array.isArray(target.description)
        ? target.description.map(p => `<p>${escapeHtml(p)}</p>`).join("")
        : target.description.split("\n\n").map(p => `<p>${escapeHtml(p)}</p>`).join("")
      }
          </div>
        </div>
      ` : ""}

      ${metricsTableHtml}
      ${evidenceTableHtml}

      <div class="subpage-content-card">
        <h3>Target Indicators & Performance Metrics</h3>
        <p class="writeup-prose" style="margin-bottom: 16px; color: #64748b; font-size: 13.5px;">
          Below are the specific indicators monitored under Target ${escapeHtml(target.id)}. Click on any indicator title or icon to examine detailed institutional records, policies, and supporting evidence.
        </p>

        <div class="indicators-content">
          ${indicatorsListHtml || "<p style='color:#94a3b8;font-size:13px;'>No specific sub-indicators listed for this target.</p>"}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render structured content blocks (paragraphs, tables, activities with images, standalone figures)
 */
function renderContentBlocks(blocks) {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks.map(block => {
    if (block.type === "report_banner") {
      return `
        <div class="report-cover-banner">
          ${block.tag ? `<div class="report-cover-tag">${escapeHtml(block.tag)}</div>` : ""}
          <h2 class="report-cover-title">${escapeHtml(block.title)}</h2>
          ${block.subtitle ? `<div class="report-cover-subtitle">${escapeHtml(block.subtitle)}</div>` : ""}
          ${block.meta ? `<div class="report-cover-meta">${escapeHtml(block.meta)}</div>` : ""}
        </div>
      `;
    }
    if (block.type === "section_header") {
      return `
        <div class="report-section-divider">
          ${block.tag ? `<span class="report-section-badge">${escapeHtml(block.tag)}</span>` : ""}
          <h3 class="report-section-title">${escapeHtml(block.title)}</h3>
        </div>
      `;
    }
    if (block.type === "paragraph") {
      return `<p class="writeup-paragraph">${linkifyUrls(block.text)}</p>`;
    }
    if (block.type === "list" || block.type === "bullet_list") {
      const items = block.items || [];
      return `
        <ul class="content-bullet-list" style="margin: 12px 0 16px 24px; line-height: 1.7; color: #334155;">
          ${items.map(item => {
            const linked = linkifyUrls(item);
            const formatted = linked.replace(/^([^:]{2,50}:)/, '<strong style="color: #1e293b;">$1</strong>');
            return `<li style="margin-bottom: 6px;">${formatted}</li>`;
          }).join("")}
        </ul>
      `;
    }
    if (block.type === "pdf_links" || block.type === "action_buttons") {
      const linksHtml = (block.links || []).map(link => `
        <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="file-action-btn" style="padding: 9px 18px; font-size: 13.5px; gap: 8px;" title="${escapeHtml(link.label || 'View PDF')}">
          <span>${escapeHtml(link.label || 'View PDF')}</span>
          ${BOX_ARROW_ICON_SVG}
        </a>
      `).join("");
      return `
        <div class="content-pdf-links-group" style="display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          ${linksHtml}
        </div>
      `;
    }
    if (block.type === "table") {
      const headersHtml = (block.headers || []).map(h => `<th>${escapeHtml(h)}</th>`).join("");
      const rowsHtml = (block.rows || []).map(row => {
        const cellsHtml = row.map((cell, idx) => {
          const isNum = idx === 0 && row.length > 2;
          return `<td ${isNum ? 'class="col-center"' : ''}>${escapeHtml(cell)}</td>`;
        }).join("");
        return `<tr>${cellsHtml}</tr>`;
      }).join("");

      return `
        <div class="content-table-block">
          <div class="table-block-header-row" style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 12px;">
            ${block.title ? `<h4 class="table-block-title" style="margin-bottom: 0;">${escapeHtml(block.title)}</h4>` : "<div></div>"}
            ${block.pdfUrl ? `
              <a href="${escapeHtml(block.pdfUrl)}" target="_blank" rel="noopener noreferrer" class="file-action-btn" style="padding: 5px 12px; font-size: 12px; gap: 6px;" title="View PDF">
                <span>View PDF</span>
                ${BOX_ARROW_ICON_SVG}
              </a>
            ` : ""}
          </div>
          <div class="data-table-container">
            <table class="data-grid-table">
              <thead><tr>${headersHtml}</tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </div>
      `;
    }
    if (block.type === "activity") {
      const pText = (block.paragraphs || []).map(p => `<p class="activity-text">${linkifyUrls(p)}</p>`).join("");
      let imagesHtml = "";
      const imgs = block.images || (block.image ? [block.image] : []);
      if (imgs.length > 0) {
        imagesHtml = `
          <div class="activity-photos-grid">
            ${imgs.map(img => {
          const url = typeof img === "string" ? img : img.url;
          return `
                <div class="gallery-photo-card">
                  <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="gallery-photo-link" title="View Image">
                    <img src="${escapeHtml(url)}" alt="${escapeHtml(block.title || 'Event Photo')}" loading="lazy" class="gallery-photo-img" />
                  </a>
                </div>
              `;
        }).join("")}
          </div>
        `;
      }
      return `
        <div class="activity-evidence-card">
          <div class="activity-header-row" style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 12px;">
            <h4 class="activity-title" style="margin-bottom: 0;">${escapeHtml(block.title)}</h4>
            ${block.pdfUrl ? `
              <a href="${escapeHtml(block.pdfUrl)}" target="_blank" rel="noopener noreferrer" class="file-action-btn" style="padding: 5px 12px; font-size: 12px; gap: 6px;" title="View PDF">
                <span>View PDF</span>
                ${BOX_ARROW_ICON_SVG}
              </a>
            ` : ""}
          </div>
          ${pText}
          ${imagesHtml}
        </div>
      `;
    }
    if (block.type === "gallery") {
      const imagesHtml = (block.images || []).map(img => {
        const url = typeof img === "string" ? img : img.url;
        const caption = typeof img === "string" ? "" : (img.caption || "");
        return `
          <div class="gallery-photo-card">
            <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="gallery-photo-link" title="${escapeHtml(caption || 'View Image')}">
              <img src="${escapeHtml(url)}" alt="${escapeHtml(caption || block.title || 'Event Photo')}" loading="lazy" class="gallery-photo-img" />
            </a>
            ${caption ? `<div class="gallery-photo-caption">${escapeHtml(caption)}</div>` : ""}
          </div>
        `;
      }).join("");

      return `
        <div class="content-gallery-block">
          ${block.title ? `<h4 class="gallery-block-title">${escapeHtml(block.title)}</h4>` : ""}
          <div class="photo-gallery-grid">
            ${imagesHtml}
          </div>
        </div>
      `;
    }
    if (block.type === "image") {
      return `
        <div class="content-single-image">
          <a href="${escapeHtml(block.url)}" target="_blank" rel="noopener noreferrer">
            <img src="${escapeHtml(block.url)}" alt="${escapeHtml(block.caption || 'Event Image')}" loading="lazy" class="evidence-photo-img" />
          </a>
          ${block.caption ? `<div class="image-caption">${escapeHtml(block.caption)}</div>` : ""}
        </div>
      `;
    }
    return "";
  }).join("");
}

/**
 * Render Indicator Webpage ("1.1.1 details")
 * Displays detailed institutional write-up, data points, policies, and resources.
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
  const displaySubtitle = foundIndicator ? foundIndicator.subtitle : "";

  let writeupHtml = "";
  if (foundIndicator && foundIndicator.contentBlocks && foundIndicator.contentBlocks.length > 0) {
    writeupHtml = renderContentBlocks(foundIndicator.contentBlocks);
  } else if (foundIndicator && foundIndicator.description) {
    const desc = foundIndicator.description;
    if (Array.isArray(desc)) {
      writeupHtml = desc.map(p => `<p>${escapeHtml(p)}</p>`).join("");
    } else {
      writeupHtml = `<p>${escapeHtml(desc)}</p>`;
    }
  } else if (!foundIndicator || (!foundIndicator.url && !foundIndicator.file)) {
    writeupHtml = `
      <p>
        This section documents the university's institutional performance, policies, and community outreach addressing 
        <strong>${escapeHtml(displayTitle)}</strong> in accordance with Times Higher Education (THE) Impact Rankings criteria.
      </p>
      <p>
        The dedicated coordinator team reviews annual progress, cross-departmental initiatives, and external stakeholder partnerships to ensure full transparency and compliance across all reported metrics.
      </p>
    `;
  }

  updateBreadcrumbs(sdg.num);

  if (mainHeadingTitle) {
    mainHeadingTitle.textContent = "THE SDG Ranking";
  }

  const canShowIndicatorPdf = !!(foundIndicator && (foundIndicator.url || foundIndicator.file) && (
    String(sdg.num) === "17" ? String(target.id) === "17.3" :
      (String(sdg.num) === "1" ? (String(target.id) !== "1.1" && String(target.id) !== "1.4") :
        (String(sdg.num) === "4" ? String(target.id) !== "4.3" : true))
  ));

  contentContainer.innerHTML = `
    <div class="subpage-container content-animated centered-layout" data-sdg-num="${escapeHtml(sdg.num)}" data-target-id="${escapeHtml(target.id)}">
      <div class="subpage-back-row">
        <a href="${buildRouteUrl({ type: "target", sdg: sdg.num, target: target.id })}" 
           class="back-nav-link" 
           data-route="target" 
           data-sdg="${escapeHtml(sdg.num)}" 
           data-target="${escapeHtml(target.id)}">
          ← Back to Target ${escapeHtml(target.id)}
        </a>
      </div>

      <div class="subpage-header-card">
        <p class="subpage-subtitle" style="margin: 0 0 10px 0; font-size: 13.5px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
          SDG ${escapeHtml(sdg.num)}: ${escapeHtml(sdg.name)}
        </p>
        <span class="subpage-badge" style="margin-bottom: 8px;">Indicator ${escapeHtml(displayPoint)}</span>
        <h2 class="subpage-title" style="margin-top: 4px;">${escapeHtml(displayTitle)}</h2>
        ${displaySubtitle ? `<h3 style="font-size: 15px; font-weight: 600; color: #475569; margin: 6px 0 0 0; line-height: 1.4;">${escapeHtml(displaySubtitle)}</h3>` : ""}
        ${canShowIndicatorPdf ? `
          <div style="margin-top: 14px;">
            <a href="${escapeHtml(foundIndicator.url || foundIndicator.file)}" target="_blank" rel="noopener noreferrer" class="file-action-btn" style="padding: 7px 14px; font-size: 13px;" title="${(String(sdg.num) === "10" || (foundIndicator && foundIndicator.policyName)) ? "View Policy" : "View PDF"}">
              <span>${(String(sdg.num) === "10" || (foundIndicator && foundIndicator.policyName)) ? "View Policy" : "View PDF"}</span>
              ${BOX_ARROW_ICON_SVG}
            </a>
          </div>
        ` : ""}
      </div>

      ${writeupHtml ? `
        <div class="subpage-content-card">
          ${(foundIndicator && ((foundIndicator.contentBlocks && foundIndicator.contentBlocks.length > 0) || foundIndicator.description)) ? "" : "<h3>Indicator Details & Scope</h3>"}
          <div class="writeup-prose">
            ${writeupHtml}
          </div>
        </div>
      ` : ""}
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

  if (route.type === "home") {
    renderHomeView();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const sdg = SDG_DATA[route.sdg] || SDG_DATA["1"] || Object.values(SDG_DATA)[0];
  if (!sdg) {
    renderHomeView();
    return;
  }

  // Set theme colors
  document.documentElement.style.setProperty("--theme-color", sdg.color);
  document.documentElement.style.setProperty("--theme-light", sdg.colorLight);
  document.documentElement.style.setProperty("--theme-border", sdg.colorBorder);

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

  // Initial landing state: 4 logos horizontally centered
  return { type: "home" };
}

/**
 * Global link click handler for internal SPA routing
 */
function handleLinkClick(e) {
  const targetLink = e.target.closest("a[data-route]");
  if (!targetLink) return;

  // Let external links open normally
  if (targetLink.getAttribute("target") === "_blank") return;

  e.preventDefault();

  const routeType = targetLink.getAttribute("data-route");
  const sdg = targetLink.getAttribute("data-sdg") || currentRoute.sdg || "1";
  const target = targetLink.getAttribute("data-target");
  const indicator = targetLink.getAttribute("data-indicator");

  if (routeType === "indicator") {
    navigateTo({ type: "indicator", sdg, target, indicator });
  } else if (routeType === "target") {
    navigateTo({ type: "target", sdg, target });
  } else if (routeType === "sdg") {
    navigateTo({ type: "sdg", sdg });
  } else if (routeType === "home") {
    navigateTo({ type: "home" });
  }
}

/**
 * Load SDG data from embedded script or fetch
 */
async function loadSdgData() {
  if (staticSdgData && Object.keys(staticSdgData).length > 0) {
    return staticSdgData;
  }

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
        <div style="padding:25px;color:#b91c1c;text-align:center;">
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

/**
 * Auto-link URLs in text
 */
function linkifyUrls(str) {
  if (str === null || str === undefined) return "";
  const escaped = escapeHtml(str);
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  return escaped.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${url}</a>`;
  });
}

document.addEventListener("DOMContentLoaded", init);
