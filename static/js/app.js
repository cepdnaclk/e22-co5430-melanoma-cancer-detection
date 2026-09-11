/**
 * Clinical Decision Support System (CDSS) - Triage & XAI Engine
 * CO5430 Medical Imaging Track · Group 15 · University of Peradeniya
 */

(function () {
  'use strict';

  // Global State
  let currentThreshold = 0.35;
  let activeCases = [];
  let currentModalCase = null;
  let currentViewMode = 'overlay'; // 'overlay', 'original', 'heatmap'

  // DOM Elements
  const engineStatusPill = document.getElementById('engineStatusPill');
  const engineLabel = document.getElementById('engineLabel');
  const btnThresh035 = document.getElementById('btnThresh035');
  const btnThresh050 = document.getElementById('btnThresh050');
  const protocolThreshVal = document.getElementById('protocolThreshVal');

  const kpiTotal = document.getElementById('kpiTotal');
  const kpiMalignant = document.getElementById('kpiMalignant');
  const kpiBenign = document.getElementById('kpiBenign');
  const kpiConfidence = document.getElementById('kpiConfidence');

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const btnBrowse = document.getElementById('btnBrowse');
  const btnToggleSamples = document.getElementById('btnToggleSamples');
  const sampleDrawer = document.getElementById('sampleDrawer');
  const sampleGrid = document.getElementById('sampleGrid');
  const btnQuickLoadAllSamples = document.getElementById('btnQuickLoadAllSamples');

  const triageTableBody = document.getElementById('triageTableBody');
  const emptyRow = document.getElementById('emptyRow');
  const btnClearQueue = document.getElementById('btnClearQueue');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnPrintReport = document.getElementById('btnPrintReport');

  // Modal Elements
  const xaiModal = document.getElementById('xaiModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const modalCaseId = document.getElementById('modalCaseId');
  const modalDermoscopyImg = document.getElementById('modalDermoscopyImg');
  const reticleOverlay = document.getElementById('reticleOverlay');
  const chkReticle = document.getElementById('chkReticle');
  const opacitySlider = document.getElementById('opacitySlider');
  const modalDiagnosisBadge = document.getElementById('modalDiagnosisBadge');
  const modalProbVal = document.getElementById('modalProbVal');
  const modalThreshVal = document.getElementById('modalThreshVal');
  const modalActionNote = document.getElementById('modalActionNote');
  const modalNarrative = document.getElementById('modalNarrative');
  const abcdAsymmetry = document.getElementById('abcdAsymmetry');
  const abcdBorder = document.getElementById('abcdBorder');
  const abcdColor = document.getElementById('abcdColor');
  const abcdDiameter = document.getElementById('abcdDiameter');
  const viewportTabBtns = document.querySelectorAll('.viewport-tab-btn');

  // ==========================================
  // Initialization & Backend Status Check
  // ==========================================
  async function init() {
    setupEventListeners();
    await fetchBackendStatus();
    await fetchSampleCases();
  }

  async function fetchBackendStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data.status === 'online') {
        engineLabel.textContent = data.active_engine;
        currentThreshold = data.current_threshold;
        updateThresholdButtons();
      }
    } catch (err) {
      console.warn('Backend status check failed:', err);
      engineLabel.textContent = 'Clinical Heuristic Engine';
    }
  }

  async function fetchSampleCases() {
    try {
      const res = await fetch('/api/sample-cases');
      const data = await res.json();
      if (data.samples && data.samples.length > 0) {
        renderSampleChips(data.samples);
      }
    } catch (err) {
      console.warn('Failed to load sample library:', err);
    }
  }

  function renderSampleChips(samples) {
    sampleGrid.innerHTML = '';
    samples.forEach(sample => {
      const chip = document.createElement('div');
      chip.className = 'sample-chip';
      const isBenign = sample.type.toLowerCase().includes('benign');
      const tagClass = isBenign ? 'benign' : 'malignant';

      chip.innerHTML = `
        <img src="${sample.thumbnail}" alt="${sample.name}">
        <div class="sample-chip-info">
          <span class="sample-chip-name" title="${sample.name}">${sample.name}</span>
          <span class="sample-chip-tag ${tagClass}">${sample.type}</span>
        </div>
      `;
      chip.addEventListener('click', () => loadSingleSample(sample.id));
      sampleGrid.appendChild(chip);
    });
  }

  // ==========================================
  // Event Listeners
  // ==========================================
  function setupEventListeners() {
    // Threshold Switchers
    btnThresh035.addEventListener('click', () => setOperatingThreshold(0.35));
    btnThresh050.addEventListener('click', () => setOperatingThreshold(0.50));

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
    });
    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
      });
    });
    dropzone.addEventListener('drop', handleFileDrop);

    // File input browse
    btnBrowse.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFilesSelected(e.target.files));

    // Sample library toggle & quick load
    btnToggleSamples.addEventListener('click', () => {
      const isHidden = sampleDrawer.style.display === 'none';
      sampleDrawer.style.display = isHidden ? 'block' : 'none';
      btnToggleSamples.innerHTML = isHidden ? '&#9652; Reference Case Library' : '&#9662; Reference Case Library';
    });

    btnQuickLoadAllSamples.addEventListener('click', loadAllSampleCases);

    // Queue management
    btnClearQueue.addEventListener('click', clearQueue);
    btnExportCSV.addEventListener('click', exportClinicalAuditCSV);
    btnPrintReport.addEventListener('click', () => window.print());

    // Modal view tabs
    viewportTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewportTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentViewMode = btn.dataset.view;
        updateModalViewport();
      });
    });

    // Reticle checkbox
    chkReticle.addEventListener('change', (e) => {
      reticleOverlay.style.display = e.target.checked ? 'block' : 'none';
    });

    // Modal Close
    btnCloseModal.addEventListener('click', closeModal);
    xaiModal.addEventListener('click', (e) => {
      if (e.target === xaiModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && xaiModal.classList.contains('open')) closeModal();
    });
  }

  // ==========================================
  // Threshold Calibration Management
  // ==========================================
  async function setOperatingThreshold(val) {
    if (currentThreshold === val) return;
    currentThreshold = val;
    updateThresholdButtons();

    try {
      await fetch('/api/set-threshold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: val })
      });
    } catch (e) {
      console.warn('Could not sync threshold with backend:', e);
    }

    // Instantly re-evaluate all cases in queue on client without re-uploading!
    recalculateAllCases();
  }

  function updateThresholdButtons() {
    protocolThreshVal.textContent = currentThreshold.toFixed(2);
    if (currentThreshold === 0.35) {
      btnThresh035.classList.add('active');
      btnThresh050.classList.remove('active');
    } else {
      btnThresh050.classList.add('active');
      btnThresh035.classList.remove('active');
    }
  }

  function recalculateAllCases() {
    activeCases.forEach(c => {
      const isMalignant = c.probability >= currentThreshold;
      c.is_malignant = isMalignant;
      c.diagnosis = isMalignant ? 'Malignant (Melanoma)' : 'Benign';

      if (c.probability >= 0.70) {
        c.risk_level = 'High Suspicion';
        c.clinical_action = 'Urgent Excisional Biopsy & Dermatopathology Consult';
        c.alert_class = 'risk-high';
      } else if (isMalignant) {
        c.risk_level = 'Moderate Suspicion';
        c.clinical_action = 'Dermoscopy Follow-Up within 2-4 Weeks or Confirmatory Biopsy';
        c.alert_class = 'risk-moderate';
      } else if (c.probability >= 0.25) {
        c.risk_level = 'Indeterminate / Low-Moderate';
        c.clinical_action = 'Serial Digital Dermoscopy (3-Month Surveillance)';
        c.alert_class = 'risk-low';
      } else {
        c.risk_level = 'Low Suspicion';
        c.clinical_action = 'Routine Annual Skin Examination';
        c.alert_class = 'risk-safe';
      }
    });

    renderTriageTable();
    updateKPIs();

    if (currentModalCase) {
      updateModalDiagnostics(currentModalCase);
    }
  }

  // ==========================================
  // File Upload Handlers
  // ==========================================
  function handleFileDrop(e) {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      uploadFilesBatch(dt.files);
    }
  }

  function handleFilesSelected(files) {
    if (files && files.length > 0) {
      uploadFilesBatch(files);
      fileInput.value = ''; // Reset
    }
  }

  async function uploadFilesBatch(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('threshold', currentThreshold);

    // Show temporary progress indicator in empty row
    if (activeCases.length === 0) {
      emptyRow.querySelector('.empty-queue').innerHTML = `
        <div style="color:var(--color-clinical-cyan); font-weight:600;">
          Processing and triaging ${files.length} dermoscopic acquisition(s)...
        </div>
      `;
    }

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.results) {
        data.results.forEach(item => {
          if (!item.error) {
            activeCases.unshift(item); // Prepend new cases
          }
        });
        renderTriageTable();
        updateKPIs();
      } else {
        alert(data.error || 'Failed to process images.');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Network or server error during image classification.');
    }
  }

  // ==========================================
  // Sample Case Loading
  // ==========================================
  async function loadSingleSample(sampleId) {
    try {
      const res = await fetch('/api/load-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sampleId, threshold: currentThreshold })
      });
      const data = await res.json();
      if (data.success && data.result) {
        activeCases.unshift(data.result);
        renderTriageTable();
        updateKPIs();
      }
    } catch (e) {
      console.warn('Failed to load sample:', e);
    }
  }

  async function loadAllSampleCases() {
    const sampleIds = [
      'case_benign_01', 'case_benign_02', 'case_benign_03', 'case_benign_04', 'case_benign_05',
      'case_malignant_01', 'case_malignant_02', 'case_malignant_03', 'case_malignant_04', 'case_malignant_05'
    ];

    btnQuickLoadAllSamples.disabled = true;
    btnQuickLoadAllSamples.textContent = 'Loading 10 Cases...';

    for (const id of sampleIds) {
      await loadSingleSample(id);
    }

    btnQuickLoadAllSamples.disabled = false;
    btnQuickLoadAllSamples.textContent = 'Load 10 Reference Cases';
  }

  // ==========================================
  // Rendering Triage Table & KPIs
  // ==========================================
  function renderTriageTable() {
    triageTableBody.innerHTML = '';

    if (activeCases.length === 0) {
      triageTableBody.appendChild(emptyRow);
      return;
    }

    activeCases.forEach((c, idx) => {
      const tr = document.createElement('tr');
      const isMalignant = c.is_malignant;
      const badgeClass = isMalignant ? 'malignant' : 'benign';
      const fillClass = isMalignant ? 'malignant' : 'benign';

      tr.innerHTML = `
        <td class="thumb-cell">
          <img class="lesion-thumb" src="${c.original_base64}" alt="Lesion ${c.case_id}">
        </td>
        <td class="case-id-cell">
          ${c.case_id}
          <div style="font-size:0.7rem; color:var(--text-muted); font-family:var(--font-main);">${c.filename}</div>
        </td>
        <td>
          <span class="diagnosis-badge ${badgeClass}">
            ${isMalignant ? '&#9888;' : '&#10003;'} ${c.diagnosis}
          </span>
        </td>
        <td>
          <div class="prob-meter">
            <div class="prob-bar-bg">
              <div class="prob-bar-fill ${fillClass}" style="width: ${c.probability_percent}%;"></div>
            </div>
            <span class="prob-val" style="color:${isMalignant ? 'var(--color-malignant)' : 'var(--color-benign)'}">
              ${c.probability_percent}%
            </span>
          </div>
        </td>
        <td>
          <span style="font-size:0.75rem; font-weight:600; color:${isMalignant ? '#F87171' : '#34D399'};">
            ${c.risk_level}
          </span>
        </td>
        <td>
          <div style="font-size:0.75rem; color:var(--text-secondary); max-width:240px; line-height:1.3;">
            ${c.clinical_action}
          </div>
        </td>
        <td style="text-align:right;">
          <div class="action-btn-group" style="justify-content: flex-end;">
            <button type="button" class="btn-inspect" data-index="${idx}">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Inspect Grad-CAM
            </button>
            <button type="button" class="btn-clinical-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem;" data-remove="${idx}" title="Remove Case">
              &times;
            </button>
          </div>
        </td>
      `;

      // Attach row events
      tr.querySelector('.btn-inspect').addEventListener('click', () => openModal(c));
      tr.querySelector('[data-remove]').addEventListener('click', () => removeCase(idx));

      triageTableBody.appendChild(tr);
    });
  }

  function removeCase(idx) {
    activeCases.splice(idx, 1);
    renderTriageTable();
    updateKPIs();
  }

  function clearQueue() {
    if (activeCases.length === 0) return;
    if (confirm('Clear all patient cases from the current triage queue?')) {
      activeCases = [];
      renderTriageTable();
      updateKPIs();
    }
  }

  function updateKPIs() {
    const total = activeCases.length;
    kpiTotal.textContent = total;

    if (total === 0) {
      kpiMalignant.textContent = '0';
      kpiBenign.textContent = '0';
      kpiConfidence.textContent = '--%';
      return;
    }

    const malignantCount = activeCases.filter(c => c.is_malignant).length;
    const benignCount = total - malignantCount;
    const avgConfidence = (activeCases.reduce((acc, c) => acc + (c.is_malignant ? c.probability : (1.0 - c.probability)), 0) / total) * 100;

    kpiMalignant.textContent = malignantCount;
    kpiBenign.textContent = benignCount;
    kpiConfidence.textContent = `${Math.round(avgConfidence)}%`;
  }

  // ==========================================
  // Grad-CAM Inspection Modal
  // ==========================================
  function openModal(caseData) {
    currentModalCase = caseData;
    modalCaseId.textContent = `${caseData.case_id} · Diagnostic Saliency Analysis`;

    updateModalDiagnostics(caseData);
    updateModalViewport();

    xaiModal.classList.add('open');
  }

  function closeModal() {
    xaiModal.classList.remove('open');
    currentModalCase = null;
  }

  function updateModalDiagnostics(c) {
    const isMalignant = c.is_malignant;
    modalDiagnosisBadge.textContent = c.diagnosis;
    modalDiagnosisBadge.className = `diagnosis-badge ${isMalignant ? 'malignant' : 'benign'}`;
    modalProbVal.textContent = `${c.probability_percent}%`;
    modalProbVal.style.color = isMalignant ? 'var(--color-malignant)' : 'var(--color-benign)';
    modalThreshVal.textContent = `(Operating \u03c4 = ${currentThreshold.toFixed(2)})`;

    modalActionNote.textContent = c.clinical_action;
    modalActionNote.style.borderLeftColor = isMalignant ? 'var(--color-malignant)' : 'var(--color-benign)';

    abcdAsymmetry.textContent = `${c.abcd.asymmetry} / 10`;
    abcdBorder.textContent = `${c.abcd.border} / 10`;
    abcdColor.textContent = `${c.abcd.color_variegation} / 10`;
    abcdDiameter.textContent = `${c.abcd.diameter_coverage}%`;

    modalNarrative.textContent = c.explanation;
  }

  function updateModalViewport() {
    if (!currentModalCase) return;

    if (currentViewMode === 'overlay') {
      modalDermoscopyImg.src = currentModalCase.overlay_base64;
    } else if (currentViewMode === 'original') {
      modalDermoscopyImg.src = currentModalCase.original_base64;
    } else if (currentViewMode === 'heatmap') {
      modalDermoscopyImg.src = currentModalCase.heatmap_base64;
    }
  }

  // ==========================================
  // Export Clinical Audit CSV
  // ==========================================
  function exportClinicalAuditCSV() {
    if (activeCases.length === 0) {
      alert('Triage queue is empty. No clinical records to export.');
      return;
    }

    const headers = [
      'Case ID',
      'Filename',
      'Diagnosis',
      'Malignancy Probability (%)',
      'Calibrated Threshold (tau)',
      'Risk Stratification',
      'Clinical Action',
      'Asymmetry Index (0-10)',
      'Border Irregularity (0-10)',
      'Color Variegation (0-10)',
      'Lesion Area (%)'
    ];

    const rows = activeCases.map(c => [
      `"${c.case_id}"`,
      `"${c.filename}"`,
      `"${c.diagnosis}"`,
      c.probability_percent,
      currentThreshold.toFixed(2),
      `"${c.risk_level}"`,
      `"${c.clinical_action}"`,
      c.abcd.asymmetry,
      c.abcd.border,
      c.abcd.color_variegation,
      c.abcd.diameter_coverage
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `melanoma_clinical_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Launch on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
