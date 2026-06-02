const POLICIES = [
  {
    num: '01',
    icon: '🏛️',
    title: 'ปฏิรูปโครงสร้างและการทำงานของสภานักเรียน',
    hook: 'มืออาชีพ โปร่งใส ตรวจสอบได้',
    detail:
      'ยกระดับสภานักเรียนสู่ความเป็นมืออาชีพด้วยการจัดตั้งคณะทำงานตามความเชี่ยวชาญ (Specialists) เพื่อแก้ปัญหาตรงจุดและขับเคลื่อนงานในระยะยาวอย่างมีประสิทธิภาพ มุ่งสร้างเครือข่ายสภานักเรียน บริหารทรัพยากรบุคคลอย่างคุ้มค่า และพัฒนาระบบการทำงานให้โปร่งใส ตรวจสอบได้ในทุกขั้นตอน',
    category: 'สภานักเรียน',
  },
  {
    num: '02',
    icon: '🛵',
    title: 'โครงการสอบใบขับขี่ปลอดภัย ภายในสถานศึกษา',
    hook: 'สะดวก ประหยัด ปลอดภัยตามกฎหมาย',
    detail:
      'อำนวยความสะดวกขั้นสุดด้วยการประสานงานจัดอบรมและทดสอบใบขับขี่ที่ได้มาตรฐานสากลภายในโรงเรียน เพื่อประหยัดเวลาและค่าใช้จ่ายของผู้ปกครอง พร้อมส่งเสริมให้นักเรียนที่ขับขี่รถจักรยานยนต์มีใบอนุญาตถูกต้องตามกฎหมาย และสร้างวินัยจราจรที่ปลอดภัยร่วมกัน',
    category: 'สวัสดิการ & ความปลอดภัย',
  },
  {
    num: '03',
    icon: '🏆',
    title: 'ผลักดันการจัดกีฬาสีให้เร็วขึ้น',
    hook: 'เตรียมพร้อมตั้งแต่ภาคเรียนที่ 1',
    detail:
      'ปรับโฉมระบบการจัดกีฬาสี โดยเร่งให้มีการเลือกตั้งประธานสีตั้งแต่ภาคเรียนที่ 1 (ผ่านระบบเลือกตั้งมาตรฐานเดียวกับสภานักเรียน) เพื่อให้คณะทำงานมีเวลาเตรียมการในช่วงปิดภาคเรียน ยกระดับความพร้อมเมื่อเปิดเทอม และช่วยลดผลกระทบต่อเวลาการเตรียมตัวสอบเข้ามหาวิทยาลัยของพี่ ม.6',
    category: 'กีฬา & กิจกรรม',
  },
  {
    num: '04',
    icon: '📱',
    title: 'ระบบแจ้งปัญหาและเพจฝากบอก (Instagram)',
    hook: 'สื่อสารปลอดภัย สร้างสรรค์ ไม่แตกแยก',
    detail:
      'สร้างพื้นที่ฝากบอกผ่านเพจฝากบอก Instagram โดยมีทีมแอดมินคอยคัดกรองข้อมูลอย่างเป็นระบบ เพื่อเป็นสื่อกลางในการรับฟังความคิดเห็น ส่งต่อข้อความ และสร้างความเข้าใจอันดีระหว่างนักเรียน โดยเน้นการสื่อสารที่ปลอดภัย สร้างสรรค์ และไม่ก่อให้เกิดความแตกแยก',
    category: 'สื่อสาร & ชุมชน',
  },
  {
    num: '05',
    icon: '📚',
    title: 'ธนาคารสรุปบทเรียน (Academic Hub)',
    hook: 'เรียนรู้ได้ตลอด 24 ชั่วโมง',
    detail:
      'ทลายข้อจำกัดการเรียนรู้ด้วยการสร้างคอมมูนิตี้วิชาการออนไลน์ผ่าน Discord และ LINE OpenChat พื้นที่ฟรีที่ทุกคนสามารถสอบถาม แลกเปลี่ยน และทบทวนบทเรียนได้ตลอด 24 ชั่วโมง โดยมีเพื่อนและรุ่นพี่ที่มีความเชี่ยวชาญร่วมแจกสรุป ติวเข้มเป็นรายบท ทั้งการสอบในโรงเรียน (กลางภาค/ปลายภาค) และการเตรียมตัวสอบเข้า ม.4 พร้อมอัปเดตข่าวสารระบบการสอบอย่างรวดเร็ว — “เพราะการเรียนรู้ที่ดี ไม่ควรถูกจำกัดอยู่แค่ในห้องเรียน”',
    category: 'วิชาการ',
  },
  {
    num: '06',
    icon: '🎙️',
    title: 'นโยบาย Student Podcast',
    hook: 'เสียงสะท้อนของชาวเรียน',
    detail:
      'เปิดพื้นที่สื่อเสียง (Podcast) ของโรงเรียน เพื่อเป็นแพลตฟอร์มในการแชร์ประสบการณ์ แรงบันดาลใจ ทริกการเรียน และเส้นทางสู่ความสำเร็จ โดยความร่วมมือของนักเรียน ครู และศิษย์เก่า ผ่านรายการหลากหลายรูปแบบ ทั้งการสัมภาษณ์เจาะลึก และการพูดคุยสบาย ๆ พร้อมเปิดโอกาสให้นักเรียนฝึกทักษะรอบด้าน ทั้งเบื้องหน้า (พิธีกร) และเบื้องหลัง (การตัดต่อและการทำงานเป็นทีม) — “บางคำพูดอาจเป็นเพียงเสียงธรรมดา แต่สำหรับใครบางคน มันอาจเป็นแรงผลักดันที่เปลี่ยนชีวิต”',
    category: 'สื่อ & สร้างสรรค์',
  },
  {
    num: '07',
    icon: '🤝',
    title: 'นักเรียนที่ปรึกษา (Peer Mentor)',
    hook: 'ไม่ปล่อยให้ใครต้องเดินลำพัง',
    detail:
      'คัดสรรนักเรียนแกนนำที่มีจิตอาสาและความรับผิดชอบ พัฒนาสู่การเป็น “พี่ไกด์ (Mentor)” ที่คอยให้คำแนะนำ ดูแล และช่วยเหลือรุ่นน้อง ทั้งในด้านการปรับตัว การเรียน และการใช้ชีวิตในรั้วโรงเรียน — “เพราะโรงเรียนที่ดี คือโรงเรียนที่เราจะไม่ปล่อยให้ใครต้องเดินลำพัง”',
    category: 'ดูแล & ที่ปรึกษา',
  },
  {
    num: '08',
    icon: '📖',
    title: 'หนังสือรุ่น (Yearbook) – สมัครใจ เฉพาะ ม.6',
    hook: 'บันทึกความทรงจำก่อนก้าวสู่เส้นทางใหม่',
    detail:
      'จัดทำหนังสือรุ่นที่รวบรวมความทรงจำ เรื่องราว และภาพกิจกรรมตลอดรั้วโรงเรียน เพื่อบันทึกช่วงเวลาสำคัญและมิตรภาพที่จะคงอยู่ตลอดไป ออกแบบให้ร่วมสมัย มีคุณภาพสูง และเปิดโอกาสให้นักเรียนมีส่วนร่วมในการรังสรรค์ — “หนังสือรุ่นอาจเป็นเพียงหน้ากระดาษ แต่ทุกหน้าคือช่วงเวลาที่เราเติบโตไปด้วยกัน”',
    category: 'กิจกรรม ม.6',
  },
  {
    num: '09',
    icon: '📌',
    title: 'เข็มกลัดโรงเรียน (รุ่นทั่วไป & รุ่น ม.6)',
    hook: 'สัญลักษณ์แห่งความภูมิใจและเกียรติยศ',
    detail:
      'เปิดจำหน่ายPre-orderเข็มกลัดที่ระลึกของโรงเรียนสำหรับนักเรียนทุกระดับชั้น และรุ่น Limited Edition สุดพิเศษสำหรับพี่ ม.6 เพื่อเป็นสัญลักษณ์แห่งความภูมิใจและเกียรติยศของพวกเราทุกคน',
    category: 'กิจกรรม & ของที่ระลึก',
  },
  {
    num: '10',
    icon: '🚻',
    title: 'ยกระดับห้องน้ำสะอาด ลดกลิ่น',
    hook: 'สะอาด สะดวก ใส่ใจสุขภาวะ',
    detail:
      'พัฒนาและจัดการระบบสุขาภิบาลในโรงเรียนให้สะอาด น่าใช้ และถูกสุขลักษณะ เพิ่มรอบความถี่ในการทำความสะอาด ติดตั้งอุปกรณ์กระจายความหอมและลดกลิ่นอับอย่างมีประสิทธิภาพ พร้อมเสริมฟังก์ชันความสะดวกด้วยการติดตั้งราวพาดผ้าและชั้นวางสิ่งของ — “ห้องน้ำที่ดี ไม่ใช่แค่สะอาด แต่ต้องใส่ใจสุขภาวะและความสะดวกของผู้ใช้งานทุกคน”',
    category: 'สิ่งแวดล้อม & สุขภาวะ',
  },
  {
    num: '11',
    icon: '🛍️',
    title: 'ตลาดนัดนักเรียน (Student Market)',
    hook: 'จากพื้นที่เล็ก ๆ สู่ประสบการณ์จริง',
    detail:
      'เปิดพื้นที่สร้างสรรค์ให้นักเรียนได้แสดงความสามารถ ปล่อยไอเดีย และสร้างรายได้ระหว่างเรียน ส่งเสริมทักษะการเป็นผู้ประกอบการรุ่นใหม่ การคิดค้นผลิตภัณฑ์ และการทำงานร่วมกันอย่างเป็นระบบ — “จากพื้นที่เล็ก ๆ ในโรงเรียน สู่ประสบการณ์จริงเพื่อการเติบโตในอนาคต”',
    category: 'กิจกรรม & ผู้ประกอบการ',
  },
  {
    num: '12',
    icon: '🎓',
    title: 'กิจกรรมปัจฉิมนิเทศ ม.3 (The Next Step)',
    hook: 'เฉลิมฉลองความสำเร็จก่อนก้าวต่อไป',
    detail:
      'จัดกิจกรรมปัจฉิมนิเทศสุดอบอุ่นสำหรับนักเรียนชั้น ม.3 เพื่อเฉลิมฉลองความสำเร็จในการศึกษาภาคบังคับ รวบรวมความทรงจำดี ๆ ก่อนก้าวสู่เส้นทางใหม่ ไม่ว่าจะเลือกเรียนต่อในสายสามัญ สายอาชีพ หรือเส้นทางตามความฝัน',
    category: 'กิจกรรม ม.3',
  },
];

