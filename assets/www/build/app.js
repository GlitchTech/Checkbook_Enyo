
// minifier: path aliases

enyo.path.addPaths({g11n: "/home/ryltar/git/gutoc/enyo/../lib/g11n/", layout: "/home/ryltar/git/gutoc/enyo/../lib/layout/", onyx: "/home/ryltar/git/gutoc/enyo/../lib/onyx/source/", private: "/home/ryltar/git/gutoc/enyo/../lib/private/", scripts: "source/scripts/"});

// javascript/g11n.js

if (!this.enyo) {
this.enyo = {};
var empty = {};
enyo.mixin = function(e, t) {
e = e || {};
if (t) {
var n, r;
for (n in t) r = t[n], empty[n] !== r && (e[n] = r);
}
return e;
};
}

"trim" in String.prototype || (String.prototype.trim = function() {
return this.replace(/^\s+|\s+$/g, "");
}), enyo.g11n = function() {}, enyo.g11n._init = function() {
if (!enyo.g11n._initialized) {
typeof window != "undefined" ? (enyo.g11n._platform = "browser", enyo.g11n._enyoAvailable = !0) : (enyo.g11n._platform = "node", enyo.g11n._enyoAvailable = !1);
if (navigator) {
var t = (navigator.language || navigator.userLanguage).replace(/-/g, "_").toLowerCase();
enyo.g11n._locale = new enyo.g11n.Locale(t), enyo.g11n._formatLocale = enyo.g11n._locale, enyo.g11n._phoneLocale = enyo.g11n._locale;
}
enyo.g11n._locale === undefined && (enyo.warn("enyo.g11n._init: could not find current locale, so using default of en_us."), enyo.g11n._locale = new enyo.g11n.Locale("en_us")), enyo.g11n._formatLocale === undefined && (enyo.warn("enyo.g11n._init: could not find current formats locale, so using default of us."), enyo.g11n._formatLocale = new enyo.g11n.Locale("en_us")), enyo.g11n._phoneLocale === undefined && (enyo.warn("enyo.g11n._init: could not find current phone locale, so defaulting to the same thing as the formats locale."), enyo.g11n._phoneLocale = enyo.g11n._formatLocale), enyo.g11n._sourceLocale === undefined && (enyo.g11n._sourceLocale = new enyo.g11n.Locale("en_us")), enyo.g11n._initialized = !0;
}
}, enyo.g11n.getPlatform = function() {
return enyo.g11n._platform || enyo.g11n._init(), enyo.g11n._platform;
}, enyo.g11n.isEnyoAvailable = function() {
return enyo.g11n._enyoAvailable || enyo.g11n._init(), enyo.g11n._enyoAvailable;
}, enyo.g11n.currentLocale = function() {
return enyo.g11n._locale || enyo.g11n._init(), enyo.g11n._locale;
}, enyo.g11n.formatLocale = function() {
return enyo.g11n._formatLocale || enyo.g11n._init(), enyo.g11n._formatLocale;
}, enyo.g11n.phoneLocale = function() {
return enyo.g11n._phoneLocale || enyo.g11n._init(), enyo.g11n._phoneLocale;
}, enyo.g11n.sourceLocale = function() {
return enyo.g11n._sourceLocale || enyo.g11n._init(), enyo.g11n._sourceLocale;
}, enyo.g11n.setLocale = function(t) {
t && (enyo.g11n._init(), t.uiLocale && (enyo.g11n._locale = new enyo.g11n.Locale(t.uiLocale)), t.formatLocale && (enyo.g11n._formatLocale = new enyo.g11n.Locale(t.formatLocale)), t.phoneLocale && (enyo.g11n._phoneLocale = new enyo.g11n.Locale(t.phoneLocale)), t.sourceLocale && (enyo.g11n._sourceLocale = new enyo.g11n.Locale(t.sourceLocale)), enyo.g11n._enyoAvailable && enyo.reloadG11nResources());
};

// javascript/fmts.js

enyo.g11n.Fmts = function(t) {
var n;
typeof t == "undefined" || !t.locale ? this.locale = enyo.g11n.formatLocale() : typeof t.locale == "string" ? this.locale = new enyo.g11n.Locale(t.locale) : this.locale = t.locale, this.dateTimeFormatHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: this.locale,
type: "region"
}), this.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: this.locale
}), this.dateTimeHash || (this.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: enyo.g11n.currentLocale()
})), this.dateTimeHash || (this.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: new enyo.g11n.Locale("en_us")
}));
}, enyo.g11n.Fmts.prototype.isAmPm = function() {
return typeof this.twelveHourFormat == "undefined" && (this.twelveHourFormat = this.dateTimeFormatHash.is12HourDefault), this.twelveHourFormat;
}, enyo.g11n.Fmts.prototype.isAmPmDefault = function() {
return this.dateTimeFormatHash.is12HourDefault;
}, enyo.g11n.Fmts.prototype.getFirstDayOfWeek = function() {
return this.dateTimeFormatHash.firstDayOfWeek;
}, enyo.g11n.Fmts.prototype.getDateFieldOrder = function() {
return this.dateTimeFormatHash ? this.dateTimeFormatHash.dateFieldOrder : (enyo.warn("Failed to load date time format hash"), "mdy");
}, enyo.g11n.Fmts.prototype.getTimeFieldOrder = function() {
return this.dateTimeFormatHash ? this.dateTimeFormatHash.timeFieldOrder : (enyo.warn("Failed to load date time format hash"), "hma");
}, enyo.g11n.Fmts.prototype.getMonthFields = function() {
return this.dateTimeHash ? this.dateTimeHash.medium.month : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
}, enyo.g11n.Fmts.prototype.getAmCaption = function() {
return this.dateTimeHash ? this.dateTimeHash.am : (enyo.error("Failed to load dateTimeHash."), "AM");
}, enyo.g11n.Fmts.prototype.getPmCaption = function() {
return this.dateTimeHash ? this.dateTimeHash.pm : (enyo.error("Failed to load dateTimeHash."), "PM");
}, enyo.g11n.Fmts.prototype.getMeasurementSystem = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.measurementSystem || "metric";
}, enyo.g11n.Fmts.prototype.getDefaultPaperSize = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.defaultPaperSize || "A4";
}, enyo.g11n.Fmts.prototype.getDefaultPhotoSize = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.defaultPhotoSize || "10X15CM";
}, enyo.g11n.Fmts.prototype.getDefaultTimeZone = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.defaultTimeZone || "Europe/London";
}, enyo.g11n.Fmts.prototype.isAsianScript = function() {
return this.dateTimeFormatHash && typeof this.dateTimeFormatHash.asianScript != "undefined" ? this.dateTimeFormatHash.asianScript : !1;
}, enyo.g11n.Fmts.prototype.isHanTraditional = function() {
return this.dateTimeFormatHash && typeof this.dateTimeFormatHash.scriptStyle != "undefined" ? this.dateTimeFormatHash.scriptStyle === "traditional" : !1;
}, enyo.g11n.Fmts.prototype.textDirection = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.scriptDirection || "ltr";
};

// javascript/locale.js

enyo.g11n.Locale = function(t) {
var n = t ? t.split(/_/) : [];
return this.locale = t, this.language = n[0] || undefined, this.region = n[1] ? n[1].toLowerCase() : undefined, this.variant = n[2] ? n[2].toLowerCase() : undefined, this;
}, enyo.g11n.Locale.prototype.getLocale = function() {
return this.locale;
}, enyo.g11n.Locale.prototype.getLanguage = function() {
return this.language;
}, enyo.g11n.Locale.prototype.getRegion = function() {
return this.region;
}, enyo.g11n.Locale.prototype.getVariant = function() {
return this.variant;
}, enyo.g11n.Locale.prototype.toString = function() {
return this.locale || (this.locale = this.language + "_" + this.region, this.variant && (this.locale = this.locale + "_" + this.variant)), this.locale;
}, enyo.g11n.Locale.prototype.toISOString = function() {
var e = this.language || "";
return this.region && (e += "_" + this.region.toUpperCase()), this.variant && (e += "_" + this.variant.toUpperCase()), e;
}, enyo.g11n.Locale.prototype.isMatch = function(e) {
return e.language && e.region ? (!this.language || this.language === e.language) && (!this.region || this.region === e.region) : e.language ? !this.language || this.language === e.language : !this.region || this.region === e.region;
}, enyo.g11n.Locale.prototype.equals = function(e) {
return this.language === e.language && this.region === e.region && this.variant === e.variant;
}, enyo.g11n.Locale.prototype.useDefaultLang = function() {
var e, t, n;
this.language || (e = enyo.g11n.Utils.getNonLocaleFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats/defLangs.json"
}), t = e && e[this.region], t || (n = enyo.g11n.currentLocale(), t = n.language), this.language = t || "en", this.locale = this.language + "_" + this.region);
};

// javascript/loadfile.js

enyo.g11n.Utils = enyo.g11n.Utils || function() {}, enyo.g11n.Utils._fileCache = {}, enyo.g11n.Utils._getBaseURL = function(e) {
if ("baseURI" in e) return e.baseURI;
var t = e.getElementsByTagName("base");
return t.length > 0 ? t[0].href : window.location.href;
}, enyo.g11n.Utils._fetchAppRootPath = function() {
var e = window.document, t = enyo.g11n.Utils._getBaseURL(e).match(new RegExp(".*://[^#]*/"));
if (t) return t[0];
}, enyo.g11n.Utils._setRoot = function(t) {
var n = t;
return !t && enyo.g11n.isEnyoAvailable() ? n = enyo.g11n.Utils._fetchAppRootPath() + "assets" : n = ".", enyo.g11n.root = n;
}, enyo.g11n.Utils._getRoot = function() {
return enyo.g11n.root || enyo.g11n.Utils._setRoot();
}, enyo.g11n.Utils._getEnyoRoot = function(t) {
var n = "";
return !enyo.g11n.isEnyoAvailable() && t && (n = t), n + enyo.path.paths.enyo + "/../lib/g11n/source";
}, enyo.g11n.Utils._loadFile = function(t) {
var n, r, i = enyo.g11n.getPlatform();
if (i === "node") try {
this.fs || (this.fs = IMPORTS.require("fs")), r = this.fs.readFileSync(t, "utf8"), r && (n = JSON.parse(r));
} catch (s) {
n = undefined;
} else try {
n = JSON.parse(enyo.xhr.request({
url: t,
sync: !0
}).responseText);
} catch (o) {}
return n;
}, enyo.g11n.Utils.getNonLocaleFile = function(t) {
var n, r, i;
if (!t || !t.path) return undefined;
t.path.charAt(0) !== "/" ? (r = t.root || this._getRoot(), i = r + "/" + t.path) : i = t.path;
if (enyo.g11n.Utils._fileCache[i] !== undefined) n = enyo.g11n.Utils._fileCache[i].json; else {
n = enyo.g11n.Utils._loadFile(i);
if (t.cache === undefined || t.cache !== !1) enyo.g11n.Utils._fileCache[i] = {
path: i,
json: n,
locale: undefined,
timestamp: new Date
}, this.oldestStamp === undefined && (this.oldestStamp = enyo.g11n.Utils._fileCache[i].timestamp);
}
return n;
}, enyo.g11n.Utils.getJsonFile = function(t) {
var n, r, i, s, o, u, a, f, l;
if (!t || !t.path || !t.locale) return undefined;
i = t.path.charAt(0) !== "/" ? t.root || this._getRoot() : "", i.slice(-1) !== "/" && (i += "/"), t.path ? (s = t.path, s.slice(-1) !== "/" && (s += "/")) : s = "", s += t.prefix || "", i += s, l = i + t.locale.toString() + ".json";
if (enyo.g11n.Utils._fileCache[l] !== undefined) n = enyo.g11n.Utils._fileCache[l].json; else {
t.merge ? (t.locale.language && (r = i + t.locale.language + ".json", o = this._loadFile(r)), t.locale.region && (r = i + t.locale.language + "_" + t.locale.region + ".json", u = this._loadFile(r), t.locale.language !== t.locale.region && (r = i + t.locale.region + ".json", a = this._loadFile(r))), t.locale.variant && (r = i + t.locale.language + "_" + t.locale.region + "_" + t.locale.variant + ".json", f = this._loadFile(r)), n = this._merge([ o, a, u, f ])) : (r = i + t.locale.toString() + ".json", n = this._loadFile(r), !n && t.type !== "region" && t.locale.language && (r = i + t.locale.language + ".json", n = this._loadFile(r)), !n && t.type !== "language" && t.locale.region && (r = i + t.locale.region + ".json", n = this._loadFile(r)), !n && t.type !== "language" && t.locale.region && (r = i + "_" + t.locale.region + ".json", n = this._loadFile(r)));
if (t.cache === undefined || t.cache !== !1) enyo.g11n.Utils._fileCache[l] = {
path: l,
json: n,
locale: t.locale,
timestamp: new Date
}, this.oldestStamp === undefined && (this.oldestStamp = enyo.g11n.Utils._fileCache[l].timestamp);
}
return n;
}, enyo.g11n.Utils._merge = function(t) {
var n, r, i = {};
for (n = 0, r = t.length; n < r; n++) i = enyo.mixin(i, t[n]);
return i;
}, enyo.g11n.Utils.releaseAllJsonFiles = function(t, n) {
var r = new Date, i = [], s, o, u, a;
t = t || 6e4;
if (this.oldestStamp !== undefined && this.oldestStamp.getTime() + t < r.getTime()) {
s = r;
for (o in enyo.g11n.Utils._fileCache) o && enyo.g11n.Utils._fileCache[o] && (a = enyo.g11n.Utils._fileCache[o], !a.locale || n || !enyo.g11n.currentLocale().isMatch(a.locale) && !enyo.g11n.formatLocale().isMatch(a.locale) && !enyo.g11n.phoneLocale().isMatch(a.locale) ? a.timestamp.getTime() + t < r.getTime() ? i.push(a.path) : a.timestamp.getTime() < s.getTime() && (s = a.timestamp) : a.timestamp.getTime() < s.getTime() && (s = a.timestamp));
this.oldestStamp = s.getTime() < r.getTime() ? s : undefined;
for (u = 0; u < i.length; u++) enyo.g11n.Utils._fileCache[i[u]] = undefined;
}
return i.length;
}, enyo.g11n.Utils._cacheSize = function() {
var t = 0, n;
for (n in enyo.g11n.Utils._fileCache) enyo.g11n.Utils._fileCache[n] && t++;
return t;
};

// javascript/template.js

enyo.g11n.Template = function(e, t) {
this.template = e, this.pattern = t || /(.?)(#\{(.*?)\})/;
}, enyo.g11n.Template.prototype._evalHelper = function(e, t) {
function s(e) {
return e === undefined || e === null ? "" : e;
}
function o(e, n, r) {
var i = t, o, u;
e = s(e);
if (e === "\\") return n;
o = r.split("."), u = o.shift();
while (i && u) {
i = i[u], u = o.shift();
if (!u) return e + s(i) || e || "";
}
return e || "";
}
var n = [], r = this.pattern, i;
if (!t || !e) return "";
while (e.length) i = e.match(r), i ? (n.push(e.slice(0, i.index)), n.push(o(i[1], i[2], i[3])), e = e.slice(i.index + i[0].length)) : (n.push(e), e = "");
return n.join("");
}, enyo.g11n.Template.prototype.evaluate = function(e) {
return this._evalHelper(this.template, e);
}, enyo.g11n.Template.prototype.formatChoice = function(e, t) {
try {
var n = this.template ? this.template.split("|") : [], r = [], i = [], s = "", o;
t = t || {};
for (o = 0; o < n.length; o++) {
var u = enyo.indexOf("#", n[o]);
if (u !== -1) {
r[o] = n[o].substring(0, u), i[o] = n[o].substring(u + 1);
if (e == r[o]) return this._evalHelper(i[o], t);
r[o] === "" && (s = i[o]);
}
}
for (o = 0; o < r.length; o++) {
var a = r[o];
if (a) {
var f = a.charAt(a.length - 1), l = parseFloat(a);
if (f === "<" && e < l || f === ">" && e > l) return this._evalHelper(i[o], t);
}
}
return this._evalHelper(s, t);
} catch (c) {
return enyo.error("formatChoice error : ", c), "";
}
};

// javascript/resources.js

$L = function(e) {
return $L._resources || ($L._resources = new enyo.g11n.Resources), $L._resources.$L(e);
}, $L._resources = null, enyo.g11n.Resources = function(e) {
e && e.root && (this.root = typeof window != "undefined" ? enyo.path.rewrite(e.root) : e.root), this.root = this.root || enyo.g11n.Utils._getRoot(), this.resourcePath = this.root + "/resources/", e && e.locale ? this.locale = typeof e.locale == "string" ? new enyo.g11n.Locale(e.locale) : e.locale : this.locale = enyo.g11n.currentLocale(), this.$L = this.locale.toString() === "en_pl" ? this._pseudo : this._$L, this.localizedResourcePath = this.resourcePath + this.locale.locale + "/", this.languageResourcePath = this.resourcePath + (this.locale.language ? this.locale.language + "/" : ""), this.regionResourcePath = this.languageResourcePath + (this.locale.region ? this.locale.region + "/" : ""), this.carrierResourcePath = this.regionResourcePath + (this.locale.variant ? this.locale.variant + "/" : "");
}, enyo.g11n.Resources.prototype.getResource = function(e) {
var t;
if (this.carrierResourcePath) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.carrierResourcePath + e
});
} catch (n) {
t = undefined;
}
if (!t) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.regionResourcePath + e
});
} catch (r) {
t = undefined;
}
if (!t) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.languageResourcePath + e
});
} catch (i) {
t = undefined;
}
if (!t) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.resourcePath + "en/" + e
});
} catch (s) {
t = undefined;
}
if (!t) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.root + "/" + e
});
} catch (o) {
t = undefined;
}
return t;
}, enyo.g11n.Resources.prototype.$L = function(e) {}, enyo.g11n.Resources.prototype._$L = function(e) {
var t, n;
return e ? this.locale.equals(enyo.g11n.sourceLocale()) ? typeof e == "string" ? e : e.value : (this.strings || this._loadStrings(), typeof e == "string" ? (t = e, n = e) : (t = e.key, n = e.value), this.strings && typeof this.strings[t] != "undefined" ? this.strings[t] : n) : "";
}, enyo.g11n.Resources.prototype._pseudo = function(e) {
var t, n;
if (!e) return "";
n = "";
for (t = 0; t < e.length; t++) if (e.charAt(t) === "#" && t + 1 < e.length && e.charAt(t + 1) === "{") {
while (e.charAt(t) !== "}" && t < e.length) n += e.charAt(t++);
t < e.length && (n += e.charAt(t));
} else if (e.charAt(t) === "<") {
while (e.charAt(t) !== ">" && t < e.length) n += e.charAt(t++);
t < e.length && (n += e.charAt(t));
} else if (e.charAt(t) === "&" && t + 1 < e.length && !enyo.g11n.Char.isSpace(e.charAt(t + 1))) {
while (e.charAt(t) !== ";" && !enyo.g11n.Char.isSpace(e.charAt(t)) && t < e.length) n += e.charAt(t++);
t < e.length && (n += e.charAt(t));
} else n += enyo.g11n.Resources._pseudoMap[e.charAt(t)] || e.charAt(t);
return n;
}, enyo.g11n.Resources.prototype._loadStrings = function() {
this.strings = enyo.g11n.Utils.getJsonFile({
root: this.root,
path: "resources",
locale: this.locale,
merge: !0
}), enyo.g11n.Utils.releaseAllJsonFiles();
}, enyo.g11n.Resources._pseudoMap = {
a: "\u00e1",
e: "\u00e8",
i: "\u00ef",
o: "\u00f5",
u: "\u00fb",
c: "\u00e7",
A: "\u00c5",
E: "\u00cb",
I: "\u00ce",
O: "\u00d5",
U: "\u00db",
C: "\u00c7",
B: "\u00df",
y: "\u00ff",
Y: "\u00dd",
D: "\u010e",
d: "\u0111",
g: "\u011d",
G: "\u011c",
H: "\u0124",
h: "\u0125",
J: "\u0134",
j: "\u0135",
K: "\u0136",
k: "\u0137",
N: "\u00d1",
n: "\u00f1",
S: "\u015e",
s: "\u015f",
T: "\u0164",
t: "\u0165",
W: "\u0174",
w: "\u0175",
Z: "\u0179",
z: "\u017a"
};

// javascript/character.js

enyo.g11n.Char = enyo.g11n.Char || {}, enyo.g11n.Char._strTrans = function(t, n) {
var r = "", i, s;
for (s = 0; s < t.length; s++) i = n[t.charAt(s)], r += i || t.charAt(s);
return r;
}, enyo.g11n.Char._objectIsEmpty = function(e) {
var t;
for (t in e) return !1;
return !0;
}, enyo.g11n.Char._isIdeoLetter = function(e) {
return e >= 19968 && e <= 40907 || e >= 63744 && e <= 64217 || e >= 13312 && e <= 19893 || e >= 12353 && e <= 12447 || e >= 12449 && e <= 12543 || e >= 65382 && e <= 65437 || e >= 12784 && e <= 12799 || e >= 12549 && e <= 12589 || e >= 12704 && e <= 12727 || e >= 12593 && e <= 12686 || e >= 65440 && e <= 65500 || e >= 44032 && e <= 55203 || e >= 40960 && e <= 42124 || e >= 4352 && e <= 4607 || e >= 43360 && e <= 43388 || e >= 55216 && e <= 55291 ? !0 : !1;
}, enyo.g11n.Char._isIdeoOther = function(e) {
return e >= 42125 && e <= 42191 || e >= 12544 && e <= 12548 || e >= 12590 && e <= 12591 || e >= 64218 && e <= 64255 || e >= 55292 && e <= 55295 || e >= 40908 && e <= 40959 || e >= 43389 && e <= 43391 || e >= 12800 && e <= 13055 || e >= 13056 && e <= 13183 || e >= 13184 && e <= 13311 || e === 12592 || e === 12687 || e === 12448 || e === 12352 || e === 12294 || e === 12348 ? !0 : !1;
}, enyo.g11n.Char.isIdeo = function(t) {
var n;
return !t || t.length < 1 ? !1 : (n = t.charCodeAt(0), enyo.g11n.Char._isIdeoLetter(n) || enyo.g11n.Char._isIdeoOther(n));
}, enyo.g11n.Char.isPunct = function(t) {
var n, r;
return !t || t.length < 1 ? !1 : (n = enyo.g11n.Utils.getNonLocaleFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data/chartype.punct.json"
}), r = n && t.charAt(0) in n, enyo.g11n.Utils.releaseAllJsonFiles(), r);
}, enyo.g11n.Char._space = {
9: 1,
10: 1,
11: 1,
12: 1,
13: 1,
32: 1,
133: 1,
160: 1,
5760: 1,
6158: 1,
8192: 1,
8193: 1,
8194: 1,
8195: 1,
8196: 1,
8197: 1,
8198: 1,
8199: 1,
8200: 1,
8201: 1,
8202: 1,
8232: 1,
8233: 1,
8239: 1,
8287: 1,
12288: 1
}, enyo.g11n.Char.isSpace = function(t) {
var n;
return !t || t.length < 1 ? !1 : (n = t.charCodeAt(0), n in enyo.g11n.Char._space);
}, enyo.g11n.Char.toUpper = function(t, n) {
var r;
if (!t) return undefined;
n || (n = enyo.g11n.currentLocale()), r = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data",
locale: n
});
if (!r || !r.upperMap) r = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data",
locale: new enyo.g11n.Locale("en")
});
return r && r.upperMap !== undefined ? enyo.g11n.Char._strTrans(t, r.upperMap) : (enyo.g11n.Utils.releaseAllJsonFiles(), t);
}, enyo.g11n.Char.isLetter = function(t) {
var n, r, i, s;
return !t || t.length < 1 ? !1 : (n = t.charAt(0), r = t.charCodeAt(0), i = enyo.g11n.Utils.getNonLocaleFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data/chartype.letter.json"
}), s = i && n in i || enyo.g11n.Char._isIdeoLetter(r), enyo.g11n.Utils.releaseAllJsonFiles(), s);
}, enyo.g11n.Char.getIndexChars = function(t) {
var n, r, i, s, o = [];
t ? typeof t == "string" ? r = new enyo.g11n.Locale(t) : r = t : r = enyo.g11n.currentLocale(), enyo.g11n.Char._resources || (enyo.g11n.Char._resources = {}), enyo.g11n.Char._resources[r.locale] || (enyo.g11n.Char._resources[r.locale] = new enyo.g11n.Resources({
root: enyo.g11n.Utils._getEnyoRoot() + "/base",
locale: r
})), i = enyo.g11n.Char._resources[r.locale], n = enyo.g11n.Char._resources[r.locale].$L({
key: "indexChars",
value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#"
});
for (s = 0; s < n.length; s++) o.push(n[s]);
return o;
}, enyo.g11n.Char.getBaseString = function(t, n) {
var r, i;
if (!t) return undefined;
n ? typeof n == "string" ? i = new enyo.g11n.Locale(n) : i = n : i = enyo.g11n.currentLocale(), r = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data",
locale: i
});
if (!r || enyo.g11n.Char._objectIsEmpty(r)) r = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data",
locale: new enyo.g11n.Locale("en")
});
return r && r.baseChars !== undefined && (t = enyo.g11n.Char._strTrans(t, r.baseChars)), enyo.g11n.Utils.releaseAllJsonFiles(), t;
};

// javascript/timezone.js

enyo.g11n._TZ = enyo.g11n._TZ || {}, enyo.g11n.TzFmt = function(e) {
return this.setTZ(), e !== undefined && e.TZ !== undefined && this.setCurrentTimeZone(e.TZ), enyo.g11n.Utils.releaseAllJsonFiles(), this;
}, enyo.g11n.TzFmt.prototype = {
toString: function() {
return this.TZ !== undefined ? this.TZ : this._TZ;
},
setTZ: function() {
var e = (new Date).toString(), t = enyo.indexOf("(", e), n = enyo.indexOf(")", e), r = e.slice(t + 1, n);
r !== undefined ? this.setCurrentTimeZone(r) : this.setDefaultTimeZone();
},
getCurrentTimeZone: function() {
return this.TZ !== undefined ? this.TZ : this._TZ !== undefined ? this._TZ : "unknown";
},
setCurrentTimeZone: function(e) {
this._TZ = e, this.TZ = e;
},
setDefaultTimeZone: function() {
var e = (new Date).toString().match(/\(([A-Z]+)\)/);
this._TZ = e && e[1] || "PST";
}
};

// javascript/datetime.js

enyo.g11n.DateFmt = function(e) {
var t, n, r, i, s;
s = this, s._normalizedComponents = {
date: {
dm: "DM",
md: "DM",
my: "MY",
ym: "MY",
d: "D",
dmy: "",
dym: "",
mdy: "",
myd: "",
ydm: "",
ymd: ""
},
time: {
az: "AZ",
za: "AZ",
a: "A",
z: "Z",
"": ""
},
timeLength: {
"short": "small",
medium: "small",
"long": "big",
full: "big"
}
}, s._normalizeDateTimeFormatComponents = function(e) {
var t = e.dateComponents, n = e.timeComponents, r, i, o, u = e.time;
return e.date && t && (r = s._normalizedComponents.date[t], r === undefined && (enyo.log("date component error: '" + t + "'"), r = "")), u && n !== undefined && (o = s._normalizedComponents.timeLength[u], o === undefined && (enyo.log("time format error: " + u), o = "small"), i = s._normalizedComponents.time[n], i === undefined && enyo.log("time component error: '" + n + "'")), e.dateComponents = r, e.timeComponents = i, e;
}, s._finalDateTimeFormat = function(e, t, n) {
var r = s.dateTimeFormatHash.dateTimeFormat || s.defaultFormats.dateTimeFormat;
return e && t ? s._buildDateTimeFormat(r, "dateTime", {
TIME: t,
DATE: e
}) : t || e || "M/d/yy h:mm a";
}, s._buildDateTimeFormat = function(e, t, n) {
var r, i, o = [], u = s._getTokenizedFormat(e, t), a;
for (r = 0, i = u.length; r < i && u[r] !== undefined; ++r) a = n[u[r]], a ? o.push(a) : o.push(u[r]);
return o.join("");
}, s._getDateFormat = function(e, t) {
var n = s._formatFetch(e, t.dateComponents, "Date");
if (e !== "full" && t.weekday) {
var r = s._formatFetch(t.weekday === !0 ? e : t.weekday, "", "Weekday");
n = s._buildDateTimeFormat(s.dateTimeFormatHash.weekDateFormat || s.defaultFormats.weekDateFormat, "weekDate", {
WEEK: r,
DATE: n
});
}
return n;
}, s._getTimeFormat = function(e, t) {
var n = s._formatFetch(e, "", s.twelveHourFormat ? "Time12" : "Time24");
if (t.timeComponents) {
var r = "time" + t.timeComponents, i = r + "Format";
return s._buildDateTimeFormat(s.dateTimeFormatHash[i] || s.defaultFormats[i], r, {
TIME: n,
AM: "a",
ZONE: "zzz"
});
}
return n;
}, s.ParserChunks = {
full: "('[^']+'|y{2,4}|M{1,4}|d{1,2}|z{1,3}|a|h{1,2}|H{1,2}|k{1,2}|K{1,2}|E{1,4}|m{1,2}|s{1,2}|[^A-Za-z']+)?",
dateTime: "(DATE|TIME|[^A-Za-z]+|'[^']+')?",
weekDate: "(DATE|WEEK|[^A-Za-z]+|'[^']+')?",
timeA: "(TIME|AM|[^A-Za-z]+|'[^']+')?",
timeZ: "(TIME|ZONE|[^A-Za-z]+|'[^']+')?",
timeAZ: "(TIME|AM|ZONE|[^A-Za-z]+|'[^']+')?"
}, s._getTokenizedFormat = function(e, t) {
var n = t && s.ParserChunks[t] || s.ParserChunks.full, r = e.length, i = [], o, u, a = new RegExp(n, "g");
while (r > 0) {
o = a.exec(e)[0], u = o.length;
if (u === 0) return [];
i.push(o), r -= u;
}
return i;
}, s._formatFetch = function(e, t, n, r) {
switch (e) {
case "short":
case "medium":
case "long":
case "full":
case "small":
case "big":
case "default":
return s.dateTimeFormatHash[e + (t || "") + n];
default:
return e;
}
}, s._dayOffset = function(e, t) {
var n;
return t = s._roundToMidnight(t), e = s._roundToMidnight(e), n = (e.getTime() - t.getTime()) / 864e5, n;
}, s._roundToMidnight = function(e) {
var t = e.getTime(), n = new Date;
return n.setTime(t), n.setHours(0), n.setMinutes(0), n.setSeconds(0), n.setMilliseconds(0), n;
}, s.inputParams = e, typeof e == "undefined" || !e.locale ? t = enyo.g11n.formatLocale() : typeof e.locale == "string" ? t = new enyo.g11n.Locale(e.locale) : t = e.locale, t.language || t.useDefaultLang(), this.locale = t, typeof e == "string" ? s.formatType = e : typeof e == "undefined" ? (e = {
format: "short"
}, s.formatType = e.format) : s.formatType = e.format, !s.formatType && !e.time && !e.date && (e ? e.format = "short" : e = {
format: "short"
}, s.formatType = "short"), s.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: t,
type: "language"
}), s.dateTimeHash || (s.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: new enyo.g11n.Locale("en_us")
})), s.dateTimeFormatHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: t,
type: "region"
}), s.dateTimeFormatHash || (s.dateTimeFormatHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: new enyo.g11n.Locale("en_us"),
type: "region"
})), s.rb = new enyo.g11n.Resources({
root: enyo.g11n.Utils._getEnyoRoot() + "/base",
locale: t
}), typeof e == "undefined" || typeof e.twelveHourFormat == "undefined" ? s.twelveHourFormat = s.dateTimeFormatHash.is12HourDefault : s.twelveHourFormat = e.twelveHourFormat;
if (s.formatType) switch (s.formatType) {
case "short":
case "medium":
case "long":
case "full":
case "default":
s.partsLength = s.formatType, i = s._finalDateTimeFormat(s._getDateFormat(s.formatType, e), s._getTimeFormat(s.formatType, e), e);
break;
default:
i = s.formatType;
} else e = s._normalizeDateTimeFormatComponents(e), e.time && (r = s._getTimeFormat(e.time, e), s.partsLength = e.time), e.date && (n = s._getDateFormat(e.date, e), s.partsLength = e.date), i = s._finalDateTimeFormat(n, r, e);
s.tokenized = s._getTokenizedFormat(i), s.partsLength || (s.partsLength = "full");
}, enyo.g11n.DateFmt.prototype.toString = function() {
return this.tokenized.join("");
}, enyo.g11n.DateFmt.prototype.isAmPm = function() {
return this.twelveHourFormat;
}, enyo.g11n.DateFmt.prototype.isAmPmDefault = function() {
return this.dateTimeFormatHash.is12HourDefault;
}, enyo.g11n.DateFmt.prototype.getFirstDayOfWeek = function() {
return this.dateTimeFormatHash.firstDayOfWeek;
}, enyo.g11n.DateFmt.prototype._format = function(e, t) {
var n = this, r, i = [], s, o, u, a, f, l, c, h;
c = n.dateTimeHash;
for (f = 0, l = t.length; f < l && t[f] !== undefined; f++) {
switch (t[f]) {
case "yy":
s = "", i.push((e.getFullYear() + "").substring(2));
break;
case "yyyy":
s = "", i.push(e.getFullYear());
break;
case "MMMM":
s = "long", o = "month", u = e.getMonth();
break;
case "MMM":
s = "medium", o = "month", u = e.getMonth();
break;
case "MM":
s = "short", o = "month", u = e.getMonth();
break;
case "M":
s = "single", o = "month", u = e.getMonth();
break;
case "dd":
s = "short", o = "date", u = e.getDate() - 1;
break;
case "d":
s = "single", o = "date", u = e.getDate() - 1;
break;
case "zzz":
s = "", typeof n.timezoneFmt == "undefined" && (typeof n.inputParams == "undefined" || typeof n.inputParams.TZ == "undefined" ? n.timezoneFmt = new enyo.g11n.TzFmt : n.timezoneFmt = new enyo.g11n.TzFmt(n.inputParams)), a = n.timezoneFmt.getCurrentTimeZone(), i.push(a);
break;
case "a":
s = "", e.getHours() > 11 ? i.push(c.pm) : i.push(c.am);
break;
case "K":
s = "", i.push(e.getHours() % 12);
break;
case "KK":
s = "", r = e.getHours() % 12, i.push(r < 10 ? "0" + ("" + r) : r);
break;
case "h":
s = "", r = e.getHours() % 12, i.push(r === 0 ? 12 : r);
break;
case "hh":
s = "", r = e.getHours() % 12, i.push(r === 0 ? 12 : r < 10 ? "0" + ("" + r) : r);
break;
case "H":
s = "", i.push(e.getHours());
break;
case "HH":
s = "", r = e.getHours(), i.push(r < 10 ? "0" + ("" + r) : r);
break;
case "k":
s = "", r = e.getHours() % 12, i.push(r === 0 ? 12 : r);
break;
case "kk":
s = "", r = e.getHours() % 12, i.push(r === 0 ? 12 : r < 10 ? "0" + ("" + r) : r);
break;
case "EEEE":
s = "long", o = "day", u = e.getDay();
break;
case "EEE":
s = "medium", o = "day", u = e.getDay();
break;
case "EE":
s = "short", o = "day", u = e.getDay();
break;
case "E":
s = "single", o = "day", u = e.getDay();
break;
case "mm":
case "m":
s = "";
var p = e.getMinutes();
i.push(p < 10 ? "0" + ("" + p) : p);
break;
case "ss":
case "s":
s = "";
var d = e.getSeconds();
i.push(d < 10 ? "0" + ("" + d) : d);
break;
default:
h = /'([A-Za-z]+)'/.exec(t[f]), s = "", h ? i.push(h[1]) : i.push(t[f]);
}
s && i.push(c[s][o][u]);
}
return i.join("");
}, enyo.g11n.DateFmt.prototype.format = function(e) {
var t = this;
return typeof e != "object" || t.tokenized === null ? (enyo.warn("DateFmt.format: no date to format or no format loaded"), undefined) : this._format(e, t.tokenized);
}, enyo.g11n.DateFmt.prototype.formatRelativeDate = function(e, t) {
var n, r, i, s, o = this;
if (typeof e != "object") return undefined;
typeof t == "undefined" ? (r = !1, n = new Date) : (typeof t.referenceDate != "undefined" ? n = t.referenceDate : n = new Date, typeof t.verbosity != "undefined" ? r = t.verbosity : r = !1), s = o._dayOffset(n, e);
switch (s) {
case 0:
return o.dateTimeHash.relative.today;
case 1:
return o.dateTimeHash.relative.yesterday;
case -1:
return o.dateTimeHash.relative.tomorrow;
default:
if (s < 7) return o.dateTimeHash.long.day[e.getDay()];
if (s < 30) {
if (r) {
i = new enyo.g11n.Template(o.dateTimeHash.relative.thisMonth);
var u = Math.floor(s / 7);
return i.formatChoice(u, {
num: u
});
}
return o.format(e);
}
if (s < 365) {
if (r) {
i = new enyo.g11n.Template(o.dateTimeHash.relative.thisYear);
var a = Math.floor(s / 30);
return i.formatChoice(a, {
num: a
});
}
return o.format(e);
}
return o.format(e);
}
}, enyo.g11n.DateFmt.prototype.formatRange = function(e, t) {
var n, r, i, s, o, u, a, f, l = this.partsLength || "medium", c = this.dateTimeHash, h = this.dateTimeFormatHash;
return !e && !t ? "" : !e || !t ? this.format(e || t) : (t.getTime() < e.getTime() && (n = t, t = e, e = n), a = new Date(e.getTime()), a.setHours(0), a.setMinutes(0), a.setSeconds(0), a.setMilliseconds(0), f = new Date(t.getTime()), f.setHours(0), f.setMinutes(0), f.setSeconds(0), f.setMilliseconds(0), f.getTime() - a.getTime() === 864e5 ? (s = "shortTime" + (this.twelveHourFormat ? "12" : "24"), r = this._getTokenizedFormat(h[s]), s = l + "Date", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeConsecutiveDays",
value: "#{startDate} #{startTime} - #{endDate} #{endTime}"
})), u.evaluate({
startTime: this._format(e, r),
endTime: this._format(t, r),
startDate: this._format(e, i),
endDate: this._format(t, i)
})) : e.getYear() === t.getYear() ? (o = l === "short" || l === "single" ? (e.getFullYear() + "").substring(2) : e.getFullYear(), e.getMonth() === t.getMonth() ? e.getDate() === t.getDate() ? (s = "shortTime" + (this.twelveHourFormat ? "12" : "24"), r = this._getTokenizedFormat(h[s]), s = l + "Date", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeWithinDay",
value: "#{startTime}-#{endTime}, #{date}"
})), u.evaluate({
startTime: this._format(e, r),
endTime: this._format(t, r),
date: this._format(e, i)
})) : (s = l + "DDate", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeWithinMonth",
value: "#{month} #{startDate}-#{endDate}, #{year}"
})), u.evaluate({
month: c[l].month[e.getMonth()],
startDate: this._format(e, i),
endDate: this._format(t, i),
year: o
})) : (l === "full" ? l = "long" : l === "single" && (l = "short"), s = l + "DMDate", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeWithinYear",
value: "#{start} - #{end}, #{year}"
})), u.evaluate({
start: this._format(e, i),
end: this._format(t, i),
year: o
}))) : t.getYear() - e.getYear() < 2 ? (s = l + "Date", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeWithinConsecutiveYears",
value: "#{start} - #{end}"
})), u.evaluate({
start: this._format(e, i),
end: this._format(t, i)
})) : (l === "full" ? l = "long" : l === "single" && (l = "short"), s = l + "MYDate", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeMultipleYears",
value: "#{startMonthYear} - #{endMonthYear}"
})), u.evaluate({
startMonthYear: this._format(e, i),
endMonthYear: this._format(t, i)
})));
};

// javascript/numberfmt.js

enyo.g11n.NumberFmt = function(e) {
var t, n, r, i, s, o, u;
typeof e == "number" ? this.fractionDigits = e : e && typeof e.fractionDigits == "number" && (this.fractionDigits = e.fractionDigits), !e || !e.locale ? this.locale = enyo.g11n.formatLocale() : typeof e.locale == "string" ? this.locale = new enyo.g11n.Locale(e.locale) : this.locale = e.locale, this.style = e && e.style || "number", t = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: this.locale,
type: "region"
}), this.style === "currency" && (r = e && e.currency || t && t.currency && t.currency.name, r ? (r = r.toUpperCase(), this.currencyStyle = e && e.currencyStyle === "iso" ? "iso" : "common", n = enyo.g11n.Utils.getNonLocaleFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/number_data/iso4217.json"
}), n ? (i = n[r], i || (s = new enyo.g11n.Locale(r), u = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: s,
type: "region"
}), u && (r = u.currency && u.currency.name, i = n[r])), i || (r = t && t.currency && t.currency.name, i = n[r]), i ? (this.sign = this.currencyStyle !== "iso" ? i.sign : r, this.fractionDigits = e && typeof e.fractionDigits == "number" ? e.fractionDigits : i.digits) : this.style = "number") : (r = t && t.currency && t.currency.name, this.sign = r)) : (r = t && t.currency && t.currency.name, this.sign = r), r ? (o = t && t.currency && t.currency[this.currencyStyle] || "#{sign} #{amt}", this.currencyTemplate = new enyo.g11n.Template(o)) : this.style = "number"), t ? (this.decimal = t.numberDecimal || ".", this.divider = t.numberDivider || ",", t.dividerIndex ? t.dividerIndex === 4 ? this.numberGroupRegex = /(\d+)(\d{4})/ : this.numberGroupRegex = /(\d+)(\d{3})/ : this.numberGroupRegex = /(\d+)(\d{3})/, this.percentageSpace = t.percentageSpace) : (this.decimal = ".", this.divider = ",", this.numberGroupRegex = /(\d+)(\d{3})/, this.percentageSpace = !1), this.numberGroupRegex.compile(this.numberGroupRegex), enyo.g11n.Utils.releaseAllJsonFiles();
}, enyo.g11n.NumberFmt.prototype.format = function(e) {
try {
var t, n, r, i;
typeof e == "string" && (e = parseFloat(e));
if (isNaN(e)) return undefined;
typeof this.fractionDigits != "undefined" ? t = e.toFixed(this.fractionDigits) : t = e.toString(), n = t.split("."), r = n[0];
while (this.divider && this.numberGroupRegex.test(r)) r = r.replace(this.numberGroupRegex, "$1" + this.divider + "$2");
return n[0] = r, i = n.join(this.decimal), this.style === "currency" && this.currencyTemplate ? i = this.currencyTemplate.evaluate({
amt: i,
sign: this.sign
}) : this.style === "percent" && (i += this.percentageSpace ? " %" : "%"), i;
} catch (s) {
return enyo.log("formatNumber error : " + s), (e || "0") + "." + (this.fractionDigits || "");
}
};

// javascript/duration.js

enyo.g11n.DurationFmt = function(e) {
typeof e == "undefined" ? (this.locale = enyo.g11n.formatLocale(), this.style = "short") : (e.locale ? typeof e.locale == "string" ? this.locale = new enyo.g11n.Locale(e.locale) : this.locale = e.locale : this.locale = enyo.g11n.formatLocale(), e.style ? (this.style = e.style, this.style !== "short" && this.style !== "medium" && this.style !== "long" && this.style !== "full" && (this.style = "short")) : this.style = "short"), this.rb = new enyo.g11n.Resources({
root: enyo.g11n.Utils._getEnyoRoot() + "/base",
locale: this.locale
}), this.style === "short" ? this.parts = {
years: new enyo.g11n.Template(this.rb.$L({
key: "yearsFormatShort",
value: "##{num}y"
})),
months: new enyo.g11n.Template(this.rb.$L({
key: "monthsFormatShort",
value: "##{num}m"
})),
weeks: new enyo.g11n.Template(this.rb.$L({
key: "weeksFormatShort",
value: "##{num}w"
})),
days: new enyo.g11n.Template(this.rb.$L({
key: "daysFormatShort",
value: "##{num}d"
})),
hours: new enyo.g11n.Template(this.rb.$L({
key: "hoursFormatShort",
value: "##{num}"
})),
minutes: new enyo.g11n.Template(this.rb.$L({
key: "minutesFormatShort",
value: "##{num}"
})),
seconds: new enyo.g11n.Template(this.rb.$L({
key: "secondsFormatShort",
value: "##{num}"
})),
separator: this.rb.$L({
key: "separatorShort",
value: " "
}),
dateTimeSeparator: this.rb.$L({
key: "dateTimeSeparatorShort",
value: " "
}),
longTimeFormat: new enyo.g11n.Template(this.rb.$L({
key: "longTimeFormatShort",
value: "#{hours}:#{minutes}:#{seconds}"
})),
shortTimeFormat: new enyo.g11n.Template(this.rb.$L({
key: "shortTimeFormatShort",
value: "#{minutes}:#{seconds}"
})),
finalSeparator: ""
} : this.style === "medium" ? this.parts = {
years: new enyo.g11n.Template(this.rb.$L({
key: "yearsFormatMedium",
value: "##{num} yr"
})),
months: new enyo.g11n.Template(this.rb.$L({
key: "monthsFormatMedium",
value: "##{num} mo"
})),
weeks: new enyo.g11n.Template(this.rb.$L({
key: "weeksFormatMedium",
value: "##{num} wk"
})),
days: new enyo.g11n.Template(this.rb.$L({
key: "daysFormatMedium",
value: "##{num} dy"
})),
hours: new enyo.g11n.Template(this.rb.$L({
key: "hoursFormatMedium",
value: "##{num}"
})),
minutes: new enyo.g11n.Template(this.rb.$L({
key: "minutesFormatMedium",
value: "##{num}"
})),
seconds: new enyo.g11n.Template(this.rb.$L({
key: "secondsFormatMedium",
value: "##{num}"
})),
separator: this.rb.$L({
key: "separatorMedium",
value: " "
}),
dateTimeSeparator: this.rb.$L({
key: "dateTimeSeparatorMedium",
value: " "
}),
longTimeFormat: new enyo.g11n.Template(this.rb.$L({
key: "longTimeFormatMedium",
value: "#{hours}:#{minutes}:#{seconds}"
})),
shortTimeFormat: new enyo.g11n.Template(this.rb.$L({
key: "shortTimeFormatMedium",
value: "#{minutes}:#{seconds}"
})),
finalSeparator: ""
} : this.style === "long" ? this.parts = {
years: new enyo.g11n.Template(this.rb.$L({
key: "yearsFormatLong",
value: "1#1 yr|1>##{num} yrs"
})),
months: new enyo.g11n.Template(this.rb.$L({
key: "monthsFormatLong",
value: "1#1 mon|1>##{num} mos"
})),
weeks: new enyo.g11n.Template(this.rb.$L({
key: "weeksFormatLong",
value: "1#1 wk|1>##{num} wks"
})),
days: new enyo.g11n.Template(this.rb.$L({
key: "daysFormatLong",
value: "1#1 day|1>##{num} dys"
})),
hours: new enyo.g11n.Template(this.rb.$L({
key: "hoursFormatLong",
value: "0#|1#1 hr|1>##{num} hrs"
})),
minutes: new enyo.g11n.Template(this.rb.$L({
key: "minutesFormatLong",
value: "0#|1#1 min|1>##{num} min"
})),
seconds: new enyo.g11n.Template(this.rb.$L({
key: "secondsFormatLong",
value: "0#|1#1 sec|1>##{num} sec"
})),
separator: this.rb.$L({
key: "separatorLong",
value: " "
}),
dateTimeSeparator: this.rb.$L({
key: "dateTimeSeparatorLong",
value: " "
}),
longTimeFormat: "",
shortTimeFormat: "",
finalSeparator: ""
} : this.style === "full" && (this.parts = {
years: new enyo.g11n.Template(this.rb.$L({
key: "yearsFormatFull",
value: "1#1 year|1>##{num} years"
})),
months: new enyo.g11n.Template(this.rb.$L({
key: "monthsFormatFull",
value: "1#1 month|1>##{num} months"
})),
weeks: new enyo.g11n.Template(this.rb.$L({
key: "weeksFormatFull",
value: "1#1 week|1>##{num} weeks"
})),
days: new enyo.g11n.Template(this.rb.$L({
key: "daysFormatFull",
value: "1#1 day|1>##{num} days"
})),
hours: new enyo.g11n.Template(this.rb.$L({
key: "hoursFormatFull",
value: "0#|1#1 hour|1>##{num} hours"
})),
minutes: new enyo.g11n.Template(this.rb.$L({
key: "minutesFormatFull",
value: "0#|1#1 minute|1>##{num} minutes"
})),
seconds: new enyo.g11n.Template(this.rb.$L({
key: "secondsFormatFull",
value: "0#|1#1 second|1>##{num} seconds"
})),
separator: this.rb.$L({
key: "separatorFull",
value: ", "
}),
dateTimeSeparator: this.rb.$L({
key: "dateTimeSeparatorFull",
value: ", "
}),
longTimeFormat: "",
shortTimeFormat: "",
finalSeparator: this.rb.$L({
key: "finalSeparatorFull",
value: " and "
})
}), this.dateParts = [ "years", "months", "weeks", "days" ], this.timeParts = [ "hours", "minutes", "seconds" ];
}, enyo.g11n.DurationFmt.prototype.format = function(e) {
var t = [], n = [], r, i, s, o;
if (!e || enyo.g11n.Char._objectIsEmpty(e)) return "";
for (i = 0; i < this.dateParts.length; i++) s = e[this.dateParts[i]] || 0, s > 0 && (o = this.parts[this.dateParts[i]].formatChoice(s, {
num: s
}), o && o.length > 0 && (t.length > 0 && t.push(this.parts.separator), t.push(o)));
if (this.style === "long" || this.style === "full") for (i = 0; i < this.timeParts.length; i++) s = e[this.timeParts[i]] || 0, s > 0 && (o = this.parts[this.timeParts[i]].formatChoice(s, {
num: s
}), o && o.length > 0 && (n.length > 0 && n.push(this.parts.separator), n.push(o))); else {
var u = {}, a = e.hours ? this.parts.longTimeFormat : this.parts.shortTimeFormat;
for (i = 0; i < this.timeParts.length; i++) {
s = e[this.timeParts[i]] || 0;
if (s < 10) switch (this.timeParts[i]) {
case "minutes":
e.hours && (s = "0" + s);
break;
case "seconds":
s = "0" + s;
break;
case "hours":
}
o = this.parts[this.timeParts[i]].formatChoice(s, {
num: s
}), o && o.length > 0 && (u[this.timeParts[i]] = o);
}
n.push(a.evaluate(u));
}
r = t, r.length > 0 && n.length > 0 && r.push(this.parts.dateTimeSeparator);
for (i = 0; i < n.length; i++) r.push(n[i]);
return r.length > 2 && this.style === "full" && (r[r.length - 2] = this.parts.finalSeparator), r.join("") || "";
};

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: "",
rowOffset: 0
},
events: {
onSetupItem: "",
onRenderRow: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
if (this.noSelect || t.index === -1) return;
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
if (e < this.rowOffset || e >= this.count + this.rowOffset) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
t && (t.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren(), this.doRenderRow({
rowIndex: e
}));
},
fetchRowNode: function(e) {
if (this.hasNode()) return this.node.querySelector('[data-enyo-index="' + e + '"]');
},
rowForEvent: function(e) {
if (!this.hasNode()) return -1;
var t = e.target;
while (t && t !== this.node) {
var n = t.getAttribute && t.getAttribute("data-enyo-index");
if (n !== null) return Number(n);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
if (e < 0 || e >= this.count) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
if (e < 0 || e >= this.count) return;
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n;
t && (t.id !== e.id ? n = t.querySelector("#" + e.id) : n = t), e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1,
reorderable: !1,
centerReorderContainer: !0,
swipeableComponents: [],
enableSwipe: !1,
persistSwipeableItem: !1
},
events: {
onSetupItem: "",
onSetupReorderComponents: "",
onSetupPinnedReorderComponents: "",
onReorder: "",
onSetupSwipeItem: "",
onSwipeDrag: "",
onSwipe: "",
onSwipeComplete: ""
},
handlers: {
onAnimateFinish: "animateFinish",
onRenderRow: "rowRendered",
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onup: "up",
onholdpulse: "holdpulse",
onflick: "flick"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "placeholder",
classes: "enyo-list-placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
reorderHoldTimeMS: 600,
draggingRowIndex: -1,
placeholderRowIndex: -1,
dragToScrollThreshold: .1,
prevScrollTop: 0,
autoScrollTimeoutMS: 20,
autoScrollTimeout: null,
pinnedReorderMode: !1,
initialPinPosition: -1,
itemMoved: !1,
currentPageNumber: -1,
completeReorderTimeout: null,
swipeIndex: null,
swipeDirection: null,
persistentItemVisible: !1,
persistentItemOrigin: null,
swipeComplete: !1,
completeSwipeTimeout: null,
completeSwipeDelayMS: 500,
normalSwipeSpeedMS: 200,
fastSwipeSpeedMS: 100,
flicked: !0,
percentageDraggedThreshold: .2,
importProps: function(e) {
e.reorderable && (this.touch = !0), this.inherited(arguments);
},
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
initComponents: function() {
this.createReorderTools(), this.inherited(arguments), this.createSwipeableComponents();
},
createReorderTools: function() {
this.createComponent({
name: "reorderContainer",
classes: "enyo-list-reorder-container",
ondown: "sendToStrategy",
ondrag: "sendToStrategy",
ondragstart: "sendToStrategy",
ondragfinish: "sendToStrategy",
onflick: "sendToStrategy"
});
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
createSwipeableComponents: function() {
for (var e = 0; e < this.swipeableComponents.length; e++) this.$.swipeableComponents.createComponent(this.swipeableComponents[e], {
owner: this.owner
});
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
sendToStrategy: function(e, t) {
this.$.strategy.dispatchEvent("on" + t.type, t, e);
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
holdpulse: function(e, t) {
if (!this.getReorderable() || this.isReordering()) return;
if (t.holdTime >= this.reorderHoldTimeMS && this.shouldStartReordering(e, t)) return t.preventDefault(), this.startReordering(t), !1;
},
dragstart: function(e, t) {
if (this.isSwipeable()) return this.swipeDragStart(e, t);
},
drag: function(e, t) {
return t.preventDefault(), this.shouldDoReorderDrag(t) ? (this.reorderDrag(t), !0) : this.shouldDoSwipeDrag() ? (this.swipeDrag(e, t), !0) : this.preventDragPropagation;
},
flick: function(e, t) {
this.shouldDoSwipeFlick() && this.swipeFlick(e, t);
},
dragfinish: function(e, t) {
this.isReordering() && this.finishReordering(e, t), this.isSwipeable() && this.swipeDragFinish(e, t);
},
up: function(e, t) {
this.isReordering() && this.finishReordering(e, t);
},
generatePage: function(e, t) {
this.page = e;
var n = this.rowsPerPage * this.page;
this.$.generator.setRowOffset(n);
var r = Math.min(this.count - n, this.rowsPerPage);
this.$.generator.setCount(r);
var i = this.$.generator.generateChildHtml();
t.setContent(i), this.getReorderable() && this.draggingRowIndex > -1 && this.hideReorderingRow();
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
this.pageHeights[e] = s, this.portSize += s - o;
}
},
pageForRow: function(e) {
return Math.floor(e / this.rowsPerPage);
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0, this.p0RowBounds = this.getPageRowHeights(this.$.page0)), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0, this.p1RowBounds = this.getPageRowHeights(this.$.page1)), t && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
getPageRowHeights: function(e) {
var t = {}, n = e.hasNode().querySelectorAll("div[data-enyo-index]");
for (var r = 0, i, s; r < n.length; r++) i = n[r].getAttribute("data-enyo-index"), i !== null && (s = enyo.dom.getBounds(n[r]), t[parseInt(i, 10)] = {
height: s.height,
width: s.width
});
return t;
},
updateRowBounds: function(e) {
this.p0RowBounds[e] ? this.updateRowBoundsAtIndex(e, this.p0RowBounds, this.$.page0) : this.p1RowBounds[e] && this.updateRowBoundsAtIndex(e, this.p1RowBounds, this.$.page1);
},
updateRowBoundsAtIndex: function(e, t, n) {
var r = n.hasNode().querySelector('div[data-enyo-index="' + e + '"]'), i = enyo.dom.getBounds(r);
t[e].height = i.height, t[e].width = i.width;
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return t = Math.max(t, 0), {
no: t,
height: r,
pos: n + r,
startRow: t * this.rowsPerPage,
endRow: Math.min((t + 1) * this.rowsPerPage - 1, this.count - 1)
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
var t = this.pageHeights[e];
if (!t) {
var n = this.rowsPerPage * e, r = Math.min(this.count - n, this.rowsPerPage);
t = this.defaultPageHeight * (r / this.rowsPerPage);
}
return Math.max(1, t);
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.p0RowBounds = {}, this.p1RowBounds = {}, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments), r = this.getScrollTop();
return this.lastPos === r ? n : (this.lastPos = r, this.update(r), this.shouldDoPinnedReorderScroll() && this.reorderScroll(e, t), n);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
scrollToRow: function(e) {
var t = this.pageForRow(e), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
var t, n;
if (this.p1 == null) {
if (this.p0 == null) return;
t = 0, n = this.count;
} else t = Math.min(this.p0, this.p1) * this.rowsPerPage, n = Math.min(this.count - t, this.rowsPerPage * 2);
this.$.generator.setRowOffset(t), this.$.generator.setCount(n), this.$.generator.renderRow(e);
},
rowRendered: function(e, t) {
this.updateRowBounds(t.rowIndex);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
},
pageForPageNumber: function(e, t) {
return e % 2 === 0 ? !t || e === this.p0 ? this.$.page0 : null : !t || e === this.p1 ? this.$.page1 : null;
},
shouldStartReordering: function(e, t) {
return !!this.getReorderable() && t.rowIndex >= 0 && !this.pinnedReorderMode && e === this.$.strategy && t.index >= 0 ? !0 : !1;
},
startReordering: function(e) {
this.$.strategy.listReordering = !0, this.buildReorderContainer(), this.doSetupReorderComponents(e), this.styleReorderContainer(e), this.draggingRowIndex = this.placeholderRowIndex = e.rowIndex, this.itemMoved = !1, this.initialPageNumber = this.currentPageNumber = this.pageForRow(e.rowIndex), this.prevScrollTop = this.getScrollTop(), this.replaceNodeWithPlaceholder(e.rowIndex);
},
buildReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.reorderComponents.length; e++) this.$.reorderContainer.createComponent(this.reorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
styleReorderContainer: function(e) {
this.setItemPosition(this.$.reorderContainer, e.rowIndex), this.setItemBounds(this.$.reorderContainer, e.rowIndex), this.$.reorderContainer.setShowing(!0), this.centerReorderContainer && this.centerReorderContainerOnPointer(e);
},
appendNodeToReorderContainer: function(e) {
this.$.reorderContainer.createComponent({
allowHtml: !0,
content: e.innerHTML
}).render();
},
centerReorderContainerOnPointer: function(e) {
var t = this.getNodePosition(this.hasNode()), n = e.pageX - t.left - parseInt(this.$.reorderContainer.domStyles.width, 10) / 2, r = e.pageY - t.top + this.getScrollTop() - parseInt(this.$.reorderContainer.domStyles.height, 10) / 2;
this.getStrategyKind() != "ScrollStrategy" && (n -= this.getScrollLeft(), r -= this.getScrollTop()), this.positionReorderContainer(n, r);
},
positionReorderContainer: function(e, t) {
this.$.reorderContainer.addClass("enyo-animatedTopAndLeft"), this.$.reorderContainer.addStyles("left:" + e + "px;top:" + t + "px;"), this.setPositionReorderContainerTimeout();
},
setPositionReorderContainerTimeout: function() {
this.clearPositionReorderContainerTimeout(), this.positionReorderContainerTimeout = setTimeout(enyo.bind(this, function() {
this.$.reorderContainer.removeClass("enyo-animatedTopAndLeft"), this.clearPositionReorderContainerTimeout();
}), 100);
},
clearPositionReorderContainerTimeout: function() {
this.positionReorderContainerTimeout && (clearTimeout(this.positionReorderContainerTimeout), this.positionReorderContainerTimeout = null);
},
shouldDoReorderDrag: function() {
return !this.getReorderable() || this.draggingRowIndex < 0 || this.pinnedReorderMode ? !1 : !0;
},
reorderDrag: function(e) {
this.positionReorderNode(e), this.checkForAutoScroll(e);
var t = this.getRowIndexFromCoordinate(e.pageY);
t !== -1 && (t >= this.placeholderRowIndex ? this.movePlaceholderToIndex(Math.min(this.count, t + 1)) : this.movePlaceholderToIndex(t));
},
positionReorderNode: function(e) {
var t = this.$.reorderContainer.hasNode().style, n = parseInt(t.left, 10) + e.ddx, r = parseInt(t.top, 10) + e.ddy;
r = this.getStrategyKind() == "ScrollStrategy" ? r + (this.getScrollTop() - this.prevScrollTop) : r, this.$.reorderContainer.addStyles("top: " + r + "px ; left: " + n + "px"), this.prevScrollTop = this.getScrollTop();
},
checkForAutoScroll: function(e) {
var t = this.getNodePosition(this.hasNode()), n = this.getBounds(), r;
e.pageY - t.top < n.height * this.dragToScrollThreshold ? (r = 100 * (1 - (e.pageY - t.top) / (n.height * this.dragToScrollThreshold)), this.scrollDistance = -1 * r) : e.pageY - t.top > n.height * (1 - this.dragToScrollThreshold) ? (r = 100 * ((e.pageY - t.top - n.height * (1 - this.dragToScrollThreshold)) / (n.height - n.height * (1 - this.dragToScrollThreshold))), this.scrollDistance = 1 * r) : this.scrollDistance = 0, this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling();
},
stopAutoScrolling: function() {
this.autoScrollTimeout && (clearTimeout(this.autoScrollTimeout), this.autoScrollTimeout = null);
},
startAutoScrolling: function() {
this.autoScrollTimeout = setInterval(enyo.bind(this, this.autoScroll), this.autoScrollTimeoutMS);
},
autoScroll: function() {
this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling(), this.setScrollPosition(this.getScrollPosition() + this.scrollDistance), this.positionReorderNode({
ddx: 0,
ddy: 0
});
},
movePlaceholderToIndex: function(e) {
var t, n;
if (e < 0) return;
e >= this.count ? (t = null, n = this.pageForPageNumber(this.pageForRow(this.count - 1)).hasNode()) : (t = this.$.generator.fetchRowNode(e), n = t.parentNode);
var r = this.pageForRow(e);
r >= this.pageCount && (r = this.currentPageNumber), n.insertBefore(this.placeholderNode, t), this.currentPageNumber !== r && (this.updatePageHeight(this.currentPageNumber), this.updatePageHeight(r), this.updatePagePositions(r)), this.placeholderRowIndex = e, this.currentPageNumber = r, this.itemMoved = !0;
},
finishReordering: function(e, t) {
if (!this.isReordering() || this.pinnedReorderMode || this.completeReorderTimeout) return;
return this.stopAutoScrolling(), this.$.strategy.listReordering = !1, this.moveReorderedContainerToDroppedPosition(t), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, t), 100), t.preventDefault(), !0;
},
moveReorderedContainerToDroppedPosition: function() {
var e = this.getRelativeOffset(this.placeholderNode, this.hasNode()), t = this.getStrategyKind() == "ScrollStrategy" ? e.top : e.top - this.getScrollTop(), n = e.left - this.getScrollLeft();
this.positionReorderContainer(n, t);
},
completeFinishReordering: function(e) {
this.completeReorderTimeout = null, this.placeholderRowIndex > this.draggingRowIndex && (this.placeholderRowIndex = Math.max(0, this.placeholderRowIndex - 1));
if (this.draggingRowIndex == this.placeholderRowIndex && !this.pinnedReorderMode && !this.itemMoved) {
this.beginPinnedReorder(e);
return;
}
this.removePlaceholderNode(), this.emptyAndHideReorderContainer(), this.positionReorderedNode(), this.reorderRows(e), this.resetReorderState(), this.refresh();
},
beginPinnedReorder: function(e) {
this.buildPinnedReorderContainer(), this.doSetupPinnedReorderComponents(enyo.mixin(e, {
index: this.draggingRowIndex
})), this.pinnedReorderMode = !0, this.initialPinPosition = e.pageY;
},
emptyAndHideReorderContainer: function() {
this.$.reorderContainer.destroyComponents(), this.$.reorderContainer.setShowing(!1);
},
buildPinnedReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.pinnedReorderComponents.length; e++) this.$.reorderContainer.createComponent(this.pinnedReorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
reorderRows: function(e) {
this.doReorder(this.makeReorderEvent(e)), this.currentPageNumber != this.initialPageNumber && this.moveItemToDiffPage(), this.updateListIndices();
},
makeReorderEvent: function(e) {
return e.reorderFrom = this.draggingRowIndex, e.reorderTo = this.placeholderRowIndex, e;
},
moveItemToDiffPage: function() {
var e, t, n = this.pageForPageNumber(this.currentPageNumber), r = this.pageForPageNumber(this.currentPageNumber + 1);
this.initialPageNumber < this.currentPageNumber ? (e = n.hasNode().firstChild, r.hasNode().appendChild(e)) : (e = n.hasNode().lastChild, t = r.hasNode().firstChild, r.hasNode().insertBefore(e, t)), this.correctPageHeights(), this.updatePagePositions(this.initialPageNumber);
},
positionReorderedNode: function() {
var e = this.hiddenNode;
this.hiddenNode = null;
if (!e.parentNode) return;
var t = this.$.generator.fetchRowNode(this.placeholderRowIndex);
t && t.parentNode.insertBefore(e, t), this.showNode(e);
},
resetReorderState: function() {
this.draggingRowIndex = this.placeholderRowIndex = -1, this.pinnedReorderMode = !1;
},
updateListIndices: function() {
if (this.shouldDoRefresh()) {
this.refresh();
return;
}
var e = Math.min(this.draggingRowIndex, this.placeholderRowIndex), t = Math.max(this.draggingRowIndex, this.placeholderRowIndex), n = this.draggingRowIndex - this.placeholderRowIndex > 0 ? 1 : -1, r, i, s, o;
if (n === 1) {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", "reordered");
for (i = t - 1, s = t; i >= e; i--) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o + 1, r.setAttribute("data-enyo-index", s);
}
r = this.hasNode().querySelector('[data-enyo-index="reordered"]'), r.setAttribute("data-enyo-index", this.placeholderRowIndex);
} else {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", this.placeholderRowIndex);
for (i = e + 1, s = e; i <= t; i++) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o - 1, r.setAttribute("data-enyo-index", s);
}
}
},
shouldDoRefresh: function() {
return Math.abs(this.initialPageNumber - this.currentPageNumber) > 1;
},
getNodeStyle: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
this.log("No node - " + e);
return;
}
var n = this.getRelativeOffset(t, this.hasNode()), r = enyo.dom.getBounds(t);
return {
h: r.height,
w: r.width,
left: n.left,
top: n.top
};
},
getRelativeOffset: function(e, t) {
var n = {
top: 0,
left: 0
};
if (e !== t && e.parentNode) do n.top += e.offsetTop || 0, n.left += e.offsetLeft || 0, e = e.offsetParent; while (e && e !== t);
return n;
},
replaceNodeWithPlaceholder: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
this.placeholderNode = this.createPlaceholderNode(t), this.hiddenNode = this.hideNode(t);
var n = this.pageForPageNumber(this.currentPageNumber);
n.hasNode().insertBefore(this.placeholderNode, this.hiddenNode);
},
createPlaceholderNode: function(e) {
var t = this.$.placeholder.hasNode().cloneNode(!0), n = enyo.dom.getBounds(e);
return t.style.height = n.height + "px", t.style.width = n.width + "px", t;
},
removePlaceholderNode: function() {
this.removeNode(this.placeholderNode), this.placeholderNode = null;
},
removeNode: function(e) {
if (!e || !e.parentNode) return;
e.parentNode.removeChild(e);
},
updatePageHeight: function(e) {
if (e < 0) return;
var t = this.pageForPageNumber(e, !0);
if (t) {
var n = t.getBounds().height;
this.pageHeights[e] = n;
}
},
updatePagePositions: function(e) {
this.positionPage(this.currentPageNumber, this.pageForPageNumber(this.currentPageNumber)), this.positionPage(e, this.pageForPageNumber(e));
},
correctPageHeights: function() {
this.updatePageHeight(this.currentPageNumber), this.initialPageNumber != this.currentPageNumber && this.updatePageHeight(this.initialPageNumber);
},
hideNode: function(e) {
return e.style.display = "none", e;
},
showNode: function(e) {
return e.style.display = "block", e;
},
dropPinnedRow: function(e) {
this.moveReorderedContainerToDroppedPosition(e), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, e), 100);
return;
},
getRowIndexFromCoordinate: function(e) {
var t = this.getScrollTop() + e - this.getNodePosition(this.hasNode()).top;
if (t < 0) return -1;
var n = this.positionToPageInfo(t), r = n.no == this.p0 ? this.p0RowBounds : this.p1RowBounds;
if (!r) return this.count;
var i = n.pos, s = enyo.dom.getBounds(this.placeholderNode).height, o = 0;
for (var u = n.startRow; u <= n.endRow; ++u) {
if (u === this.placeholderRowIndex) {
o += s;
if (o >= i) return -1;
}
if (u !== this.draggingRowIndex) {
o += r[u].height;
if (o >= i) return u;
}
}
return u;
},
getIndexPosition: function(e) {
return this.getNodePosition(this.$.generator.fetchRowNode(e));
},
getNodePosition: function(e) {
var t = e, n = 0, r = 0;
while (e && e.offsetParent) n += e.offsetTop, r += e.offsetLeft, e = e.offsetParent;
e = t;
var i = enyo.dom.getCssTransformProp();
while (e && e.getAttribute) {
var s = enyo.dom.getComputedStyleValue(e, i);
if (s && s != "none") {
var o = s.lastIndexOf(","), u = s.lastIndexOf(",", o - 1);
o >= 0 && u >= 0 && (n += parseFloat(s.substr(o + 1, s.length - o)), r += parseFloat(s.substr(u + 1, o - u)));
}
e = e.parentNode;
}
return {
top: n,
left: r
};
},
cloneRowNode: function(e) {
return this.$.generator.fetchRowNode(e).cloneNode(!0);
},
setItemPosition: function(e, t) {
var n = this.getNodeStyle(t), r = this.getStrategyKind() == "ScrollStrategy" ? n.top : n.top - this.getScrollTop(), i = "top:" + r + "px; left:" + n.left + "px;";
e.addStyles(i);
},
setItemBounds: function(e, t) {
var n = this.getNodeStyle(t), r = "width:" + n.w + "px; height:" + n.h + "px;";
e.addStyles(r);
},
shouldDoPinnedReorderScroll: function() {
return !this.getReorderable() || !this.pinnedReorderMode ? !1 : !0;
},
reorderScroll: function(e, t) {
this.getStrategyKind() == "ScrollStrategy" && this.$.reorderContainer.addStyles("top:" + (this.initialPinPosition + this.getScrollTop() - this.rowHeight) + "px;");
var n = this.getRowIndexFromCoordinate(this.initialPinPosition);
n != -1 && this.movePlaceholderToIndex(n);
},
hideReorderingRow: function() {
var e = this.hasNode().querySelector('[data-enyo-index="' + this.draggingRowIndex + '"]');
e && (this.hiddenNode = this.hideNode(e));
},
isReordering: function() {
return this.draggingRowIndex > -1;
},
swipeDragStart: function(e, t) {
return t.index == null || t.vertical || this.draggingRowIndex > -1 ? !1 : (this.setSwipeDirection(t.xDirection), this.completeSwipeTimeout && this.completeSwipe(t), this.setFlicked(!1), this.setSwipeComplete(!1), this.swipeIndexChanged(t.index) && (this.clearSwipeables(), this.setSwipeIndex(t.index)), this.persistentItemVisible || this.startSwipe(t), this.draggedXDistance = 0, this.draggedYDistance = 0, !0);
},
shouldDoSwipeDrag: function() {
return this.isSwipeable() && !this.isReordering();
},
swipeDrag: function(e, t) {
return this.persistentItemVisible ? (this.dragPersistentItem(t), this.preventDragPropagation) : (this.dragSwipeableComponents(this.calcNewDragPosition(t.ddx)), this.draggedXDistance = t.dx, this.draggedYDistance = t.dy, this.preventDragPropagation);
},
shouldDoSwipeFlick: function() {
return !this.isReordering();
},
swipeFlick: function(e, t) {
if (t.index == null) return;
return this.isSwipeable() ? Math.abs(t.xVelocity) < Math.abs(t.yVelocity) ? !1 : (this.setFlicked(!0), this.persistentItemVisible ? (this.flickPersistentItem(t), !0) : (this.swipe(this.normalSwipeSpeedMS), !0)) : !1;
},
swipeDragFinish: function(e, t) {
return this.wasFlicked() ? this.preventDragPropagation : (this.persistentItemVisible ? this.dragFinishPersistentItem(t) : this.calcPercentageDragged(this.draggedXDistance) > this.percentageDraggedThreshold ? this.swipe(this.fastSwipeSpeedMS) : this.backOutSwipe(t), this.preventDragPropagation);
},
isSwipeable: function() {
return this.enableSwipe && this.$.swipeableComponents.controls.length !== 0;
},
positionSwipeableContainer: function(e, t) {
var n = this.$.generator.fetchRowNode(e);
if (!n) return;
var r = this.getRelativeOffset(n, this.hasNode()), i = enyo.dom.getBounds(n), s = t == 1 ? -1 * i.width : i.width;
this.$.swipeableComponents.addStyles("top: " + r.top + "px; left: " + s + "px; height: " + i.height + "px; width: " + i.width + "px;");
},
setSwipeDirection: function(e) {
this.swipeDirection = e;
},
setFlicked: function(e) {
this.flicked = e;
},
wasFlicked: function() {
return this.flicked;
},
setSwipeComplete: function(e) {
this.swipeComplete = e;
},
swipeIndexChanged: function(e) {
return this.swipeIndex === null ? !0 : e === undefined ? !1 : e !== this.swipeIndex;
},
setSwipeIndex: function(e) {
this.swipeIndex = e === undefined ? this.swipeIndex : e;
},
calcNewDragPosition: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = t.left, r = this.$.swipeableComponents.getBounds(), i = this.swipeDirection == 1 ? 0 : -1 * r.width, s = this.swipeDirection == 1 ? n + e > i ? i : n + e : n + e < i ? i : n + e;
return s;
},
dragSwipeableComponents: function(e) {
this.$.swipeableComponents.applyStyle("left", e + "px");
},
startSwipe: function(e) {
e.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, e.xDirection), this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(e.xDirection), this.doSetupSwipeItem(e);
},
dragPersistentItem: function(e) {
var t = 0, n = this.persistentItemOrigin == "right" ? Math.max(t, t + e.dx) : Math.min(t, t + e.dx);
this.$.swipeableComponents.applyStyle("left", n + "px");
},
dragFinishPersistentItem: function(e) {
var t = this.calcPercentageDragged(e.dx) > .2, n = e.dx > 0 ? "right" : e.dx < 0 ? "left" : null;
this.persistentItemOrigin == n ? t ? this.slideAwayItem() : this.bounceItem(e) : this.bounceItem(e);
},
flickPersistentItem: function(e) {
e.xVelocity > 0 ? this.persistentItemOrigin == "left" ? this.bounceItem(e) : this.slideAwayItem() : e.xVelocity < 0 && (this.persistentItemOrigin == "right" ? this.bounceItem(e) : this.slideAwayItem());
},
setPersistentItemOrigin: function(e) {
this.persistentItemOrigin = e == 1 ? "left" : "right";
},
calcPercentageDragged: function(e) {
return Math.abs(e / this.$.swipeableComponents.getBounds().width);
},
swipe: function(e) {
this.setSwipeComplete(!0), this.animateSwipe(0, e);
},
backOutSwipe: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = this.swipeDirection == 1 ? -1 * t.width : t.width;
this.animateSwipe(n, this.fastSwipeSpeedMS), this.setSwipeDirection(null), this.setFlicked(!0);
},
bounceItem: function(e) {
var t = this.$.swipeableComponents.getBounds();
t.left != t.width && this.animateSwipe(0, this.normalSwipeSpeedMS);
},
slideAwayItem: function() {
var e = this.$.swipeableComponents, t = e.getBounds().width, n = this.persistentItemOrigin == "left" ? -1 * t : t;
this.animateSwipe(n, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
clearSwipeables: function() {
this.$.swipeableComponents.setShowing(!1), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
completeSwipe: function(e) {
this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), this.getPersistSwipeableItem() ? this.persistentItemVisible = !0 : (this.$.swipeableComponents.setShowing(!1), this.swipeComplete && this.doSwipeComplete({
index: this.swipeIndex,
xDirection: this.swipeDirection
})), this.setSwipeDirection(null);
},
animateSwipe: function(e, t) {
var n = enyo.now(), r = 0, i = this.$.swipeableComponents, s = parseInt(i.domStyles.left, 10), o = e - s;
this.stopAnimateSwipe();
var u = enyo.bind(this, function() {
var e = enyo.now() - n, r = e / t, a = s + o * Math.min(r, 1);
i.applyStyle("left", a + "px"), this.job = enyo.requestAnimationFrame(u), e / t >= 1 && (this.stopAnimateSwipe(), this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
this.completeSwipe();
}), this.completeSwipeDelayMS));
});
this.job = enyo.requestAnimationFrame(u);
},
stopAnimateSwipe: function() {
this.job && (this.job = enyo.cancelRequestAnimationFrame(this.job));
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.strategyKind = this.resetStrategyKind(), this.inherited(arguments);
},
resetStrategyKind: function() {
return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath || this.getStrategy(), i = -1 * this.getScrollTop();
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(-1 * this.getScrollTop() - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0;
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(this.pullHeight), e.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
}, {
name: "placeholder",
classes: "enyo-list-placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
calcArrangementDifference: function(e, t, n, r) {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
peekWidth: 0,
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
constructor: function() {
this.inherited(arguments), this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o, u = 0; o = n[r]; r++) o.getShowing() ? (this.arrangeControl(o, {
left: i + u * this.peekWidth
}), r >= t && (i += o.width + o.marginWidth - this.peekWidth), u++) : (this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth)), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// DockRightArranger.js

enyo.kind({
name: "enyo.DockRightArranger",
kind: "Arranger",
basePanel: !1,
overlap: 0,
layoutWidth: 0,
constructor: function() {
this.inherited(arguments), this.overlap = this.container.overlap != null ? this.container.overlap : this.overlap, this.layoutWidth = this.container.layoutWidth != null ? this.container.layoutWidth : this.layoutWidth;
},
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s;
n.width -= t.left + t.right;
var o = n.width, u = e.length;
this.container.transitionPositions = {};
for (r = 0; s = e[r]; r++) s.width = r === 0 && this.container.basePanel ? o : s.getBounds().width;
for (r = 0; s = e[r]; r++) {
r === 0 && this.container.basePanel && s.setBounds({
width: o
}), s.setBounds({
top: t.top,
bottom: t.bottom
});
for (j = 0; s = e[j]; j++) {
var a;
if (r === 0 && this.container.basePanel) a = 0; else if (j < r) a = o; else {
if (r !== j) break;
var f = o > this.layoutWidth ? this.overlap : 0;
a = o - e[r].width + f;
}
this.container.transitionPositions[r + "." + j] = a;
}
if (j < u) {
var l = !1;
for (k = r + 1; k < u; k++) {
var f = 0;
if (l) f = 0; else if (e[r].width + e[k].width - this.overlap > o) f = 0, l = !0; else {
f = e[r].width - this.overlap;
for (i = r; i < k; i++) {
var c = f + e[i + 1].width - this.overlap;
if (!(c < o)) {
f = o;
break;
}
f = c;
}
f = o - f;
}
this.container.transitionPositions[r + "." + k] = f;
}
}
}
},
arrange: function(e, t) {
var n, r, i = this.container.getPanels(), s = this.container.clamp(t);
for (n = 0; r = i[n]; n++) {
var o = this.container.transitionPositions[n + "." + s];
this.arrangeControl(r, {
left: o
});
}
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels(), s = e < n ? i[n].width : i[e].width;
return s;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onscroll: "domScroll"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "scroll");
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels(), t = this.index % e.length;
return t < 0 && (t += e.length), e[t];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (var n in this.position) e[t].applyStyle(n, this.position[n] + "px");
},
highlightAnchorPointChanged: function() {
this.addRemoveClass("pinDebug", this.highlightAnchorPoint);
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale), this.alignImage();
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : this.scale == "fit" ? (this.fitAlignment = "center", this.scale = Math.max(t, n)) : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
alignImage: function() {
if (this.fitAlignment && this.fitAlignment === "center") {
var e = this.getScrollBounds();
this.setScrollLeft(e.maxLeft / 2), this.setScrollTop(e.maxTop / 2);
}
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
var e = this.getBufferRange();
for (var t in e) this.loadImageView(e[t]);
},
getBufferRange: function() {
var e = [];
if (this.layout.containerBounds) {
var t = 1, n = this.layout.containerBounds, r, i, s, o, u, a;
o = this.index - 1, u = 0, a = n.width * t;
while (o >= 0 && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.unshift(o), o--;
o = this.index, u = 0, a = n.width * (t + 1);
while (o < this.images.length && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.push(o), o++;
}
return e;
},
reflow: function() {
this.inherited(arguments), this.loadNearby();
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? this.$["image" + e].src != this.images[e] && (this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadNearby(), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
var e = getBufferRange();
for (var t = 0; t < this.images.length; t++) enyo.indexOf(t, e) === -1 && this.$["image" + t] && this.$["image" + t].destroy();
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable"
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
onclick: ""
},
tap: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !this.disabled;
},
dragstart: function() {}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v",
animated: !0
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.animatedChanged(), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
animatedChanged: function() {
!this.animated && this.hasNode() && this.$.animator.isAnimating() && (this.$.animator.stop(), this.animatorEnd());
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.animated ? this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
}) : this.animatorEnd();
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left", r = this.$.client.hasNode();
r && (r.style[n] = this.$.client.domStyles[n] = null), this.node && (this.node.style[t] = this.domStyles[t] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling && this.createComponents(this.childComponents, {
isChrome: !0
}), this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop && this.getScroller().setMaxHeight(this.maxHeight + "px"), this.removeClass("onyx-menu-up"), this.floating || this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: r - e.width
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
events: {
onSelect: "",
onItemContentChange: ""
},
classes: "onyx-menu-item",
tag: "div",
create: function() {
this.inherited(arguments), this.active && this.bubble("onActivate");
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
},
contentChanged: function(e) {
this.inherited(arguments), this.doItemContentChange({
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
t.content !== undefined && this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
handlers: {
onItemContentChange: "itemContentChange"
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
itemContentChange: function(e, t) {
t.originator == this.selected && this.doChange({
selected: this.selected,
content: this.selected.content
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments), this.$.flyweight.$.client.children[0].setActive(!0);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e !== undefined && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e)), this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected");
var t = this.$.flyweight.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// DatePicker.js

enyo.kind({
name: "onyx.DatePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
dayHidden: !1,
monthHidden: !1,
yearHidden: !1,
minYear: 1900,
maxYear: 2099,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getMonthFields()), this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : "mdy"), this.dayHiddenChanged(), this.monthHiddenChanged(), this.yearHiddenChanged();
var t = this.value = this.value || new Date;
for (var n = 0, r; r = e[n]; n++) this.$.monthPicker.createComponent({
content: r,
value: n,
active: n == t.getMonth()
});
var i = t.getFullYear();
this.$.yearPicker.setSelected(i - this.minYear);
for (n = 1; n <= this.monthLength(t.getYear(), t.getMonth()); n++) this.$.dayPicker.createComponent({
content: n,
value: n,
active: n == t.getDate()
});
},
monthLength: function(e, t) {
return 32 - (new Date(e, t, 32)).getDate();
},
setupYear: function(e, t) {
this.$.year.setContent(this.minYear + t.index);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "d":
this.createDay();
break;
case "m":
this.createMonth();
break;
case "y":
this.createYear();
break;
default:
}
}
},
createYear: function() {
var e = this.maxYear - this.minYear;
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateYear",
components: [ {
classes: "onyx-datepicker-year",
name: "yearPickerButton",
disabled: this.disabled
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: ++e,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
});
},
createMonth: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMonth",
components: [ {
classes: "onyx-datepicker-month",
name: "monthPickerButton",
disabled: this.disabled
}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
});
},
createDay: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateDay",
components: [ {
classes: "onyx-datepicker-day",
name: "dayPickerButton",
disabled: this.disabled
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
});
},
localeChanged: function() {
this.refresh();
},
dayHiddenChanged: function() {
this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
},
monthHiddenChanged: function() {
this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
},
yearHiddenChanged: function() {
this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
},
minYearChanged: function() {
this.refresh();
},
maxYearChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
disabledChanged: function() {
this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), this.$.dayPickerButton.setDisabled(this.disabled);
},
updateDay: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateMonth: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateYear: function(e, t) {
if (t.originator.selected != -1) {
var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
this.doSelect({
name: this.name,
value: n
}), this.setValue(n);
}
return !0;
},
calcDate: function(e, t, n) {
return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// TimePicker.js

enyo.kind({
name: "onyx.TimePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
is24HrMode: null,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = "AM", t = "PM";
this.is24HrMode == null && (this.is24HrMode = !1), enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getAmCaption(), t = this._tf.getPmCaption(), this.is24HrMode == null && (this.is24HrMode = !this._tf.isAmPm())), this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : "hma");
var n = this.value = this.value || new Date, r;
if (!this.is24HrMode) {
var i = n.getHours();
i = i === 0 ? 12 : i;
for (r = 1; r <= 12; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == (i > 12 ? i % 12 : i)
});
} else for (r = 0; r < 24; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == n.getHours()
});
for (r = 0; r <= 59; r++) this.$.minutePicker.createComponent({
content: r < 10 ? "0" + r : r,
value: r,
active: r == n.getMinutes()
});
n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
content: e
}, {
content: t,
active: !0
} ]) : this.$.ampmPicker.createComponents([ {
content: e,
active: !0
}, {
content: t
} ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "h":
this.createHour();
break;
case "m":
this.createMinute();
break;
case "a":
this.createAmPm();
break;
default:
}
}
},
createHour: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateHour",
components: [ {
classes: "onyx-timepicker-hour",
name: "hourPickerButton",
disabled: this.disabled
}, {
name: "hourPicker",
kind: "onyx.Picker"
} ]
});
},
createMinute: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMinute",
components: [ {
classes: "onyx-timepicker-minute",
name: "minutePickerButton",
disabled: this.disabled
}, {
name: "minutePicker",
kind: "onyx.Picker"
} ]
});
},
createAmPm: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateAmPm",
components: [ {
classes: "onyx-timepicker-ampm",
name: "ampmPickerButton",
disabled: this.disabled
}, {
name: "ampmPicker",
kind: "onyx.Picker"
} ]
});
},
disabledChanged: function() {
this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), this.$.ampmPickerButton.setDisabled(this.disabled);
},
localeChanged: function() {
this.is24HrMode = null, this.refresh();
},
is24HrModeChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
updateHour: function(e, t) {
var n = t.selected.value;
if (!this.is24HrMode) {
var r = this.$.ampmPicker.getParent().controlAtIndex(0).content;
n = n + (n == 12 ? -12 : 0) + (this.isAm(r) ? 0 : 12);
}
return this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateMinute: function(e, t) {
return this.value = this.calcTime(this.value.getHours(), t.selected.value), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateAmPm: function(e, t) {
var n = this.value.getHours();
return this.is24HrMode || (n += n > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
calcTime: function(e, t) {
return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
},
isAm: function(e) {
var t, n, r;
try {
t = this._tf.getAmCaption(), n = this._tf.getPmCaption();
} catch (i) {
t = "AM", n = "PM";
}
return e == t ? !0 : !1;
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
defaultKind: "onyx.RadioButton",
highlander: !0
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.updateVisualState();
},
updateVisualState: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
valueChanged: function() {
this.updateVisualState(), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// ToggleIconButton.js

enyo.kind({
name: "onyx.ToggleIconButton",
kind: "onyx.Icon",
published: {
active: !1,
value: !1
},
events: {
onChange: ""
},
classes: "onyx-icon-button onyx-icon-toggle",
activeChanged: function() {
this.addRemoveClass("active", this.value), this.bubble("onActivate");
},
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
valueChanged: function() {
this.setActive(this.value);
},
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active);
},
rendered: function() {
this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0,
increment: 0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
calcIncrement: function(e) {
return Math.round(e / this.increment) * this.increment;
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.tapped = !0, this.animateTo(n), !0;
}
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// RangeSlider.js

enyo.kind({
name: "onyx.RangeSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
beginValue: 0,
endValue: 0
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t), r, i, s;
if (e.name === "startKnob" && n >= 0) {
if (!(n <= this.endValue && t.xDirection === -1 || n <= this.endValue)) return this.drag(this.$.endKnob, t);
this.setBeginValue(n), r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
} else if (e.name === "endKnob" && n <= 100) {
if (!(n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue)) return this.drag(this.$.startKnob, t);
this.setEndValue(n), r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
var n;
return e.name === "startKnob" ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
value: n,
startChanged: !0
})) : e.name === "endKnob" && (n = this.calcRangeRatio(this.endValue), this.doChange({
value: n,
startChanged: !1
})), !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
}), enyo.kind({
name: "onyx.RangeSliderKnobLabel",
classes: "onyx-range-slider-label",
handlers: {
onSetLabel: "setLabel"
},
setLabel: function(e, t) {
this.setContent(t);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !0, t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !1, t);
},
statics: {
addRemoveFlyweightClass: function(e, t, n, r, i) {
var s = r.flyweight;
if (s) {
var o = i !== undefined ? i : r.index;
s.performOnRow(o, function() {
e.addRemoveClass(t, n);
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
noStretch: !0,
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu"
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e, null);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex !== undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex === undefined && (c.toolbarIndex = t);
}
}
});

// IntegerPicker.js

enyo.kind({
name: "onyx.IntegerPicker",
kind: "onyx.Picker",
published: {
value: 0,
min: 0,
max: 9
},
create: function() {
this.inherited(arguments), this.rangeChanged();
},
minChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
maxChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
rangeChanged: function() {
for (var e = this.min; e <= this.max; e++) this.createComponent({
content: e,
active: e === this.value ? !0 : !1
});
},
valueChanged: function(e) {
var t = this.getClientControls(), n = t.length;
this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
for (var r = 0; r < n; r++) if (this.value === parseInt(t[r].content)) {
this.setSelected(t[r]);
break;
}
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
})), this.value = parseInt(this.selected.content);
}
});

// ContextualPopup.js

enyo.kind({
name: "onyx.ContextualPopup",
kind: "enyo.Popup",
modal: !0,
autoDismiss: !0,
floating: !1,
classes: "onyx-contextual-popup enyo-unselectable",
published: {
maxHeight: 100,
scrolling: !0,
title: undefined,
actionButtons: []
},
vertFlushMargin: 60,
horizFlushMargin: 50,
widePopup: 200,
longPopup: 200,
horizBuffer: 16,
events: {
onTap: ""
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestShow",
onRequestHideMenu: "requestHide"
},
components: [ {
name: "title",
classes: "onyx-contextual-popup-title"
}, {
classes: "onyx-contextual-popup-scroller",
components: [ {
name: "client",
kind: "enyo.Scroller",
vertical: "auto",
classes: "enyo-unselectable",
thumb: !1,
strategyKind: "TouchScrollStrategy"
} ]
}, {
name: "actionButtons",
classes: "onyx-contextual-popup-action-buttons"
} ],
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged(), this.titleChanged(), this.actionButtonsChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
actionButtonsChanged: function() {
for (var e = 0; e < this.actionButtons.length; e++) this.$.actionButtons.createComponent({
kind: "onyx.Button",
content: this.actionButtons[e].content,
classes: this.actionButtons[e].classes + " onyx-contextual-popup-action-button",
name: this.actionButtons[e].name ? this.actionButtons[e].name : "ActionButton" + e,
index: e,
tap: enyo.bind(this, this.tapHandler)
});
},
tapHandler: function(e, t) {
return t.actionButton = !0, t.popup = this, this.bubble("ontap", t), !0;
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition();
},
requestShow: function(e, t) {
var n = t.activator.hasNode();
return n && (this.activatorOffset = this.getPageOffset(n)), this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = this.getBoundingRect(e), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.resetPositioning();
var e = this.getViewWidth(), t = this.getViewHeight(), n = this.vertFlushMargin, r = t - this.vertFlushMargin, i = this.horizFlushMargin, s = e - this.horizFlushMargin;
if (this.activatorOffset.top + this.activatorOffset.height < n || this.activatorOffset.top > r) {
if (this.applyVerticalFlushPositioning(i, s)) return;
if (this.applyHorizontalFlushPositioning(i, s)) return;
if (this.applyVerticalPositioning()) return;
} else if (this.activatorOffset.left + this.activatorOffset.width < i || this.activatorOffset.left > s) if (this.applyHorizontalPositioning()) return;
var o = this.getBoundingRect(this.node);
if (o.width > this.widePopup) {
if (this.applyVerticalPositioning()) return;
} else if (o.height > this.longPopup && this.applyHorizontalPositioning()) return;
if (this.applyVerticalPositioning()) return;
if (this.applyHorizontalPositioning()) return;
}
},
initVerticalPositioning: function() {
this.resetPositioning(), this.addClass("vertical");
var e = this.getBoundingRect(this.node), t = this.getViewHeight();
return this.floating ? this.activatorOffset.top < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height,
bottom: "auto"
}), this.addClass("below")) : (this.applyPosition({
top: this.activatorOffset.top - e.height,
bottom: "auto"
}), this.addClass("above")) : e.top + e.height > t && t - e.bottom < e.top - e.height ? this.addClass("above") : this.addClass("below"), e = this.getBoundingRect(this.node), e.top + e.height > t || e.top < 0 ? !1 : !0;
},
applyVerticalPositioning: function() {
if (!this.initVerticalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
if (this.floating) {
var n = this.activatorOffset.left + this.activatorOffset.width / 2 - e.width / 2;
n + e.width > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.width
}), this.addClass("left")) : n < 0 ? (this.applyPosition({
left: this.activatorOffset.left
}), this.addClass("right")) : this.applyPosition({
left: n
});
} else {
var r = this.activatorOffset.left + this.activatorOffset.width / 2 - e.left - e.width / 2;
e.right + r > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.right
}), this.addRemoveClass("left", !0)) : e.left + r < 0 ? this.addRemoveClass("right", !0) : this.applyPosition({
left: r
});
}
return !0;
},
applyVerticalFlushPositioning: function(e, t) {
if (!this.initVerticalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.activatorOffset.left + this.activatorOffset.width / 2 < e ? (this.activatorOffset.left + this.activatorOffset.width / 2 < this.horizBuffer ? this.applyPosition({
left: this.horizBuffer + (this.floating ? 0 : -n.left)
}) : this.applyPosition({
left: this.activatorOffset.width / 2 + (this.floating ? this.activatorOffset.left : 0)
}), this.addClass("right"), this.addClass("corner"), !0) : this.activatorOffset.left + this.activatorOffset.width / 2 > t ? (this.activatorOffset.left + this.activatorOffset.width / 2 > r - this.horizBuffer ? this.applyPosition({
left: r - this.horizBuffer - n.right
}) : this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width / 2 - n.right
}), this.addClass("left"), this.addClass("corner"), !0) : !1;
},
initHorizontalPositioning: function() {
this.resetPositioning();
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
return this.floating ? this.activatorOffset.left + this.activatorOffset.width < t / 2 ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width
}), this.addRemoveClass("left", !0)) : (this.applyPosition({
left: this.activatorOffset.left - e.width
}), this.addRemoveClass("right", !0)) : this.activatorOffset.left - e.width > 0 ? (this.applyPosition({
left: this.activatorOffset.left - e.left - e.width
}), this.addRemoveClass("right", !0)) : (this.applyPosition({
left: this.activatorOffset.width
}), this.addRemoveClass("left", !0)), this.addRemoveClass("horizontal", !0), e = this.getBoundingRect(this.node), e.left < 0 || e.left + e.width > t ? !1 : !0;
},
applyHorizontalPositioning: function() {
if (!this.initHorizontalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewHeight(), n = this.activatorOffset.top + this.activatorOffset.height / 2;
return this.floating ? n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - e.height / 2,
bottom: "auto"
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top - this.activatorOffset.height,
bottom: "auto"
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top - e.height + this.activatorOffset.height * 2,
bottom: "auto"
}), this.addRemoveClass("low", !0)) : n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: (this.activatorOffset.height - e.height) / 2
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: -this.activatorOffset.height
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: e.top - e.height - this.activatorOffset.top + this.activatorOffset.height
}), this.addRemoveClass("low", !0)), !0;
},
applyHorizontalFlushPositioning: function(e, t) {
if (!this.initHorizontalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.floating ? this.activatorOffset.top < innerHeight / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - n.height
}), this.addRemoveClass("low", !0)) : n.top + n.height > innerHeight && innerHeight - n.bottom < n.top - n.height ? (this.applyPosition({
top: n.top - n.height - this.activatorOffset.top - this.activatorOffset.height / 2
}), this.addRemoveClass("low", !0)) : (this.applyPosition({
top: this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)), this.activatorOffset.left + this.activatorOffset.width < e ? (this.addClass("left"), this.addClass("corner"), !0) : this.activatorOffset.left > t ? (this.addClass("right"), this.addClass("corner"), !0) : !1;
},
getBoundingRect: function(e) {
var t = e.getBoundingClientRect();
return !t.width || !t.height ? {
left: t.left,
right: t.right,
top: t.top,
bottom: t.bottom,
width: t.right - t.left,
height: t.bottom - t.top
} : t;
},
getViewHeight: function() {
return window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight;
},
getViewWidth: function() {
return window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
},
resetPositioning: function() {
this.removeClass("right"), this.removeClass("left"), this.removeClass("high"), this.removeClass("low"), this.removeClass("corner"), this.removeClass("below"), this.removeClass("above"), this.removeClass("vertical"), this.removeClass("horizontal"), this.applyPosition({
left: "auto"
}), this.applyPosition({
top: "auto"
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// $lib/SQLitePlugin.android.js

(function() {
var e, t, n, r, i, s, o, u, a, f;
return u = this, t = function(e, t, n) {
var r;
enyo.log("SQLitePlugin");
if (!e || !e.name) throw new Error("Cannot create a SQLitePlugin instance without a db name");
r = e.name, this.openargs = e, this.dbname = r, this.openSuccess = t, this.openError = n, this.openSuccess || (this.openSuccess = function() {
return enyo.log("DB opened: " + r);
}), this.openError || (this.openError = function(e) {
return enyo.log(e.message);
}), this.open(this.openSuccess, this.openError);
}, t.prototype.openDBs = {}, t.prototype.transaction = function(e, t, n) {
enyo.log("SQLitePlugin.prototype.transaction");
var i;
i = new r(this.dbname), e(i), i.complete(n, t);
}, t.prototype.open = function(e, t) {
enyo.log("SQLitePlugin.prototype.open"), this.dbname in this.openDBs || (this.openDBs[this.dbname] = !0, cordova.exec(e, t, "SQLitePlugin", "open", [ this.openargs ]));
}, t.prototype.close = function(e, t) {
enyo.log("SQLitePlugin.prototype.close"), this.dbname in this.openDBs && (delete this.openDBs[this.dbname], cordova.exec(null, null, "SQLitePlugin", "close", [ this.dbname ]));
}, o = function() {
return 1;
}, t.prototype.executePragmaStatement = function(e, t, n) {
enyo.log("SQLitePlugin::executePragmaStatement"), o = t, cordova.exec(function() {
return 1;
}, n, "SQLitePlugin", "executePragmaStatement", [ this.dbname, e ]);
}, n = {
p1: function(e, t) {
var n;
enyo.log("PRAGMA CB"), n = o, o = function() {
return 1;
}, n(t);
}
}, s = function() {
var e, t;
e = (new Date).getTime(), t = (new Date).getTime();
while (e === t) t = (new Date).getTime();
return t + "000";
}, f = [], a = {}, r = function(e) {
this.dbname = e, this.executes = [], this.trans_id = s(), this.__completed = !1, this.__submitted = !1, this.optimization_no_nested_callbacks = !1, enyo.log("SQLitePluginTransaction - this.trans_id:" + this.trans_id), f[this.trans_id] = [], a[this.trans_id] = new Object;
}, i = {}, i.queryCompleteCallback = function(e, t, n) {
enyo.log("SQLitePluginTransaction.queryCompleteCallback");
var r, i;
r = null;
for (i in f[e]) if (f[e][i].query_id === t) {
r = f[e][i], f[e].length === 1 ? f[e] = [] : f[e].splice(i, 1);
break;
}
if (r && r.callback) return r.callback(n);
}, i.queryErrorCallback = function(e, t, n) {
enyo.log("SQLitePluginTransaction.queryErrorCallback");
var r, i;
r = null;
for (i in f[e]) if (f[e][i].query_id === t) {
r = f[e][i], f[e].length === 1 ? f[e] = [] : f[e].splice(i, 1);
break;
}
if (r && r.err_callback) return r.err_callback(n);
}, i.txCompleteCallback = function(e) {
if (typeof e == "undefined") return enyo.log("SQLitePluginTransaction.txCompleteCallback---transId = NULL");
if (e && a[e] && a[e].success) return a[e].success();
}, i.txErrorCallback = function(e, t) {
return typeof e != "undefined" ? (enyo.log("SQLitePluginTransaction.txErrorCallback---transId:" + e), e && a[e].error && a[e].error(t), delete f[e], delete a[e]) : enyo.log("SQLitePluginTransaction.txErrorCallback---transId = NULL");
}, r.prototype.add_to_transaction = function(e, t, n, r, i) {
var o;
o = new Object, o.trans_id = e, r || !this.optimization_no_nested_callbacks ? o.query_id = s() : this.optimization_no_nested_callbacks && (o.query_id = ""), o.query = t, n ? o.params = n : o.params = [], o.callback = r, o.err_callback = i, f[e] || (f[e] = []), f[e].push(o);
}, r.prototype.executeSql = function(e, t, n, r) {
enyo.log("SQLitePluginTransaction.prototype.executeSql");
var i, s, o;
i = void 0, s = void 0, o = void 0, o = this, s = null, n && (s = function(e) {
var t, r;
return enyo.log("executeSql callback:" + JSON.stringify(e)), t = void 0, r = void 0, r = e, t = {
rows: {
item: function(e) {
return r[e];
},
length: r.length
},
rowsAffected: r.rowsAffected,
insertId: r.insertId || null
}, n(o, t);
}), i = null, r ? (enyo.log("error not NULL: " + e), i = function(e) {
return r(o, e);
}) : enyo.log("error NULL: " + e), enyo.log("executeSql - add_to_transaction: " + e), this.add_to_transaction(this.trans_id, e, t, s, i);
}, r.prototype.complete = function(e, t) {
var n, r, i;
enyo.log("SQLitePluginTransaction.prototype.complete");
if (this.__completed) throw new Error("Transaction already run");
if (this.__submitted) throw new Error("Transaction already submitted");
this.__submitted = !0, i = this, r = function() {
if (f[i.trans_id].length > 0 && !i.optimization_no_nested_callbacks) return i.__submitted = !1, i.complete(e, t);
this.__completed = !0;
if (e) return e(i);
}, n = function(e) {
return null;
}, t && (n = function(e) {
return t(i, e);
}), a[this.trans_id].success = r, a[this.trans_id].error = n, cordova.exec(null, null, "SQLitePlugin", "executeSqlBatch", [ this.dbname, f[this.trans_id] ]);
}, e = {
opendb: function() {
var e, n, r, i;
return arguments.length < 1 ? null : (n = arguments[0], i = null, r = null, e = null, n.constructor === String ? (i = {
name: n
}, arguments.length >= 5 && (r = arguments[4], arguments.length > 5 && (e = arguments[5]))) : (i = n, arguments.length >= 2 && (r = arguments[1], arguments.length > 2 && (e = arguments[2]))), new t(i, r, e));
}
}, u.SQLitePluginCallback = n, u.SQLitePluginTransactionCB = i, u.sqlitePlugin = {
openDatabase: e.opendb
};
})();

// $lib/database.js

enyo.kind({
name: "GTS.database",
kind: enyo.Component,
published: {
database: "",
version: "1",
estimatedSize: null,
debug: !1
},
db: undefined,
dbVersion: null,
lastInsertRowId: 0,
constructor: function() {
this.inherited(arguments), this.bound = {
setSchema: enyo.bind(this, this.setSchema),
insertData: enyo.bind(this, this.insertData),
_errorHandler: enyo.bind(this, this._errorHandler)
};
},
create: function() {
this.inherited(arguments);
if (this.database === "") return enyo.error("Database: you must define a name for your database when instantiating the kind using the `database` property."), null;
this.database.indexOf("ext:") !== 0 && enyo.warn("Database: you are working with an internal database, which will limit its size to 1 MB. Prepend `ext:` to your database name to remove this restriction."), this.db = window.openDatabase(this.database, this.version, this.name, this.estimatedSize);
if (!this.db) return enyo.error("Database: failed to open database named " + this.database), null;
this.dbVersion = this.db.version;
},
getVersion: function() {
return this.dbVersion;
},
lastInsertId: function() {
return this.lastInsertRowId;
},
close: function() {
this.db.close();
},
query: function(e, t) {
if (!this.db) {
this._db_lost();
return;
}
t = typeof t != "undefined" ? t : {}, enyo.isString(e) || (t.values = e.values, e = e.sql), t = this._getOptions(t, {
values: []
}), e = e.replace(/^\s+|\s+$/g, ""), e.lastIndexOf(";") !== e.length - 1 && (e += ";");
var n = this;
this.db.transaction(function(r) {
n.debug && enyo.log(e, " ==> ", t.values), r.executeSql(e, t.values, function(e, r) {
try {
n.lastInsertRowId = r.insertId;
} catch (i) {}
t.onSuccess && t.onSuccess(n._convertResultSet(r));
}, t.onError);
});
},
queries: function(e, t) {
if (!this.db) {
this._db_lost();
return;
}
t = this._getOptions(t);
var n = this.debug;
this.db.transaction(function(r) {
var i = e.length, s = null, o = "", u = [];
for (var a = 0; a < i; a++) s = e[a], enyo.isString(s) ? (o = s, u = []) : (o = s.sql, u = s.values), n && enyo.log(o, " ==> ", u), a === i - 1 ? r.executeSql(o, u, t.onSuccess) : r.executeSql(o, u);
}, t.onError);
},
setSchema: function(e, t) {
enyo.isArray(e) || (e = [ e ]), t = typeof t != "undefined" ? t : {}, t = this._getOptions(t);
var n = [], r = [], i = e.length, s = null;
for (var o = 0; o < i; o++) s = e[o], enyo.isString(s) ? n.push(s) : (typeof s.columns != "undefined" && n.push(this.getCreateTable(s.table, s.columns)), typeof s.data != "undefined" && r.push({
table: s.table,
data: s.data
}));
if (r.length > 0) {
var u = enyo.bind(this, this.insertData, r, t);
this.queries(n, {
onSuccess: u,
onError: t.onError
});
} else this.queries(n, t);
},
insertData: function(e, t) {
enyo.isArray(e) || (e = [ e ]), t = typeof t != "undefined" ? t : {}, t = this._getOptions(t);
var n = [], r = e.length, i = null, s, o, u = 0, a = null;
for (s = 0; s < r; s++) {
i = e[s];
if (typeof i.data != "undefined") {
var f = i.table, l = null;
enyo.isArray(i.data) ? l = i.data : l = [ i.data ], u = l.length;
for (o = 0; o < u; o++) a = l[o], n.push(this.getInsert(f, a));
}
}
this.queries(n, t);
},
getInsert: function(e, t) {
var n = "INSERT INTO " + e + " ( ";
return this._getInsertReplaceSub(n, t);
},
getReplace: function(e, t) {
var n = "INSERT OR REPLACE INTO " + e + " ( ";
return this._getInsertReplaceSub(n, t);
},
_getInsertReplaceSub: function(e, t) {
var n = " VALUES ( ", r = [];
for (var i in t) enyo.isArray(t[i]) && t[i][1] === !0 ? (e += i, n += t[i][0]) : (r.push(t[i]), e += i, n += "?"), e += ", ", n += ", ";
return e = e.substr(0, e.length - 2) + " )", n = n.substr(0, n.length - 2) + " )", e += n, new GTS.databaseQuery({
sql: e,
values: r
});
},
getSelect: function(e, t, n, r, i, s) {
var o = "SELECT ", u = [], a = "";
if (enyo.isString(t)) a = t; else if (enyo.isArray(t)) {
var f = t.length;
a = [];
for (var l = 0; l < f; l++) a.push(t[l]);
a = a.join(", ");
}
o += (a.length > 0 ? a : "*") + " FROM " + e;
var c = [];
for (var h in n) c.push(h + " = ?"), u.push(n[h]);
return c.length > 0 && (o += " WHERE " + c.join(" AND ")), enyo.isArray(r) && r.length > 0 ? o += " ORDER BY " + r.join(", ") : enyo.isString(r) && r.length > 0 && (o += " ORDER BY " + r), i = parseInt(i), isNaN(i) || (o += " LIMIT ?", u.push(i)), i = parseInt(s), isNaN(s) || (o += " OFFSET ?", u.push(s)), new GTS.databaseQuery({
sql: o,
values: u
});
},
getUpdate: function(e, t, n) {
var r = "UPDATE " + e + " SET ", i = [], s = [];
for (var o in t) s.push(o + " = ?"), i.push(t[o]);
r += s.join(", ");
var u = [];
for (var o in n) u.push(o + " = ?"), i.push(n[o]);
return u.length > 0 && (r += " WHERE " + u.join(" AND ")), new GTS.databaseQuery({
sql: r,
values: i
});
},
getDelete: function(e, t) {
var n = "DELETE FROM " + e + " WHERE ", r = [], i = [];
for (var s in t) i.push(s + " = ?"), r.push(t[s]);
return n += i.join(" AND "), new GTS.databaseQuery({
sql: n,
values: r
});
},
getCreateTable: function(e, t, n) {
n = typeof n != "undefined" ? n : !0;
var r = "CREATE TABLE ";
n && (r += "IF NOT EXISTS "), r += e + " ( ";
var i = t.length, s = null, o = [], u = "";
for (var a = 0; a < i; a++) s = t[a], u = s.column + " " + s.type, s.constraints && (u += " " + s.constraints.join(" ")), o.push(u);
return r += o.join(", ") + " )", r;
},
getDropTable: function(e) {
return "DROP TABLE IF EXISTS " + e;
},
_versionChanged: function(e, t) {
this.dbVersion = e, t();
},
_getOptions: function(e, t) {
var n = {
onSuccess: this._emptyFunction,
onError: this.bound._errorHandler
};
return typeof t != "undefined" && (n = enyo.mixin(n, t)), typeof e == "undefined" && (e = {}), enyo.mixin(n, e), enyo.isFunction(e.onError) && (n.onError = enyo.bind(this, this._errorMixed, e.onError)), n;
},
_emptyFunction: function() {},
_convertResultSet: function(e) {
var t = [];
if (e.rows) for (var n = 0; n < e.rows.length; n++) t.push(e.rows.item(n));
return t;
},
_errorMixed: function(e) {
return this.bound._errorHandler.apply(this, arguments), e.apply(null, arguments), !1;
},
_errorHandler: function(e, t) {
typeof t == "undefined" && (t = e);
var n = "Database error ( " + t.code + " ): " + t.message + "<hr />" + enyo.json.stringify(t);
enyo.error(n), Checkbook.globals.criticalError && (enyo.isString(t.message) && t.message.toLowerCase().match("read only database") ? Checkbook.globals.criticalError.load(null, "Warning! Your database has become read only. " + enyo.fetchAppInfo().title + " is unable to modify it in any way. Consult your operating system user's manual on how to remove the read only status from a file. For additional help, please <a href='mailto:" + enyo.fetchAppInfo().vendoremail + "?subject=" + enyo.fetchAppInfo().title + " - read only issue'>contact " + enyo.fetchAppInfo().vendor + "</a>.", null) : enyo.isString(t.message) && t.message.toLowerCase().match("disk i/o error") ? Checkbook.globals.criticalError.load(null, "Warning! Your database has become locked. Please restart " + enyo.fetchAppInfo().title + ". This usually occurs if " + enyo.fetchAppInfo().title + " is running while your device was put in USB mode. For additional help, please <a href='mailto:" + enyo.fetchAppInfo().vendoremail + "?subject=" + enyo.fetchAppInfo().title + " - disk i/o issue'>contact " + enyo.fetchAppInfo().vendor + "</a>.", null) : Checkbook.globals.criticalError.load(null, n, null));
},
_db_lost: function() {
enyo.error("Database: connection has been closed or lost; cannot execute SQL");
}
}), GTS.databaseQuery = function(e) {
this.sql = typeof e.sql != "undefined" ? e.sql : "", this.values = typeof e.values != "undefined" ? e.values : [];
};

// $lib/gdata.js

enyo.kind({
name: "GTS.gdata",
published: {
authKey: "",
acctType: "HOSTED_OR_GOOGLE",
appName: "",
version: "3.0"
},
xmlToJson: function(e) {
var t = {};
if (e.nodeType == 1) {
if (e.attributes.length > 0) {
t["@attributes"] = {};
for (var n = 0; n < e.attributes.length; n++) {
var r = e.attributes.item(n);
t["@attributes"][r.nodeName] = r.nodeValue;
}
}
} else e.nodeType == 3 && (t = e.nodeValue);
if (e.hasChildNodes()) for (var i = 0; i < e.childNodes.length; i++) {
var s = e.childNodes.item(i), o = s.nodeName;
if (typeof t[o] == "undefined") t[o] = this.xmlToJson(s); else {
if (typeof t[o].length == "undefined") {
var u = t[o];
t[o] = [], t[o].push(u);
}
t[o].push(this.xmlToJson(s));
}
}
return t;
},
getSheetSummary: function(e, t) {
typeof e == "undefined" && t.onError("No sheet key defined.");
var n = this, r = (new enyo.Ajax({
url: "https://spreadsheets.google.com/feeds/worksheets/" + e + "/private/full",
method: "GET",
handleAs: "xml",
headers: {
"GData-Version": this.version,
Authorization: this.authKey
}
})).go().response(function(e, r) {
var i = n.xmlToJson(r);
t.onSuccess(e, i);
}).error(enyo.bind(this, this.generalFailure, t.onError));
},
getSheetData: function(e, t, n, r, i) {
var s = this, o = (new enyo.Ajax({
url: "https://spreadsheets.google.com/feeds/list/" + e + "/" + t + "/private/full?start-index=" + n + "&max-results=" + r,
method: "GET",
handleAs: "xml",
headers: {
"GData-Version": this.version,
Authorization: this.authKey
}
})).go().response(function(e, t) {
var n = s.xmlToJson(t);
i.onSuccess(e, n);
}).error(enyo.bind(this, this.generalFailure, i.onError));
},
generalFailure: function(e, t, n) {
var r = "";
n && n === "timeout" ? r = "The request timed out. Please check your network connection and try again." : typeof t.responseText != "undefined" ? t.responseText.match("Error=BadAuthentication") ? r = "Did you enter your username and password correctly?" : t.responseText.match("Error=CaptchaRequired") ? r = "Google is requesting that you complete a CAPTCHA Challenge. Please go to <a href='https://www.google.com/accounts/DisplayUnlockCaptcha'>https://www.google.com/accounts/DisplayUnlockCaptcha</a> to complete it." : t.responseText.match("Error=NotVerified") ? r = "The account email address has not been verified. You will need to access your Google account directly to resolve the issue before logging in using a non-Google application." : t.responseText.match("Error=TermsNotAgreed") ? r = "You have not agreed to Google's terms. You will need to access your Google account directly to resolve the issue before logging in using a non-Google application." : t.responseText.match("Error=AccountDeleted") ? r = "The user account has been deleted and is therefore unable to log in." : t.responseText.match("Error=AccountDisabled") ? r = "The user account has been disabled. Please contact Google." : t.responseText.match("Error=ServiceDisabled") ? r = "Your access to the specified service has been disabled. (Your account may still be valid.)" : t.responseText.match("Error=ServiceUnavailable") ? r = "The service is not available; try again later." : t.responseText.match("Error=Unknown") ? r = "Unknown Error. Did you enter your username and password correctly?" : r = "There has been an error: " + t.responseText : r = "An unknown error occurred.", e && typeof e == "function" && e(r);
}
});

// $lib/utils.js

function prepAmount(e) {
return Math.round(e * 100) / 100;
}

function formatAmount(e) {
e = parseFloat(e);
if (!e || isNaN(e)) e = 0;
return e.formatCurrency(2, "$", ".", ",");
}

function deformatAmount(e) {
e = GTS.String.trim(e);
if (!e) return 0;
if (isNaN(e)) {
var t = e[0] === "(" && e[e.length - 1] === ")";
e = GTS.String.trim(e.replace(/[^0-9\s,'".-]*/g, ""));
var n = e.length;
if (n <= 0) return 0;
var r = 3, i = e.length - 1;
while (r--) if (e[i - r] && e[i - r] !== "-" && isNaN(e[i - r])) {
n = i - r;
break;
}
var s = e.slice(0, n), o = e.slice(n);
e = (t || s[0] == "-" ? "-" : "") + s.replace(/[^0-9]*/g, "") + "." + o.replace(/[^0-9]*/g, "");
}
return e == "" || isNaN(e) ? 0 : parseFloat(e);
}

function createImageObject(e) {
var t = document.createElement("img");
return t.setAttribute("src", e), t;
}

function imgToGrey(e) {
var t = createImageObject(e), n = document.createElement("canvas"), r = n.getContext("2d");
n.width = t.width, n.height = t.height, r.drawImage(t, 0, 0);
var i = r.getImageData(0, 0, t.width, t.height);
for (var s = 0; s < i.height; s++) for (var o = 0; o < i.width; o++) {
var u = s * 4 * i.width + o * 4, a = (i.data[u] + i.data[u + 1] + i.data[u + 2]) / 3;
i.data[u] = a, i.data[u + 1] = a, i.data[u + 2] = a;
}
return r.putImageData(i, 0, 0, 0, 0, i.width, i.height), n.toDataURL();
}

enyo.isFunction(enyo.fetchAppInfo) || (enyo.isFunction(enyo.g11n.Utils._fetchAppRootPath) ? enyo.fetchAppInfo = function() {
if (!enyo._applicationInformation) try {
var e = enyo.g11n.Utils._fetchAppRootPath() + "appinfo.json";
enyo._applicationInformation = JSON.parse(enyo.xhr.request({
url: e,
sync: !0
}).responseText);
} catch (t) {
enyo._applicationInformation = {
title: "App Name",
error: "Error in fetching application information."
}, enyo.error("enyo.fetchAppInfo(): couldn't fetch app info", t);
}
return enyo._applicationInformation;
} : enyo.fetchAppInfo = function() {
return {
title: "App Name",
error: "enyo.g11n.Utils._fetchAppRootPath does not exist. Please make sure you are using the enyo.g11n library in this application."
};
});

// $lib/aes.js

var CryptoJS = CryptoJS || function(e, t) {
var n = {}, r = n.lib = {}, i = r.Base = function() {
function e() {}
return {
extend: function(t) {
e.prototype = this;
var n = new e;
return t && n.mixIn(t), n.$super = this, n;
},
create: function() {
var e = this.extend();
return e.init.apply(e, arguments), e;
},
init: function() {},
mixIn: function(e) {
for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
e.hasOwnProperty("toString") && (this.toString = e.toString);
},
clone: function() {
return this.$super.extend(this);
}
};
}(), s = r.WordArray = i.extend({
init: function(e, n) {
e = this.words = e || [], this.sigBytes = n != t ? n : 4 * e.length;
},
toString: function(e) {
return (e || u).stringify(this);
},
concat: function(e) {
var t = this.words, n = e.words, r = this.sigBytes, e = e.sigBytes;
this.clamp();
if (r % 4) for (var i = 0; i < e; i++) t[r + i >>> 2] |= (n[i >>> 2] >>> 24 - 8 * (i % 4) & 255) << 24 - 8 * ((r + i) % 4); else if (65535 < n.length) for (i = 0; i < e; i += 4) t[r + i >>> 2] = n[i >>> 2]; else t.push.apply(t, n);
return this.sigBytes += e, this;
},
clamp: function() {
var t = this.words, n = this.sigBytes;
t[n >>> 2] &= 4294967295 << 32 - 8 * (n % 4), t.length = e.ceil(n / 4);
},
clone: function() {
var e = i.clone.call(this);
return e.words = this.words.slice(0), e;
},
random: function(t) {
for (var n = [], r = 0; r < t; r += 4) n.push(4294967296 * e.random() | 0);
return s.create(n, t);
}
}), o = n.enc = {}, u = o.Hex = {
stringify: function(e) {
for (var t = e.words, e = e.sigBytes, n = [], r = 0; r < e; r++) {
var i = t[r >>> 2] >>> 24 - 8 * (r % 4) & 255;
n.push((i >>> 4).toString(16)), n.push((i & 15).toString(16));
}
return n.join("");
},
parse: function(e) {
for (var t = e.length, n = [], r = 0; r < t; r += 2) n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - 4 * (r % 8);
return s.create(n, t / 2);
}
}, a = o.Latin1 = {
stringify: function(e) {
for (var t = e.words, e = e.sigBytes, n = [], r = 0; r < e; r++) n.push(String.fromCharCode(t[r >>> 2] >>> 24 - 8 * (r % 4) & 255));
return n.join("");
},
parse: function(e) {
for (var t = e.length, n = [], r = 0; r < t; r++) n[r >>> 2] |= (e.charCodeAt(r) & 255) << 24 - 8 * (r % 4);
return s.create(n, t);
}
}, f = o.Utf8 = {
stringify: function(e) {
try {
return decodeURIComponent(escape(a.stringify(e)));
} catch (t) {
throw Error("Malformed UTF-8 data");
}
},
parse: function(e) {
return a.parse(unescape(encodeURIComponent(e)));
}
}, l = r.BufferedBlockAlgorithm = i.extend({
reset: function() {
this._data = s.create(), this._nDataBytes = 0;
},
_append: function(e) {
"string" == typeof e && (e = f.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes;
},
_process: function(t) {
var n = this._data, r = n.words, i = n.sigBytes, o = this.blockSize, u = i / (4 * o), u = t ? e.ceil(u) : e.max((u | 0) - this._minBufferSize, 0), t = u * o, i = e.min(4 * t, i);
if (t) {
for (var a = 0; a < t; a += o) this._doProcessBlock(r, a);
a = r.splice(0, t), n.sigBytes -= i;
}
return s.create(a, i);
},
clone: function() {
var e = i.clone.call(this);
return e._data = this._data.clone(), e;
},
_minBufferSize: 0
});
r.Hasher = l.extend({
init: function() {
this.reset();
},
reset: function() {
l.reset.call(this), this._doReset();
},
update: function(e) {
return this._append(e), this._process(), this;
},
finalize: function(e) {
return e && this._append(e), this._doFinalize(), this._hash;
},
clone: function() {
var e = l.clone.call(this);
return e._hash = this._hash.clone(), e;
},
blockSize: 16,
_createHelper: function(e) {
return function(t, n) {
return e.create(n).finalize(t);
};
},
_createHmacHelper: function(e) {
return function(t, n) {
return c.HMAC.create(e, n).finalize(t);
};
}
});
var c = n.algo = {};
return n;
}(Math);

(function() {
var e = CryptoJS, t = e.lib.WordArray;
e.enc.Base64 = {
stringify: function(e) {
var t = e.words, n = e.sigBytes, r = this._map;
e.clamp();
for (var e = [], i = 0; i < n; i += 3) for (var s = (t[i >>> 2] >>> 24 - 8 * (i % 4) & 255) << 16 | (t[i + 1 >>> 2] >>> 24 - 8 * ((i + 1) % 4) & 255) << 8 | t[i + 2 >>> 2] >>> 24 - 8 * ((i + 2) % 4) & 255, o = 0; 4 > o && i + .75 * o < n; o++) e.push(r.charAt(s >>> 6 * (3 - o) & 63));
if (t = r.charAt(64)) for (; e.length % 4; ) e.push(t);
return e.join("");
},
parse: function(e) {
var e = e.replace(/\s/g, ""), n = e.length, r = this._map, i = r.charAt(64);
i && (i = e.indexOf(i), -1 != i && (n = i));
for (var i = [], s = 0, o = 0; o < n; o++) if (o % 4) {
var u = r.indexOf(e.charAt(o - 1)) << 2 * (o % 4), a = r.indexOf(e.charAt(o)) >>> 6 - 2 * (o % 4);
i[s >>> 2] |= (u | a) << 24 - 8 * (s % 4), s++;
}
return t.create(i, s);
},
_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
};
})(), function(e) {
function t(e, t, n, r, i, s, o) {
return e = e + (t & n | ~t & r) + i + o, (e << s | e >>> 32 - s) + t;
}
function n(e, t, n, r, i, s, o) {
return e = e + (t & r | n & ~r) + i + o, (e << s | e >>> 32 - s) + t;
}
function r(e, t, n, r, i, s, o) {
return e = e + (t ^ n ^ r) + i + o, (e << s | e >>> 32 - s) + t;
}
function i(e, t, n, r, i, s, o) {
return e = e + (n ^ (t | ~r)) + i + o, (e << s | e >>> 32 - s) + t;
}
var s = CryptoJS, o = s.lib, u = o.WordArray, o = o.Hasher, a = s.algo, f = [];
(function() {
for (var t = 0; 64 > t; t++) f[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0;
})(), a = a.MD5 = o.extend({
_doReset: function() {
this._hash = u.create([ 1732584193, 4023233417, 2562383102, 271733878 ]);
},
_doProcessBlock: function(e, s) {
for (var o = 0; 16 > o; o++) {
var u = s + o, a = e[u];
e[u] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360;
}
for (var u = this._hash.words, a = u[0], c = u[1], p = u[2], d = u[3], o = 0; 64 > o; o += 4) 16 > o ? (a = t(a, c, p, d, e[s + o], 7, f[o]), d = t(d, a, c, p, e[s + o + 1], 12, f[o + 1]), p = t(p, d, a, c, e[s + o + 2], 17, f[o + 2]), c = t(c, p, d, a, e[s + o + 3], 22, f[o + 3])) : 32 > o ? (a = n(a, c, p, d, e[s + (o + 1) % 16], 5, f[o]), d = n(d, a, c, p, e[s + (o + 6) % 16], 9, f[o + 1]), p = n(p, d, a, c, e[s + (o + 11) % 16], 14, f[o + 2]), c = n(c, p, d, a, e[s + o % 16], 20, f[o + 3])) : 48 > o ? (a = r(a, c, p, d, e[s + (3 * o + 5) % 16], 4, f[o]), d = r(d, a, c, p, e[s + (3 * o + 8) % 16], 11, f[o + 1]), p = r(p, d, a, c, e[s + (3 * o + 11) % 16], 16, f[o + 2]), c = r(c, p, d, a, e[s + (3 * o + 14) % 16], 23, f[o + 3])) : (a = i(a, c, p, d, e[s + 3 * o % 16], 6, f[o]), d = i(d, a, c, p, e[s + (3 * o + 7) % 16], 10, f[o + 1]), p = i(p, d, a, c, e[s + (3 * o + 14) % 16], 15, f[o + 2]), c = i(c, p, d, a, e[s + (3 * o + 5) % 16], 21, f[o + 3]));
u[0] = u[0] + a | 0, u[1] = u[1] + c | 0, u[2] = u[2] + p | 0, u[3] = u[3] + d | 0;
},
_doFinalize: function() {
var e = this._data, t = e.words, n = 8 * this._nDataBytes, r = 8 * e.sigBytes;
t[r >>> 5] |= 128 << 24 - r % 32, t[(r + 64 >>> 9 << 4) + 14] = (n << 8 | n >>> 24) & 16711935 | (n << 24 | n >>> 8) & 4278255360, e.sigBytes = 4 * (t.length + 1), this._process(), e = this._hash.words;
for (t = 0; 4 > t; t++) n = e[t], e[t] = (n << 8 | n >>> 24) & 16711935 | (n << 24 | n >>> 8) & 4278255360;
}
}), s.MD5 = o._createHelper(a), s.HmacMD5 = o._createHmacHelper(a);
}(Math), function() {
var e = CryptoJS, t = e.lib, n = t.Base, r = t.WordArray, t = e.algo, i = t.EvpKDF = n.extend({
cfg: n.extend({
keySize: 4,
hasher: t.MD5,
iterations: 1
}),
init: function(e) {
this.cfg = this.cfg.extend(e);
},
compute: function(e, t) {
for (var n = this.cfg, i = n.hasher.create(), s = r.create(), o = s.words, u = n.keySize, n = n.iterations; o.length < u; ) {
a && i.update(a);
var a = i.update(e).finalize(t);
i.reset();
for (var f = 1; f < n; f++) a = i.finalize(a), i.reset();
s.concat(a);
}
return s.sigBytes = 4 * u, s;
}
});
e.EvpKDF = function(e, t, n) {
return i.create(n).compute(e, t);
};
}(), CryptoJS.lib.Cipher || function(e) {
var t = CryptoJS, n = t.lib, r = n.Base, i = n.WordArray, s = n.BufferedBlockAlgorithm, o = t.enc.Base64, u = t.algo.EvpKDF, a = n.Cipher = s.extend({
cfg: r.extend(),
createEncryptor: function(e, t) {
return this.create(this._ENC_XFORM_MODE, e, t);
},
createDecryptor: function(e, t) {
return this.create(this._DEC_XFORM_MODE, e, t);
},
init: function(e, t, n) {
this.cfg = this.cfg.extend(n), this._xformMode = e, this._key = t, this.reset();
},
reset: function() {
s.reset.call(this), this._doReset();
},
process: function(e) {
return this._append(e), this._process();
},
finalize: function(e) {
return e && this._append(e), this._doFinalize();
},
keySize: 4,
ivSize: 4,
_ENC_XFORM_MODE: 1,
_DEC_XFORM_MODE: 2,
_createHelper: function() {
return function(e) {
return {
encrypt: function(t, n, r) {
return ("string" == typeof n ? d : p).encrypt(e, t, n, r);
},
decrypt: function(t, n, r) {
return ("string" == typeof n ? d : p).decrypt(e, t, n, r);
}
};
};
}()
});
n.StreamCipher = a.extend({
_doFinalize: function() {
return this._process(!0);
},
blockSize: 1
});
var f = t.mode = {}, l = n.BlockCipherMode = r.extend({
createEncryptor: function(e, t) {
return this.Encryptor.create(e, t);
},
createDecryptor: function(e, t) {
return this.Decryptor.create(e, t);
},
init: function(e, t) {
this._cipher = e, this._iv = t;
}
}), f = f.CBC = function() {
function t(t, n, r) {
var i = this._iv;
i ? this._iv = e : i = this._prevBlock;
for (var s = 0; s < r; s++) t[n + s] ^= i[s];
}
var n = l.extend();
return n.Encryptor = n.extend({
processBlock: function(e, n) {
var r = this._cipher, i = r.blockSize;
t.call(this, e, n, i), r.encryptBlock(e, n), this._prevBlock = e.slice(n, n + i);
}
}), n.Decryptor = n.extend({
processBlock: function(e, n) {
var r = this._cipher, i = r.blockSize, s = e.slice(n, n + i);
r.decryptBlock(e, n), t.call(this, e, n, i), this._prevBlock = s;
}
}), n;
}(), c = (t.pad = {}).Pkcs7 = {
pad: function(e, t) {
for (var n = 4 * t, n = n - e.sigBytes % n, r = n << 24 | n << 16 | n << 8 | n, s = [], o = 0; o < n; o += 4) s.push(r);
n = i.create(s, n), e.concat(n);
},
unpad: function(e) {
e.sigBytes -= e.words[e.sigBytes - 1 >>> 2] & 255;
}
};
n.BlockCipher = a.extend({
cfg: a.cfg.extend({
mode: f,
padding: c
}),
reset: function() {
a.reset.call(this);
var e = this.cfg, t = e.iv, e = e.mode;
if (this._xformMode == this._ENC_XFORM_MODE) var n = e.createEncryptor; else n = e.createDecryptor, this._minBufferSize = 1;
this._mode = n.call(e, this, t && t.words);
},
_doProcessBlock: function(e, t) {
this._mode.processBlock(e, t);
},
_doFinalize: function() {
var e = this.cfg.padding;
if (this._xformMode == this._ENC_XFORM_MODE) {
e.pad(this._data, this.blockSize);
var t = this._process(!0);
} else t = this._process(!0), e.unpad(t);
return t;
},
blockSize: 4
});
var h = n.CipherParams = r.extend({
init: function(e) {
this.mixIn(e);
},
toString: function(e) {
return (e || this.formatter).stringify(this);
}
}), f = (t.format = {}).OpenSSL = {
stringify: function(e) {
var t = e.ciphertext, e = e.salt, t = (e ? i.create([ 1398893684, 1701076831 ]).concat(e).concat(t) : t).toString(o);
return t = t.replace(/(.{64})/g, "$1\n");
},
parse: function(e) {
var e = o.parse(e), t = e.words;
if (1398893684 == t[0] && 1701076831 == t[1]) {
var n = i.create(t.slice(2, 4));
t.splice(0, 4), e.sigBytes -= 16;
}
return h.create({
ciphertext: e,
salt: n
});
}
}, p = n.SerializableCipher = r.extend({
cfg: r.extend({
format: f
}),
encrypt: function(e, t, n, r) {
var r = this.cfg.extend(r), i = e.createEncryptor(n, r), t = i.finalize(t), i = i.cfg;
return h.create({
ciphertext: t,
key: n,
iv: i.iv,
algorithm: e,
mode: i.mode,
padding: i.padding,
blockSize: e.blockSize,
formatter: r.format
});
},
decrypt: function(e, t, n, r) {
return r = this.cfg.extend(r), t = this._parse(t, r.format), e.createDecryptor(n, r).finalize(t.ciphertext);
},
_parse: function(e, t) {
return "string" == typeof e ? t.parse(e) : e;
}
}), t = (t.kdf = {}).OpenSSL = {
compute: function(e, t, n, r) {
return r || (r = i.random(8)), e = u.create({
keySize: t + n
}).compute(e, r), n = i.create(e.words.slice(t), 4 * n), e.sigBytes = 4 * t, h.create({
key: e,
iv: n,
salt: r
});
}
}, d = n.PasswordBasedCipher = p.extend({
cfg: p.cfg.extend({
kdf: t
}),
encrypt: function(e, t, n, r) {
return r = this.cfg.extend(r), n = r.kdf.compute(n, e.keySize, e.ivSize), r.iv = n.iv, e = p.encrypt.call(this, e, t, n.key, r), e.mixIn(n), e;
},
decrypt: function(e, t, n, r) {
return r = this.cfg.extend(r), t = this._parse(t, r.format), n = r.kdf.compute(n, e.keySize, e.ivSize, t.salt), r.iv = n.iv, p.decrypt.call(this, e, t, n.key, r);
}
});
}(), function() {
var e = CryptoJS, t = e.lib.BlockCipher, n = e.algo, r = [], i = [], s = [], o = [], u = [], a = [], f = [], l = [], c = [], h = [];
(function() {
for (var e = [], t = 0; 256 > t; t++) e[t] = 128 > t ? t << 1 : t << 1 ^ 283;
for (var n = 0, p = 0, t = 0; 256 > t; t++) {
var d = p ^ p << 1 ^ p << 2 ^ p << 3 ^ p << 4, d = d >>> 8 ^ d & 255 ^ 99;
r[n] = d, i[d] = n;
var v = e[n], y = e[v], b = e[y], w = 257 * e[d] ^ 16843008 * d;
s[n] = w << 24 | w >>> 8, o[n] = w << 16 | w >>> 16, u[n] = w << 8 | w >>> 24, a[n] = w, w = 16843009 * b ^ 65537 * y ^ 257 * v ^ 16843008 * n, f[d] = w << 24 | w >>> 8, l[d] = w << 16 | w >>> 16, c[d] = w << 8 | w >>> 24, h[d] = w, n ? (n = v ^ e[e[e[b ^ v]]], p ^= e[e[p]]) : n = p = 1;
}
})();
var p = [ 0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54 ], n = n.AES = t.extend({
_doReset: function() {
for (var e = this._key, t = e.words, n = e.sigBytes / 4, e = 4 * ((this._nRounds = n + 6) + 1), i = this._keySchedule = [], s = 0; s < e; s++) if (s < n) i[s] = t[s]; else {
var o = i[s - 1];
s % n ? 6 < n && 4 == s % n && (o = r[o >>> 24] << 24 | r[o >>> 16 & 255] << 16 | r[o >>> 8 & 255] << 8 | r[o & 255]) : (o = o << 8 | o >>> 24, o = r[o >>> 24] << 24 | r[o >>> 16 & 255] << 16 | r[o >>> 8 & 255] << 8 | r[o & 255], o ^= p[s / n | 0] << 24), i[s] = i[s - n] ^ o;
}
t = this._invKeySchedule = [];
for (n = 0; n < e; n++) s = e - n, o = n % 4 ? i[s] : i[s - 4], t[n] = 4 > n || 4 >= s ? o : f[r[o >>> 24]] ^ l[r[o >>> 16 & 255]] ^ c[r[o >>> 8 & 255]] ^ h[r[o & 255]];
},
encryptBlock: function(e, t) {
this._doCryptBlock(e, t, this._keySchedule, s, o, u, a, r);
},
decryptBlock: function(e, t) {
var n = e[t + 1];
e[t + 1] = e[t + 3], e[t + 3] = n, this._doCryptBlock(e, t, this._invKeySchedule, f, l, c, h, i), n = e[t + 1], e[t + 1] = e[t + 3], e[t + 3] = n;
},
_doCryptBlock: function(e, t, n, r, i, s, o, u) {
for (var a = this._nRounds, f = e[t] ^ n[0], l = e[t + 1] ^ n[1], c = e[t + 2] ^ n[2], h = e[t + 3] ^ n[3], p = 4, d = 1; d < a; d++) var v = r[f >>> 24] ^ i[l >>> 16 & 255] ^ s[c >>> 8 & 255] ^ o[h & 255] ^ n[p++], m = r[l >>> 24] ^ i[c >>> 16 & 255] ^ s[h >>> 8 & 255] ^ o[f & 255] ^ n[p++], g = r[c >>> 24] ^ i[h >>> 16 & 255] ^ s[f >>> 8 & 255] ^ o[l & 255] ^ n[p++], h = r[h >>> 24] ^ i[f >>> 16 & 255] ^ s[l >>> 8 & 255] ^ o[c & 255] ^ n[p++], f = v, l = m, c = g;
v = (u[f >>> 24] << 24 | u[l >>> 16 & 255] << 16 | u[c >>> 8 & 255] << 8 | u[h & 255]) ^ n[p++], m = (u[l >>> 24] << 24 | u[c >>> 16 & 255] << 16 | u[h >>> 8 & 255] << 8 | u[f & 255]) ^ n[p++], g = (u[c >>> 24] << 24 | u[h >>> 16 & 255] << 16 | u[f >>> 8 & 255] << 8 | u[l & 255]) ^ n[p++], h = (u[h >>> 24] << 24 | u[f >>> 16 & 255] << 16 | u[l >>> 8 & 255] << 8 | u[c & 255]) ^ n[p++], e[t] = v, e[t + 1] = m, e[t + 2] = g, e[t + 3] = h;
},
keySize: 8
});
e.AES = t._createHelper(n);
}();

// Array.js

Array.prototype.swap = function(e, t) {
var n = this[e];
return this[e] = this[t], this[t] = n, this;
};

// Date.js

Date.prototype.format = function(e, t) {
if (enyo.g11n) {
e == "special" ? e = {
date: "yyyy-MM-dd",
time: "HH:mm:ss"
} : typeof e == "undefined" ? e = {
date: "medium",
time: "short"
} : enyo.isString(e) || (typeof e["date"] == "undefined" ? e.date = "medium" : typeof e["time"] == "undefined" && (e.time = "short"));
var n = new enyo.g11n.DateFmt(e);
return n.format(this);
}
return "";
}, Date.format = function(e) {
return (new Date).format(e);
}, Date.prototype.setStartOfMonth = function() {
return this.setDate(1), this.setHours(0), this.setMinutes(0), this.setSeconds(0), this.setMilliseconds(0), Date.parse(this);
}, Date.prototype.setEndOfMonth = function() {
return this.setDate(this.daysInMonth()), this.setHours(23), this.setMinutes(59), this.setSeconds(59), this.setMilliseconds(999), Date.parse(this);
}, Date.prototype.daysInMonth = function() {
return 32 - (new Date(this.getFullYear(), this.getMonth(), 32)).getDate();
}, Date.deformat = function(e) {
var t = Date.parse(e);
return isNaN(t) && (t = Date.deformat(e.replace(/A\.M\./i, "am").replace(/P\.M\./i, "pm"))), t;
}, Date.validDate = function(e) {
return Object.isDate(e) && !isNaN(e.getTime());
};

// Math.js

Math.sum = function(e) {
var t = 0;
for (var n = 0; n < e.length; n++) t += e[n];
return t;
}, Math.mean = function(e) {
return e.length > 0 ? this.sum(e) / e.length : !1;
}, Math.median = function(e) {
return e.length <= 0 ? !1 : (e = this.sort(e), e.length.isEven() ? this.mean([ e[e.length / 2 - 1], e[e.length / 2] ]) : e[(e.length / 2).floor()]);
}, Math.variance = function(e) {
if (e.length <= 0) return !1;
var t = this.mean(e), n = [];
for (var r = 0; r < e.length; r++) n.push(this.pow(e[r] - t, 2));
return this.mean(n);
}, Math.stdDev = function(e) {
return this.sqrt(this.variance(e));
}, Math.sinh = function(e) {
return (this.exp(e) - this.exp(-e)) / 2;
}, Math.cosh = function(e) {
return (this.exp(e) + this.exp(-e)) / 2;
}, Math.tanh = function(e) {
return this.sinh(e) / this.cosh(e);
}, Math.coth = function(e) {
return this.cosh(e) / this.sinh(e);
}, Math.sech = function(e) {
return 2 / (this.exp(e) + this.exp(-e));
}, Math.csch = function(e) {
return 2 / (this.exp(e) - this.exp(-e));
}, Math.sort = function(e, t) {
return e.clone().sort(function(e, n) {
return t ? n - e : e - n;
});
};

// Number.js

Number.prototype.isNaN = function() {
return isNaN(this);
}, Number.prototype.isNull = function() {
return this == 0;
}, Number.prototype.isEven = function() {
return this.isInteger() ? this % 2 === 0 ? !1 : !0 : !1;
}, Number.prototype.isOdd = function() {
return this.isInteger() ? this % 2 === 0 ? !0 : !1 : !1;
}, Number.prototype.isInteger = function(e) {
return this.isNaN() ? !1 : e && this.isNull() ? !1 : this - this.floor() === 0 ? !1 : !0;
}, Number.prototype.isNatural = function(e) {
return this.isInteger(e) && this >= 0;
}, Number.prototype.formatCurrency = function(e, t, n, r) {
e = isNaN(e) ? 2 : Math.abs(e), t = t || "$", n = n || ".", r = typeof r == "undefined" ? "," : r;
var i = this < 0 ? "-" : "", s = Math.abs(this).toFixed(e), o = parseInt(s) + "", u = (u = o.length) > 3 ? u % 3 : 0;
return i + t + (u ? o.substr(0, u) + r : "") + o.substr(u).replace(/(\d{3})(?=\d)/g, "$1" + r) + (e ? n + Math.abs(s - o).toFixed(e).slice(2) : "");
};

// Object.js

enyo.singleton({
name: "GTS.Object",
kind: "enyo.Component",
numericValues: function(e) {
return Object.values(e).select(this.isNumber);
},
validNumber: function(e) {
return this.isNumber(e) && !isNaN(parseFloat(e)) && isFinite(e);
},
swap: function(e, t, n) {
var r = e[t];
return e[t] = e[n], e[n] = r, e;
},
size: function(e) {
var t = 0, n;
for (n in e) e.hasOwnProperty(n) && t++;
return t;
},
isFunction: function(e) {
return enyo.isFunction ? enyo.isFunction(e) : Object.prototype.toString.call(e) === "[object Function]";
},
isString: function(e) {
return enyo.isString ? enyo.isString(e) : Object.prototype.toString.call(e) === "[object String]";
},
isNumber: function(e) {
return Object.prototype.toString.call(e) === "[object Number]";
},
isDate: function(e) {
return Object.prototype.toString.call(e) === "[object Date]";
},
isUndefined: function(e) {
return typeof e == "undefined";
}
});

// String.js

enyo.singleton({
name: "GTS.String",
kind: "enyo.Component",
published: {
dirtyItem: [ "&", "<", ">", '"', "`", "'", "\n" ],
cleanItem: [ "&amp;", "$lt;", "&gt;", "&quot;", "'", "'", "&crarr;" ]
},
stripHTML: function(e) {
return e ? e.replace(/<\S[^><]*>/g, "") : "";
},
cleanString: function(e) {
if (e) {
for (var t = 0; t < this.dirtyItem.length; t++) e = e.replace(new RegExp(this.dirtyItem[t], "g"), this.cleanItem[t]);
return e;
}
return "";
},
dirtyString: function(e) {
if (e) {
for (var t = 0; t < this.dirtyItem.length; t++) e = e.replace(new RegExp(this.cleanItem[t], "g"), this.dirtyItem[t]);
return e;
}
return "";
},
trim: function(e) {
return e ? e.replace(/^\s\s*/, "").replace(/\s\s*$/, "") : "";
},
ucfirst: function(e) {
if (e) {
var t = e.charAt(0).toUpperCase();
return t + e.substr(1);
}
return "";
},
isBlank: function(e) {
return e ? /^\s*$/.test(e) : !0;
},
isJSON: function(e) {
return e && !this.isBlank(e) ? (e = e.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@"), e = e.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]"), e = e.replace(/(?:^|:|,)(?:\s*\[)+/g, ""), /^[\],:{}\s]*$/.test(e)) : !1;
}
});

// gapi.js

enyo.kind({
name: "GTS.Gapi",
nextSteps: {},
published: {
apiKey: "",
clientId: "",
clientSecret: "",
scope: [],
gapiConfig: {
endpoint: "https://accounts.google.com/o/oauth2/auth",
endtoken: "https://accounts.google.com/o/oauth2/token",
response_type: "code",
redirect_uri: "http://localhost",
accessTokenExpireLimit: 348e4,
grantTypes: {
AUTHORIZE: "authorization_code",
REFRESH: "refresh_token"
},
access_type: "offline",
state: "lligtaskinit"
}
},
events: {
onReady: ""
},
constructor: function() {
this.inherited(arguments), this._binds = {
_cbUrlChanged: enyo.bind(this, this.cbUrlChanged),
_handleAuthResult: enyo.bind(this, this.handleAuthResult)
};
},
create: function() {
this.inherited(arguments), this.isGapiReady() ? (this.doReady(), this.apiKeyChanged()) : this.loadGapi();
},
isGapiReady: function() {
return typeof gapi != "undefined";
},
loadGapi: function() {
(new enyo.JsonpRequest({
url: "https://apis.google.com/js/client.js",
callbackName: "onload"
})).go().response(this, "gapiLoaded");
},
gapiLoaded: function() {
this.apiKey != "" && this.apiKeyChanged(), this.doReady();
},
apiKeyChanged: function() {
gapi.client.setApiKey(this.apiKey);
},
getAuthToken: function() {
return gapi.auth.getToken();
},
setAuthToken: function(e) {
return gapi.auth.setToken(e);
},
auth: function(e) {
this.nextSteps = e;
if (window.device && window.plugins.childBrowser && (enyo.platform.android || enyo.platform.androidChrome)) {
var t = this.getAuthToken();
this.log("Phonegap-ChildBrowsers Auth");
var n = {
client_id: encodeURIComponent(this.clientId),
scope: encodeURIComponent(this.scope.join(" ")),
redirect_uri: encodeURIComponent(this.gapiConfig.redirect_uri),
response_type: encodeURIComponent(this.gapiConfig.response_type),
state: encodeURIComponent(this.gapiConfig.state),
access_type: encodeURIComponent(this.gapiConfig.access_type),
approval_prompt: "force"
}, r = this.gapiConfig.endpoint + "?" + Object.keys(n).map(function(e) {
return e + "=" + n[e];
}).join("&");
window.plugins.childBrowser.onClose = function() {}, window.plugins.childBrowser.onLocationChange = this._binds._cbUrlChanged, window.plugins.childBrowser.showWebPage(r, {
showLocationBar: !1
});
} else gapi.auth.authorize({
client_id: this.clientId,
scope: this.scope.join(" "),
immediate: !0
}, this._binds._handleAuthResult);
},
cbUrlChanged: function(e) {
if (e.indexOf("code=") != -1) {
this.log("Authenticated");
var t = this.getParameterByName("code", e);
enyo.job("refreshFromUrlChange", enyo.bind(this, this.getRefreshToken, t, this.nextSteps), 1e3), window.plugins.childBrowser.close();
} else if (e.indexOf("error=") != -1) {
window.plugins.childBrowser.close();
if (enyo.isFunction(this.nextSteps.onError)) {
this.nextSteps.onError(this.getParameterByName("error", e));
return;
}
} else this.log("Status unknown: " + e);
},
getParameterByName: function(e, t) {
e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
var n = new RegExp("[\\?&]" + e + "=([^&#]*)"), r = n.exec(t);
return r == null ? !1 : decodeURIComponent(r[1].replace(/\+/g, " "));
},
getAccessToken: function(e) {
this.log("Update token"), this.nextSteps = {};
var t = (new Date).getTime(), n = this.getAuthToken();
if (n && n.access_token && t < n.expires_in + this.gapiConfig.accessTokenExpireLimit) {
enyo.isFunction(e.onSuccess) && e.onSuccess();
return;
}
this.log("Fetching fresh token");
var r = new enyo.Ajax({
url: this.gapiConfig.endtoken,
method: "POST",
postBody: {
client_id: this.clientId,
client_secret: this.clientSecret,
refresh_token: n.access_token,
redirect_uri: this.gapiConfig.redirect_uri,
grant_type: this.gapiConfig.grantTypes.AUTHORIZE
}
});
r.go(), r.response(this, function(t, n) {
this.log("Access complete");
var r = {
access_token: n.access_token
};
return this.setAuthToken(r), n.error = !1, enyo.isFunction(e.onSuccess) && e.onSuccess(n), !0;
}), r.error(this, function(t, n) {
return this.log("Access error"), enyo.isFunction(e.onError) && (n.error = !0, e.onError(n)), !0;
});
},
getRefreshToken: function(e, t) {
this.log("Refresh token");
var n = new enyo.Ajax({
url: this.gapiConfig.endtoken,
method: "POST",
postBody: {
code: e,
client_id: this.clientId,
client_secret: this.clientSecret,
redirect_uri: this.gapiConfig.redirect_uri,
grant_type: this.gapiConfig.grantTypes.AUTHORIZE
}
});
n.go(), n.response(this, function(e, n) {
return this.log("Refresh complete", enyo.json.stringify(n)), this.setAuthToken(n), enyo.isFunction(t.onSuccess) && t.onSuccess(n), !0;
}), n.error(this, function(e, n) {
return this.log("Refresh error", enyo.json.stringify(n)), enyo.isFunction(t.onError) && (n.error = !0, t.onError(n)), !0;
});
},
handleAuthResult: function(e) {
this.$.authPop && (this.$.authPop.hide(), this.$.authPop.destroy());
if (e && !e.error) enyo.isFunction(this.nextSteps.onSuccess) && this.nextSteps.onSuccess(); else {
var t = {
name: "authPop",
kind: "onyx.Popup",
centered: !0,
floating: !0,
modal: !0,
scrim: !0,
components: [ {
content: "Authenticate with Google",
classes: "margin-half-bottom bigger text-center"
}, {
classes: "text-center",
components: [ {
kind: "onyx.Button",
content: "Cancel",
ontap: "handleAuthAbort",
classes: "onyx-negative",
style: "margin-right: 15px;"
}, {
kind: "onyx.Button",
content: "Authenticate",
onclick: "handleAuthClick",
classes: "onyx-affirmative"
} ]
} ]
};
this.createComponent(t), this.render(), this.$.authPop.show();
var n = this.$.authPop.getComputedStyleValue("zIndex");
if (!n) {
var r = this.$.authPop.domCssText.split(";");
for (var i = 0; i < r.length; i++) if (r[i].match("z-index")) {
r = r[i].split(":"), n = r[1];
break;
}
}
this.$.authPop.applyStyle("z-index", n - 5 + 10), this.$.authPop.reflow();
}
},
handleAuthAbort: function() {
this.$.authPop.hide(), enyo.isFunction(this.nextSteps.onError) && this.nextSteps.onError();
},
handleAuthClick: function() {
gapi.auth.authorize({
client_id: this.clientId,
scope: this.scope.join(" "),
immediate: !1
}, this._binds._handleAuthResult);
},
loadModule: function(e, t, n) {
if (!this.isGapiReady()) {
n.onError({
message: "Google API not ready yet."
});
return;
}
typeof gapi.client[e] == "undefined" ? gapi.client.load(e, "v" + t, n.onSuccess) : enyo.isFunction(n.onSuccess) && n.onSuccess();
}
});

// LazyList.js

enyo.kind({
name: "GTS.LazyList",
kind: "enyo.AroundList",
lastLazyLoad: 0,
published: {
pageSize: 50
},
events: {
onAcquirePage: ""
},
scroll: function(e, t) {
var n = this.getStrategy().$.scrollMath;
return (n.isInOverScroll() && n.y < 0 || n.y < n.bottomBoundary + this.$.belowClient.hasNode().offsetHeight) && this.lastLazyLoad < this.pageCount && (this.lastLazyLoad = this.pageCount, this._requestData()), this.inherited(arguments);
},
lazyLoad: function() {
this.lastLazyLoad = 0, this._requestData();
},
_requestData: function() {
var e = this.doAcquirePage({
page: this.lastLazyLoad,
pageSize: this.pageSize
});
this.log(e, new Date);
},
reset: function() {
this.inherited(arguments);
}
});

// SelectorBar.js

enyo.kind({
name: "GTS.SelectorBar",
kind: "onyx.Item",
classes: "gts-selectorBar",
published: {
label: "Select One",
sublabel: "",
choices: [],
value: "",
disabled: !1,
maxHeight: 200,
labelWidth: null
},
events: {
onChange: ""
},
components: [ {
name: "base",
kind: "enyo.FittableColumns",
components: [ {
name: "valueIcon",
kind: "enyo.Image",
style: "margin-right: 1em;"
}, {
name: "valueDisplay",
fit: !0
}, {
kind: "onyx.MenuDecorator",
components: [ {
name: "labelButton",
kind: "onyx.Button",
classes: "label arrow"
}, {
name: "menu",
kind: "onyx.Picker",
classes: "gts-selectorBar",
onChange: "selectionChanged",
components: []
} ]
} ]
}, {
name: "sublabel",
classes: "sub-label"
} ],
rendered: function() {
this.inherited(arguments), this.labelChanged(), this.sublabelChanged(), this.choicesChanged(), this.valueChanged(), this.disabledChanged(), this.labelWidthChanged(), this.maxHeightChanged(), enyo.asyncMethod(this, this.reflow);
},
reflow: function() {
enyo.asyncMethod(this, this.waterfallDown, "onresize", "onresize", this);
},
labelChanged: function() {
this.$.labelButton.setContent(this.label);
},
sublabelChanged: function() {
this.$.sublabel.setContent(this.sublabel), this.sublabel === "" ? this.$.sublabel.hide() : this.$.sublabel.show();
},
choicesChanged: function() {
this.$.menu.destroyClientControls(), this.$.menu.createComponents(this.choices), this.valueChanged();
},
disabledChanged: function() {
this.$.labelButton.setDisabled(this.disabled);
},
maxHeightChanged: function() {
this.$.menu.setMaxHeight(this.maxHeight);
},
labelWidthChanged: function() {
this.$.labelButton.applyStyle("width", this.labelWidth);
},
setValue: function(e) {
this.value = e, this.valueChanged();
},
valueChanged: function() {
if (this.choices.length === 0) return;
this.value === null && (this.value = this._getValue(this.choices[0]));
for (var e = 0; e < this.choices.length; e++) if (this.value === this._getValue(this.choices[e])) {
this.$.valueDisplay.setContent(this.choices[e].content), this.choices[e].icon ? (this.$.valueIcon.setSrc(this.choices[e].icon), this.$.valueIcon.show()) : this.$.valueIcon.hide();
break;
}
this.reflow();
},
_getValue: function(e) {
return e.hasOwnProperty("value") ? e.value : e.content;
},
selectionChanged: function(e, t) {
return this.value = t.selected.hasOwnProperty("value") ? t.selected.value : t.content, this.valueChanged(), this.doChange(t), this.reflow(), !0;
}
});

// ToggleBar.js

enyo.kind({
name: "GTS.ToggleBar",
kind: "onyx.Item",
classes: "gts-ToggleBar",
published: {
label: "Toggle Button",
sublabel: "",
onContent: "On",
offContent: "Off",
value: !1
},
events: {
onChange: ""
},
components: [ {
name: "base",
kind: "enyo.FittableColumns",
components: [ {
fit: !0,
components: [ {
name: "label"
}, {
name: "sublabel",
style: "font-size: 75%;"
} ]
}, {
name: "switch",
kind: "onyx.ToggleButton",
ontap: "switchToggled",
onChange: "switchChanged"
} ]
} ],
handlers: {
ontap: "barTapped"
},
rendered: function() {
this.inherited(arguments), this.labelChanged(), this.sublabelChanged(), this.onContentChanged(), this.offContentChanged(), this.valueChanged();
},
reflow: function() {
this.$.base.reflow();
},
barTapped: function() {
this.$["switch"].setValue(!this.getValue()), this.doChange(this.$["switch"]);
},
switchToggled: function(e, t) {
return this.doChange(this.$["switch"]), !0;
},
switchChanged: function(e, t) {
return !0;
},
labelChanged: function() {
this.$.label.setContent(this.label);
},
sublabelChanged: function() {
this.$.sublabel.setContent(this.sublabel);
},
onContentChanged: function() {
this.$["switch"].setOnContent(this.onContent);
},
offContentChanged: function() {
this.$["switch"].setOffContent(this.offContent);
},
valueChanged: function() {
this.$["switch"].setValue(this.value), this.reflow();
},
getValue: function() {
return this.$["switch"].getValue();
}
});

// Divider.js

enyo.kind({
name: "GTS.Divider",
classes: "gts-Divider",
published: {
content: "",
useFittable: !0
},
create: function() {
this.inherited(arguments), this.useFittableChanged(), this.contentChanged();
},
reflow: function() {
this.$.base.reflow();
},
useFittableChanged: function() {
this.destroyComponents(), this.createComponents([ {
name: "base",
kind: this.useFittable ? "enyo.FittableColumns" : "enyo.Control",
noStretch: !0,
classes: "base-bar",
components: [ {
classes: "end-cap bar"
}, {
name: "caption",
classes: "caption"
}, {
classes: "bar full",
fit: !0
} ]
} ], {
owner: this
});
},
contentChanged: function() {
this.$.caption.setContent(this.content), this.$.caption.applyStyle("display", this.content ? "" : "none"), this.reflow();
}
});

// DividerDrawer.js

enyo.kind({
name: "GTS.DividerDrawer",
classes: "gts-DividerDrawer",
published: {
caption: "",
open: !0
},
events: {
onChange: ""
},
components: [ {
name: "base",
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "base-bar",
ontap: "toggleOpen",
components: [ {
classes: "end-cap"
}, {
name: "caption",
classes: "caption"
}, {
classes: "bar",
fit: !0
}, {
name: "switch",
classes: "toggle",
value: !1
}, {
classes: "end-cap bar"
} ]
}, {
name: "client",
kind: "onyx.Drawer"
} ],
rendered: function() {
this.inherited(arguments), this.captionChanged(), this.openChanged();
},
reflow: function() {
this.$.base.reflow();
},
openChanged: function() {
this.$["switch"].value = this.open, this.$.client.setOpen(this.$["switch"].value), this.$["switch"].addRemoveClass("checked", this.$["switch"].value), this.reflow();
},
captionChanged: function() {
this.$.caption.setContent(this.caption), this.$.caption.applyStyle("display", this.caption ? "" : "none"), this.reflow();
},
toggleOpen: function(e, t) {
return this.open = !this.$["switch"].value, this.$["switch"].value = this.open, this.openChanged(), this.doChange(this, {
caption: this.getCaption(),
open: this.getOpen()
}), !0;
}
});

// SelectedMenu.js

enyo.kind({
name: "GTS.SelectedMenu",
kind: "onyx.Menu",
classes: "gts-selectedMenu",
published: {
choices: [],
value: ""
},
events: {
onChange: ""
},
components: [],
handlers: {
onSelect: "selectionChanged"
},
choicesChanged: function() {
this.destroyClientControls(), enyo.isArray(this.choices) && this.createComponents(this.choices), this.valueChanged(), this.render(), this.reflow();
},
valueChanged: function() {
var e = this.getClientControls(), t;
for (var n = 0; n < e.length; n++) t = e[n].value === this.value, e[n].addRemoveClass("selected", t), e[n].addRemoveClass("normal", !t);
},
selectionChanged: function(e, t) {
this.setValue(t.selected.value), this.doChange(t.selected);
}
});

// InlineNotification.js

enyo.kind({
name: "GTS.InlineNotification",
classes: "inline-notification",
content: "",
allowHtml: !0,
typeOptions: [ "add", "error", "info", "search", "success", "success-blue", "warning" ],
published: {
type: "error",
icon: !0
},
rendered: function() {
this.inherited(arguments), this.typeChanged(), this.iconChanged();
},
typeChanged: function() {
for (var e = 0; e < this.typeOptions.length; e++) this.addRemoveClass(this.typeOptions[e], this.typeOptions[e] === this.type);
},
iconChanged: function() {
this.addRemoveClass("no-image", !this.icon);
}
});

// IntegerPicker.js

enyo.kind({
name: "GTS.IntegerPicker",
kind: "onyx.Picker",
classes: "gts-integer-picker",
published: {
min: 1,
max: 10,
step: 1,
value: null
},
events: {
onChange: ""
},
handlers: {
onChange: "selectionChanged"
},
create: function() {
this.inherited(arguments), this.generateValues();
},
minChanged: function() {
this.generateValues();
},
maxChanged: function() {
this.generateValues();
},
stepChanged: function() {
this.generateValues();
},
generateValues: function() {
this.destroyClientControls();
if (this.value == null || isNaN(this.value)) this.value = this.min;
var e = [];
for (var t = this.min; t <= this.max; ) e.push({
content: t,
active: t == this.value
}), t += this.step;
this.createComponents(e, {
owner: this
}), this.render();
},
selectionChanged: function(e, t) {
this.setValue(t.selected.content);
}
});

// IntegerPickerBar.js

enyo.kind({
name: "GTS.IntegerPickerBar",
kind: "onyx.Item",
classes: "gts-integerPickerBar",
published: {
label: "Pick a value",
sublabel: "",
min: 1,
max: 10,
step: 1,
value: "",
disabled: !1,
maxHeight: 200,
pickerWidth: null
},
events: {
onChange: ""
},
components: [ {
name: "base",
kind: "enyo.FittableColumns",
components: [ {
name: "label",
fit: !0
}, {
kind: "onyx.PickerDecorator",
components: [ {
name: "pickerButton",
classes: "arrow"
}, {
name: "integer",
kind: "GTS.IntegerPicker",
min: 1,
max: 25,
classes: "gts-IntegerPickerBar",
onChange: "selectionChanged"
} ]
} ]
}, {
name: "sublabel",
classes: "sub-label"
} ],
rendered: function() {
this.inherited(arguments), this.labelChanged(), this.sublabelChanged(), this.minChanged(), this.maxChanged(), this.stepChanged(), this.valueChanged(), this.disabledChanged(), this.pickerWidthChanged(), this.maxHeightChanged(), enyo.asyncMethod(this, this.reflow);
},
reflow: function() {
enyo.asyncMethod(this, this.waterfallDown, "onresize", "onresize", this);
},
labelChanged: function() {
this.$.label.setContent(this.label);
},
sublabelChanged: function() {
this.$.sublabel.setContent(this.sublabel), this.sublabel === "" ? this.$.sublabel.hide() : this.$.sublabel.show();
},
disabledChanged: function() {
this.$.pickerButton.setDisabled(this.disabled);
},
maxHeightChanged: function() {
this.$.integer.setMaxHeight(this.maxHeight);
},
pickerWidthChanged: function() {
this.$.pickerButton.applyStyle("width", this.pickerWidth);
},
minChanged: function() {
this.$.integer.setMin(this.getMin());
},
maxChanged: function() {
this.$.integer.setMax(this.getMax());
},
stepChanged: function() {
this.$.integer.setStep(this.getStep());
},
valueChanged: function() {
this.$.integer.setValue(this.getValue()), this.$.pickerButton.setContent(this.getValue()), this.reflow();
},
selectionChanged: function(e, t) {
return this.value = this.$.integer.getValue(), this.$.pickerButton.setContent(this.getValue()), this.reflow(), this.doChange(enyo.mixin(t, {
value: this.getValue()
})), !0;
}
});

// DatePicker.js

enyo.kind({
name: "GTS.DatePicker",
kind: "enyo.Control",
classes: "gts-calendar",
published: {
value: null,
locale: "",
disabled: !1,
viewDate: null,
dowFormat: "medium",
monthFormat: "MMMM yyyy"
},
events: {
onSelect: ""
},
components: [ {
kind: "FittableColumns",
components: [ {
kind: "onyx.Button",
content: "<<",
ontap: "monthBack"
}, {
name: "monthLabel",
tag: "strong",
classes: "month-label",
fit: !0
}, {
kind: "onyx.Button",
content: ">>",
ontap: "monthForward"
} ]
}, {
classes: "date-row day-of-week",
components: [ {
name: "sunday",
content: "Sun",
classes: "week-label"
}, {
name: "monday",
content: "Mon",
classes: "week-label"
}, {
name: "tuesday",
content: "Tue",
classes: "week-label"
}, {
name: "wednesday",
content: "Wed",
classes: "week-label"
}, {
name: "thursday",
content: "Thu",
classes: "week-label"
}, {
name: "friday",
content: "Fri",
classes: "week-label"
}, {
name: "saturday",
content: "Sat",
classes: "week-label"
} ]
}, {
classes: "date-row",
components: [ {
name: "row0col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
classes: "date-row",
components: [ {
name: "row1col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
classes: "date-row",
components: [ {
name: "row2col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
classes: "date-row",
components: [ {
name: "row3col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
classes: "date-row",
components: [ {
name: "row4col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
classes: "date-row",
components: [ {
name: "row5col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
kind: "FittableColumns",
style: "margin-top: 1em;",
components: [ {
name: "client",
fit: !0
}, {
kind: "onyx.Button",
content: "Today",
ontap: "resetDate"
} ]
} ],
create: function() {
this.inherited(arguments), enyo.g11n && this.locale == "" && (this.locale = enyo.g11n.currentLocale().getLocale()), this.value = this.value || new Date, this.viewDate = this.viewDate || new Date, this.localeChanged();
},
localeChanged: function() {
this.days = {
weekstart: 0,
"short": [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
full: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
};
if (enyo.g11n) {
var e = new enyo.g11n.Fmts({
locale: new enyo.g11n.Locale(this.locale)
});
this.days = {
weekstart: e.getFirstDayOfWeek(),
medium: e.dateTimeHash.medium.day,
"long": e.dateTimeHash.long.day
};
}
this.$.sunday.setContent(this.days[this.dowFormat][0]), this.$.monday.setContent(this.days[this.dowFormat][1]), this.$.tuesday.setContent(this.days[this.dowFormat][2]), this.$.wednesday.setContent(this.days[this.dowFormat][3]), this.$.thursday.setContent(this.days[this.dowFormat][4]), this.$.friday.setContent(this.days[this.dowFormat][5]), this.$.saturday.setContent(this.days[this.dowFormat][6]);
},
rendered: function() {
this.inherited(arguments), this.renderDoW(), this.valueChanged();
},
setValue: function(e) {
enyo.isString(e) && (e = new Date(e)), this.value = e, this.valueChanged();
},
valueChanged: function() {
if (Object.prototype.toString.call(this.value) !== "[object Date]" || isNaN(this.value.getTime())) this.value = new Date;
this.setViewDate(this.value);
},
setViewDate: function(e) {
enyo.isString(e) && (e = new Date(e)), this.viewDate = e, this.viewDateChanged();
},
viewDateChanged: function() {
this.renderCalendar();
},
renderDoW: function() {
enyo.job("renderDoW", enyo.bind(this, "_renderDoW"), 100);
},
_renderDoW: function() {
var e = Math.round(10 * this.getBounds().width / 7) / 10;
this.$.sunday.applyStyle("width", e + "px"), this.$.monday.applyStyle("width", e + "px"), this.$.tuesday.applyStyle("width", e + "px"), this.$.wednesday.applyStyle("width", e + "px"), this.$.thursday.applyStyle("width", e + "px"), this.$.friday.applyStyle("width", e + "px"), this.$.saturday.applyStyle("width", e + "px");
},
renderCalendar: function() {
enyo.job("renderCalendar", enyo.bind(this, "_renderCalendar"), 100);
},
_renderCalendar: function() {
var e = Math.round(10 * this.getBounds().width / 7) / 10, t = new Date;
this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
var n = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 0), r = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
n.setDate(n.getDate() - r.getDay() + 1), n.getTime() === r.getTime() && n.setDate(n.getDate() - 7);
var i = 0, s;
while (i < 6) n.getDate() === this.value.getDate() && n.getMonth() === this.value.getMonth() && n.getFullYear() === this.value.getFullYear() ? s = "onyx-blue" : n.getDate() === t.getDate() && n.getMonth() === t.getMonth() && n.getFullYear() === t.getFullYear() ? s = "onyx-affirmative" : n.getMonth() !== r.getMonth() ? s = "onyx-dark" : s = "", this.$["row" + i + "col" + n.getDay()].applyStyle("width", e + "px"), this.$["row" + i + "col" + n.getDay()].removeClass("onyx-affirmative"), this.$["row" + i + "col" + n.getDay()].removeClass("onyx-blue"), this.$["row" + i + "col" + n.getDay()].removeClass("onyx-dark"), this.$["row" + i + "col" + n.getDay()].addClass(s), this.$["row" + i + "col" + n.getDay()].setContent(n.getDate()), this.$["row" + i + "col" + n.getDay()].ts = n.getTime(), n.setDate(n.getDate() + 1), n.getDay() === 0 && i < 6 && i++;
if (enyo.g11n) {
var o = new enyo.g11n.DateFmt(this.monthFormat);
this.$.monthLabel.setContent(o.format(r));
} else this.$.monthLabel.setContent(r.getMonth() + " - " + r.getFullYear());
},
monthBack: function() {
this.viewDate.setMonth(this.viewDate.getMonth() - 1), this.renderCalendar();
},
monthForward: function() {
this.viewDate.setMonth(this.viewDate.getMonth() + 1), this.renderCalendar();
},
resetDate: function() {
this.viewDate = new Date, this.value = new Date, this.renderCalendar(), this.doSelect({
date: this.value
});
},
dateHandler: function(e, t) {
var n = new Date;
n.setTime(e.ts), this.value.setDate(n.getDate()), this.value.setMonth(n.getMonth()), this.value.setFullYear(n.getFullYear()), this.value.getMonth() != this.viewDate.getMonth() && (this.viewDate = new Date(this.value.getFullYear(), this.value.getMonth(), 1)), this.doSelect({
date: this.value
}), this.renderCalendar();
}
});

// TimePicker.js

enyo.kind({
name: "GTS.TimePicker",
kind: "onyx.TimePicker",
classes: "gts-timepicker",
published: {
minuteInterval: 5,
label: ""
},
initDefaults: function() {
this.createComponent({
name: "label",
classes: "label"
}), this.inherited(arguments), enyo.job("minuteIntervalChanged", enyo.bind(this, "minuteIntervalChanged"), 100), enyo.job("labelChanged", enyo.bind(this, "labelChanged"), 100);
},
minuteIntervalChanged: function() {
this.$.minutePicker.destroyClientControls();
var e = Math.floor(this.value.getMinutes() / this.minuteInterval) * this.minuteInterval;
for (var t = 0; t <= 59; t += this.minuteInterval) this.$.minutePicker.createComponent({
content: t < 10 ? "0" + t : t,
value: t,
active: t == e
});
},
labelChanged: function() {
this.$.label.setContent(this.label);
}
});

// DecimalInput.js

enyo.kind({
name: "GTS.DecimalInput",
kind: "Input",
classes: "gts-decimal-input",
deleteAction: !1,
oldType: "",
published: {
type: "number",
placeholder: "0.00",
min: 0,
max: !1,
step: !0,
precision: 2,
atm: !1,
selectAllOnFocus: !1
},
handlers: {
onkeypress: "filterInput",
oninput: "inputValueUpdated",
onchange: "inputValueChanged",
onfocus: "inputFocused",
onblur: "inputBlurred"
},
rendered: function() {
this.inherited(arguments), this.minChanged(), this.maxChanged(), this.precisionChanged(), this.inputBlurred();
},
minChanged: function() {
this.setAttribute("min", this.min);
},
maxChanged: function() {
this.max !== !1 && this.setAttribute("max", this.max);
},
stepChanged: function() {
this.precisionChanged();
},
precisionChanged: function() {
if (!this.step) {
this.setAttribute("step", null);
return;
}
var e = "0.";
if (this.precision <= 0) e = "1"; else {
for (var t = 0; t < this.precision - 1; t++) e += "0";
e += "1";
}
this.setAttribute("step", e);
},
filterInput: function(e, t) {
!(t.keyCode >= 48 && t.keyCode <= 57) && t.keyCode !== 46 && t.preventDefault();
},
inputValueUpdated: function(e, t) {
if (this.atm) {
var n = this.getValue();
n = n.replace(/[^0-9]/g, ""), n = n.replace(/^0*/, ""), n = parseInt(n) / Math.pow(10, this.precision), isNaN(n) && (n = 0), n = n.toFixed(this.precision), this.setValue(n);
var r = this.hasNode();
if (r) {
var i = n.length;
enyo.asyncMethod(r, r.setSelectionRange, i, i);
}
}
},
inputValueChanged: function(e, t) {
var n = this.getValueAsNumber();
this.max !== !1 && n > this.max ? n = this.max : n < this.min && (n = this.min), this.setValue(n);
},
inputFocused: function(e, t) {
this.oldType === "number" && this.setType(this.oldType), this.selectAllOnFocus && this.hasNode() && this.hasNode().setSelectionRange(0, this.getValue().length);
},
inputBlurred: function(e, t) {
this.oldType = this.type, this.oldType === "number" && this.setType("text");
},
getValueAsNumber: function() {
var e = this.getValue().replace(/^\s\s*/, "").replace(/\s\s*$/, "").replace(/[^0-9\.]/g, "");
return e = parseFloat(e, 10).toFixed(this.precision), isNaN(e) && (e = 0), e;
}
});

// ConfirmDialog.js

enyo.kind({
name: "gts.ConfirmDialog",
kind: "onyx.Popup",
classes: "gts-confirm-dialog",
baseButtonClasses: "",
published: {
title: "",
message: "",
confirmText: "confirm",
confirmClass: "onyx-affirmative",
cancelText: "cancel",
cancelClass: "onyx-negative",
centered: !0,
floating: !0,
modal: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1
},
events: {
onCancel: "",
onConfirm: ""
},
components: [ {
name: "title",
classes: "title-wrapper"
}, {
name: "message",
classes: "message-wrapper"
}, {
classes: "button-wrapper",
components: [ {
name: "cancelButton",
kind: "onyx.Button",
ontap: "cancel",
showing: !1
}, {
name: "confirmButton",
kind: "onyx.Button",
ontap: "confirm"
} ]
} ],
rendered: function() {
this.inherited(arguments), this.baseButtonClasses = this.$.confirmButton.getClassAttribute(), this.titleChanged(), this.messageChanged(), this.confirmTextChanged(), this.cancelTextChanged(), this.confirmClassChanged(), this.cancelClassChanged();
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
messageChanged: function() {
this.$.message.setContent(this.message);
},
confirmTextChanged: function() {
this.$.confirmButton.setContent(this.confirmText);
},
confirmClassChanged: function() {
this.$.confirmButton.setClassAttribute(this.baseButtonClasses + " " + this.confirmClass);
},
cancelTextChanged: function() {
this.$.cancelButton.setContent(this.cancelText), this.cancelText.length === 0 ? this.$.cancelButton.hide() : this.$.cancelButton.show();
},
cancelClassChanged: function() {
this.$.cancelButton.setClassAttribute(this.baseButtonClasses + " " + this.cancelClass);
},
cancel: function(e, t) {
this.doCancel(t), this.hide();
},
confirm: function(e, t) {
this.doConfirm(t), this.hide();
}
});

// ProgressDialog.js

enyo.kind({
name: "GTS.ProgressDialog",
kind: "onyx.Popup",
classes: "gts-progress-dialog",
published: {
title: "",
message: "",
progress: "",
progressBarClasses: "",
min: 0,
max: 100,
showStripes: !1,
animateStripes: !1,
animateProgress: !1,
cancelText: "",
cancelClass: "onyx-negative",
centered: !0,
floating: !0,
modal: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1
},
events: {
onCancel: ""
},
components: [ {
name: "title",
classes: "title-wrapper"
}, {
name: "message",
classes: "message-wrapper",
allowHtml: !0
}, {
name: "progressBar",
kind: "onyx.ProgressBar"
}, {
classes: "button-wrapper",
components: [ {
name: "cancelButton",
kind: "onyx.Button",
ontap: "cancel",
showing: !1
} ]
} ],
rendered: function() {
this.inherited(arguments), this.baseButtonClasses = this.$.cancelButton.getClassAttribute(), this.titleChanged(), this.messageChanged(), this.progressChanged(), this.progressBarClassesChanged(), this.minChanged(), this.maxChanged(), this.showStripesChanged(), this.animateStripesChanged(), this.cancelTextChanged(), this.cancelClassChanged();
},
show: function(e) {
this.inherited(arguments);
for (property in e) {
property = property.replace(/\W/g, "");
var t = "set" + property.charAt(0).toUpperCase() + property.slice(1);
enyo.isFunction(this[t]) && this[t](e[property]);
}
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
messageChanged: function() {
this.$.message.setContent(this.message), this.message.length === 0 ? this.$.message.hide() : this.$.message.show();
},
progressChanged: function() {
this.animateProgress ? this.$.progressBar.animateProgressTo(this.progress) : this.$.progressBar.setProgress(this.progress);
},
progressBarClassesChanged: function() {
this.$.progressBar.setBarClasses(this.progressBarClasses);
},
minChanged: function() {
this.$.progressBar.setMin(this.min);
},
maxChanged: function() {
this.$.progressBar.setMax(this.max);
},
showStripesChanged: function() {
this.$.progressBar.setShowStripes(this.showStripes);
},
animateStripesChanged: function() {
this.$.progressBar.setAnimateStripes(this.animateStripes);
},
cancelTextChanged: function() {
this.$.cancelButton.setContent(this.cancelText), this.cancelText.length === 0 ? this.$.cancelButton.hide() : this.$.cancelButton.show();
},
cancelClassChanged: function() {
this.$.cancelButton.setClassAttribute(this.baseButtonClasses + " " + this.cancelClass);
},
cancel: function(e, t) {
this.doCancel(t), this.hide();
}
});

// AutoComplete.js

enyo.kind({
name: "GTS.AutoComplete",
kind: "onyx.InputDecorator",
classes: "gts-autocomplete",
active: !1,
searchValues: [],
published: {
enabled: !0,
values: "",
limit: 50,
delay: 200,
icon: "assets/search.png",
zIndex: !1,
allowDirty: !0
},
events: {
onDataRequested: "",
onInputChanged: "",
onValueSelected: ""
},
components: [ {
name: "options",
kind: "onyx.Menu",
floating: !0
}, {
name: "icon",
classes: "search-icon"
} ],
handlers: {
oninput: "inputChanged",
onSelect: "itemSelected"
},
rendered: function() {
this.inherited(arguments), this.enabledChanged(), this.iconChanged(), this.zIndexChanged();
},
enabledChanged: function() {
this.iconChanged();
},
iconChanged: function() {
this.$.icon.applyStyle("background-image", this.icon), this.$.icon.setShowing(this.enabled && this.icon != "");
},
zIndexChanged: function() {
this.zIndex !== !1 ? this.$.options.applyStyle("z-index", this.zIndex) : this.$.options.applyStyle("z-index", null);
},
inputChanged: function(e, t) {
if (!this.enabled) return;
this.inputField = this.inputField || t.originator, enyo.job(null, enyo.bind(this, "fireInputChanged"), this.delay);
},
fireInputChanged: function() {
var e = this.inputField.getValue();
this.doInputChanged({
value: this.inputField.getValue()
});
if (e.length <= 0) {
this.waterfall("onRequestHideMenu", {
activator: this
}), this.searchValues.slice(0, 0);
return;
}
this.searchValues.push(e), this.doDataRequested({
value: this.inputField.getValue(),
limit: this.limit
});
},
valuesChanged: function() {
var e = this.inputField.getValue(), t = this.searchValues.length;
if (t <= 0 || this.searchValues.indexOf(e) != t - 1) return;
this.searchValues.slice(0, 0), this.values = this.values.slice(0, this.limit);
if (!this.values || this.values.length === 0) {
this.waterfall("onRequestHideMenu", {
activator: this
});
return;
}
this.$.options.destroyClientControls();
var n = [];
for (var r = 0; r < this.values.length; r++) n.push({
content: this.values[r],
index: r,
allowHtml: !0
});
this.$.options.createComponents(n), this.$.options.render(), this.waterfall("onRequestShowMenu", {
activator: this
});
},
itemSelected: function(e, t) {
t.content && t.content.length > 0 && (t.content = this.dirtyString(t.content), this.inputField.setValue(t.content)), this.doValueSelected(enyo.mixin(t, {
value: this.inputField.getValue()
}));
},
dirtyString: function(e) {
if (!this.allowDirty) return e;
var t = [ /&amp;/g, /&quot;/g, /$lt;/g, /&gt;/g, /&rsquo;/g, /&nbsp;/g ], n = [ "&", '"', "<", ">", "'", " " ];
for (var r = 0; r < n.length; r++) e = e.replace(t[r], n[r]);
return e;
}
});

// Item.js

enyo.kind({
name: "GTS.Item",
kind: "onyx.Item",
classes: "gts-item",
published: {
holdHighlight: !1,
tapHighlight: !0,
tapClass: "gts-pulse",
highlightClass: "onyx-highlight"
},
preventTapDisplayTimer: 0,
handlers: {
ontap: "startTap",
onhold: "hold",
onrelease: "release"
},
startTap: function(e, t) {
if (this.preventTapDisplayTimer >= (new Date).getTime() - 50) return !0;
this.tapHighlight && (onyx.Item.addRemoveFlyweightClass(this.controlParent || this, this.tapClass, !0, t), enyo.job("endTap", enyo.bind(this, this.endTap, e, t), 250));
},
endTap: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, this.tapClass, !1, t);
},
hold: function(e, t) {
this.holdHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, this.highlightClass, !0, t);
},
release: function(e, t) {
this.preventTapDisplayTimer = (new Date).getTime(), this.holdHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, this.highlightClass, !1, t);
}
});

// private.js

enyo.kind({
name: "private.gapi",
kind: "enyo.Component",
apiKey: "AIzaSyBOKT9NrmlBVx4RFPk2p3c5ee5cHMvs8Lc",
installedClientId: "933238428058.apps.googleusercontent.com",
installedClientSecret: "AmttUjVelS_L4X46GCltvF94",
clientId: "933238428058-smvr0gsdpbpiuo2q59gcll54rau9ivus.apps.googleusercontent.com",
clientSecret: "mqgBXW7pTj1kUvpGswmD7miK",
getApiKey: function() {
return this.apiKey;
},
getClientId: function() {
return window.device && window.plugins.childBrowser && (enyo.platform.android || enyo.platform.androidChrome) ? this.installedClientId : this.clientId;
},
getClientSecret: function() {
return window.device && window.plugins.childBrowser && (enyo.platform.android || enyo.platform.androidChrome) ? this.installedClientSecret : this.clientSecret;
}
});

// balanceMenu.js

enyo.kind({
name: "Checkbook.balanceMenu",
kind: "onyx.MenuDecorator",
published: {
choices: [],
value: ""
},
events: {
onChange: ""
},
components: [ {
name: "display"
}, {
name: "menu",
kind: "GTS.SelectedMenu",
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
style: "min-width: 200px;",
onChange: "balanceSelectionChanged"
} ],
handlers: {
onSelect: "preventEvent"
},
choicesChanged: function() {
if (enyo.isArray(this.choices)) {
var e = [];
for (var t = 0; t < this.choices.length; t++) {
var n = "neutralBalance";
Math.round(this.choices[t].balance * 100) / 100 > 0 ? n = "positiveBalance" : Math.round(this.choices[t].balance * 100) / 100 < 0 && (n = "negativeBalance"), e.push({
value: this.choices[t].value,
classes: "h-box",
components: [ {
content: this.choices[t].content,
classes: "margin-right box-flex-1"
}, {
content: formatAmount(this.choices[t].balance),
classes: n
} ]
});
}
this.$.menu.setChoices(e), this.valueChanged();
}
},
valueChanged: function() {
this.$.menu.setValue(this.value);
var e = 0;
for (var t = 0; t < this.choices.length; t++) this.choices[t].value === this.value && (e = this.choices[t].balance);
this.$.display.setContent(formatAmount(e)), this.$.display.addRemoveClass("positiveBalanceLight", e > 0), this.$.display.addRemoveClass("negativeBalanceLight", e < 0), this.$.display.addRemoveClass("neutralBalanceLight", e == 0);
},
balanceSelectionChanged: function(e, t) {
return this.value = t.value, this.valueChanged(), this.doChange(t), !0;
},
preventEvent: function() {
return !0;
}
});

// defaultData.js

function getDBArgs() {
var e = {
database: "ext:checkbook-database",
version: "1",
name: "Checkbook DB",
estimatedSize: 5242880,
debug: !1
};
if (enyo.platform.android || enyo.platform.androidChrome) window.openDatabase = window.sqlitePlugin.openDatabase;
return e;
}

var defaultAccountCategories = [ {
name: "Checking",
catOrder: 1,
icon: "checkbook_1.png",
color: "green"
}, {
name: "Savings",
catOrder: 2,
icon: "safe_1.png",
color: "yellow"
}, {
name: "Credit Card",
catOrder: 3,
icon: "credit_card_3.png",
color: "red"
}, {
name: "Other",
catOrder: 4,
icon: "coins_3.png",
color: "black"
} ], appIcons = [ {
icon: "assets/cash_1.png",
value: "cash_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/cash_1.png"
} ]
}, {
icon: "assets/cash_2.png",
value: "cash_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/cash_2.png"
} ]
}, {
icon: "assets/cash_3.png",
value: "cash_3.png",
components: [ {
kind: "enyo.Image",
src: "assets/cash_3.png"
} ]
}, {
icon: "assets/cash_4.png",
value: "cash_4.png",
components: [ {
kind: "enyo.Image",
src: "assets/cash_4.png"
} ]
}, {
icon: "assets/cash_5.png",
value: "cash_5.png",
components: [ {
kind: "enyo.Image",
src: "assets/cash_5.png"
} ]
}, {
icon: "assets/checkbook_1.png",
value: "checkbook_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/checkbook_1.png"
} ]
}, {
icon: "assets/checkbook_2.png",
value: "checkbook_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/checkbook_2.png"
} ]
}, {
icon: "assets/coins_1.png",
value: "coins_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/coins_1.png"
} ]
}, {
icon: "assets/coins_2.png",
value: "coins_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/coins_2.png"
} ]
}, {
icon: "assets/coins_3.png",
value: "coins_3.png",
components: [ {
kind: "enyo.Image",
src: "assets/coins_3.png"
} ]
}, {
icon: "assets/coins_4.png",
value: "coins_4.png",
components: [ {
kind: "enyo.Image",
src: "assets/coins_4.png"
} ]
}, {
icon: "assets/credit_card_1.png",
value: "credit_card_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/credit_card_1.png"
} ]
}, {
icon: "assets/credit_card_2.png",
value: "credit_card_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/credit_card_2.png"
} ]
}, {
icon: "assets/credit_card_3.png",
value: "credit_card_3.png",
components: [ {
kind: "enyo.Image",
src: "assets/credit_card_3.png"
} ]
}, {
icon: "assets/dollar_sign_1.png",
value: "dollar_sign_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/dollar_sign_1.png"
} ]
}, {
icon: "assets/dollar_sign_2.png",
value: "dollar_sign_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/dollar_sign_2.png"
} ]
}, {
icon: "assets/dollar_sign_3.png",
value: "dollar_sign_3.png",
components: [ {
kind: "enyo.Image",
src: "assets/dollar_sign_3.png"
} ]
}, {
icon: "assets/echeck.png",
value: "echeck.png",
components: [ {
kind: "enyo.Image",
src: "assets/echeck.png"
} ]
}, {
icon: "assets/icon_1.png",
value: "icon_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/icon_1.png"
} ]
}, {
icon: "assets/icon_2.png",
value: "icon_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/icon_2.png"
} ]
}, {
icon: "assets/icon_3.png",
value: "icon_3.png",
components: [ {
kind: "enyo.Image",
src: "assets/icon_3.png"
} ]
}, {
icon: "assets/icon_4.png",
value: "icon_4.png",
components: [ {
kind: "enyo.Image",
src: "assets/icon_4.png"
} ]
}, {
icon: "assets/jewel_1.png",
value: "jewel_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/jewel_1.png"
} ]
}, {
icon: "assets/jewel_2.png",
value: "jewel_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/jewel_2.png"
} ]
}, {
icon: "assets/money_bag_1.png",
value: "money_bag_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/money_bag_1.png"
} ]
}, {
icon: "assets/money_bag_2.png",
value: "money_bag_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/money_bag_2.png"
} ]
}, {
icon: "assets/money_bag_3.png",
value: "money_bag_3.png",
components: [ {
kind: "enyo.Image",
src: "assets/money_bag_3.png"
} ]
}, {
icon: "assets/money_bag_4.png",
value: "money_bag_4.png",
components: [ {
kind: "enyo.Image",
src: "assets/money_bag_4.png"
} ]
}, {
icon: "assets/padlock_2.png",
value: "padlock_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/padlock_2.png"
} ]
}, {
icon: "assets/safe_1.png",
value: "safe_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/safe_1.png"
} ]
}, {
icon: "assets/safe_2.png",
value: "safe_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/safe_2.png"
} ]
}, {
icon: "assets/transfer_1.png",
value: "transfer_1.png",
components: [ {
kind: "enyo.Image",
src: "assets/transfer_1.png"
} ]
}, {
icon: "assets/transfer_2.png",
value: "transfer_2.png",
components: [ {
kind: "enyo.Image",
src: "assets/transfer_2.png"
} ]
}, {
icon: "assets/transfer_4.png",
value: "transfer_4.png",
components: [ {
kind: "enyo.Image",
src: "assets/transfer_4.png"
} ]
} ], appColors = [ {
content: "Black",
classes: "custom-background black legend",
name: "black"
}, {
content: "Blue",
classes: "custom-background blue legend",
name: "blue"
}, {
content: "Green",
classes: "custom-background green legend",
name: "green"
}, {
content: "Orange",
classes: "custom-background orange legend",
name: "orange"
}, {
content: "Pink",
classes: "custom-background pink legend",
name: "pink"
}, {
content: "Purple",
classes: "custom-background purple legend",
name: "purple"
}, {
content: "Red",
classes: "custom-background red legend",
name: "red"
}, {
content: "Teal",
classes: "custom-background teal legend",
name: "teal"
}, {
content: "Yellow",
classes: "custom-background yellow legend",
name: "yellow"
} ], defaultExpenseCategories = [ {
genCat: "Auto & Transport",
specCat: "Auto Insurance"
}, {
genCat: "Auto & Transport",
specCat: "Auto Payment"
}, {
genCat: "Auto & Transport",
specCat: "Gas & Fuel"
}, {
genCat: "Auto & Transport",
specCat: "Parking"
}, {
genCat: "Auto & Transport",
specCat: "Public Transportation"
}, {
genCat: "Auto & Transport",
specCat: "Service & Parts"
}, {
genCat: "Auto & Transport",
specCat: "Car Wash"
}, {
genCat: "Bills & Utilities",
specCat: "Home Phone"
}, {
genCat: "Bills & Utilities",
specCat: "Internet"
}, {
genCat: "Bills & Utilities",
specCat: "Mobile Phone"
}, {
genCat: "Bills & Utilities",
specCat: "Television"
}, {
genCat: "Bills & Utilities",
specCat: "Utilities"
}, {
genCat: "Business Services",
specCat: "Advertising"
}, {
genCat: "Business Services",
specCat: "Legal"
}, {
genCat: "Business Services",
specCat: "Office Supplies"
}, {
genCat: "Business Services",
specCat: "Printing"
}, {
genCat: "Business Services",
specCat: "Shipping"
}, {
genCat: "Education",
specCat: "Books & Supplies"
}, {
genCat: "Education",
specCat: "Student Loan"
}, {
genCat: "Education",
specCat: "Tuition"
}, {
genCat: "Entertainment",
specCat: "Amusement"
}, {
genCat: "Entertainment",
specCat: "Arts"
}, {
genCat: "Entertainment",
specCat: "Movies & DVDs"
}, {
genCat: "Entertainment",
specCat: "Music"
}, {
genCat: "Entertainment",
specCat: "Newspapers & Magazines"
}, {
genCat: "Fees & Charges",
specCat: "ATM Fee"
}, {
genCat: "Fees & Charges",
specCat: "Bank Fee"
}, {
genCat: "Fees & Charges",
specCat: "Finance Charge"
}, {
genCat: "Fees & Charges",
specCat: "Late Fee"
}, {
genCat: "Fees & Charges",
specCat: "Service Fee"
}, {
genCat: "Financial",
specCat: "Financial Advisor"
}, {
genCat: "Financial",
specCat: "Life Insurance"
}, {
genCat: "Food & Dining",
specCat: "Alcohol & Bars"
}, {
genCat: "Food & Dining",
specCat: "Coffee Shops"
}, {
genCat: "Food & Dining",
specCat: "Fast Food"
}, {
genCat: "Food & Dining",
specCat: "Groceries"
}, {
genCat: "Food & Dining",
specCat: "Restaurants"
}, {
genCat: "Gifts & Donations",
specCat: "Charity"
}, {
genCat: "Gifts & Donations",
specCat: "Gift"
}, {
genCat: "Health & Fitness",
specCat: "Dentist"
}, {
genCat: "Health & Fitness",
specCat: "Doctor"
}, {
genCat: "Health & Fitness",
specCat: "Eyecare"
}, {
genCat: "Health & Fitness",
specCat: "Gym"
}, {
genCat: "Health & Fitness",
specCat: "Health Insurance"
}, {
genCat: "Health & Fitness",
specCat: "Pharmacy"
}, {
genCat: "Health & Fitness",
specCat: "Sports"
}, {
genCat: "Home",
specCat: "Furnishings"
}, {
genCat: "Home",
specCat: "Home Improvement"
}, {
genCat: "Home",
specCat: "Home Insurance"
}, {
genCat: "Home",
specCat: "Home Services"
}, {
genCat: "Home",
specCat: "Home Supplies"
}, {
genCat: "Home",
specCat: "Lawn & Garden"
}, {
genCat: "Home",
specCat: "Mortgage & Rent"
}, {
genCat: "Income",
specCat: "Bonus"
}, {
genCat: "Income",
specCat: "Paycheck"
}, {
genCat: "Income",
specCat: "Reimbursement"
}, {
genCat: "Income",
specCat: "Rental Income"
}, {
genCat: "Income",
specCat: "Returned Purchase"
}, {
genCat: "Kids",
specCat: "Allowance"
}, {
genCat: "Kids",
specCat: "Baby Supplies"
}, {
genCat: "Kids",
specCat: "Babysitter & Daycare"
}, {
genCat: "Kids",
specCat: "Child Support"
}, {
genCat: "Kids",
specCat: "Kids Activities"
}, {
genCat: "Kids",
specCat: "Toys"
}, {
genCat: "Personal Care",
specCat: "Hair"
}, {
genCat: "Personal Care",
specCat: "Laundry"
}, {
genCat: "Personal Care",
specCat: "Spa & Massage"
}, {
genCat: "Pets",
specCat: "Pet Food & Supplies"
}, {
genCat: "Pets",
specCat: "Pet Grooming"
}, {
genCat: "Pets",
specCat: "Veterinary"
}, {
genCat: "Shopping",
specCat: "Books"
}, {
genCat: "Shopping",
specCat: "Clothing"
}, {
genCat: "Shopping",
specCat: "Electronics & Software"
}, {
genCat: "Shopping",
specCat: "Hobbies"
}, {
genCat: "Shopping",
specCat: "Sporting Goods"
}, {
genCat: "Taxes",
specCat: "Federal Tax"
}, {
genCat: "Taxes",
specCat: "Local Tax"
}, {
genCat: "Taxes",
specCat: "Property Tax"
}, {
genCat: "Taxes",
specCat: "Sales Tax"
}, {
genCat: "Taxes",
specCat: "State Tax"
}, {
genCat: "Transfer",
specCat: "Credit Card Payment"
}, {
genCat: "Travel",
specCat: "Air Travel"
}, {
genCat: "Travel",
specCat: "Hotel"
}, {
genCat: "Travel",
specCat: "Rental Car & Taxi"
}, {
genCat: "Travel",
specCat: "Vacation"
}, {
genCat: "Uncategorized",
specCat: "Cash & ATM"
}, {
genCat: "Uncategorized",
specCat: "Check"
}, {
genCat: "Uncategorized",
specCat: "Other"
} ];

// encryption.js

enyo.kind({
name: "Checkbook.encryption",
kind: enyo.Component,
encryptString: function(e, t) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("prefs", [ "spike" ], null), {
onSuccess: enyo.bind(this, this.encryptStringSuccess, e, t),
onError: enyo.bind(this, this.encryptStringFailure, e, t)
});
},
encryptStringSuccess: function(e, t, n) {
enyo.isFunction(t) && (n.length > 0 && enyo.isString(e) && e.length > 0 ? t(CryptoJS.AES.encrypt(e, n[0].spike) + "") : t(""));
},
encryptStringFailure: function(e, t, n) {
enyo.isFunction(t) && t("");
},
decryptString: function(e, t) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("prefs", [ "spike" ], null), {
onSuccess: enyo.bind(this, this.decryptStringSuccess, e, t),
onError: enyo.bind(this, this.decryptStringFailure, e, t)
});
},
decryptStringSuccess: function(e, t, n) {
enyo.isFunction(t) && (n.length > 0 && enyo.isString(e) && e.length > 0 ? t(CryptoJS.AES.decrypt(e, n[0].spike).toString(CryptoJS.enc.Utf8)) : t(""));
},
decryptStringFailure: function(e, t, n) {
enyo.isFunction(t) && t("");
}
});

// login.js

enyo.kind({
name: "Checkbook.login",
kind: "onyx.Popup",
classes: "login-system small-popup",
centered: !0,
floating: !0,
modal: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1,
pin: "",
errorCount: 0,
options: {},
components: [ {
kind: "enyo.FittableColumns",
classes: "text-middle margin-bottom",
noStretch: !0,
components: [ {
name: "title",
content: "",
classes: "bigger text-left margin-half-right",
fit: !0
}, {
kind: "onyx.Button",
content: "X",
ontap: "badPin",
classes: "onyx-blue small-padding"
} ]
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
classes: "onyx-focused margin-bottom",
alwaysLooksFocused: !0,
components: [ {
name: "pin",
kind: "onyx.Input",
type: "password",
placeholder: "Enter PIN using key pad.",
fit: !0,
disabled: !0
}, {
content: "pin code",
classes: "small label"
} ]
} ]
}, {
name: "errorMessage",
kind: "GTS.InlineNotification",
type: "error",
content: "",
showing: !1
}, {
classes: "margin-bottom pin-pad",
components: [ {
classes: "margin-half-bottom",
components: [ {
kind: "onyx.Button",
content: "1",
classes: "margin-half-right",
ontap: "padPressed"
}, {
kind: "onyx.Button",
content: "2",
classes: "margin-half-right",
ontap: "padPressed"
}, {
kind: "onyx.Button",
content: "3",
classes: "margin-half-right",
ontap: "padPressed"
} ]
}, {
classes: "margin-half-bottom",
components: [ {
kind: "onyx.Button",
content: "4",
classes: "margin-half-right",
ontap: "padPressed"
}, {
kind: "onyx.Button",
content: "5",
classes: "margin-half-right",
ontap: "padPressed"
}, {
kind: "onyx.Button",
content: "6",
classes: "margin-half-right",
ontap: "padPressed"
} ]
}, {
classes: "margin-half-bottom",
components: [ {
kind: "onyx.Button",
content: "7",
classes: "margin-half-right",
ontap: "padPressed"
}, {
kind: "onyx.Button",
content: "8",
classes: "margin-half-right",
ontap: "padPressed"
}, {
kind: "onyx.Button",
content: "9",
classes: "margin-half-right",
ontap: "padPressed"
} ]
}, {
classes: "margin-bottom",
components: [ {
content: " ",
classes: "dummy-button margin-half-right"
}, {
kind: "onyx.Button",
content: "0",
classes: "margin-half-right",
ontap: "padPressed"
}, {
name: "clear",
kind: "onyx.Button",
content: "Clear",
ontap: "padPressed"
} ]
}, {
classes: "text-center",
components: [ {
kind: "onyx.Button",
classes: "margin-right",
content: "Cancel",
ontap: "badPin"
}, {
kind: "onyx.Button",
classes: "onyx-affirmative",
content: "Confirm",
ontap: "checkPin"
} ]
} ]
}, {
name: "encryption",
kind: "Checkbook.encryption"
} ],
authUser: function(e, t, n) {
this.show(), this.$.title.setContent(e), this.$.pin.setValue(""), this.pin = t, this.options = n, this.errorCount = 0;
},
padPressed: function(e, t) {
var n = this.$.pin.getValue();
e.name && e.name === "clear" ? this.$.pin.setValue("") : n.length < 10 && this.$.pin.setValue(n + e.content);
},
checkPin: function() {
this.$.encryption.decryptString(this.pin, enyo.bind(this, this.checkPinHandler));
},
checkPinHandler: function(e) {
e != this.$["pin"].getValue() ? (this.errorCount++, this.$.errorMessage.show(), this.$.errorMessage.setContent("Invalid PIN.") + "<br />" + this.errorCount + " out of 5 attempts used.", this.$.pin.setValue(""), this.errorCount >= 5 && this.badPin()) : (this.hide(), this.$.errorMessage.hide(), enyo.isFunction(this.options.onSuccess) && this.options.onSuccess());
},
badPin: function() {
this.hide(), enyo.isFunction(this.options.onFailure) && this.options.onFailure();
}
});

// pinChangePopup.js

enyo.kind({
name: "Checkbook.pinChangePopup",
kind: "onyx.Popup",
classes: "small-popup",
centered: !0,
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1,
events: {
onFinish: ""
},
components: [ {
name: "title",
content: "Change PIN Code",
classes: "bigger"
}, {
classes: "padding-std light",
components: [ {
content: "Your pin may only contain numeric characters. (0-9)",
classes: "small bold padding-half-bottom"
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
components: [ {
name: "pin1",
kind: "onyx.Input",
type: "password",
placeholder: "10 characters max",
fit: !0,
oninput: "checkPin"
}, {
content: "pin code",
classes: "small label"
} ]
}, {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
components: [ {
name: "pin2",
kind: "onyx.Input",
type: "password",
placeholder: "10 characters max",
fit: !0,
oninput: "checkPin"
}, {
content: "confirm",
classes: "small label"
} ]
} ]
}, {
name: "errorMessageContainer",
layoutKind: "enyo.FittableColumnsLayout",
noStretch: !0,
showing: !1,
classes: "padding-half-top text-middle",
components: [ {
kind: "enyo.Image",
src: "assets/status_icons/warning.png",
style: "margin-right: 5px;"
}, {
name: "errorMessage",
style: "color: #d70000;",
content: "The code entered is invalid."
} ]
} ]
}, {
classes: "padding-std margin-half-top text-center",
components: [ {
kind: "onyx.Button",
classes: "margin-half-right",
content: "Cancel",
ontap: "doFinish"
}, {
kind: "onyx.Button",
classes: "onyx-affirmative margin-half-left",
content: "Change",
ontap: "updatePin"
} ]
} ],
show: function() {
this.inherited(arguments), this.$.pin1.focus();
},
checkPin: function(e, t) {
e.setValue(e.getValue().replace(/[^0-9]/, "").substr(0, 10));
},
updatePin: function() {
if (this.$.pin1.getValue() === "" || this.$.pin2.getValue() === "") {
this.$.errorMessage.setContent("The code entered is invalid."), this.$.errorMessageContainer.show();
return;
}
if (this.$.pin1.getValue() !== this.$.pin2.getValue()) {
this.$.errorMessage.setContent("The codes entered do not match."), this.$.errorMessageContainer.show();
return;
}
this.$.errorMessageContainer.hide(), this.doFinish({
value: this.$.pin1.getValue()
});
}
});

// sortOptionData.js

var accountSortOptions = [ {
content: "Custom Category",
value: 0,
query: "acctCatOrder, acctCategory COLLATE NOCASE, sect_order, acctName COLLATE NOCASE"
}, {
content: "Custom Account",
value: 1,
query: "sect_order, acctName COLLATE NOCASE, acctCatOrder, acctCategory COLLATE NOCASE"
}, {
content: "Alphabetical Name",
value: 2,
query: "acctName COLLATE NOCASE, acctCategory COLLATE NOCASE"
}, {
content: "Alphabetical Category",
value: 3,
query: "acctCategory COLLATE NOCASE, acctName COLLATE NOCASE"
} ], budgetSortOptions = [ {
content: "Custom",
value: 0,
query: "budgetOrder ASC, category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
}, {
content: "Alphabetical",
value: 1,
query: "category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
}, {
content: "Budget Remaining (Asc)",
value: 2,
query: "( spent / spending_limit ) ASC, category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
}, {
content: "Budget Remaining (Desc)",
value: 3,
query: "( spent / spending_limit ) DESC, category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
} ], transactionSortOptions = [], defaultAcctTrsnSortOptn = [ {
sortGroup: "Date",
groupOrder: 0,
label: "Newest to Oldest, Show Newest",
desc: "Sorts transactions from newest to oldest. Displays the newest transactions.",
qry: "date DESC, itemId DESC",
sortId: 1
}, {
sortGroup: "Date",
groupOrder: 0,
label: "Oldest to Newest, Show Oldest",
desc: "Sorts transactions from oldest to newest. Displays the oldest transactions.",
qry: "date ASC, itemId ASC",
sortId: 8
}, {
sortGroup: "Description",
groupOrder: 1,
label: "A-Z",
desc: "Sorts transactions from A to Z. Displays the newest transactions.",
qry: "desc COLLATE NOCASE ASC, itemId ASC",
sortId: 2
}, {
sortGroup: "Description",
groupOrder: 1,
label: "Z-A",
desc: "Sorts transactions from A to Z. Displays the newest transactions.",
qry: "desc COLLATE NOCASE DESC, itemId ASC",
sortId: 3
}, {
sortGroup: "Amount",
groupOrder: 2,
label: "Ascending",
desc: "Sorts transactions by amount, ascending. Displays the greatest expense.",
qry: "amount ASC, itemId ASC",
sortId: 4
}, {
sortGroup: "Amount",
groupOrder: 2,
label: "Descending",
desc: "Sorts transactions by amount, descending. Displays the greatest income.",
qry: "amount DESC, itemId ASC",
sortId: 5
}, {
sortGroup: "Status",
groupOrder: 3,
label: "Cleared first",
desc: "Sorts transactions by cleared status with Cleared transactions first. Transactions are then sorted by date from newest to oldest.",
qry: "cleared DESC, date ASC, itemId ASC",
sortId: 6
}, {
sortGroup: "Status",
groupOrder: 3,
label: "Pending first",
desc: "Sorts transactions by cleared status with Uncleared transactions first. Transactions are then sorted by date from newest to oldest.",
qry: "cleared ASC, date DESC, itemId ASC",
sortId: 7
}, {
sortGroup: "Check Number",
groupOrder: 4,
label: "Ascending Numbers",
desc: "Sorts transactions by check number. Displays the lowest numbered check first. Transactions without check numbers are sorted last.",
qry: "IFNULL( NULLIF( checkNum, '' ), ( SELECT IFNULL( MAX( checkNum ), 0 ) FROM transactions LIMIT 1 ) ) ASC, itemId ASC",
sortId: 9
}, {
sortGroup: "Check Number",
groupOrder: 4,
label: "Descending Numbers",
desc: "Sorts transactions by check number. Displays the highest numbered check first. Transactions without check numbers are sorted last.",
qry: "checkNum DESC, itemId ASC",
sortId: 10
} ];

// systemError.js

enyo.kind({
name: "Checkbook.systemError",
kind: "onyx.Popup",
classes: "small-popup",
centered: !0,
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1,
published: {
errTitle: "System Error",
mainMessage: "Something happend that should not have. Sorry about that.",
secondaryMessage: "",
errorIcon: "assets/status_icons/warning.png"
},
events: {
onFinish: ""
},
components: [ {
kind: "enyo.FittableColumns",
classes: "text-middle margin-half-bottom",
noStretch: !0,
components: [ {
name: "icon",
kind: "enyo.Image",
classes: "img-icon margin-half-right"
}, {
name: "title",
fit: !0,
classes: "bold"
}, {
kind: "onyx.Button",
content: "X",
ontap: "closeMe",
classes: "onyx-blue small-padding"
} ]
}, {
classes: "light padding-std",
components: [ {
name: "primaryMessage",
classes: "margin-half-bottom",
allowHtml: !0
}, {
name: "secondaryMessage",
classes: "smaller margin-half-bottom",
allowHtml: !0
} ]
}, {
classes: "text-right margin-half-top",
components: [ {
kind: "onyx.Button",
content: "Okay",
ontap: "closeMe"
} ]
} ],
set: function(e, t, n, r) {
enyo.isString(e) && (this.errTitle = e), enyo.isString(t) && (this.mainMessage = t), enyo.isString(n) && (this.secondaryMessage = n), enyo.isString(r) && (this.errorIcon = r);
},
load: function(e, t, n, r) {
this.set(e, t, n, r), this.show();
},
show: function() {
this.inherited(arguments), this.setUpDisplay();
},
setUpDisplay: function() {
this.titleChanged(), this.mainMessageChanged(), this.secondaryMessageChanged(), this.errorIconChanged(), this.reflow();
},
titleChanged: function() {
if (this.errTitle === "~|p2t|~") {
var e = "Critical error";
switch (Math.floor(Math.random() * 50)) {
case 0:
e = "I don't hate you";
break;
case 1:
e = "Hey, hey, hey";
break;
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
case 8:
case 9:
case 10:
case 11:
case 12:
case 13:
case 14:
e = "Malfunctioning";
break;
default:
}
this.$.title.setContent(e);
} else this.$.title.setContent(this.errTitle);
},
mainMessageChanged: function() {
this.$.primaryMessage.setContent(this.mainMessage);
},
secondaryMessageChanged: function() {
this.secondaryMessage === "~|mt|~" ? this.$.secondaryMessage.setContent("Checkbook will attempt to resume normal functions. If it does not, please restart the app.<br />If this error occurs again, please <a href='mailto:glitchtechscience@gmail.com?subject=Error: Checkbook&body=%0A%0AError Message: " + this.mainMessage + "'>contact us</a>.") : this.$.secondaryMessage.setContent(this.secondaryMessage);
},
errorIconChanged: function() {
this.$.icon.setSrc(this.errorIcon);
},
closeMe: function() {
this.doFinish();
}
});

// checkbook.js

enyo.kind({
name: "Checkbook.app",
kind: "enyo.Control",
components: [ {
name: "container",
layoutKind: "enyo.FittableRowsLayout",
classes: "enyo-fit",
showing: !1,
components: [ {
name: "menubar",
kind: "onyx.Toolbar",
classes: "padding-none",
components: [ {
name: "appMenu",
kind: "onyx.MenuDecorator",
components: [ {
name: "appMenuButton",
kind: "onyx.Button",
components: [ {
kind: "enyo.Image",
src: "assets/favicon.ico"
}, {
content: "Checkbook"
} ]
}, {
kind: "onyx.Menu",
showOnTop: !0,
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
components: [ {
content: "Preferences",
ontap: "openPreferences"
}, {
classes: "onyx-menu-divider"
}, {
content: "Import Data",
ontap: "openImport"
}, {
content: "Export Data",
ontap: "openExport"
}, {
showing: !1,
classes: "onyx-menu-divider"
}, {
showing: !1,
content: "Search (NYI)",
ontap: "openSearch"
}, {
showing: !1,
content: "Budget (NYI)",
ontap: "openBudget"
}, {
showing: !1,
content: "Reports (NYI)",
ontap: "openReport"
}, {
showing: !1,
classes: "onyx-menu-divider"
}, {
showing: !1,
content: "Report Bug (NYI)",
ontap: "errorReport"
}, {
classes: "onyx-menu-divider"
}, {
content: "About",
ontap: "showAbout"
} ]
} ]
} ]
}, {
name: "mainViews",
kind: "Panels",
fit: !0,
animate: !1,
draggable: !1,
classes: "app-panels",
arrangerKind: "CollapsingArranger",
components: [ {
name: "destroyChild",
content: "I am a dummy component so the panel structure doesn't crash on load."
} ]
} ]
}, {
name: "splash",
kind: "Checkbook.splash",
onFinish: "splashFinisher"
}, {
name: "about",
kind: "Checkbook.about",
onFinish: "closePopup"
}, {
name: "criticalError",
kind: "Checkbook.systemError",
errTitle: "~|p2t|~",
errMessage: "",
errMessage2: "~|mt|~",
onFinish: "closePopup"
}, {
name: "security",
kind: "Checkbook.login"
}, {
kind: "Signals",
viewAccount: "viewAccount",
modifyAccount: "showPanePopup",
modifyTransaction: "showPanePopup",
showBudget: "openBudget",
showSearch: "openSearch",
showReport: "openReport",
showPanePopup: "showPanePopup",
onbackbutton: "backHandler",
onmenubutton: "menuHandler",
onsearchbutton: "searchHandler",
onkeydown: "keyboardHandler"
} ],
appReady: !1,
paneStack: [],
rendered: function() {
this.inherited(arguments), enyo.Scroller.touchScrolling = !0, enyo.dispatcher.listen(document, "backbutton"), enyo.dispatcher.listen(document, "menubutton"), enyo.dispatcher.listen(document, "searchbutton"), this.$.splash.show(), (enyo.platform.android || enyo.platform.androidChrome) && this.$.menubar.hide();
},
keyboardHandler: function(e, t) {
if (!this.appReady) return;
if (t.which === 18) return enyo.Signals.send("onmenubutton"), !0;
if (t.which === 27) return enyo.Signals.send("onbackbutton"), !0;
},
menuHandler: function() {
if (!this.appReady) return;
return this.paneStack.length <= 0 && (this.$.appMenuButton.getActive() === !0 ? this.hideAppMenu() : this.showAppMenu()), !0;
},
showAppMenu: function() {
this.$.appMenuButton.waterfall("ontap", "ontap", this);
},
hideAppMenu: function() {
this.$.appMenuButton.setActive(!1), this.$.appMenu.requestHideMenu();
},
backHandler: function() {
if (!this.appReady) return;
return this.$.appMenu.menuActive === !0 ? this.hideAppMenu() : this.paneStack.length > 0 ? this.$[this.paneStack[this.paneStack.length - 1]].doFinish() : this.$.mainViews.getIndex() > 0 ? this.$.mainViews.previous() : enyo.platform.android || enyo.platform.androidChrome ? this.$.exitConfirmation ? this.exitConfirmationHandler() : (this.createComponent({
name: "exitConfirmation",
kind: "gts.ConfirmDialog",
title: "Exit Checkbook",
message: "Are you sure you want to close Checkbook?",
confirmText: "Yes",
cancelText: "No",
modal: !1,
onConfirm: "exitConfirmationHandler",
onCancel: "exitConfirmationClose"
}), this.$.exitConfirmation.show()) : this.log("backHandler: no action possible"), !0;
},
exitConfirmationClose: function() {
this.$.exitConfirmation.hide(), this.$.exitConfirmation.destroy();
},
exitConfirmationHandler: function() {
this.exitConfirmationClose(), navigator.app.exitApp();
},
searchHandler: function(e) {
if (!this.appReady) return;
return this.log("NYI"), !0;
},
splashFinisher: function() {
this.notificationType = !this.$.splash.getFirstRun(), Checkbook.globals.security = this.$.security, Checkbook.globals.prefs["useCode"] != 0 ? Checkbook.globals.security.authUser("Main Program PIN Code", Checkbook.globals.prefs.code, {
onSuccess: enyo.bind(this, this.loadCheckbook),
onFailure: enyo.bind(this, this.appAuthFailure)
}) : this.loadCheckbook();
},
appAuthFailure: function() {
this.log("App Auth Failure"), window.close();
},
loadCheckbook: function() {
this.$.destroyChild.destroy(), this.$.mainViews.createComponents([ {
name: "accounts",
kind: "Checkbook.accounts.view"
}, {
name: "transactions",
kind: "Checkbook.transactions.view"
} ], {
owner: this
}), this.$.mainViews.render(), this.$.container.show(), this.$.container.render(), Checkbook.globals.criticalError = this.$.criticalError, Checkbook.globals.accountManager = new Checkbook.accounts.manager, Checkbook.globals.transactionManager = new Checkbook.transactions.manager, Checkbook.globals.transactionCategoryManager = new Checkbook.transactionCategory.manager, Checkbook.globals.transactionManager.$.recurrence.updateSeriesTransactions(-1, {
onSuccess: enyo.bind(this, this.loadCheckbookStage2)
});
},
loadCheckbookStage2: function() {
this.$.splash && this.$.splash.$.message.setContent("Loading account information..."), Checkbook.globals.accountManager.fetchDefaultAccount({
onSuccess: enyo.bind(this, this.loadCheckbookStage3)
});
},
loadCheckbookStage3: function(e) {
e && (e.acctLocked === 1 ? Checkbook.globals.security.authUser(e.acctName + " " + "PIN Code", e.lockedCode, {
onSuccess: function() {
enyo.Signals.send("viewAccount", {
account: e
});
}
}) : enyo.Signals.send("viewAccount", {
account: e
})), enyo.Signals.send("accountChanged");
if (this.notificationType !== !0 || Checkbook.globals.prefs["updateCheckNotification"] != 1) if (this.notificationType === !1) {
var t = enyo.fetchAppInfo();
Checkbook.globals.criticalError.load("Welcome to " + t.title, "If you have any questions, email <a href='mailto:" + t.vendoremail + "?subject=" + t.title + " Support'>" + t.vendoremail + "</a>.", "", "assets/icon_1_32x32.png"), enyo.asyncMethod(Checkbook.globals.criticalError, Checkbook.globals.criticalError.set, "~|p2t|~", "", "~|mt|~", "assets/status_icons/warning.png");
}
this.appReady = !0, this.$.splash && (this.$.splash.hide(), this.$.splash.destroy());
},
showAbout: function() {
this.showPopup({
popup: "about"
});
},
showPopup: function(e) {
var t = this.$[e.popup];
t && t.show();
},
closePopup: function(e) {
e.hide();
},
errorReport: function() {
console.log("ERROR REPORT SYSTEM GO");
},
showPanePopup: function(e, t) {
var n = enyo.mixin(t, {
name: enyo.isString(t.name) ? t.name : "panePopup",
flex: 1,
onFinish: "hidePanePopup",
onFinishFollower: enyo.isFunction(t.onFinish) ? t.onFinish : null
});
this.createComponent(n), this.$[n.name].render(), this.$.container.hide();
for (var r = 0; r < this.paneStack.length; r++) this.$[this.paneStack[r]].hide();
return this.$[n.name].show(), this.paneStack.push(n.name), !0;
},
hidePanePopup: function(e) {
enyo.isFunction(e.onFinishFollower) && e.onFinishFollower.apply(null, arguments), this.paneStack.splice(this.paneStack.indexOf(e.name), 1), e.destroy();
var t = this.paneStack.length;
t > 0 ? this.$[this.paneStack[t - 1]].show() : this.$.container.show(), this.waterfall("onresize", "onresize", this);
},
viewAccount: function() {
enyo.Panels.isScreenNarrow() && this.$.mainViews.setIndex(1);
},
openPreferences: function() {
enyo.asyncMethod(this, this.showPanePopup, null, {
name: "preferences",
kind: "Checkbook.preferences"
});
},
openExport: function(e, t) {
enyo.asyncMethod(this, this.showPanePopup, null, {
name: "export",
kind: "Checkbook.export"
});
},
openImport: function(e, t) {
enyo.asyncMethod(this, this.showPanePopup, null, {
name: "import",
kind: "Checkbook.import",
onFinish: enyo.bind(this, this.importComplete)
});
},
importComplete: function(e, t) {
t.success === !0 && (this.$.transactions.unloadSystem(), this.notificationType = null, enyo.asyncMethod(this, this.loadCheckbookStage2));
},
openSearch: function(e, t) {
this.log(arguments);
return;
},
closeSearch: function(e, t, n) {
n.changes && (Checkbook.globals.accountManager.updateAccountModTime(), enyo.Signals.send("accountChanged"), this.$.transactions.reloadSystem()), enyo.isFunction(e) && e(n.changes);
},
openBudget: function(e, t) {
this.log(arguments);
return;
},
openReport: function(e, t) {
this.log(arguments);
return;
}
});

// splash.js

enyo.kind({
name: "Checkbook.splash",
kind: "onyx.Popup",
centered: !0,
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1,
published: {
firstRun: !1
},
events: {
onFinish: ""
},
components: [ {
name: "headerWrapper",
kind: "onyx.Toolbar",
noStretch: !0,
classes: "transparent"
}, {
classes: "padding-std light",
components: [ {
name: "message",
classes: "smaller margin-half-bottom margin-half-top",
allowHtml: !0
}, {
name: "splashProgress",
kind: "onyx.ProgressBar",
minimum: 0,
maximum: 100,
position: 0
} ]
} ],
handlers: {
onShow: "buildHeader"
},
constructor: function() {
this.inherited(arguments), this._binds = {
splashCrash: enyo.bind(this, this.splashCrash),
checkDB: enyo.bind(this, this.checkDB)
}, this.firstRun = !1, this.headerBuilt = !1;
},
buildHeader: function() {
this.headerBuilt || (this.$.headerWrapper.createComponents([ {
name: "spinner",
kind: "onyx.Spinner",
classes: "size-half",
style: "margin: 0 5px 0 0;"
}, {
name: "icon",
kind: "Image",
src: "assets/status_icons/warning.png",
style: "margin-right: 5px;",
showing: !1
}, {
name: "title",
classes: "bold"
} ], {
owner: this
}), this.$.headerWrapper.render(), this.headerBuilt = !0), this.$.spinner.show(), this.checkSystem(), this.reflow();
},
checkSystem: function() {
this.$.title.setContent("Loading Checkbook"), this.$.message.setContent("Preparing application."), this.$.splashProgress.animateProgressTo(5), Checkbook.globals || (Checkbook.globals = {}), Checkbook.globals.prefs || (Checkbook.globals.prefs = {}, this.log("creating prefs")), Checkbook.globals.gts_db || (Checkbook.globals.gts_db = new GTS.database(getDBArgs()), this.log("Checkbook.globals.gts_db v" + Checkbook.globals.gts_db.getVersion() + " created.")), this.checkDB();
},
checkDB: function() {
this.log(), this.$.message.setContent("Checking database version..."), this.$.splashProgress.animateProgressTo(10), Checkbook.globals.gts_db.query("SELECT * FROM prefs LIMIT 1;", {
onSuccess: enyo.bind(this, this.checkDBSuccess),
onError: enyo.bind(this, this.buildInitialDB)
});
},
checkDBSuccess: function(e) {
var t = -1;
e.length > 0 && e[0].dbVer && e[0].dbVer !== "undefined" && (t = e[0].dbVer), this.versionCheck = 30, t == this.versionCheck ? (this.$.splashProgress.animateProgressTo(75), this.log("DB up to date, preparing to return"), Checkbook.globals.prefs.version = t, Checkbook.globals.prefs.useCode = e[0].useCode, Checkbook.globals.prefs.code = e[0].code, Checkbook.globals.prefs.transPreview = e[0].previewTransaction, Checkbook.globals.prefs.updateCheck = e[0].updateCheck, Checkbook.globals.prefs.updateCheckNotification = e[0].updateCheckNotification, Checkbook.globals.prefs.errorReporting = e[0].errorReporting, Checkbook.globals.prefs.dispColor = e[0].dispColor, Checkbook.globals.prefs.bsSave = e[0].bsSave, Checkbook.globals.prefs.alwaysFullCalendar = e[0].alwaysFullCalendar, Checkbook.globals.prefs.seriesCountLimit = e[0].seriesCountLimit, Checkbook.globals.prefs.seriesDayLimit = e[0].seriesDayLimit, Checkbook.globals.prefs.custom_sort = e[0].custom_sort, this.$.message.setContent("Updating transaction data..."), this.$.splashProgress.animateProgressTo(85), enyo.asyncMethod(this, this.doFinish)) : t >= 1 ? (this.log("DB out of date, preparing to update: " + t + " to " + this.versionCheck), this.updateDBStructure(t)) : (this.log("DB does not exist, preparing to create"), this.buildInitialDB());
},
buildInitialDB: function() {
this.log(), this.firstRun = !0, this.$.message.setContent("Creating application database..."), this.$.splashProgress.animateProgressTo(50);
var e = ("0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz" + (new Date).getTime()).split(""), t = Math.floor(Math.random() * e.length) + 5, n = "";
for (var r = 0; r < t; r++) n += e[Math.floor(Math.random() * e.length)];
var i = [ Checkbook.globals.gts_db.getDropTable("accounts"), Checkbook.globals.gts_db.getDropTable("accountCategories"), Checkbook.globals.gts_db.getDropTable("acctTrsnSortOptn"), Checkbook.globals.gts_db.getDropTable("budgets"), Checkbook.globals.gts_db.getDropTable("transactions"), Checkbook.globals.gts_db.getDropTable("expenseCategories"), Checkbook.globals.gts_db.getDropTable("transactionSplit"), Checkbook.globals.gts_db.getDropTable("repeats"), Checkbook.globals.gts_db.getDropTable("prefs"), {
table: "accounts",
columns: [ {
column: "acctId",
type: "INTEGER",
constraints: [ "UNIQUE", "PRIMARY KEY ASC" ]
}, {
column: "acctName",
type: "TEXT"
}, {
column: "acctNotes",
type: "TEXT"
}, {
column: "acctCategory",
type: "TEXT"
}, {
column: "sort",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "defaultAccount",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "frozen",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "hidden",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "acctLocked",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "lockedCode",
type: "TEXT"
}, {
column: "transDescMultiLine",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "showTransTime",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "useAutoComplete",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "atmEntry",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "bal_view",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "runningBalance",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "checkField",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "hideNotes",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "enableCategories",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "sect_order",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "hide_cleared",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "last_sync",
type: "TEXT"
}, {
column: "auto_savings",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "auto_savings_link",
type: "INTEGER NOT NULL DEFAULT -1"
} ],
data: []
}, {
table: "accountCategories",
columns: [ {
column: "name",
type: "TEXT"
}, {
column: "catOrder",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "icon",
type: "TEXT"
}, {
column: "color",
type: ' NOT NULL DEFAULT "green"'
}, {
column: "view_status",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "last_sync",
type: "TEXT"
} ],
data: defaultAccountCategories
}, {
table: "acctTrsnSortOptn",
columns: [ {
column: "sortId",
type: "INTEGER",
constraints: [ "UNIQUE", "PRIMARY KEY ASC" ]
}, {
column: "label",
type: "TEXT"
}, {
column: "sortGroup",
type: "TEXT"
}, {
column: "groupOrder",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "desc",
type: "TEXT"
}, {
column: "qry",
type: "TEXT"
} ],
data: defaultAcctTrsnSortOptn
}, {
table: "transactions",
columns: [ {
column: "itemId",
type: "INTEGER",
constraints: [ "UNIQUE", "PRIMARY KEY ASC" ]
}, {
column: "account",
type: "INTEGER",
constraints: [ "REFERENCES accounts( acctId )", "ON UPDATE CASCADE", "ON DELETE CASCADE" ]
}, {
column: "linkedRecord",
type: "INTEGER"
}, {
column: "linkedAccount",
type: "INTEGER",
constraints: [ "REFERENCES accounts( acctId )", "ON UPDATE CASCADE", "ON DELETE SET NULL" ]
}, {
column: "desc",
type: "TEXT"
}, {
column: "amount",
type: "NUMERIC"
}, {
column: "note",
type: "TEXT"
}, {
column: "date",
type: "TEXT"
}, {
column: "category",
type: "TEXT"
}, {
column: "category2",
type: "TEXT"
}, {
column: "cleared",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "checkNum",
type: "TEXT"
}, {
column: "atSource",
type: "INTEGER"
}, {
column: "last_sync",
type: "TEXT"
}, {
column: "repeatId",
type: "INTEGER",
constraints: [ "REFERENCES repeats( repeatId )", "ON UPDATE CASCADE", "ON DELETE SET NULL", "DEFERRABLE INITIALLY DEFERRED" ]
}, {
column: "repeatUnlinked",
type: "INTEGER NOT NULL DEFAULT 0"
} ],
data: []
}, {
table: "transactionCategories",
columns: [ {
column: "catId",
type: "INTEGER",
constraints: [ "UNIQUE", "PRIMARY KEY ASC" ]
}, {
column: "genCat",
type: "TEXT"
}, {
column: "specCat",
type: "TEXT"
}, {
column: "last_sync",
type: "TEXT"
} ],
data: defaultExpenseCategories
}, {
table: "transactionSplit",
columns: [ {
column: "tsId",
type: "INTEGER",
constraints: [ "UNIQUE", "PRIMARY KEY ASC" ]
}, {
column: "transId",
type: "INTEGER",
constraints: [ "REFERENCES transactions( itemId )", "ON UPDATE CASCADE", "ON DELETE CASCADE", "DEFERRABLE INITIALLY DEFERRED" ]
}, {
column: "genCat",
type: "TEXT"
}, {
column: "specCat",
type: "TEXT"
}, {
column: "amount",
type: "NUMERIC"
}, {
column: "last_sync",
type: "TEXT"
} ],
data: []
}, {
table: "repeats",
columns: [ {
column: "repeatId",
type: "INTEGER PRIMARY KEY ASC"
}, {
column: "frequency",
type: "TEXT"
}, {
column: "daysOfWeek",
type: "TEXT"
}, {
column: "itemSpan",
type: "INTEGER"
}, {
column: "endingCondition",
type: "TEXT"
}, {
column: "endDate",
type: "TEXT"
}, {
column: "endCount",
type: "INTEGER"
}, {
column: "currCout",
type: "INTEGER"
}, {
column: "origDate",
type: "TEXT"
}, {
column: "lastOccurance",
type: "TEXT"
}, {
column: "last_sync",
type: "TEXT"
}, {
column: "desc",
type: "TEXT"
}, {
column: "amount",
type: "NUMERIC"
}, {
column: "note",
type: "TEXT"
}, {
column: "category",
type: "TEXT"
}, {
column: "acctId",
type: "INTEGER",
constraints: [ "REFERENCES accounts( acctId )", "ON UPDATE CASCADE", "ON DELETE CASCADE" ]
}, {
column: "linkedAcctId",
type: "INTEGER",
constraints: [ "REFERENCES accounts( acctId )", "ON UPDATE CASCADE", "ON DELETE SET NULL" ]
}, {
column: "autoTrsnLink",
type: "INTEGER"
} ],
data: []
}, {
table: "budgets",
columns: [ {
column: "budgetId",
type: "INTEGER",
constraints: [ "UNIQUE", "PRIMARY KEY ASC" ]
}, {
column: "category",
type: "TEXT"
}, {
column: "spending_limit",
type: "NUMERIC"
}, {
column: "span",
type: "INTEGER"
}, {
column: "rollOver",
type: "INTEGER"
}, {
column: "budgetOrder",
type: "INTEGER"
} ],
data: []
}, {
table: "prefs",
columns: [ {
column: "dbVer",
type: "INTEGER"
}, {
column: "useCode",
type: "INTEGER"
}, {
column: "code",
type: "TEXT"
}, {
column: "saveGSheetsData",
type: "INTEGER"
}, {
column: "gSheetUser",
type: "TEXT"
}, {
column: "gSheetPass",
type: "TEXT"
}, {
column: "repeatUpdate",
type: "TEXT"
}, {
column: "updateCheck",
type: "TEXT"
}, {
column: "synergyAcctId",
type: "TEXT"
}, {
column: "synergyCalId",
type: "TEXT"
}, {
column: "updateCheckNotification",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "dispColor",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "bsSave",
type: "INTEGER NOT NULL DEFAULT 1"
}, {
column: "custom_sort",
type: "INTEGER NOT NULL DEFAULT 0"
}, {
column: "gts_name",
type: "TEXT"
}, {
column: "gts_pass",
type: "TEXT"
}, {
column: "gts_last_connection",
type: "TEXT"
}, {
column: "spike",
type: "TEXT"
}, {
column: "errorReporting",
type: "INTEGER NOT NULL DEFAULT 1"
} ],
data: [ {
dbVer: 19,
useCode: 0,
saveGSheetsData: 0,
spike: n
} ]
} ];
Checkbook.globals.gts_db.setSchema(i, {
onSuccess: this._binds.checkDB,
onError: this._binds.splashCrash
});
},
updateDBStructure: function(e) {
this.log(), this.$.message.setContent("Updating database..."), this.$.splashProgress.animateProgressTo(50);
var t = [], n = {
onSuccess: this._binds.checkDB,
onError: this._binds.splashCrash
};
switch (e) {
case 15:
t.push("ALTER TABLE accounts ADD COLUMN auto_savings INTEGER NOT NULL DEFAULT 0;"), t.push("ALTER TABLE accounts ADD COLUMN auto_savings_link INTEGER NOT NULL DEFAULT 0;"), t.push("DROP TABLE IF EXISTS repeats;"), t.push("CREATE TABLE repeats( repeatId INTEGER PRIMARY KEY ASC, frequency TEXT, daysOfWeek TEXT, itemSpan INTEGER, endingCondition TEXT, endDate TEXT, endCount INTEGER, currCout INTEGER, origDate TEXT, lastOccurance TEXT, desc TEXT, amount REAL, note TEXT, category TEXT, acctId INTEGER, linkedAcctId INTEGER );");
case 16:
t.push("ALTER TABLE expenses ADD COLUMN repeatUnlinked INTEGER NOT NULL DEFAULT 0;"), this.versionCheck = 17;
case 17:
t.push("ALTER TABLE prefs ADD COLUMN errorReporting INTEGER NOT NULL DEFAULT 1;"), t.push("ALTER TABLE expenses ADD COLUMN atSource INTEGER;"), t.push("UPDATE accounts SET auto_savings_link = -1;"), this.versionCheck = 18;
case 18:
t.push("ALTER TABLE expenses RENAME TO transactions;"), t.push("ALTER TABLE expenseCategories RENAME TO transactionCategories;"), t.push("DROP TABLE IF EXISTS transactionSplit;"), t.push("CREATE TABLE transactionSplit( transId INTEGER, genCat TEXT, specCat TEXT, amount REAL, last_sync TEXT );"), t.push("ALTER TABLE transactions ADD COLUMN category2 TEXT;"), this.versionCheck = 19;
case 19:
t.push("ALTER TABLE prefs ADD COLUMN previewTransaction INTEGER NOT NULL DEFAULT 1;"), this.versionCheck = 20;
case 20:
t.push("ALTER TABLE budgets ADD COLUMN category2 TEXT;"), this.versionCheck = 21;
case 21:
t.push(Checkbook.globals.gts_db.getUpdate("acctTrsnSortOptn", {
qry: "IFNULL( NULLIF( checkNum, '' ), ( SELECT IFNULL( MAX( checkNum ), 0 ) FROM transactions LIMIT 1 ) ) ASC, itemId ASC"
}, {
sortId: 9
})), this.versionCheck = 22;
case 22:
t.push("DROP TABLE IF EXISTS repeats;"), t.push("CREATE TABLE repeats( repeatId INTEGER PRIMARY KEY ASC, frequency TEXT, daysOfWeek TEXT, itemSpan INTEGER, endingCondition TEXT, endDate TEXT, endCount INTEGER, currCount INTEGER, origDate TEXT, lastOccurrence TEXT, rep_desc TEXT, rep_amount REAL, rep_note TEXT, rep_category TEXT, rep_acctId INTEGER, rep_linkedAcctId INTEGER, rep_autoTrsnLink INTEGER, lastUpdated TEXT, last_sync TEXT );"), this.versionCheck = 23;
case 23:
t.push(Checkbook.globals.gts_db.getUpdate("accounts", {
acctLocked: 0,
lockedCode: ""
}, {})), t.push(Checkbook.globals.gts_db.getUpdate("prefs", {
useCode: 0,
code: "",
saveGSheetsData: 0,
gSheetUser: "depreciated",
gSheetPass: ""
}, {})), this.versionCheck = 24;
case 24:
t.push("ALTER TABLE accounts ADD COLUMN payeeField INTEGER NOT NULL DEFAULT 0;"), t.push("ALTER TABLE transactions ADD COLUMN payee TEXT;"), this.versionCheck = 25;
case 25:
t.push("ALTER TABLE transactions RENAME TO expenses;"), t.push("ALTER TABLE transactionCategories RENAME TO expenseCategories;"), this.versionCheck = 26;
case 26:
t.push("ALTER TABLE expenses RENAME TO transactions;"), t.push("ALTER TABLE expenseCategories RENAME TO transactionCategories;"), this.versionCheck = 27;
case 27:
t.push("ALTER TABLE prefs ADD COLUMN alwaysFullCalendar INTEGER NOT NULL DEFAULT 0;"), this.versionCheck = 28;
case 28:
t.push("ALTER TABLE repeats ADD COLUMN terminated INTEGER NOT NULL DEFAULT 0;"), t.push("ALTER TABLE repeats ADD COLUMN rep_autoTrsnLinkAcct INTEGER;"), this.versionCheck = 29;
case 29:
t.push("ALTER TABLE prefs ADD COLUMN seriesCountLimit INTEGER NOT NULL DEFAULT 3;"), t.push("ALTER TABLE prefs ADD COLUMN seriesDayLimit INTEGER NOT NULL DEFAULT 45;"), this.versionCheck = 30;
case 30:
}
t.push(Checkbook.globals.gts_db.getUpdate("prefs", {
dbVer: this.versionCheck
}, {})), Checkbook.globals.gts_db.queries(t, n);
},
splashCrash: function(e) {
this.error(arguments), this.$.splashProgress.hide(), this.$.spinner.hide(), this.$.icon.show(), this.$.title.setContent("Checkbook Load Error"), this.$.message.setContent("Checkbook has failed to load.<br />Please contact <a href='mailto:glitchtechscience@gmail.com'>GlitchTech Science</a> for assistant with the following error:<br /><br />Code: " + e.code + "<br />" + "Message: " + e.message);
}
});

// preferences.js

enyo.kind({
name: "Checkbook.preferences",
kind: "FittableRows",
classes: "enyo-fit",
style: "height: 100%;",
systemReady: !1,
events: {
onFinish: ""
},
components: [ {
name: "header",
kind: "onyx.Toolbar",
classes: "text-center text-middle",
style: "position: relative;",
components: [ {
kind: "enyo.Image",
src: "assets/dollar_sign_1.png",
classes: "img-icon margin-half-right"
}, {
content: "Preferences",
classes: "bigger"
}, {
kind: "onyx.Button",
ontap: "doFinish",
content: "x",
classes: "onyx-negative",
style: "position: absolute; right: 15px;"
} ]
}, {
kind: "enyo.Scroller",
horizontal: "hidden",
classes: "tardis-blue-gradient",
fit: !0,
components: [ {
classes: "light narrow-column padding-half-top padding-half-bottom",
style: "min-height: 100%;",
components: [ {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Program Security"
}, {
name: "pinLock",
kind: "GTS.ToggleBar",
label: "PIN Lock",
onContent: "Yes",
offContent: "No",
onChange: "togglePINStatus"
}, {
name: "pinLockDrawer",
kind: "onyx.Drawer",
open: !1,
components: [ {
kind: "onyx.Groupbox",
classes: "padding-half-top",
ontap: "changeAppPin",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
components: [ {
name: "pinCode",
kind: "onyx.Input",
type: "password",
placeholder: "Tap to set...",
disabled: !0,
fit: !0
}, {
content: "Code",
classes: "label"
} ]
} ]
} ]
} ]
}, {
kind: "onyx.Groupbox",
classes: "margin-top",
components: [ {
kind: "onyx.GroupboxHeader",
content: "General Options"
}, {
name: "transPreview",
kind: "GTS.ToggleBar",
label: "Transaction Preview",
sublabel: "Show preview of a tapped transaction.",
onContent: "Yes",
offContent: "No",
onChange: "updateTransPreview"
}, {
name: "dispColor",
kind: "GTS.ToggleBar",
label: "Account Colors",
sublabel: "Add color in some areas based on account categories.",
onContent: "Yes",
offContent: "No",
onChange: "updateDispColor"
}, {
name: "alwaysFullCalendar",
kind: "GTS.ToggleBar",
label: "Full Calendar",
sublabel: "Set modify transaction system to always use a full calendar instead of a date picker for small screens.",
onContent: "Yes",
offContent: "No",
onChange: "updateAlwaysFullCalendar"
}, {
name: "updateNotice",
kind: "GTS.ToggleBar",
label: "System Notifications",
sublabel: "Recieve in-app notices of updates and other important news.",
onContent: "Yes",
offContent: "No",
onChange: "updateUpdateNotice"
}, {
name: "errorReporting",
kind: "GTS.ToggleBar",
label: "Error Reporting",
sublabel: "Report errors to GlitchTech Science",
onContent: "Yes",
offContent: "No",
onChange: "updateErrorReporting"
}, {
showing: !1,
content: "backswipe save (function cannot not used on touchpad)"
} ]
}, {
kind: "onyx.Groupbox",
classes: "margin-top",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Accounts"
}, {
name: "defaultAccount",
kind: "GTS.SelectorBar",
disabled: !0,
label: "Default Account",
onChange: "updateDefaultAccount",
value: 0,
choices: []
}, {
kind: "onyx.Item",
components: [ {
name: "addAccountButton",
kind: "onyx.Button",
toggling: !0,
content: "Add Account",
classes: "full-width",
ontap: "addAccount"
} ]
} ]
}, {
kind: "onyx.Groupbox",
classes: "margin-top",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Recurrence Options"
}, {
name: "seriesCountLimit",
kind: "GTS.IntegerPickerBar",
min: 1,
max: 15,
label: "Series Occurrence Limit",
sublabel: "Maximum number of times an event will be created within the date limit.",
onChange: "updateSeriesCountLimit"
}, {
name: "seriesDayLimit",
kind: "GTS.IntegerPickerBar",
min: 5,
max: 150,
step: 5,
label: "Series Day Limit",
sublabel: "Maximum number of days from today a recurrence event will be created..",
onChange: "updateSeriesDayLimit"
} ]
}, {
kind: "onyx.Groupbox",
classes: "margin-top",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Categories & Suggestions"
}, {
kind: "onyx.Item",
components: [ {
name: "editAccountCategories",
kind: "onyx.Button",
content: "Edit Account Categories",
classes: "full-width",
ontap: "modifyAccountCategories"
} ]
}, {
kind: "onyx.Item",
components: [ {
name: "editTransactionCategories",
kind: "onyx.Button",
content: "Edit Transaction Categories",
classes: "full-width",
ontap: "modifyTransactionCategories"
} ]
}, {
showing: !1,
kind: "onyx.Item",
components: [ {
name: "editAutoCompleteSettings",
kind: "onyx.Button",
content: "Auto-Complete Settings",
classes: "full-width",
ontap: "modifyAutoCompleteSettings"
} ]
} ]
}, {
kind: "onyx.Button",
content: "Full Wipe",
classes: "onyx-negative margin-top full-width",
ontap: "fullwipe"
} ]
} ]
}, {
showing: !1,
kind: "onyx.Toolbar",
classes: "text-center",
components: [ {
kind: "onyx.Button",
content: "Done",
ontap: "doFinish"
} ]
}, {
name: "cryptoSystem",
kind: "Checkbook.encryption"
} ],
rendered: function() {
this.$.pinLock.setValue(Checkbook.globals.prefs.useCode === 1), this.$.pinCode.setValue(Checkbook.globals.prefs.code), this.$.pinLockDrawer.setOpen(this.$.pinLock.getValue()), this.$.transPreview.setValue(Checkbook.globals.prefs.transPreview === 1), this.$.updateNotice.setValue(Checkbook.globals.prefs.updateCheckNotification === 1), this.$.errorReporting.setValue(Checkbook.globals.prefs.errorReporting === 1), this.$.dispColor.setValue(Checkbook.globals.prefs.dispColor === 1), Checkbook.globals.accountManager.fetchAccountsList({
onSuccess: enyo.bind(this, this.buildDefaultAccountList)
}), this.$.seriesDayLimit.setValue(Checkbook.globals.prefs.seriesDayLimit), this.$.seriesCountLimit.setValue(Checkbook.globals.prefs.seriesCountLimit), this.inherited(arguments), this.$.header.addRemoveClass("text-left", enyo.Panels.isScreenNarrow()), this.$.header.addRemoveClass("text-center", !enyo.Panels.isScreenNarrow()), this.systemReady = !0;
},
togglePINStatus: function() {
Checkbook.globals.prefs.useCode = this.$.pinLock.getValue() ? 1 : 0, this.$.pinLockDrawer.setOpen(this.$.pinLock.getValue()), this.saveAppPin();
},
changeAppPin: function() {
this.createComponent({
name: "pinPopup",
kind: "Checkbook.pinChangePopup",
onFinish: "changeAppPinHandler"
}), this.$.pinPopup.show();
},
changeAppPinHandler: function(e, t) {
this.$.cryptoSystem.encryptString(t.value, enyo.bind(this, this.cryptoPinHandler)), this.$.pinPopup.hide(), this.$.pinPopup.destroy();
},
cryptoPinHandler: function(e) {
e.length > 0 && (Checkbook.globals.prefs.useCode = 1, Checkbook.globals.prefs.code = e), this.saveAppPin();
},
saveAppPin: function() {
if (Checkbook.globals.prefs.useCode === 0 || !enyo.isString(Checkbook.globals.prefs.code) || Checkbook.globals.prefs.code.length <= 0) Checkbook.globals.prefs.useCode = 0, Checkbook.globals.prefs.code = "";
this.$.pinCode.setValue(Checkbook.globals.prefs.code), Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", {
useCode: Checkbook.globals.prefs.useCode,
code: Checkbook.globals.prefs.code
}, {}));
},
updateTransPreview: function(e, t) {
if (!this.systemReady) return !0;
Checkbook.globals.prefs.transPreview = t.value ? 1 : 0, Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", {
previewTransaction: Checkbook.globals.prefs.transPreview
}, {}));
},
updateUpdateNotice: function(e, t) {
if (!this.systemReady) return !0;
Checkbook.globals.prefs.updateCheckNotification = t.value ? 1 : 0, Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", {
updateCheckNotification: Checkbook.globals.prefs.updateCheckNotification
}, {}));
},
updateErrorReporting: function(e, t) {
if (!this.systemReady) return !0;
Checkbook.globals.prefs.errorReporting = t.value ? 1 : 0, Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", {
errorReporting: Checkbook.globals.prefs.errorReporting
}, {}));
},
updateDispColor: function(e, t) {
if (!this.systemReady) return !0;
Checkbook.globals.prefs.dispColor = t.value ? 1 : 0, Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", {
dispColor: Checkbook.globals.prefs.dispColor
}, {}));
},
updateAlwaysFullCalendar: function(e, t) {
if (!this.systemReady) return !0;
Checkbook.globals.prefs.alwaysFullCalendar = t.value ? 1 : 0, Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", {
alwaysFullCalendar: Checkbook.globals.prefs.alwaysFullCalendar
}, {}));
},
updateSeriesCountLimit: function(e, t) {
if (!this.systemReady) return !0;
Checkbook.globals.prefs.seriesCountLimit = t.value, Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", {
seriesCountLimit: Checkbook.globals.prefs.seriesCountLimit
}, {}));
},
updateSeriesDayLimit: function(e, t) {
if (!this.systemReady) return !0;
Checkbook.globals.prefs.seriesDayLimit = t.value, Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", {
seriesDayLimit: Checkbook.globals.prefs.seriesDayLimit
}, {}));
},
setupRow: function(e, t) {
var n = t.index, r = t.item, i = e.accounts[n];
if (i) return r.$.catDivider.hide(), i.index = n, r.$.accountItem.addRemoveClass("maskedAccount", i.hidden === 1), i.hidden === 2 ? r.$.icon.setSrc(imgToGrey("assets/" + i.acctCategoryIcon)) : r.$.icon.setSrc("assets/" + i.acctCategoryIcon), r.$.iconLock.addRemoveClass("unlocked", i.acctLocked !== 1), r.$.name.setContent(i.acctName), !0;
},
buildDefaultAccountList: function(e) {
e.unshift({
content: "No Default Account",
color: null,
icon: null,
value: -1
}), this.$.defaultAccount.setChoices(e), this.$.defaultAccount.setDisabled(!1), this.$.defaultAccount.render(), Checkbook.globals.accountManager.fetchDefaultAccount({
onSuccess: enyo.bind(this, this.setDefaultAccount)
});
},
setDefaultAccount: function(e) {
e ? this.$.defaultAccount.setValue(e.acctId) : this.$.defaultAccount.setValue(-1);
},
updateDefaultAccount: function(e, t) {
Checkbook.globals.accountManager.updateDefaultAccount(this.$.defaultAccount.getValue());
},
addAccount: function() {
this.$.addAccountButton.getDisabled() || (this.$.addAccountButton.setDisabled(!0), enyo.Signals.send("modifyAccount", {
name: "addAccount",
kind: "Checkbook.accounts.modify",
acctId: -1,
onFinish: enyo.bind(this, this.addAccountComplete)
}));
},
addAccountComplete: function(e, t) {
this.$.addAccountButton.setDisabled(!1), t.action === 1 && t.actionStatus === !0 && enyo.Signals.send("accountChanged");
},
modifyAccountCategories: function() {
this.$.editAccountCategories.getDisabled() || (this.$.editAccountCategories.setDisabled(!0), enyo.Signals.send("showPanePopup", {
name: "accountCategoryView",
kind: "Checkbook.accountCategory.view",
onFinish: enyo.bind(this, this.modifyAccountCategoriesComplete)
}));
},
modifyAccountCategoriesComplete: function() {
enyo.Signals.send("accountChanged"), this.$.editAccountCategories.setDisabled(!1);
},
modifyTransactionCategories: function() {
this.$.editTransactionCategories.getDisabled() || (this.$.editTransactionCategories.setDisabled(!0), enyo.Signals.send("showPanePopup", {
name: "transactionCategoryView",
kind: "Checkbook.transactionCategory.view",
onFinish: enyo.bind(this, this.modifyTransactionCategoriesComplete)
}));
},
modifyTransactionCategoriesComplete: function() {
this.$.editTransactionCategories.setDisabled(!1);
},
modifyAutoCompleteSettings: function() {
return;
},
fullwipe: function() {
this.createComponent({
name: "fullwipeConfirm",
kind: "gts.ConfirmDialog",
title: "Purge All Data",
message: "Are you sure? Remember this cannot be undone. This app will try to exit when process is complete.",
confirmText: "Delete Everything",
confirmClass: "onyx-negative",
cancelText: "Cancel",
cancelClass: "",
onConfirm: "fullwipeRun",
onCancel: "fullwipeConfirmClose"
}), this.$.fullwipeConfirm.show();
},
fullwipeConfirmClose: function() {
this.$.fullwipeConfirm.hide(), this.$.fullwipeConfirm.destroy();
},
fullwipeRun: function() {
this.fullwipeConfirmClose(), this.createComponent({
name: "wipeProgress",
kind: "GTS.ProgressDialog",
animateProgress: !0
}), this.$.wipeProgress.show({
title: "Purging All Data",
message: "Please wait...",
progress: 50
}), this.$.wipeProgress.reflow(), Checkbook.globals.gts_db.queries([ "DROP TABLE IF EXISTS budget;", "DROP TABLE IF EXISTS rules;", "DROP TABLE IF EXISTS accounts;", "DROP TABLE IF EXISTS accountCategories;", "DROP TABLE IF EXISTS transactions;", "DROP TABLE IF EXISTS transactionCategories;", "DROP TABLE IF EXISTS transactionSplit;", "DROP TABLE IF EXISTS repeats;", "DROP TABLE IF EXISTS prefs;" ], {
onSuccess: enyo.bind(this, this.deleteEverythingDone)
});
},
deleteEverythingDone: function() {
window.close();
}
});

// import.js

enyo.kind({
name: "Checkbook.import",
kind: "FittableRows",
classes: "enyo-fit",
style: "height: 100%;",
allSheetsList: [],
importItems: [],
standardLimit: 1e3,
events: {
onFinish: ""
},
components: [ {
kind: "onyx.Toolbar",
classes: "text-center",
style: "position: relative;",
components: [ {
content: "Import System",
classes: "bigger"
}, {
kind: "onyx.Button",
ontap: "closeImport",
content: "x",
classes: "onyx-negative",
style: "position: absolute; right: 15px;"
} ]
}, {
kind: "enyo.Scroller",
horizontal: "hidden",
classes: "tardis-blue",
fit: !0,
components: [ {
name: "instructions",
classes: "light narrow-column padding-half-top",
style: "height: 100%;",
components: [ {
classes: "padding-std smaller",
allowHtml: !0,
content: "<p>To import your finances into this program you must have a Google Drive account. <br />Visit drive.google.com to sign up.</p><p>Upload or create a spreadsheet with all the information to import. Once that is complete, tap 'Continue', select your spreadsheet, then the system will import your data. Existing data may be overwritten. <span style='color:#cc0000;'>The first row of the spreadsheet must have the following columns: account, accountCat, date, amount, description, cleared, note.</span></p><p><strong>Warning:</strong> Larger spreadsheets will take much longer to download.</p>"
}, {
name: "saveCredentialsWrapper",
layoutKind: "enyo.FittableColumnsLayout",
noStretch: !0,
classes: "padding-std text-middle",
components: [ {
name: "saveCredentials",
kind: "onyx.Checkbox",
value: !0,
classes: "margin-right"
}, {
content: "Save credentials",
fit: !0
} ]
} ]
}, {
showing: !1,
name: "sheetList",
kind: "Repeater",
classes: "light narrow-column padding-half-top",
onSetupItem: "setupRow",
components: [ {
kind: "onyx.Item",
tapHighlight: !0,
ontap: "sheetSelectedChanged",
classes: "bordered",
components: [ {
name: "sheetSelected",
kind: "onyx.Checkbox",
value: !1,
disabled: !0,
style: "margin-right: 10px;"
}, {
name: "sheetName",
tag: "span"
}, {
name: "sheetUpdated",
classes: "smaller"
} ]
} ]
} ]
}, {
name: "instructionsBar",
kind: "onyx.Toolbar",
classes: "text-center",
components: [ {
name: "instructionsButton",
kind: "onyx.Button",
content: "Authenticate",
ontap: "authenticateWithGoogle",
classes: "onyx-affirmative",
style: "min-width: 150px;"
} ]
}, {
showing: !1,
name: "sheetListBar",
kind: "onyx.Toolbar",
classes: "text-center",
components: [ {
name: "sheetListButton",
kind: "onyx.Button",
content: "Import Accounts",
ontap: "beginImportProcess",
classes: "onyx-affirmative deep-green",
style: "min-width: 150px;"
}, {
kind: "onyx.MenuDecorator",
onSelect: "menuItemClick",
components: [ {
kind: "onyx.Button",
components: [ {
content: "Select..."
} ]
}, {
kind: "onyx.Menu",
showOnTop: !0,
floating: !0,
components: [ {
content: "All",
value: 1
}, {
content: "None",
value: 2
}, {
content: "Invert",
value: 3
} ]
} ]
} ]
}, {
name: "progress",
kind: "GTS.ProgressDialog",
animateProgress: !0,
onCancel: "closeImport",
cancelText: "Cancel"
}, {
name: "errorMessage",
kind: "Checkbook.systemError",
errTitle: "Import Error",
mainMessage: "",
secondaryMessage: "",
onFinish: "closeErrorMessage"
}, {
name: "gapi",
kind: "GTS.Gapi",
onReady: "gapiReady"
}, {
name: "gapiAccess",
kind: "private.gapi"
}, {
name: "gssc",
kind: "GTS.gdata",
appName: "com.glitchtechscience.checkbook"
}, {
name: "cryptoSystem",
kind: "Checkbook.encryption"
} ],
rendered: function() {
this.inherited(arguments), this.$.instructionsButton.setDisabled(!0), this.$.instructionsBar.show(), this.$.sheetListBar.hide(), this.$.instructions.show(), this.$.sheetList.hide(), this.$.progress.show({
title: "Import Progress",
message: "Linking to Google...",
progress: 25
}), this.refreshLayout();
},
refreshLayout: function() {
this.waterfall("onresize", "onresize", this);
},
gapiReady: function() {
this.$.progress.setProgress(60), Checkbook.globals.gts_db.query("SELECT saveGSheetsData, gSheetPass FROM prefs LIMIT 1;", {
onSuccess: enyo.bind(this, this.decryptGapiData)
});
},
decryptGapiData: function(e) {
this.$.progress.setProgress(90), e.length > 0 ? (this.$.saveCredentials.setValue(e[0].saveGSheetsData), this.$.cryptoSystem.decryptString(e[0].gSheetPass, enyo.bind(this, this.loadGapiData))) : this.loadGapiData("");
},
loadGapiData: function(e) {
this.$.gapi.setApiKey(this.$.gapiAccess.getApiKey()), this.$.gapi.setClientId(this.$.gapiAccess.getClientId()), this.$.gapi.setClientSecret(this.$.gapiAccess.getClientSecret()), this.$.saveCredentialsWrapper.hide(), this.$.gapi.setAuthToken(enyo.json.parse(e)), this.$.instructionsButton.setDisabled(!1), this.$.progress.hide();
},
authenticateWithGoogle: function() {
this.$.gapi.setScope([ "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://spreadsheets.google.com/feeds", "https://docs.google.com/feeds" ]), this.$.gapi.auth({
onSuccess: enyo.bind(this, this.userAuthenticated),
onError: enyo.bind(this, this.userNotAuthenticated)
}), this.$.progress.show({
title: "Import Progress",
message: "Authenticating...",
progress: 5
});
},
userNotAuthenticated: function() {
this.closeImport();
},
userAuthenticated: function() {
this.$.progress.show({
title: "Import Progress",
message: "Authenticated...",
progress: 15
}), this.$.saveCredentials.getValue() ? this.$.cryptoSystem.encryptString(enyo.json.stringify(this.$.gapi.getAuthToken()), enyo.bind(this, this.saveUserGData)) : this.saveUserGData(""), this.$.gapi.loadModule("drive", 2, {
onSuccess: enyo.bind(this, this.fetchsheetList),
onError: enyo.bind(this, this.fatalError, "Checkbook importer has encountered a fatal error. Please try again later.")
});
},
saveUserGData: function(e) {
var t = {
saveGSheetsData: 0,
gSheetPass: ""
};
this.$.saveCredentials.getValue() && e.length > 0 && (t = {
saveGSheetsData: this.$.saveCredentials.getValue() ? 1 : 0,
gSheetPass: e
}), Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", t, {}));
},
fetchsheetList: function() {
this.$.progress.show({
title: "Import Progress",
message: "Retrieving spreadsheets...",
progress: 25
});
var e = gapi.client.drive.files.list();
this.retrievePageOfFiles(e, []);
},
retrievePageOfFiles: function(e, t) {
var n = this;
e.execute(function(r) {
t = t.concat(r.items);
var i = r.nextPageToken;
i ? (e = gapi.client.drive.files.list({
pageToken: i
}), this.retrievePageOfFiles(e, t)) : n.rendersheetList(t);
});
},
rendersheetList: function(e) {
if (!e || typeof e == "undefined" || e.length <= 0) {
this.$.progress.hide(), this.showErrorMessage(enyo.bind(this, this.closeImport), "No data available to be imported.");
return;
}
if (typeof this.$["progress"] == "undefined") return;
this.$.progress.setMessage("Processing spreadsheets..."), this.$.progress.setProgress(75), this.$.sheetListButton.setDisabled(!1), this.$.instructionsBar.hide(), this.$.sheetListBar.show(), this.$.instructions.hide(), this.$.sheetList.show(), this.allSheetsList = e, this.$.sheetList.setCount(this.allSheetsList.length), this.$.progress.hide();
},
setupRow: function(e, t) {
var n = t.index, r = t.item, i = this.allSheetsList[n];
if (i) {
r.$.sheetName.setContent(i.title);
var s = new Date(i.modifiedDate);
return r.$.sheetUpdated.setContent(s.format({
date: "long",
time: "short"
})), r.$.sheetSelected.setValue(i.selectStatus), !0;
}
},
sheetSelectedChanged: function(e, t) {
this.allSheetsList[t.index].selectStatus = !this.allSheetsList[t.index].selectStatus, this.$.sheetList.renderRow(t.index);
},
menuItemClick: function(e, t) {
if (t.selected.value === 1) for (var n = 0; n < this.allSheetsList.length; n++) this.allSheetsList[n].selectStatus = !0; else if (t.selected.value === 2) for (var n = 0; n < this.allSheetsList.length; n++) this.allSheetsList[n].selectStatus = !1; else if (t.selected.value === 3) for (var n = 0; n < this.allSheetsList.length; n++) this.allSheetsList[n].selectStatus = !this.allSheetsList[n].selectStatus;
this.$.sheetList.setCount(this.allSheetsList.length);
},
beginImportProcess: function() {
this.$.sheetListButton.setDisabled(!0), this.importItems = [];
for (var e = 0; e < this.allSheetsList.length; e++) this.allSheetsList[e].selectStatus && this.importItems.push({
sheetIndex: e,
name: this.allSheetsList[e].title,
sheetId: this.allSheetsList[e].id,
finished: !1,
pages: [],
transactions: []
});
if (this.importItems.length <= 0) {
this.showErrorMessage(enyo.bind(this, this.closeImport), "No accounts selected to import");
return;
}
this.documentIndex = 0, this.errorCount = 0;
try {
enyo.windows.blockScreenTimeout(!0), this.log("Window: blockScreenTimeout: true");
} catch (t) {
this.log("Window Error (Start)", t);
}
this.$.progress.show({
title: "Importing Data",
message: "Fetching document specifications...",
progress: 0
}), this.$.gssc.setAuthKey(this.$.gapi.getAuthToken().AccessToken), enyo.asyncMethod(this, this.fetchDocSummary);
},
fetchDocSummary: function() {
this.$.progress.setProgress(this.documentIndex / this.importItems.length * 100), this.$.gssc.getSheetSummary(this.importItems[this.documentIndex].sheetId, {
onSuccess: enyo.bind(this, this.parseDocSummary),
onError: enyo.bind(this, this.showErrorMessage, enyo.bind(this, this.fetchsheetList))
});
},
parseDocSummary: function(e, t) {
if (this.checkErrorCount()) return;
if (typeof t.feed.entry == "undefined") {
this.error("Bad data from Google."), this.$.progress.setMessage("Attempting to fix bad import data"), this.errorCount++, this.fetchDocSummary();
return;
}
var t = t.feed.entry;
enyo.isArray(t) || (t = [ t ]);
for (var n = 0; n < t.length; n++) this.importItems[this.documentIndex].pages.push({
pageKey: t[n].id["#text"].slice(t[n].id["#text"].lastIndexOf("/") + 1),
title: t[n].title["#text"],
totalResults: 0
});
this.documentIndex++, this.documentIndex < this.importItems.length ? this.fetchDocSummary() : (this.$.progress.setMessage("Retrieving document content"), this.$.progress.setProgress(0), this.fetchAccountData(enyo.bind(this, this.startDataPull)));
},
fetchAccountData: function(e) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("accounts", [ "acctId", "acctCategory", "acctName" ]), {
onSuccess: enyo.bind(this, this.processAccountData, e)
});
},
processAccountData: function(e, t) {
this.accountList = {}, this.newAccounts = [];
var n = null;
for (var r = 0; r < t.length; r++) n = t[r], this.addAccountListObject(n.acctId, n.acctName, n.acctCategory);
e && e();
},
addAccountListObject: function(e, t, n) {
typeof this.accountList[n] == "undefined" && (this.accountList[n] = {}), this.accountList[n][t] = e;
},
startDataPull: function() {
this.documentIndex = 0, this.pageIndex = 0, this.errorCount = 0, this.downloadDocData(1, this.standardLimit);
},
downloadDocData: function(e, t) {
if (this.pageIndex >= this.importItems[this.documentIndex].pages.length) {
this.nextDocumentPage();
return;
}
this.$.gssc.getSheetData(this.importItems[this.documentIndex].sheetId, this.importItems[this.documentIndex].pages[this.pageIndex].pageKey, e, t, {
onSuccess: enyo.bind(this, this.processDocData),
onError: enyo.bind(this, this.showErrorMessage, enyo.bind(this, this.fetchsheetList))
});
},
processDocData: function(e, t) {
if (this.checkErrorCount(5)) return;
if (typeof t == "undefined" || typeof t.feed == "undefined") {
this.error("Bad data from Google."), this.$.progress.setMessage("Attempting to fix bad import data"), this.errorCount++, this.importItems[this.documentIndex].transactions = [], this.downloadDocData(1, this.standardLimit);
return;
}
this.importItems[this.documentIndex].limit = parseInt(t.feed["openSearch:itemsPerPage"]["#text"]), this.importItems[this.documentIndex].offset = parseInt(t.feed["openSearch:startIndex"]["#text"]), this.importItems[this.documentIndex].totalResults = parseInt(t.feed["openSearch:totalResults"]["#text"]);
if (this.importItems[this.documentIndex].totalResults <= 0 || typeof t.feed.entry == "undefined") {
this.nextDocumentPage();
return;
}
var t = t.feed.entry;
enyo.isArray(t) || (t = [ t ]), this.importItems[this.documentIndex].offset !== 1 || typeof t[0]["gsx:amount"] != "undefined" && typeof t[0]["gsx:amount"]["#text"] != "undefined" && typeof t[0]["gsx:description"] != "undefined" && typeof t[0]["gsx:description"]["#text"] != "undefined" && typeof t[0]["gsx:date"] != "undefined" && typeof t[0]["gsx:date"]["#text"] != "undefined" ? this.processDocDataFollower(t) : (this.createComponent({
name: "alertShow",
kind: "gts.ConfirmDialog",
title: "Warning! Missing Fields",
message: "Current page is missing essential fields for importing the data. These fields can be blank, but doing so may result in an improper import. The first row should have the following items: account, accountCat, date, amount, description, cleared, note. (" + this.importItems[this.documentIndex].name + " page " + (this.pageIndex + 1) + ")",
confirmText: "Skip Current Item",
cancelText: "Ignore and Continue",
onConfirm: "nextDocumentPage",
onCancel: "processDocDataIgnoreContinue"
}), this.responseHolder = t, this.$.alertShow.show());
},
processDocDataIgnoreContinue: function() {
this.$.alertShow.hide(), this.$.alertShow.destroy();
var e = this.responseHolder;
this.responseHolder = null, this.processDocDataFollower(e);
},
processDocDataFollower: function(e) {
var t = enyo.isArray(e) ? e : [], n;
for (var r = 0; r < t.length; r++) {
n = {}, n.amount = deformatAmount(this.getNode(t[r], "gsx:amount"));
if (GTS.Object.validNumber(n.amount)) {
n.amount = parseFloat(n.amount), n.itemId = parseInt(this.getNode(t[r], "gsx:gtid")), GTS.Object.validNumber(n.itemId) || (n.itemId = ""), n.accountName = this.getNode(t[r], "gsx:account"), n.accountCat = this.getNode(t[r], "gsx:accountcat"), n.accountName === "" && (n.accountName = this.importItems[this.documentIndex].name), n.accountCat === "" && (n.accountCat = "Imported Account");
if (typeof this.accountList[n.accountCat] == "undefined" || typeof this.accountList[n.accountCat][n.accountName] == "undefined") this.newAccounts.push({
acctName: n.accountName,
acctCategory: n.accountCat,
sort: 1,
acctNotes: ""
}), this.addAccountListObject(-1, n.accountName, n.accountCat);
n.linkedAccountName = this.getNode(t[r], "gsx:gtlinkedaccount"), n.linkedAccountCat = this.getNode(t[r], "gsx:gtlinkedaccountcat"), n.linkedRecord = parseInt(this.getNode(t[r], "gsx:gtlinkid"));
if (GTS.Object.validNumber(n.linkedRecord)) {
n.linkedAccountName === "" && (n.linkedAccountName = this.importItems[this.documentIndex].name), n.linkedAccountCat === "" && (n.linkedAccountCat = "Imported Account");
if (typeof this.accountList[n.linkedAccountCat] == "undefined" || typeof this.accountList[n.linkedAccountCat][n.linkedAccountName] == "undefined") this.newAccounts.push({
acctName: n.linkedAccountName,
acctCategory: n.linkedAccountCat,
acctNotes: ""
}), this.addAccountListObject(-1, n.linkedAccountName, n.linkedAccountCat);
} else n.linkedAccountName = "", n.linkedAccountCat = "", n.linkedRecord = "";
n.cleared = this.getNode(t[r], "gsx:cleared").toLowerCase(), n["cleared"] == 0 || n["cleared"] == "no" || n["cleared"] == "not" || n["cleared"] == "false" || n["cleared"] == "" ? n.cleared = 0 : n.cleared = 1, n.date = Date.deformat(this.getNode(t[r], "gsx:date")), GTS.Object.validNumber(n.date) || (n.date = Date.parse(new Date)), n.category = this.getNode(t[r], "gsx:gtcat"), n.category === "" || n.category.toLowerCase() === "none" ? n.category = [ {
category: "",
category2: "",
amount: ""
} ] : GTS.String.isJSON(n.category) ? n.category = enyo.json.parse(n.category) : n.category = [ {
category: n.category.split("|", 2)[0],
category2: n.category.split("|", 2)[1],
amount: ""
} ], n.desc = this.getNode(t[r], "gsx:description"), n.desc = n.desc.length > 0 ? n.desc : "Transaction Description", n.checkNum = this.getNode(t[r], "gsx:checknum"), n.note = this.getNode(t[r], "gsx:note"), n.payee = this.getNode(t[r], "gsx:payee"), this.importItems[this.documentIndex].transactions.push(n);
}
}
this.updateDocDownloadProgress(t.length), this.importItems[this.documentIndex].limit + this.importItems[this.documentIndex].offset < this.importItems[this.documentIndex].totalResults ? this.downloadDocData(this.importItems[this.documentIndex].limit + this.importItems[this.documentIndex].offset, this.importItems[this.documentIndex].limit) : this.nextDocumentPage();
},
updateDocDownloadProgress: function(e) {
var t = (e + this.importItems[this.documentIndex].offset) / this.importItems[this.documentIndex].totalResults, n = ((t > 1 ? 1 : t) + this.pageIndex) / this.importItems[this.documentIndex].pages.length, r = (n / 2 + this.documentIndex) / this.importItems.length * 100;
this.$.progress.setMessage(this.importItems[this.documentIndex].name + "<br />Downloading: " + (new Number(isNaN(n) ? 0 : n * 100)).toFixed(1) + "%"), isNaN(r) || this.$.progress.setProgress(r);
},
getNode: function(e, t) {
return typeof e == "undefined" || typeof e[t] == "undefined" || typeof e[t]["#text"] == "undefined" ? "" : GTS.String.trim(e[t]["#text"]);
},
nextDocumentPage: function() {
this.pageIndex++, this.pageIndex < this.importItems[this.documentIndex].pages.length ? this.downloadDocData(1, this.standardLimit) : this.newAccounts.length > 0 ? this.insertNewAccounts() : this.saveDocData(0, this.standardLimit / 2);
},
insertNewAccounts: function() {
var e = {
table: "accounts",
data: this.newAccounts
}, t = {
onSuccess: enyo.bind(this, this.fetchAccountData, enyo.bind(this, this.saveDocData, 0, this.standardLimit / 2))
};
Checkbook.globals.gts_db.insertData(e, t);
},
saveDocData: function(e, t) {
var n = [], r = e + t;
r >= this.importItems[this.documentIndex].transactions.length && (r = this.importItems[this.documentIndex].transactions.length);
for (var i = e; i < r; i++) {
this.importItems[this.documentIndex].transactions[i].account = this.accountList[this.importItems[this.documentIndex].transactions[i].accountCat][this.importItems[this.documentIndex].transactions[i].accountName], this.importItems[this.documentIndex].transactions[i].linkedRecord !== "" ? this.importItems[this.documentIndex].transactions[i].linkedAccount = this.accountList[this.importItems[this.documentIndex].transactions[i].linkedAccountCat][this.importItems[this.documentIndex].transactions[i].linkedAccountName] : delete this.importItems[this.documentIndex].transactions[i].linkedRecord, delete this.importItems[this.documentIndex].transactions[i].accountName, delete this.importItems[this.documentIndex].transactions[i].accountCat, delete this.importItems[this.documentIndex].transactions[i].linkedAccountName, delete this.importItems[this.documentIndex].transactions[i].linkedAccountCat, GTS.Object.validNumber(this.importItems[this.documentIndex].transactions[i].itemId) || delete this.importItems[this.documentIndex].transactions[i].itemId;
var s = this.importItems[this.documentIndex].transactions[i].category, o = [];
s.length > 1 && this.importItems[this.documentIndex].transactions[i].itemId ? o = Checkbook.globals.transactionManager.handleCategoryData(this.importItems[this.documentIndex].transactions[i]) : (this.importItems[this.documentIndex].transactions[i].category = s[0].category, this.importItems[this.documentIndex].transactions[i].category2 = s[0].category2), n.push(Checkbook.globals.gts_db.getReplace("transactions", this.importItems[this.documentIndex].transactions[i])), n = n.concat(o);
}
var u = {
onSuccess: enyo.bind(this, this.saveDocDataHandler, e, t),
onError: enyo.bind(this, this.showErrorMessage, enyo.bind(this, this.fetchsheetList), "Error while saving data, please try again. Contact <a href='mailto:GlitchTechScience@gmail.com'>GlitchTechScience@gmail.com</a> if this continues to occur.")
};
Checkbook.globals.gts_db.queries(n, u);
},
saveDocDataHandler: function(e, t) {
Checkbook.globals.accountManager.updateAccountModTime();
var n = (e + t) / this.importItems[this.documentIndex].transactions.length;
n = n > 1 ? 1 : n;
var r = (n / 2 + .5 + this.documentIndex) / this.importItems.length;
this.$.progress.setMessage(this.importItems[this.documentIndex].name + "<br />Saving: " + (new Number(n * 100)).toFixed(1) + "%"), this.$.progress.setProgress(r * 100), e + t < this.importItems[this.documentIndex].transactions.length ? this.saveDocData(e + t, t) : (this.allSheetsList[this.importItems[this.documentIndex].sheetIndex].selectStatus = !1, this.$.sheetList.render(), this.documentIndex++, this.pageIndex = 0, this.documentIndex < this.importItems.length ? this.downloadDocData(1, this.standardLimit) : (this.$.errorMessage.setErrTitle("Import Complete"), this.showErrorMessage(enyo.bind(this, this.closeImport, !0), "Imported " + this.importItems.length + " spreadsheets.")));
},
checkErrorCount: function(e) {
return e || (e = 3), this.errorCount >= 3 ? (this.error("Multiple sets of bad data from Google."), this.errorCount = 0, this.showErrorMessage(enyo.bind(this, this.fetchsheetList), "There has been an error: Multiple sets of bad data from Google. Please try again later."), !0) : !1;
},
fatalError: function(e) {
this.showErrorMessage(enyo.bind(this, this.closeImport, !1), e);
},
showErrorMessage: function(e, t) {
this.onErrorClose = e, this.$.progress.hide(), this.$.errorMessage.show(), this.$.errorMessage.setMainMessage(t);
},
closeErrorMessage: function() {
return this.$.errorMessage.hide(), this.onErrorClose(), !0;
},
closeImport: function(e) {
try {
enyo.windows.blockScreenTimeout(!1), this.log("Window: blockScreenTimeout: false");
} catch (t) {
this.log("Window Error (End)", t);
}
this.$.instructionsButton.setDisabled(!1), this.$.instructionsBar.show(), this.$.sheetListBar.hide(), this.$.instructions.show(), this.$.sheetList.hide(), this.$.errorMessage.hide(), this.$.progress.hide(), enyo.asyncMethod(this, this.doFinish, {
success: e
});
}
});

// export.js

enyo.kind({
name: "Checkbook.export",
kind: "FittableRows",
classes: "enyo-fit",
style: "height: 100%;",
acctList: [],
events: {
onFinish: ""
},
components: [ {
kind: "onyx.Toolbar",
classes: "text-center",
style: "position: relative;",
components: [ {
content: "Export System",
classes: "bigger"
}, {
kind: "onyx.Button",
ontap: "closeExport",
content: "x",
classes: "onyx-negative",
style: "position: absolute; right: 15px;"
} ]
}, {
kind: "enyo.Scroller",
horizontal: "hidden",
classes: "tardis-blue",
fit: !0,
components: [ {
name: "instructions",
classes: "light narrow-column padding-half-top",
style: "height: 100%;",
components: [ {
classes: "padding-std smaller",
allowHtml: !0,
content: "<p>To export your finances from this program you must have a Google Drive account. <br />Visit drive.google.com to sign up.</p><p><strong>Warning:</strong> Larger spreadsheets will take much longer to upload.</p>"
}, {
name: "saveCredentialsWrapper",
layoutKind: "enyo.FittableColumnsLayout",
noStretch: !0,
classes: "padding-std text-middle",
components: [ {
name: "saveCredentials",
kind: "onyx.Checkbox",
value: !0,
classes: "margin-right"
}, {
content: "Save credentials",
fit: !0
} ]
} ]
}, {
showing: !1,
name: "accountList",
kind: "Repeater",
classes: "light narrow-column padding-half-top",
onSetupItem: "setupRow",
components: [ {
kind: "onyx.Item",
tapHighlight: !0,
ontap: "accountSelectedChanged",
classes: "bordered text-middle",
components: [ {
name: "accountSelected",
kind: "onyx.Checkbox",
value: !1,
disabled: !0,
classes: "margin-half-right"
}, {
classes: "inline",
components: [ {
name: "icon",
kind: "enyo.Image",
classes: "accountIcon"
}, {
name: "iconLock",
kind: "enyo.Image",
src: "assets/padlock_1.png",
classes: "accountLockIcon unlocked"
} ]
}, {
classes: "margin-half-left inline",
components: [ {
name: "accountName"
}, {
name: "accountNote",
classes: "smaller"
} ]
} ]
} ]
} ]
}, {
name: "instructionsBar",
kind: "onyx.Toolbar",
classes: "text-center",
components: [ {
name: "instructionsButton",
kind: "onyx.Button",
content: "Authenticate",
ontap: "authenticateWithGoogle",
classes: "onyx-affirmative",
style: "min-width: 150px;"
} ]
}, {
showing: !1,
name: "accountListBar",
kind: "onyx.Toolbar",
classes: "text-center",
components: [ {
name: "accountListButton",
kind: "onyx.Button",
content: "Export Accounts",
ontap: "beginExportProcess",
classes: "onyx-affirmative deep-green",
style: "min-width: 150px;"
}, {
kind: "onyx.MenuDecorator",
onSelect: "menuItemClick",
components: [ {
kind: "onyx.Button",
components: [ {
content: "Select..."
} ]
}, {
kind: "onyx.Menu",
showOnTop: !0,
floating: !0,
components: [ {
content: "All",
value: 1
}, {
content: "None",
value: 2
}, {
content: "Invert",
value: 3
} ]
} ]
} ]
}, {
name: "progress",
kind: "GTS.ProgressDialog",
animateProgress: !0,
onCancel: "closeExport",
cancelText: "Cancel"
}, {
name: "errorMessage",
kind: "Checkbook.systemError",
errTitle: "Export Error",
mainMessage: "",
secondaryMessage: "",
onFinish: "closeErrorMessage"
}, {
name: "gapi",
kind: "GTS.Gapi",
onReady: "gapiReady"
}, {
name: "gapiAccess",
kind: "private.gapi"
}, {
name: "cryptoSystem",
kind: "Checkbook.encryption"
} ],
rendered: function() {
this.log(), this.inherited(arguments), this.$.instructions.show(), this.$.instructionsBar.show(), this.$.instructionsButton.setDisabled(!0), this.$.accountList.hide(), this.$.accountListBar.hide(), this.$.progress.show({
title: "Export Progress",
message: "Linking to Google...",
progress: 25
}), this.refreshLayout();
},
refreshLayout: function() {
this.log(), this.waterfall("onresize", "onresize", this);
},
gapiReady: function() {
this.log(), this.$.progress.setProgress(60), Checkbook.globals.gts_db.query("SELECT saveGSheetsData, gSheetPass FROM prefs LIMIT 1;", {
onSuccess: enyo.bind(this, this.decryptGapiData)
});
},
decryptGapiData: function(e) {
this.$.progress.setProgress(90), e.length > 0 ? (this.$.saveCredentials.setValue(e[0].saveGSheetsData), this.$.cryptoSystem.decryptString(e[0].gSheetPass, enyo.bind(this, this.loadGapiData))) : this.loadGapiData("");
},
loadGapiData: function(e) {
this.$.gapi.setApiKey(this.$.gapiAccess.getApiKey()), this.$.gapi.setClientId(this.$.gapiAccess.getClientId()), this.$.gapi.setClientSecret(this.$.gapiAccess.getClientSecret()), this.$.saveCredentialsWrapper.hide(), this.$.gapi.setAuthToken(enyo.json.parse(e)), this.$.instructionsButton.setDisabled(!1), this.$.progress.hide();
},
authenticateWithGoogle: function() {
this.log(), this.$.gapi.setScope([ "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://spreadsheets.google.com/feeds", "https://docs.google.com/feeds" ]), this.$.gapi.auth({
onSuccess: enyo.bind(this, this.userAuthenticated),
onError: enyo.bind(this, this.userNotAuthenticated)
}), this.$.progress.show({
title: "Export Progress",
message: "Authenticating...",
progress: 5
});
},
userNotAuthenticated: function() {
this.log(), this.closeExport();
},
userAuthenticated: function() {
this.log(), this.$.progress.show({
title: "Export Progress",
message: "Authenticated...",
progress: 15
}), this.$.saveCredentials.getValue() ? this.$.cryptoSystem.encryptString(enyo.json.stringify(this.$.gapi.getAuthToken()), enyo.bind(this, this.saveUserGData)) : this.saveUserGData(""), this.fetchAccounts();
},
saveUserGData: function(e) {
var t = {
saveGSheetsData: 0,
gSheetPass: ""
};
this.$.saveCredentials.getValue() && e.length > 0 && (t = {
saveGSheetsData: this.$.saveCredentials.getValue() ? 1 : 0,
gSheetPass: e
}), Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("prefs", t, {}));
},
fetchAccounts: function() {
this.log(), this.$.progress.show({
title: "Export Progress",
message: "Retrieving accounts...",
progress: 50
}), Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("accounts", [ "acctId", "acctName", "acctCategory", "acctLocked", "lockedCode", "IFNULL( ( SELECT accountCategories.icon FROM accountCategories WHERE accountCategories.name = acctCategory ), 'icon_2.png' ) AS acctCategoryIcon", "( SELECT accountCategories.catOrder FROM accountCategories WHERE accountCategories.name = acctCategory ) AS acctCatOrder", "IFNULL( ( SELECT COUNT( transactions.amount ) FROM transactions WHERE transactions.account = acctId ), 0 ) AS itemCount" ], null, [ "acctCatOrder", "acctName" ]), {
onSuccess: enyo.bind(this, this.renderAccountList)
});
},
renderAccountList: function(e) {
this.acctList = [];
for (var t = 0; t < e.length; t++) {
var n = e[t];
this.acctList.push({
acctId: n.acctId,
name: n.acctName,
cat: n.acctCategory,
icon: n.acctCategoryIcon,
itemCount: n.itemCount,
acctLocked: n.acctLocked,
lockedCode: n.lockedCode,
bypass: !1,
selectStatus: n["acctLocked"] != 1
});
}
this.acctList.length <= 0 ? (this.$.progress.hide(), this.showErrorMessage(enyo.bind(this, this.closeExport), "No data available to be exported.")) : this.showAccountList();
},
showAccountList: function() {
this.log(), this.$.progress.setMessage("Processing accounts..."), this.$.progress.setProgress(75), this.$.instructionsBar.hide(), this.$.instructions.hide(), this.$.accountListButton.setDisabled(!1), this.$.accountListBar.show(), this.$.accountList.show(), this.$.accountList.setCount(this.acctList.length), this.$.progress.hide();
},
setupRow: function(e, t) {
var n = t.index, r = t.item, i = this.acctList[n];
if (i) return r.$.accountName.setContent(i.name), r.$.accountNote.setContent(i.itemCount + " " + "Transaction" + (i.itemCount > 1 ? "s" : "")), r.$.icon.setSrc("assets/" + i.icon), r.$.iconLock.addRemoveClass("unlocked", i.acctLocked !== 1 || i.bypass), r.$.accountSelected.setChecked(i.selectStatus), !0;
},
accountSelectedChanged: function(e, t) {
this.acctList[t.index].acctLocked && !this.acctList[t.index].bypass ? Checkbook.globals.security.authUser(this.acctList[t.index].name + " " + "PIN Code", this.acctList[t.index].lockedCode, {
onSuccess: enyo.bind(this, this.authSuccessful, t.index)
}) : this.acctList[t.index].selectStatus = !this.acctList[t.index].selectStatus, this.$.accountList.renderRow(t.index);
},
authSuccessful: function(e) {
this.acctList[e].bypass = !0, this.acctList[e].selectStatus = !0, this.$.accountList.renderRow(e);
},
menuItemClick: function(e, t) {
if (t.selected.value === 1) {
for (var n = 0; n < this.acctList.length; n++) if (!this.acctList[n].acctLocked || this.acctList[n].bypass) this.acctList[n].selectStatus = !0;
} else if (t.selected.value === 2) for (var n = 0; n < this.acctList.length; n++) this.acctList[n].selectStatus = !1; else if (t.selected.value === 3) for (var n = 0; n < this.acctList.length; n++) if (!this.acctList[n].acctLocked || this.acctList[n].bypass) this.acctList[n].selectStatus = !this.acctList[n].selectStatus;
this.$.accountList.setCount(this.acctList.length);
},
beginExportProcess: function() {
this.log(), this.$.progress.show({
title: "Exporting",
message: "Preparing data...",
progress: 0
}), this.$.accountListButton.setDisabled(!0);
var e = [];
for (var t = 0; t < this.acctList.length; t++) this.acctList[t].selectStatus === !0 && e.push(enyo.mixin({
index: t
}, this.acctList[t]));
if (e.length <= 0) {
this.showErrorMessage(enyo.bind(this, this.closeExport), "Export complete.");
return;
}
try {
enyo.windows.blockScreenTimeout(!0), this.log("Window: blockScreenTimeout: true");
} catch (n) {
this.log("Window Error (Start)", n);
}
this.startNewSheet(e, 0);
},
startNewSheet: function(e, t) {
this.$.progress.setTitle("Exporting " + e[t].name), this.$.progress.setMessage(t + 1 + " of " + e.length + "<br />" + "Retrieving transactions"), this.$.progress.setProgress((t + 1) * 1 / 4 / e.length * 100), Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("transactions", [ "itemId", "linkedRecord", "amount", "checkNum", "cleared", "date", "desc", "note", "payee", ' ( CASE WHEN category = \'||~SPLIT~||\' THEN ( \'[\' || IFNULL( ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( \'{ "category": "\' || ts.genCat || \'", "category2" : "\' || ts.specCat || \'", "amount": "\' || ts.amount || \'" }\' ) AS json FROM transactionSplit ts WHERE ts.transId = itemId ORDER BY ts.amount DESC ) ), \'{ "category": "?", "category2" : "?", "amount": "0" }\' ) || \']\' ) ELSE category END ) AS category', " ( CASE WHEN category = '||~SPLIT~||' THEN 'PARSE_CATEGORY' ELSE category2 END ) AS category2", "IFNULL( ( SELECT accounts.acctName FROM accounts WHERE accounts.acctId = transactions.account ), '' ) AS accountName", "IFNULL( ( SELECT accounts.acctCategory FROM accounts WHERE accounts.acctId = transactions.account ), '' ) AS accountCat", "IFNULL( ( SELECT accounts.acctName FROM accounts WHERE accounts.acctId = transactions.linkedAccount ), '' ) AS linkedAccountName", "IFNULL( ( SELECT accounts.acctCategory FROM accounts WHERE accounts.acctId = transactions.linkedAccount ), '' ) AS linkedAccountCat" ], {
account: e[t].acctId
}, [ "date" ]), {
onSuccess: enyo.bind(this, this.buildSheetContent, e, t, 0, 100, {
accountId: e[t].acctId,
accountName: e[t].name,
accountCategory: e[t].cat,
csv: "account,accountCat,date,amount,description,cleared,checkNum,note,payee,gtId,gtCat,gtLinkId,gtLinkedAccount,gtLinkedAccountCat\n"
})
});
},
buildSheetContent: function(e, t, n, r, i, s) {
if (s.length <= 0) {
this.sheetComplete(e, t);
return;
}
var o = 0;
n + r < s.length ? o = n + r : o = s.length, this.$.progress.setMessage(t + 1 + " of " + e.length + "<br />" + "Processing account"), this.$.progress.setProgress((t + 1) * (2 + o / s.length) / 4 / e.length * 100);
for (var u = n; u < o; u++) {
var a = s[u];
i.csv += '"' + GTS.String.cleanString(a.accountName) + '",' + '"' + GTS.String.cleanString(a.accountCat) + '",' + "\"'" + (new Date(parseInt(a.date))).format("special") + '",' + '"' + formatAmount(a.amount) + '",' + '"' + GTS.String.cleanString(a.desc) + '",' + '"' + (a["cleared"] == 1 ? "Yes" : "No") + '",' + '"' + GTS.String.cleanString(a.checkNum) + '",' + '"' + GTS.String.cleanString(a.note) + '",' + '"' + GTS.String.cleanString(a.payee) + '",' + '"' + a.itemId + '",' + '"' + enyo.json.stringify(Checkbook.globals.transactionManager.parseCategoryDB(a.category, a.category2)).replace(/"/g, '""') + '",' + '"' + a.linkedRecord + '",' + '"' + GTS.String.cleanString(a.linkedAccountName) + '",' + '"' + GTS.String.cleanString(a.linkedAccountCat) + '"\n';
}
o < s.length ? enyo.asyncMethod(this, this.buildSheetContent, e, t, o, r, i, s) : this.uploadSheet(e, t, i);
},
uploadSheet: function(e, t, n) {
this.$.progress.setMessage(t + 1 + " of " + e.length + "<br />" + "Uploading data"), this.$.progress.setProgress((t + 1) * 3 / 4 / e.length * 100);
const r = "----END_OF_PART----", i = "\r\n--" + r + "\r\n", s = "\r\n--" + r + "--", o = "text/csv";
var u = new Date, a = "[" + enyo.fetchAppInfo().title + "] " + n.accountName + " [" + n.accountCategory + "] [" + u.format({
date: "long",
time: "short"
}) + "]", f = {
title: GTS.String.cleanString(a),
mimeType: o
}, l = i + "Content-Type: application/json\r\n\r\n" + JSON.stringify(f) + i + "Content-Type: " + o + "\r\n" + "\r\n" + n.csv + s, c = gapi.client.request({
path: "/upload/drive/v2/files?convert=true",
method: "POST",
params: {
uploadType: "multipart"
},
headers: {
"Content-Type": 'multipart/mixed; boundary="' + r + '"'
},
body: l
});
c.execute(enyo.bind(this, this.requestComplete, e, t));
},
requestComplete: function(e, t, n) {
if (!n.error) this.sheetComplete(e, t); else {
var r = "Code: " + n.error.code + "<br />" + "Message" + n.error.message;
this.showErrorMessage(this.showAccountList, r);
}
},
sheetComplete: function(e, t) {
this.$.progress.setMessage("Account uploaded"), this.$.progress.setProgress((t + 1) * 4 / 4 / e.length * 100), t++, t < e.length ? this.startNewSheet(e, t) : (this.$.progress.hide(), this.$.errorMessage.setErrTitle("Export Complete"), this.showErrorMessage(enyo.bind(this, this.closeExport), e.length + " account" + (e.length > 1 ? "s" : "") + " exported."));
},
showErrorMessage: function(e, t) {
this.onErrorClose = e, this.$.progress.hide(), this.$.errorMessage.show(), this.$.errorMessage.setMainMessage(t);
},
closeErrorMessage: function() {
return this.log(), this.$.errorMessage.hide(), this.onErrorClose(), !0;
},
closeExport: function() {
this.log();
try {
enyo.windows.blockScreenTimeout(!1), this.log("Window: blockScreenTimeout: false");
} catch (e) {
this.log("Window Error (End)", e);
}
this.$.instructions.show(), this.$.instructionsBar.show(), this.$.instructionsButton.setDisabled(!1), this.$.accountList.hide(), this.$.accountListBar.hide(), this.$.errorMessage.hide(), this.$.progress.hide(), this.doFinish();
}
});

// about.js

enyo.kind({
name: "Checkbook.about",
kind: "onyx.Popup",
classes: "small-popup",
modal: !0,
centered: !0,
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !0,
events: {
onFinish: ""
},
components: [ {
classes: "h-box box-align-center margin-half-bottom",
components: [ {
kind: "enyo.Image",
src: enyo.fetchAppInfo().icon
}, {
content: enyo.fetchAppInfo().title + " v" + enyo.fetchAppInfo().version,
allowHtml: !0,
classes: "box-flex-1 padding-left biggest"
}, {
kind: "onyx.Button",
content: "X",
ontap: "doFinish",
classes: "onyx-blue"
} ]
}, {
classes: "text-center margin-half-top margin-half-bottom",
components: [ {
content: "Thank you for using " + enyo.fetchAppInfo().title + " powered by"
}, {
kind: "enyo.Image",
src: "assets/enyo-logo.png",
style: "height: 32px; width: 87px;"
} ]
}, {
showing: !1,
classes: "h-box box-align-center margin-half-top margin-half-bottom",
components: [ {
kind: "enyo.Image",
src: "assets/application-web.png"
}, {
content: "<a href='http://forums.precentral.net/glitchtech-science/' target='_blank'>Discussion Forums</a>",
classes: "padding-left dark-link",
allowHtml: !0
} ]
}, {
showing: !1,
classes: "h-box box-align-center margin-half-top margin-half-bottom",
components: [ {
kind: "enyo.Image",
src: "assets/application-web.png"
}, {
content: enyo.fetchAppInfo().vendorurl,
classes: "padding-left dark-link",
allowHtml: !0
} ]
}, {
classes: "h-box box-align-center margin-half-top margin-half-bottom",
components: [ {
kind: "enyo.Image",
src: "assets/twitter-icon.png"
}, {
content: "@GlitchTech",
classes: "padding-left dark-link",
allowHtml: !0
} ]
}, {
classes: "h-box box-align-center margin-half-top margin-half-bottom",
components: [ {
kind: "enyo.Image",
src: "assets/application-email.png"
}, {
content: enyo.fetchAppInfo().vendoremail,
classes: "padding-left dark-link",
allowHtml: !0
} ]
}, {
content: enyo.fetchAppInfo().copyright,
allowHtml: !0,
classes: "smaller margin-top"
}, {
kind: "Signals",
onbackbutton: "test",
onmenubutton: "test",
onsearchbutton: "test",
onkeydown: "test"
} ],
test: function() {
if (!this.showing) return;
this.log(arguments);
}
});

// manager.js

enyo.kind({
name: "Checkbook.accounts.manager",
kind: enyo.Component,
components: [ {
name: "cryptoSystem",
kind: "Checkbook.encryption"
} ],
accountObject: {
lastModified: 0,
lastBuild: -1,
defaultAccountIndex: -1,
accounts: [],
accountsList: [],
idTable: [],
processing: !1,
processingQueue: []
},
constructor: function() {
this.inherited(arguments);
if (!Checkbook.globals.gts_db) {
this.log("creating database object.");
var e = new GTS.database(getDBArgs());
}
this.bound = {
_errorHandler: enyo.bind(this, this._errorHandler)
};
},
createAccount: function(e, t) {
enyo.mixin(e, {
sect_order: [ "( SELECT IFNULL( MAX( sect_order ), 0 ) FROM accounts )", !0 ]
}), this._prepareDataObject(e), this.$.cryptoSystem.encryptString(e.lockedCode, enyo.bind(this, this._createAccountFollower, e, t));
},
_createAccountFollower: function(e, t, n) {
if (e["auto_savings"] == 0 || !GTS.Object.isNumber(e.auto_savings_link) || e.auto_savings_link < 0) e.auto_savings = 0, e.auto_savings_link = -1;
e["acctLocked"] == 0 || n == "" || !n ? (e.acctLocked = 0, e.lockedCode = "") : (e.acctLocked = 1, e.lockedCode = n);
var r = [ Checkbook.globals.gts_db.getInsert("accounts", e) ];
e.defaultAccount === 1 && r.unshift(Checkbook.globals.gts_db.getUpdate("accounts", {
defaultAccount: 0
}, {
"0": "0"
})), Checkbook.globals.gts_db.queries(r, this._prepareModOptions(t));
},
updateAccount: function(e, t, n, r) {
this._prepareDataObject(e), this.$.cryptoSystem.encryptString(e.lockedCode, enyo.bind(this, this._updateAccountFollower, e, t, n, r));
},
_updateAccountFollower: function(e, t, n, r, i) {
if (e["auto_savings"] == 0 || !GTS.Object.isNumber(e.auto_savings_link) || e.auto_savings_link < 0) e.auto_savings = 0, e.auto_savings_link = -1;
e["acctLocked"] == 0 || i == "" || !i ? (e.acctLocked = 0, e.lockedCode = "") : n && (e.acctLocked = 1, e.lockedCode = i);
var s = [ Checkbook.globals.gts_db.getUpdate("accounts", e, {
acctId: t
}) ];
e.defaultAccount === 1 && s.unshift(Checkbook.globals.gts_db.getUpdate("accounts", {
defaultAccount: 0
})), Checkbook.globals.gts_db.queries(s, this._prepareModOptions(r));
},
updateAccountBalView: function(e, t, n) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("accounts", {
bal_view: t
}, {
rowid: e
}), this._prepareModOptions(n));
},
updateAccountSorting: function(e, t, n) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("accounts", {
sort: t
}, {
rowid: e
}), this._prepareModOptions(n));
},
deleteAccount: function(e, t) {
var n = [ Checkbook.globals.gts_db.getDelete("transactions", {
account: e
}), Checkbook.globals.gts_db.getDelete("repeats", {
rep_acctId: e
}), Checkbook.globals.gts_db.getUpdate("transactions", {
linkedAccount: "",
linkedRecord: ""
}, {
linkedAccount: e
}), Checkbook.globals.gts_db.getUpdate("repeats", {
rep_linkedAcctId: ""
}, {
rep_linkedAcctId: e
}), Checkbook.globals.gts_db.getDelete("accounts", {
acctId: e
}) ];
Checkbook.globals.gts_db.queries(n, this._prepareModOptions(t));
},
updateDefaultAccount: function(e, t) {
var n = [ Checkbook.globals.gts_db.getUpdate("accounts", {
defaultAccount: 0
}, null), Checkbook.globals.gts_db.getUpdate("accounts", {
defaultAccount: 1
}, {
acctId: e
}) ], r = this.fetchAccountIndex(e);
r >= 0 ? this.accountObject.defaultAccountIndex = r : this.updateAccountModTime(), Checkbook.globals.gts_db.queries(n, t);
},
fetchDefaultAccount: function(e) {
this.accountObject.lastModified <= this.accountObject.lastBuild ? enyo.isFunction(e.onSuccess) && (GTS.Object.isNumber(this.accountObject.defaultAccountIndex) && this.accountObject.defaultAccountIndex >= 0 ? e.onSuccess(this.accountObject.accounts[this.accountObject.defaultAccountIndex]) : e.onSuccess()) : (e = this._getOptions(e), this.accountObject.processingQueue.push({
source: "fetchDefaultAccount",
func: enyo.bind(this, this.fetchDefaultAccount, e)
}), this.accountObject.processing || (this.accountObject.processing = !0, this._buildAccountObjects(e.onError)));
},
fetchAccountIndex: function(e) {
return this.accountObject.lastModified <= this.accountObject.lastBuild ? this.accountObject.idTable.indexOf(e) : -1;
},
fetchAccount: function(e, t) {
if (this.accountObject.lastModified <= this.accountObject.lastBuild) {
var n = this.fetchAccountIndex(e);
n >= 0 && enyo.isFunction(t.onSuccess) ? t.onSuccess(this.accountObject.accounts[n]) : enyo.isFunction(t.onError) && t.onError();
} else this.accountObject.processingQueue.push({
source: "fetchAccount",
func: enyo.bind(this, this.fetchAccount, e, t)
}), this.accountObject.processing || (this.accountObject.processing = !0, this._buildAccountObjects(this._getOptions(t).onError));
},
fetchAccountBalance: function(e, t) {
var n = new Date, r = Date.parse(n);
n.setHours(23, 59, 59, 999), n = Date.parse(n);
var i = new GTS.databaseQuery({
sql: "SELECT IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) ), 0 ) AS balance0, IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) AND transactions.cleared = 1 ), 0 ) AS balance1, IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND transactions.cleared = 0 ), 0 ) AS balance3, IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) AS balance2 FROM accounts WHERE acctId = ?",
values: [ r, n, r, n, e ]
});
Checkbook.globals.gts_db.query(i, {
onSuccess: function(e) {
enyo.isFunction(t.onSuccess) && (e = e[0], e.balance0 = Math.round(e.balance0 * 100) / 100, e.balance1 = Math.round(e.balance1 * 100) / 100, e.balance2 = Math.round(e.balance2 * 100) / 100, e.balance3 = Math.round(e.balance3 * 100) / 100, t.onSuccess(e));
},
onError: t.onError
});
},
fetchAccounts: function(e, t, n) {
if (this.accountObject.lastModified <= this.accountObject.lastBuild) {
if (enyo.isFunction(e.onSuccess)) {
var r = [];
if (!e.showHidden) {
n = GTS.Object.isNumber(n) ? n : 0, t = GTS.Object.isNumber(t) ? t : this.accountObject.accounts.length;
for (var i = n; i < t; i++) this.accountObject.accounts[i].hidden !== 2 && r.push(this.accountObject.accounts[i]);
} else r = this.accountObject.accounts.slice(GTS.Object.isNumber(n) ? n : 0, t);
e.onSuccess(r);
}
} else e = this._getOptions(e), this.accountObject.processingQueue.push({
source: "fetchAccounts",
func: enyo.bind(this, this.fetchAccounts, e, t, n)
}), this.accountObject.processing || (this.accountObject.processing = !0, this._buildAccountObjects(e.onError));
},
fetchAccountsList: function(e, t, n) {
this.accountObject.lastModified <= this.accountObject.lastBuild ? enyo.isFunction(e.onSuccess) && e.onSuccess(this.accountObject.accountsList.slice(GTS.Object.isNumber(n) ? n : 0, t)) : (this.accountObject.processingQueue.push({
source: "fetchAccountsList",
func: enyo.bind(this, this.fetchAccountsList, e, t, n)
}), this.accountObject.processing || (this.accountObject.processing = !0, this._buildAccountObjects(e.onError)));
},
fetchOverallBalances: function(e) {
var t = new Date, n = Date.parse(t);
t.setHours(23, 59, 59, 999), t = Date.parse(t);
var r = new GTS.databaseQuery({
sql: "SELECT SUM( IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) ), 0 ) ) AS balance0, SUM( IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) AND transactions.cleared = 1 ), 0 ) ) AS balance1, SUM( IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) ) AS balance2, SUM( IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND transactions.cleared = 0 ), 0 ) ) AS balance3, SUM( CASE WHEN bal_view = 0 THEN IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) ), 0 ) WHEN bal_view = 1 THEN IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) AND transactions.cleared = 1 ), 0 ) WHEN bal_view = 2 THEN IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) WHEN bal_view = 3 THEN IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND transactions.cleared = 0 ), 0 ) ELSE 0 END ) AS stdBal FROM accounts WHERE hidden = 0",
values: [ n, t, n, t, n, t, n, t ]
});
Checkbook.globals.gts_db.query(r, {
onSuccess: enyo.bind(this, this.fetchOverallBalancesHandler, e.onSuccess),
onError: e.onError
});
},
fetchOverallBalancesHandler: function(e, t) {
var n = [ 0, 0, 0, 0, 0 ];
if (t.length > 0) {
var r = t[0];
n[0] = r.balance0, n[1] = r.balance1, n[2] = r.balance2, n[3] = r.balance3, n[4] = r.stdBal;
}
enyo.isFunction(e) && e(n);
},
_buildAccountObjects: function(e, t, n) {
t = GTS.Object.isNumber(t) ? t : 100, n = GTS.Object.isNumber(n) ? n : 0, n <= 0 && (this.accountObject.defaultAccountIndex = -1, this.accountObject.idTable = [], this.accountObject.accounts = [], this.accountObject.accountsList = []);
var r = new Date, i = Date.parse(r);
r.setHours(23, 59, 59, 999), r = Date.parse(r);
var s = new GTS.databaseQuery({
sql: "SELECT *, ( SELECT qry FROM acctTrsnSortOptn WHERE sortId = IFNULL( accounts.sort, 1) ) AS sortQry, IFNULL( ( SELECT COUNT( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) AS itemCount, IFNULL( ( SELECT accountCategories.icon FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ), 'icon_2.png' ) AS acctCategoryIcon, ( SELECT accountCategories.color FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ) AS acctCategoryColor, ( SELECT accountCategories.catOrder FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ) AS acctCatOrder, ( SELECT accountCategories.rowid FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ) AS acctCatId, IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) ), 0 ) AS balance0, IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) AND transactions.cleared = 1 ), 0 ) AS balance1, IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND transactions.cleared = 0 ), 0 ) AS balance3, IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) AS balance2 FROM accounts ORDER BY " + accountSortOptions[Checkbook.globals.prefs.custom_sort].query + " LIMIT ? OFFSET ?",
values: [ i, r, i, r, t, n ]
});
Checkbook.globals.gts_db.query(s, {
onSuccess: enyo.bind(this, this._buildAccountObjectsHandler, e, t, n),
onError: e
});
},
_buildAccountObjectsHandler: function(e, t, n, r) {
this.log(t, n, r.length);
for (var i = 0; i < r.length; i++) {
var s = r[i];
s["defaultAccount"] == 1 && (this.accountObject.defaultAccountIndex = n + i), this.accountObject.idTable[n + i] = s.acctId, this.accountObject.accountsList[n + i] = {
content: s.acctName,
icon: "assets/" + s.acctCategoryIcon,
color: s.acctCategoryColor,
value: s.acctId,
components: [ {
kind: "onyx.Icon",
src: "assets/" + s.acctCategoryIcon,
classes: "margin-right img-icon"
}, {
content: s.acctName
} ]
}, this.accountObject.accounts[n + i] = enyo.clone(s);
}
if (t > r.length) {
while (this.accountObject.processingQueue.length > 0) {
var o = this.accountObject.processingQueue.shift();
enyo.isFunction(o.func) && enyo.asyncMethod(null, o.func);
}
this.accountObject.lastBuild = Date.parse(new Date), this.accountObject.processing = !1, this.accountObject.processingQueue = [];
} else this._buildAccountObjects(e, t, n + t);
},
_prepareDataObject: function(e) {
for (key in e) typeof e[key] == "boolean" ? e[key] = e[key] ? 1 : 0 : typeof e[key] == "undefined" && (e[key] = "");
},
_getOptions: function(e) {
var t = {
onSuccess: this._emptyFunction,
onError: this.bound._errorHandler
};
return typeof e == "undefined" && (e = {}), enyo.mixin(t, e), t;
},
_prepareModOptions: function(e) {
var t = {};
return e && enyo.isFunction(e.onSuccess) ? t.onSuccess = enyo.bind(this, function() {
this.updateAccountModTime(), e.onSuccess(!0);
}) : t.onSuccess = enyo.bind(this, this.updateAccountModTime), e && enyo.isFunction(e.onError) ? t.onError = e.onError : delete t.onError, t;
},
updateAccountModTime: function() {
this.accountObject.lastModified = Date.parse(new Date);
},
_emptyFunction: function() {},
_errorHandler: function() {
if (arguments.length <= 0) return;
enyo.error("Account Control Error: " + Object.toJSON(arguments)), Checkbook.globals.criticalError && Checkbook.globals.criticalError.load(null, "Account Control Error: " + Object.toJSON(arguments), null);
}
});

// list.js

enyo.kind({
name: "Checkbook.accounts.list",
fit: !0,
style: "position: relative;",
classes: "enyo-fit",
accounts: [],
events: {
onSetupRow: "",
onLoadStart: "",
onLoadStop: ""
},
published: {
balanceView: 4,
editMode: !1,
reorderable: !0,
showHidden: !1,
horizontal: "hidden"
},
components: [ {
name: "entries",
kind: "enyo.List",
classes: "enyo-fit",
reorderable: !0,
enableSwipe: !1,
onSetupItem: "handleSetupRow",
onReorder: "listReorder",
onSetupReorderComponents: "setupReorderComponents",
onSetupPinnedReorderComponents: "setupPinnedReorderComponents",
onSetupSwipeItem: "setupSwipeItem",
onSwipeComplete: "swipeComplete",
components: [ {
name: "accountItem",
kind: "GTS.Item",
classes: "bordered account-item",
tapHighlight: !0,
holdHighlight: !1,
ontap: "accountTapped",
components: [ {
name: "catDivider",
kind: "GTS.Divider",
ontap: "dividerTapped",
useFittable: !1
}, {
layoutKind: "",
classes: "account h-box box-pack-center box-align-center",
components: [ {
name: "icon",
kind: "enyo.Image",
classes: "accountIcon"
}, {
name: "iconLock",
kind: "enyo.Image",
src: "assets/padlock_1.png",
classes: "accountLockIcon unlocked"
}, {
name: "name",
classes: "accountName text-ellipsis box-flex-1"
}, {
name: "balance"
} ]
}, {
name: "note",
allowHtml: !0,
classes: "note smaller text-ellipsis"
} ]
} ],
reorderComponents: [ {
name: "reorderContent",
layoutKind: "FittableColumnsLayout",
classes: "enyo-fit deep-green-trans padding-std",
components: [ {
name: "reorderIcon",
kind: "enyo.Image",
classes: "accountIcon"
}, {
name: "reorderName",
classes: "text-ellipsis accountName",
fit: !0
} ]
} ],
pinnedReorderComponents: [ {
name: "pinnedReorderItem",
layoutKind: "FittableColumnsLayout",
classes: "enyo-fit rich-brown-trans padding-std",
components: [ {
name: "pinIcon",
kind: "enyo.Image",
classes: "accountIcon"
}, {
name: "pinName",
classes: "text-ellipsis accountName",
fit: !0
}, {
showing: !1,
kind: "onyx.Button",
ontap: "dropPinnedRow",
content: "Drop"
} ]
} ],
swipeableComponents: [ {
name: "swipeItem",
layoutKind: "FittableColumnsLayout",
classes: "enyo-fit naka-red-trans padding-std",
components: [ {
content: "Delete Account?",
fit: !0
}, {
kind: "onyx.Button",
ontap: "",
content: "Cancel"
}, {
kind: "onyx.Button",
ontap: "",
classes: "onyx-negative",
content: "Cancel"
} ]
} ]
}, {
kind: "Signals",
accountChanged: "renderAccountList",
accountSortChanged: "renderAccountList",
balanceChanged: "refresh",
accountBalanceChanged: "accountBalanceChanged"
} ],
balanceViewChanged: function() {
this.refresh();
},
reorderableChanged: function() {
this.$.entries.setReorderable(this.reorderable);
},
showHiddenChanged: function() {
this.renderAccountList();
},
renderAccountList: function() {
this.log(), this.doLoadStart(), this.accounts = [], Checkbook.globals.accountManager.fetchAccounts({
showHidden: this.showHidden,
onSuccess: enyo.bind(this, this.dataResponse)
});
},
dataResponse: function(e) {
this.accounts = enyo.clone(e), this.refresh(), enyo.asyncMethod(this, this.doLoadStop);
},
refresh: function() {
this.log(), this.$.entries.setCount(this.accounts.length), this.$.entries.refresh();
},
renderRow: function(e) {
typeof e != "undefined" && !isNaN(e) && this.$.entries.renderRow(e);
},
dividerTapped: function(e, t) {
return t.preventDefault(), !0;
},
accountTapped: function(e, t) {
var n = this.accounts[t.index];
if (n) {
var r, i = {};
this.editMode ? (r = "modifyAccount", i = {
name: "editAccount",
kind: "Checkbook.accounts.modify",
acctId: this.accounts[t.index].acctId,
onFinish: enyo.bind(this, this.editAccountComplete, t.index)
}) : (r = "viewAccount", i = {
account: n
}), n["acctLocked"] == 1 ? Checkbook.globals.security.authUser(n.acctName + " " + "PIN Code", n.lockedCode, {
onSuccess: function() {
enyo.Signals.send(r, i);
}
}) : enyo.Signals.send(r, i);
}
return !0;
},
editAccountComplete: function(e, t, n) {
this.log();
if (n.action === 1 && n.actionStatus === !0) {
var r = this;
Checkbook.globals.accountManager.fetchAccount(this.accounts[e].acctId, {
onSuccess: function() {
enyo.Signals.send("accountChanged", {
accountId: r.accounts[e].acctId
});
}
});
} else n.action === 2 && (this.log("Account deleted"), enyo.Signals.send("accountChanged", {
accountId: this.accounts[e].acctId,
deleted: !0
}));
},
setupReorderComponents: function(e, t) {
var n = this.accounts[t.index];
n && (this.$.reorderName.setContent(n.acctName), this.$.reorderIcon.setSrc("assets/" + n.acctCategoryIcon));
},
listReorder: function(e, t) {
if (t.reorderTo != t.reorderFrom && t.reorderTo > -1 && t.reorderTo < this.accounts.length) {
var n = enyo.clone(this.accounts[t.reorderFrom]);
this.accounts.splice(t.reorderFrom, 1), this.accounts.splice(t.reorderTo, 0, n);
var r = [];
for (var i = 0; i < this.accounts.length; i++) r.push(Checkbook.globals.gts_db.getUpdate("accounts", {
sect_order: i
}, {
rowid: this.accounts[i].acctId
}));
Checkbook.globals.prefs.custom_sort !== 1 && (Checkbook.globals.prefs.custom_sort = 1, r.push(new GTS.databaseQuery({
sql: "UPDATE prefs SET custom_sort = ?;",
values: [ Checkbook.globals.prefs.custom_sort ]
}))), Checkbook.globals.gts_db.queries(r), this.refresh(), enyo.Signals.send("accountSortOptionChanged");
}
},
setupPinnedReorderComponents: function(e, t) {
var n = this.accounts[t.index];
n && (this.$.pinName.setContent(n.acctName), this.$.pinIcon.setSrc("assets/" + n.acctCategoryIcon), enyo.asyncMethod(this, this.dropPinnedRow, e, t));
},
dropPinnedRow: function(e, t) {
this.$.entries.dropPinnedRow(t);
},
setupSwipeItem: function(e, t) {
this.log("NYI", arguments);
},
swipeComplete: function(e, t) {
this.log("NYI", arguments);
},
accountDeleted: function(e, t) {
var n = this;
return Checkbook.globals.accountManager.deleteAccount(this.accounts[t.index].acctId, {
onSuccess: function() {
enyo.Signals.send("accountChanged", {
accountId: n.accounts[t.index].acctId,
deleted: !0
});
}
}), !0;
},
handleSetupRow: function(e, t) {
return enyo.isFunction(this.doSetupRow) && this.onSetupRow !== "" ? this.doSetupRow(t) : this.setupRow(e, t);
},
setupRow: function(e, t) {
var n = t.index, r = this.accounts[n];
if (r) {
r.index = n, this.$.accountItem.addRemoveClass("alt-row", r.index % 2 === 0), this.$.accountItem.addRemoveClass("norm-row", r.index % 2 !== 0), this.$.accountItem.addRemoveClass("hiddenAccount", r.hidden === 2 && this.showHidden), this.$.accountItem.addRemoveClass("maskedAccount", r.hidden === 1), this.$.icon.setSrc("assets/" + r.acctCategoryIcon), this.$.iconLock.addRemoveClass("unlocked", r.acctLocked !== 1), this.$.name.setContent(r.acctName);
var i = this.balanceView === 4 ? r.bal_view : this.balanceView;
switch (i) {
case 0:
r.balance = r.balance0;
break;
case 1:
r.balance = r.balance1;
break;
case 2:
r.balance = r.balance2;
break;
case 3:
r.balance = r.balance3;
break;
default:
r.balance = 0;
}
return r.balance = prepAmount(r.balance), this.$.balance.setContent(formatAmount(r.balance)), this.$.balance.addRemoveClass("positiveBalance", r.balance > 0), this.$.balance.addRemoveClass("negativeBalance", r.balance < 0), this.$.balance.addRemoveClass("neutralBalance", r["balance"] == 0), this.$.note.setContent(r.acctNotes.replace(/\n/, "<br />")), this.$.catDivider.setContent(r.acctCategory), this.$.catDivider.canGenerate = (Checkbook.globals.prefs.custom_sort === 0 || Checkbook.globals.prefs.custom_sort === 3) && (r.index <= 0 || r.acctCategory !== this.accounts[r.index - 1].acctCategory), !0;
}
},
accountBalanceChanged: function(e, t) {
if (!t || !t.accounts) {
this.renderAccountList();
return;
}
t = t.accounts;
if (typeof t.account == "undefined" && typeof t.linkedAccount == "undefined" && typeof t.atAccount == "undefined") {
this.renderAccountList();
return;
}
if (typeof t["account"] != "undefined") {
var n = t.account >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex(t.account) : -1;
n >= 0 && (typeof t.accountBal != "undefined" && GTS.Object.size(t.accountBal) > 0 ? this.accountBalanceChangedHandler(n, t.accountBal) : Checkbook.globals.accountManager.fetchAccountBalance(t.account, {
onSuccess: enyo.bind(this, this.accountBalanceChangedHandler, n)
}));
}
if (typeof t["linkedAccount"] != "undefined") {
var r = t.linkedAccount >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex(t.linkedAccount) : -1;
r >= 0 && Checkbook.globals.accountManager.fetchAccountBalance(t.linkedAccount, {
onSuccess: enyo.bind(this, this.accountBalanceChangedHandler, r)
});
}
if (typeof t.atAccount != "undefined" && t["linkedAccount"] != t["atAccount"]) {
var r = t.atAccount >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex(t.atAccount) : -1;
r >= 0 && Checkbook.globals.accountManager.fetchAccountBalance(t.atAccount, {
onSuccess: enyo.bind(this, this.accountBalanceChangedHandler, r)
});
}
},
accountBalanceChangedHandler: function(e, t) {
if (typeof t == "undefined" || isNaN(e) || e < 0 || e >= this.accounts.length) return;
this.accounts[e].balance0 = t.balance0, this.accounts[e].balance1 = t.balance1, this.accounts[e].balance2 = t.balance2, this.accounts[e].balance3 = t.balance3, this.renderRow(e);
}
});

// view.js

enyo.kind({
name: "Checkbook.accounts.view",
classes: "v-box",
accounts: [],
totalBalance: [ 0, 0, 0, 0, 0 ],
balanceView: 4,
components: [ {
name: "header",
kind: "onyx.Toolbar",
layoutKind: "FittableColumnsLayout",
components: [ {
kind: "enyo.Image",
src: "assets/dollar_sign_1.png",
classes: "img-icon",
style: "margin-right: 0.25em; height: 32px;"
}, {
content: "Checkbook",
classes: "big enyo-text-ellipsis",
fit: !0
}, {
name: "balanceMenu",
kind: "Checkbook.balanceMenu",
onChange: "handleBalanceButton",
style: "padding: 0 8px; margin: 0;"
}, {
name: "editOverlay",
content: "Edit Accounts",
classes: "enyo-fit text-center header-overlay",
showing: !1
} ]
}, {
name: "entries",
kind: "Checkbook.accounts.list",
classes: "box-flex-1",
balanceView: 4,
editMode: !1,
showHidden: !1,
onLoadStart: "showLoading",
onLoadStop: "hideLoading"
}, {
kind: "onyx.MoreToolbar",
classes: "rich-brown",
components: [ {
kind: "onyx.MenuDecorator",
onSelect: "sortMenuSelected",
components: [ {
kind: "onyx.Button",
classes: "padding-none transparent",
components: [ {
kind: "onyx.Icon",
src: "assets/menu_icons/sort.png"
} ]
}, {
name: "sortMenu",
kind: "GTS.SelectedMenu",
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
style: "min-width: 225px;",
components: accountSortOptions
} ]
}, {
classes: "text-center",
fit: !0,
components: [ {
name: "addAccountButton",
kind: "onyx.Button",
ontap: "addAccount",
classes: "margin-half-right padding-none transparent",
components: [ {
kind: "onyx.Icon",
src: "assets/menu_icons/new.png"
} ]
}, {
kind: "onyx.Button",
ontap: "toggleLock",
classes: "margin-half-left padding-none transparent",
components: [ {
name: "editModeButtonIcon",
kind: "onyx.Icon",
src: "assets/menu_icons/lock.png",
classes: "onyx-icon-button onyx-icon-toggle"
} ]
} ]
}, {
kind: "onyx.MenuDecorator",
onSelect: "searchMenuSelected",
components: [ {
kind: "onyx.Button",
classes: "padding-none transparent",
components: [ {
kind: "onyx.Icon",
src: "assets/menu_icons/search.png"
} ]
}, {
kind: "onyx.Menu",
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
components: [ {
content: "Toggle Hidden"
}, {
showing: !1,
content: "Reports"
}, {
showing: !1,
content: "Budget"
}, {
showing: !1,
content: "Search"
} ]
} ]
} ]
}, {
name: "loadingScrim",
kind: "onyx.Scrim",
classes: "enyo-fit onyx-scrim-translucent",
showing: !0,
style: "z-index: 1000;",
components: [ {
kind: "onyx.Spinner",
style: "size-double",
style: "position: absolute; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
} ]
}, {
kind: "Signals",
accountChanged: "renderAccountList",
accountSortOptionChanged: "updateSortMenu",
balanceViewChanged: "accountBalanceViewChanged",
accountBalanceChanged: "accountBalanceForceUpdate"
} ],
handlers: {
onSelect: "menuItemSelected"
},
renderAccountList: function() {
this.accountBalanceForceUpdate(), this.updateSortMenu();
},
showLoading: function() {
this.$.loadingScrim.show();
},
hideLoading: function() {
this.$.loadingScrim.hide();
},
accountBalanceViewChanged: function(e, t) {
if (typeof t.index == "undefined" || t.index < 0 || t.index >= this.$.entries.accounts.length) {
for (var n = 0; n < this.$.entries.accounts.length; n++) if (this.$.entries.accounts[n].acctId === t.id) {
this.$.entries.accounts[n].bal_view = t.mode, t.index = n;
break;
}
} else this.$.entries.accounts[t.index].bal_view = t.mode;
this.$.entries.refresh(), enyo.isFunction(t.callbackFn) && t.callbackFn(t.index);
},
accountBalanceForceUpdate: function() {
Checkbook.globals.accountManager.fetchOverallBalances({
onSuccess: enyo.bind(this, this.buildBalanceButton, enyo.bind(this, this.renderBalanceButton))
});
},
buildBalanceButton: function(e, t) {
this.totalBalance = t, enyo.isFunction(e) && e();
},
renderBalanceButton: function() {
this.$.balanceMenu.setChoices([ {
content: "Default:",
balance: this.totalBalance[4],
value: 4
}, {
content: "Available:",
balance: this.totalBalance[0],
value: 0
}, {
content: "Cleared:",
balance: this.totalBalance[1],
value: 1
}, {
content: "Pending:",
balance: this.totalBalance[3],
value: 3
}, {
content: "Final:",
balance: this.totalBalance[2],
value: 2
} ]), this.$.balanceMenu.setValue(this.balanceView), this.$.header.reflow();
},
handleBalanceButton: function(e, t) {
this.balanceView = t.value, this.$.entries.setBalanceView(this.balanceView), this.$.entries.refresh();
},
updateSortMenu: function() {
this.$.sortMenu.setValue(Checkbook.globals.prefs.custom_sort);
},
sortMenuSelected: function(e, t) {
if (!t.selected || Checkbook.globals.prefs.custom_sort === t.selected.value) return;
return Checkbook.globals.prefs.custom_sort = t.selected.value, Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "UPDATE prefs SET custom_sort = ?;",
values: [ Checkbook.globals.prefs.custom_sort ]
}), {
onSuccess: function() {
Checkbook.globals.accountManager.updateAccountModTime(), enyo.Signals.send("accountSortChanged");
}
}), !0;
},
addAccount: function() {
this.$.addAccountButton.getDisabled() || (this.$.addAccountButton.setDisabled(!0), enyo.Signals.send("modifyAccount", {
name: "newAccount",
kind: "Checkbook.accounts.modify",
acctId: -1,
onFinish: enyo.bind(this, this.addAccountComplete)
}));
},
addAccountComplete: function(e, t) {
this.$.addAccountButton.setDisabled(!1), t.action === 1 && t.actionStatus === !0 && enyo.Signals.send("accountChanged");
},
toggleLock: function() {
this.$.entries.getEditMode() ? this.$.entries.setEditMode(!1) : this.$.entries.setEditMode(!0), this.$.editModeButtonIcon.addRemoveClass("active", this.$.entries.getEditMode()), this.$.editOverlay.setShowing(this.$.entries.getEditMode()), this.$.header.reflow();
},
searchMenuSelected: function(e, t) {
var n = t.content.toLowerCase();
return n === "search" ? this.log("launch search system (overlay like modify account)") : n === "budget" ? this.log("launch budget system (overlay like modify account)") : n === "reports" ? this.log("launch report system (overlay like modify account)") : n === "toggle hidden" && this.$.entries.setShowHidden(!this.$.entries.getShowHidden()), !0;
}
});

// modify.js

enyo.kind({
name: "Checkbook.accounts.modify",
kind: "FittableRows",
classes: "enyo-fit",
published: {
acctId: -1
},
events: {
onFinish: ""
},
categories: [],
sorting: [],
pinChanged: !1,
components: [ {
kind: "enyo.Scroller",
horizontal: "hidden",
classes: "rich-brown-gradient",
fit: !0,
components: [ {
classes: "light narrow-column",
style: "min-height: 100%;",
components: [ {
kind: "onyx.Groupbox",
classes: "padding-half-top padding-half-bottom",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
components: [ {
name: "accountName",
kind: "onyx.Input",
placeholder: "Enter Account Name...",
fit: !0
}, {
content: "Account Name",
classes: "label"
} ]
} ]
}, {
name: "accountCategory",
kind: "GTS.SelectorBar",
classes: "custom-background bordered",
label: "Account Category",
onChange: "categoryChanged"
}, {
name: "defaultAccount",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Default Account",
sublabel: "This account is launched automatically on start.",
onContent: "Yes",
offContent: "No"
}, {
name: "securityOptionDrawer",
kind: "GTS.DividerDrawer",
caption: "Security Options",
open: !0,
components: [ {
name: "freezeAccount",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Freeze Internal Transactions",
sublabel: "Prevent any changes from being made only in this account.",
onContent: "Yes",
offContent: "No"
}, {
name: "pinLock",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "PIN Lock",
onContent: "Yes",
offContent: "No",
onChange: "togglePINStatus"
}, {
name: "pinLockDrawer",
kind: "onyx.Drawer",
open: !1,
components: [ {
kind: "onyx.Groupbox",
classes: "padding-half-top",
ontap: "changePinCode",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
components: [ {
name: "pinCode",
kind: "onyx.Input",
type: "password",
placeholder: "Tap to set...",
disabled: !0,
fit: !0
}, {
content: "Code",
classes: "label"
} ]
} ]
} ]
} ]
}, {
kind: "GTS.DividerDrawer",
caption: "Display Options",
open: !0,
components: [ {
name: "transactionSorting",
kind: "GTS.SelectorBar",
classes: "bordered",
label: "Sorting",
onChange: "transactionSortingUpdateLabel"
}, {
name: "accountDisplay",
kind: "GTS.SelectorBar",
classes: "bordered",
label: "Display",
onChange: "accountDisplayUpdateLabel",
value: 0,
choices: [ {
content: "Show Account",
value: 0
}, {
content: "Mask Account",
value: 1
}, {
content: "Hide Account",
value: 2
} ]
}, {
name: "balance",
kind: "GTS.SelectorBar",
classes: "bordered",
label: "Balance",
onChange: "balanceUpdateLabel",
value: 0,
choices: [ {
content: "Available",
value: 0
}, {
content: "Cleared",
value: 1
}, {
content: "Pending",
value: 3
}, {
content: "Final",
value: 2
} ]
}, {
name: "showTransTime",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Show Transaction Time",
sublabel: "Displays the transaction time in addition to the date.",
onContent: "Yes",
offContent: "No",
value: !0
}, {
name: "showRunningBal",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Show Running Balance",
sublabel: "Running balance will be shown beneath transaction amount. The transaction amount will be black and the current balance will be colored. Only available in certain sort modes.",
onContent: "Yes",
offContent: "No"
}, {
name: "hideTransNotes",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Hide Transaction Notes",
sublabel: "Transaction notes will be hidden.",
onContent: "Yes",
offContent: "No"
} ]
}, {
kind: "GTS.DividerDrawer",
caption: "Transaction Options",
open: !0,
components: [ {
name: "descriptionMultilineMode",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Description Multiline Mode",
sublabel: "Allows the transaction description to take up multiple lines in the add/edit transaction screen.",
onContent: "Yes",
offContent: "No"
}, {
name: "autoComplete",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Use Auto-Complete",
sublabel: "Displays suggestions for transaction descriptions based on your history.",
onContent: "Yes",
offContent: "No",
value: !0
}, {
name: "atmMode",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Use ATM Mode",
sublabel: "Amount field will be automatically formatted as you type.",
onContent: "Yes",
offContent: "No",
value: !0
}, {
name: "autoTransfer",
kind: "GTS.SelectorBar",
classes: "bordered",
label: "Auto Transfer",
onChange: "toggleAutoTransferDrawer",
value: 0,
choices: [ {
content: "Do not transfer",
value: 0
}, {
content: "Transfer remainder",
value: 1
}, {
content: "Transfer additional dollar",
value: 2
} ]
}, {
name: "autoTransferDrawer",
kind: "onyx.Drawer",
components: [ {
name: "autoTransferLink",
kind: "GTS.SelectorBar",
label: "Transfer to...",
classes: "iconListSelector"
} ]
}, {
name: "expenseCategories",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Add Expense Categories",
sublabel: "Add a field to record the expense category in the add/edit transaction screen.",
onContent: "Yes",
offContent: "No",
value: !0
}, {
name: "checkNumber",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Add Check Number Field",
sublabel: "Add a field to record the check number in the add/edit transaction screen.",
onContent: "Yes",
offContent: "No"
}, {
name: "payeeField",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Add Payee Field",
sublabel: "Add a field to record the payee in the add/edit transaction screen.",
onContent: "Yes",
offContent: "No",
value: !1
}, {
showing: !1,
name: "hideCleared",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Hide cleared transactions",
sublabel: "",
onContent: "Yes",
offContent: "No"
} ]
}, {
kind: "onyx.Groupbox",
classes: "padding-half-top",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
components: [ {
name: "accountNotes",
kind: "onyx.TextArea",
placeholder: "Account specific notes",
style: "min-height: 150px;",
fit: !0
}, {
content: "Notes",
classes: "label",
style: "vertical-align: top;"
} ]
} ]
}, {
name: "accountDeleteButton",
kind: "onyx.Button",
ontap: "deleteAccount",
content: "Delete Account",
classes: "onyx-negative",
style: "margin-top: 1.5em; width: 100%;"
}, {
style: "height: 1.5em;"
} ]
} ]
}, {
kind: "onyx.Toolbar",
classes: "text-center two-button-toolbar",
components: [ {
kind: "onyx.Button",
content: "Cancel",
ontap: "doFinish"
}, {
content: ""
}, {
kind: "onyx.Button",
content: "Save",
classes: "onyx-affirmative",
ontap: "saveAccount"
} ]
}, {
name: "loadingScrim",
kind: "onyx.Scrim",
classes: "onyx-scrim-translucent"
}, {
name: "loadingSpinner",
kind: "onyx.Spinner",
classes: "size-double",
style: "z-index: 2; position: absolute; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
}, {
name: "acctCategoryManager",
kind: "Checkbook.accountCategory.manager"
} ],
rendered: function() {
this.inherited(arguments), this.$.loadingScrim.show(), this.$.loadingSpinner.show(), this.$.acctCategoryManager.fetchCategories({
onSuccess: enyo.bind(this, this.buildAccountCategories)
});
},
buildAccountCategories: function(e) {
var t = null;
this.categories = {
assoc: {},
choices: []
};
for (var n = 0; n < e.length; n++) t = e[n], t && (this.categories.assoc[t.name] = {
icon: "assets/" + t.icon,
color: t.color
}, this.categories.choices.push({
components: [ {
kind: "onyx.Icon",
src: "assets/" + t.icon,
classes: "margin-right"
}, {
content: t.name
} ],
content: t.name,
icon: "assets/" + t.icon,
color: t.color,
value: t.name
}));
this.$.accountCategory.setChoices(this.categories.choices), transactionSortOptions.length <= 0 ? Checkbook.globals.transactionManager.fetchTransactionSorting({
onSuccess: enyo.bind(this, this.buildTransactionSorting)
}) : this.buildTransactionSorting();
},
buildTransactionSorting: function() {
this.$.transactionSorting.setChoices(transactionSortOptions), Checkbook.globals.accountManager.fetchAccountsList({
onSuccess: enyo.bind(this, this.buildAutoTransferLink)
});
},
buildAutoTransferLink: function(e) {
e.length > 0 ? (this.$.autoTransferLink.setChoices(e), this.$.autoTransfer.setDisabled(!1), this.$.autoTransferLink.setDisabled(!1)) : (this.$.autoTransfer.setValue(0), this.$.autoTransfer.setDisabled(!0), this.$.autoTransferLink.setDisabled(!0)), enyo.asyncMethod(this, this.setAccountValues);
},
transactionSortingUpdateLabel: function() {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("acctTrsnSortOptn", [ "desc" ], {
sortId: this.$.transactionSorting.getValue()
}), {
onSuccess: enyo.bind(this, this.transactionSortingUpdateLabelHandler)
});
},
transactionSortingUpdateLabelHandler: function(e) {
e[0].desc ? this.$.transactionSorting.setSublabel(e[0].desc) : this.$.transactionSorting.setSublabel("");
},
accountDisplayUpdateLabel: function() {
var e = this.$.accountDisplay.getValue();
e === 0 ? this.$.accountDisplay.setSublabel("Account is visible.") : e === 1 ? this.$.accountDisplay.setSublabel("Account is visible, but removed from total balance calculations.") : e === 2 && this.$.accountDisplay.setSublabel("Account is hidden and removed from total balance calculations. Account can still be accessed via Preferences.");
},
balanceUpdateLabel: function() {
var e = this.$.balance.getValue();
e === 0 ? this.$.balance.setSublabel("Includes all transactions up to current date/time.") : e === 1 ? this.$.balance.setSublabel("Includes all cleared transactions up to current date/time.") : e === 2 ? this.$.balance.setSublabel("Includes all transactions.") : e === 3 && this.$.balance.setSublabel("Includes all pending transactions.");
},
categoryChanged: function() {
if (Checkbook.globals.prefs.dispColor === 1) {
for (var e = 0; e < appColors.length; e++) this.$.accountCategory.removeClass(appColors[e].name);
var t = this.$.accountCategory.getValue();
this.categories.assoc[t] && this.$.accountCategory.addClass(this.categories.assoc[t].color);
}
},
togglePINStatus: function() {
return this.$.pinLockDrawer.setOpen(this.$.pinLock.getValue()), !0;
},
changePinCode: function() {
this.createComponent({
name: "pinPopup",
kind: "Checkbook.pinChangePopup",
onFinish: "changePinCodeHandler"
}), this.$.pinPopup.show();
},
changePinCodeHandler: function(e, t) {
enyo.isString(t.value) && (this.$.pinCode.setValue(t.value), this.pinChanged = !0), this.$.pinPopup.hide(), this.$.pinPopup.destroy();
},
toggleAutoTransferDrawer: function() {
var e = this.$.autoTransfer.getValue();
e === 0 ? this.$.autoTransfer.setSublabel("Do not transfer anything.") : e === 1 ? this.$.autoTransfer.setSublabel("Remainder of dollar amount will be transferred to selected account.") : e === 2 && this.$.autoTransfer.setSublabel("Additional dollar will be transferred to selected account."), this.$.autoTransferDrawer.setOpen(this.$.autoTransfer.getValue() > 0);
},
setAccountValues: function() {
this.log(), this.acctId >= 0 ? Checkbook.globals.accountManager.fetchAccount(this.acctId, {
onSuccess: enyo.bind(this, this.renderDisplayItems),
onError: null
}) : this.renderDisplayItems({
acctId: -1,
acctName: "",
acctNotes: "",
acctCategory: this.categories.choices[0].value,
sort: transactionSortOptions[0].value,
defaultAccount: 0,
frozen: 0,
hidden: 0,
acctLocked: 0,
lockedCode: "",
transDescMultiLine: 0,
showTransTime: 1,
useAutoComplete: 1,
atmEntry: 1,
bal_view: 0,
runningBalance: 1,
checkField: 0,
hideNotes: 0,
enableCategories: 1,
hide_cleared: 0,
last_sync: "",
auto_savings: 0,
auto_savings_link: -1,
payeeField: 0
});
},
renderDisplayItems: function(e) {
if (!e || typeof e == "undefined") {
this.doFinish(0);
return;
}
this.$.accountName.setValue(e.acctName), this.$.accountCategory.setValue(e.acctCategory), this.$.accountNotes.setValue(e.acctNotes), this.$.freezeAccount.setValue(e.frozen === 1), this.$.pinLock.setValue(e.acctLocked === 1), this.$.pinCode.setValue(e.lockedCode), this.$.transactionSorting.setValue(e.sort), this.$.accountDisplay.setValue(e.hidden), this.$.balance.setValue(e.bal_view), this.$.defaultAccount.setValue(e.defaultAccount === 1), this.$.showTransTime.setValue(e.showTransTime === 1), this.$.showRunningBal.setValue(e.runningBalance === 1), this.$.hideTransNotes.setValue(e.hideNotes === 1), this.$.descriptionMultilineMode.setValue(e.transDescMultiLine === 1), this.$.autoComplete.setValue(e.useAutoComplete === 1), this.$.atmMode.setValue(e.atmEntry === 1), this.$.autoTransfer.setValue(e.auto_savings), this.$.autoTransferLink.setValue(e.auto_savings_link), this.$.checkNumber.setValue(e.checkField === 1), this.$.expenseCategories.setValue(e.enableCategories === 1), this.$.payeeField.setValue(e.payeeField === 1), this.$.hideCleared.setValue(e.hide_cleared === 1), this.transactionSortingUpdateLabel(), this.accountDisplayUpdateLabel(), this.balanceUpdateLabel(), this.togglePINStatus(), this.toggleAutoTransferDrawer(), this.categoryChanged(), this.acctId < 0 && this.$.accountDeleteButton.hide(), this.$.loadingScrim.hide(), this.$.loadingSpinner.hide(), this.$.accountName.focus(), enyo.asyncMethod(this, this.waterfall, "onresize", "onresize", this);
},
saveAccount: function() {
if (this.$.accountName.getValue().length <= 0) {
alert("you need an account name (replace this)");
return;
}
var e = {
acctName: this.$.accountName.getValue(),
acctNotes: this.$.accountNotes.getValue(),
acctCategory: this.$.accountCategory.getValue(),
sort: this.$.transactionSorting.getValue(),
defaultAccount: this.$.defaultAccount.getValue(),
frozen: this.$.freezeAccount.getValue(),
hidden: this.$.accountDisplay.getValue(),
acctLocked: this.$.pinLock.getValue(),
lockedCode: this.$.pinCode.getValue(),
transDescMultiLine: this.$.descriptionMultilineMode.getValue(),
showTransTime: this.$.showTransTime.getValue(),
useAutoComplete: this.$.autoComplete.getValue(),
atmEntry: this.$.atmMode.getValue(),
auto_savings: this.$.autoTransfer.getValue(),
auto_savings_link: this.$.autoTransferLink.getValue(),
bal_view: this.$.balance.getValue(),
runningBalance: this.$.showRunningBal.getValue(),
checkField: this.$.checkNumber.getValue(),
hideNotes: this.$.hideTransNotes.getValue(),
enableCategories: this.$.expenseCategories.getValue(),
payeeField: this.$.payeeField.getValue(),
hide_cleared: !1
}, t = {
onSuccess: enyo.bind(this, this.saveFinished)
};
this.acctId < 0 ? Checkbook.globals.accountManager.createAccount(e, t) : Checkbook.globals.accountManager.updateAccount(e, this.acctId, this.pinChanged, t);
},
saveFinished: function(e) {
enyo.asyncMethod(this, this.doFinish, {
action: 1,
actionStatus: e
});
},
deleteAccount: function() {
this.acctId < 0 ? this.doFinish(0) : (this.createComponent({
name: "deleteAccountConfirm",
kind: "gts.ConfirmDialog",
title: "Delete Account",
message: "Are you sure you want to delete this account?",
confirmText: "Delete",
confirmClass: "onyx-negative",
cancelText: "Cancel",
cancelClass: "",
onConfirm: "deleteAccountHandler",
onCancel: "deleteAccountConfirmClose"
}), this.$.deleteAccountConfirm.show());
},
deleteAccountConfirmClose: function() {
this.$.deleteAccountConfirm.hide(), this.$.deleteAccountConfirm.destroy();
},
deleteAccountHandler: function() {
this.deleteAccountConfirmClose(), Checkbook.globals.accountManager.deleteAccount(this.acctId, {
onSuccess: enyo.bind(this, this.deleteFinished)
});
},
deleteFinished: function(e) {
enyo.asyncMethod(this, this.doFinish, {
action: 2,
actionStatus: e
});
}
});

// manager.js

enyo.kind({
name: "Checkbook.accountCategory.manager",
kind: enyo.Component,
constructor: function() {
this.inherited(arguments);
if (!Checkbook.globals.gts_db) {
this.log("creating database object.");
var e = new GTS.database(getDBArgs());
}
},
fetchCategories: function(e, t, n) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("accountCategories", [ "rowid", "*" ], null, [ "catOrder", "name COLLATE NOCASE" ], t, n), e);
},
fetchMatchingCount: function(e, t, n) {
Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "SELECT COUNT( name ) AS nameCount FROM accountCategories WHERE name LIKE ? AND rowid != ?;",
values: [ e, t ]
}), {
onSuccess: function(e) {
var t = -1;
try {
t = e[e.length - 1].nameCount;
} catch (r) {}
enyo.isFunction(n.onSuccess) && n.onSuccess(t);
},
onError: enyo.isFunction(n.onError) ? n.onError : null
});
},
createCategory: function(e, t) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getInsert("accountCategories", e), {
onSuccess: enyo.bind(this, this.createCategoryFollower, t),
onError: t.onError
});
},
createCategoryFollower: function(e) {
Checkbook.globals.accountManager.updateAccountModTime(), Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "UPDATE accountCategories SET catOrder = ( SELECT IFNULL( MAX( catOrder ) + 1, 0 ) FROM accountCategories LIMIT 1 ) WHERE rowid = ?;",
values: [ Checkbook.globals.gts_db.lastInsertRowId ]
}), e);
},
editCategory: function(e, t, n, r, i, s) {
Checkbook.globals.accountManager.updateAccountModTime();
var o = [ Checkbook.globals.gts_db.getUpdate("accountCategories", {
name: t,
icon: n,
color: r
}, {
rowid: e
}), Checkbook.globals.gts_db.getUpdate("accounts", {
acctCategory: t
}, {
acctCategory: i
}) ];
Checkbook.globals.gts_db.queries(o, s);
},
deleteCategory: function(e, t, n) {
Checkbook.globals.accountManager.updateAccountModTime(), Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getDelete("accountCategories", {
rowid: e,
name: t
}), n);
},
reorderCategories: function(e, t) {
Checkbook.globals.accountManager.updateAccountModTime();
var n = [];
for (var r = 0; r < e.length; r++) n.push(Checkbook.globals.gts_db.getUpdate("accountCategories", {
catOrder: r
}, {
rowid: e[r].rowid
}));
Checkbook.globals.gts_db.queries(n, t);
}
});

// view.js

enyo.kind({
name: "Checkbook.accountCategory.view",
kind: "FittableRows",
classes: "enyo-fit",
style: "height: 100%;",
categories: [],
events: {
onFinish: ""
},
components: [ {
name: "header",
kind: "onyx.Toolbar",
classes: "text-center text-middle",
style: "position: relative;",
components: [ {
components: [ {
content: "Account Categories",
className: "bigger"
}, {
name: "subheader",
className: "smaller"
} ]
}, {
kind: "onyx.Button",
ontap: "doFinish",
content: "x",
classes: "onyx-negative",
style: "position: absolute; right: 15px;"
} ]
}, {
kind: "enyo.Scroller",
horizontal: "hidden",
classes: "rich-brown-gradient",
fit: !0,
components: [ {
name: "entries",
kind: "enyo.Repeater",
classes: "enyo-fit light narrow-column padding-half-top padding-half-bottom",
style: "min-height: 100%; position: relative;",
onSetupItem: "setupRow",
components: [ {
name: "item",
kind: "onyx.Item",
tapHighlight: !0,
classes: "bordered text-middle custom-background legend h-box",
ontap: "editItem",
onDelete: "deleteItem",
components: [ {
name: "icon",
kind: "enyo.Image",
classes: "img-icon"
}, {
name: "name",
classes: "margin-left box-flex-1"
}, {
style: "width: 64px;",
components: [ {
name: "up",
kind: "onyx.IconButton",
src: "assets/menu_icons/up.png",
style: "float: left;",
ontap: "moveUp"
}, {
name: "down",
kind: "onyx.IconButton",
src: "assets/menu_icons/down.png",
style: "float: right;",
ontap: "moveDown"
} ]
} ]
} ]
} ]
}, {
kind: "onyx.Toolbar",
classes: "text-center",
components: [ {
kind: "onyx.Button",
content: "Create New",
ontap: "createNew"
} ]
}, {
name: "modifyCat",
kind: "Checkbook.accountCategory.modify",
onHide: "modifyHidden",
onChangeComplete: "modificationComplete"
}, {
name: "manager",
kind: "Checkbook.accountCategory.manager"
} ],
rendered: function() {
this.inherited(arguments), this.fetchCategories(), this.$.header.addRemoveClass("text-left", enyo.Panels.isScreenNarrow()), this.$.header.addRemoveClass("text-center", !enyo.Panels.isScreenNarrow());
},
fetchCategories: function() {
this.$.manager.fetchCategories({
onSuccess: enyo.bind(this, this.dataResponse)
});
},
dataResponse: function(e) {
this.categories = e, this.$.entries.setCount(this.categories.length);
},
setupRow: function(e, t) {
var n = t.index, r = t.item, i = this.categories[n];
if (i) {
r.$.icon.setSrc("assets/" + i.icon), r.$.name.setContent(i.name);
for (var s = 0; s < appColors.length; s++) r.$.item.removeClass(appColors[s].name);
return r.$.item.addClass(i.color), n > 0 ? r.$.up.show() : r.$.up.hide(), n < this.categories.length - 1 ? r.$.down.show() : r.$.down.hide(), !0;
}
},
createNew: function(e, t) {
this.$.modifyCat.show(-1);
},
editItem: function(e, t) {
var n = this.categories[t.index];
n && this.$.modifyCat.show(n.rowid, n.name, n.icon, n.color);
},
deleteItem: function(e, t) {
var n = this.categories[t];
n && this.$.manager.deleteCategory(n.rowid, n.name, {
onSuccess: enyo.bind(this, this.modificationComplete, {
action: "delete"
})
});
},
modificationComplete: function(e, t) {
this.fetchCategories(), t["action"] != "reorder" && this.$.modifyCat.hide();
},
modifyHidden: function() {
enyo.asyncMethod(this, this.waterfall, "onresize", "onresize", this);
},
moveUp: function(e, t) {
return this.reorder(e, t.index, t.index - 1), !0;
},
moveDown: function(e, t) {
return this.reorder(e, t.index, t.index + 1), !0;
},
reorder: function(e, t, n) {
if (t != n && t > -1 && t < this.categories.length) {
var r = this.categories.splice(n, 1), i = this.categories.slice(t);
this.categories.length = t, this.categories.push.apply(this.categories, r), this.categories.push.apply(this.categories, i), this.$.manager.reorderCategories(this.categories, {
onSuccess: enyo.bind(this, this.modificationComplete, {
action: "reorder"
})
});
}
}
});

// modify.js

enyo.kind({
name: "Checkbook.accountCategory.modify",
kind: "onyx.Popup",
classes: "login-system small-popup",
centered: !0,
floating: !0,
modal: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1,
events: {
onChangeComplete: ""
},
id: -1,
general: "",
specific: "",
components: [ {
kind: "enyo.FittableColumns",
classes: "text-middle margin-bottom",
noStretch: !0,
components: [ {
name: "title",
content: "",
classes: "bigger text-left margin-half-right",
fit: !0
}, {
kind: "onyx.Button",
content: "X",
ontap: "hide",
classes: "onyx-blue small-padding"
} ]
}, {
kind: "onyx.Groupbox",
classes: "light",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
classes: "onyx-focused",
alwaysLooksFocused: !0,
components: [ {
name: "name",
kind: "onyx.Input",
placeholder: "category name",
fit: !0
}, {
content: "name",
classes: "small label"
} ]
}, {
name: "icon",
kind: "GTS.SelectorBar",
label: "Icon",
maxHeight: 300,
choices: appIcons
}, {
name: "color",
kind: "GTS.SelectorBar",
label: "Color",
classes: "custom-background legend",
choices: appColors,
onChange: "colorChanged"
} ]
}, {
name: "errorMessage",
kind: "GTS.InlineNotification",
type: "error",
content: "",
showing: !1
}, {
classes: "padding-std margin-half-top text-center h-box",
components: [ {
kind: "onyx.Button",
classes: "margin-right box-flex",
content: "Cancel",
ontap: "hide"
}, {
name: "deleteButton",
kind: "onyx.Button",
classes: "onyx-negative box-flex",
content: "Delete",
ontap: "deleteCategory"
}, {
kind: "onyx.Button",
classes: "onyx-affirmative margin-left box-flex",
content: "Save",
ontap: "save"
} ]
}, {
name: "manager",
kind: "Checkbook.accountCategory.manager"
} ],
show: function(e, t, n, r) {
this.inherited(arguments), e < 0 ? this.$.deleteButton.hide() : this.$.deleteButton.show(), e < 0 ? (this.$.title.setContent("Create a Category"), this.rowid = -1, this.name = "", this.icon = "", this.color = "") : e > 0 ? (this.$.title.setContent("Edit Category"), this.rowid = e, this.name = t, this.icon = n, this.color = r) : this.hide(), this.$.name.setValue(this.name), this.$.icon.setValue(this.icon), this.$.color.setValue(GTS.String.ucfirst(this.color));
for (var i = 0; i < appColors.length; i++) this.$.color.removeClass(appColors[i].name);
this.$.color.addClass(this.color), Checkbook.globals.prefs.dispColor === 1 ? this.$.color.show() : this.$.color.hide(), this.$.name.focus();
},
colorChanged: function(e, t) {
return this.$.color.removeClass(this.color), this.color = t.selected.name, this.$.color.addClass(this.color), !0;
},
deleteCategory: function() {
if (this.rowid >= 0) {
this.createComponent({
name: "deleteCategoryConfirm",
kind: "gts.ConfirmDialog",
title: "Delete Account",
message: "Are you sure you want to delete this account category?",
confirmText: "Delete",
confirmClass: "onyx-negative",
cancelText: "Cancel",
cancelClass: "",
onConfirm: "deleteCategoryHandler",
onCancel: "deleteCategoryConfirmClose"
}), this.$.deleteCategoryConfirm.show();
var e = this.getComputedStyleValue("zIndex");
if (!e) {
var t = this.domCssText.split(";");
for (var n = 0; n < t.length; n++) if (t[n].match("z-index")) {
t = t[n].split(":"), e = t[1];
break;
}
}
this.$.deleteCategoryConfirm.applyStyle("z-index", e - 5 + 10);
}
},
deleteCategoryConfirmClose: function() {
this.$.deleteCategoryConfirm.destroy();
},
deleteCategoryHandler: function() {
this.deleteCategoryConfirmClose(), this.$.manager.deleteCategory(this.rowid, this.name, {
onSuccess: enyo.bind(this, this.doChangeComplete, {
action: "delete"
})
});
},
save: function() {
var e = this.$.name.getValue();
this.icon = this.$.icon.getValue();
if (e.length <= 0) {
this.$.errorMessage.setContent("Category name may not be blank."), this.$.errorMessage.show();
return;
}
this.$.manager.fetchMatchingCount(e, this.rowid, {
onSuccess: enyo.bind(this, this.saveFinisher, e)
});
},
saveFinisher: function(e, t) {
if (t > 0) {
this.$.errorMessage.setContent("Category names must be unique."), this.$.errorMessage.show();
return;
}
this.$.errorMessage.hide(), this.rowid < 0 ? this.$.manager.createCategory({
name: e,
icon: this.icon,
color: this.color
}, {
onSuccess: enyo.bind(this, this.doChangeComplete, {
action: "new"
})
}) : this.$.manager.editCategory(this.rowid, e, this.icon, this.color, this.name, {
onSuccess: enyo.bind(this, this.doChangeComplete, {
action: "edit"
})
});
}
});

// manager.js

enyo.kind({
name: "Checkbook.transactions.manager",
kind: "enyo.Component",
components: [ {
name: "recurrence",
kind: "Checkbook.transactions.recurrence.manager"
} ],
constructor: function() {
this.inherited(arguments);
if (!Checkbook.globals.gts_db) {
this.log("creating database object.");
var e = new GTS.database(getDBArgs());
}
},
createTransaction: function(e, t, n) {
Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "SELECT ( SELECT IFNULL( MAX( itemId ), 0 ) FROM transactions LIMIT 1 ) AS maxItemId, ( SELECT IFNULL( MAX( repeatId ), 0 ) FROM repeats LIMIT 1 ) AS maxRepeatId;",
values: []
}), {
onSuccess: enyo.bind(this, this.createTransactionFollower, e, t, n)
});
},
createTransactionFollower: function(e, t, n, r) {
e.itemId = parseInt(r[0].maxItemId) + 1, e.maxRepeatId = parseInt(r[0].maxRepeatId) + 1, Checkbook.globals.gts_db.queries(this.generateInsertTransactionSQL({
data: e,
type: t
}), n);
},
generateInsertTransactionSQL: function(e) {
var t = enyo.clone(e.data), n = t.autoTransfer, r = t.autoTransferLink, i = this._prepareData(t, e.type);
i = i.concat(this.$.recurrence.handleRecurrenceSystem(t, n, r)), i = i.concat(this.handleCategoryData(t)), i.push(Checkbook.globals.gts_db.getInsert("transactions", t));
if (GTS.Object.validNumber(t.linkedRecord) && t.linkedRecord >= 0) {
var s = enyo.clone(t);
GTS.Object.swap(s, "linkedRecord", "itemId"), GTS.Object.swap(s, "linkedAccount", "account"), s.amount = -s.amount, i.push(Checkbook.globals.gts_db.getInsert("transactions", s));
}
return n > 0 && r >= 0 && (i = i.concat(this.createAutoTransfer(t, n, r))), i;
},
createAutoTransfer: function(e, t, n) {
if (t <= 0 || n < 0) return [];
var r = enyo.clone(e);
GTS.Object.validNumber(r.linkedRecord) && r.linkedRecord >= 0 ? r.itemId += 2 : r.itemId += 1, t === 1 ? r.amount >= 0 ? r.amount = Math.round(Math.ceil(r.amount) * 100 - r.amount * 100) / 100 : r.amount = Math.round(Math.floor(r.amount) * 100 - r.amount * 100) / 100 : t === 2 ? r.amount >= 0 ? r.amount = 1 : r.amount = -1 : r.amount = 0;
if (r["amount"] == 0) return [];
r.linkedAccount = n, r.linkedRecord = r.itemId + 1, r.note = r.desc, r.desc = "Auto Transfer", r.category = "Transfer", r.category2 = "Auto Transfer", delete r.checkNum, delete r.payee;
var i = [];
return i.push(Checkbook.globals.gts_db.getInsert("transactions", r)), GTS.Object.swap(r, "linkedRecord", "itemId"), GTS.Object.swap(r, "linkedAccount", "account"), r.amount = -r.amount, i.push(Checkbook.globals.gts_db.getInsert("transactions", r)), i;
},
updateTransaction: function(e, t, n) {
Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "SELECT ( SELECT IFNULL( MAX( itemId ), 0 ) FROM transactions LIMIT 1 ) AS maxItemId, ( SELECT IFNULL( MAX( repeatId ), 0 ) FROM repeats LIMIT 1 ) AS maxRepeatId;",
values: []
}), {
onSuccess: enyo.bind(this, this.updateTransactionFollower, e, t, n)
});
},
updateTransactionFollower: function(e, t, n, r) {
if (!e.hasOwnProperty("itemId") || isNaN(e.itemId) || !isFinite(e.itemId) || e.itemId < 0) {
enyo.isFunction(n.onError) ? n.onError(!1) : enyo.isFunction(n.onSuccess) && n.onSuccess(!1);
return;
}
e.maxItemId = parseInt(r[0].maxItemId) + 1, e.maxRepeatId = parseInt(r[0].maxRepeatId) + 1;
var i = this._prepareData(e, t);
e["repeatUnlinked"] != 1 && e["terminated"] != 1 ? i = i.concat(this.$.recurrence.handleRecurrenceSystem(e)) : (delete e.rObj, delete e.maxItemId, delete e.maxRepeatId), i = i.concat(this.handleCategoryData(e)), i.push(Checkbook.globals.gts_db.getUpdate("transactions", e, {
itemId: e.itemId
}));
if (GTS.Object.validNumber(e.linkedRecord)) {
var s = enyo.clone(e);
GTS.Object.swap(s, "linkedRecord", "itemId"), GTS.Object.swap(s, "linkedAccount", "account"), s.amount = -s.amount, delete s.cleared, i.push(Checkbook.globals.gts_db.getUpdate("transactions", s, {
itemId: s.itemId
}));
}
Checkbook.globals.gts_db.queries(i, n);
},
_prepareData: function(e, t) {
return e.desc = e.desc === "" || e.desc === null ? "Description" : e.desc, e.cleared = e.cleared ? 1 : 0, e.amount = Number(e.amount).toFixed(2).valueOf(), e.date = Date.parse(e.date), t == "transfer" ? e.amount_old !== "NOT_A_VALUE" && e.amount_old < 0 ? e.amount = -Math.abs(e.amount) : e.amount_old !== "NOT_A_VALUE" && e.amount_old >= 0 ? e.amount = Math.abs(e.amount) : (e.linkedRecord = e.itemId + 1, e.amount = -Math.abs(e.amount)) : t == "income" ? (e.amount = Math.abs(e.amount), e.linkedAccount = null, e.linkedRecord = null) : (e.amount = -Math.abs(e.amount), e.linkedAccount = null, e.linkedRecord = null), delete e.amount_old, delete e.autoTransfer, delete e.autoTransferLink, [];
},
handleCategoryData: function(e) {
var t = [];
t.push(new GTS.databaseQuery({
sql: "DELETE FROM transactionSplit WHERE transId = ? OR transId = ( SELECT itemId FROM transactions WHERE linkedRecord = ? )",
values: [ e.itemId, e.itemId ]
}));
if (e.category.length > 1) {
for (var n = 0; n < e.category.length; n++) {
if (e.category[n].amount === "" || isNaN(e.category[n].amount)) continue;
!e.linkedRecord || isNaN(e.linkedRecord) ? t.push(Checkbook.globals.gts_db.getInsert("transactionSplit", {
genCat: e.category[n].category,
specCat: e.category[n].category2,
amount: e.category[n].amount,
transId: e.itemId
})) : (t.push(Checkbook.globals.gts_db.getInsert("transactionSplit", {
genCat: e.category[n].category,
specCat: e.category[n].category2,
amount: -e.category[n].amount,
transId: e.itemId
})), t.push(Checkbook.globals.gts_db.getInsert("transactionSplit", {
genCat: e.category[n].category,
specCat: e.category[n].category2,
amount: e.category[n].amount,
transId: e.linkedRecord
})));
}
e.category = "||~SPLIT~||", e.category2 = "";
} else e.category.length === 1 ? (e.category2 = e.category[0].category2, e.category = e.category[0].category) : (e.category = "Uncategorized", e.category2 = "Other");
return t;
},
clearTransaction: function(e, t, n) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("transactions", {
cleared: t ? 1 : 0
}, {
itemId: e
}), n);
},
deleteTransaction: function(e, t) {
Checkbook.globals.gts_db.queries([ Checkbook.globals.gts_db.getDelete("transactions", {
itemId: e
}), Checkbook.globals.gts_db.getDelete("transactions", {
linkedRecord: e
}), new GTS.databaseQuery({
sql: "DELETE FROM transactionSplit WHERE transId = ? OR transId = ( SELECT itemId FROM transactions WHERE linkedRecord = ? )",
values: [ e, e ]
}) ], t);
},
fetchTransaction: function(e, t) {
var n = new GTS.databaseQuery({
sql: 'SELECT DISTINCT main.itemId, main.desc, main.amount, main.note, main.date, main.account, main.linkedRecord, main.linkedAccount, main.cleared, main.repeatId, main.checkNum, main.payee, ( CASE WHEN main.category = \'||~SPLIT~||\' THEN ( \'[\' || IFNULL( ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( \'{ "category": "\' || ts.genCat || \'", "category2" : "\' || ts.specCat || \'", "amount": "\' || ts.amount || \'" }\' ) AS json FROM transactionSplit ts WHERE ts.transId = main.itemId ORDER BY ts.amount DESC ) ), \'{ "category": "?", "category2" : "?", "amount": "0" }\' ) || \']\' ) ELSE main.category END ) AS category, ( CASE WHEN main.category = \'||~SPLIT~||\' THEN \'PARSE_CATEGORY\' ELSE main.category2 END ) AS category2 FROM transactions main WHERE main.itemId = ? LIMIT 1;',
values: [ e ]
});
Checkbook.globals.gts_db.query(n, {
onSuccess: function(e) {
enyo.isFunction(t.onSuccess) && t.onSuccess(e[0]);
},
onError: t.onError
});
},
fetchTransactions: function(e, t, n, r) {
var i = new GTS.databaseQuery({
sql: 'SELECT DISTINCT main.itemId, main.desc, main.amount, main.note, main.date, main.account, main.linkedRecord, main.linkedAccount, main.cleared, main.repeatId, main.repeatUnlinked, main.checkNum, main.payee, ( CASE WHEN main.category = \'||~SPLIT~||\' THEN ( \'[\' || IFNULL( ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( \'{ "category": "\' || ts.genCat || \'", "category2" : "\' || ts.specCat || \'", "amount": "\' || ts.amount || \'" }\' ) AS json FROM transactionSplit ts WHERE ts.transId = main.itemId ORDER BY ts.amount DESC ) ), \'{ "category": "?", "category2" : "?", "amount": "0" }\' ) || \']\' ) ELSE main.category END ) AS category, ( CASE WHEN main.category = \'||~SPLIT~||\' THEN \'PARSE_CATEGORY\' ELSE main.category2 END ) AS category2 FROM transactions main WHERE account = ? ORDER BY ' + e.sortQry,
values: [ e.acctId ]
});
n && (i.sql += " LIMIT ?", i.values.push(n)), r && (i.sql += " OFFSET ?", i.values.push(r)), Checkbook.globals.gts_db.query(i, {
onSuccess: enyo.bind(this, this.fetchTransactionsFollower, e, t, n, r)
});
},
fetchTransactionsFollower: function(e, t, n, r, i) {
if (e.runningBalance === 1) {
var s;
i.length > 0 && !isNaN(i[0].date) ? s = parseInt(i[0].date) : s = Date.parse(new Date);
var o = new GTS.databaseQuery({
sql: "",
values: [ e.acctId, s ]
});
e.sort !== 0 && e.sort !== 6 && e.sort !== 8 ? o.sql = "SELECT SUM( amount ) AS balanceToDate FROM transactions WHERE account = ? AND date <= ?;" : o.sql = "SELECT SUM( amount ) AS balanceToDate FROM transactions WHERE account = ? AND date < ?;", Checkbook.globals.gts_db.query(o, {
onSuccess: function(e) {
enyo.isFunction(t.onSuccess) && t.onSuccess(r, i, e);
},
onError: t.onError
});
} else enyo.isFunction(t.onSuccess) && t.onSuccess(r, i, []);
},
searchTransactions: function(e, t, n, r, i, s) {
var o = new GTS.databaseQuery({
sql: 'SELECT DISTINCT main.itemId, main.desc, main.amount, main.note, main.date, main.account, main.linkedRecord, main.linkedAccount, main.cleared, main.repeatId, main.checkNum, main.payee, ( SELECT accts.acctName FROM accounts accts WHERE accts.acctId = main.account ) AS acctName, ( SELECT accts.acctCategory FROM accounts accts WHERE accts.acctId = main.account ) AS acctCategory,IFNULL( ( SELECT accountCategories.icon FROM accountCategories WHERE accountCategories.name = ( SELECT accts.acctCategory FROM accounts accts WHERE accts.acctId = main.account ) ), \'icon_2.png\' ) AS acctCategoryIcon,  ( SELECT accts.showTransTime FROM accounts accts WHERE accts.acctId = main.account ) AS showTransTime, ( SELECT accts.enableCategories FROM accounts accts WHERE accts.acctId = main.account ) AS enableCategories, ( SELECT accts.checkField FROM accounts accts WHERE accts.acctId = main.account ) AS checkField, ( SELECT accts.hideNotes FROM accounts accts WHERE accts.acctId = main.account ) AS hideNotes, ( SELECT accts.frozen FROM accounts accts WHERE accts.acctId = main.account ) AS frozen, ( CASE WHEN main.category = \'||~SPLIT~||\' THEN ( \'[\' || IFNULL( ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( \'{ "category": "\' || ts.genCat || \'", "category2" : "\' || ts.specCat || \'", "amount": "\' || ts.amount || \'" }\' ) AS json FROM transactionSplit ts WHERE ts.transId = main.itemId ORDER BY ts.amount DESC ) ), \'{ "category": "?", "category2" : "?", "amount": "0" }\' ) || \']\' ) ELSE main.category END ) AS category, ( CASE WHEN main.category = \'||~SPLIT~||\' THEN \'PARSE_CATEGORY\' ELSE main.category2 END ) AS category2 FROM transactions main WHERE ' + e + " ORDER BY " + n,
values: enyo.clone(t)
});
i && (o.sql += " LIMIT ?", o.values.push(i)), s && (o.sql += " OFFSET ?", o.values.push(s)), Checkbook.globals.gts_db.query(o, r);
},
searchTransactionsCount: function(e, t, n, r) {
var i = new GTS.databaseQuery({
sql: "SELECT COUNT( DISTINCT main.itemId ) AS searchCount FROM transactions main WHERE " + e,
values: enyo.clone(t)
});
Checkbook.globals.gts_db.query(i, {
onSuccess: function(e) {
enyo.isFunction(r.onSuccess) && r.onSuccess(e[0]);
},
onError: r.onError
});
},
fetchTransactionSorting: function(e) {
Checkbook.globals.gts_db.query("SELECT * FROM acctTrsnSortOptn ORDER BY groupOrder ASC, label", {
onSuccess: enyo.bind(this, this.buildTransactionSorting, e)
});
},
buildTransactionSorting: function(e, t) {
this.log();
var n = null;
transactionSortOptions = [];
for (var r = 0; r < t.length; r++) {
var n = t[r];
n && transactionSortOptions.push({
icon: "assets/sort_icons/" + n.sortGroup.toLowerCase().replace(" ", "") + ".png",
content: n.label,
value: n.sortId,
qry: n.qry,
sortGroup: n.sortGroup
});
}
enyo.isFunction(e.onSuccess) && e.onSuccess();
},
fetchMaxCheckNumber: function(e, t) {
if (!GTS.Object.isNumber(e)) {
this.log("No account number specified."), enyo.isFunction(t.onError) && t.onError("No account specified");
return;
}
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("transactions", [ "MAX( checkNum ) AS maxCheckNum" ], {
account: e
}), {
onSuccess: function(e) {
if (enyo.isFunction(t.onSuccess)) {
var n = parseInt(e[0].maxCheckNum);
isNaN(n) ? t.onSuccess(1) : t.onSuccess(n + 1);
}
},
onError: t.onError
});
},
parseCategoryDB: function(e, t) {
var n;
return t === "PARSE_CATEGORY" ? n = enyo.json.parse(e) : (e === "" && t === "" ? (e = "Uncategorized", t = "Other") : t === "" && (t = e.split("|", 2)[1], e = e.split("|", 2)[0]), n = [ {
category: e,
category2: t,
amount: ""
} ]), n;
},
formatCategoryDisplay: function(e, t, n, r) {
n = typeof n != "undefined" ? n : !0, r = typeof r != "undefined" ? r : "small";
var i;
if (t === "PARSE_CATEGORY") {
var s = enyo.json.parse(e), o = "", u = "";
for (var a = 0; a < (s.length > 3 && n ? 2 : s.length); a++) o += "<div class='cat-item " + r + "'>" + s[a].category + " &raquo; " + s[a].category2 + "</div>", u += "<div class='cat-item " + r + "'>" + formatAmount(s[a].amount) + "</div>";
i = "<div style='margin-bottom: 0.5em;'><div class='splitCatContainer h-box'><div class='categoryGroup'>" + o + "</div>" + "<div class='categoryAmount'>" + u + "</div>" + "</div>" + (s.length > 3 && n ? "<div class='" + r + "'>+" + (s.length - 2) + " more</div>" : "") + "</div>";
} else t === "" && (t = e.split("|", 2)[1], e = e.split("|", 2)[0]), i = "<span class='" + r + "'>" + e + " >> " + t + "</span>";
return e !== "" ? i : "";
},
determineTransactionType: function(e) {
var t = "income";
return GTS.Object.validNumber(e.linkedAccount) && e.linkedAccount >= 0 && GTS.Object.validNumber(e.linkedRecord) && e.linkedRecord >= 0 ? t = "transfer" : e.amount < 0 && (t = "expense"), t;
}
});

// view.js

enyo.kind({
name: "Checkbook.transactions.view",
layoutKind: "FittableRowsLayout",
account: {},
components: [ {
name: "header",
kind: "onyx.Toolbar",
layoutKind: "enyo.FittableColumnsLayout",
noStretch: !0,
components: [ {
name: "acctTypeIcon",
kind: "enyo.Image",
src: "assets/dollar_sign_1.png",
classes: "img-icon",
style: "margin: 0 15px 0 0;"
}, {
name: "loadingSpinner",
kind: "onyx.Spinner",
showing: !1,
classes: " img-icon",
style: "margin: 0 15px 0 0;"
}, {
name: "acctName",
content: "Checkbook",
classes: "enyo-text-ellipsis",
fit: !0
}, {
name: "balanceMenu",
kind: "Checkbook.balanceMenu",
onChange: "handleBalanceButton",
style: "padding: 0 8px; margin: 0;"
} ]
}, {
name: "entries",
kind: "Checkbook.transactions.list",
fit: !0,
classes: "checkbook-stamp",
style: "position: relative;",
ondragstart: "listDrag",
ondrag: "listDrag",
ondragfinish: "listDrag",
onLoadingStart: "showLoadingIcon",
onLoadingFinish: "hideLoadingIcon",
onScrimShow: "showLoadingScrim",
onScrimHide: "hideLoadingScrim"
}, {
name: "footer",
kind: "onyx.MoreToolbar",
classes: "deep-green",
components: [ {
name: "backButton",
kind: "onyx.Button",
classes: "padding-none transparent",
ontap: "fireBack",
components: [ {
kind: "onyx.Icon",
src: "assets/menu_icons/back.png"
} ]
}, {
kind: "onyx.MenuDecorator",
components: [ {
kind: "onyx.Button",
classes: "padding-none transparent",
components: [ {
kind: "onyx.Icon",
src: "assets/menu_icons/sort.png"
} ]
}, {
name: "sortMenu",
kind: "GTS.SelectedMenu",
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
onChange: "transactionSortingChanged",
style: "min-width: 225px;"
} ]
}, {
classes: "text-center",
fit: !0,
components: [ {
name: "addIncomeButton",
kind: "onyx.Button",
ontap: "addIncome",
classes: "margin-half-left margin-half-right padding-none transparent",
components: [ {
kind: "onyx.Icon",
src: "assets/menu_icons/income.png"
} ]
}, {
name: "addTransferButton",
kind: "onyx.Button",
ontap: "addTransfer",
classes: "margin-half-left margin-half-right padding-none transparent",
components: [ {
kind: "onyx.Icon",
src: "assets/menu_icons/transfer.png"
} ]
}, {
name: "addExpenseButton",
kind: "onyx.Button",
ontap: "addExpense",
classes: "margin-half-left margin-half-right padding-none transparent",
components: [ {
kind: "onyx.Icon",
src: "assets/menu_icons/expense.png"
} ]
} ]
}, {
kind: "onyx.MenuDecorator",
components: [ {
kind: "onyx.Button",
classes: "padding-none transparent",
components: [ {
kind: "onyx.Icon",
src: "assets/menu_icons/search.png"
} ]
}, {
kind: "onyx.Menu",
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
onSelect: "footerMenuSelected",
components: [ {
content: "Refresh"
}, {
showing: !1,
classes: "onyx-menu-divider"
}, {
showing: !1,
content: "Reports"
}, {
showing: !1,
content: "Budget"
}, {
showing: !1,
content: "Search"
}, {
showing: !1,
classes: "onyx-menu-divider"
}, {
showing: !1,
content: "Purge"
}, {
showing: !1,
content: "Combine"
}, {
showing: !1,
content: "Clear Multiple"
} ]
} ]
} ]
}, {
name: "loadingScrim",
kind: "onyx.Scrim",
classes: "onyx-scrim-translucent",
style: "z-index: 1000;",
components: [ {
kind: "onyx.Spinner",
style: "size-double",
style: "position: absolute; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
} ]
}, {
kind: "Signals",
viewAccount: "viewAccount",
accountChanged: "accountChanged",
accountBalanceChanged: "balanceChanged"
} ],
rendered: function() {
this.inherited(arguments), this.$.header.hide(), this.$.footer.hide();
},
listDrag: function(e, t) {
return t.preventDefault(), !0;
},
accountChanged: function(e, t) {
t && t.deleted && this.getAccountId() === t.accountId ? this.unloadSystem() : this.reloadSystem();
},
viewAccount: function(e, t) {
if (!t.account || !t.account.acctId) {
this.unloadSystem();
return;
}
this.$.backButton.setShowing(enyo.Panels.isScreenNarrow()), this.showLoadingScrim(), this.account.acctId || (this.$.header.show(), this.$.footer.show());
if (t.force || !this.account.acctId || this.account.acctId !== t.account.acctId) this.account = enyo.clone(t.account), this.$.entries.account = enyo.clone(this.account), this.$.acctName.setContent(this.account.acctName), this.$.acctTypeIcon.setSrc("assets/" + this.account.acctCategoryIcon), this.renderBalanceButton(), this.renderSortButton(), this.$.entries.reloadSystem(), this.account.frozen === 1 ? (this.$.addIncomeButton.setDisabled(!0), this.$.addTransferButton.setDisabled(!0), this.$.addExpenseButton.setDisabled(!0)) : (this.$.addIncomeButton.setDisabled(!1), this.$.addTransferButton.setDisabled(!1), this.$.addExpenseButton.setDisabled(!1));
this.hideLoadingScrim(), this.$.header.reflow(), this.$.footer.reflow(), this.reflow();
},
getAccountId: function() {
return this.account.acctId;
},
setAccountIndex: function(e) {
this.account.index = e;
},
unloadSystem: function() {
this.account = {}, this.$.entries.unloadSystem(), this.$.header.hide(), this.$.footer.hide();
},
reloadSystem: function() {
if (!this.account.acctId || this.account.acctId < 0) return this.log("System not ready yet"), !1;
this.$.entries.reloadSystem(), this.balanceChanged();
},
balanceChanged: function(e, t) {
var n = {
sendSignal: !1
};
!t || !t.accounts || !t.accounts.account ? n.account = this.account.acctId : enyo.mixin(n, t.accounts);
if (typeof n.accountBal != "undefined" && n.accountBal.length === 4) {
var r = {
balance0: n.accountBal[0],
balance1: n.accountBal[1],
balance2: n.accountBal[2],
balance3: n.accountBal[3]
};
this.balanceChangedHandler(n, r);
} else this.balanceChangedHandler(n);
},
balanceChangedHandler: function(e, t) {
e || (e = {
account: this.account.acctId,
linkedAccount: -1
});
if (!t) {
Checkbook.globals.accountManager.fetchAccountBalance(this.account.acctId, {
onSuccess: enyo.bind(this, this.balanceChangedHandler, e)
});
return;
}
this.account.balance0 = prepAmount(t.balance0), this.account.balance1 = prepAmount(t.balance1), this.account.balance2 = prepAmount(t.balance2), this.account.balance3 = prepAmount(t.balance3), this.renderBalanceButton(), e["account"] == this.account["acctId"] ? e.accountBal = {
balance0: this.account.balance0,
balance1: this.account.balance1,
balance2: this.account.balance2,
balance3: this.account.balance3
} : e.accountBal = {};
if (typeof e.sendSignal != "undefined" && e.sendSignal === !1) return;
enyo.Signals.send("accountBalanceChanged", {
accounts: e
});
},
renderBalanceButton: function() {
this.$.balanceMenu.setChoices([ {
content: "Available:",
balance: this.account.balance0,
value: 0
}, {
content: "Cleared:",
balance: this.account.balance1,
value: 1
}, {
content: "Pending:",
balance: this.account.balance3,
value: 3
}, {
content: "Final:",
balance: this.account.balance2,
value: 2
} ]), this.$.balanceMenu.setValue(this.account.bal_view), this.$.header.reflow();
},
handleBalanceButton: function(e, t) {
return this.account.bal_view === t.value ? !0 : (this.account.bal_view = t.value, Checkbook.globals.accountManager.updateAccountBalView(this.account.acctId, this.account.bal_view, {
onSuccess: enyo.bind(this, this.renderBalanceButton)
}), enyo.Signals.send("balanceViewChanged", {
index: this.account.index,
id: this.account.acctId,
mode: this.account.bal_view,
callbackFn: enyo.bind(this, this.setAccountIndex)
}), !0);
},
showLoadingIcon: function() {
this.$.acctTypeIcon.hide(), this.$.loadingSpinner.show();
},
hideLoadingIcon: function() {
this.$.loadingSpinner.hide(), this.$.acctTypeIcon.show();
},
showLoadingScrim: function() {
this.$.loadingScrim.show();
},
hideLoadingScrim: function() {
this.$.loadingScrim.hide();
},
fireBack: function() {
return enyo.Signals.send("onbackbutton"), !0;
},
renderSortButton: function() {
transactionSortOptions.length <= 0 ? Checkbook.globals.transactionManager.fetchTransactionSorting({
onSuccess: enyo.bind(this, this.buildTransactionSorting)
}) : this.buildTransactionSorting();
},
buildTransactionSorting: function() {
enyo.isArray(transactionSortOptions) && (this.$.sortMenu.setChoices(transactionSortOptions), this.$.sortMenu.setValue(this.account.sort));
},
transactionSortingChanged: function(e, t) {
return this.account.sort === t.value ? !0 : (this.account.sort = t.value, this.account.sortQry = t.qry, Checkbook.globals.accountManager.updateAccountSorting(this.account.acctId, this.account.sort), this.$.entries.account = enyo.clone(this.account), this.$.entries.reloadSystem(), !0);
},
addIncome: function() {
this.newTransaction("Income");
},
addTransfer: function() {
this.newTransaction("Transfer");
},
addExpense: function() {
this.newTransaction("Expense");
},
footerMenuSelected: function(e, t) {
if (t.content.toLowerCase() === "refresh") {
var n = this.account.acctId;
this.$.entries.rememberScrollPosition(), Checkbook.globals.transactionManager.$.recurrence.updateSeriesTransactions(n, {
onSuccess: function() {
Checkbook.globals.accountManager.fetchAccount(n, {
onSuccess: function(e) {
enyo.Signals.send("viewAccount", {
account: e,
force: !0
});
}
});
}
});
} else t.content.toLowerCase() === "budget" ? this.log("Budget system go") : t.content.toLowerCase() === "reports" ? this.log("Report system go") : t.content.toLowerCase() === "search" ? this.log("Search system go") : this.log(t.selected);
return !0;
},
newTransaction: function(e) {
this.$.addIncomeButton.getDisabled() || this.$.addTransferButton.getDisabled() || this.$.addExpenseButton.getDisabled() || (this.toggleCreateButtons(), this.showLoadingScrim(), enyo.Signals.send("modifyTransaction", {
name: "createTransaction",
kind: "Checkbook.transactions.modify",
accountObj: this.account,
trsnObj: {},
transactionType: e.toLowerCase(),
onFinish: enyo.bind(this, this.addTransactionComplete)
}));
},
addTransactionComplete: function(e, t) {
t.modifyStatus === 1 && (delete t.modifyStatus, this.balanceChangedHandler(t), this.account.itemCount++, this.$.entries.setItemCount(this.account.itemCount), this.$.entries.reloadSystem()), this.toggleCreateButtons(), enyo.asyncMethod(this, this.hideLoadingScrim);
},
toggleCreateButtons: function() {
this.$.addIncomeButton.getDisabled() ? (this.$.addIncomeButton.setDisabled(!1), this.$.addTransferButton.setDisabled(!1), this.$.addExpenseButton.setDisabled(!1)) : (this.$.addIncomeButton.setDisabled(!0), this.$.addTransferButton.setDisabled(!0), this.$.addExpenseButton.setDisabled(!0));
}
});

// list.js

enyo.kind({
name: "Checkbook.transactions.list",
transactions: [],
account: {},
initialScrollCompleted: !1,
savedScrollPosition: !1,
events: {
onLoadingStart: "",
onLoadingFinish: "",
onScrimShow: "",
onScrimHide: ""
},
components: [ {
name: "list",
kind: "GTS.LazyList",
classes: "checkbook-stamp enyo-fit",
reorderable: !1,
enableSwipe: !1,
onSetupItem: "transactionBuildRow",
onAcquirePage: "transactionFetchGroup",
onReorder: "",
onSetupReorderComponents: "",
onSetupPinnedReorderComponents: "",
onSetupSwipeItem: "",
onSwipeComplete: "",
aboveComponents: [],
components: [ {
name: "transactionWrapper",
kind: "GTS.Item",
tapHighlight: !0,
holdHighlight: !1,
ontap: "transactiontapped",
onhold: "transactionHeld",
classes: "bordered",
style: "padding-right: 20px; padding-left: 30px;",
components: [ {
name: "mainBody",
classes: "transaction-item-top h-box",
components: [ {
classes: "box-flex-1",
components: [ {
name: "desc",
classes: "description text-ellipsis bold"
}, {
name: "time",
classes: "date smaller"
} ]
}, {
classes: "margin-left text-top",
components: [ {
classes: "amount-block text-right",
components: [ {
name: "amount"
}, {
name: "runningBal"
} ]
}, {
name: "cleared",
ontap: "transactionCleared",
classes: "onyx-checkbox checkbox-clone margin-left"
} ]
} ]
}, {
name: "category",
allowHtml: !0
}, {
name: "checkNum",
classes: "smaller"
}, {
name: "payee",
classes: "smaller"
}, {
name: "note",
classes: "smaller",
allowHtml: !0
} ]
} ],
belowComponents: [ {
content: "&nbsp;",
allowHtml: !0
} ],
reorderComponents: [],
pinnedReorderComponents: [],
swipeableComponents: []
}, {
name: "transactonMenu",
kind: "onyx.Menu",
showOnTop: !0,
floating: !0,
components: [ {
name: "tmClear",
content: "Clear Transaction",
value: "clear"
}, {
content: "Edit Transaction",
value: "edit"
}, {
content: "Duplicate Transaction",
value: "duplicate"
}, {
content: "Delete Transaction",
value: "delete"
} ]
}, {
name: "viewSingle",
kind: "Checkbook.transactions.viewSingle",
onClear: "vsCleared",
onEdit: "vsEdit",
onDelete: "transactionDeleted"
}, {
name: "deleteTransactionConfirm",
kind: "gts.ConfirmDialog",
title: "Delete Transaction",
message: "Are you sure you want to delete this transaction?",
confirmText: "Delete",
confirmClass: "onyx-negative",
cancelText: "Cancel",
cancelClass: "",
onConfirm: "deleteTransactionConfirmHandler",
onCancel: "deleteTransactionConfirmClose"
} ],
constructor: function() {
this.inherited(arguments), this.bound = {
transactionFetchGroupHandler: enyo.bind(this, this.transactionFetchGroupHandler),
initialScroll: enyo.bind(this, this._initialScroll),
initialScrollHandler: enyo.bind(this, this.initialScrollHandler),
moveToSavedScrollPosition: enyo.bind(this, this.moveToSavedScrollPosition)
};
},
accountChanged: function(e, t) {
this.log(), t && t.deleted && this.getAccountId() === t.accountId ? this.unloadSystem() : this.reloadSystem();
},
unloadSystem: function() {
this.log(), this.account = {}, this.$.list.setCount(0), this.$.list.reset();
},
reloadSystem: function() {
this.log();
if (!this.account.acctId || this.account.acctId < 0) return this.log("System not ready yet"), !1;
this.savedScrollPosition === !1 && (this.initialScrollCompleted = !1), this.reloadTransactionList();
},
setItemCount: function(e) {
Number.isFinite(e) && (this.account.itemCount = e);
},
reloadTransactionList: function() {
this.log();
if (!this.account.acctId || this.account.acctId < 0) return !1;
this.transactions = [], this.$.list.setCount(0), this.$.list.reset(), this.$.list.lazyLoad();
},
initialScroll: function() {
enyo.job("initialScroll", this.bound.initialScroll, 100);
},
_initialScroll: function() {
if (this.$.list.getCount() <= 0) {
this.log("empty list");
return;
}
if (this.account.sort !== 0 && this.account.sort !== 1 && this.account.sort !== 6 && this.account.sort !== 7) {
this.$.list.scrollToRow(0);
return;
}
var e = new Date;
this.account.showTransTime !== 1 && e.setHours(23, 59, 59, 999), e = Date.parse(e);
var t = null;
switch (this.account.sort) {
case 0:
t = new GTS.databaseQuery({
sql: "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND CAST( date AS INTEGER ) <= ? ORDER BY date ASC, itemId ASC;",
values: [ this.account.acctId, e ]
});
break;
case 1:
t = new GTS.databaseQuery({
sql: "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND CAST( date AS INTEGER ) <= ? ORDER BY date DESC, itemId DESC;",
values: [ this.account.acctId, e ]
});
break;
case 6:
t = new GTS.databaseQuery({
sql: "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND cleared = 1;",
values: [ this.account.acctId ]
});
break;
case 7:
t = new GTS.databaseQuery({
sql: "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND cleared = 0;",
values: [ this.account.acctId ]
});
}
if (t) {
var n = {
onSuccess: this.bound.initialScrollHandler
};
Checkbook.globals.gts_db.query(t, n);
}
},
initialScrollHandler: function(e) {
var t = 0;
this.account.sort === 1 ? t = this.account.itemCount - e[0].itemIndex - 3 : t = e[0].itemIndex - 3, t = t >= 0 ? t : 0, this.$.list.scrollToRow(t);
},
rememberScrollPosition: function() {
this.savedScrollPosition = this.$.list.getScrollPosition();
},
moveToSavedScrollPosition: function() {
this.$.list.setScrollPosition(this.savedScrollPosition), this.savedScrollPosition = !1;
},
transactionBuildRow: function(e, t) {
var n = t.index, r = this.transactions[n];
if (r) {
this.$.transactionWrapper.addRemoveClass("alt-row", n % 2 === 0), this.$.transactionWrapper.addRemoveClass("norm-row", n % 2 !== 0), this.$.desc.setContent(r.desc);
var i = new Date(parseInt(r.date));
this.$.time.setContent(i.format({
date: enyo.Panels.isScreenNarrow() ? "short" : "long",
time: this.account.showTransTime === 1 ? "short" : ""
}));
var s = new Date;
this.account.showTransTime !== 1 && s.setHours(23, 59, 59, 999), this.$.transactionWrapper.addRemoveClass("futureTransaction", r.date > Date.parse(s)), this.$.amount.setContent(formatAmount(r.amount)), r.dispRunningBalance ? (this.$.runningBal.setContent(formatAmount(r.runningBalance)), this.$.runningBal.addRemoveClass("positiveBalance", r.runningBalance > 0), this.$.runningBal.addRemoveClass("negativeBalance", r.runningBalance < 0), this.$.runningBal.addRemoveClass("neutralBalance", r["runningBalance"] == 0), this.$.amount.setClassAttribute("")) : (this.$.runningBal.setContent(""), this.$.amount.addRemoveClass("positiveBalance", r.amount > 0), this.$.amount.addRemoveClass("negativeBalance", r.amount < 0), this.$.amount.addRemoveClass("neutralBalance", r["amount"] == 0)), this.$.cleared.addRemoveClass("checked", r.cleared === 1), this.account.enableCategories === 1 ? (this.$.category.show(), this.$.category.setContent(Checkbook.globals.transactionManager.formatCategoryDisplay(r.category, r.category2, !0, "smaller"))) : this.$.category.hide(), this.$.checkNum.setContent(this.account.checkField === 1 && r.checkNum && r.checkNum !== "" ? "Check #" + r.checkNum : ""), this.$.payee.setContent(this.account.payeeField === 1 && r.payee && r.payee !== "" ? "Payee: " + r.payee : ""), this.$.note.setContent((this.account.hideNotes === 1 ? "" : r.note).replace(/\n/g, "<br />"));
var o = r.linkedRecord && !isNaN(r.linkedRecord) && r["linkedRecord"] != "", u = r.repeatId && !isNaN(r.repeatId) && r["repeatId"] != "" && r.repeatId >= 0;
return this.$.mainBody.addRemoveClass("repeatTransferIcon", o && u), this.$.mainBody.addRemoveClass("transferIcon", o && !u), this.$.mainBody.addRemoveClass("repeatIcon", !o && u), !0;
}
},
transactionFetchGroup: function(e, t) {
this.log("FETCH", t.page, t.pageSize);
var n = t.page * t.pageSize;
return !this.account.acctId || this.account.acctId < 0 ? (this.log("System not ready yet"), !1) : n >= 0 && this.account.itemCount >= this.$.list.getCount() && !this.transactions[n] ? (this.doLoadingStart(), Checkbook.globals.transactionManager.fetchTransactions(this.account, {
onSuccess: this.bound.transactionFetchGroupHandler
}, t.pageSize, n), !0) : !1;
},
transactionFetchGroupHandler: function(e, t, n) {
this.log(n.length, t.length);
var r = 0;
n.length > 0 && (e > 0 || this.account.sort !== "0" && this.account.sort !== "6" && this.account.sort !== "8") && (r = n[0].balanceToDate);
var i = this.account.runningBalance === 1 && (this.account.sort === 0 || this.account.sort === 1 || this.account.sort === 6 || this.account.sort === 7 || this.account.sort === 8);
for (var s = 0; s < t.length; s++) {
if (this.account.sort === 0 || this.account.sort === 6 || this.account.sort === 8) r += t[s].amount;
this.transactions[e + s] = enyo.mixin({
dispRunningBalance: i,
runningBalance: prepAmount(r),
amount: prepAmount(t[s].amount)
}, t[s]), this.transactions[e + s].desc = GTS.String.dirtyString(this.transactions[e + s].desc), this.transactions[e + s].category = GTS.String.dirtyString(this.transactions[e + s].category), this.transactions[e + s].category2 = GTS.String.dirtyString(this.transactions[e + s].category2), this.transactions[e + s].note = GTS.String.dirtyString(this.transactions[e + s].note), this.account.sort !== 0 && this.account.sort !== 6 && this.account.sort !== 8 && (r -= this.transactions[e + s].amount);
}
this.$.list.setCount(this.transactions.length), this.$.list.refresh(), this.initialScrollCompleted ? this.savedScrollPosition && enyo.job("moveToSavedScrollPosition", this.bound.moveToSavedScrollPosition, 1e3) : (this.initialScrollCompleted = !0, this.initialScroll()), enyo.asyncMethod(this, this.doLoadingFinish);
},
duplicateTransaction: function(e) {
this.log(), this.toggleCreateButtons();
var t, n = enyo.clone(this.transactions[e]);
GTS.Object.validNumber(n.linkedRecord) && n.linkedRecord >= 0 ? t = "transfer" : n.amount < 0 ? t = "expense" : t = "income", delete n.date, delete n.itemId, delete n.linkedRecord, delete n.repeatId, delete n.cleared, enyo.Signals.send("modifyTransaction", {
name: "createTransaction",
kind: "Checkbook.transactions.modify",
accountObj: this.account,
trsnObj: n,
transactionType: t.toLowerCase(),
onFinish: enyo.bind(this, this.addTransactionComplete)
});
},
transactiontapped: function(e, t) {
return Checkbook.globals.prefs.transPreview === 1 ? (this.$.viewSingle.setIndex(t.rowIndex), this.$.viewSingle.setTransaction(this.transactions[t.rowIndex]), this.$.viewSingle.setAccount(this.account), enyo.asyncMethod(this.$.viewSingle, this.$.viewSingle.show)) : enyo.asyncMethod(this, this.vsEdit, null, t), !0;
},
vsEdit: function(e, t) {
this.log(), this.account.frozen !== 1 && (this.doScrimShow(), enyo.Signals.send("modifyTransaction", {
name: "editTransaction",
kind: "Checkbook.transactions.modify",
accountObj: this.account,
trsnObj: enyo.clone(this.transactions[t.rowIndex]),
transactionType: "",
onFinish: enyo.bind(this, this.modifyTransactionComplete, t.rowIndex)
}));
},
modifyTransactionComplete: function(e, t, n) {
var r = n.modifyStatus;
delete n.modifyStatus, r == 1 ? (enyo.Signals.send("accountBalanceChanged", {
accounts: n
}), this.reloadTransactionList(), enyo.asyncMethod(this.$.list, this.$.list.scrollToRow, e)) : r == 2 && (enyo.Signals.send("accountBalanceChanged", {
accounts: n
}), this.account.itemCount--, this.reloadTransactionList(), enyo.asyncMethod(this.$.list, this.$.list.scrollToRow, e - 1)), enyo.asyncMethod(this, this.doScrimHide);
},
transactionHeld: function(e, t) {
return this.log(arguments), this.log("I DO NOT WORK YET"), !0;
},
transactionHeldHandler: function(e, t) {
this.log(), this.log("I DO NOT WORK YET", arguments);
return !0;
var n;
},
transactionCleared: function(e, t) {
return this.log(), this.vsCleared(null, t), t.preventDefault(), !0;
},
vsCleared: function(e, t) {
var n = t.rowIndex;
if (!this.transactions[n]) return;
if (this.account.frozen === 1) {
this.$.list.refresh();
return;
}
var r = this.transactions[n].cleared !== 1;
return this.transactions[n].cleared = r ? 1 : 0, Checkbook.globals.transactionManager.clearTransaction(this.transactions[n].itemId, r), this.$.list.renderRow(n), enyo.Signals.send("accountBalanceChanged", {
accounts: {
account: this.transactions[n].account,
linkedAccount: this.transactions[n].linkedAccount
}
}), enyo.isFunction(t.callback) && t.callback(r), !0;
},
deleteTransactionConfirmHandler: function() {
this.log(), this.transactionDeleted(null, this.$.deleteTransactionConfirm.rowIndex), this.deleteTransactionConfirmClose();
},
deleteTransactionConfirmClose: function() {
this.log(), this.$.deleteTransactionConfirm.close();
},
transactionDeleted: function(e, t) {
this.log();
var n = t.rowIndex;
if (this.account.frozen === 1) {
this.$.list.setCount(this.transactions.length), this.$.list.refresh();
return;
}
var r = {
account: this.transactions[n].account,
linkedAccount: this.transactions[n].linkedAccount
};
Checkbook.globals.transactionManager.deleteTransaction(this.transactions[n].itemId);
if (t.recurrence) {
enyo.Signals.send("accountBalanceChanged", {
accounts: r
}), this.reloadTransactionList();
return;
}
var i = this.transactions[n].amount;
this.transactions.splice(n, 1);
if (this.account.runningBalance === 1 && (this.account.sort === 0 || this.account.sort === 1 || this.account.sort === 6 || this.account.sort === 7 || this.account.sort === 8)) {
if (n === 0) {
enyo.Signals.send("accountBalanceChanged", {
accounts: r
}), this.reloadTransactionList();
return;
}
var s = n > this.$.list.getPageSize() ? n - this.$.list.getPageSize() : 0, o = n + this.$.list.getPageSize() < this.transactions.length ? n + this.$.list.getPageSize() : this.transactions.length, u = s, a = this.transactions[u].runningBalance - i;
while (u < o && this.transactions[u]) {
if (this.account.sort === 0 || this.account.sort === 6 || this.account.sort === 8) a += this.transactions[u].amount;
this.transactions[u].runningBalance = prepAmount(a), this.account.sort !== 0 && this.account.sort !== 6 && this.account.sort !== 8 && (a -= this.transactions[u].amount), u++;
}
}
this.$.list.setCount(this.transactions.length), this.$.list.refresh(), Checkbook.globals.transactionManager.fetchTransactions(this.account, {
onSuccess: this.bound.transactionFetchGroupHandler
}, 1, this.transactions.length), enyo.Signals.send("accountBalanceChanged", {
accounts: r
});
}
});

// single.js

enyo.kind({
name: "Checkbook.transactions.viewSingle",
kind: "onyx.Popup",
classes: "large-popup",
modal: !0,
centered: !0,
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1,
published: {
index: -1,
account: null,
transaction: null
},
events: {
onClear: "",
onEdit: "",
onDelete: ""
},
components: [ {
content: "Transaction Details",
classes: "biggest bold text-center padding-half-bottom"
}, {
name: "scroller",
kind: "enyo.Scroller",
horizontal: "hidden",
classes: "light popup-scroller",
components: [ {
kind: "onyx.Groupbox",
components: [ {
name: "desc",
classes: "bordered bigger padding-std",
style: "min-height: 65px;"
}, {
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "bordered padding-std text-middle",
components: [ {
classes: "img-icon margin-half-right",
style: "overflow: hidden;",
components: [ {
name: "transTypeIcon",
kind: "enyo.Image",
style: "width: 32px; height: 64px;"
} ]
}, {
name: "amount",
classes: "big",
fit: !0
}, {
content: "amount",
classes: "label"
} ]
}, {
name: "fromAccountHolder",
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "expenseIcon custom-background bordered padding-std padding-left text-middle",
components: [ {
name: "fromAccountImg",
kind: "enyo.Image",
classes: "img-icon margin-right"
}, {
name: "fromAccount",
fit: !0
}, {
content: "from",
classes: "label"
} ]
}, {
name: "toAccountHolder",
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "incomeIcon custom-background bordered padding-std padding-left text-middle",
components: [ {
name: "toAccountImg",
kind: "enyo.Image",
classes: "img-icon margin-right"
}, {
name: "toAccount",
fit: !0
}, {
content: "to",
classes: "label"
} ]
}, {
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "bordered padding-std text-middle",
components: [ {
kind: "enyo.Image",
src: "assets/calendar.png",
classes: "img-icon margin-right"
}, {
name: "time"
} ]
}, {
showing: !1,
content: "Repeat"
}, {
name: "categoryHolder",
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "bordered padding-std text-middle",
components: [ {
name: "category",
allowHtml: !0,
fit: !0
}, {
content: "category",
classes: "label"
} ]
}, {
name: "checkNumHolder",
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "bordered padding-std text-middle",
components: [ {
name: "checkNum",
fit: !0
}, {
content: "check number",
classes: "label"
} ]
}, {
name: "payeeHolder",
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "bordered padding-std text-middle",
components: [ {
name: "payee",
fit: !0
}, {
content: "payee",
classes: "label"
} ]
}, {
name: "cleared",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Cleared",
sublabel: "",
onContent: "Cleared",
offContent: "Pending",
onChange: "clearToggled"
}, {
name: "noteHolder",
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "bordered padding-std text-top",
components: [ {
name: "note",
allowHtml: !0,
fit: !0
}, {
content: "note",
classes: "label"
} ]
} ]
} ]
}, {
classes: "padding-std text-center h-box pack-center",
components: [ {
name: "btnCancel",
kind: "onyx.Button",
content: "Close",
ontap: "hide",
classes: "margin-right box-flex"
}, {
name: "btnDelete",
kind: "onyx.Button",
content: "Delete",
ontap: "deleteClicked",
classes: "onyx-negative box-flex"
}, {
name: "btnEdit",
kind: "onyx.Button",
content: "Edit",
ontap: "editClicked",
classes: "tardis-blue margin-left box-flex"
} ]
} ],
constructor: function() {
this.log(), this.inherited(arguments), this._binds = {
renderFromAccount: enyo.bind(this, this.renderFromAccount),
renderToAccount: enyo.bind(this, this.renderToAccount)
};
},
show: function(e) {
this.log();
if (!e) {
if (!this.account.acctId) {
this.hide();
return;
}
var t = 0;
for (var n in this.account) this.account.hasOwnProperty(n) && t++;
var r = enyo.bind(this, this.inherited, arguments);
t <= 5 ? Checkbook.globals.accountManager.fetchAccount(this.account.acctId, {
onSuccess: enyo.bind(this, this.loadAccount, r)
}) : this.renderDisplay(r);
} else this.inherited(arguments);
},
reflow: function() {
this.log(), this.$.scroller.applyStyle("height", null), this.inherited(arguments);
var e = this.$.scroller.getBounds();
e && this.$.scroller.applyStyle("height", e.height + "px");
},
hide: function(e) {
this.log();
if (!e) {
for (var t = 0; t < appColors.length; t++) this.$.desc.removeClass(appColors[t].name), this.$.toAccountHolder.removeClass(appColors[t].name), this.$.fromAccountHolder.removeClass(appColors[t].name);
this.$.desc.removeClass("custom-background legend");
}
this.inherited(arguments);
},
loadAccount: function(e, t) {
this.log(), this.account = t, this.renderDisplay(e);
},
renderDisplay: function(e) {
this.log(), this.account.frozen === 1 ? (this.$.btnEdit.hide(), this.$.btnDelete.hide()) : (this.$.btnEdit.show(), this.$.btnDelete.show()), this.$.desc.addRemoveClass("custom-background legend " + this.account.acctCategoryColor, Checkbook.globals.prefs.dispColor === 1), this.$.desc.setContent(this.transaction.desc), this.transactionType = Checkbook.globals.transactionManager.determineTransactionType(this.transaction), this.$.transTypeIcon.setSrc("assets/menu_icons/" + this.transactionType + ".png"), this.$.amount.setContent(formatAmount(Math.abs(this.transaction.amount))), this.transactionType === "transfer" ? (this.$.fromAccountHolder.show(), this.$.toAccountHolder.show(), this.transaction.amount < 0 ? (this._binds.renderFromAccount(this.account), Checkbook.globals.accountManager.fetchAccount(this.transaction.linkedAccount, {
onSuccess: this._binds.renderToAccount
})) : (Checkbook.globals.accountManager.fetchAccount(this.transaction.linkedAccount, {
onSuccess: this._binds.renderFromAccount
}), this._binds.renderToAccount(this.account))) : (this.$.fromAccountHolder.hide(), this.$.toAccountHolder.hide());
var t = new Date(parseInt(this.transaction.date));
this.$.time.setContent(t.format({
date: "long",
time: this.account.showTransTime === 1 ? "short" : ""
})), this.account.enableCategories === 1 ? (this.$.categoryHolder.show(), this.$.category.setContent(Checkbook.globals.transactionManager.formatCategoryDisplay(this.transaction.category, this.transaction.category2, !1, ""))) : this.$.categoryHolder.hide(), this.account.checkField === 1 && this.transaction.checkNum && this.transaction.checkNum !== "" ? (this.$.checkNumHolder.show(), this.$.checkNum.setContent("#" + this.transaction.checkNum)) : (this.$.checkNumHolder.hide(), this.$.checkNum.setContent("")), this.$.cleared.setValue(this.transaction["cleared"] == 1), this.account.payeeField === 1 && this.transaction.payee && this.transaction.payee !== "" ? (this.$.payeeHolder.show(), this.$.payee.setContent(this.transaction.payee)) : this.$.payeeHolder.hide(), this.transaction["note"] != "" ? (this.$.noteHolder.show(), this.$.note.setContent(this.transaction.note.replace(/\n/g, "<br />"))) : this.$.noteHolder.hide(), e();
},
renderFromAccount: function(e) {
this.$.fromAccountImg.setSrc("assets/" + e.acctCategoryIcon), this.$.fromAccount.setContent(e.acctName), Checkbook.globals.prefs.dispColor === 1 ? this.$.fromAccountHolder.addClass(e.acctCategoryColor) : this.$.fromAccountHolder.removeClass("custom-background");
},
renderToAccount: function(e) {
this.$.toAccountImg.setSrc("assets/" + e.acctCategoryIcon), this.$.toAccount.setContent(e.acctName), Checkbook.globals.prefs.dispColor === 1 ? this.$.toAccountHolder.addClass(e.acctCategoryColor) : this.$.toAccountHolder.removeClass("custom-background");
},
clearToggled: function() {
var e = this.doClear({
rowIndex: this.index,
callback: enyo.bind(this, this.clearToggledHandler)
});
return !0;
},
clearToggledHandler: function(e) {
return this.$.cleared.setValue(e), !0;
},
editClicked: function() {
this.doEdit({
rowIndex: this.index
}), enyo.asyncMethod(this, this.hide);
},
deleteClicked: function() {
this.transaction.repeatId > 0 || this.transaction.repeatId === 0 ? this.createComponent({
name: "deleteTransactionConfirm",
kind: "Checkbook.transactions.recurrence.delete",
transactionId: this.transaction.itemId,
recurrenceId: this.transaction.repeatId,
onFinish: "deleteTransactionHandler",
onCancel: "deleteTransactionConfirmClose"
}) : this.createComponent({
name: "deleteTransactionConfirm",
kind: "gts.ConfirmDialog",
title: "Delete Transaction",
message: "Are you sure you want to delete this transaction?",
confirmText: "Delete",
confirmClass: "onyx-negative",
cancelText: "Cancel",
cancelClass: "",
onConfirm: "deleteTransactionHandler",
onCancel: "deleteTransactionConfirmClose"
}), this.hide(!0), this.$.deleteTransactionConfirm.show();
},
deleteTransactionConfirmClose: function() {
this.$.deleteTransactionConfirm.hide(), this.$.deleteTransactionConfirm.destroy(), this.show(!0);
},
deleteTransactionHandler: function() {
this.deleteTransactionConfirmClose(), this.doDelete({
rowIndex: this.index,
recurrence: this.transaction.repeatId > 0 || this.transaction.repeatId === 0
}), enyo.asyncMethod(this, this.hide);
}
});

// modify.js

enyo.kind({
name: "Checkbook.transactions.modify",
kind: "FittableRows",
classes: "enyo-fit",
style: "height: 100%;",
accountList: [],
renderCategories: !1,
published: {
accountObj: {},
trsnObj: {},
transactionType: ""
},
events: {
onFinish: ""
},
components: [ {
kind: "onyx.Toolbar",
classes: "text-center",
components: [ {
name: "transTypeText",
content: "Modify Transaction",
classes: "bigger"
} ]
}, {
kind: "enyo.Scroller",
horizontal: "hidden",
classes: "deep-green-gradient",
fit: !0,
components: [ {
classes: "light narrow-column",
style: "min-height: 100%;",
components: [ {
kind: "onyx.Groupbox",
classes: "padding-half-top padding-half-bottom",
components: [ {
name: "autocomplete",
kind: "Checkbook.transactions.autocomplete",
onValueChanged: "descAutoSuggestMade",
components: [ {
name: "desc",
kind: "onyx.Input",
placeholder: "Enter Description",
onkeypress: "descKeyPress",
autoKeyModifier: "shift-single"
} ]
}, {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
components: [ {
name: "transTypeIcon",
kind: "onyx.Icon",
ontap: "amountTypeChanged",
classes: "margin-right"
}, {
name: "amount",
kind: "GTS.DecimalInput",
fit: !0,
placeholder: "0.00"
}, {
content: "Amount",
classes: "label"
} ]
}, {
name: "account",
kind: "GTS.SelectorBar",
label: "Account",
onChange: "accountChanged",
classes: "custom-background bordered"
}, {
name: "linkedAccount",
kind: "GTS.SelectorBar",
label: "Transfer To...",
onChange: "linkedAccountChanged",
classes: "custom-background"
} ]
}, {
kind: "onyx.Groupbox",
classes: "padding-half-top padding-half-bottom",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Date",
classes: "padding-std"
}, {
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "padding-std",
ontap: "toggleDateDrawer",
components: [ {
kind: "enyo.Image",
src: "assets/calendar.png",
classes: "img-icon",
style: "margin-right: 1em;"
}, {
name: "dateDisplay",
style: "margin-top: 2px;",
fit: !0
}, {
name: "dateArrow",
classes: "arrow"
} ]
}, {
name: "dateDrawer",
kind: "onyx.Drawer",
open: !1
} ]
}, {
name: "categoryHolder",
kind: "onyx.Groupbox",
classes: "padding-half-top padding-half-bottom",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Category",
classes: "padding-std"
}, {
name: "categoryList",
kind: "enyo.Repeater",
onSetupItem: "getCategoryItem",
classes: "transaction-category-list",
components: [ {
name: "categoryWrapper",
classes: "onyx-item text-middle bordered h-box",
components: [ {
name: "categoryText",
kind: "onyx.Button",
classes: "margin-right box-flex",
ontap: "categoryTapped"
}, {
name: "categoryItemBreak",
tag: "br"
}, {
components: [ {
kind: "onyx.InputDecorator",
classes: "inline-force margin-right",
components: [ {
name: "categoryAmount",
kind: "GTS.DecimalInput",
oninput: "categoryAmountChanged",
placeholder: "0.00"
} ]
}, {
name: "categoryDelete",
kind: "onyx.Button",
classes: "small-padding",
content: "-",
ontap: "categoryDelete"
} ]
} ]
} ]
}, {
name: "categoryFooter",
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "padding-std",
components: [ {
kind: "onyx.Button",
content: "Add Category",
ontap: "categoryAddNew",
classes: "margin-right",
style: "min-width: 45%;"
}, {
fit: !0
}, {
name: "fillValueButton",
kind: "onyx.Button",
content: "Fill Values",
ontap: "categoriesFillValues",
classes: "margin-left",
style: "min-width: 25%;"
} ]
} ]
}, {
name: "recurrenceWrapper",
kind: "onyx.Groupbox",
classes: "padding-half-top padding-half-bottom",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Recurrence",
classes: "padding-std"
}, {
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "padding-std",
ontap: "toggleRecurrenceDrawer",
components: [ {
kind: "enyo.Image",
src: "assets/repeat.png",
classes: "img-icon",
style: "margin-right: 1em;"
}, {
name: "recurrenceDisplay",
style: "margin-top: 2px;",
fit: !0
}, {
name: "recurrenceArrow",
classes: "arrow"
} ]
}, {
name: "recurrenceDrawer",
kind: "onyx.Drawer",
open: !1,
components: [ {
name: "recurrenceSelect",
kind: "Checkbook.transactions.recurrence.select",
onRecurrenceChange: "recurrenceChanged"
} ]
} ]
}, {
name: "checkNumHolder",
kind: "onyx.Groupbox",
classes: "padding-half-top padding-half-bottom",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
classes: "padding-half-top",
components: [ {
name: "checkNum",
kind: "onyx.Input",
fit: !0,
placeholder: "# (optional)"
}, {
kind: "onyx.Button",
content: "Check Number",
classes: "label",
ontap: "autofillCheckNo"
} ]
} ]
}, {
name: "payeeFieldHolder",
kind: "onyx.Groupbox",
classes: "padding-half-top padding-half-bottom",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
classes: "padding-half-top",
components: [ {
name: "payeeField",
kind: "onyx.Input",
fit: !0
}, {
content: "Payee",
classes: "label"
} ]
} ]
}, {
name: "cleared",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Cleared",
sublabel: "",
onContent: "Cleared",
offContent: "Pending",
value: !1
}, {
name: "autoTrans",
kind: "GTS.ToggleBar",
classes: "bordered",
label: "Auto Transfer",
sublabel: "",
onContent: "Yes",
offContent: "No",
value: !0
}, {
kind: "onyx.Groupbox",
classes: "padding-half-top",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
components: [ {
name: "notes",
kind: "onyx.TextArea",
placeholder: "Transaction Notes",
style: "min-height: 150px;",
fit: !0
}, {
content: "Notes",
classes: "label",
style: "vertical-align: top;"
} ]
} ]
}, {
name: "transactionDeleteButton",
kind: "onyx.Button",
content: "Delete Transaction",
ontap: "deleteTransaction",
classes: "onyx-negative margin-top",
style: "width: 100%;"
}, {
style: "height: 1.5em;"
} ]
} ]
}, {
kind: "onyx.Toolbar",
classes: "text-center two-button-toolbar",
components: [ {
kind: "onyx.Button",
content: "Cancel",
ontap: "doFinish"
}, {
content: ""
}, {
kind: "onyx.Button",
content: "Save",
ontap: "saveTransaction",
classes: "deep-green"
} ]
}, {
name: "loadingScrim",
kind: "onyx.Scrim",
classes: "onyx-scrim-translucent"
}, {
name: "loadingSpinner",
kind: "onyx.Spinner",
classes: "size-double",
style: "z-index: 2; position: absolute; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
}, {
name: "categorySystem",
kind: "Checkbook.transactionCategory.select"
} ],
create: function() {
this.inherited(arguments), this.buildDateSystem();
},
buildDateSystem: function() {
!enyo.Panels.isScreenNarrow() || Checkbook.globals.prefs.alwaysFullCalendar ? this.$.dateDrawer.createComponent({
name: "date",
kind: "GTS.DatePicker",
onSelect: "dateChanged",
components: [ {
name: "time",
kind: "GTS.TimePicker",
label: "Time",
minuteInterval: 5,
is24HrMode: !1,
onSelect: "dateChanged"
} ]
}, {
owner: this
}) : this.$.dateDrawer.createComponents([ {
classes: "onyx-toolbar-inline",
components: [ {
name: "label",
classes: "label",
content: "Date"
}, {
name: "date",
kind: "onyx.DatePicker",
onSelect: "dateChanged"
} ]
}, {
name: "time",
kind: "GTS.TimePicker",
label: "Time",
minuteInterval: 5,
is24HrMode: !1,
onSelect: "dateChanged"
} ], {
owner: this
});
},
rendered: function() {
this.inherited(arguments), this.$.loadingScrim.show(), this.$.loadingSpinner.show(), delete this.trsnObj.dispRunningBalance, delete this.trsnObj.runningBalance, this.trsnObj = enyo.mixin({
itemId: -1,
desc: "",
amount: "",
amount_old: "NOT_A_VALUE",
note: "",
date: Date.parse(new Date),
account: this.accountObj.acctId,
linkedRecord: -1,
linkedAccount: -1,
cleared: 0,
repeatId: -1,
repeatUnlinked: 0,
checkNum: "",
category: "Uncategorized",
category2: "Other",
payee: ""
}, this.trsnObj), this.trsnObj.itemId < 0 ? (this.$.transTypeText.setContent("New Transaction"), this.$.transactionDeleteButton.hide()) : this.$.transTypeText.setContent("Modify Transaction"), Checkbook.globals.accountManager.fetchAccountsList({
onSuccess: enyo.bind(this, this.buildAccountSystems)
});
},
buildAccountSystems: function(e) {
this.accountList = e, this.$.account.setChoices(this.accountList), this.$.account.setDisabled(!1), this.$.account.render(), this.accountList.length > 1 ? (this.$.linkedAccount.setChoices(this.accountList), this.$.linkedAccount.setDisabled(!1), this.$.linkedAccount.render()) : this.$.linkedAccount.setDisabled(!0);
var t = 0;
for (var n in this.accountObj) this.accountObj.hasOwnProperty(n) && t++;
t <= 5 ? Checkbook.globals.accountManager.fetchAccount(this.accountObj.acctId, {
onSuccess: enyo.bind(this, this.initialAccountLoadHandler)
}) : this.$.categorySystem.loadCategories(enyo.bind(this, this.loadTransactionData));
},
initialAccountLoadHandler: function(e) {
this.$.account.removeClass(this.accountObj.acctCategoryColor), this.accountObj = e, this.$.categorySystem.loadCategories(enyo.bind(this, this.loadTransactionData));
},
loadTransactionData: function() {
this.log(), GTS.Object.validNumber(this.trsnObj.amount) && (this.trsnObj.amount_old = this.trsnObj.amount), this.trsnObj.itemId >= 0 && (this.transactionType = Checkbook.globals.transactionManager.determineTransactionType(this.trsnObj)), this.trsnObj.amount = Math.abs(this.trsnObj.amount).toFixed(2), this.trsnObj.date = new Date(parseInt(this.trsnObj.date)), this.trsnObj.cleared = this.trsnObj.cleared === 1, this.$.desc.setValue(this.trsnObj.desc), this.$.amount.setValue(this.trsnObj.amount), this.$.account.setValue(this.trsnObj.account), this.$.linkedAccount.setValue(this.trsnObj.linkedAccount), this.$.date.setValue(this.trsnObj.date), this.$.time.setValue(this.trsnObj.date), this.$.checkNum.setValue(this.trsnObj.checkNum), this.$.payeeField.setValue(this.trsnObj.payee), this.$.cleared.setValue(this.trsnObj.cleared), this.$.notes.setValue(this.trsnObj.note), (this.trsnObj.repeatId > 0 || this.trsnObj.repeatId === 0) && this.trsnObj["repeatUnlinked"] != 1 ? Checkbook.globals.transactionManager.$.recurrence.fetch(this.trsnObj.repeatId, {
onSuccess: enyo.bind(this, this.loadRecurrenceData)
}) : this.trsnObj["repeatUnlinked"] == 1 && this.$.recurrenceWrapper.hide(), this.trsnObj.category = Checkbook.globals.transactionManager.parseCategoryDB(this.trsnObj.category, this.trsnObj.category2), this.trsnObj.categoryOriginal = this.trsnObj.category, this.renderCategories = !0, this.$.transTypeIcon.setSrc("assets/menu_icons/" + this.transactionType + ".png"), this.adjustSystemViews(), this.dateChanged(), this.$.loadingScrim.hide(), this.$.loadingSpinner.hide(), this.reflow();
},
adjustSystemViews: function() {
this.$.linkedAccount.setShowing(this.transactionType === "transfer"), this.$.autocomplete.setEnabled(this.accountObj.useAutoComplete === 1), this.$.autoTrans.setShowing(this.trsnObj.itemId < 0 && this.transactionType !== "transfer" && this.accountObj.auto_savings > 0 && this.accountObj.auto_savings_link > -1), this.accountObj["atmEntry"] == 1 ? (this.$.amount.setAtm(!0), this.$.amount.setSelectAllOnFocus(!1)) : (this.$.amount.setAtm(!1), this.$.amount.setSelectAllOnFocus(!0)), this.accountObj["enableCategories"] == 1 ? (this.categoryChanged(), this.$.categoryHolder.show()) : this.$.categoryHolder.hide(), this.accountObj["checkField"] == 1 ? (this.$.checkNumHolder.show(), Checkbook.globals.transactionManager.fetchMaxCheckNumber(this.$.account.getValue(), {
onSuccess: enyo.bind(this, this.adjustMaxCheckNumber)
})) : this.$.checkNumHolder.hide(), this.accountObj["payeeField"] == 1 ? this.$.payeeFieldHolder.show() : this.$.payeeFieldHolder.hide(), Checkbook.globals.prefs.dispColor === 1 ? (this.$.account.addClass(this.accountObj.acctCategoryColor), this.$.linkedAccount.getDisabled() || Checkbook.globals.accountManager.fetchAccount(this.$.linkedAccount.getValue(), {
onSuccess: enyo.bind(this, this.linkedAccountChangedFollower, "set")
})) : (this.$.account.removeClass("custom-background"), this.$.linkedAccount.removeClass("custom-background")), enyo.asyncMethod(this.$.desc, this.$.desc.focus);
},
descKeyPress: function(e, t) {
this.accountObj.transDescMultiLine !== 1 && t.keyCode === 13 && t.preventDefault();
},
descAutoSuggestMade: function(e, t) {
this.trsnObj.desc = this.$.desc.getValue(), t.data && (this.trsnObj.linkedAccount = this.transactionType === "transfer" ? t.linkedAccount : -1, this.$.linkedAccount.setValue(this.trsnObj.linkedAccount), this.trsnObj.category = t.category, this.categoryChanged()), enyo.asyncMethod(this.$.amount, this.$.amount.focus);
},
amountTypeChanged: function(e, t) {
switch (this.transactionType) {
case "expense":
this.transactionType = "income";
break;
case "transfer":
break;
case "income":
this.transactionType = "expense";
}
this.$.transTypeIcon.setSrc("assets/menu_icons/" + this.transactionType + ".png");
},
accountChanged: function(e, t, n) {
Checkbook.globals.accountManager.fetchAccount(this.$.account.getValue(), {
onSuccess: enyo.bind(this, this.accountChangedFollower)
});
},
accountChangedFollower: function(e) {
this.$.account.removeClass(this.accountObj.acctCategoryColor), this.accountObj = e, this.adjustSystemViews(), this.dateChanged();
},
linkedAccountChanged: function(e, t, n) {
Checkbook.globals.accountManager.fetchAccount(n, {
onSuccess: enyo.bind(this, this.linkedAccountChangedFollower, "unset")
});
},
linkedAccountChangedFollower: function(e, t) {
e === "unset" ? (this.$.linkedAccount.removeClass(t.acctCategoryColor), Checkbook.globals.accountManager.fetchAccount(this.$.linkedAccount.getValue(), {
onSuccess: enyo.bind(this, this.linkedAccountChangedFollower, "set")
})) : e === "set" && this.$.linkedAccount.addClass(t.acctCategoryColor);
},
toggleDateDrawer: function() {
this.$.dateArrow.addRemoveClass("invert", !this.$.dateDrawer.getOpen()), this.$.dateDrawer.setOpen(!this.$.dateDrawer.getOpen()), this.$.date.render();
},
dateChanged: function(e, t) {
var n = this.$.date.getValue(), r = this.$.time.getValue();
return n.setHours(r.getHours()), n.setMinutes(r.getMinutes()), this.$.dateDisplay.setContent(n.format({
date: "long",
time: this.accountObj.showTransTime === 1 ? "short" : ""
})), this.$.recurrenceSelect.setDate(n), this.$.recurrenceSelect.dateChanged(), !0;
},
getCategoryItem: function(e, t) {
if (!this.renderCategories) return;
var n = this.trsnObj.category[t.index], r = t.item;
if (n && r) return r.$.categoryWrapper.addRemoveClass("h-box", !enyo.Panels.isScreenNarrow()), r.$.categoryItemBreak.setShowing(enyo.Panels.isScreenNarrow()), r.$.categoryText.setContent(n.category + " >> " + GTS.String.dirtyString(n.category2)), r.$.categoryText.addRemoveClass("margin-half-bottom", enyo.Panels.isScreenNarrow()), r.$.categoryText.addRemoveClass("full-width", enyo.Panels.isScreenNarrow()), this.trsnObj.category.length > 1 ? (n.amount = Math.abs(n.amount).toFixed(2), this.accountObj["atmEntry"] == 1 ? (r.$.categoryAmount.setValue(deformatAmount(n.amount)), r.$.categoryAmount.setAtm(!0), r.$.categoryAmount.setSelectAllOnFocus(!1)) : (r.$.categoryAmount.setAtm(!1), r.$.categoryAmount.setSelectAllOnFocus(!0)), r.$.categoryAmount.setDisabled(!1), r.$.categoryDelete.setDisabled(!1), r.$.categoryDelete.addClass("onyx-negative")) : (r.$.categoryAmount.setDisabled(!0), r.$.categoryDelete.setDisabled(!0), r.$.categoryDelete.removeClass("onyx-negative"), n.amount = 0), !0;
},
categoryTapped: function(e, t) {
this.$.categorySystem.getCategoryChoice(enyo.bind(this, this.categorySelected, t.index), this.trsnObj.category[t.index]);
},
categorySelected: function(e, t) {
enyo.mixin(this.trsnObj.category[e], t), this.categoryChanged();
},
categoriesFillValues: function(e, t) {
var n, r = 0, i = [], s = 0;
for (var o = 0; o < this.trsnObj.category.length; o++) n = deformatAmount(this.trsnObj.category[o].amount), r += n, n == 0 && i.push(o);
r = deformatAmount(this.$.amount.getValue()) - r, s = i.length;
if (r > 0 && s > 0) {
var u = (r / s).toFixed(2);
for (var o = 0; o < s - 1; o++) this.trsnObj.category[i[o]].amount = u;
this.trsnObj.category[i[s - 1]].amount = r - u * (s - 1);
}
this.categoryChanged();
},
categoryAmountChanged: function(e, t) {
this.trsnObj.category[t.index].amount = e.getValueAsNumber();
},
categoryAddNew: function() {
this.trsnObj.category.push({
category: "Uncategorized",
category2: "Other",
amount: ""
}), this.categoryChanged();
},
categoryDelete: function(e, t) {
this.trsnObj.category.splice(t.index, 1), this.categoryChanged();
},
categoryChanged: function() {
this.$.fillValueButton.setShowing(this.trsnObj.category.length > 1), this.$.categoryFooter.reflow(), this.$.categoryList.setCount(this.trsnObj.category.length);
},
loadRecurrenceData: function(e) {
if (e["terminated"] == 1) {
this.$.recurrenceWrapper.hide();
return;
}
this.trsnObj.rObj = enyo.clone(e), this.trsnObj.rObj.endDate = new Date(parseInt(e.endDate)), this.trsnObj.rObj.origDate = new Date(parseInt(e.origDate)), this.trsnObj.rObj.lastUpdated = new Date(parseInt(e.lastUpdated)), this.trsnObj.rObj.lastOccurrence = new Date(parseInt(e.lastOccurrence)), this.$.recurrenceSelect.setValue(this.trsnObj.rObj);
},
toggleRecurrenceDrawer: function() {
this.$.recurrenceArrow.addRemoveClass("invert", !this.$.recurrenceDrawer.getOpen()), this.$.recurrenceDrawer.setOpen(!this.$.recurrenceDrawer.getOpen());
},
recurrenceChanged: function(e, t) {
this.$.recurrenceDisplay.setContent(t.summary);
},
adjustMaxCheckNumber: function(e) {
this.$.checkNum.autofillValue = e;
},
autofillCheckNo: function() {
this.accountObj["checkField"] == 1 && this.$.checkNum.getValue().length <= 0 && this.$.checkNum.setValue(this.$.checkNum.autofillValue);
},
saveTransaction: function() {
if (this.trsnObj.itemId < 0) this.saveNewTransaction(); else {
var e = this.$.recurrenceSelect.getValue();
if ((this.trsnObj.repeatId > 0 || this.trsnObj.repeatId === 0 || e.frequency !== "none") && this.trsnObj["repeatUnlinked"] != 1 && this.trsnObj["terminated"] != 1) {
var t = this.checkForChanges();
if (!t.major && !t.minor && !t.recurrence) {
this.doFinish({
status: 0
});
return;
}
if (this.trsnObj.repeatId > 0 || this.trsnObj.repeatId === 0) {
if (e["frequency"] == "none") {
this.createComponent({
name: "recurrenceEventDialog",
kind: "gts.ConfirmDialog",
title: "End Transaction Series",
message: "This will end the series and delete all following transactions.",
confirmText: "Continue",
confirmClass: "onyx-negative",
cancelText: "Cancel",
cancelClass: "",
onConfirm: "endRecurrenceEvent",
onCancel: "closeRecurrenceEventDialog"
}), this.$.recurrenceEventDialog.show();
return;
}
if (t.major) {
this.createComponent({
name: "recurrenceEventDialog",
kind: "Checkbook.transactions.recurrence.confirm",
onOne: "updateSingle",
onFuture: "updateFuture",
onAll: "updateAll",
onCancel: "closeRecurrenceEventDialog"
}), this.$.recurrenceEventDialog.show();
return;
}
if (t.recurrence) {
this.createComponent({
name: "recurrenceEventDialog",
kind: "gts.ConfirmDialog",
title: "Transaction Series",
message: "This will change this and all following transactions.",
confirmText: "Continue",
confirmClass: "",
cancelText: "Cancel",
cancelClass: "",
onConfirm: "updateFuture",
onCancel: "closeRecurrenceEventDialog"
}), this.$.recurrenceEventDialog.show();
return;
}
this.updateTransactionObject(t.minor);
} else this.updateTransactionObject();
Checkbook.globals.transactionManager.updateTransaction(this.trsnObj, this.transactionType, this.getSaveOptions());
} else this.saveModifiedTransaction();
}
},
getSaveOptions: function() {
return {
onSuccess: enyo.bind(this, this.saveCompleteHandler, {
modifyStatus: 1,
account: this.trsnObj.account,
linkedAccount: this.transactionType == "transfer" ? this.trsnObj.linkedAccount : -1,
atAccount: this.trsnObj.autoTransfer > 0 && this.trsnObj.autoTransferLink >= 0 ? this.trsnObj.autoTransferLink : -1
}),
onFailure: null
};
},
checkForChanges: function() {
var e = {
minor: !1,
major: !1,
recurrence: !1
}, t = this.$.date.getValue();
t.setHours(this.$.time.getValue().getHours()), t.setMinutes(this.$.time.getValue().getMinutes());
if (this.trsnObj.desc !== this.$.desc.getValue() || this.trsnObj["amount_old"] != this.$["amount"].getValue() || this.trsnObj.date !== t || this.trsnObj.account !== this.$.account.getValue() || this.$.linkedAccount.getShowing() && this.trsnObj.linkedAccount !== this.$.linkedAccount.getValue() || enyo.json.stringify(this.trsnObj.categoryOriginal) !== enyo.json.stringify(this.trsnObj.category) || this.trsnObj.payee !== this.$.payeeField.getValue() || this.trsnObj.note !== this.$.notes.getValue()) e.major = !0;
if (this.trsnObj.checkNum !== this.$.checkNum.getValue() || this.trsnObj.cleared !== this.$.cleared.getValue()) e.minor = !0;
return Checkbook.globals.transactionManager.$.recurrence.compare(this.trsnObj.rObj, this.$.recurrenceSelect.getValue()) || (e.recurrence = !0), e;
},
updateTransactionObject: function(e) {
this.trsnObj.desc = this.$.desc.getValue(), this.trsnObj.amount = this.$.amount.getValue(), this.trsnObj.account = this.$.account.getValue(), this.trsnObj.linkedAccount = this.$.linkedAccount.getValue();
var t = this.$.time.getValue();
this.trsnObj.date = this.$.date.getValue(), this.trsnObj.date.setHours(t.getHours()), this.trsnObj.date.setMinutes(t.getMinutes()), delete this.trsnObj.categoryOriginal, this.trsnObj.checkNum = this.$.checkNum.getValue(), this.trsnObj.payee = this.$.payeeField.getValue(), this.trsnObj.cleared = this.$.cleared.getValue(), this.trsnObj.note = this.$.notes.getValue(), e ? this.trsnObj.rObj = !1 : (this.trsnObj.rObj || (this.trsnObj.rObj = {}), enyo.mixin(this.trsnObj.rObj, enyo.clone(this.$.recurrenceSelect.getValue()))), this.trsnObj.autoTransfer = this.$.autoTrans.getShowing() && this.$.autoTrans.getValue() ? this.accountObj.auto_savings : 0, this.trsnObj.autoTransferLink = this.accountObj.auto_savings_link;
},
saveNewTransaction: function() {
this.updateTransactionObject(), Checkbook.globals.transactionManager.createTransaction(this.trsnObj, this.transactionType, this.getSaveOptions());
},
saveModifiedTransaction: function(e) {
this.updateTransactionObject(e), Checkbook.globals.transactionManager.updateTransaction(this.trsnObj, this.transactionType, this.getSaveOptions());
},
saveCompleteHandler: function(e) {
enyo.asyncMethod(this, this.doFinish, e);
},
closeRecurrenceEventDialog: function() {
this.$.recurrenceEventDialog.hide(), this.$.recurrenceEventDialog.destroy();
},
endRecurrenceEvent: function() {
this.closeRecurrenceEventDialog(), Checkbook.globals.transactionManager.$.recurrence.deleteOnlyFuture(this.trsnObj.itemId, this.trsnObj.repeatId, {
onSuccess: enyo.bind(this, this.saveModifiedTransaction, !0)
});
},
updateSingle: function() {
this.closeRecurrenceEventDialog(), this.trsnObj.repeatUnlinked = 1, this.saveModifiedTransaction(!0);
},
updateFuture: function() {
this.closeRecurrenceEventDialog(), this.saveModifiedTransaction();
},
updateAll: function() {
var e = this, t = this.trsnObj.repeatId;
this.closeRecurrenceEventDialog(), this.updateTransactionObject(), this.trsnObj.repeatId = -1, this.$.date.setValue(GTS.Object.isDate(this.trsnObj.rObj.origDate) ? this.trsnObj.rObj.origDate.getTime() : this.trsnObj.rObj.origDate), Checkbook.globals.transactionManager.$.recurrence.deleteAll(t, {
onSuccess: enyo.bind(this, this.saveNewTransaction)
});
},
deleteTransaction: function() {
this.trsnObj.itemId < 0 ? this.doFinish({
status: 0
}) : (this.trsnObj.repeatId > 0 || this.trsnObj.repeatId === 0 ? this.createComponent({
name: "deleteTransactionConfirm",
kind: "Checkbook.transactions.recurrence.delete",
transactionId: this.trsnObj.itemId,
recurrenceId: this.trsnObj.repeatId,
onFinish: "deleteTransactionConfirmClose",
onCancel: "deleteTransactionConfirmClose"
}) : this.createComponent({
name: "deleteTransactionConfirm",
kind: "gts.ConfirmDialog",
title: "Delete Transaction",
message: "Are you sure you want to delete this transaction?",
confirmText: "Delete",
confirmClass: "onyx-negative",
cancelText: "Cancel",
cancelClass: "",
onConfirm: "deleteTransactionHandler",
onCancel: "deleteTransactionConfirmClose"
}), this.$.deleteTransactionConfirm.show());
},
deleteTransactionConfirmClose: function() {
this.$.deleteTransactionConfirm.hide(), this.$.deleteTransactionConfirm.destroy();
},
deleteTransactionHandler: function() {
this.deleteTransactionConfirmClose(), Checkbook.globals.transactionManager.deleteTransaction(this.trsnObj.itemId, {
onSuccess: enyo.bind(this, this.saveCompleteHandler, {
modifyStatus: 2
})
});
}
});

// manager.js

enyo.kind({
name: "Checkbook.autocompleteprefs.manager",
kind: enyo.Component,
constructor: function() {
this.inherited(arguments);
if (!Checkbook.globals.gts_db) {
this.log("creating database object.");
var e = new GTS.database(getDBArgs());
}
}
});

// view.js

enyo.kind({
name: "Checkbook.autocompleteprefs.view",
style: "height: 100%;",
flex: 1,
events: {
onFinish: ""
},
components: [ {
kind: enyo.PageHeader,
className: "enyo-header-dark",
components: [ {
kind: enyo.Spacer
}, {
content: "Auto-Complete Preferences",
className: "bigger"
}, {
kind: enyo.Spacer
} ]
}, {
name: "entries",
kind: enyo.VirtualList,
flex: 1,
onSetupRow: "buildRow",
components: [ {
kind: enyo.SwipeableItem,
layoutKind: enyo.HFlexLayout,
className: "light narrow-column",
tapHighlight: !0,
ontap: "itemTapped",
onConfirm: "itemDeleted",
components: [ {
name: "desc",
className: "enyo-text-ellipsis",
flex: 1
}, {
name: "icon",
kind: enyo.Image,
className: "img-icon"
} ]
} ]
}, {
kind: enyo.Toolbar,
className: "tardis-blue",
components: [ {
kind: enyo.ToolButtonGroup,
components: [ {
caption: "Close",
className: "enyo-grouped-toolbutton-dark",
ontap: "doFinish"
}, {
icon: "assets/menu_icons/sort.png",
className: "enyo-grouped-toolbutton-dark",
ontap: ""
} ]
}, {
kind: enyo.Spacer,
flex: 1
}, {
kind: enyo.ToolButtonGroup,
components: [ {
icon: "assets/menu_icons/new.png",
className: "enyo-grouped-toolbutton-dark",
ontap: ""
} ]
} ]
} ],
itemTapped: function() {
this.log(arguments);
},
itemDeleted: function() {
this.log(arguments);
},
buildRow: function(e, t) {
if (t >= 0 && t < 100) return this.$.desc.setContent("description name: " + t), this.$.icon.setSrc("assets/" + (t % 2 == 0 ? "green-plus.png" : "red-cross.png")), !0;
},
fetchGroup: function(e, t) {
var n = t * e.getPageSize();
if (n < 0) return;
}
});

// modify.js

enyo.kind({
name: "Checkbook.autocompleteprefs.modify",
kind: enyo.Component
});

// autocomplete.js

enyo.kind({
name: "Checkbook.transactions.autocomplete",
events: {
onValueChanged: ""
},
published: {
enabled: !0
},
components: [ {
name: "ac",
kind: "GTS.AutoComplete",
onValueSelected: "handleSuggestion",
onDataRequested: "fetchData",
components: [ {
tag: "",
name: "client"
} ]
} ],
rendered: function() {
this.inherited(arguments), this.enabledChanged();
},
enabledChanged: function() {
this.$.ac.setEnabled(this.enabled);
},
fetchData: function(e, t) {
if (t.value.length <= 0) {
t.callback([]);
return;
}
Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "SELECT DISTINCT desc FROM transactions WHERE desc LIKE ? ORDER BY desc ASC LIMIT ?;",
values: [ t.value + "%", e.getLimit() ]
}), {
onSuccess: enyo.bind(this, this.buildSuggestionList)
});
},
buildSuggestionList: function(e) {
var t = [];
for (var n = 0; n < e.length; n++) t.push(e[n].desc);
this.$.ac.setValues(t);
},
handleSuggestion: function(e, t) {
return Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "SELECT ( SELECT linkedAccount FROM( SELECT b.linkedAccount, COUNT( b.desc ) AS countB FROM transactions b WHERE b.desc = a.desc AND b.linkedAccount != '' AND b.account = ? GROUP BY b.linkedAccount ORDER BY countB DESC LIMIT 1 ) ) AS linkedAcct,  ( CASE WHEN a.category = '||~SPLIT~||' THEN ( '[' || ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( '{ \"category\": \"' || ts.genCat || '\", \"category2\" : \"' || ts.specCat || '\", \"amount\": \"' || ts.amount || '\" }' ) AS json FROM transactionSplit ts WHERE ts.transId = a.itemId ORDER BY ts.amount DESC ) ) || ']' ) ELSE a.category END ) AS category, ( CASE WHEN a.category = '||~SPLIT~||' THEN 'PARSE_CATEGORY' ELSE a.category2 END ) AS category2, COUNT( desc ) AS count FROM transactions a WHERE desc = ? AND category != '' GROUP BY category ORDER BY count DESC LIMIT 1;",
values: [ this.getOwner().$.account.getValue(), t.value ]
}), {
onSuccess: enyo.bind(this, this.dataHandler, t.value)
}), !0;
},
dataHandler: function(e, t) {
var n = {
data: !1
};
if (t.length > 0) var n = {
data: !0,
desc: e,
linkedAccount: t[0].linkedAccount,
category: Checkbook.globals.transactionManager.parseCategoryDB(GTS.String.dirtyString(t[0].category), GTS.String.dirtyString(t[0].category2))
};
this.doValueChanged(n);
}
});

// manager.js

enyo.kind({
name: "Checkbook.transactions.recurrence.manager",
kind: "enyo.Component",
events: {
onRequestInsertTransactionSQL: ""
},
compare: function(e, t) {
if (GTS.Object.isUndefined(e) && !GTS.Object.isUndefined(t) || !GTS.Object.isUndefined(e) && GTS.Object.isUndefined(t)) return !1;
var n = !0;
n = n && e.frequency === t.frequency, n = n && e.itemSpan === t.itemSpan, n = n && enyo.json.stringify(e.daysOfWeek) === enyo.json.stringify(t.daysOfWeek), n = n && e.endingCondition === t.endingCondition;
if (n && (e["endingCondition"] == "date" || t["endingCondition"] == "date")) {
var r = GTS.Object.isDate(e.endDate) ? e.endDate : new Date(e.endDate), i = GTS.Object.isDate(t.endDate) ? t.endDate : new Date(t.endDate);
n = n && r === i;
}
return n && (e["endingCondition"] == "occurences" || t["endingCondition"] == "occurences") && (n = n && e.endCount === t.endCount), n;
},
fetch: function(e, t) {
if (isNaN(e) || e < 0) {
enyo.isFunction(t.onSuccess) && t.onSuccess({});
return;
}
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("repeats", "*", {
repeatId: e
}), {
onSuccess: function(e) {
enyo.isFunction(t.onSuccess) && t.onSuccess(e[0]);
},
onError: t.onError
});
},
handleRecurrenceSystem: function(e, t, n) {
var r = [];
if (e["rObj"] != 0) if ((isNaN(e.repeatId) || e.repeatId < 0) && e["rObj"]["frequency"] != "none") {
e.repeatId = e.maxRepeatId;
if (e["rObj"]["frequency"] == "weekly" && e["rObj"]["daysOfWeek"].length == 0) return [];
var i = {
repeatId: e.repeatId,
frequency: e.rObj.frequency,
itemSpan: e.rObj.itemSpan,
daysOfWeek: enyo.json.stringify(e["rObj"]["frequency"] == "weekly" ? e.rObj.daysOfWeek : ""),
endingCondition: e.rObj.endingCondition,
endDate: e["rObj"]["endingCondition"] == "date" ? e.rObj.endDate : "",
endCount: e["rObj"]["endingCondition"] == "occurences" ? e.rObj.endCount : "",
lastOccurrence: e.date,
currCount: 1,
origDate: e.rObj.origDate,
rep_desc: e.desc,
rep_amount: e.amount,
rep_note: e.note,
rep_category: enyo.json.stringify(e.category),
rep_acctId: e.account,
rep_linkedAcctId: e.linkedAccount,
rep_autoTrsnLink: t > 0 && n >= 0 ? t : 0,
rep_autoTrsnLinkAcct: t > 0 && n >= 0 ? n : "",
last_sync: "",
maxItemId: GTS.Object.validNumber(e.linkedAccount) && e.linkedAccount >= 0 ? e.itemId + 2 : e.itemId + 1
};
r = r.concat(this.generateSeriesSQL([ enyo.clone(i) ])), delete i.maxItemId, r.unshift(Checkbook.globals.gts_db.getInsert("repeats", i));
} else if (!(isNaN(e.repeatId) || e.repeatId < 0) && e["repeatUnlinked"] != 1 && e["terminated"] != 1) if (e["rObj"]["frequency"] == "none") r.push(this._getDeleteFutureSQL(e.itemId, e.repeatId, !0)); else {
var s = {
repeatId: e.repeatId,
frequency: e.rObj.frequency,
itemSpan: e.rObj.itemSpan,
daysOfWeek: enyo.json.stringify(e["rObj"]["frequency"] == "weekly" ? e.rObj.daysOfWeek : ""),
endingCondition: e.rObj.endingCondition,
endDate: e["rObj"]["endingCondition"] == "date" ? e.rObj.endDate : "",
endCount: e["rObj"]["endingCondition"] == "occurences" ? e.rObj.endCount : "",
lastOccurrence: e.date,
currCount: e.rObj.currCount,
origDate: e.rObj.origDate,
rep_desc: e.desc,
rep_amount: e.amount,
rep_note: e.note,
rep_category: enyo.json.stringify(e.category),
rep_acctId: e.account,
rep_linkedAcctId: e.linkedAccount,
rep_autoTrsnLink: t > 0 && n >= 0 ? t : 0,
rep_autoTrsnLinkAcct: t > 0 && n >= 0 ? n : "",
last_sync: "",
terminated: 0,
maxItemId: GTS.Object.validNumber(e.linkedAccount) && e.linkedAccount >= 0 ? e.maxItemId + 1 : e.maxItemId
};
r = r.concat(this._getDeleteFutureSQL(e.itemId, s.repeatId, !0)), r = r.concat(this.generateSeriesSQL([ enyo.clone(s) ])), delete s.maxItemId, delete s.lastOccurrence, delete s.currCount, r.push(Checkbook.globals.gts_db.getUpdate("repeats", s, {
repeatId: s.repeatId
}));
}
return delete e.rObj, delete e.maxItemId, delete e.maxRepeatId, r;
},
updateSeriesTransactions: function(e, t) {
var n = new Date, r = new Date(n.getFullYear(), n.getMonth(), n.getDate() + Checkbook.globals.prefs.seriesDayLimit, 23, 59, 59, 999);
e = e || -1, Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "SELECT ( SELECT IFNULL( MAX( itemId ), 0 ) FROM transactions LIMIT 1 ) AS maxItemId, * FROM repeats WHERE ( rep_acctId = ? " + (e < 0 ? "OR 1 = 1 " : "") + ") " + "AND lastOccurrence < ? " + "AND ( SELECT count( * ) FROM transactions WHERE transactions.repeatId = repeats.repeatId AND transactions.date > ? ) < ? " + "AND ( " + "( " + "endingCondition = 'none' " + ") OR ( " + "endingCondition = 'date' " + "AND endDate != '' " + "AND endDate > lastOccurrence " + ") OR ( " + "endingCondition = 'occurences' " + "AND endCount != '' " + "AND endCount > currCount " + ") " + ") " + "AND terminated != 1",
values: [ e, Date.parse(r), Date.parse(n), Checkbook.globals.prefs.seriesCountLimit ]
}), {
onSuccess: enyo.bind(this, this._updateSeriesTransactionsHandler, t),
onError: t.onError
});
},
_updateSeriesTransactionsHandler: function(e, t) {
t.length > 0 ? (repeatArray[0].maxItemId = parseInt(repeatArray[0].maxItemId) + 1, Checkbook.globals.gts_db.queries(this.generateSeriesSQL(t), e)) : enyo.isFunction(e.onSuccess) && e.onSuccess();
},
generateSeriesSQL: function(e) {
var t = [];
if (e.length > 0) {
var n = e[0].maxItemId, r = new Date, i, s, o, u, a, f;
for (var l = 0; l < e.length; l++) {
s = new Date(parseInt(e[l].origDate)), o = new Date(parseInt(e[l].lastOccurrence)), u = new Date(parseInt(e[l].lastOccurrence)), a = e[l].currCount;
var c = enyo.json.parse(e[l].rep_category), h = enyo.json.parse(e[l].daysOfWeek);
while (Math.floor((u - o) / 864e5) < Checkbook.globals.prefs.seriesDayLimit && a - e[l].currCount < Checkbook.globals.prefs.seriesCountLimit && (e[l]["endingCondition"] == "none" || e[l]["endingCondition"] == "date" && e[l].endDate && Date.parse(u) <= e[l].endDate || e[l]["endingCondition"] == "occurences" && e[l].endCount && a <= e[l].endCount)) {
if (e[l]["frequency"] == "daily") u.setDate(u.getDate() + 1 * e[l].itemSpan); else if (e[l]["frequency"] == "weekly") {
var p = h.indexOf(u.getDay());
if (p < 0 || p + 1 >= h.length) {
while (u.getDay() > 0) u.setDate(u.getDate() + 1);
while (u.getDay() < 7 && u.getDay() != h[0]) u.setDate(u.getDate() + 1);
u.setDate(u.getDate() + 7 * (e[l].itemSpan - 1));
} else u.setDate(u.getDate() + (h[p + 1] - h[p]));
} else if (e[l]["frequency"] == "monthly") {
var d = Math.max(u.getDate(), s.getDate());
u.setDate(1), u.setMonth(u.getMonth() + 1 * e[l].itemSpan), u.setDate(Math.min(d, u.daysInMonth()));
} else e[l]["frequency"] == "yearly" && u.setYear(u.getFullYear() + 1 * e[l].itemSpan);
i = {
itemId: n,
account: e[l].rep_acctId,
repeatId: e[l].repeatId,
desc: e[l].rep_desc,
note: e[l].rep_note,
date: u,
amount: e[l].rep_amount,
amount_old: "NOT_A_VALUE",
linkedRecord: -1,
linkedAccount: e[l].rep_linkedAcctId,
cleared: !1,
checkNum: "",
category: c,
category2: "",
rObj: !1,
autoTransfer: e[l].rep_autoTrsnLink,
autoTransferLink: e[l].rep_autoTrsnLink > 0 ? e[l].rep_autoTrsnLinkAcct : -1
}, GTS.Object.validNumber(e[l].rep_linkedAcctId) && e[l].rep_linkedAcctId >= 0 ? f = "transfer" : e[l].rep_amount < 0 ? f = "expense" : f = "income", t = t.concat(Checkbook.globals.transactionManager.generateInsertTransactionSQL({
data: i,
type: f
})), a++, n += GTS.Object.validNumber(i.linkedAccount) && i.linkedAccount >= 0 ? 2 : 1;
}
t.push(Checkbook.globals.gts_db.getUpdate("repeats", {
lastOccurrence: Date.parse(u),
currCount: a,
lastUpdated: Date.parse(new Date)
}, {
repeatId: e[l].repeatId
}));
}
t.length > 0 && Checkbook.globals.accountManager.updateAccountModTime();
}
return t;
},
setTermination: function(e, t, n) {
Checkbook.globals.gts_db.queries(Checkbook.globals.gts_db.getUpdate("repeats", {
terminated: t ? 1 : 0
}, {
repeatId: e
}), n);
},
deleteOne: function(e, t, n) {
Checkbook.globals.gts_db.queries([ Checkbook.globals.gts_db.getDelete("transactions", {
itemId: e
}), Checkbook.globals.gts_db.getDelete("transactions", {
linkedRecord: e
}), new GTS.databaseQuery({
sql: "DELETE FROM transactionSplit WHERE transId = ? OR transId = ( SELECT itemId FROM transactions WHERE linkedRecord = ? )",
values: [ e, e ]
}), new GTS.databaseQuery({
sql: "UPDATE repeats SET currCount = MAX( IFNULL( ( SELECT ( sub.currCount - 1 ) FROM repeats sub WHERE sub.repeatId = repeats.repeatId ), 0 ), 0 ) WHERE repeatId = ?",
values: [ t ]
}) ], n);
},
deleteFuture: function(e, t, n) {
Checkbook.globals.gts_db.queries(this._getDeleteFutureSQL(e, t), n);
},
deleteOnlyFuture: function(e, t, n) {
Checkbook.globals.gts_db.queries(this._getDeleteFutureSQL(e, t, !0), n);
},
_getDeleteFutureSQL: function(e, t, n) {
var r;
return n ? r = [ t, e ] : r = [ t, e, e ], [ new GTS.databaseQuery({
sql: "UPDATE repeats SET terminated = 1, currCount = MAX( ( ( SELECT sub.currCount FROM repeats sub WHERE sub.repeatId = repeats.repeatId ) - ( SELECT count( * ) FROM transactions WHERE transactions.repeatId = repeats.repeatId AND transactions.date " + (n ? ">" : ">=") + " ( SELECT trsn.date FROM transactions trsn WHERE trsn.itemId = ? ) ) ), 0 ) WHERE repeatId = ?",
values: [ e, t ]
}), new GTS.databaseQuery({
sql: "DELETE FROM transactions WHERE repeatId = ? AND ( " + (n ? "" : "itemId = ? OR ") + "itemId IN ( SELECT sub.itemId FROM transactions sub WHERE sub.repeatId = transactions.repeatId AND sub.date " + (n ? ">" : ">=") + " ( SELECT sub2.date FROM transactions sub2 WHERE sub2.itemId = ? ) ) )",
values: r
}) ];
},
deleteAll: function(e, t) {
Checkbook.globals.gts_db.queries([ Checkbook.globals.gts_db.getDelete("transactions", {
repeatId: e
}), Checkbook.globals.gts_db.getDelete("repeats", {
repeatId: e
}) ], t);
}
});

// confirm.js

enyo.kind({
name: "Checkbook.transactions.recurrence.confirm",
kind: "onyx.Popup",
classes: "gts-confirm-dialog",
centered: !0,
floating: !0,
modal: !0,
autoDismiss: !1,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
style: "max-width: 325px;",
events: {
onOne: "",
onFuture: "",
onAll: "",
onCancel: ""
},
components: [ {
name: "title",
classes: "title-wrapper",
content: " Recurring Transaction"
}, {
name: "message",
classes: "message-wrapper",
content: "Would you like to change only this transaction, all transactions in the series, or this and all following transactions in the series?"
}, {
classes: "block-buttons text-center",
components: [ {
kind: "onyx.Button",
content: "Only this instance",
ontap: "doOne"
}, {
kind: "onyx.Button",
content: "This and all following",
ontap: "doFuture"
}, {
kind: "onyx.Button",
content: "All transactions in the series",
ontap: "doAll"
}, {
kind: "onyx.Button",
content: "Cancel",
ontap: "doCancel"
} ]
} ]
});

// delete.js

enyo.kind({
name: "Checkbook.transactions.recurrence.delete",
kind: "onyx.Popup",
classes: "gts-confirm-dialog",
centered: !0,
floating: !0,
modal: !0,
autoDismiss: !1,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
style: "max-width: 325px;",
published: {
transactionId: -1,
recurrenceId: -1
},
events: {
onDeleteOne: "",
onDeleteFuture: "",
onDeleteAll: "",
onFinish: "",
onCancel: ""
},
components: [ {
name: "title",
classes: "title-wrapper",
content: "Delete Recurring Transaction"
}, {
name: "message",
classes: "message-wrapper",
content: "Would you like to delete only this transaction, this and all following transactions in the series, or all transactions in the series?"
}, {
classes: "block-buttons text-center",
components: [ {
kind: "onyx.Button",
content: "Only this instance",
classes: "onyx-negative",
ontap: "deleteOne"
}, {
kind: "onyx.Button",
content: "This and all following",
classes: "onyx-negative",
ontap: "deleteFuture"
}, {
kind: "onyx.Button",
content: "All transactions in the series",
classes: "onyx-negative",
ontap: "deleteAll"
}, {
kind: "onyx.Button",
content: "Cancel",
ontap: "doCancel"
} ]
} ],
deleteOne: function() {
Checkbook.globals.transactionManager.$.recurrence.deleteOne(this.transactionId, this.recurrenceId, {
onSuccess: enyo.bind(this, this.deleteCompleted, "one")
});
},
deleteFuture: function() {
Checkbook.globals.transactionManager.$.recurrence.deleteFuture(this.transactionId, this.recurrenceId, {
onSuccess: enyo.bind(this, this.deleteCompleted, "future")
});
},
deleteAll: function() {
Checkbook.globals.transactionManager.$.recurrence.deleteAll(this.recurrenceId, {
onSuccess: enyo.bind(this, this.deleteCompleted, "all")
});
},
deleteCompleted: function(e) {
switch (e) {
case "all":
this.doDeleteAll();
break;
case "future":
this.doDeleteFuture();
break;
case "one":
this.doDeleteOne();
}
this.doFinish();
}
});

// select.js

enyo.kind({
name: "Checkbook.transactions.recurrence.select",
recurrenceOptions: [],
systemActive: !1,
published: {
date: ""
},
events: {
onRecurrenceChange: ""
},
components: [ {
name: "recurrenceNode",
kind: "GTS.SelectorBar",
label: "Recurrence",
onChange: "recurrenceNodeChanged",
classes: "force-left-padding",
value: 0
}, {
name: "weeklyOptions",
classes: "h-box bo",
showing: !1,
components: []
}, {
name: "durationWrapper",
showing: !1,
components: [ {
kind: "onyx.Item",
classes: "text-center bordered h-box box-pack-center box-align-center",
components: [ {
content: "Every"
}, {
kind: "onyx.PickerDecorator",
components: [ {
classes: "margin-half-left margin-half-right"
}, {
name: "itemSpan",
kind: "GTS.IntegerPicker",
min: 1,
max: 64,
style: "margin-right: 3px;",
onChange: "sendSummary"
} ]
}, {
name: "itemSpanUnits"
}, {
content: "Frequency",
classes: "label box-flex-1 text-right"
} ]
}, {
name: "endingCondition",
kind: "GTS.SelectorBar",
label: "Ending Condition",
classes: "bordered",
onChange: "endingConditionChanged",
choices: [ {
content: "Forever",
value: "f",
active: !0
}, {
content: "Until Date",
value: "d"
}, {
content: "Occurrences",
value: "o"
} ],
value: "f"
}, {
name: "endingDateWrapper",
kind: "onyx.Item",
classes: "bordered",
showing: !1,
components: []
}, {
name: "endingCountWrapper",
kind: "onyx.Item",
classes: "text-center bordered h-box box-pack-center box-align-center",
showing: !1,
components: [ {
kind: "onyx.PickerDecorator",
components: [ {
classes: "margin-half-left margin-half-right"
}, {
name: "endingCount",
kind: "GTS.IntegerPicker",
min: 1,
max: 100,
onChange: "sendSummary"
} ]
}, {
content: "Occurrences",
classes: "label box-flex-1 text-right"
} ]
} ]
} ],
create: function() {
this.inherited(arguments), this.date == "" && (this.date = new Date), this.buildRecurrenceOptions(), this.buildDateSystem(), this.buildDayOfWeekSystem(), this.recurrenceNodeChanged(), this.systemActive = !0;
},
getValue: function() {
var e = {};
if (this.$["recurrenceNode"].getValue() == 0) e.frequency = "none"; else {
e.origDate = Date.parse(this.date), e.itemSpan = this.$.itemSpan.getValue();
switch (this.$.recurrenceNode.getValue()) {
case 1:
e.frequency = "daily";
break;
case 2:
e.frequency = "weekly", e.daysOfWeek = [];
for (i = 0; i < 7; i++) this.$["weekly" + i].getChecked() && e.daysOfWeek.push(i);
break;
case 3:
e.frequency = "monthly";
break;
case 4:
default:
e.frequency = "yearly";
}
switch (this.$.endingCondition.getValue()) {
case "d":
e.endingCondition = "date", e.endDate = Date.parse(this.$.endingDate.getValue());
break;
case "o":
e.endingCondition = "occurences", e.endCount = this.$.endingCount.getValue();
break;
case "f":
default:
e.endingCondition = "none";
}
}
return e;
},
setValue: function(e) {
if (e == null || typeof e == "undefined") this.$.recurrenceNode.setValue(0); else {
this.date = e.origDate, this.$.itemSpan.setValue(e.itemSpan);
for (i = 0; i < 7; i++) this.$["weekly" + i].setChecked(!1);
switch (e.frequency) {
case "daily":
this.$.recurrenceNode.setValue(1);
break;
case "weekly":
this.$.recurrenceNode.setValue(2), e.daysOfWeek = enyo.json.parse(e.daysOfWeek);
for (i = 0; i < e.daysOfWeek.length; i++) this.$["weekly" + e.daysOfWeek[i]].setChecked(!0);
break;
case "monthly":
this.$.recurrenceNode.setValue(3);
break;
case "yearly":
this.$.recurrenceNode.setValue(4);
break;
default:
this.$.recurrenceNode.setValue(0);
}
switch (e.endingCondition) {
case "date":
this.$.endingCondition.setValue("d"), this.$.endingDate.setValue(e.endDate);
break;
case "occurences":
this.$.endingCondition.setValue("o"), this.$.endingCount.setValue(e.endCount);
break;
case "none":
default:
this.$.endingCondition.setValue("f");
}
}
this.buildRecurrenceOptions(), this.recurrenceNodeChanged();
},
sendSummary: function() {
var e = "";
if (this.$["recurrenceNode"].getValue() == 0) e = "No Recurrence"; else {
e = "Repeats every " + this.$.itemSpan.getValue() + " ";
switch (this.$.recurrenceNode.getValue()) {
case 1:
e += "day(s)";
break;
case 2:
var t = [], n = [];
for (i = 0; i < 7; i++) this.$["weekly" + i].getChecked() ? (t.push(this.$["weekly" + i].dayName), n[i] = this.$["weekly" + i].dayName) : n[i] = "";
n[1] != "" && n[2] != "" && n[3] != "" && n[4] != "" && n[5] != "" && (t.splice(t.indexOf(n[1]), 1), t.splice(t.indexOf(n[2]), 1), t.splice(t.indexOf(n[3]), 1), t.splice(t.indexOf(n[4]), 1), t.splice(t.indexOf(n[5]), 1), t.push("Weekdays")), n[0] != "" && n[6] != "" && (t.splice(t.indexOf(n[0]), 1), t.splice(t.indexOf(n[6]), 1), t.push("Weekends"));
var r = t.join(", ");
t.length > 1 && (r = r.substr(0, r.lastIndexOf(", ")) + (t.length > 2 ? "," : "") + " and " + r.substr(r.lastIndexOf(", ") + 2)), e += "week(s) on " + r;
break;
case 3:
e += "month(s) on the " + this.dateSuffix(this.date.getDate());
break;
case 4:
e += "year(s) on " + this.date.format({
format: "MMMM"
}) + " " + this.dateSuffix(this.date.getDate());
break;
default:
e += "span(s)";
}
}
this.systemActive && this.doRecurrenceChange({
summary: e,
value: this.getValue()
});
},
buildRecurrenceOptions: function() {
this.recurrenceOptions = [ {
content: "No Recurrence",
value: 0
}, {
content: "Daily",
value: 1
}, {
content: "Weekly",
value: 2
}, {
content: "Monthly on the " + this.dateSuffix(this.date.getDate()),
value: 3
}, {
content: "Yearly on " + this.date.format({
format: "MMMM"
}) + " " + this.dateSuffix(this.date.getDate()),
value: 4
} ];
var e = this.$.recurrenceNode.getValue();
this.$.recurrenceNode.setChoices(this.recurrenceOptions), this.$.recurrenceNode.render(), this.$.recurrenceNode.setValue(e);
},
buildDateSystem: function() {
!enyo.Panels.isScreenNarrow() || Checkbook.globals.prefs.alwaysFullCalendar ? this.$.endingDateWrapper.createComponent({
name: "endingDate",
kind: "GTS.DatePicker",
onSelect: "sendSummary",
components: [ {
name: "endingTime",
kind: "GTS.TimePicker",
label: "Time",
minuteInterval: 5,
is24HrMode: !1,
onSelect: "sendSummary"
} ]
}, {
owner: this
}) : this.$.endingDateWrapper.createComponents([ {
classes: "onyx-toolbar-inline",
components: [ {
name: "label",
classes: "label",
content: "Date"
}, {
name: "endingDate",
kind: "onyx.DatePicker",
onSelect: "sendSummary"
} ]
}, {
name: "endingTime",
kind: "GTS.TimePicker",
label: "Time",
minuteInterval: 5,
is24HrMode: !1,
onSelect: "sendSummary"
} ], {
owner: this
});
},
buildDayOfWeekSystem: function() {
var e = new Date(2011, 4, 1), t = [];
for (i = 0; i < 7; i++) t.push({
classes: "text-center box-flex-1",
components: [ {
content: e.format({
format: "EEE"
}),
classes: "label"
}, {
name: "weekly" + i,
kind: "onyx.Checkbox",
onchange: "sendSummary",
checked: this.date.getDay() == i,
dayName: e.format({
format: "EEEE"
})
} ]
}), e.setDate(e.getDate() + 1);
this.$.weeklyOptions.createComponents(t, {
owner: this
}), this.$.weeklyOptions.render();
},
recurrenceNodeChanged: function() {
this.$.recurrenceNode.addRemoveClass("enyo-single", this.$["recurrenceNode"].getValue() == 0), this.$.durationWrapper.setShowing(this.$["recurrenceNode"].getValue() != 0), this.$.weeklyOptions.setShowing(this.$["recurrenceNode"].getValue() == 2);
switch (this.$.recurrenceNode.getValue()) {
case 1:
this.$.itemSpanUnits.setContent("day(s)");
break;
case 2:
this.$.itemSpanUnits.setContent("week(s)");
break;
case 3:
this.$.itemSpanUnits.setContent("month(s)");
break;
case 4:
this.$.itemSpanUnits.setContent("year(s)");
break;
default:
this.$.itemSpanUnits.setContent("span(s)");
}
return this.sendSummary(), !0;
},
dateChanged: function() {
this.buildRecurrenceOptions();
if (this.$["recurrenceNode"].getValue() != 2) for (i = 0; i < 7; i++) this.$["weekly" + i].setChecked(this.date.getDay() == i);
this.buildRecurrenceOptions(), this.sendSummary();
},
endingConditionChanged: function() {
return this.$.endingDateWrapper.setShowing(this.$["endingCondition"].getValue() == "d"), this.$.endingCountWrapper.setShowing(this.$["endingCondition"].getValue() == "o"), this.$.endingDateWrapper.getShowing() && (this.$.endingDate.render(), this.$.endingTime.render()), this.sendSummary(), !0;
},
dateSuffix: function(e) {
return e + [ "th", "st", "nd", "rd" ][e % 10 > 3 ? 0 : (e % 100 - e % 10 != 10) * e % 10];
}
});

// manager.js

enyo.kind({
name: "Checkbook.transactionCategory.manager",
kind: enyo.Component,
trsnCategories: null,
constructor: function() {
this.inherited(arguments);
if (!Checkbook.globals.gts_db) {
this.log("creating database object.");
var e = new GTS.database(getDBArgs());
}
},
fetchCategories: function(e, t, n) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getSelect("transactionCategories", [ "*" ], null, [ "genCat COLLATE NOCASE", "specCat COLLATE NOCASE" ], t, n), e);
},
load: function(e, t, n, r) {
if (!r || !n || !e) {
if (this.trsnCategories) {
this.log("transaction categories already built"), callbackFn();
return;
}
r = 0, n = 100, e = null, this.trsnCategories = {
mainCats: [],
subCats: {}
};
}
this.fetchCategories({
onSuccess: enyo.bind(this, this._loadHandler, e, t, n, r),
onError: t.onError
}, n, r);
},
_loadHandler: function(e, t, n, r, i) {
for (var s = 0; s < i.length; s++) {
var o = i[s];
if (!e || e !== o.genCat) o.genCat !== "" && this.trsnCategories.mainCats.push({
id: o.catId,
content: o.genCat,
parent: ""
}), e = o.genCat, this.trsnCategories.subCats[e] = [];
this.trsnCategories.subCats[e].push({
id: o.catId,
content: o.specCat,
parent: e
});
}
i.length < n ? enyo.isFunction(t.onSuccess) && t.onSuccess() : this.load(e, t, r + n, n);
},
createCategory: function(e, t, n) {
this.categoriesChanged();
var r = new GTS.databaseQuery({
sql: "INSERT INTO transactionCategories( genCat, specCat ) VALUES( ?, ? );",
values: [ e, t ]
});
Checkbook.globals.gts_db.query(r, n);
},
editCategory: function(e, t, n, r, i, s) {
this.categoriesChanged();
var o = [ new GTS.databaseQuery({
sql: "UPDATE transactionCategories SET genCat = ?, specCat = ? WHERE catId = ?;",
values: [ t, n, e ]
}), new GTS.databaseQuery({
sql: "UPDATE transactions SET category = ?, category2 = ? WHERE category = ? AND category2 = ?;",
values: [ t, n, r, i ]
}), new GTS.databaseQuery({
sql: "UPDATE transactionSplit SET genCat = ?, specCat = ? WHERE genCat = ? AND specCat = ?;",
values: [ t, n, r, i ]
}) ];
Checkbook.globals.gts_db.queries(o, s);
},
editGroup: function(e, t, n) {
this.categoriesChanged();
var r = [ new GTS.databaseQuery({
sql: "UPDATE transactionCategories SET genCat = ? WHERE genCat = ?;",
values: [ e, t ]
}), new GTS.databaseQuery({
sql: "UPDATE transactions SET category = ? WHERE category = ?;",
values: [ e, t ]
}), new GTS.databaseQuery({
sql: "UPDATE transactionSplit SET genCat = ? WHERE genCat = ?;",
values: [ e, t ]
}) ];
Checkbook.globals.gts_db.queries(r, n);
},
deleteCategory: function(e, t) {
this.categoriesChanged();
var n = new GTS.databaseQuery({
sql: "DELETE FROM transactionCategories WHERE catId = ?;",
values: [ e ]
});
Checkbook.globals.gts_db.query(n, t);
},
categoriesChanged: function() {
this.trsnCategories && (this.log("wiping transaction categories"), this.trsnCategories = null);
}
});

// select.js

enyo.kind({
name: "Checkbook.transactionCategory.select",
kind: "onyx.Popup",
classes: "small-popup",
centered: !0,
floating: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1,
style: "max-height: 95%;",
categories: {},
dispCategories: [],
selected: {},
doCategorySelect: null,
published: {
entireGeneral: !1
},
components: [ {
kind: "enyo.FittableColumns",
classes: "text-middle margin-bottom",
noStretch: !0,
components: [ {
classes: "bigger text-left ",
fit: !0,
components: [ {
content: "Select a Category",
classes: "bigger"
}, {
name: "subheader",
classes: "smaller"
} ]
}, {
kind: "onyx.Button",
content: "X",
ontap: "hide",
classes: "onyx-blue small-padding"
} ]
}, {
name: "scroller",
kind: "enyo.Scroller",
horizontal: "hidden",
classes: "light popup-scroller",
components: []
} ],
handlers: {
onShow: "_show"
},
_show: function() {
var e = this.$.scroller.getBounds();
this.$.scroller.applyStyle("height", e.height + "px");
},
loadCategories: function(e) {
Checkbook.globals.transactionCategoryManager.trsnCategories ? (this.log("transaction categories already built"), e()) : Checkbook.globals.transactionCategoryManager.load(null, {
onSuccess: e
}, null, null);
},
getCategoryChoice: function(e, t) {
this.dispCategories = enyo.clone(Checkbook.globals.transactionCategoryManager.trsnCategories.mainCats), this._generateTree(), this.show(), this.doCategorySelect = e, t ? (this.selected = t, this.$.subheader.setContent(t.category + " >> " + t.category2)) : (this.selected = {
category: "",
category2: ""
}, this.$.subheader.setContent("")), this.reflow();
},
_generateTree: function() {
this.log(), this.$.scroller.destroyClientControls();
var e = [], t = Checkbook.globals.transactionCategoryManager.trsnCategories.mainCats;
for (var n = 0; n < t.length; n++) {
var r = {
kind: "enyo.Node",
expandable: !0,
expanded: !1,
style: "padding: 0.5em;",
classes: "padding-std bordered",
icon: "assets/folder.png",
content: t[n].content,
onExpand: "nodeExpand",
onNodeTap: "nodeTap",
components: []
}, i = Checkbook.globals.transactionCategoryManager.trsnCategories.subCats[t[n].content];
for (var s = 0; s < i.length; s++) r.components.push({
style: "padding: 0.25em;",
classes: "padding-half-std margin-left margin-right bordered",
icon: "assets/tag.png",
content: i[s].content,
parentNode: i[s].parent
});
e.push(r);
}
this.$.scroller.createComponents(e, {
owner: this
}), this.$.scroller.render();
},
nodeExpand: function(e, t) {
e.setIcon("assets/" + (e.expanded ? "folder-open.png" : "folder.png"));
},
nodeTap: function(e, t) {
return t.originator.parentNode && (enyo.isFunction(this.doCategorySelect) && this.doCategorySelect({
category: t.originator.parentNode,
category2: t.originator.content === "All Sub Categories" ? "%" : t.originator.content
}), this.hide()), !0;
},
returnedFromView: function() {
this.$.transactionCategoryView.hide(), this.$.transactionCategoryView.destroy(), this.datasetChanged();
}
});

// view.js

enyo.kind({
name: "Checkbook.transactionCategory.view",
kind: "FittableRows",
classes: "enyo-fit",
style: "height: 100%;",
events: {
onFinish: ""
},
components: [ {
name: "header",
kind: "onyx.Toolbar",
classes: "text-center text-middle",
style: "position: relative;",
components: [ {
components: [ {
content: "Transaction Categories",
className: "bigger"
}, {
name: "subheader",
className: "smaller"
} ]
}, {
kind: "onyx.Button",
ontap: "doFinish",
content: "x",
classes: "onyx-negative",
style: "position: absolute; right: 15px;"
} ]
}, {
kind: "enyo.Scroller",
horizontal: "hidden",
classes: "deep-green-gradient",
fit: !0,
components: [ {
name: "mainCategories",
kind: "enyo.Repeater",
classes: "enyo-fit light narrow-column padding-half-top padding-half-bottom",
style: "min-height: 100%; position: relative;",
onSetupItem: "setupMainRow",
components: [ {
name: "item",
kind: "onyx.Item",
tapHighlight: !0,
classes: "text-middle",
style: "padding-top: 0; padding-bottom: 0;",
components: [ {
name: "content",
classes: "bold bordered padding-std",
ontap: "editMainCategory"
}, {
name: "subCats",
kind: "enyo.Repeater",
classes: "margin-double-left margin-right",
count: 0,
parentContent: "",
onSetupItem: "setupSubRow",
components: [ {
name: "item",
kind: "onyx.Item",
tapHighlight: !0,
classes: "bordered text-middle",
ontap: "editChildCategory",
onDelete: "deleteItem",
components: [ {
name: "parent",
showing: !1
}, {
name: "subContent"
} ]
} ]
} ]
} ]
} ]
}, {
kind: "onyx.Toolbar",
classes: "text-center",
components: [ {
kind: "onyx.Button",
content: "Create New",
ontap: "createNew"
} ]
}, {
name: "modifyCat",
kind: "Checkbook.transactionCategory.modify",
onChangeComplete: "modificationComplete"
} ],
rendered: function() {
this.inherited(arguments), this.$.header.addRemoveClass("text-left", enyo.Panels.isScreenNarrow()), this.$.header.addRemoveClass("text-center", !enyo.Panels.isScreenNarrow()), this.fetchCategories();
},
fetchCategories: function() {
Checkbook.globals.transactionCategoryManager.trsnCategories ? this.dataResponse() : Checkbook.globals.transactionCategoryManager.load(null, {
onSuccess: enyo.bind(this, this.dataResponse)
}, null, null);
},
dataResponse: function() {
this.$.mainCategories.setCount(Checkbook.globals.transactionCategoryManager.trsnCategories.mainCats.length);
},
setupMainRow: function(e, t) {
var n = t.index, r = t.item, i = Checkbook.globals.transactionCategoryManager.trsnCategories.mainCats[n];
if (i && r && r.$.content && n >= 0) return r.$.content.setContent(i.content), r.$.subCats.parentContent = i.content, r.$.subCats.setCount(Checkbook.globals.transactionCategoryManager.trsnCategories.subCats[i.content].length), !0;
},
setupSubRow: function(e, t) {
var n = t.item;
if (!n || !n.$.subContent) return;
var r = n.index, i = Checkbook.globals.transactionCategoryManager.trsnCategories.subCats[e.parentContent][r];
if (i && r >= 0) return n.$.subContent.setContent(i.content), n.$.parent.setContent(i.parent), !0;
},
createNew: function(e, t) {
return this.$.modifyCat.show(-1), !0;
},
editMainCategory: function(e, t) {
var n = Checkbook.globals.transactionCategoryManager.trsnCategories.mainCats[t.index];
if (n) return this.$.modifyCat.show(-1, n.content, null), !0;
},
editChildCategory: function(e, t) {
var n = Checkbook.globals.transactionCategoryManager.trsnCategories.mainCats[t.index];
if (!n) return;
var r = Checkbook.globals.transactionCategoryManager.trsnCategories.subCats[n.content];
if (r[e.parent.index]) return r = r[e.parent.index], this.$.modifyCat.show(r.id, r.parent, r.content), !0;
},
deleteItem: function(e, t) {
this.log(arguments);
return !0;
var n;
},
modificationComplete: function(e, t) {
this.fetchCategories(), t["action"] != "reorder" && this.$.modifyCat.hide();
}
});

// modify.js

enyo.kind({
name: "Checkbook.transactionCategory.modify",
kind: "onyx.Popup",
classes: "login-system small-popup",
centered: !0,
floating: !0,
modal: !0,
scrim: !0,
scrimclasses: "onyx-scrim-translucent",
autoDismiss: !1,
events: {
onChangeComplete: ""
},
catId: -1,
general: "",
specific: "",
mode: "",
components: [ {
kind: "enyo.FittableColumns",
classes: "text-middle margin-bottom",
noStretch: !0,
components: [ {
name: "title",
content: "",
classes: "bigger text-left margin-half-right",
fit: !0
}, {
kind: "onyx.Button",
content: "X",
ontap: "hide",
classes: "onyx-blue small-padding"
} ]
}, {
kind: "onyx.Groupbox",
classes: "light",
components: [ {
name: "generalWrapper",
kind: "GTS.AutoComplete",
layoutKind: "FittableColumnsLayout",
alwaysLooksFocused: !0,
onValueSelected: "generalAutoSuggestComplete",
onDataRequested: "fetchData",
zIndex: 200,
components: [ {
name: "general",
kind: "onyx.Input",
placeholder: "group name",
fit: !0
}, {
content: "group",
classes: "small label"
} ]
}, {
name: "specificWrapper",
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
classes: "onyx-focused",
alwaysLooksFocused: !0,
components: [ {
name: "specific",
kind: "onyx.Input",
placeholder: "category name",
fit: !0,
onkeypress: "keyPressed"
}, {
content: "category",
classes: "small label"
} ]
} ]
}, {
name: "errorMessage",
kind: "GTS.InlineNotification",
type: "error",
content: "",
showing: !1
}, {
classes: "padding-std margin-half-top text-center h-box",
components: [ {
kind: "onyx.Button",
classes: "margin-right box-flex",
content: "Cancel",
ontap: "hide"
}, {
name: "deleteButton",
kind: "onyx.Button",
classes: "onyx-negative box-flex",
content: "Delete",
ontap: "deleteCategory"
}, {
kind: "onyx.Button",
classes: "onyx-affirmative margin-left box-flex",
content: "Save",
ontap: "save"
} ]
} ],
show: function(e, t, n) {
this.inherited(arguments), e < 0 ? this.$.deleteButton.hide() : this.$.deleteButton.show(), e < 0 && !enyo.isString(t) ? (this.$.title.setContent("Create a Category"), this.$.specificWrapper.show(), this.mode = "new", this.catId = -1, this.general = "", this.specific = "") : e < 0 && enyo.isString(t) ? (this.$.title.setContent("Edit Group Name"), this.$.specificWrapper.hide(), this.mode = "group", this.catId = -1, this.general = t, this.specific = "") : e > 0 && enyo.isString(t) && enyo.isString(n) ? (this.$.title.setContent("Edit Category"), this.$.specificWrapper.show(), this.mode = "category", this.catId = e, this.general = t, this.specific = n) : this.hide(), this.$.general.setValue(this.general), this.$.specific.setValue(this.specific), this.$.general.focus();
},
keyPressed: function(e, t) {
(t.keyCode === 124 || t.keyCode === 126) && t.preventDefault();
},
fetchData: function(e, t) {
if (t.value.length <= 0) {
t.callback([]);
return;
}
Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "SELECT DISTINCT genCat FROM transactionCategories WHERE genCat LIKE ? LIMIT ?;",
values: [ t.value + "%", e.getLimit() ]
}), {
onSuccess: enyo.bind(this, this.buildSuggestionList, t.callback)
});
},
buildSuggestionList: function(e, t) {
var n = [];
for (var r = 0; r < t.length; r++) n.push(t[r].genCat);
e(n);
},
generalAutoSuggestComplete: function(e, t) {
return this.$.general.setValue(t.value), !0;
},
deleteCategory: function() {
if (this.catId >= 0) {
this.createComponent({
name: "deleteCategoryConfirm",
kind: "gts.ConfirmDialog",
title: "Delete Category",
message: "Are you sure you want to delete this transaction category?",
confirmText: "Delete",
confirmClass: "onyx-negative",
cancelText: "Cancel",
cancelClass: "",
onConfirm: "deleteCategoryHandler",
onCancel: "deleteCategoryConfirmClose"
}), this.$.deleteCategoryConfirm.show();
var e = this.getComputedStyleValue("zIndex");
if (!e) {
var t = this.domCssText.split(";");
for (var n = 0; n < t.length; n++) if (t[n].match("z-index")) {
t = t[n].split(":"), e = t[1];
break;
}
}
this.$.deleteCategoryConfirm.applyStyle("z-index", e - 5 + 10);
}
},
deleteCategoryConfirmClose: function() {
this.$.deleteCategoryConfirm.destroy();
},
deleteCategoryHandler: function() {
this.deleteCategoryConfirmClose(), Checkbook.globals.transactionCategoryManager.deleteCategory(this.catId, {
onSuccess: enyo.bind(this, this.doChangeComplete, {
action: "delete"
})
});
},
save: function() {
var e = this.$.general.getValue().replace(/(~|\|)/g, ""), t = this.$.specific.getValue().replace(/(~|\|)/g, "");
if (e.length <= 0 || this.mode !== "group" && t.length <= 0) {
this.$.errorMessage.setContent("Category fields may not be blank."), this.$.errorMessage.show();
return;
}
if (t === "All Sub Categories") {
this.$.errorMessage.setContent("Invalid category."), this.$.errorMessage.show();
return;
}
this.$.errorMessage.hide(), this.general === e && this.specific === t && this.hide(), this.mode === "new" ? Checkbook.globals.transactionCategoryManager.createCategory(e, t, {
onSuccess: enyo.bind(this, this.doChangeComplete, {
action: "new"
})
}) : this.mode === "category" ? Checkbook.globals.transactionCategoryManager.editCategory(this.catId, e, t, this.general, this.specific, {
onSuccess: enyo.bind(this, this.doChangeComplete, {
action: "category"
})
}) : this.mode === "group" ? Checkbook.globals.transactionCategoryManager.editGroup(e, this.general, {
onSuccess: enyo.bind(this, this.doChangeComplete, {
action: "group"
})
}) : this.hide();
}
});

// search.js

enyo.kind({
name: "Checkbook.search.pane",
style: "height: 100%;",
published: {
acctId: null,
category: null,
category2: null,
dateStart: null,
dateEnd: null
},
events: {
onModify: "",
onFinish: ""
},
components: [ {
kind: enyo.PageHeader,
pack: "start",
components: [ {
showing: !0,
name: "systemIcon",
kind: enyo.Image,
src: "assets/search.png",
className: "img-icon",
style: "margin: 0 15px 0 0;"
}, {
showing: !1,
name: "loadingSpinner",
kind: "GTS.Spinner",
className: "img-icon",
style: "margin: 0px 15px 5px 0;"
}, {
content: "Search System",
className: "bigger",
flex: 1,
style: "margin-top: -6px;"
}, {
name: "resultCount",
className: "enyo-button enyo-button-dark",
showing: !1
} ]
}, {
kind: enyo.SlidingPane,
flex: 1,
components: [ {
name: "search",
kind: "Checkbook.search.filter",
flex: 1,
onSearch: "searchTransactions",
onFinish: "closeSearch"
}, {
name: "results",
kind: "Checkbook.search.results",
flex: 2,
onModify: "modifyTransaction",
onResultsFound: "resultCount",
onLoading: "loadingDisplay"
} ]
} ],
rendered: function() {
this.inherited(arguments), this.$.search.load(this.acctId, this.category, this.category2, this.dateStart, this.dateEnd);
},
searchTransactions: function(e, t, n) {
this.$.results.search(t, n);
},
resultCount: function(e, t) {
this.$.resultCount.show(), this.$.resultCount.setContent(t + " transactions");
},
loadingDisplay: function(e, t) {
this.$.loadingSpinner.setShowing(t), this.$.systemIcon.setShowing(!t);
},
modifyTransaction: function(e, t) {
this.doModify(t);
},
closeSearch: function() {
this.doFinish(this.$.results.getChangesMade());
}
});

// filter.js

enyo.kind({
name: "Checkbook.search.filter",
flex: 1,
acctList: {
count: 0,
items: []
},
events: {
onSearch: "",
onFinish: ""
},
components: [ {
kind: enyo.Scroller,
flex: 1,
components: [ {
kind: enyo.Item,
tapHightlight: !1,
components: [ {
name: "searchString",
kind: enyo.RichText,
hint: "Search",
oninput: "searchChanged",
autoKeyModifier: "shift-single",
flex: 1
} ]
}, {
name: "accountDrawer",
kind: enyo.DividerDrawer,
caption: "Accounts",
components: [ {
name: "accounts",
kind: enyo.VirtualRepeater,
onSetupRow: "setupRow",
components: [ {
kind: enyo.Item,
layoutKind: enyo.HFlexLayout,
tapHighlight: !0,
ontap: "accountSelectedChanged",
components: [ {
name: "icon",
kind: enyo.Image,
className: "accountIcon"
}, {
name: "iconLock",
kind: enyo.Image,
src: "assets/padlock_1.png",
className: "accountLockIcon unlocked"
}, {
flex: 1,
components: [ {
name: "accountName"
}, {
name: "accountNote",
className: "smaller"
} ]
}, {
name: "accountSelected",
kind: enyo.CheckBox,
style: "margin-right: 10px;"
} ]
} ]
} ]
}, {
name: "fromToggle",
kind: "GTS.ToggleBar",
mainText: "Limit Start Date",
subText: "Limit the earliest date that can appear in search query.",
onText: "Yes",
offText: "No",
onChange: "toggleToggles"
}, {
name: "fromDrawer",
kind: enyo.BasicDrawer,
style: "padding: 0px 25px 0px 5px;",
components: [ {
name: "fromDate",
kind: "GTS.DateTimePicker"
} ]
}, {
name: "toToggle",
kind: "GTS.ToggleBar",
mainText: "Limit End Date",
subText: "Limit the latest date that can appear in search query.",
onText: "Yes",
offText: "No",
onChange: "toggleToggles"
}, {
name: "toDrawer",
kind: enyo.BasicDrawer,
style: "padding: 0px 25px 0px 5px;",
components: [ {
name: "toDate",
kind: "GTS.DateTimePicker"
} ]
}, {
name: "cleared",
kind: "GTS.ListSelectorBar",
labelText: "Include Transaction Status",
className: "force-left-padding",
value: 2,
choices: [ {
caption: "All",
value: 2
}, {
caption: "Cleared Only",
value: 1
}, {
caption: "Pending Only",
value: 0
} ]
}, {
name: "includeNeg",
kind: "GTS.ToggleBar",
mainText: "Include Expenses",
onText: "Yes",
offText: "No",
value: !0
}, {
name: "includePos",
kind: "GTS.ToggleBar",
mainText: "Include Income",
onText: "Yes",
offText: "No",
value: !0
}, {
name: "includeTrans",
kind: "GTS.ToggleBar",
mainText: "Include Transfers",
onText: "Yes",
offText: "No",
value: !0
} ]
}, {
kind: "onyx.Button",
caption: "Search",
className: "enyo-button-dark",
ontap: "search"
}, {
kind: enyo.Toolbar,
className: "tardis-blue",
pack: "start",
components: [ {
content: "Back",
ontap: "doFinish"
} ]
} ],
load: function(e, t, n, r, i) {
this.$.accountDrawer.close(), Checkbook.globals.accountManager.fetchAccounts({
onSuccess: enyo.bind(this, this.renderAccountList, e, t, n, r, i)
});
},
renderAccountList: function(e, t, n, r, i, s) {
this.acctList.items = [], this.acctList.count = 0;
for (var o = 0; o < s.length; o++) this.acctList.items[o] = s[o], e ? this.acctList.items[o].acctId === e ? (this.acctList.items[o].selectStatus = !0, this.acctList.count++) : this.acctList.items[o].selectStatus = !1 : (this.acctList.items[o].selectStatus = !0, this.acctList.count++);
this.renderDrawerCaption(), this.$.accounts.render();
if (r) {
var u = new Date(r);
Date.validDate(u) ? (u.setHours(0, 0, 0, 0), this.$.fromDate.setValue(u), this.$.fromToggle.setValue(!0)) : this.$.fromToggle.setValue(!1);
}
if (i) {
var a = new Date(i);
Date.validDate(a) ? (a.setHours(23, 59, 59, 999), this.$.toDate.setValue(a), this.$.toToggle.setValue(!0)) : this.$.toToggle.setValue(!1);
}
this.toggleToggles();
var f = "";
t && (f += '"' + t + '"' + (n && n !== "%" ? ' "' + n + '"' : "")), this.$.searchString.setValue(GTS.String.trim(f)), this.$.searchString.getValue().length > 0 && this.search();
},
toggleToggles: function() {
this.$.fromDrawer.setOpen(this.$.fromToggle.getValue()), this.$.toDrawer.setOpen(this.$.toToggle.getValue());
},
renderDrawerCaption: function() {
this.$.accountDrawer.setCaption("Accounts") + " (" + this.acctList.count + $L(" of ") + this.acctList.items.length + ")";
},
setupRow: function(e, t) {
var n = this.acctList.items[t];
if (n) return this.$.accountName.setContent(n.acctName), this.$.icon.setSrc("assets/" + n.acctCategoryIcon), this.$.iconLock.addRemoveClass("unlocked", n.acctLocked !== 1 || n.bypass), this.$.accountSelected.setChecked(n.selectStatus), !0;
},
accountSelectedChanged: function(e, t) {
var n = t.rowIndex;
this.acctList.items[n].acctLocked && !this.acctList.items[n].bypass ? Checkbook.globals.security.authUser(this.acctList.items[n].name + " " + "PIN Code", this.acctList.items[n].lockedCode, {
onSuccess: enyo.bind(this, this.authSuccessful, t)
}) : (this.acctList.items[n].selectStatus = !this.acctList.items[n].selectStatus, this.acctList.count = this.acctList.items[n].selectStatus ? this.acctList.count + 1 : this.acctList.count - 1), this.renderDrawerCaption(), this.$.accounts.renderRow(n);
},
authSuccessful: function(e) {
this.acctList.items[e.rowIndex].bypass = !0, this.accountSelectedChanged(null, e);
},
search: function() {
var e = "", t = [], n = GTS.String.trim(GTS.String.dirtyString(this.$.searchString.getValue())), r = n.match(/"([^"]*)"/gi);
n = GTS.String.trim(n.replace(/"[^"]*"/gi, "")), n = n.split(" ");
if (r && r.length > 0) {
for (var i = 0; i < r.length; i++) r[i] = r[i].replace(/"/g, "");
n = n.concat(r);
}
for (var i = 0; i < n.length; i++) n[i][0] === "-" ? (n[i] = "%" + n[i].slice(1) + "%", n[i] !== "" && (e += " AND desc NOT LIKE ?", t.push(n[i]), e += " AND ( category NOT LIKE ? OR category2 NOT LIKE ? )", t.push(n[i]), t.push(n[i]), e += " AND itemId NOT IN ( SELECT ts.transId FROM transactionSplit ts WHERE ts.genCat LIKE ? OR ts.specCat LIKE ? )", t.push(n[i]), t.push(n[i]), e += " AND checkNum NOT LIKE ?", t.push(n[i]), e += " AND note NOT LIKE ?", t.push(n[i]))) : n[i].length > 0 && (n[i] = "%" + n[i] + "%", e += " OR desc LIKE ?", t.push(n[i]), e += " OR category LIKE ?", t.push(n[i]), e += " OR category2 LIKE ?", t.push(n[i]), e += " OR itemId IN ( SELECT ts.transId FROM transactionSplit ts WHERE ts.genCat LIKE ? OR ts.specCat LIKE ? )", t.push(n[i]), t.push(n[i]), e += " OR checkNum LIKE ?", t.push(n[i]), e += " OR note LIKE ?", t.push(n[i]));
e.length > 0 && (e = e.replace(/^ (or|and) (.*)/i, "$2"), e = [ "( " + e + " )" ]);
var s = [], o = [];
for (var i = 0; i < this.acctList.items.length; i++) this.acctList.items[i].selectStatus && (s.push("account = ?"), o.push(this.acctList.items[i].acctId));
s.length > 0 && o.length > 0 && (e += " AND ( " + s.join(" OR ") + " )", t = t.concat(o));
if (this.$.fromToggle.getValue()) {
var u = this.$.fromDate.getValue();
e += " AND date >= ?", t.push(Date.parse(u));
}
if (this.$.toToggle.getValue()) {
var a = this.$.toDate.getValue();
e += " AND date <= ?", t.push(Date.parse(a));
}
this.$.cleared.getValue() !== 2 && (e += " AND cleared = ?", t.push(this.$.cleared.getValue())), this.$.includeTrans.getValue() ? (this.$.includeNeg.getValue() || (e += " AND ( amount >= 0 OR ( linkedAccount != '' AND linkedRecord != '' ) )"), this.$.includePos.getValue() || (e += " AND ( amount < 0 OR ( linkedAccount != '' AND linkedRecord != '' ) )")) : (e += " AND linkedAccount = '' AND linkedRecord = ''", this.$.includeNeg.getValue() || (e += " AND amount >= 0"), this.$.includePos.getValue() || (e += " AND amount < 0")), e = e.replace(/^ (or|and) (.*)/i, "$2"), this.doSearch(e, t);
}
});

// results.js

enyo.kind({
name: "Checkbook.search.results",
flex: 1,
where: {
strings: "",
arguments: []
},
resultCount: 0,
transactions: [],
sort: null,
sortQry: null,
published: {
changesMade: !1
},
events: {
onModify: "",
onResultsFound: "",
onLoading: ""
},
components: [ {
name: "entries",
kind: enyo.VirtualList,
flex: 1,
className: "checkbook-stamp",
onSetupRow: "setupRow",
onAcquirePage: "acquirePage",
components: [ {
kind: enyo.SwipeableItem,
tapHighlight: !0,
ontap: "transactiontapped",
onConfirm: "transactionDeleted",
style: "padding-right: 20px; padding-left: 30px;",
components: [ {
name: "mainBody",
layoutKind: enyo.HFlexLayout,
className: "transactionItemTop",
components: [ {
flex: 1,
components: [ {
name: "desc",
className: "description enyo-text-ellipsis bold"
}, {
name: "time",
className: "date smaller"
}, {
layoutKind: enyo.HFlexLayout,
align: "center",
pack: "start",
components: [ {
name: "accountIcon",
kind: enyo.Image,
src: "",
style: "height: 16px; width: 16px; margin: 0 5px 0 0;"
}, {
name: "account",
className: "small",
content: "Account Name"
} ]
} ]
}, {
name: "amount",
style: "text-align: right;"
}, {
name: "cleared",
kind: enyo.CheckBox,
ontap: "transactionCleared",
style: "margin-left: 15px;"
} ]
}, {
name: "category",
allowHtml: !0
}, {
name: "checkNum",
className: "small"
}, {
name: "note",
className: "small",
allowHtml: !0
} ]
} ]
}, {
kind: enyo.Toolbar,
className: "tardis-blue",
pack: "start",
components: [ {
kind: enyo.GrabButton
}, {
kind: enyo.ToolButtonGroup,
style: "margin-left: 50px;",
components: [ {
ontap: "sortClicked",
icon: "assets/menu_icons/sort.png",
className: "enyo-grouped-toolbutton-dark"
} ]
} ]
}, {
name: "sortMenu",
kind: "Checkbook.selectedMenu"
}, {
name: "viewSingle",
kind: "Checkbook.transactions.viewSingle",
onClear: "vsCleared",
onEdit: "vsEdit",
onDelete: "transactionDeleted"
} ],
rendered: function() {
this.inherited(arguments), transactionSortOptions.length <= 0 ? Checkbook.globals.transactionManager.fetchTransactionSorting({
onSuccess: enyo.bind(this, this.buildTransactionSorting)
}) : this.buildTransactionSorting();
},
search: function(e, t) {
this.where = {
strings: e,
arguments: t
}, this.doLoading(!0), this.where.strings.length <= 0 ? this.fetchSearchCountHandler() : Checkbook.globals.transactionManager.searchTransactionsCount(this.where.strings, this.where.arguments, this.sortQry, {
onSuccess: enyo.bind(this, this.fetchSearchCountHandler)
});
},
fetchSearchCountHandler: function(e) {
this.resultCount = e && e.searchCount ? e.searchCount : 0, this.doResultsFound(this.resultCount), this.transactions = [], this.$.entries.punt();
},
buildTransactionSorting: function() {
this.sort = transactionSortOptions[0].value, this.sortQry = transactionSortOptions[0].qry, this.$.sortMenu.setItems(transactionSortOptions);
},
sortClicked: function(e, t) {
this.$.sortMenu.openAtControl(e, this.sort);
},
menuItemClick: function() {
var e = arguments[arguments.length === 2 ? 0 : 1];
if (e.menuParent.toLowerCase() === "transactionsortoptions") {
if (this.sort === e.value) return;
this.sort = e.value, this.sortQry = e.qry, this.transactions = [], this.$.entries.punt();
}
},
transactiontapped: function(e, t, n) {
this.log(), Checkbook.globals.prefs.transPreview === 1 ? (this.$.viewSingle.setIndex(n), this.$.viewSingle.setTransaction(this.transactions[n]), this.$.viewSingle.setAccount({
acctId: this.transactions[n].account
}), this.$.viewSingle.openAtCenter()) : this.vsEdit(null, n);
},
transactionCleared: function(e, t) {
this.vsCleared(null, t.rowIndex), t.stopPropagation();
},
vsCleared: function(e, t) {
if (this.transactions[t].frozen === 1) {
this.$.entries.refresh();
return;
}
return this.changesMade = !0, this.doLoading(!0), this.transactions[t].cleared = this.transactions[t].cleared === 1 ? 0 : 1, Checkbook.globals.transactionManager.clearTransaction(this.transactions[t].itemId, this.transactions[t].cleared === 1), this.$.entries.refresh(), this.transactions[t].cleared;
},
vsEdit: function(e, t) {
var n = this.transactions[t];
if (n && n.frozen !== 1) {
var r = {
acctId: n.account
}, i = {
account: n.account,
amount: n.amount,
category: n.category,
category2: n.category2,
checkNum: n.checkNum,
cleared: n.cleared,
date: n.date,
desc: n.desc,
itemId: n.itemId,
linkedAccount: n.linkedAccount,
linkedRecord: n.linkedRecord,
note: n.note,
repeatId: n.repeatId
};
enyo.asyncMethod(this, this.doModify, {
name: "editTransaction",
kind: "Checkbook.transactions.modify",
accountObj: r,
trsnObj: i,
transactionType: "",
onFinish: enyo.bind(this, this.modifyTransactionComplete, t)
});
}
},
modifyTransactionComplete: function(e, t, n, r, i) {
n === 1 && i === !0 ? (this.changesMade = !0, this.transactions = [], this.$.entries.punt()) : n === 2 && (this.changesMade = !0, this.transactions = [], this.$.entries.punt(), this.resultCount--, this.doResultsFound(this.resultCount));
},
transactionDeleted: function(e, t) {
if (this.transactions[t].frozen === 1) {
this.$.entries.refresh();
return;
}
this.changesMade = !0, this.doLoading(!0), Checkbook.globals.transactionManager.deleteTransaction(this.transactions[t].itemId), this.transactions.splice(t, 1), this.$.entries.refresh(), this.resultCount--, this.doResultsFound(this.resultCount), Checkbook.globals.transactionManager.searchTransactions(this.where.strings, this.where.arguments, this.sortQry, {
onSuccess: enyo.bind(this, this.acquirePageHandler, this.transactions.length)
}, 1, this.transactions.length);
},
setupRow: function(e, t) {
var n = this.transactions[t];
if (n) {
this.$.swipeableItem.addRemoveClass("alt-row", t % 2 === 0), this.$.swipeableItem.addRemoveClass("norm-row", t % 2 !== 0), this.$.desc.setContent(n.desc);
var r = new Date(parseInt(n.date));
this.$.time.setContent(r.format({
date: "long",
time: n.showTransTime === 1 ? "short" : ""
}));
var i = new Date;
n.showTransTime !== 1 && i.setHours(23, 59, 59, 999), this.$.swipeableItem.addRemoveClass("futureTransaction", n.date > Date.parse(i)), this.$.amount.setContent(formatAmount(n.amount)), this.$.amount.addRemoveClass("positiveBalance", n.amount > 0), this.$.amount.addRemoveClass("negativeBalance", n.amount < 0), this.$.amount.addRemoveClass("neutralBalance", n["amount"] == 0), this.$.cleared.setChecked(n.cleared === 1), this.$.accountIcon.setSrc("assets/" + n.acctCategoryIcon), this.$.account.setContent(n.acctName), n.enableCategories === 1 ? (this.$.category.show(), this.$.category.setContent(Checkbook.globals.transactionManager.formatCategoryDisplay(n.category, n.category2))) : this.$.category.hide(), this.$.checkNum.setContent(n.checkField === 1 && n.checkNum && n.checkNum !== "" ? "Check #" + n.checkNum : ""), this.$.note.setContent(n.hideNotes === 1 ? "" : n.note);
var s = n.linkedRecord && !isNaN(n.linkedRecord) && n["linkedRecord"] != "", o = n.repeatId && !isNaN(n.repeatId) && n["repeatId"] != "";
return this.$.mainBody.addRemoveClass("repeatTransferIcon", s && o), this.$.mainBody.addRemoveClass("transferIcon", s && !o), this.$.mainBody.addRemoveClass("repeatIcon", !s && o), !0;
}
},
acquirePage: function(e, t) {
if (this.where.strings.length <= 0) {
this.transactions = [], this.doLoading(!1);
return;
}
var n = t * e.getPageSize();
this.where.strings && this.where.arguments && n >= 0 && !this.transactions[n] && (this.doLoading(!0), Checkbook.globals.transactionManager.searchTransactions(this.where.strings, this.where.arguments, this.sortQry, {
onSuccess: enyo.bind(this, this.acquirePageHandler, n)
}, e.getPageSize(), n));
},
acquirePageHandler: function(e, t) {
for (var n = 0; n < t.length; n++) this.transactions[e + n] = enyo.mixin({
amount: prepAmount(t[n].amount)
}, t[n]), this.transactions[e + n].desc = GTS.String.dirtyString(this.transactions[e + n].desc), this.transactions[e + n].category = GTS.String.dirtyString(this.transactions[e + n].category), this.transactions[e + n].category2 = GTS.String.dirtyString(this.transactions[e + n].category2), this.transactions[e + n].note = GTS.String.dirtyString(this.transactions[e + n].note);
this.$.entries && this.$.entries.refresh(), this.doLoading(!1);
}
});

// manager.js

enyo.kind({
name: "Checkbook.budget.manager",
kind: enyo.Component,
constructor: function() {
this.inherited(arguments);
if (!Checkbook.globals.gts_db) {
this.log("creating database object.");
var e = new GTS.database(getDBArgs());
}
},
createBudget: function(e, t) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getInsert("budgets", e), {
onSuccess: enyo.bind(this, this.createBudgetFollower, t)
});
},
createBudgetFollower: function(e) {
console.log(arguments);
var t = Checkbook.globals.gts_db.lastInsertID();
t ? Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "UPDATE budgets SET budgetOrder = ( SELECT IFNULL( MAX( budgetOrder ) + 1, 0 ) FROM budgets LIMIT 1 ) WHERE budgetId = ?;",
values: [ t ]
}), e) : enyo.isFunction(e.onSuccess) && e.onSuccess();
},
updateBudget: function(e, t) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getUpdate("budgets", e, {
budgetId: e.budgetId
}), t);
},
deleteBudget: function(e, t) {
Checkbook.globals.gts_db.query(Checkbook.globals.gts_db.getDelete("budgets", {
budgetId: e
}), t);
},
fetchOverallBudget: function(e, t, n) {
var r = new GTS.databaseQuery({
sql: "SELECT COUNT( budgetId ) AS budgetCount, IFNULL( SUM( spending_limit ), 0 ) AS spending_limit, IFNULL( SUM(  IFNULL( ( SELECT ABS( SUM( ex.amount ) ) FROM transactions ex WHERE ex.category LIKE budgets.category AND ex.category2 LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? ), 0 ) + ( IFNULL( ( SELECT ABS( SUM( ts.amount ) ) FROM transactions ex LEFT JOIN transactionSplit ts ON ts.transId = ex.itemId WHERE ts.genCat LIKE budgets.category AND ts.specCat LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? ), 0 ) ) ), 0 ) AS spent FROM budgets;",
values: [ e, t, e, t ]
});
Checkbook.globals.gts_db.query(r, {
onSuccess: function(e) {
enyo.isFunction(n.onSuccess) && n.onSuccess(e[0]);
},
onError: n.onError
});
},
fetchBudget: function(e, t, n, r) {
var i = new GTS.databaseQuery({
sql: "SELECT *, ( IFNULL( ( SELECT ABS( SUM( ex.amount ) ) FROM transactions ex WHERE ex.category LIKE budgets.category AND ex.category2 LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? ), 0 ) + ( IFNULL( ( SELECT ABS( SUM( ts.amount ) ) FROM transactions ex LEFT JOIN transactionSplit ts ON ts.transId = ex.itemId WHERE ts.genCat LIKE budgets.category AND ts.specCat LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? ), 0 ) ) ) AS spent FROM budgets WHERE budgetId = ? ORDER BY " + budgetSortOptions[sort].query + " LIMIT 1;",
values: [ t, n, t, n, e ]
});
Checkbook.globals.gts_db.query(i, {
onSuccess: function(e) {
enyo.isFunction(r.onSuccess) && r.onSuccess(e[0]);
},
onError: r.onError
});
},
fetchBudgets: function(e, t, n, r, i, s) {
r = GTS.Object.validNumber(r) ? r : 0, i = GTS.Object.validNumber(i) ? i : 100, s = GTS.Object.validNumber(s) ? s : 0, Checkbook.globals.gts_db.query(new GTS.databaseQuery({
sql: "SELECT *, ( IFNULL( ( SELECT ABS( SUM( ex.amount ) ) FROM transactions ex WHERE ex.category LIKE budgets.category AND ex.category2 LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? ), 0 ) + ( IFNULL( ( SELECT ABS( SUM( ts.amount ) ) FROM transactions ex LEFT JOIN transactionSplit ts ON ts.transId = ex.itemId WHERE ts.genCat LIKE budgets.category AND ts.specCat LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? ), 0 ) ) ) AS spent FROM budgets ORDER BY " + budgetSortOptions[r].query + " LIMIT ?" + " OFFSET ?;",
values: [ e, t, e, t, i, s ]
}), n);
}
});

// view.js

enyo.kind({
name: "Checkbook.budget.view",
flex: 1,
style: "height: 100%;",
sort: 0,
budgets: [],
published: {
accountObj: {}
},
events: {
onFinish: ""
},
components: [ {
kind: enyo.PageHeader,
components: [ {
showing: !0,
name: "systemIcon",
kind: enyo.Image,
src: "assets/icon_4.png",
className: "img-icon",
style: "margin: 0 15px 0 0;"
}, {
showing: !1,
name: "loadingSpinner",
kind: "GTS.Spinner",
className: "img-icon",
style: "margin: 0px 15px 5px 0;"
}, {
content: "Budget System",
className: "bigger",
style: "margin-top: -6px;"
}, {
kind: enyo.Spacer,
flex: 1
}, {
name: "totalCurrent",
style: "margin-top: -5px;"
}, {
name: "totalProgress",
kind: "onyx.ProgressBar",
className: "big",
style: "width: 200px; margin-left: 10px; margin-right: 10px;",
minimum: 0,
maximum: 100,
position: 0
}, {
name: "totalMax",
style: "margin-top: -5px;"
} ]
}, {
name: "entries",
kind: "ReorderableVirtualList",
className: "light narrow-column",
style: "padding-left: 0px; padding-right: 0px;",
flex: 1,
reorderable: !0,
onReorder: "reorder",
onSetupRow: "setupRow",
onAcquirePage: "acquirePage",
components: [ {
kind: enyo.SwipeableItem,
style: "padding-right: 7px;",
tapHighlight: !0,
ontap: "tapped",
onConfirm: "deleted",
components: [ {
layoutKind: enyo.HFlexLayout,
align: "center",
components: [ {
name: "category",
flex: 1
}, {
name: "current"
}, {
content: "of",
style: "padding-left: 5px; padding-right: 5px;"
}, {
name: "total"
} ]
}, {
layoutKind: enyo.HFlexLayout,
align: "center",
components: [ {
name: "progress",
kind: "onyx.ProgressBar",
flex: 1,
className: "big",
style: "margin-right: 10px;",
minimum: 0,
maximum: 100,
position: 0
}, {
name: "config",
kind: enyo.Image,
src: "assets/config.png"
}, {
name: "search",
kind: enyo.Image,
src: "assets/search.png"
} ]
} ]
} ]
}, {
kind: enyo.Toolbar,
className: "tardis-blue",
components: [ {
kind: enyo.ToolButtonGroup,
components: [ {
caption: "Back",
className: "enyo-grouped-toolbutton-dark",
ontap: "doFinish"
}, {
icon: "assets/menu_icons/sort.png",
className: "enyo-grouped-toolbutton-dark",
ontap: "sortButtontaped"
} ]
}, {
kind: enyo.Spacer,
flex: 1
}, {
kind: enyo.ToolButtonGroup,
components: [ {
ontap: "dateBack",
className: "enyo-grouped-toolbutton-dark",
icon: "assets/menu_icons/back.png"
} ]
}, {
name: "date",
kind: enyo.DatePicker,
className: "enyo-grouped-toolbutton-dark",
label: "",
hideDay: !0,
onChange: "dateChanged"
}, {
kind: enyo.ToolButtonGroup,
components: [ {
ontap: "dateForward",
className: "enyo-grouped-toolbutton-dark",
icon: "assets/menu_icons/forward.png"
} ]
}, {
kind: enyo.Spacer,
flex: 1
}, {
kind: enyo.ToolButtonGroup,
components: [ {
name: "editModeToggle",
toggling: !0,
className: "enyo-grouped-toolbutton-dark",
icon: "assets/menu_icons/lock.png",
ontap: "toggleEdit"
}, {
icon: "assets/menu_icons/new.png",
className: "enyo-grouped-toolbutton-dark",
ontap: "addBudget"
} ]
} ]
}, {
name: "sortMenu",
kind: "Checkbook.selectedMenu",
components: budgetSortOptions
}, {
name: "manager",
kind: "Checkbook.budget.manager"
}, {
name: "modify",
kind: "Checkbook.budget.modify",
onFinish: "modifyComplete"
} ],
constructor: function() {
this.inherited(arguments), this.bound = {
modifyComplete: enyo.bind(this, this.modifyComplete)
};
},
rendered: function() {
this.inherited(arguments), this.budgets = [], this.buildHeader();
},
colorize: function(e, t) {
e.addRemoveClass("blue", t < 25), e.addRemoveClass("green", t >= 25 && t < 75), e.addRemoveClass("yellow", t >= 75 && t <= 100), e.addRemoveClass("red", t > 100);
},
menuItemClick: function() {
var e = arguments[arguments.length === 2 ? 0 : 1];
if (e.menuParent.toLowerCase() === "budgetsortoptions") {
console.log(e);
if (this.sort === e.value) return;
this.sort = e.value, this.budgets = [], this.$.entries.punt();
}
},
buildHeader: function() {
this.$.manager.fetchOverallBudget(this.$.date.getValue().setStartOfMonth(), this.$.date.getValue().setEndOfMonth(), {
onSuccess: enyo.bind(this, this.buildHeaderHandler)
});
},
buildHeaderHandler: function(e) {
var t = e.spent / e.spending_limit * 100;
this.$.totalCurrent.setContent(formatAmount(e.spent)), this.$.totalMax.setContent(formatAmount(e.spending_limit)), this.$.totalProgress.animateProgressTo(t), this.colorize(this.$.totalProgress, t), this.colorize(this.$.totalCurrent, t);
},
sortButtontaped: function(e, t) {
this.$.sortMenu.openAtControl(e, this.sort);
},
dateBack: function() {
var e = this.$.date.getValue();
e.setDate(5), e.setMonth(e.getMonth() - 1), this.$.date.setValue(e), this.dateChanged(null, e);
},
dateForward: function() {
var e = this.$.date.getValue();
e.setDate(5), e.setMonth(e.getMonth() + 1), this.$.date.setValue(e), this.dateChanged(null, e);
},
dateChanged: function(e, t) {
this.budgets = [], this.$.entries.punt(), this.$.manager.fetchOverallBudget(this.$.date.getValue().setStartOfMonth(), this.$.date.getValue().setEndOfMonth(), {
onSuccess: enyo.bind(this, this.buildHeader)
});
},
toggleEdit: function() {
this.$.editModeToggle.getDepressed() ? this.$.editModeToggle.setIcon("assets/menu_icons/unlock.png") : this.$.editModeToggle.setIcon("assets/menu_icons/lock.png"), this.$.entries.refresh();
},
addBudget: function() {
this.$.modify.openAtCenter();
},
reorder: function(e, t, n) {
if (t != n && t > -1 && t < this.budgets.length) {
var r = this.budgets.splice(n, 1), i = this.budgets.slice(t);
this.budgets.length = t, this.budgets.push.apply(this.budgets, r), this.budgets.push.apply(this.budgets, i);
var s = [];
for (var o = 0; o < this.budgets.length; o++) s.push(Checkbook.globals.gts_db.getUpdate("budgets", {
budgetOrder: o
}, {
budgetId: this.budgets[o].budgetId
}));
Checkbook.globals.gts_db.queries(s), this.sort = 0, this.$.entries.refresh();
}
},
tapped: function(e, t, n) {
var r = this.budgets[n];
r && (this.$.editModeToggle.getDepressed() ? this.$.modify.openAtCenter(r) : enyo.Signals.send("showSearch", {
category: r.category,
category2: r.category2,
dateStart: this.$.date.getValue().setStartOfMonth(),
dateEnd: this.$.date.getValue().setEndOfMonth(),
onFinish: enyo.bind(this, this.dateChanged, null, this.$.date.getValue())
}));
},
deleted: function(e, t) {
var n = this.budgets[t];
n && this.$.manager.deleteBudget(n.budgetId, {
onSuccess: this.bound.modifyComplete
});
},
modifyComplete: function() {
this.budgets = [], this.$.entries.punt(), this.buildHeader();
},
setupRow: function(e, t) {
var n = this.budgets[t];
if (n) {
var r = 100 * n.spent / n.spending_limit;
return this.$.category.setContent(n.category + (n.category2 !== "%" ? " >> " + n.category2 : "")), this.$.current.setContent(formatAmount(n.spent)), this.$.total.setContent(formatAmount(n.spending_limit)), this.colorize(this.$.progress, r), this.colorize(this.$.current, r), this.$.progress.animateProgressTo(r), this.$.search.setShowing(!this.$.editModeToggle.getDepressed()), this.$.config.setShowing(this.$.editModeToggle.getDepressed()), !0;
}
},
acquirePage: function(e, t) {
var n = t * e.getPageSize();
if (n < 0) return;
this.budgets[n] || (this.loadingDisplay(!0), this.$.manager.fetchBudgets(this.$.date.getValue().setStartOfMonth(), this.$.date.getValue().setEndOfMonth(), {
onSuccess: enyo.bind(this, this.buildPage, n)
}, this.sort, e.getPageSize(), n));
},
buildPage: function(e, t) {
for (var n = 0; n < t.length; n++) this.budgets[e + n] = t[n], this.budgets[e + n].category = GTS.String.dirtyString(this.budgets[e + n].category), this.budgets[e + n].category2 = GTS.String.dirtyString(this.budgets[e + n].category2);
this.$.entries.refresh(), this.loadingDisplay(!1);
},
loadingDisplay: function(e) {
this.$.loadingSpinner.setShowing(e), this.$.systemIcon.setShowing(!e);
}
});

// modify.js

enyo.kind({
name: "Checkbook.budget.modify",
modal: !0,
scrim: !0,
dismissWithClick: !0,
dismissWithEscape: !0,
style: "width: 400px;",
acctList: [],
events: {
onFinish: ""
},
components: [ {
kind: enyo.Header,
layoutKind: enyo.HFlexLayout,
align: "center",
className: "enyo-header-dark popup-header",
style: "border-radius: 10px; margin-bottom: 10px;",
components: [ {
name: "title",
content: "Modify Budget",
className: "bigger",
style: "text-align: center; margin-right: -32px;",
flex: 1
}, {
kind: enyo.ToolButton,
icon: "assets/menu_icons/close.png",
className: "img-icon",
style: "text-align: center;",
ontap: "close"
} ]
}, {
kind: enyo.Group,
components: [ {
kind: enyo.Item,
layoutKind: enyo.HFlexLayout,
className: "enyo-first",
ontap: "categoryTapped",
components: [ {
name: "category",
className: "enyo-text-ellipsis",
flex: 1
}, {
content: "Category",
className: "enyo-listselector-label enyo-label"
}, {
className: "enyo-listselector-arrow"
} ]
}, {
kind: enyo.Item,
layoutKind: enyo.HFlexLayout,
tapHightlight: !1,
components: [ {
name: "amount",
kind: enyo.Input,
hint: "0.00",
selectAllOnFocus: !0,
onkeypress: "amountKeyPress",
flex: 1,
components: [ {
content: "Spending Limit",
className: "enyo-label"
} ]
} ]
}, {
showing: !1,
name: "span",
kind: "GTS.ListSelectorBar",
labelText: "Time Span",
choices: [ "1 month", "2 months", "3 months" ],
value: "1 month",
style: "padding: 10px !important;"
}, {
showing: !1,
name: "rollover",
kind: "GTS.ToggleBar",
style: "padding-left: 0;",
mainText: "Rollover",
subText: "",
onText: "Yes",
offText: "No",
value: !1,
style: "padding: 10px !important;"
} ]
}, {
kind: enyo.HFlexBox,
components: [ {
kind: enyo.Spacer,
flex: 1
}, {
kind: "onyx.Button",
caption: "Cancel",
flex: 3,
ontap: "close"
}, {
kind: enyo.Spacer,
flex: 1
}, {
name: "delete",
kind: "onyx.Button",
caption: "Delete",
flex: 3,
ontap: "delete",
className: "onyx-negative"
}, {
kind: enyo.Spacer,
flex: 1
}, {
kind: "onyx.Button",
caption: "Save",
flex: 3,
ontap: "save",
className: "onyx-affirmative"
}, {
kind: enyo.Spacer,
flex: 1
} ]
}, {
name: "progress",
kind: "GTS.progress",
title: "",
message: "",
progress: ""
}, {
name: "errorMessage",
kind: "GTS.system_error",
errTitle: "Budget Error",
errMessage: "",
errMessage2: "",
onFinish: "closeErrorMessage"
}, {
name: "categorySystem",
kind: "Checkbook.transactionCategory.select",
entireGeneral: !0
}, {
name: "manager",
kind: "Checkbook.budget.manager"
} ],
rendered: function() {
this.$.categorySystem.loadCategories(enyo.bind(this, this.inherited, arguments)), this.saveComplete = enyo.bind(this, this.saveComplete);
},
openAtCenter: function(e) {
this.inherited(arguments), this.budgetObj = enyo.mixin({
budgetId: null,
category: "Uncategorized",
category2: "%",
spending_limit: "",
span: 1,
rollOver: 0
}, e), this.$["delete"].setShowing(this.budgetObj.budgetId && this.budgetObj.budgetId >= 0), this.renderCategory(), this.renderAmount();
},
categoryTapped: function() {
this.$.categorySystem.getCategoryChoice(enyo.bind(this, this.categorySelected), null);
},
categorySelected: function(e) {
enyo.mixin(this.budgetObj, e), this.renderCategory();
},
renderCategory: function() {
this.budgetObj.category2 === "%" ? this.$.category.setContent(this.budgetObj.category) : this.$.category.setContent(this.budgetObj.category2);
},
amountKeyPress: function(e, t) {
!(t.keyCode >= 48 && t.keyCode <= 57) && t.keyCode !== 46 && t.preventDefault();
},
renderAmount: function() {
this.$.amount.setValue(this.budgetObj.spending_limit);
},
save: function() {
this.budgetObj.spending_limit = GTS.Object.validNumber(this.$.amount.getValue()) ? 0 : Number(Number(this.$.amount.getValue()).toFixed(2));
if (this.budgetObj.spending_limit === 0) {
this.$.errorMessage.load(null, "Spending limit must not be zero.", null, null);
return;
}
delete this.budgetObj.spent, this.budgetObj.budgetId && this.budgetObj.budgetId >= 0 ? this.$.manager.updateBudget(this.budgetObj, {
onSuccess: this.saveComplete
}) : (delete this.budgetObj.budgetId, this.$.manager.createBudget(this.budgetObj, {
onSuccess: this.saveComplete
}));
},
"delete": function() {
this.budgetObj.budgetId && this.budgetObj.budgetId >= 0 ? this.$.manager.deleteBudget(this.budgetObj.budgetId, {
onSuccess: this.saveComplete
}) : this.saveComplete();
},
saveComplete: function() {
this.close(), this.doFinish();
},
closeErrorMessage: function() {
this.$.errorMessage.close();
}
});
