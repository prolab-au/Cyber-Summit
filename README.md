# PROLAB Cyber Summit 2026 - Statik Web Sitesi

Yalnızca HTML, CSS ve vanilla JavaScript. Derleme aracı, paket yöneticisi, backend yok.

## Dosyalar

- `index.html` - sayfa yapısı, metinler, çerez banner'ı ve politika penceresi
- `styles.css` - tasarım (en üstte renk/boyut değişkenleri)
- `script.js` - menü, sekmeler, 0/1 arka planı, çerez onayı, analiz, bağlantı ayarları
- `images/` - görseller. Topluluk logosu: `images/prolab-logo.png` (yalnızca footer'da)

## Yerel önizleme

`index.html` dosyasını tarayıcıda aç. Sunucu gerekmez. Çerez davranışını doğru test etmek için `python3 -m http.server` gibi bir yerel sunucu kullan; `file://` ile tarayıcılar çerez kaydetmeyebilir (tercih localStorage'a düşer).

## Ziyaretçi ve etkileşim sayımı (GoatCounter)

Statik sitede sayaç tutacak sunucu yok, bu yüzden harici servis gerekir.

1. goatcounter.com'da hesap aç, bir site kodu seç (örn. `prolab`).
2. `script.js` en üstündeki `ANALYTICS_CONFIG.goatcounterCode` değerine kodu yaz.
3. Yayınla. Yalnızca "Kabul et" diyen ziyaretçiler sayılır; reddedenlerde hiçbir şey yüklenmez.
4. Sayılan etkileşimler GoatCounter panelinde `etkilesim/...` yollarıyla görünür (buton tıklamaları, menü, program sekmeleri, SSS açılışları). Yeni bir öğeyi saydırmak için ona `data-track="isim"` ekle.

Kod boşken hiçbir veri toplanmaz. Başka bir servis kullanırsan `index.html` içindeki çerez politikası metnini de güncelle. Politika metni hukuki danışmanlıktan geçmemiştir; yayından önce gözden geçir.

## Analiz panelini okuma

Panel: `https://KODUN.goatcounter.com` (giriş yaptıktan sonra).

- **Kaç kişi geldi:** üstteki ziyaretçi ve görüntüleme sayıları, günlük grafik.
- **Nereden geldi:** Referrers bölümü (instagram.com, linkedin.com, Google...). Bio ve paylaşım linklerine etiket ekle: `https://siteadresi/?ref=instagram_bio`, `?ref=linkedin_post`. Etiketin panelde göründüğünü ilk gün kontrol et.
- **Nereli, hangi cihaz:** ülke/şehir, tarayıcı, işletim sistemi, ekran boyutu bölümleri.
- **Ne yaptı:** Pages listesinde `etkilesim/...` satırları. Örnek: `basvuru-ctf`, `basvuru-egitim-organizasyon`, `program-gun-2`, `sss-yer`, `sosyal-instagram`, `iletisim-eposta`. Hangi bölüm ilgi çekiyor buradan anlaşılır.
- **Gösteremeyeceği:** kişi adı, e-posta, "şu kişi gitti" bilgisi. Veri anonim ve toplu. Tek sayfalı site olduğu için "hangi sayfadan çıktı" yerine etkileşim sayılarına bak.
- Yalnızca çerezi kabul edenler sayılır; gerçek ziyaretçi sayısı panelde görünenden yüksektir.

## Düzenleme

- **Logo:** `images/prolab-logo.png`. Dosya yoksa metin "PROLAB" görünür.
- **Başvuru formları / CTFd:** `script.js` içindeki `EVENT_CONFIG` (CTF başvurusu, eğitim+organizasyon başvurusu, CTFd).
- **Metinler:** `index.html`.
- **Renkler ve boyutlar:** `styles.css` `:root`.

## Test listesi

1. 1366, 1440, tablet ve 320px genişlikte yatay kaydırma olmadığını kontrol et.
2. Mobil menü, program sekmeleri (ok tuşlarıyla da), SSS.
3. İlk ziyarette banner çıkıyor mu; Kabul/Reddet sonrası kapanıyor ve sayfa yenilenince geri gelmiyor mu; footer'dan "Çerez tercihleri" yeniden açıyor mu.
4. Reddet sonrası Network sekmesinde `gc.zgo.at` isteği olmadığını doğrula.
5. Fare 0/1 arka planında yaklaşınca parlıyor mu; işletim sisteminde "hareketi azalt" açıkken animasyon duruyor mu.

## GitHub Pages

Settings > Pages > Deploy from a branch > `main` / root.
