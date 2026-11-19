
/**
 * THE SDG RANKING - Interactive Controller
 * Loads SDG information from sdg_data.json
 * Supports PDF, Excel and nested sub-items.
 */

// SDG data
let SDG_DATA = {};

// Current active state
let currentSdgKey = "1";

// DOM Elements
const navCards = document.querySelectorAll(".sdg-nav-card");
const contentContainer = document.getElementById("sdg-content-area");


/**
 * Initialize application and load JSON data
 */
async function init() {
  try {
    const response = await fetch("./sdg_data.json?t=" + Date.now(), {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to load SDG data. Status: " + response.status);
    }

    SDG_DATA = await response.json();

    console.log("SDG data loaded successfully:", SDG_DATA);

    if (!Object.keys(SDG_DATA).length) {
      throw new Error("SDG data file is empty.");
    }

    // Bind Card Click Events
    navCards.forEach(card => {
      card.addEventListener("click", () => {
        const key = card.getAttribute("data-sdg");

        if (key) {
          selectSDG(key, true, true);
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Check URL hash for direct deep-linking
    const hash = window.location.hash.replace("#sdg-", "");

    if (SDG_DATA[hash]) {
      selectSDG(hash, false, false);
    } else {
      selectSDG("1" in SDG_DATA ? "1" : Object.keys(SDG_DATA)[0], false, false);
    }

    // Hash change listener
    window.addEventListener("hashchange", () => {
      const newHash = window.location.hash.replace("#sdg-", "");

      if (SDG_DATA[newHash] && newHash !== currentSdgKey) {
        selectSDG(newHash, false, true);
      }
    });

  } catch (error) {
    console.error("SDG loading error:", error);

    if (contentContainer) {
      contentContainer.innerHTML = `
        <div style="padding:25px;color:#b91c1c;">
          <h3>Unable to load SDG data</h3>
          <p>${escapeHtml(error.message)}</p>
          <p>Please check sdg_data.json.</p>
        </div>
      `;
    }
  }
}


/**
 * Select active SDG and render right panel
 */
function selectSDG(key, updateHash = true, scrollToTop = false) {

  if (!SDG_DATA[key]) return;

  currentSdgKey = key;

  if (updateHash) {
    history.replaceState(null, "", `#sdg-${key}`);
  }

  const sdg = SDG_DATA[key];

  document.documentElement.style.setProperty("--theme-color", sdg.color);
  document.documentElement.style.setProperty("--theme-light", sdg.colorLight);
  document.documentElement.style.setProperty("--theme-border", sdg.colorBorder);

  // Update Left Navigation Cards
  navCards.forEach(card => {
    const cardKey = card.getAttribute("data-sdg");
    const isActive = cardKey === key;

    card.classList.toggle("active", isActive);
    card.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  renderDetails(sdg);

  if (scrollToTop && (window.pageYOffset || document.documentElement.scrollTop) > 100) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}


/**
 * SVG for box with arrow icon (open in new tab / PDF)
 */
const BOX_ARROW_ICON_SVG = `
  <svg class="box-arrow-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
`;


/**
 * Detect if a file entry is an Excel/Spreadsheet
 */
function isExcelFile(ind, url) {
  if (ind && ind.excel) return true;
  if (!url) return false;
  const lower = String(url).toLowerCase();
  return lower.includes("spreadsheet") || lower.includes(".xlsx") || lower.includes(".xls") || lower.includes(".csv");
}


/**
 * Generate PDF and Excel buttons
 */
function renderFileButtons(ind) {

  let buttons = "";

  const fileUrl = (typeof ind === "object" && ind !== null)
    ? (ind.file || ind.pdf || ind.doc || ind.url || ind.link || null)
    : null;

  if (fileUrl && fileUrl.trim() !== "" && fileUrl.trim() !== "#") {
    const isExcel = isExcelFile(ind, fileUrl);
    const label = isExcel ? "View Excel" : "View PDF";

    buttons += `
      <a href="${escapeHtml(fileUrl)}"
         target="_blank"
         rel="noopener noreferrer"
         class="sdg-view-pdf-btn ${isExcel ? 'is-excel' : ''}"
         title="${escapeHtml(label)}">
         <span class="file-action-tag">
           <span class="file-action-label">${escapeHtml(label)}</span>
           ${BOX_ARROW_ICON_SVG}
         </span>
      </a>
    `;
  }

  if (ind && ind.excel && ind.excel.trim() !== "" && ind.excel.trim() !== "#") {
    buttons += `
      <a href="${escapeHtml(ind.excel)}"
         target="_blank"
         rel="noopener noreferrer"
         class="sdg-view-excel-btn"
         title="View Excel">
         <span class="file-action-tag">
           <span class="file-action-label">View Excel</span>
           ${BOX_ARROW_ICON_SVG}
         </span>
      </a>
    `;
  }

  return buttons;
}


/**
 * Format indicator text so leading point numbers/letters (e.g. 17.1.1, 17.3.1 to 17.3.17, 4.3.1, A., B.)
 * are rendered as bold numbers.
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
 * Render individual indicator
 * Supports normal indicators and nested subItems matching SDG UI design
 */
function renderIndicator(ind) {

  const indicatorText = typeof ind === "string"
    ? ind
    : ind.text || "";

  const fileUrl = (typeof ind === "object" && ind !== null)
    ? (ind.file || ind.pdf || ind.doc || ind.url || ind.link || null)
    : null;

  const hasValidFile = Boolean(fileUrl && fileUrl.trim() !== "" && fileUrl.trim() !== "#");
  const hasExcel = typeof ind === "object" && ind !== null && Boolean(ind.excel && ind.excel.trim() !== "" && ind.excel.trim() !== "#");

  let actionButtonsHtml = "";

  if (hasValidFile) {
    const isExcel = isExcelFile(ind, fileUrl);
    const label = isExcel ? "View Excel" : "View PDF";

    actionButtonsHtml += `
      <a href="${escapeHtml(fileUrl)}"
         target="_blank"
         rel="noopener noreferrer"
         class="file-action-btn ${isExcel ? 'is-excel' : ''}"
         title="${escapeHtml(label)}">
        <span>${escapeHtml(label)}</span>
        ${BOX_ARROW_ICON_SVG}
      </a>
    `;
  }

  if (hasExcel) {
    actionButtonsHtml += `
      <a href="${escapeHtml(ind.excel)}"
         target="_blank"
         rel="noopener noreferrer"
         class="file-action-btn is-excel"
         title="View Excel">
        <span>View Excel</span>
        ${BOX_ARROW_ICON_SVG}
      </a>
    `;
  }

  const mainRowHtml = `
    <div class="indicator-item">
      <div class="indicator-item-left">
        <span class="indicator-bullet"></span>
        <span class="indicator-text">${formatPointText(indicatorText)}</span>
      </div>
      ${actionButtonsHtml ? `<div class="indicator-item-right">${actionButtonsHtml}</div>` : ""}
    </div>
  `;

  // Render nested A, B, C items
  let subItemsHtml = "";

  if (
    typeof ind === "object" &&
    ind !== null &&
    Array.isArray(ind.subItems) &&
    ind.subItems.length > 0
  ) {
    subItemsHtml = ind.subItems.map(sub => {
      const subText = typeof sub === "string" ? sub : (sub.text || "");
      const subFileUrl = (typeof sub === "object" && sub !== null)
        ? (sub.file || sub.pdf || sub.doc || sub.url || sub.link || null)
        : null;
      const subHasValidFile = Boolean(subFileUrl && subFileUrl.trim() !== "" && subFileUrl.trim() !== "#");
      const subHasExcel = typeof sub === "object" && sub !== null && Boolean(sub.excel && sub.excel.trim() !== "" && sub.excel.trim() !== "#");

      let subActionButtonsHtml = "";

      if (subHasValidFile) {
        const isExcel = isExcelFile(sub, subFileUrl);
        const label = isExcel ? "View Excel" : "View PDF";

        subActionButtonsHtml += `
          <a href="${escapeHtml(subFileUrl)}"
             target="_blank"
             rel="noopener noreferrer"
             class="file-action-btn ${isExcel ? 'is-excel' : ''}"
             title="${escapeHtml(label)}">
            <span>${escapeHtml(label)}</span>
            ${BOX_ARROW_ICON_SVG}
          </a>
        `;
      }

      if (subHasExcel) {
        subActionButtonsHtml += `
          <a href="${escapeHtml(sub.excel)}"
             target="_blank"
             rel="noopener noreferrer"
             class="file-action-btn is-excel"
             title="View Excel">
            <span>View Excel</span>
            ${BOX_ARROW_ICON_SVG}
          </a>
        `;
      }

      return `
        <div class="indicator-item indicator-subitem">
          <div class="indicator-item-left">
            <span class="indicator-bullet indicator-bullet-sub"></span>
            <span class="indicator-text">${formatPointText(subText)}</span>
          </div>
          ${subActionButtonsHtml ? `<div class="indicator-item-right">${subActionButtonsHtml}</div>` : ""}
        </div>
      `;
    }).join("");
  }

  return mainRowHtml + subItemsHtml;
}


/**
 * Render the details view
 */
function renderDetails(sdg) {

  const targetsHtml = (sdg.targets || []).map(target => {

    const hasIndicators = target.indicators && target.indicators.length > 0;

    const indicatorsListHtml = hasIndicators
      ? target.indicators.map(ind => renderIndicator(ind)).join("")
      : "";

    const targetFile = target.file || target.pdf || target.doc || target.url || null;
    const hasTargetFile = Boolean(targetFile && targetFile.trim() !== "" && targetFile.trim() !== "#");

    return `
      <article class="target-row" data-target-id="${escapeHtml(target.id)}">

        <div class="target-header-meta">
          <span class="target-label">Target</span>
          <span class="target-id">${escapeHtml(target.id)}</span>
        </div>

        <p class="target-desc">
          ${hasTargetFile ? `
            <span class="target-desc-content">
              <span>${escapeHtml(target.desc)}</span>
              <a href="${escapeHtml(targetFile)}"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="file-action-btn ${isExcelFile(target, targetFile) ? 'is-excel' : ''}"
                 title="${isExcelFile(target, targetFile) ? 'View Excel' : 'View PDF'}">
                <span>${isExcelFile(target, targetFile) ? 'View Excel' : 'View PDF'}</span>
                ${BOX_ARROW_ICON_SVG}
              </a>
            </span>
          ` : escapeHtml(target.desc)}
        </p>

        ${hasIndicators ? `
          <button
            type="button"
            class="indicators-toggle-btn expanded"
            aria-expanded="true"
            onclick="toggleSingleIndicator(this)"
          >
            <span>Indicators</span>

            <svg
              class="arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>

          </button>

          <div class="indicators-collapse-panel open">
            <div class="indicators-content">
              ${indicatorsListHtml}
            </div>
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
            ${sdg.sourceUrl ? `
              <p class="detail-intro-source">
                <a href="${escapeHtml(sdg.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="detail-intro-link">
                  ${escapeHtml(sdg.sourceUrl)}
                </a>
              </p>
            ` : ""}
          </div>
        ` : ""}
      </div>

      <div class="targets-list" id="targets-list-container">
        ${targetsHtml}
      </div>

    </div>
  `;
}


/**
 * Toggle individual target indicators dropdown
 */
window.toggleSingleIndicator = function(btn) {

  const panel = btn.nextElementSibling;

  if (!panel) return;

  const isExpanded = btn.classList.contains("expanded");

  if (isExpanded) {

    btn.classList.remove("expanded");
    btn.setAttribute("aria-expanded", "false");
    panel.classList.remove("open");

  } else {

    btn.classList.add("expanded");
    btn.setAttribute("aria-expanded", "true");
    panel.classList.add("open");

  }
};


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


// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", init);
