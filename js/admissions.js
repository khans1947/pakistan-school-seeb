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
    const allowed = /^(image\/(jpeg|png|webp|gif)|application\/pdf)$/i;
    Array.from(files).forEach(f => {
      if (f.size > 2 * 1024 * 1024) {
        showToast(f.name + ' exceeds 2MB limit.');
        return;
      }
      if (f.type && !allowed.test(f.type)) {
        showToast(f.name + ' — only images (JPG/PNG/WebP) or PDF allowed.');
        return;
      }
      if (uploadedFiles.length >= 6) {
        showToast('Maximum 6 files per application.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        uploadedFiles.push({
          name: f.name.replace(/[<>"']/g, ''),
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
    submitBtn.addEventListener('click', async () => {
      if (submitBtn.disabled) return; // guard against double-submit
      if (!validateStep(currentStep)) {
        showToast('Please complete all required fields.');
        return;
      }
      saveDraft();

      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      try {
        // Generate tracking ID
        const trackingId = 'PSS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
        const val = (name) => wizard.querySelector('[name="' + name + '"]')?.value?.trim() || '';
        const studentName = val('studentName');
        const grade = val('gradeApplied');
        const email = val('email');

        // Full application record for admin (+ progressive timeline)
        const submittedAt = new Date().toISOString();
        const appRecord = {
          trackingId,
          status: 'submitted',
          submittedAt,
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
          adminNote: '',
          timeline: [
            { status: 'submitted', at: submittedAt, note: 'Application received' }
          ]
        };

        // Save the record BEFORE showing the receipt, so the tracking ID is
        // guaranteed to work immediately. Always keep a local copy too, so
        // the applicant never loses their submission even if cloud sync fails.
        try {
          const applications = JSON.parse(localStorage.getItem('pss-applications') || '[]');
          applications.push(appRecord);
          localStorage.setItem('pss-applications', JSON.stringify(applications));
        } catch (err) {
          console.warn('Local save failed:', err);
        }
        try {
          if (window.PSSCloud) {
            await window.PSSCloud.init();
            await window.PSSCloud.addApplication(appRecord);
          }
        } catch (err) {
          console.warn('Cloud save failed, local copy is still safe:', err);
        }

        localStorage.removeItem(STORAGE_KEY);

        // Fire the notification, but never let it block the receipt
        try {
          if (window.PSSCloud?.triggerNotification) {
            if (window.PSSNotify) {
          window.PSSNotify.notify({
            type: 'admission_submitted',
            to: formData.parentEmail || formData.email,
            phone: formData.parentPhone || formData.phone,
            trackingId,
            studentName: formData.studentName || formData.name,
            subject: 'New admission application',
            message: 'New application ' + trackingId
          });
        }
        window.PSSCloud && window.PSSCloud.triggerNotification && window.PSSCloud.triggerNotification({
              type: 'admission_submitted',
              to: appRecord.email,
              phone: appRecord.phone,
              trackingId,
              studentName: appRecord.studentName
            });
          }
        } catch (err) {
          console.warn('Notification failed:', err);
        }

        // Show confirmation / receipt (always — never skip)
        const confirmModal = document.getElementById('confirm-modal');
        const setText = (id, text) => {
          const el = document.getElementById(id);
          if (el) el.textContent = text || '—';
        };
        setText('confirm-tracking', trackingId);
        setText('confirm-name', studentName);
        setText('confirm-grade', grade);
        if (confirmModal) {
          confirmModal.classList.add('open');
          confirmModal.hidden = false;
          confirmModal.style.display = '';
          document.body.style.overflow = 'hidden';
          // Focus for accessibility
          confirmModal.querySelector('.modal-close, .btn')?.focus?.();
        } else {
          alert('Application submitted.\nTracking ID: ' + trackingId + '\nPlease save this ID.');
        }

        // Reset form after receipt is visible
        wizard.querySelectorAll('input, select, textarea').forEach(el => {
          if (el.type !== 'button' && el.type !== 'submit') el.value = '';
        });
        uploadedFiles = [];
        renderFiles();
        goToStep(0);
      } catch (err) {
        console.error('Submit failed:', err);
        showToast('Something went wrong submitting your application. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
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
          app = await window.PSSCloud.getApplicationByTrackingId(id);
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
      const statusLabels = {
        submitted: 'Submitted', pending: 'Pending Review', under_review: 'Under Review', reviewed: 'Under Review',
        interview_scheduled: 'Interview Scheduled', accepted: 'Accepted', waitlisted: 'Waitlisted', rejected: 'Rejected'
      };
      const st = app.status || 'submitted';
      let timeline = Array.isArray(app.timeline) ? app.timeline.slice() : [];
      if (!timeline.length) {
        timeline = [{ status: 'submitted', at: app.submittedAt || '', note: 'Application received' }];
        if (st && st !== 'submitted') {
          timeline.push({ status: st, at: app.updatedAt || '', note: '' });
        }
      }
      timeline.sort((a, b) => new Date(a.at || 0) - new Date(b.at || 0));
      const clean = [];
      timeline.forEach((t) => {
        const last = clean[clean.length - 1];
        if (!last || last.status !== t.status || last.at !== t.at) clean.push(t);
      });
      const timelineHtml = clean.map((t) => {
        const label = statusLabels[t.status] || t.status;
        const when = t.at ? new Date(t.at).toLocaleString() : '';
        const note = t.note ? `<br><span style="font-size:0.8rem;color:var(--text-muted)">${String(t.note).replace(/</g, '&lt;')}</span>` : '';
        return `<li style="margin:0.35rem 0"><strong>${label}</strong>${when ? '<br><span style="font-size:0.8rem;color:var(--text-muted)">' + when + '</span>' : ''}${note}</li>`;
      }).join('');
      statusResult.innerHTML = `
        <span class="status-badge ${st}">${statusLabels[st] || st}</span>
        <h4 style="margin-bottom:0.5rem">${app.studentName || 'Student'}</h4>
        <p style="color:var(--text-secondary);font-size:0.9rem">Grade Applied: ${app.gradeApplied || '—'}</p>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">Submitted: ${app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p>
        <p style="color:var(--text-muted);font-size:0.85rem">Tracking ID: <strong>${app.trackingId}</strong></p>
        <h4 style="margin:1rem 0 0.35rem;font-size:0.95rem">Timeline</h4>
        <ul style="list-style:none;padding:0;margin:0;text-align:left;border-left:2px solid rgba(0,168,89,0.35);padding-left:1rem">${timelineHtml}</ul>
      `;
      statusResult.classList.add('visible');
    });
  }

  // Deep-link: admissions.html#track
  if (location.hash === '#track') {
    const el = document.getElementById('track');
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
