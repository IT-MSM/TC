(function () {
  'use strict';

  const ACCESS_CODE = '0000';
  const form = document.getElementById('settings-panel');
  const lock = document.getElementById('settings-lock');
  const unlockForm = document.getElementById('settings-unlock-form');
  if (!form || !lock || !unlockForm || !window.TrustCenter) return;

  const names = [
    'whatsapp', 'telegram', 'facebookUrl',
    'morningCash', 'morningInstapay', 'morningInstapayLink',
    'eveningCash', 'eveningInstapay', 'eveningInstapayLink',
    'address', 'mapQuery', 'wifiSSID', 'wifiPassword'
  ];

  function showSettings() {
    lock.hidden = true;
    form.hidden = false;
    names.forEach(function (name) {
      const input = form.elements.namedItem(name);
      if (input) input.value = window.TrustCenter.getSettings()[name] || '';
    });
  }

  if (sessionStorage.getItem('trustCenterSettingsUnlocked') === '1') showSettings();

  unlockForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const input = document.getElementById('settings-passcode');
    const error = document.getElementById('unlock-error');
    const code = window.TrustCenter.phoneDigits(input.value);
    if (code !== ACCESS_CODE) {
      error.textContent = 'الرمز مش صحيح. جرّب تاني.';
      input.value = '';
      input.focus();
      return;
    }
    sessionStorage.setItem('trustCenterSettingsUnlocked', '1');
    error.textContent = '';
    showSettings();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const previous = window.TrustCenter.getSettings();
    const next = { ...previous };
    names.forEach(function (name) {
      const input = form.elements.namedItem(name);
      if (input) next[name] = input.value.trim();
    });
    if (!next.mapQuery) next.mapQuery = next.address;
    try {
      window.TrustCenter.saveSettings(next);
      const status = document.getElementById('settings-status');
      if (status) status.textContent = 'اتحفظت الإعدادات على الجهاز ده.';
    } catch (error) {
      const status = document.getElementById('settings-status');
      if (status) status.textContent = 'المتصفح منع التخزين؛ جرّب تفعّل بيانات الموقع.';
    }
  });
}());
