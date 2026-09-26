// ==================== LOCK SCREEN SLIDER LOGIC ====================
const lockScreen = document.getElementById('lockScreen');
const mainContent = document.getElementById('mainContent');
const sliderThumb = document.getElementById('sliderThumb');
const sliderTrack = document.getElementById('sliderTrack');

let isDragging = false;
let thumbCurrentLeft = 4;
let isUnlocked = false;

// Получить максимальную позицию slider
function getMaxLeft() {
  if (!sliderTrack || !sliderThumb) return 0;

  const trackRect = sliderTrack.getBoundingClientRect();
  const thumbRect = sliderThumb.getBoundingClientRect();

  return trackRect.width - thumbRect.width - 4;
}

// Обновление позиции slider
function updateThumbPosition(clientX) {
  if (!sliderTrack || !sliderThumb || isUnlocked) return;

  const trackRect = sliderTrack.getBoundingClientRect();
  const thumbRect = sliderThumb.getBoundingClientRect();
  const maxLeft = getMaxLeft();

  let newLeft = clientX - trackRect.left - (thumbRect.width / 2);
  newLeft = Math.max(4, Math.min(newLeft, maxLeft));

  sliderThumb.style.left = newLeft + 'px';
  thumbCurrentLeft = newLeft;
}

// Разблокировка
function unlockScreen() {
  if (isUnlocked) return;
  isUnlocked = true;

  // vibration только после user gesture
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }

  sliderThumb.classList.add('shake');
  setTimeout(() => sliderThumb.classList.remove('shake'), 300);

  lockScreen.style.opacity = '0';

  setTimeout(() => {
    lockScreen.style.visibility = 'hidden';
    mainContent.classList.add('visible');

    const music = document.getElementById('bgMusic');
    if (music && music.paused) {
      music.play().catch(() => {});
    }

    const btn = document.getElementById('musicToggle');
    if (btn) btn.textContent = '▷';
  }, 1000);
}

// Pointer move
function onPointerMove(e) {
  if (!isDragging || isUnlocked) return;

  e.preventDefault();
  const clientX = e.clientX ?? e.touches?.[0]?.clientX;

  if (clientX) {
    updateThumbPosition(clientX);
  }
}

// Pointer up
function onPointerUp() {
  if (!isDragging) return;

  isDragging = false;

  const maxLeft = getMaxLeft();

  // если дотянул до конца
  if (thumbCurrentLeft >= maxLeft - 3) {
    unlockScreen();
  } else {
    // вернуть назад
    sliderThumb.style.transition = 'left 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
    sliderThumb.style.left = '4px';
    thumbCurrentLeft = 4;

    setTimeout(() => {
      sliderThumb.style.transition = '';
    }, 300);
  }

  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerup', onPointerUp);
  document.removeEventListener('touchmove', onPointerMove);
  document.removeEventListener('touchend', onPointerUp);
}

// Pointer down
function onPointerDown(e) {
  if (isUnlocked) return;

  e.preventDefault();
  isDragging = true;

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('touchmove', onPointerMove, { passive: false });
  document.addEventListener('touchend', onPointerUp);
}

// Events
if (sliderThumb) {
  sliderThumb.addEventListener('pointerdown', onPointerDown);
  sliderThumb.addEventListener('touchstart', onPointerDown, { passive: false });
  sliderThumb.addEventListener('dragstart', (e) => e.preventDefault());
}
// ==================== LUXURY TIMER & CALENDAR ====================
const targetDate = new Date(2026, 8, 28, 14, 0, 0);