/** First three policies — shown on homepage “ชูนโยบายเด่น”. */
const HIGHLIGHT_POLICIES = POLICIES.slice(0, 3);

const IG_ACTIONS = `
  <div class="ig-card__actions" aria-hidden="true">
    <span class="ig-card__action ig-card__action--like">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.792 3.904A4.989 4.989 0 0 0 12 2.5a4.989 4.989 0 0 0-4.792 1.404A5.978 5.978 0 0 0 2.5 9.5c0 3.042 1.135 5.824 3.7 7.963l6.3 5.537 6.3-5.537c2.565-2.139 3.7-4.921 3.7-7.963a5.978 5.978 0 0 0-2.708-5.596z"/></svg>
    </span>
    <span class="ig-card__action">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
    </span>
    <span class="ig-card__action">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    </span>
    <span class="ig-card__action ig-card__action--save">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    </span>
  </div>
`;

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildCard(policy) {
  return `
    <article class="ig-card" data-policy="${policy.num}" tabindex="0" role="button" aria-expanded="false" aria-label="${escapeHtml(policy.title)} — แตะเพื่อดูรายละเอียด">
      <header class="ig-card__header">
        <img class="ig-card__avatar" src="image/icons and logos/logo.png" alt="" width="32" height="32">
        <span class="ig-card__user">momentum_party</span>
        <span class="ig-card__menu" aria-hidden="true">•••</span>
      </header>
      <div class="ig-card__media">
        <div class="ig-card__face">
          <span class="ig-card__num">${escapeHtml(policy.num)}</span>
          <span class="ig-card__emoji" aria-hidden="true">${policy.icon}</span>
          <h2 class="ig-card__title">${escapeHtml(policy.title)}</h2>
          <p class="ig-card__hook">${escapeHtml(policy.hook)}</p>
        </div>
        <div class="ig-card__overlay" aria-hidden="true">
          <p class="ig-card__detail">${escapeHtml(policy.detail)}</p>
          <span class="ig-card__category">${escapeHtml(policy.category)}</span>
          <span class="ig-card__close-hint" aria-hidden="true">✕</span>
        </div>
      </div>
      <footer class="ig-card__footer">
        ${IG_ACTIONS}
      </footer>
    </article>
  `;
}

