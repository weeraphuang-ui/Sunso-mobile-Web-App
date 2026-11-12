// ================================================================
//  Service Worker — ซันโซโมบาย
//  ★ สำคัญ: เปลี่ยนเลขท้าย CACHE_VERSION ทุกครั้งที่ deploy เวอร์ชันใหม่
//     (หรือใส่วันที่/เวลาที่ deploy ก็ได้ ขอแค่ไม่ซ้ำของเดิม)
// ================================================================
const CACHE_VERSION = 'sunso-v20261109a';
const CACHE_NAME = CACHE_VERSION;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
];

// ติดตั้ง SW ใหม่ — ให้ทำงานทันทีไม่ต้องรอแท็บเก่าปิด
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .catch(() => {}) // ไม่ให้ install fail ถ้าบางไฟล์โหลดไม่ได้
  );
});

// เปิดใช้งาน SW ใหม่ — ลบแคชเวอร์ชันเก่าทิ้งทั้งหมด + เข้าคุมแท็บที่เปิดอยู่ทันที
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// กลยุทธ์การดึงไฟล์:
//  - หน้า HTML (index.html) → Stale-while-revalidate: มีแคชแล้วส่งทันที (เร็วมาก ไม่ต้องรอเน็ต)
//    พร้อมโหลดของใหม่เบื้องหลังไปอัปเดตแคชไว้ใช้รอบหน้า — ปลอดภัยเพราะมีแบนเนอร์
//    "อัปเดตเวอร์ชันใหม่" แจ้งอยู่แล้วเวลามีโค้ดใหม่ ไม่ทำให้ user ใช้เวอร์ชันเก่าแบบไม่รู้ตัว
//  - ไฟล์ static อื่นๆ (รูป/ไอคอน) → Cache-first (เร็ว ประหยัดเน็ต)
self.addEventListener('fetch', event => {
  const req = event.request;
  try { if (new URL(req.url).pathname.indexOf('/customer') === 0) return; } catch (e) {}   // แอปลูกค้า: ไม่ให้ SW ของแอปร้านแคช/แทรกแซง

  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      caches.match(req).then(cached => {
        const networkFetch = fetch(req)
          .then(res => {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
            return res;
          })
          .catch(() => cached || caches.match('/index.html'));
        // มีแคชอยู่แล้ว → ส่งกลับทันทีให้หน้าโหลดเร็วสุด แล้วค่อยอัปเดตแคชเบื้องหลังแบบเงียบๆ
        // ยังไม่มีแคช (เปิดครั้งแรกสุด) → ต้องรอโหลดจากเน็ตก่อนเป็นปกติ
        return cached || networkFetch;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});

// รับคำสั่งจากหน้าเว็บให้ข้ามการรอ (ใช้คู่กับปุ่ม "อัปเดตตอนนี้")
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