function updateFlipClock() {
  const now = new Date();
  const diff = targetDate - now;
  
  if (diff <= 0) {
    document.getElementById('daysFlip').textContent = '0';
    document.getElementById('hoursFlip').textContent = '0';
    document.getElementById('minutesFlip').textContent = '0';
    document.getElementById('secondsFlip').textContent = '0';
    return;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60) % 24);
  const minutes = Math.floor(diff / (1000 * 60) % 60);
  const seconds = Math.floor(diff / 1000 % 60);
  
  const daysEl = document.getElementById('daysFlip');
  const hoursEl = document.getElementById('hoursFlip');
  const minutesEl = document.getElementById('minutesFlip');
  const secondsEl = document.getElementById('secondsFlip');
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  
  if (daysEl.textContent != days) {
    daysEl.style.transform = 'scale(1.05)';
    setTimeout(() => daysEl.style.transform = '', 200);
    daysEl.textContent = days;
  }
  if (hoursEl.textContent != hours) {
    hoursEl.style.transform = 'scale(1.05)';
    setTimeout(() => hoursEl.style.transform = '', 200);
    hoursEl.textContent = hours;
  }
  if (minutesEl.textContent != minutes) {
    minutesEl.style.transform = 'scale(1.05)';
    setTimeout(() => minutesEl.style.transform = '', 200);
    minutesEl.textContent = minutes;
  }
  if (secondsEl.textContent != seconds) {
    secondsEl.style.transform = 'scale(1.05)';
    setTimeout(() => secondsEl.style.transform = '', 200);
    secondsEl.textContent = seconds;
  }
}

function generateCalendar() {
  const year = 2026;
  const month = 8;
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const daysArray = [];
  let startOffset = startDay === 0 ? 6 : startDay - 1;
  
  for (let i = 0; i < startOffset; i++) {
    daysArray.push('');
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }
  
  const calendarContainer = document.getElementById('calendarDays');
  if (!calendarContainer) return;
  calendarContainer.innerHTML = '';
  daysArray.forEach(day => {
    const span = document.createElement('span');
    if (day === 28) {
      span.textContent = day;
      span.classList.add('active');
    } else if (day !== '') {
      span.textContent = day;
    } else {
      span.textContent = '';
    }
    calendarContainer.appendChild(span);
  });
}

setInterval(updateFlipClock, 1000);
updateFlipClock();
generateCalendar();

// ==================== ВАШ ОРИГИНАЛЬНЫЙ КОД ====================
const music = document.getElementById("bgMusic");
const btn = document.getElementById("musicToggle");
let isPlaying = false;

function tryAutoPlay() {
  if (!music || !btn || !mainContent) return;
  if (!isPlaying && mainContent.classList.contains('visible')) {
    music.play().catch(()=>{});
    isPlaying = true;
    btn.textContent = "▷";
  }
}

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (music.paused) {
    music.play();
    btn.textContent = "▷";
  } else {
    music.pause();
    btn.textContent = "❚❚";
  }
});