function closeCard(card) {
  if (!card?.classList.contains('is-open')) return;
  card.classList.remove('is-open');
  card.setAttribute('aria-expanded', 'false');
  const overlay = card.querySelector('.ig-card__overlay');
  if (overlay) overlay.setAttribute('aria-hidden', 'true');
  card.querySelectorAll('.ig-card__detail, .ig-card__category, .ig-card__close-hint').forEach(el => {
    el.style.animation = 'none';
    el.style.opacity = '';
    el.style.transform = '';
  });
}

function openCard(card) {
  document.querySelectorAll('.ig-card.is-open').forEach(closeCard);
  card.classList.add('is-open');
  card.setAttribute('aria-expanded', 'true');
  const overlay = card.querySelector('.ig-card__overlay');
  if (overlay) overlay.setAttribute('aria-hidden', 'false');
}

function toggleCard(card) {
  if (card.classList.contains('is-open')) {
    closeCard(card);
  } else {
    openCard(card);
  }
}

function revealPolicyPage() {
  const page = document.querySelector('.policy-page');
  if (!page || page.classList.contains('is-loaded')) return;
  requestAnimationFrame(() => {
    page.classList.add('is-loaded');
  });
}

function revealHighlightPolicies() {
  const section = document.querySelector('.platform-highlight');
  if (!section || section.classList.contains('is-loaded')) return;
  requestAnimationFrame(() => {
    section.classList.add('is-loaded');
  });
}

function bindPolicyGrid(grid) {
  grid.querySelectorAll('.ig-card').forEach((card, i) => {
    card.style.setProperty('--i', i);
  });

  grid.addEventListener('click', e => {
    const card = e.target.closest('.ig-card');
    if (!card || !grid.contains(card)) return;
    toggleCard(card);
  });

  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.ig-card');
    if (!card || !grid.contains(card)) return;
    e.preventDefault();
    toggleCard(card);
  });
}

function initHighlightPolicies() {
  const grid = document.getElementById('platform-grid');
  if (!grid) return;

  grid.innerHTML = HIGHLIGHT_POLICIES.map(buildCard).join('');
  bindPolicyGrid(grid);
  revealHighlightPolicies();
}

function initPolicyCards() {
  const grid = document.getElementById('policy-grid');
  if (!grid) return;

  grid.innerHTML = POLICIES.map(buildCard).join('');
  bindPolicyGrid(grid);
  revealPolicyPage();
}

function initPolicyEscapeKey() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.ig-card.is-open').forEach(closeCard);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPolicyEscapeKey();
  initHighlightPolicies();
  initPolicyCards();
});
