/**
 * Pakistan School Seeb - Admissions Wizard & Fee Calculator
 */
(function () {
  'use strict';

  // ===== Multi-step Wizard =====
  const wizard = document.getElementById('admission-wizard');
  if (!wizard) return;

  const panels = wizard.querySelectorAll('.wizard-panel');
  const indicators = wizard.querySelectorAll('.step-indicator');
  const nextBtns = wizard.querySelectorAll('[data-next]');
  const prevBtns = wizard.querySelectorAll('[data-prev]');
  let currentStep = 0;
  const STORAGE_KEY = 'pss-admission-draft';

  // Restore draft
  try {
    const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.keys(draft).forEach(name => {
      const el = wizard.querySelector(`[name="${name}"]`);
      if (el) {
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = draft[name];
        else el.value = draft[name];
      }
    });
  } catch (e) {}

  function saveDraft() {
    const data = {};
    wizard.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.name) {
        if (el.type === 'checkbox' || el.type === 'radio') data[el.name] = el.checked;
        else data[el.name] = el.value;
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function goToStep(step) {
    if (step < 0 || step >= panels.length) return;
    panels.forEach((p, i) => p.classList.toggle('active', i === step));
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === step);
      ind.classList.toggle('done', i < step);
    });
    currentStep = step;
    wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    const panel = panels[step];
    const required = panel.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      const val = field.value.trim();
      if (!val) {
        field.classList.add('error');
        valid = false;
      } else {
        field.classList.remove('error');
      }
      if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        field.classList.add('error');
        valid = false;
      }
      if (field.type === 'tel' && val && val.replace(/\D/g, '').length < 8) {
        field.classList.add('error');
        valid = false;
      }
    });
    return valid;
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!validateStep(currentStep)) {
        showToast('Please fill all required fields correctly.');
        return;
      }
      saveDraft();
      goToStep(currentStep + 1);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => goToStep(currentStep - 1));
  });

  // Dropzone
  const dropzone = document.getElementById('doc-dropzone');
  const fileInput = document.getElementById('doc-files');
  const fileList = document.getElementById('file-list');
  // Store { name, type, size, dataUrl } so admin can view/download
  let uploadedFiles = [];

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', e => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', e => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));
  }

  function handleFiles(files) {
    Array.from(files).forEach(f => {
      if (f.size > 2 * 1024 * 1024) {
        showToast(f.name + ' exceeds 2MB limit (kept small so admin can store previews).');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        uploadedFiles.push({
          name: f.name,
          type: f.type || 'application/octet-stream',
          size: f.size,
          dataUrl: reader.result
        });
        renderFiles();
      };
      reader.readAsDataURL(f);
    });
  }

  function renderFiles() {
    if (!fileList) return;
    fileList.innerHTML = uploadedFiles.map((file, i) => {
      const name = typeof file === 'string' ? file : file.name;
      return `<div style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;font-size:0.9rem">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pk-emerald)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> ${name}
        <button type="button" data-rm="${i}" style="margin-left:auto;background:none;border:none;color:#EF4444;cursor:pointer;font-size:1rem">×</button>
      </div>`;
    }).join('');
    fileList.querySelectorAll('[data-rm]').forEach(btn => {
      btn.addEventListener('click', () => {
        uploadedFiles.splice(+btn.dataset.rm, 1);
        renderFiles();
      });
    });
  }

  // Submit
  const submitBtn = document.getElementById('submit-application');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (!validateStep(currentStep)) {
        showToast('Please complete all required fields.');
        return;
      }
      saveDraft();

      // Generate tracking ID
      const trackingId = 'PSS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      const val = (name) => wizard.querySelector('[name="' + name + '"]')?.value?.trim() || '';
      const studentName = val('studentName');
      const grade = val('gradeApplied');
      const email = val('email');

      // Full application record for admin
      const appRecord = {
        trackingId,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        studentName,
        dob: val('dob'),
        gender: val('gender'),
        nationality: val('nationality'),
        civilId: val('civilId'),
        gradeApplied: grade,
        parentName: val('parentName'),
        relationship: val('relationship'),
        email,
        phone: val('phone'),
        address: val('address'),
        prevSchool: val('prevSchool'),
        lastGrade: val('lastGrade'),
        prevCurriculum: val('prevCurriculum'),
        reason: val('reason'),
        documents: uploadedFiles.map(f => typeof f === 'string' ? { name: f } : f),
        adminNote: ''
      };
      (async function () {
        try {
          if (window.PSSCloud) {
            await window.PSSCloud.init();
            await window.PSSCloud.addApplication(appRecord);
          } else {
            const applications = JSON.parse(localStorage.getItem('pss-applications') || '[]');
            applications.push(appRecord);
            localStorage.setItem('pss-applications', JSON.stringify(applications));
          }
        } catch (err) {
          const applications = JSON.parse(localStorage.getItem('pss-applications') || '[]');
          applications.push(appRecord);
          localStorage.setItem('pss-applications', JSON.stringify(applications));
        }
      })();
      localStorage.removeItem(STORAGE_KEY);

      // Show confirmation
      const confirmModal = document.getElementById('confirm-modal');
      if (confirmModal) {
        document.getElementById('confirm-tracking').textContent = trackingId;
        document.getElementById('confirm-name').textContent = studentName;
        document.getElementById('confirm-grade').textContent = grade;
        confirmModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }

      // Reset form
      wizard.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.type !== 'button' && el.type !== 'submit') el.value = '';
      });
      uploadedFiles = [];
      renderFiles();
      goToStep(0);
    });
  }

  // Confirm modal close & print
  const confirmModal = document.getElementById('confirm-modal');
  if (confirmModal) {
    confirmModal.querySelector('.modal-close')?.addEventListener('click', () => {
      confirmModal.classList.remove('open');
      document.body.style.overflow = '';
    });
    document.getElementById('print-receipt')?.addEventListener('click', () => {
      const content = document.getElementById('receipt-content');
      if (!content) return;
      const win = window.open('', '_blank');
      win.document.write(`
        <html><head><title>Application Receipt - Pakistan School Seeb</title>
        <style>body{font-family:system-ui;padding:2rem;max-width:600px;margin:0 auto}
        h1{color:#01411C} .badge{background:#00A859;color:white;padding:0.3rem 0.8rem;border-radius:999px;display:inline-block}
        table{width:100%;margin-top:1.5rem} td{padding:0.5rem 0;border-bottom:1px solid #eee}</style></head>
        <body>${content.innerHTML}<p style="margin-top:2rem;color:#666;font-size:0.85rem">Pakistan School Seeb · Building 356, Way 5889, Al Seeb, Muscat, Oman<br>principal.seeb@pakistanschool.edu.om · +968 24464345</p></body></html>
      `);
      win.document.close();
      win.print();
    });
  }

  // ===== Status Tracker =====
  const trackBtn = document.getElementById('track-btn');
  const trackInput = document.getElementById('track-id');
  const statusResult = document.getElementById('status-result');
  if (trackBtn && trackInput && statusResult) {
    trackBtn.addEventListener('click', async () => {
      const id = trackInput.value.trim().toUpperCase();
      if (!id) {
        showToast('Please enter a tracking ID.');
        return;
      }
      let app = null;
      try {
        if (window.PSSCloud) {
          await window.PSSCloud.init();
          app = await window.PSSCloud.getApplicationByTracking(id);
        }
      } catch (e) {}
      if (!app) {
        const apps = JSON.parse(localStorage.getItem('pss-applications') || '[]');
        app = apps.find(a => a.trackingId === id);
      }
      if (!app) {
        statusResult.innerHTML = `<p style="color:var(--text-muted)">No application found for <strong>${id}</strong>. Please check the ID and try again.</p>`;
        statusResult.classList.add('visible');
        return;
      }
      const statusLabels = { pending: 'Pending Review', reviewed: 'Under Review', accepted: 'Accepted' };
      statusResult.innerHTML = `
        <span class="status-badge ${app.status}">${statusLabels[app.status] || app.status}</span>
        <h4 style="margin-bottom:0.5rem">${app.studentName}</h4>
        <p style="color:var(--text-secondary);font-size:0.9rem">Grade Applied: ${app.gradeApplied}</p>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">Submitted: ${new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p style="color:var(--text-muted);font-size:0.85rem">Tracking ID: <strong>${app.trackingId}</strong></p>
      `;
      statusResult.classList.add('visible');
    });
  }

  // ===== Fee Calculator =====
  const feeForm = document.getElementById('fee-calculator');
  if (feeForm) {
    const tuitionRates = {
      'KG': 450, '1': 480, '2': 480, '3': 500, '4': 500, '5': 520,
      '6': 550, '7': 550, '8': 580, '9': 600, '10': 620, '11': 650, '12': 680
    };
    const busRates = { none: 0, near: 80, mid: 110, far: 140 };

    function calcFee() {
      const grade = feeForm.querySelector('[name="feeGrade"]')?.value;
      const bus = feeForm.querySelector('[name="busRoute"]')?.value || 'none';
      const term = feeForm.querySelector('[name="term"]')?.value || 'annual';
      if (!grade) return;

      let tuition = tuitionRates[grade] || 500;
      let transport = busRates[bus] || 0;
      let multiplier = term === 'annual' ? 10 : term === 'term' ? 3.5 : 1;
      let totalTuition = Math.round(tuition * multiplier);
      let totalTransport = Math.round(transport * (term === 'annual' ? 10 : term === 'term' ? 3.5 : 1));
      let registration = term === 'annual' ? 50 : 0;
      let total = totalTuition + totalTransport + registration;

      const result = document.getElementById('fee-result');
      if (result) {
        result.innerHTML = `
          <div class="amount">${total.toLocaleString()} <small style="font-size:1rem">OMR</small></div>
          <p style="opacity:0.85;margin-top:0.25rem">${term === 'annual' ? 'Annual Estimate' : term === 'term' ? 'Per Term Estimate' : 'Monthly Estimate'}</p>
          <div class="fee-breakdown">
            <div><span>Tuition</span><span>${totalTuition} OMR</span></div>
            <div><span>Transport</span><span>${totalTransport} OMR</span></div>
            ${registration ? `<div><span>Registration</span><span>${registration} OMR</span></div>` : ''}
            <div style="font-weight:700;border:none;padding-top:0.5rem"><span>Total</span><span>${total} OMR</span></div>
          </div>
          <p style="font-size:0.75rem;opacity:0.7;margin-top:1rem">* Indicative fees for 2025-26. Final fees subject to Board approval. Installment plans available.</p>
        `;
      }
    }

    feeForm.querySelectorAll('select').forEach(s => s.addEventListener('change', calcFee));
    calcFee();
  }
})();