const translations = {
  ru: {
    lockinvited1: "ВАМ ПРИШЛО ПРИГЛАШЕНИЕ",
    names: "Shoxruxbek & Mahbubaxon",
    quote: "\"И Он объединил их сердца\"",
    source: "Al-Anfol, 63",
    slider1: "ОТКРЫТЬ",
    invitetop1: "Дорогие наши!",
    invitetop2: "Мы",
    invitetop3: "с радостью приглашаем вас",
    invitetop4: "на нашу свадьбу",
    dateheader1: "ДАТА",
    dateheader2: "ДО СВАДЬБЫ ОСТАЛОСЬ",
    dateheader3: "дней",
    dateheader4: "часов",
    dateheader5: "минут",
    dateheader6: "секунд",
    dateheader7: "СЕНТЯБРЬ 2026",
    dateheader8: "Пн",
    dateheader9: "Вт",
    dateheader10: "Ср",
    dateheader11: "Чт",
    dateheader12: "Пт",
    dateheader13: "Сб",
    dateheader14: "Вс",
    dateheader15: "НАЧАЛО В 14:00",
    timeline1: "ПРОГРАММА",
    timeline2: "СБОР ГОСТЕЙ",
    timeline3: "ЦЕРЕМОНИЯ",
    timeline4: "БАНКЕТ",
    timeline5: "ЗАВЕРШЕНИЕ",
    venueheader1: "МЕСТО ПРОВЕДЕНИЯ",
    venueheader2: "Orzu",
    venueheader3: "Самаркандская область, Каттакурганский район, Orzu to'yxonasi",
    venueheader4: "Открыть на карте",
    venueheader5: "Будем рады видеть вас!",
    route1: "Маршрут Google",
    route2: "Маршрут Google",
    route3: "♡ Добро пожаловать ♡",
    rsvp1: "Подтвердите свое присутствие",
    rsvp2: "Будьте с нами",
    rsvp3: "Имя гостя",
    rsvp4: "Количество гостей",
    rsvp5: "от 1 до 5 гостей",
    rsvp6: "Вы придете на свадьбу?",
    rsvp7: "Да, с удовольствием",
    rsvp8: "К сожалению, не смогу прийти",
    rsvp9: "Комментарий (необязательно)",
    rsvp10: "Отправить",
    rsvp11: "*Обязательные поля",
    invitetop5: "ВАШЕ ПРИСУТСТВИЕ",
    invitetop6: "Самый важный подарок",
    invitetop7: "для нас!"
  },
  en: {
    lockinvited1: "YOU HAVE RECEIVED AN INVITATION",
    names: "Shoxruxbek & Mahbubaxon",
    quote: "\"And He united their hearts\"",
    source: "Al-Anfal, 63",
    slider1: "UNLOCK",
    invitetop1: "Dear loved ones!",
    invitetop2: "We",
    invitetop3: "are delighted to invite",
    invitetop4: "you to our wedding",
    dateheader1: "DATE",
    dateheader2: "TIME REMAINING UNTIL THE WEDDING",
    dateheader3: "days",
    dateheader4: "hours",
    dateheader5: "minutes",
    dateheader6: "seconds",
    dateheader7: "SEPTEMBER 2026",
    dateheader8: "Mon",
    dateheader9: "Tue",
    dateheader10: "Wed",
    dateheader11: "Thu",
    dateheader12: "Fri",
    dateheader13: "Sat",
    dateheader14: "Sun",
    dateheader15: "START AT 14:00",
    timeline1: "SCHEDULE",
    timeline2: "GUEST ARRIVAL",
    timeline3: "CEREMONY",
    timeline4: "BANQUET",
    timeline5: "END OF THE EVENING",
    venueheader1: "VENUE",
    venueheader2: "Orzu",
    venueheader3: "Samarqand viloyati, Kattaqo'rg'on tumani, Orzu to'yxonasi",
    venueheader4: "Open on the map",
    venueheader5: "We will be happy to see you!",
    route1: "Google Route",
    route2: "Google Route",
    route3: "? Welcome ?",
    rsvp1: "Please confirm your attendance",
    rsvp2: "Be with us",
    rsvp3: "Guest name",
    rsvp4: "Number of guests",
    rsvp5: "from 1 to 5 guests",
    rsvp6: "Will you attend the wedding?",
    rsvp7: "Yes, with pleasure",
    rsvp8: "Unfortunately, I cannot attend",
    rsvp9: "Comment (optional)",
    rsvp10: "Send",
    rsvp11: "*Required fields",
    invitetop5: "YOUR PRESENCE",
    invitetop6: "The most important gift",
    invitetop7: "for us!"
  },
  uz: {
    lockinvited1: "SIZGA TAKLIFNOMA KELDI",
    names: "Shoxruxbek & Mahbubaxon",
    quote: "\"Va U ularning qalblarini birlashtirdi\"",
    source: "Al-Anfol, 63",
    slider1: "OCHISH",
    invitetop1: "Qadrli azizlarimiz!",
    invitetop2: "Biz",
    invitetop3: "sizlarni to'yimizga taklif",
    invitetop4: "etishdan juda xursandmiz",
    dateheader1: "SANA",
    dateheader2: "TO'YGACHA QOLGAN VAQT",
    dateheader3: "kun",
    dateheader4: "soat",
    dateheader5: "daqiqa",
    dateheader6: "soniya",
    dateheader7: "SENTYABR 2026",
    dateheader8: "Du",
    dateheader9: "Se",
    dateheader10: "Ch",
    dateheader11: "Pa",
    dateheader12: "Ju",
    dateheader13: "Sh",
    dateheader14: "Ya",
    dateheader15: "BOSHLANISHI 14:00 DA",
    timeline1: "DASTUR",
    timeline2: "MEHMONLAR YIG'ILISHI",
    timeline3: "MAROSIM",
    timeline4: "BAYRAM DASTURXONI",
    timeline5: "YAKUNI",
    venueheader1: "O'TKAZILISH JOYI",
    venueheader2: "Orzu",
    venueheader3: "Samarqand viloyati, Kattaqo'rg'on tumani, Orzu to'yxonasi",
    venueheader4: "Xaritada ochish",
    venueheader5: "Sizni ko'rishdan xursand bo'lamiz!",
    route1: "Google xaritasi",
    route2: "Google xaritasi",
    route3: "? Xush kelibsiz ?",
    rsvp1: "Ishtirokingizni tasdiqlang",
    rsvp2: "Biz bilan birga bo'ling",
    rsvp3: "Mehmon ismi",
    rsvp4: "Mehmonlar soni",
    rsvp5: "1 dan 5 tagacha mehmon",
    rsvp6: "To'yga kelasizmi?",
    rsvp7: "Ha, mamnuniyat bilan",
    rsvp8: "Afsuski, kela olmayman",
    rsvp9: "Izoh (ixtiyoriy)",
    rsvp10: "Yuborish",
    rsvp11: "*Majburiy maydonlar",
    invitetop5: "SIZNING ISHTIROKINGIZ",
    invitetop6: "Biz uchun",
    invitetop7: "eng muhim sovg'a!"
  },
  uz_cy: {
    lockinvited1: "СИЗГА ТАКЛИФНОМА КЕЛДИ",
    names: "Shoxruxbek & Mahbubaxon",
    quote: "\"Va U ularning qalblarini birlashtirdi\"",
    source: "Ал-Анфол, 63",
    slider1: "ОЧИШ",
    invitetop1: "Қадрли азизларимиз!",
    invitetop2: "Биз",
    invitetop3: "сизларни тўйимизга таклиф",
    invitetop4: "этишдан жуда хурсандмиз",
    dateheader1: "САНА",
    dateheader2: "ТЎЙГАЧА ҚОЛГАН ВАҚТ",
    dateheader3: "кун",
    dateheader4: "соат",
    dateheader5: "дақиқа",
    dateheader6: "сония",
    dateheader7: "СЕНТЯБРЬ 2026",
    dateheader8: "Ду",
    dateheader9: "Се",
    dateheader10: "Чо",
    dateheader11: "Па",
    dateheader12: "Жу",
    dateheader13: "Ша",
    dateheader14: "Як",
    dateheader15: "БОШЛАНИШИ 14:00 ДА",
    timeline1: "ДАСТУР",
    timeline2: "МЕҲМОНЛАР ЙИҒИЛИШИ",
    timeline3: "МАРОСИМ",
    timeline4: "БАЙРАМ ДАСТУРХОНИ",
    timeline5: "ЯКУНИ",
    venueheader1: "ЎТКАЗИЛИШ ЖОЙИ",
    venueheader2: "Orzu",
    venueheader3: "Самарқанд вилояти, Каттақўрғон тумани, Orzu to'yxonasi",
    venueheader4: "Харитада очиш",
    venueheader5: "Сизни кўришдан хурсанд бўламиз!",
    route1: "Google харитаси",
    route2: "Google харитаси",
    route3: "♡ Хуш келибсиз ♡",
    rsvp1: "Иштирокингизни тасдиқланг",
    rsvp2: "Биз билан бирга бўлинг",
    rsvp3: "Меҳмон исми",
    rsvp4: "Меҳмонлар сони",
    rsvp5: "1 дан 5 тагача меҳмон",
    rsvp6: "Тўйга келасизми?",
    rsvp7: "Ҳа, мамнуният билан",
    rsvp8: "Афсуски, кела олмайман",
    rsvp9: "Изоҳ (ихтиёрий)",
    rsvp10: "Юбориш",
    rsvp11: "*Мажбурий майдонлар",
    invitetop5: "СИЗНИНГ ИШТИРОКИНГИЗ",
    invitetop6: "Биз учун",
    invitetop7: "энг муҳим совға!"
  }
};

