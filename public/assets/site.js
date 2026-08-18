/* Car Wash Services — progressive enhancement (no content injection) */
(function () {
  function showSuccess(form, message) {
    form.innerHTML =
      '<div style="text-align:center;padding:48px 16px"><div style="font-size:40px;color:#22c55e">✓</div><h3 style="font-size:22px;font-weight:800;color:#0f172a;margin:8px 0">' +
      message +
      '</h3></div>';
  }

  async function submitForm(endpoint, data) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(function () {
      return {};
    });
    if (!res.ok) throw new Error(json.error || 'Submission failed');
    return json;
  }

  function collectContactForm(form) {
    var help = [];
    form.querySelectorAll('.chip input:checked').forEach(function (cb) {
      var label = cb.closest('.chip');
      if (label) help.push(label.textContent.trim());
    });
    return {
      name: form.querySelector('[name="name"]')?.value || '',
      email: form.querySelector('[name="email"]')?.value || '',
      phone: form.querySelector('[name="phone"]')?.value || '',
      company_name: form.querySelector('[name="company_name"]')?.value || '',
      city_state: form.querySelector('[name="city_state"]')?.value || '',
      wash_type: form.querySelector('[name="wash_type"]')?.value || '',
      locations: form.querySelector('[name="locations"]')?.value || '',
      urgency: form.querySelector('[name="urgency"]')?.value || '',
      followup: form.querySelector('[name="followup"]')?.value || '',
      help: help,
      message: form.querySelector('[name="message"]')?.value || '',
      type: 'contact',
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.lucide) lucide.createIcons();

    var mm = document.getElementById('mobile-menu');
    var open = document.getElementById('mm-open');
    var close = document.getElementById('mm-close');
    if (open && mm)
      open.onclick = function () {
        mm.classList.add('open');
        document.body.style.overflow = 'hidden';
      };
    if (close && mm)
      close.onclick = function () {
        mm.classList.remove('open');
        document.body.style.overflow = '';
      };
    var st = document.getElementById('mm-services-toggle');
    if (st) {
      st.onclick = function () {
        var sub = document.getElementById('mm-services-sub');
        var chev = document.getElementById('mm-services-chev');
        if (!sub) return;
        sub.classList.toggle('open');
        if (chev)
          chev.style.transform = sub.classList.contains('open') ? 'rotate(180deg)' : '';
      };
    }

    var seen = false;
    try {
      seen = sessionStorage.getItem('np_seen');
    } catch (e) {}
    if (!seen) {
      setTimeout(function () {
        var ov = document.getElementById('np-overlay');
        if (ov) ov.classList.add('open');
      }, 12000);
    }
    var npc = document.getElementById('np-close');
    if (npc)
      npc.onclick = function () {
        var ov = document.getElementById('np-overlay');
        if (ov) ov.classList.remove('open');
        try {
          sessionStorage.setItem('np_seen', '1');
        } catch (e) {}
      };

    document.querySelectorAll('.acc-q').forEach(function (b) {
      b.onclick = function () {
        b.closest('.acc-item')?.classList.toggle('open');
      };
    });

    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(function (el) {
      io.observe(el);
    });

    document.querySelectorAll('form[data-form]').forEach(function (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var kind = form.getAttribute('data-form');
        var btn = form.querySelector('[type="submit"]');
        if (btn) btn.disabled = true;

        try {
          if (kind === 'contact') {
            await submitForm('/api/contact', collectContactForm(form));
            showSuccess(form, form.getAttribute('data-success') || 'Request received!');
          } else if (kind === 'newsletter') {
            await submitForm('/api/newsletter', {
              email: form.querySelector('[name="email"]')?.value || '',
            });
            form.innerHTML =
              '<p style="color:#22c55e;font-weight:700">✓ Subscribed! Thanks for joining.</p>';
          } else if (kind === 'guide') {
            await submitForm('/api/guide', {
              name: form.querySelector('[name="name"]')?.value || '',
              email: form.querySelector('[name="email"]')?.value || '',
            });
            form.innerHTML =
              '<p style="color:#0F52FB;font-weight:700;text-align:center;padding:12px 0">✓ Check your inbox — guide on its way!</p>';
            try {
              sessionStorage.setItem('np_seen', '1');
            } catch (err) {}
          } else if (kind === 'testimonial') {
            await submitForm('/api/testimonial', Object.fromEntries(new FormData(form)));
            showSuccess(
              form,
              form.getAttribute('data-success') ||
                'Thank you! Your testimonial has been submitted for review.'
            );
          }
        } catch (err) {
          if (btn) btn.disabled = false;
          alert(err.message || 'Something went wrong. Please call us at (808) 465-2291.');
        }
      });
    });
  });

  window.runROICalc = function () {
    function n(id) {
      var v = parseFloat((document.getElementById(id) || {}).value);
      return isNaN(v) ? 0 : v;
    }
    var cars = n('cal-cars');
    var days = n('cal-days') || 30;
    var chem = n('cal-chem');
    var downtime = n('cal-downtime');
    var revPerCar = n('cal-rev') || 12;
    var monthlyCars = cars * days;
    var chemSavings = chem * 0.3;
    var hourlyThroughput = cars / 10;
    var downtimeRecovered = downtime * hourlyThroughput * revPerCar;
    var totalMonthly = chemSavings + downtimeRecovered;
    var totalAnnual = totalMonthly * 12;
    function money(x) {
      return '$' + Math.round(x).toLocaleString();
    }
    function set(id, val) {
      var e = document.getElementById(id);
      if (e) e.textContent = val;
    }
    set('res-chem', money(chemSavings) + '/mo');
    set('res-downtime', money(downtimeRecovered) + '/mo');
    set('res-monthly', money(totalMonthly));
    set('res-annual', money(totalAnnual));
    set('res-cars', Math.round(monthlyCars).toLocaleString());
    var box = document.getElementById('calc-results');
    if (box) {
      box.style.display = 'block';
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
})();
