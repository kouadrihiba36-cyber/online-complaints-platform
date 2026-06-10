document.addEventListener('DOMContentLoaded', () => {
  // ══════════════════════════════════════════
  // 1. MOBILE NAVIGATION TOGGLE
  // ══════════════════════════════════════════
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // ══════════════════════════════════════════
  // 2. FORM MODE SWITCHER (Normal vs Anonymous)
  // ══════════════════════════════════════════
  const btnNormal = document.getElementById('btn-normal');
  const btnAnon = document.getElementById('btn-anonymous');
  const formNormal = document.getElementById('form-normal');
  const formAnon = document.getElementById('form-anonymous');

  function switchFormMode(mode) {
    if (mode === 'normal') {
      btnNormal.classList.add('active');
      btnAnon.classList.remove('active');
      formNormal.style.display = 'block';
      if (formAnon) formAnon.style.display = 'none';
    } else {
      btnAnon.classList.add('active');
      btnNormal.classList.remove('active');
      formNormal.style.display = 'none';
      if (formAnon) formAnon.style.display = 'block';
    }
  }

  if (btnNormal && btnAnon) {
    btnNormal.addEventListener('click', () => switchFormMode('normal'));
    btnAnon.addEventListener('click', () => switchFormMode('anonymous'));
  }

  // ══════════════════════════════════════════
  // 3. TEXTAREA CHARACTER COUNTER
  // ══════════════════════════════════════════
  function setupCounter(inputId, counterId, maxLength) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    
    if (input && counter) {
      input.addEventListener('input', () => {
        const currentLength = input.value.length;
        counter.textContent = `${currentLength} / ${maxLength}`;
        if (currentLength > maxLength * 0.9) {
          counter.style.color = 'red';
        } else {
          counter.style.color = 'inherit';
        }
      });
    }
  }

  setupCounter('fn-description', 'counter-fn-description', 1000);
  setupCounter('an-description', 'counter-an-description', 1000); 

  // ══════════════════════════════════════════
  // 4. FORM SUBMISSION
  // ══════════════════════════════════════════
  [formNormal, formAnon].forEach(form => {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      let isValid = true;
      const mode = form.id === 'form-normal' ? 'normal' : 'anonymous';
      const prefix = mode === 'normal' ? 'fn' : 'an';

      // Reset errors
      form.querySelectorAll('.field-error').forEach(el => el.textContent = '');

      if (mode === 'normal') {
        const ninInput = document.getElementById('fn-nin');
        if (ninInput && !/^\d{18}$/.test(ninInput.value)) {
          document.getElementById('err-nin').textContent = 'رقم الهوية الوطنية يجب أن يتكون من 18 رقماً.';
          isValid = false;
        }

        const phoneInput = document.getElementById('fn-phone');
        if (phoneInput && !/^0[567][0-9]{8}$/.test(phoneInput.value.replace(/\s/g, ''))) {
          document.getElementById('err-phone').textContent = 'الرجاء إدخال رقم هاتف صحيح (مثال: 0550123456).';
          isValid = false;
        }
      }

      const descInput = document.getElementById(`${prefix}-description`);
      if (descInput && descInput.value.length < 10) {
        document.getElementById(`err-${prefix}-description`).textContent = 'الرجاء شرح الشكوى بالتفصيل (10 أحرف على الأقل).';
        isValid = false;
      }

      if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = 'جاري الإرسال...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate API Request
       const formData = new FormData(form);

if (mode === 'normal') {
  const priority = document.querySelector('input[name="fn_priority"]:checked');
  if (priority) {
    formData.append('priority', priority.value);
  }
} else {
  const priority = document.querySelector('input[name="an_priority"]:checked');
  if (priority) {
    formData.append('priority', priority.value);
  }
}

// Upload files
uploadedFiles[mode].forEach(file => {
  formData.append('files[]', file);
});

fetch('submit.php', {
  method: 'POST',
  body: formData
})
.then(response => response.text())
.then(data => {

  if (data.trim() === 'Success') {

    showSuccessModal(mode);

    form.reset();
    uploadedFiles[mode] = [];
    renderFileList(mode);

  } else {

    alert('خطأ أثناء حفظ البيانات');
    console.log(data);

  }

  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;
  submitBtn.style.opacity = '1';

})
.catch(error => {

  console.error(error);

  alert('فشل الاتصال بالخادم');

  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;
  submitBtn.style.opacity = '1';

});
      }
    });
  });
});

// ══════════════════════════════════════════
// 5. SUCCESS MODAL LOGIC
// ══════════════════════════════════════════
function showSuccessModal(mode) {
  const modal = document.getElementById('success-modal');
  const refDisplay = document.getElementById('modal-ref');
  const infoNormal = document.getElementById('modal-info-normal');
  
  // Generate random reference
  const refNum = 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  if (refDisplay) refDisplay.textContent = `رقم المراجعة: ${refNum}`;
  
  if (infoNormal) {
    infoNormal.style.display = (mode === 'normal') ? 'block' : 'none';
  }
  
  modal.classList.add('show');
}

function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  modal.classList.remove('show');
}

// ══════════════════════════════════════════
// 6. FILE UPLOAD LOGIC
// ══════════════════════════════════════════
const uploadedFiles = { normal: [], anonymous: [] };
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;

function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.style.borderColor = '#006233';
  event.currentTarget.style.backgroundColor = 'rgba(0, 98, 51, 0.05)';
}

function handleDragLeave(event) {
  event.preventDefault();
  event.currentTarget.style.borderColor = '#ccc';
  event.currentTarget.style.backgroundColor = 'transparent';
}

function handleDrop(event, mode) {
  event.preventDefault();
  handleDragLeave(event);
  processFiles(event.dataTransfer.files, mode);
}

function handleFileSelect(event, mode) {
  processFiles(event.target.files, mode);
}

function processFiles(files, mode) {
  const currentCount = uploadedFiles[mode].length;
  const newFiles = Array.from(files);

  if (currentCount + newFiles.length > MAX_FILES) {
    alert(`عذراً، يمكنك رفع ${MAX_FILES} ملفات كحد أقصى.`);
    return;
  }

  newFiles.forEach(file => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`الملف "${file.name}" يتجاوز الحجم المسموح به (5MB).`);
      return;
    }
    uploadedFiles[mode].push(file);
  });
  renderFileList(mode);
}

function renderFileList(mode) {
  const list = document.getElementById(`file-list-${mode === 'normal' ? 'normal' : 'anon'}`);
  if (!list) return;
  list.innerHTML = '';
  uploadedFiles[mode].forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <div class="file-item-icon">📄</div>
      <div class="file-item-name">${file.name}</div>
      <div class="file-item-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</div>
      <button type="button" class="file-item-remove" onclick="removeFile(${index}, '${mode}')">✕</button>
    `;
    list.appendChild(item);
  });
}

function removeFile(index, mode) {
  uploadedFiles[mode].splice(index, 1);
  renderFileList(mode);
}

function resetForm(mode) {
  uploadedFiles[mode] = [];
  renderFileList(mode);
  const counter = document.getElementById(`counter-${mode === 'normal' ? 'fn' : 'an'}-description`);
  if (counter) counter.textContent = '0 / 1000';
}

// ══════════════════════════════════════════
// 7. FAQ ACCORDION
// ══════════════════════════════════════════
function toggleFaq(button) {
  const item = button.parentElement;
  item.classList.toggle('active');
}