function detectLang() {
  const saved = localStorage.getItem("lang");
  if (saved) return saved;
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.includes("ru")) return "ru";
  if (browserLang.includes("uz")) return "uz";
  if (browserLang.includes("en")) return "en";
  return "uz";
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  document.querySelectorAll("#langSwitcher button").forEach(btn => btn.style.opacity = "0.5");
  const activeBtn = document.querySelector(`#langSwitcher button[onclick="setLang('${lang}')"]`);
  if (activeBtn) activeBtn.style.opacity = "1";
}

window.addEventListener("DOMContentLoaded", () => {
  const lang = detectLang();
  setLang(lang);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
      entry.target.querySelector('.invite-bg').style.transform = "scale(1)";
    }
  });
}, { threshold: 0.4 });

setTimeout(() => {
  const section = document.getElementById('inviteSection');
  if (section) observer.observe(section);
  const section2 = document.getElementById('inviteSection2');
  if (section2) observer.observe(section2);
}, 500);

const mainContentObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'class' && mainContent.classList.contains('visible')) {
      const section = document.getElementById('inviteSection');
      if (section) observer.observe(section);
    }
  });
});
mainContentObserver.observe(mainContent, { attributes: true });

// Параллакс эффект для фона (движение при движении мыши)
(function initParallax() {
  const section = document.querySelector('.venue-section');
  if (!section) return;
  
  section.classList.add('parallax-active');
  
  const handleMouseMove = (e) => {
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    const moveX = x * 15;
    const moveY = y * 15;
    
    const pseudo = window.getComputedStyle(section, '::before');
    section.style.setProperty('--parallax-x', `${moveX}px`);
    section.style.setProperty('--parallax-y', `${moveY}px`);
  };
  
  section.addEventListener('mousemove', handleMouseMove);
  section.addEventListener('touchmove', (e) => {
    if (e.touches.length) {
      const rect = section.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
      const y = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
      const moveX = x * 10;
      const moveY = y * 10;
      section.style.setProperty('--parallax-x', `${moveX}px`);
      section.style.setProperty('--parallax-y', `${moveY}px`);
    }
  });
})();

