// ★ ไฟล์นี้ที่เดียวที่ต้องแก้ เมื่อ Apps Script เปลี่ยน URL
// วาง URL ของ Web app (ลงท้าย /exec) ระหว่างเครื่องหมายคำพูด แล้วอัปโหลดไฟล์นี้ขึ้น Netlify
// ลูกค้าที่ติดตั้งแอปไว้แล้วจะได้ URL ใหม่เองในการเปิดครั้งถัดไป ไม่ต้องติดตั้งใหม่
window.PORTAL_CONFIG = {
  api: 'https://script.google.com/macros/s/AKfycbw3W6S3oJcpklhPIstpaKa7sfD02Gxh-kIKx1r4j4K_h7kCHqNM5ewV1nlUn9TwSt8/exec',
  // ข้อมูลติดต่อร้าน แสดงท้ายหน้าแอปลูกค้า (ลบ/ปล่อยว่างรายการที่ไม่ใช้ได้)
  contact: {
    phones: [
      { label: 'โทรหาร้าน', tel: '094-526-8965' },
      { label: 'โทรหาร้าน', tel: '093-469-3546' }
    ],
    line: '',        // เช่น 'https://line.me/R/ti/p/@xxxxxxx'
    hours: 'เปิดทุกวัน 08.30 - 17.30 น.'
  }
};
