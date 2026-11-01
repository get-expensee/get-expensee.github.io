// Společný skript všech stránek webu.
// Telefon jako na snímcích pro Google Play: boční tlačítka, obrazovka aplikace, stavový řádek 9:30 s plnými ikonami, fotoaparát.
document.querySelectorAll(".phone[data-shot]").forEach(function (p) {
  p.innerHTML = '<div class="btn" style="top:150px;height:21px"></div><div class="btn" style="top:205px;height:60px"></div>'
    + '<div class="bezel"><div class="screen"><img src="' + p.dataset.shot + '" alt="' + p.dataset.alt + '">'
    + '<div class="status">9:30<span>'
    + '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21 0 7.5Q2.4 5.2 5.5 3.85 8.6 2.5 12 2.5t6.5 1.35Q21.6 5.2 24 7.5Z"/></svg>'
    + '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M2 22 22 2v20Z"/></svg>'
    + '<svg viewBox="0 0 14 24"><path fill="currentColor" d="M4 24q-.85 0-1.42-.58Q2 22.85 2 22V5q0-.85.58-1.42Q3.15 3 4 3h2V1h2v2h2q.85 0 1.43.58Q12 4.15 12 5v17q0 .85-.57 1.42Q10.85 24 10 24Z"/></svg>'
    + '</span></div><div class="cam"></div></div></div>';
});
// Jen jeden jazyk: #cs / #en z odkazu, jinak podle jazyka prohlížeče (čeština a slovenština → cs). Vnitřní odkazy
// s data-keep dostanou zvolený jazyk, aby se po prokliku nepřepnul.
(function () {
  function show(scroll) {
    var h = location.hash.slice(1);
    var l = h === "cs" || h === "en" ? h : (/^(cs|sk)/i.test(navigator.language || "") ? "cs" : "en");
    document.documentElement.lang = l;
    document.querySelectorAll("[data-lang]").forEach(function (e) { e.hidden = e.getAttribute("data-lang") !== l; });
    document.querySelectorAll(".lang a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + l); });
    document.querySelectorAll("a[data-keep]").forEach(function (a) { a.hash = l; });
    if (scroll) window.scrollTo(0, 0);
  }
  addEventListener("hashchange", function () { show(true); });
  show(false);
})();
// Zdroj návštěvy (…/instagram → ?utm_source=instagram&utm_campaign=bio_en) předat do odkazů na Google Play, aby se
// v Play Console (Conversion analysis → UTM source) dal odlišit od webu. V sessionStorage platí i pro další stránky webu.
(function () {
  var ok = /^[a-z0-9_-]{1,40}$/, q = new URLSearchParams(location.search), z = null;
  if (ok.test(q.get("utm_source") || "")) {
    z = { s: q.get("utm_source"), c: q.get("utm_campaign") || "" };
    try { sessionStorage.setItem("zdroj", JSON.stringify(z)); } catch (e) {}
    history.replaceState(null, "", location.pathname + location.hash);
  } else {
    try { z = JSON.parse(sessionStorage.getItem("zdroj")); } catch (e) {}
  }
  if (!z || !ok.test(z.s) || (z.c && !ok.test(z.c))) return;
  document.querySelectorAll('a[href^="https://play.google.com/"]').forEach(function (a) {
    var u = new URL(a.href);
    u.searchParams.set("referrer", "utm_source=" + z.s + (z.c ? "&utm_campaign=" + z.c : ""));
    a.href = u.toString();
  });
})();