// Добавляем стиль для параллакса динамически
const style = document.createElement('style');
style.textContent = `
  .venue-section::before {
    transform: translate(var(--parallax-x, 0px), var(--parallax-y, 0px));
  }
`;
document.head.appendChild(style);

 // Добавляем небольшую интерсекцию для плавного появления элементов при скролле (плюс динамика)
  // ==================== ANIMATION OBSERVER ====================

const animatedElements = document.querySelectorAll('.animate-up');

const observer1 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.2 });

// изначально ставим паузу и подключаем observer
animatedElements.forEach(el => {
  el.style.animationPlayState = 'paused';
  observer1.observe(el);
});


// ==================== PARALLAX EFFECT ====================

const section = document.querySelector('.location-winner-section');

if (section) {
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const moveX = (x - 0.5) * 8;
    const moveY = (y - 0.5) * 8;

    section.style.setProperty('--mouse-x', moveX + 'px');
    section.style.setProperty('--mouse-y', moveY + 'px');
  });
}


// ==================== DYNAMIC STYLE FOR PARALLAX ====================

const styleDynamic = document.createElement('style');

styleDynamic.textContent = `
  .location-winner-section::after {
    transform: translate(var(--mouse-x, 0px), var(--mouse-y, 0px));
    transition: transform 0.1s ease-out;
  }
`;

