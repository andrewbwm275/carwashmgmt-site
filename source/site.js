/* Car Wash Services — shared site chrome + interactions */
(function () {
  var LOGO = "https://media.base44.com/images/public/699f163455fdaf19c59586b8/a0be2bc22_Untitleddesign7.png";
  var LOGO_FOOT = "https://media.base44.com/images/public/699f163455fdaf19c59586b8/3f1c3675a_Untitleddesign9.png";
  var PHONE = "(808) 465-2291";
  var PAGE = document.body.getAttribute("data-page") || "";

  function active(p){ return PAGE === p ? " active" : ""; }

  /* ---------------- HEADER ---------------- */
  var header = '\
  <header class="site-header">\
    <div class="hdr-inner">\
      <a href="index.html" class="mobile-logo" style="display:flex;align-items:center"><img src="'+LOGO+'" alt="Car Wash Services" style="height:28px;width:auto;object-fit:contain"></a>\
      <a href="index.html" class="desktop-logo"><img src="'+LOGO+'" alt="Car Wash Services" style="height:48px;width:auto;object-fit:contain"></a>\
      <nav class="desktop-nav">\
        <div class="has-mega">\
          <a href="solutions.html" class="nav-link'+active("Solutions")+'">Services <i data-lucide="chevron-down" style="width:12px;height:12px"></i><span class="under"></span></a>\
          <div class="mega"><div class="mega-card"><div class="mega-grid">\
            <a href="chemistry.html" class="mega-item"><div class="mega-ico"><i data-lucide="flask-conical" style="width:18px;height:18px;color:#0F52FB"></i></div><h5>Chemical programs</h5><p>Premium chemistry engineered for your water conditions and wash volume.</p></a>\
            <a href="preventive-maintenance.html" class="mega-item"><div class="mega-ico"><i data-lucide="shield" style="width:18px;height:18px;color:#0F52FB"></i></div><h5>Preventive maintenance</h5><p>Scheduled service that catches problems before they cost you revenue.</p></a>\
            <a href="equipment.html" class="mega-item"><div class="mega-ico"><i data-lucide="wrench" style="width:18px;height:18px;color:#0F52FB"></i></div><h5>Equipment solutions</h5><p>Install, upgrade, and repair. Full lifecycle equipment management.</p></a>\
            <a href="book-a-call.html" class="mega-item" style="background:linear-gradient(135deg,#02133F 0%,#0A1E52 100%);border-color:#0A1E52"><span style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#C9A961;display:block;margin-bottom:8px">NOT SURE WHERE TO START?</span><h5 style="color:#fff">Book a free consultation.</h5><p style="color:rgba(255,255,255,.4);margin-bottom:12px">30 minutes. We\'ll find your biggest opportunity.</p><span class="btn btn-blue" style="width:100%;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-radius:2px;height:32px">BOOK NOW →</span></a>\
          </div>\
          <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--line);display:flex;align-items:center;gap:12px">\
            <div style="width:32px;height:32px;border-radius:6px;background:rgba(201,169,97,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i data-lucide="settings" style="width:16px;height:16px;color:#C9A961"></i></div>\
            <span style="font-size:12px;font-weight:700;color:#000">Consulting &amp; strategy</span>\
            <span style="font-size:10px;color:var(--gray)">Operational audits, new site planning, profitability optimization</span>\
            <a href="solutions.html" style="margin-left:auto;font-size:11px;font-weight:500;color:var(--blue);display:flex;align-items:center;gap:4px">Learn more <i data-lucide="arrow-right" style="width:12px;height:12px"></i></a>\
          </div></div></div>\
        </div>\
        <a href="about.html" class="nav-link'+active("About")+'">About<span class="under"></span></a>\
        <a href="results.html" class="nav-link'+active("Results")+'">Results<span class="under"></span></a>\
        <a href="blog.html" class="nav-link'+active("Blog")+'">Blog<span class="under"></span></a>\
        <a href="contact.html" class="nav-link'+active("Contact")+'">Contact<span class="under"></span></a>\
      </nav>\
      <div class="desktop-actions">\
        <a href="calculator.html" class="btn btn-outline" style="padding:8px 12px;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-radius:2px;height:32px"><i data-lucide="calculator" style="width:12px;height:12px"></i> ROI Calculator</a>\
        <a href="tel:+18084652291" style="display:flex;align-items:center;gap:6px"><i data-lucide="phone" style="width:12px;height:12px;color:var(--blue)"></i><span style="font-size:11px;font-weight:500;color:#000">'+PHONE+'</span></a>\
        <a href="book-a-call.html" class="btn btn-blue" style="padding:10px 20px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;border-radius:4px;height:36px;box-shadow:0 4px 6px rgba(0,0,0,.1)">Free Consultation <i data-lucide="arrow-right" style="width:12px;height:12px"></i></a>\
      </div>\
      <div class="mobile-actions">\
        <a href="book-a-call.html" class="btn btn-blue" style="font-size:8px;text-transform:uppercase;letter-spacing:1px;border-radius:4px;height:28px;padding:0 12px;font-weight:700">Book call</a>\
        <button id="mm-open" style="padding:10px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer"><i data-lucide="menu" style="width:22px;height:22px;color:#0A0A0A"></i></button>\
      </div>\
    </div>\
  </header>\
  <div class="mobile-menu" id="mobile-menu">\
    <div class="mm-head"><a href="index.html"><img src="'+LOGO+'" style="height:28px"></a><button id="mm-close" style="padding:8px;background:none;border:none;cursor:pointer"><i data-lucide="x" style="width:22px;height:22px"></i></button></div>\
    <nav style="display:flex;flex-direction:column;min-height:calc(100vh - 52px)">\
      <div style="border-bottom:1px solid var(--line2)">\
        <button class="mm-row" id="mm-services-toggle"><span>Services</span><i data-lucide="chevron-down" id="mm-services-chev" style="width:14px;height:14px;color:#9A9A96"></i></button>\
        <div class="mm-sub" id="mm-services-sub">\
          <a href="chemistry.html" class="mm-subitem"><div style="width:28px;height:28px;border-radius:4px;background:rgba(15,82,251,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i data-lucide="flask-conical" style="width:16px;height:16px;color:#0F52FB"></i></div><div><div style="font-size:12px;font-weight:500;color:#3A3A3A">Chemical programs</div><div style="font-size:9px;color:#9A9A96">Premium chemistry solutions</div></div></a>\
          <a href="preventive-maintenance.html" class="mm-subitem"><div style="width:28px;height:28px;border-radius:4px;background:rgba(15,82,251,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i data-lucide="shield" style="width:16px;height:16px;color:#0F52FB"></i></div><div><div style="font-size:12px;font-weight:500;color:#3A3A3A">Preventive maintenance</div><div style="font-size:9px;color:#9A9A96">Keep your wash running</div></div></a>\
          <a href="equipment.html" class="mm-subitem"><div style="width:28px;height:28px;border-radius:4px;background:rgba(15,82,251,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i data-lucide="wrench" style="width:16px;height:16px;color:#0F52FB"></i></div><div><div style="font-size:12px;font-weight:500;color:#3A3A3A">Equipment solutions</div><div style="font-size:9px;color:#9A9A96">Install, upgrade &amp; repair</div></div></a>\
          <a href="solutions.html" class="mm-subitem" style="border-bottom:none"><div style="width:28px;height:28px;border-radius:4px;background:rgba(196,148,74,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i data-lucide="settings" style="width:16px;height:16px;color:#C4944A"></i></div><div><div style="font-size:12px;font-weight:500;color:#3A3A3A">Consulting &amp; strategy</div><div style="font-size:9px;color:#9A9A96">Audits, planning &amp; optimization</div></div></a>\
        </div>\
      </div>\
      <a href="about.html" class="mm-row">About <i data-lucide="chevron-right" style="width:14px;height:14px;color:#C8C8C4"></i></a>\
      <a href="results.html" class="mm-row">Results <i data-lucide="chevron-right" style="width:14px;height:14px;color:#C8C8C4"></i></a>\
      <a href="blog.html" class="mm-row">Blog <i data-lucide="chevron-right" style="width:14px;height:14px;color:#C8C8C4"></i></a>\
      <a href="contact.html" class="mm-row">Contact <i data-lucide="chevron-right" style="width:14px;height:14px;color:#C8C8C4"></i></a>\
      <a href="calculator.html" class="mm-row" style="gap:12px;justify-content:flex-start;color:#0F52FB"><i data-lucide="calculator" style="width:16px;height:16px;color:#0F52FB"></i> ROI Calculator</a>\
      <div style="margin-top:auto;background:#FAFAF8;border-top:1px solid var(--line);padding:16px;position:sticky;bottom:0;display:flex;flex-direction:column;gap:8px">\
        <a href="book-a-call.html" class="btn" style="background:#0F52FB;color:#fff;height:48px;border-radius:8px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;font-weight:700"><i data-lucide="calendar" style="width:16px;height:16px"></i> BOOK FREE CONSULTATION</a>\
        <a href="tel:+18084652291" class="btn" style="background:#02133F;color:#fff;height:48px;border-radius:8px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;font-weight:700"><i data-lucide="phone" style="width:16px;height:16px"></i> CALL '+PHONE+'</a>\
        <a href="mailto:info@carwashmgmt.com" class="btn" style="background:transparent;border:1px solid var(--line);color:#5A5A5A;height:44px;border-radius:8px;font-size:11px"><i data-lucide="mail" style="width:16px;height:16px;color:#0F52FB"></i> info@carwashmgmt.com</a>\
      </div>\
    </nav>\
  </div>';

  /* ---------------- FOOTER ---------------- */
  var year = new Date().getFullYear();
  var footer = '\
  <footer class="site-footer"><div class="foot-inner">\
    <div style="margin-bottom:48px;padding-bottom:32px;border-bottom:1px solid #1e293b">\
      <div style="display:grid;gap:24px;align-items:center" class="foot-news">\
        <div><h3 style="font-size:18px;font-weight:700;margin:0 0 8px">Join 200+ Car Wash Operators</h3><p style="color:#94a3b8;font-size:14px;margin:0">Get operational tips, chemical strategies, and profitability tactics — straight from our team. No spam, no fluff.</p></div>\
        <div><form id="foot-news-form" style="display:flex;gap:8px"><input class="foot-input" type="email" placeholder="Enter your email" required><button class="btn" type="submit" style="background:#073ECC;color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:700">Subscribe <i data-lucide="arrow-right" style="width:16px;height:16px"></i></button></form><p style="color:#64748b;font-size:12px;margin:8px 0 0">Unsubscribe anytime.</p></div>\
      </div>\
    </div>\
    <div class="foot-grid">\
      <div>\
        <img src="'+LOGO_FOOT+'" alt="Car Wash Management" style="height:64px;width:auto;margin-bottom:16px">\
        <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 24px">The operational backbone of California\'s car wash industry.</p>\
        <div style="display:flex;gap:12px">\
          <a class="soc" href="https://www.facebook.com/CarWashManagementLLC" target="_blank" rel="noopener"><i data-lucide="facebook" style="width:16px;height:16px"></i></a>\
          <a class="soc" href="https://www.linkedin.com/company/carwashmgmt/" target="_blank" rel="noopener"><i data-lucide="linkedin" style="width:16px;height:16px"></i></a>\
          <a class="soc" href="https://www.youtube.com/@CarWashManagementLLC" target="_blank" rel="noopener"><i data-lucide="youtube" style="width:16px;height:16px"></i></a>\
          <a class="soc" href="https://www.instagram.com/carwashmgmt" target="_blank" rel="noopener"><i data-lucide="instagram" style="width:16px;height:16px"></i></a>\
        </div>\
      </div>\
      <div>\
        <h4 style="font-weight:600;margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8">Contact</h4>\
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:16px;color:#cbd5e1;font-size:14px">\
          <li style="display:flex;gap:12px"><i data-lucide="phone" style="width:16px;height:16px;color:#3882f6;flex-shrink:0;margin-top:2px"></i><a href="tel:+18084652291">808-465-2291</a></li>\
          <li style="display:flex;gap:12px"><i data-lucide="mail" style="width:16px;height:16px;color:#3882f6;flex-shrink:0;margin-top:2px"></i><a href="mailto:info@carwashmgmt.com">info@carwashmgmt.com</a></li>\
          <li style="display:flex;gap:12px"><i data-lucide="clock" style="width:16px;height:16px;color:#3882f6;flex-shrink:0;margin-top:2px"></i><span>Mon–Fri: 8am – 6pm PST</span></li>\
          <li style="display:flex;gap:12px"><i data-lucide="map-pin" style="width:16px;height:16px;color:#3882f6;flex-shrink:0;margin-top:2px"></i><span>Serving car washes nationwide</span></li>\
        </ul>\
      </div>\
      <div>\
        <h4 style="font-weight:600;margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8">Quick Links</h4>\
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;font-size:14px">\
          <li><a href="about.html" style="color:#cbd5e1">About</a></li>\
          <li><a href="chemistry.html" style="color:#cbd5e1">Chemicals</a></li>\
          <li><a href="preventive-maintenance.html" style="color:#cbd5e1">Maintenance</a></li>\
          <li><a href="equipment.html" style="color:#cbd5e1">Equipment</a></li>\
          <li><a href="solutions.html" style="color:#cbd5e1">Consulting</a></li>\
          <li><a href="results.html" style="color:#cbd5e1">Results</a></li>\
        </ul>\
      </div>\
    </div>\
    <div style="border-top:1px solid #1e293b;margin-top:48px;padding-top:32px;display:flex;flex-direction:column;gap:16px;align-items:center" class="foot-bottom">\
      <p style="font-size:12px;color:#64748b;margin:0">© '+year+' Car Wash Services LLC. All rights reserved.</p>\
      <div style="display:flex;gap:24px;font-size:12px;color:#64748b"><a href="privacy-policy.html">Privacy Policy</a><a href="terms-and-conditions.html">Terms &amp; Conditions</a></div>\
    </div>\
  </div></footer>';

  /* sticky bottom bar (mobile) + sticky CTA (desktop) + newsletter popup */
  var stickyBottom = '<div class="sticky-bottom">\
    <a href="tel:+18084652291"><i data-lucide="phone" style="width:18px;height:18px"></i>Call</a>\
    <a href="calculator.html"><i data-lucide="calculator" style="width:18px;height:18px"></i>ROI</a>\
    <a href="book-a-call.html" class="primary"><i data-lucide="calendar" style="width:18px;height:18px"></i>Book Call</a>\
  </div>';
  var stickyCta = '<a href="book-a-call.html" class="sticky-cta"><i data-lucide="calendar" style="width:16px;height:16px"></i> Free Consultation</a>';
  var popup = '<div class="np-overlay" id="np-overlay"><div class="np-card">\
    <button class="np-close" id="np-close"><i data-lucide="x" style="width:20px;height:20px"></i></button>\
    <div style="width:48px;height:48px;border-radius:12px;background:rgba(15,82,251,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px"><i data-lucide="book-open" style="width:24px;height:24px;color:#0F52FB"></i></div>\
    <h3 style="font-size:22px;font-weight:800;margin:0 0 8px;color:#0f172a">The Car Wash Profit Guide</h3>\
    <p style="color:#64748b;font-size:14px;margin:0 0 20px">Join 200+ operators. Get our free guide on the chemical, downtime, and operational leaks quietly draining your margins.</p>\
    <form id="np-form" style="display:flex;flex-direction:column;gap:10px">\
      <input class="foot-input" style="background:#f1f5f9;border:1px solid #e2e8f0;color:#0f172a" type="text" placeholder="Your name" required>\
      <input class="foot-input" style="background:#f1f5f9;border:1px solid #e2e8f0;color:#0f172a" type="email" placeholder="Your email" required>\
      <button class="btn btn-blue" type="submit" style="height:46px;border-radius:8px;font-size:14px">Send Me the Guide <i data-lucide="arrow-right" style="width:16px;height:16px"></i></button>\
    </form><p style="color:#94a3b8;font-size:11px;margin:10px 0 0;text-align:center">No spam. Unsubscribe anytime.</p>\
  </div></div>';

  /* inject */
  document.addEventListener("DOMContentLoaded", function () {
    var h = document.getElementById("site-header");
    if (h) h.outerHTML = header;
    var f = document.getElementById("site-footer");
    if (f) f.outerHTML = footer;
    document.body.insertAdjacentHTML("beforeend", stickyBottom + stickyCta + popup);

    if (window.lucide) lucide.createIcons();

    // mobile menu
    var mm = document.getElementById("mobile-menu");
    var open = document.getElementById("mm-open");
    var close = document.getElementById("mm-close");
    if (open) open.onclick = function(){ mm.classList.add("open"); document.body.style.overflow="hidden"; };
    if (close) close.onclick = function(){ mm.classList.remove("open"); document.body.style.overflow=""; };
    var st = document.getElementById("mm-services-toggle");
    if (st) st.onclick = function(){
      document.getElementById("mm-services-sub").classList.toggle("open");
      document.getElementById("mm-services-chev").style.transform =
        document.getElementById("mm-services-sub").classList.contains("open") ? "rotate(180deg)" : "";
    };

    // newsletter popup after 12s (once per session)
    var seen = false;
    try { seen = sessionStorage.getItem("np_seen"); } catch(e){}
    if (!seen) setTimeout(function(){
      var ov = document.getElementById("np-overlay");
      if (ov) ov.classList.add("open");
    }, 12000);
    var npc = document.getElementById("np-close");
    if (npc) npc.onclick = function(){
      document.getElementById("np-overlay").classList.remove("open");
      try { sessionStorage.setItem("np_seen","1"); } catch(e){}
    };
    var npf = document.getElementById("np-form");
    if (npf) npf.onsubmit = function(e){ e.preventDefault(); npf.innerHTML='<p style="color:#0F52FB;font-weight:700;text-align:center;padding:12px 0">✓ Check your inbox — guide on its way!</p>'; try{sessionStorage.setItem("np_seen","1");}catch(err){} };
    var fnf = document.getElementById("foot-news-form");
    if (fnf) fnf.onsubmit = function(e){ e.preventDefault(); fnf.innerHTML='<p style="color:#22c55e;font-weight:700">✓ Subscribed! Thanks for joining.</p>'; };

    // FAQ accordions (any .acc-item with .acc-q)
    document.querySelectorAll(".acc-q").forEach(function(b){
      b.onclick = function(){ b.closest(".acc-item").classList.toggle("open"); };
    });

    // scroll reveal
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target);} });
    }, {threshold:.12});
    document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

    // generic form fallback (contact / quote) — show success
    document.querySelectorAll("form[data-mock]").forEach(function(fm){
      fm.onsubmit = function(e){
        e.preventDefault();
        var msg = fm.getAttribute("data-success") || "✓ Message sent! We'll get back to you within 24 hours.";
        fm.innerHTML = '<div style="text-align:center;padding:48px 16px"><div style="font-size:40px;color:#22c55e">✓</div><h3 style="font-size:22px;font-weight:800;color:#0f172a;margin:8px 0">'+msg+'</h3></div>';
      };
    });
  });

  /* ---------------- ROI CALCULATOR ---------------- */
  window.runROICalc = function(){
    function n(id){ var v=parseFloat((document.getElementById(id)||{}).value); return isNaN(v)?0:v; }
    var cars = n("cal-cars");            // cars per day
    var days = n("cal-days") || 30;      // operating days / month
    var chem = n("cal-chem");            // current monthly chemical spend
    var downtime = n("cal-downtime");    // downtime hours / month
    var revPerCar = n("cal-rev") || 12;  // avg revenue per car

    var monthlyCars = cars * days;
    // model assumptions (mirrors site's optimistic ranges)
    var chemSavings = chem * 0.30;                       // 30% chemical reduction
    var revPerHour = (cars/ (days?1:1)) ; // not used directly
    var hourlyThroughput = cars/10;                      // cars/hour rough
    var downtimeRecovered = downtime * hourlyThroughput * revPerCar; // recovered revenue
    var totalMonthly = chemSavings + downtimeRecovered;
    var totalAnnual = totalMonthly * 12;

    function money(x){ return "$" + Math.round(x).toLocaleString(); }
    var set = function(id,val){ var e=document.getElementById(id); if(e) e.textContent=val; };
    set("res-chem", money(chemSavings)+"/mo");
    set("res-downtime", money(downtimeRecovered)+"/mo");
    set("res-monthly", money(totalMonthly));
    set("res-annual", money(totalAnnual));
    set("res-cars", Math.round(monthlyCars).toLocaleString());
    var box = document.getElementById("calc-results");
    if (box){ box.style.display="block"; box.scrollIntoView({behavior:"smooth",block:"center"}); }
  };
})();