document.head.appendChild(styleDynamic);

// ==================== RSVP СЕКЦИЯ — ПОЛНЫЙ ФУНКЦИОНАЛ ====================
  // ==================== AJAX RSVP + ТАБЛИЦА ГОСТЕЙ ====================
// Добавьте этот код в конец тега 

// ==================== RSVP ФУНКЦИОНАЛ ====================
// Глобальные переменные
let currentGuests = 1;
const MAX_GUESTS = 5;
const MIN_GUESTS = 1;

// Получаем элементы
const guestNameInput = document.getElementById('guestName');
const commentArea = document.getElementById('comment');
const decrementBtn = document.getElementById('decrementGuest');
const incrementBtn = document.getElementById('incrementGuest');
const guestValueSpan = document.getElementById('guestValue');
const attendingRadios = document.querySelectorAll('input[name="attending"]');
const radioOptions = document.querySelectorAll('.radio-option');
const rsvpForm = document.getElementById('rsvpForm');

// Функция валидации формы
function validateForm() {
    const guestName = guestNameInput?.value.trim();
    if (!guestName) {
        showToast('❌ Пожалуйста, введите ваше имя', 3000);
        guestNameInput?.focus();
        return false;
    }
    
    const attendingValue = document.querySelector('input[name="attending"]:checked')?.value;
    if (!attendingValue) {
        showToast('❌ Iltimos, to‘yga kelasizmi, shuni ko‘rsating.', 3000);
        return false;
    }
    
    return true;
}

// Функция показа уведомлений
function showToast(message, duration = 3000) {
    let toast = document.querySelector('.toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-message';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Инициализация счетчика гостей
function initGuestCounter() {
    if (decrementBtn && incrementBtn && guestValueSpan) {
        decrementBtn.addEventListener('click', () => {
            if (currentGuests > MIN_GUESTS) {
                currentGuests--;
                guestValueSpan.textContent = currentGuests;
            } else {
                decrementBtn.style.opacity = '0.5';
                setTimeout(() => { decrementBtn.style.opacity = '1'; }, 200);
            }
        });
        
        incrementBtn.addEventListener('click', () => {
            if (currentGuests < MAX_GUESTS) {
                currentGuests++;
                guestValueSpan.textContent = currentGuests;
            } else {
                incrementBtn.style.opacity = '0.5';
                setTimeout(() => { incrementBtn.style.opacity = '1'; }, 200);
            }
        });
    }
}

// Инициализация радио кнопок
function initRadioButtons() {
    radioOptions.forEach(option => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                radioOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            }
        });
    });
}

// Обработчик отправки формы
async function handleSubmit(e) {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;
    
    const guestName = guestNameInput?.value.trim() || '';
    const attendingValue = document.querySelector('input[name="attending"]:checked')?.value;
    const comment = commentArea?.value.trim() || '';
    
    const formData = {
        guestName: guestName,
        numberOfGuests: currentGuests,
        willAttend: attendingValue === 'yes',
        comment: comment
    };
    
    // Эффект загрузки на кнопке
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>⌛</span><span>Yuborilmoqda...</span>';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('api_save_rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Обновляем таблицу с новыми данными
            await loadGuestsData();
            
            // Анимация успеха
            const card = document.querySelector('.rsvp-card');
            if (card) {
                card.style.transform = 'scale(0.99)';
                setTimeout(() => { if(card) card.style.transform = ''; }, 200);
            }
            
            let toastMsg = `💫 ${guestName}, Rahmat! `;
            if (attendingValue === 'yes') {
                toastMsg += `${currentGuests > 1 ? 'Sizni va mehmonlaringizni kutib qolamiz.' : ''}! ❤️`;
                // Сброс формы только при успешной отправке
                if (guestNameInput) guestNameInput.value = '';
                if (commentArea) commentArea.value = '';
                currentGuests = 1;
                if (guestValueSpan) guestValueSpan.textContent = '1';
                // Сброс радио кнопок
                if (attendingRadios) {
                    attendingRadios.forEach(radio => radio.checked = false);
                    radioOptions.forEach(opt => opt.classList.remove('selected'));
                }
            } else {
                toastMsg += `Juda afsusdamiz. Sizni sog‘inib qolamiz. 🌹`;
                if (guestNameInput) guestNameInput.value = '';
                if (commentArea) commentArea.value = '';
                if (attendingRadios) {
                    attendingRadios.forEach(radio => radio.checked = false);
                    radioOptions.forEach(opt => opt.classList.remove('selected'));
                }
            }
            showToast(toastMsg, 3000);
            
        } else {
            showToast(`❌ Ошибка: ${result.message || 'Попробуйте позже'}`, 3000);
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        showToast('❌ Ошибка соединения с сервером', 3000);
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

// Загрузка данных из БД при загрузке страницы
async function loadGuestsData() {
    try {
        const response = await fetch('api_get_guests');
        const data = await response.json();
        
        if (data.success) {
            updateTableAndStats(data.guests);
        }
    } catch (error) {
        console.error('Ошибка загрузки гостей:', error);
    }
}

// Обновление таблицы и статистики
function updateTableAndStats(guests) {
    const tbody = document.getElementById('guestsTableBody');
    if (!tbody) return;
    
    if (!guests || guests.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Hali hech qanday ma\'lumot yo\'q. Birinchi bo\'lib RSVP qoldiring!</td></tr>';
        document.getElementById('totalGuests').textContent = '0';
        document.getElementById('acceptedGuests').textContent = '0';
        document.getElementById('declinedGuests').textContent = '0';
        return;
    }
    
    let totalGuestsCount = 0;
    let acceptedCount = 0;
    let declinedCount = 0;
    
    let html = '';
    guests.forEach((guest, index) => {
        const willAttend = guest.will_attend == 1;
        const guestCount = willAttend ? (parseInt(guest.guests_count) || 1) : 1;
        
        totalGuestsCount += guestCount;
        if (willAttend) acceptedCount++;
        else declinedCount++;
        
        const statusClass = willAttend ? 'status-yes' : 'status-no';
        const statusText = willAttend ? 'Keladi' : 'Kela olmaydi';
        const timeFormatted = new Date(guest.created_at).toLocaleString('uz-UZ');
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(guest.guest_name)}</strong></td>
                <td>${willAttend ? guestCount : '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td class="comment-preview" title="${escapeHtml(guest.comment || '')}">${escapeHtml(guest.comment || '-')}</td>
                <td style="font-size: 11px; color: rgba(255,255,255,0.5);">${timeFormatted}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    document.getElementById('totalGuests').textContent = totalGuestsCount;
    document.getElementById('acceptedGuests').textContent = acceptedCount;
    document.getElementById('declinedGuests').textContent = declinedCount;
}

// Защита от XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initGuestCounter();
    initRadioButtons();
    loadGuestsData();
    
    // Добавляем обработчик формы
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleSubmit);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const footerTrigger = document.querySelector('.rsvp11');
    const guestSection = document.getElementById('rsvp11');
    
    let clickCount = 0;
    let lastClickTime = 0;

    const PASSWORD = "0505"; // ← задай свой пароль

    if (footerTrigger && guestSection) {
        footerTrigger.addEventListener('click', () => {
            const currentTime = new Date().getTime();
            
            if (currentTime - lastClickTime > 1500) {
                clickCount = 0;
            }
            
            clickCount++;
            lastClickTime = currentTime;

            if (clickCount === 3) {
                
                const userPassword = prompt("Parolni kiriting:");

                if (userPassword === PASSWORD) {
                    // переключение видимости
                    if (guestSection.style.display === 'flex') {
                        guestSection.style.display = 'none';
                    } else {
                        guestSection.style.display = 'flex';
                    }
                } else {
                    alert("Parol noto‘g‘ri ❌");
                }

                clickCount = 0;

            }
        });
    }
});
