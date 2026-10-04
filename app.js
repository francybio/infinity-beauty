/* ==========================================================
   INFINITYbeauty · Endospheres — interacciones
   ========================================================== */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = t => 1 - Math.pow(1 - t, 3);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
if (!hasGSAP || reduced) document.documentElement.classList.add('reduced');
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

/* ----------------------------------------------------------
   DATOS DEL NEGOCIO
   ---------------------------------------------------------- */
const WA_NUMBER = '34647707970';
// minutos desde medianoche · 0 = domingo
const HOURS = { 0: [630, 960], 1: [510, 1260], 2: [510, 1260], 3: [510, 1260], 4: [510, 1260], 5: [510, 1260], 6: [600, 1200] };

/* ----------------------------------------------------------
   TEXTOS DINÁMICOS
   ---------------------------------------------------------- */
const STR = {
  es: {
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    open: t => `Abierto ahora · hasta las ${t}`,
    closedToday: t => `Cerrado · abre hoy a las ${t}`,
    closedTomorrow: t => `Cerrado · abre mañana a las ${t}`,
    closedDay: (d, t) => `Cerrado · abre el ${STR.es.days[d].toLowerCase()} a las ${t}`,
    closed: 'Cerrado',
    wa: 'Hola INFINITYbeauty, me gustaría reservar una valoración.',
    waTreat: n => `Hola INFINITYbeauty, me gustaría reservar: ${n}.`,
    waPlan: (r, z, g) => `Hola INFINITYbeauty, este es mi plan:\n• ${r.join('\n• ')}${z ? `\nZonas: ${z}` : ''}${g ? `\nObjetivos: ${g}` : ''}\n¿Podemos agendar una valoración?`,
    planEmpty: ['Toca una zona o un objetivo.', 'Tu protocolo orientativo aparecerá aquí al instante.'],
    more: 'Ver', drag: 'Arrastra', micro: 'Micro'
  },
  en: {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    open: t => `Open now · until ${t}`,
    closedToday: t => `Closed · opens today at ${t}`,
    closedTomorrow: t => `Closed · opens tomorrow at ${t}`,
    closedDay: (d, t) => `Closed · opens ${STR.en.days[d]} at ${t}`,
    closed: 'Closed',
    wa: 'Hi INFINITYbeauty, I’d like to book a consultation.',
    waTreat: n => `Hi INFINITYbeauty, I’d like to book: ${n}.`,
    waPlan: (r, z, g) => `Hi INFINITYbeauty, here is my plan:\n• ${r.join('\n• ')}${z ? `\nAreas: ${z}` : ''}${g ? `\nGoals: ${g}` : ''}\nCan we schedule a consultation?`,
    planEmpty: ['Tap an area or a goal.', 'Your indicative protocol will appear here instantly.'],
    more: 'View', drag: 'Drag', micro: 'Micro'
  },
  ru: {
    days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    daysAcc: ['в воскресенье', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу'],
    open: t => `Открыто · до ${t}`,
    closedToday: t => `Закрыто · откроется сегодня в ${t}`,
    closedTomorrow: t => `Закрыто · откроется завтра в ${t}`,
    closedDay: (d, t) => `Закрыто · откроется ${STR.ru.daysAcc[d]} в ${t}`,
    closed: 'Закрыто',
    wa: 'Здравствуйте, INFINITYbeauty! Хочу записаться на консультацию.',
    waTreat: n => `Здравствуйте, INFINITYbeauty! Хочу записаться: ${n}.`,
    waPlan: (r, z, g) => `Здравствуйте, INFINITYbeauty! Мой план:\n• ${r.join('\n• ')}${z ? `\nЗоны: ${z}` : ''}${g ? `\nЦели: ${g}` : ''}\nМожно записаться на консультацию?`,
    planEmpty: ['Выберите зону или цель.', 'Ориентировочный протокол появится здесь сразу.'],
    more: 'Ещё', drag: 'Тяните', micro: 'Микро'
  }
};

const IMG = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
const TREATS = {
  body: { img: IMG('1741522509438-a120c0bb5e88'),
    es: { tag: 'Corporal', t: 'Endospheres Body', d: 'La microvibración compresiva de sus 55 esferas trabaja la celulitis, la retención de líquidos y la flacidez, activando la microcirculación y el drenaje linfático. Se siente como un masaje profundo, sin agujas ni tiempo de recuperación.', l: ['Celulitis y piel de naranja', 'Retención de líquidos y piernas cansadas', 'Tonificación y remodelación de la silueta'], p: 'Protocolo orientativo: desde 12 sesiones, 1–2 por semana.' },
    en: { tag: 'Body', t: 'Endospheres Body', d: 'The compressive microvibration of its 55 spheres works on cellulite, fluid retention and laxity, boosting microcirculation and lymphatic drainage. It feels like a deep massage — no needles, no downtime.', l: ['Cellulite and orange-peel skin', 'Fluid retention and tired legs', 'Toning and body contouring'], p: 'Indicative protocol: from 12 sessions, 1–2 per week.' },
    ru: { tag: 'Тело', t: 'Endospheres Body', d: 'Компрессионная микровибрация 55 сфер работает с целлюлитом, задержкой жидкости и дряблостью кожи, активируя микроциркуляцию и лимфодренаж. Ощущается как глубокий массаж — без игл и периода восстановления.', l: ['Целлюлит и «апельсиновая корка»', 'Отёки и усталость ног', 'Тонус и моделирование силуэта'], p: 'Ориентировочно: от 12 сеансов, 1–2 раза в неделю.' } },
  face: { img: IMG('1643684391140-c5056cfd3436'),
    es: { tag: 'Facial', t: 'Endospheres Face', d: 'Un manípulo específico con micro-esferas trabaja el rostro con delicadeza: activa la microcirculación, descongestiona y mejora la firmeza y la luminosidad de la piel.', l: ['Líneas de expresión y firmeza', 'Contorno facial y papada', 'Piel más luminosa y descongestionada'], p: 'Protocolo orientativo: desde 12 sesiones, 1 por semana.' },
    en: { tag: 'Face', t: 'Endospheres Face', d: 'A dedicated handpiece with micro-spheres works the face gently: it boosts microcirculation, de-puffs and improves firmness and radiance.', l: ['Expression lines and firmness', 'Facial contour and double chin', 'Brighter, de-puffed skin'], p: 'Indicative protocol: from 12 sessions, once a week.' },
    ru: { tag: 'Лицо', t: 'Endospheres Face', d: 'Специальная насадка с микросферами бережно работает с лицом: активирует микроциркуляцию, снимает отёчность, повышает упругость и сияние кожи.', l: ['Мимические морщины и упругость', 'Овал лица и второй подбородок', 'Сияющая, отдохнувшая кожа'], p: 'Ориентировочно: от 12 сеансов, 1 раз в неделю.' } },
  laser: { img: IMG('1700760933574-9f0f4ea9aa3b'),
    es: { tag: 'Depilación', t: 'Láser diodo', d: 'Depilación con láser de diodo para una reducción progresiva y duradera del vello. Sesiones rápidas y cómodas, adaptadas a tu tipo de piel y a cada zona.', l: ['Piernas, axilas, ingles y rostro', 'Sesiones rápidas y cómodas', 'Protocolo adaptado a tu fototipo'], p: 'Protocolo orientativo: 6–8 sesiones, cada 4–6 semanas.' },
    en: { tag: 'Hair removal', t: 'Diode laser', d: 'Diode laser hair removal for a progressive, long-lasting reduction of hair. Quick, comfortable sessions adapted to your skin type and each area.', l: ['Legs, underarms, bikini and face', 'Quick, comfortable sessions', 'Protocol tailored to your skin type'], p: 'Indicative protocol: 6–8 sessions, every 4–6 weeks.' },
    ru: { tag: 'Эпиляция', t: 'Диодный лазер', d: 'Эпиляция диодным лазером для постепенного и долговременного удаления волос. Быстрые и комфортные сеансы с учётом типа кожи и зоны.', l: ['Ноги, подмышки, бикини и лицо', 'Быстрые и комфортные сеансы', 'Протокол под ваш фототип'], p: 'Ориентировочно: 6–8 сеансов каждые 4–6 недель.' } },
  preso: { img: IMG('1587179790059-5f5d937fb87d'),
    es: { tag: 'Drenaje', t: 'Presoterapia', d: 'Compresión neumática secuencial que favorece el retorno venoso y el drenaje linfático. Ideal para combinar con Endospheres y potenciar sus resultados.', l: ['Sensación inmediata de ligereza', 'Ayuda a reducir la retención de líquidos', 'El complemento perfecto para el cuerpo'], p: 'Protocolo orientativo: 8–10 sesiones, 2 por semana.' },
    en: { tag: 'Drainage', t: 'Pressotherapy', d: 'Sequential pneumatic compression that supports venous return and lymphatic drainage. Ideal combined with Endospheres to enhance results.', l: ['Instant feeling of lightness', 'Helps reduce fluid retention', 'The perfect body add-on'], p: 'Indicative protocol: 8–10 sessions, twice a week.' },
    ru: { tag: 'Дренаж', t: 'Прессотерапия', d: 'Последовательная пневматическая компрессия улучшает венозный отток и лимфодренаж. Идеально сочетается с Endospheres и усиливает результат.', l: ['Мгновенная лёгкость', 'Помогает уменьшить отёки', 'Идеальное дополнение для тела'], p: 'Ориентировочно: 8–10 сеансов, 2 раза в неделю.' } },
  facial: { img: IMG('1570172619644-dfd03ed5d881'),
    es: { tag: 'Facial', t: 'Tratamientos faciales', d: 'Limpiezas faciales profundas, tratamientos para pieles con acné e hidratación intensiva. Cada protocolo empieza con un diagnóstico de tu piel.', l: ['Limpieza facial profunda', 'Tratamiento para piel con acné', 'Hidratación y luminosidad'], p: 'Recomendado: una sesión y mantenimiento mensual.' },
    en: { tag: 'Face', t: 'Facial treatments', d: 'Deep facial cleansing, treatments for acne-prone skin and intensive hydration. Every protocol starts with a skin diagnosis.', l: ['Deep facial cleansing', 'Acne-prone skin treatment', 'Hydration and glow'], p: 'Recommended: one session plus monthly maintenance.' },
    ru: { tag: 'Лицо', t: 'Уход за лицом', d: 'Глубокая чистка лица, уход за проблемной кожей и интенсивное увлажнение. Каждый протокол начинается с диагностики кожи.', l: ['Глубокая чистка лица', 'Уход при акне', 'Увлажнение и сияние'], p: 'Рекомендуется: один сеанс и ежемесячный уход.' } },
  lashes: { img: IMG('1639629509821-c54cdd984227'),
    es: { tag: 'Mirada', t: 'Extensiones de pestañas', d: 'Extensiones aplicadas pelo a pelo para una mirada definida y natural, o con más volumen si lo prefieres. Diseño personalizado según la forma de tus ojos.', l: ['Efecto natural o volumen', 'Diseño según tu mirada', 'Retoques de mantenimiento'], p: 'Mantenimiento: retoque cada 2–3 semanas.' },
    en: { tag: 'Eyes', t: 'Lash extensions', d: 'Lash-by-lash extensions for a defined, natural look — or more volume if you prefer. Custom design based on your eye shape.', l: ['Natural or volume effect', 'Designed for your eyes', 'Maintenance refills'], p: 'Maintenance: refill every 2–3 weeks.' },
    ru: { tag: 'Взгляд', t: 'Наращивание ресниц', d: 'Поресничное наращивание для чёткого и естественного взгляда — или больше объёма, если хотите. Дизайн подбирается под форму глаз.', l: ['Натуральный эффект или объём', 'Дизайн под ваш взгляд', 'Регулярная коррекция'], p: 'Коррекция каждые 2–3 недели.' } },
  nails: { img: IMG('1610992015762-45dca7fa3a85'),
    es: { tag: 'Manos', t: 'Manicura', d: 'Manicura con acabados limpios y duraderos, del nude más elegante al color que te apetezca.', l: ['Manicura y esmaltado', 'Acabados nude y de color', 'Cuidado de cutículas y manos'], p: '' },
    en: { tag: 'Hands', t: 'Manicure', d: 'Manicures with clean, long-lasting finishes — from the most elegant nude to any colour you fancy.', l: ['Manicure and polish', 'Nude and colour finishes', 'Cuticle and hand care'], p: '' },
    ru: { tag: 'Руки', t: 'Маникюр', d: 'Маникюр с аккуратным и стойким покрытием — от элегантного нюда до любого цвета.', l: ['Маникюр и покрытие', 'Нюдовые и цветные оттенки', 'Уход за кутикулой и руками'], p: '' } },
  makeup: { img: IMG('1704621354138-e124277356f2'),
    es: { tag: 'Ocasiones', t: 'Maquillaje', d: 'Maquillaje profesional para eventos, celebraciones o sesiones de fotos, adaptado a tu rostro y a la luz del momento.', l: ['Eventos y celebraciones', 'Looks de día y de noche', 'Sesiones de fotos'], p: '' },
    en: { tag: 'Occasions', t: 'Make-up', d: 'Professional make-up for events, celebrations or photo shoots, adapted to your features and the light of the moment.', l: ['Events and celebrations', 'Day and evening looks', 'Photo shoots'], p: '' },
    ru: { tag: 'Особые случаи', t: 'Макияж', d: 'Профессиональный макияж для мероприятий, праздников и фотосессий — с учётом черт лица и освещения.', l: ['Мероприятия и праздники', 'Дневной и вечерний образ', 'Фотосессии'], p: '' } }
};

/* ----------------------------------------------------------
   TRADUCCIONES DE LA PÁGINA (ES = HTML original)
   ---------------------------------------------------------- */
const I18N = {
  en: {
    'nav.treat': 'Treatments', 'nav.plan': 'Your plan', 'nav.reviews': 'Reviews', 'nav.contact': 'Contact',
    'cta.book': 'Book', 'cta.bookLong': 'Book a consultation', 'cta.discover': 'Discover Endospheres', 'cta.bookThis': 'Book this treatment',
    'hero.l1': 'Visible results', 'hero.l2': 'from the <em class="gold-text">very first session</em>.',
    'hero.lead': 'Professional face and body treatments in Lloret de Mar. Endospheres technology, diode laser and pressotherapy, with care you’ll remember.',
    'hero.reviews': '71 Google reviews', 'hero.scroll': 'Scroll',
    'band.laser': 'Diode laser', 'band.preso': 'Pressotherapy', 'band.facial': 'Facial', 'band.lashes': 'Lashes', 'band.nails': 'Manicure',
    'endo.kicker': 'Italian technology',
    'endo.lead': 'Compressive microvibration: a cylinder of silicone spheres arranged in a honeycomb that works the tissues in depth. No needles, no pain — just the feeling of a deep massage.',
    'endo.body': 'Body', 'endo.face': 'Face', 'endo.spheres': 'Spheres', 'endo.level': 'Level', 'endo.intensity': 'Intensity', 'endo.drag': 'Drag to rotate', 'endo.note': 'Illustrative visualisation',
    'endo.s1': 'silicone spheres in a honeycomb pattern (body handpiece)', 'endo.s2': 'combined action: compression + microvibration', 'endo.s3': 'patented technology, designed in Italy', 'endo.s4': 'needles · non-invasive treatment',
    'endo.bTitle': 'What it works on',
    'endo.b1': 'Cellulite', 'endo.b1d': 'Smooths orange-peel skin and refines texture.',
    'endo.b2': 'Fluid retention', 'endo.b2d': 'Stimulates lymphatic drainage: lighter legs.',
    'endo.b3': 'Microcirculation', 'endo.b3d': 'Boosts circulation and tissue oxygenation.',
    'endo.b4': 'Toning', 'endo.b4d': 'Helps restore firmness and muscle tone.',
    'endo.b5': 'Contouring', 'endo.b5d': 'Progressively redefines your silhouette.',
    'endo.b6': 'Facial firmness', 'endo.b6d': 'With the face handpiece: contour, glow and expression lines.',
    'steps.title': 'Your session, step by step',
    'steps.1': 'Consultation', 'steps.1d': 'We listen to your goals and assess your skin and the area to treat.',
    'steps.2': 'Tailored protocol', 'steps.2d': 'We design the ideal combination of treatments and session rhythm.',
    'steps.3': 'The session', 'steps.3d': 'A comfortable experience, like a deep massage. You walk out and carry on with your day.',
    'steps.4': 'Follow-up', 'steps.4d': 'We track your progress and adjust the plan to maintain results.',
    'st.l1': 'Your best self,', 'st.l2': 'without limits.',
    'tr.kicker': 'Treatments', 'tr.title': 'Face, body <br>and <em class="gold-text">eyes</em>.', 'tr.lead': 'Tap a treatment to learn more. Every one starts with a personal consultation.',
    't.body.tag': 'Body', 't.body.s': 'Cellulite, drainage and contouring.',
    't.face.tag': 'Face', 't.face.s': 'Firmness, glow and contour.',
    't.laser.tag': 'Hair removal', 't.laser.t': 'Diode laser', 't.laser.s': 'Smooth skin that lasts.',
    't.preso.tag': 'Drainage', 't.preso.t': 'Pressotherapy', 't.preso.s': 'Light legs, active circulation.',
    't.facial.tag': 'Face', 't.facial.t': 'Facial treatments', 't.facial.s': 'Deep cleansing, acne and hydration.',
    't.lashes.tag': 'Eyes', 't.lashes.t': 'Lash extensions', 't.lashes.s': 'An intense look, every day.',
    't.nails.tag': 'Hands', 't.nails.t': 'Manicure', 't.nails.s': 'Cared-for hands, flawless finish.',
    't.makeup.tag': 'Occasions', 't.makeup.t': 'Make-up', 't.makeup.s': 'For your special days.',
    'plan.kicker': 'Configurator', 'plan.title': 'Design your <em class="gold-text">plan</em>.',
    'plan.lead': 'Select the areas and your goals. We’ll show you an indicative protocol you can send us in one tap.',
    'plan.goals': 'What would you like to achieve?', 'plan.cardTitle': 'Your Infinity plan',
    'plan.note': 'Indicative protocol. We confirm and personalise it at your first consultation.', 'plan.cta': 'Send my plan on WhatsApp',
    'z.rostro': 'Face', 'z.brazos': 'Arms', 'z.abdomen': 'Abdomen', 'z.gluteos': 'Glutes &amp; hips', 'z.piernas': 'Legs',
    'g.celulitis': 'Reduce cellulite', 'g.reafirmar': 'Firm up', 'g.drenar': 'Lighter legs', 'g.rejuvenecer': 'Radiant face', 'g.depilar': 'Long-lasting hair removal', 'g.mirada': 'Intense lashes',
    'ok.kicker': 'Your specialist',
    'ok.lead': 'Expert hands and genuine care. Behind every treatment there is listening, precision and a single goal: helping you look and feel better from the very first session.',
    'rev.kicker': 'Reviews', 'rev.count': '71 Google reviews', 'rev.client': 'Review', 'rev.note': 'Real reviews published on Google Maps (in Spanish).',
    'ct.kicker': 'Contact', 'ct.title': 'See you in <em class="gold-text">Lloret</em>.', 'ct.addr': 'Address', 'ct.phone': 'Phone', 'ct.route': 'Get directions', 'ct.call': 'Call',
    'ft.small': 'Your first session starts here', 'ft.big': 'Book your consultation'
  },
  ru: {
    'nav.treat': 'Процедуры', 'nav.plan': 'Ваш план', 'nav.reviews': 'Отзывы', 'nav.contact': 'Контакты',
    'cta.book': 'Записаться', 'cta.bookLong': 'Записаться на консультацию', 'cta.discover': 'Узнать об Endospheres', 'cta.bookThis': 'Записаться на процедуру',
    'hero.l1': 'Видимый результат', 'hero.l2': 'с <em class="gold-text">первой процедуры</em>.',
    'hero.lead': 'Профессиональные процедуры для лица и тела в Льорет-де-Мар. Технология Endospheres, диодный лазер и прессотерапия — с заботой, которую вы запомните.',
    'hero.reviews': '71 отзыв в Google', 'hero.scroll': 'Листайте',
    'band.laser': 'Диодный лазер', 'band.preso': 'Прессотерапия', 'band.facial': 'Уход за лицом', 'band.lashes': 'Ресницы', 'band.nails': 'Маникюр',
    'endo.kicker': 'Итальянская технология',
    'endo.lead': 'Компрессионная микровибрация: цилиндр с силиконовыми сферами, расположенными в виде сот, глубоко прорабатывает ткани. Без игл и боли — лишь ощущение глубокого массажа.',
    'endo.body': 'Тело', 'endo.face': 'Лицо', 'endo.spheres': 'Сферы', 'endo.level': 'Уровень', 'endo.intensity': 'Интенсивность', 'endo.drag': 'Потяните, чтобы вращать', 'endo.note': 'Иллюстративная визуализация',
    'endo.s1': 'силиконовых сфер в форме сот (насадка для тела)', 'endo.s2': 'двойное действие: компрессия + микровибрация', 'endo.s3': 'запатентованная технология, разработанная в Италии', 'endo.s4': 'игл · неинвазивная процедура',
    'endo.bTitle': 'С чем работает',
    'endo.b1': 'Целлюлит', 'endo.b1d': 'Сглаживает «апельсиновую корку» и улучшает текстуру кожи.',
    'endo.b2': 'Задержка жидкости', 'endo.b2d': 'Стимулирует лимфодренаж: лёгкость в ногах.',
    'endo.b3': 'Микроциркуляция', 'endo.b3d': 'Активирует кровообращение и насыщение тканей кислородом.',
    'endo.b4': 'Тонус', 'endo.b4d': 'Помогает вернуть упругость и мышечный тонус.',
    'endo.b5': 'Моделирование', 'endo.b5d': 'Постепенно корректирует силуэт.',
    'endo.b6': 'Упругость лица', 'endo.b6d': 'С насадкой для лица: овал, сияние и мимические морщины.',
    'steps.title': 'Ваша процедура шаг за шагом',
    'steps.1': 'Консультация', 'steps.1d': 'Выслушаем ваши цели и оценим кожу и зону обработки.',
    'steps.2': 'Индивидуальный протокол', 'steps.2d': 'Подберём оптимальное сочетание процедур и ритм сеансов.',
    'steps.3': 'Процедура', 'steps.3d': 'Комфортно, как глубокий массаж. После сеанса вы сразу возвращаетесь к своим делам.',
    'steps.4': 'Сопровождение', 'steps.4d': 'Отслеживаем результат и корректируем план, чтобы его сохранить.',
    'st.l1': 'Ваша лучшая версия —', 'st.l2': 'без границ.',
    'tr.kicker': 'Процедуры', 'tr.title': 'Лицо, тело <br>и <em class="gold-text">взгляд</em>.', 'tr.lead': 'Нажмите на процедуру, чтобы узнать подробнее. Каждая начинается с индивидуальной консультации.',
    't.body.tag': 'Тело', 't.body.s': 'Целлюлит, дренаж и моделирование.',
    't.face.tag': 'Лицо', 't.face.s': 'Упругость, сияние и чёткий овал.',
    't.laser.tag': 'Эпиляция', 't.laser.t': 'Диодный лазер', 't.laser.s': 'Гладкая кожа надолго.',
    't.preso.tag': 'Дренаж', 't.preso.t': 'Прессотерапия', 't.preso.s': 'Лёгкие ноги и активное кровообращение.',
    't.facial.tag': 'Лицо', 't.facial.t': 'Уход за лицом', 't.facial.s': 'Чистка, акне и увлажнение.',
    't.lashes.tag': 'Взгляд', 't.lashes.t': 'Наращивание ресниц', 't.lashes.s': 'Выразительный взгляд каждый день.',
    't.nails.tag': 'Руки', 't.nails.t': 'Маникюр', 't.nails.s': 'Ухоженные руки, безупречный результат.',
    't.makeup.tag': 'Особые случаи', 't.makeup.t': 'Макияж', 't.makeup.s': 'Для ваших особенных дней.',
    'plan.kicker': 'Конфигуратор', 'plan.title': 'Создайте свой <em class="gold-text">план</em>.',
    'plan.lead': 'Отметьте зоны и цели. Мы покажем ориентировочный протокол, который можно отправить нам одним касанием.',
    'plan.goals': 'Чего вы хотите достичь?', 'plan.cardTitle': 'Ваш план Infinity',
    'plan.note': 'Ориентировочный протокол. Мы уточним и адаптируем его на первой консультации.', 'plan.cta': 'Отправить план в WhatsApp',
    'z.rostro': 'Лицо', 'z.brazos': 'Руки', 'z.abdomen': 'Живот', 'z.gluteos': 'Ягодицы и бёдра', 'z.piernas': 'Ноги',
    'g.celulitis': 'Уменьшить целлюлит', 'g.reafirmar': 'Подтянуть', 'g.drenar': 'Лёгкость в ногах', 'g.rejuvenecer': 'Сияющее лицо', 'g.depilar': 'Долговременная эпиляция', 'g.mirada': 'Выразительный взгляд',
    'ok.kicker': 'Ваш специалист',
    'ok.lead': 'Опытные руки и человеческое тепло. За каждой процедурой — внимание, точность и одна цель: чтобы вы выглядели и чувствовали себя лучше с первого сеанса.',
    'rev.kicker': 'Отзывы', 'rev.count': '71 отзыв в Google', 'rev.client': 'Отзыв', 'rev.note': 'Реальные отзывы из Google Maps (на испанском).',
    'ct.kicker': 'Контакты', 'ct.title': 'Ждём вас в <em class="gold-text">Льорете</em>.', 'ct.addr': 'Адрес', 'ct.phone': 'Телефон', 'ct.route': 'Как добраться', 'ct.call': 'Позвонить',
    'ft.small': 'Ваш первый сеанс начинается здесь', 'ft.big': 'Записаться на консультацию'
  }
};

/* ----------------------------------------------------------
   IDIOMA
   ---------------------------------------------------------- */
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
};
const originals = new Map();
$$('[data-i18n]').forEach(el => originals.set(el, el.innerHTML));

let lang = store.get('inf-lang');
if (!['es', 'en', 'ru'].includes(lang)) {
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  lang = nav === 'ru' || nav === 'uk' ? 'ru' : nav === 'en' ? 'en' : 'es';
}
const fmtNum = n => lang === 'es' || lang === 'ru' ? String(n).replace('.', ',') : String(n);
const waLink = msg => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

function applyLang(l, init = false) {
  lang = l;
  document.documentElement.lang = l;
  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = l === 'es' ? originals.get(el) : (I18N[l] && I18N[l][key]) || originals.get(el);
    if (el.innerHTML !== val) el.innerHTML = val;
  });
  $$('[data-lang]').forEach(b => b.classList.toggle('is-active', b.dataset.lang === l));
  $$('[data-num]').forEach(el => { el.textContent = fmtNum(el.dataset.num); });
  $$('[data-wa]').forEach(a => { a.href = waLink(STR[l].wa); });
  renderStatus();
  renderHours();
  renderPlan(false);
  if (drawerKey) fillDrawer(drawerKey);
  if (endo) endo.refreshLabels();
  if (!init) {
    store.set('inf-lang', l);
    measureBand();
    if (hasGSAP) requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}
$$('[data-lang]').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ----------------------------------------------------------
   HORARIO · ABIERTO AHORA
   ---------------------------------------------------------- */
function madridNow() {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const o = {}; parts.forEach(p => { o[p.type] = p.value; });
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), min: (+o.hour % 24) * 60 + (+o.minute) };
  } catch (e) {
    const d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}
const fmtTime = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function getStatus() {
  const { day, min } = madridNow(); const s = STR[lang]; const h = HOURS[day];
  if (h && min >= h[0] && min < h[1]) return { open: true, text: s.open(fmtTime(h[1])) };
  if (h && min < h[0]) return { open: false, text: s.closedToday(fmtTime(h[0])) };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (HOURS[d]) return { open: false, text: i === 1 ? s.closedTomorrow(fmtTime(HOURS[d][0])) : s.closedDay(d, fmtTime(HOURS[d][0])) };
  }
  return { open: false, text: s.closed };
}
function renderStatus() {
  const st = getStatus();
  $$('[data-status]').forEach(el => { el.classList.toggle('is-open', st.open); $('.status__text', el).textContent = st.text; });
}
function renderHours() {
  const ul = $('.hours'); if (!ul) return;
  const s = STR[lang]; const today = madridNow().day;
  ul.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => {
    const h = HOURS[d];
    return `<li class="${d === today ? 'is-today' : ''}"><span>${s.days[d]}</span><span>${h ? `${fmtTime(h[0])} – ${fmtTime(h[1])}` : s.closed}</span></li>`;
  }).join('');
}
setInterval(renderStatus, 60000);

/* ----------------------------------------------------------
   HERO · partículas doradas en forma de ∞
   ---------------------------------------------------------- */
const heroFX = (() => {
  const cvs = $('#heroCanvas');
  const ctx = cvs.getContext('2d');
  const state = { intro: hasGSAP && !reduced ? 0 : 1, scroll: 0 };
  const mouse = { x: -9999, y: -9999, nx: 0, ny: 0, sx: 0, sy: 0 };
  const COLORS = ['235,213,166', '201,166,107', '255,244,220', '176,138,82'];
  let W = 0, H = 0, parts = [], visible = true, last = performance.now(), time = 0;

  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  (() => {
    const g = sprite.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,244,220,1)'); grd.addColorStop(.22, 'rgba(235,213,166,.6)'); grd.addColorStop(1, 'rgba(201,166,107,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  })();
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const lem = t => { const s = Math.sin(t), c = Math.cos(t), d = 1 + s * s; return [c / d, s * c / d]; };

  function build() {
    const n = W < 760 ? 650 : W < 1200 ? 1100 : 1500;
    parts = [];
    for (let i = 0; i < n; i++) {
      const big = Math.random() < .06;
      parts.push({
        t: Math.random() * Math.PI * 2, sp: .05 + Math.random() * .11,
        off: gauss() * .028 * (Math.random() < .12 ? 2.6 : 1), oz: gauss() * .05,
        s: big ? 2 + Math.random() * 3 : .5 + Math.random() * 1.2, big,
        a: .35 + Math.random() * .65, tw: Math.random() * 6.28,
        c: COLORS[Math.random() * COLORS.length | 0], rx: Math.random(), ry: Math.random(), dx: 0, dy: 0
      });
    }
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cvs.clientWidth; H = cvs.clientHeight;
    cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0B0A09'; ctx.fillRect(0, 0, W, H);
    build();
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    const dt = Math.min(.05, (now - last) / 1000); last = now; time += dt;
    mouse.sx += (mouse.nx - mouse.sx) * .04; mouse.sy += (mouse.ny - mouse.sy) * .04;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(11,10,9,.24)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    const mob = W < 760;
    const A = Math.min(W * (mob ? .38 : .36), H * .62) * (1 + state.scroll * .9);
    const cx = W / 2, cy = H * (mob ? .3 : .42);
    const rotY = Math.sin(time * .18) * .2 + mouse.sx * .3;
    const rotX = .16 + Math.sin(time * .13) * .08 + mouse.sy * .2;
    const cY = Math.cos(rotY), sY = Math.sin(rotY), cX = Math.cos(rotX), sX = Math.sin(rotX);
    const ie = easeOut(state.intro);
    const fade = 1 - state.scroll * .9;
    const R = 130, R2 = R * R;

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.t += p.sp * dt * (reduced ? 0 : 1);
      const a0 = lem(p.t), a1 = lem(p.t + .01);
      const tx = a1[0] - a0[0], ty = a1[1] - a0[1], tl = Math.hypot(tx, ty) || 1;
      const x = a0[0] - ty / tl * p.off, y = a0[1] + tx / tl * p.off, z = p.oz + Math.sin(p.t * 2) * .07;
      const x3 = x * cY + z * sY; let z3 = -x * sY + z * cY;
      const y3 = y * cX - z3 * sX; z3 = y * sX + z3 * cX;
      const persp = 1 / (1 + z3 * .55);
      let sx = cx + x3 * A * persp, sy = cy + y3 * A * persp;
      if (ie < 1) { const rx = p.rx * W, ry = p.ry * H; sx = rx + (sx - rx) * ie; sy = ry + (sy - ry) * ie; }
      const mdx = sx - mouse.x, mdy = sy - mouse.y, md2 = mdx * mdx + mdy * mdy;
      if (md2 < R2) { const md = Math.sqrt(md2) || 1; const f = (1 - md / R) * 2.4; p.dx += mdx / md * f; p.dy += mdy / md * f; }
      p.dx *= .94; p.dy *= .94; sx += p.dx; sy += p.dy;
      const tw = .55 + .45 * Math.sin(time * 2.2 + p.tw);
      const alpha = p.a * tw * Math.min(1.3, persp) * fade * (.2 + .8 * ie);
      if (alpha <= .01) continue;
      if (p.big) {
        const s = p.s * 4 * persp;
        ctx.globalAlpha = Math.min(1, alpha * .5);
        ctx.drawImage(sprite, sx - s / 2, sy - s / 2, s, s);
      } else {
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(${p.c},${alpha.toFixed(3)})`;
        const s = p.s * persp;
        ctx.fillRect(sx, sy, s, s);
      }
    }
    ctx.globalAlpha = 1;
  }

  addEventListener('resize', resize);
  addEventListener('mousemove', e => {
    const r = cvs.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    mouse.nx = (e.clientX / innerWidth - .5) * 2; mouse.ny = (e.clientY / innerHeight - .5) * 2;
  }, { passive: true });
  cvs.parentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(cvs);
  resize();
  requestAnimationFrame(frame);
  return state;
})();

/* ----------------------------------------------------------
   ENDOSPHERES · cilindro interactivo
   ---------------------------------------------------------- */
const endo = (() => {
  const stage = $('.endo__stage');
  const cvs = $('#endoCanvas');
  if (!stage || !cvs) return null;
  const ctx = cvs.getContext('2d');
  const MODES = {
    body: { rings: 5, per: 11, R: .135, sr: .25, gap: 2.2 },
    face: { rings: 6, per: 10, R: .09, sr: .22, gap: 2.15 }
  };
  const st = { mode: 'body', level: 3, angle: 0, vel: .9, drag: false, lastX: 0, lastT: 0, pop: 1 };
  let W = 0, H = 0, visible = false, last = performance.now(), time = 0;
  const lymph = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), s: .6 + Math.random() * 1.6, v: .4 + Math.random() * .9 }));

  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 128;
  (() => {
    const g = sprite.getContext('2d');
    const grd = g.createRadialGradient(46, 40, 3, 64, 64, 64);
    grd.addColorStop(0, '#FFF7E6'); grd.addColorStop(.16, '#F1DDB0'); grd.addColorStop(.5, '#B9945A');
    grd.addColorStop(.82, '#5C4425'); grd.addColorStop(1, '#251B10');
    g.fillStyle = grd; g.beginPath(); g.arc(64, 64, 62, 0, Math.PI * 2); g.fill();
    const rim = g.createRadialGradient(64, 64, 44, 64, 64, 63);
    rim.addColorStop(0, 'rgba(0,0,0,0)'); rim.addColorStop(1, 'rgba(235,213,166,.28)');
    g.globalCompositeOperation = 'lighter'; g.fillStyle = rim; g.beginPath(); g.arc(64, 64, 62, 0, Math.PI * 2); g.fill();
  })();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth; H = stage.clientHeight;
    cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    const dt = Math.min(.05, (now - last) / 1000); last = now; time += dt;
    const lv = st.level;
    const target = reduced ? 0 : .25 + lv * .24;
    if (!st.drag) st.vel += (target - st.vel) * .03;
    st.angle += st.vel * dt;
    st.pop += (1 - st.pop) * .07;

    ctx.clearRect(0, 0, W, H);
    const m = MODES[st.mode];
    const base = Math.min(W, H * 1.55);
    const Rc = base * m.R * (.85 + .15 * st.pop);
    const sr = Rc * m.sr;
    const gap = sr * m.gap;
    const cx = W / 2, cy = H * (W < 760 ? .47 : .42);
    const tilt = .42, yaw = -.36 + Math.sin(time * .3) * .05;
    const cT = Math.cos(tilt), sT = Math.sin(tilt), cW = Math.cos(yaw), sW = Math.sin(yaw);
    const amp = reduced ? 0 : .02 + lv * .012;
    const freq = 2 + lv * 2.4;
    const f = base * 1.6;
    const pts = [];
    for (let r = 0; r < m.rings; r++) {
      for (let k = 0; k < m.per; k++) {
        const phi = (Math.PI * 2 / m.per) * (k + (r % 2) * .5) + st.angle;
        const vib = 1 + Math.sin(time * freq * Math.PI + phi * 3 + r * 1.7) * amp;
        const y = Rc * vib * Math.cos(phi), z = Rc * vib * Math.sin(phi), x = (r - (m.rings - 1) / 2) * gap;
        const y2 = y * cT - z * sT, z2 = y * sT + z * cT;
        const x3 = x * cW + z2 * sW, z3 = -x * sW + z2 * cW;
        const persp = f / (f + z3);
        pts.push({ x: cx + x3 * persp, y: cy + y2 * persp, z: z3, s: sr * persp, low: y / Rc });
      }
    }
    pts.sort((a, b) => b.z - a.z);

    // piel + flujo linfático
    const skinY = cy + Rc * 1.62;
    ctx.save();
    const fill = ctx.createLinearGradient(0, skinY, 0, H);
    fill.addColorStop(0, 'rgba(201,166,107,.10)'); fill.addColorStop(1, 'rgba(201,166,107,0)');
    ctx.beginPath(); ctx.moveTo(0, H);
    const pressers = pts.filter(p => p.low > .55);
    for (let x = 0; x <= W; x += 5) {
      let d = 0;
      for (const p of pressers) { const q = (x - p.x) / (p.s * 1.25); d += Math.exp(-q * q) * (p.low - .55) / .45; }
      const y = skinY + d * sr * (.35 + lv * .05) + Math.sin(x * .03 + time * freq * 2) * lv * .35;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.beginPath();
    for (let x = 0; x <= W; x += 5) {
      let d = 0;
      for (const p of pressers) { const q = (x - p.x) / (p.s * 1.25); d += Math.exp(-q * q) * (p.low - .55) / .45; }
      const y = skinY + d * sr * (.35 + lv * .05) + Math.sin(x * .03 + time * freq * 2) * lv * .35;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const line = ctx.createLinearGradient(0, 0, W, 0);
    line.addColorStop(0, 'rgba(235,213,166,0)'); line.addColorStop(.5, 'rgba(235,213,166,.85)'); line.addColorStop(1, 'rgba(235,213,166,0)');
    ctx.strokeStyle = line; ctx.lineWidth = 1.2; ctx.stroke();
    const flowTop = skinY + sr * .9, flowH = Math.max(20, H - flowTop - 90);
    ctx.globalCompositeOperation = 'lighter';
    for (const l of lymph) {
      l.x += l.v * (.02 + lv * .025) * dt;
      if (l.x > 1) { l.x -= 1; l.y = Math.random(); }
      const px = l.x * W, py = flowTop + l.y * flowH + Math.sin(l.x * 12 + l.y * 8) * 4;
      const a = Math.sin(l.x * Math.PI) * .55;
      ctx.fillStyle = `rgba(235,213,166,${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(px, py, l.s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    // sombra bajo el cilindro
    const shR = gap * m.rings * .75;
    ctx.save();
    ctx.translate(cx, skinY - 4); ctx.scale(1, .16);
    const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, shR);
    sh.addColorStop(0, 'rgba(235,213,166,.22)'); sh.addColorStop(1, 'rgba(235,213,166,0)');
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, shR, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    const drawSphere = (p, alpha) => {
      ctx.globalAlpha = alpha;
      const s = p.s * 2 * (.6 + .4 * st.pop);
      ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
    };
    // esferas traseras
    for (const p of pts) if (p.z > 0) drawSphere(p, .35 + .4 * (1 - clamp(p.z / Rc)));

    // núcleo del cilindro
    const L = (m.rings - 1) * gap + sr * 1.6, Rcore = Rc * .74;
    const ends = [-L / 2, L / 2].map(x => { const z = -x * sW; const p = f / (f + z); return { x: cx + x * cW * p, r: Rcore * p }; });
    const top = Math.min(cy - ends[0].r, cy - ends[1].r), bot = Math.max(cy + ends[0].r, cy + ends[1].r);
    const body = ctx.createLinearGradient(0, top, 0, bot);
    body.addColorStop(0, '#0E0C0A'); body.addColorStop(.28, '#3A2E1F'); body.addColorStop(.42, '#7A6040'); body.addColorStop(.6, '#241C14'); body.addColorStop(1, '#0B0A09');
    ctx.globalAlpha = 1; ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(ends[0].x, cy - ends[0].r); ctx.lineTo(ends[1].x, cy - ends[1].r);
    ctx.ellipse(ends[1].x, cy, ends[1].r * .32, ends[1].r, 0, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(ends[0].x, cy + ends[0].r);
    ctx.ellipse(ends[0].x, cy, ends[0].r * .32, ends[0].r, 0, Math.PI / 2, Math.PI * 1.5);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(235,213,166,.25)'; ctx.lineWidth = 1; ctx.stroke();

    // esferas delanteras
    for (const p of pts) if (p.z <= 0) drawSphere(p, 1);
    ctx.globalAlpha = 1;
  }

  // arrastrar para girar
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('button, input, label')) return;
    st.drag = true; st.lastX = e.clientX; st.lastT = performance.now();
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!st.drag) return;
    const now = performance.now(), dx = e.clientX - st.lastX, dt = Math.max(1, now - st.lastT) / 1000;
    st.angle += dx * .012; st.vel = clamp(dx * .012 / dt, -14, 14);
    st.lastX = e.clientX; st.lastT = now;
  });
  const end = () => { st.drag = false; };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  const rdS = $('#rdSpheres'), rdL = $('#rdLevel'), range = $('#endoRange');
  function refreshLabels() {
    rdS.textContent = st.mode === 'body' ? '55' : STR[lang].micro;
    rdL.textContent = `${st.level}/5`;
  }
  $$('.seg button').forEach(b => b.addEventListener('click', () => {
    if (st.mode === b.dataset.mode) return;
    st.mode = b.dataset.mode; st.pop = 0;
    $$('.seg button').forEach(x => x.classList.toggle('is-active', x === b));
    refreshLabels();
  }));
  const setRange = () => {
    st.level = +range.value;
    range.style.setProperty('--p', `${((range.value - 1) / 4) * 100}%`);
    refreshLabels();
  };
  range.addEventListener('input', setRange);
  setRange();

  addEventListener('resize', resize);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(stage);
  resize();
  requestAnimationFrame(frame);
  return { refreshLabels };
})();

/* ----------------------------------------------------------
   BANDA · velocidad ligada al scroll
   ---------------------------------------------------------- */
let lenis = null;
const band = $('.band__track');
let bandX = 0, bandHalf = 0, bandDir = 1, bandVisible = true;
function measureBand() { bandHalf = band.scrollWidth / 2; }
new IntersectionObserver(([en]) => { bandVisible = en.isIntersecting; }).observe(band);
(() => {
  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!bandVisible || reduced || !bandHalf) return;
    const v = lenis ? lenis.velocity : 0;
    if (Math.abs(v) > .5) bandDir = v > 0 ? 1 : -1;
    bandX -= bandDir * (45 + Math.min(Math.abs(v) * 14, 900)) * dt;
    if (bandX <= -bandHalf) bandX += bandHalf;
    if (bandX > 0) bandX -= bandHalf;
    band.style.transform = `translate3d(${bandX.toFixed(2)}px,0,0)`;
  }
  requestAnimationFrame(loop);
})();

/* ----------------------------------------------------------
   TRATAMIENTOS · foco dorado + cajón de detalle
   ---------------------------------------------------------- */
$$('.tile').forEach(t => {
  t.addEventListener('mousemove', e => {
    const r = t.getBoundingClientRect();
    t.style.setProperty('--mx', `${e.clientX - r.left}px`);
    t.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
  t.addEventListener('click', () => openDrawer(t.dataset.t));
});

const drawer = $('.drawer');
let drawerKey = null, lastFocus = null;
function fillDrawer(key) {
  const T = TREATS[key]; const d = T[lang];
  const img = $('.drawer__img img', drawer);
  if (img.dataset.key !== key) { img.src = T.img; img.dataset.key = key; img.alt = d.t; }
  $('.drawer__tag', drawer).textContent = d.tag;
  $('.drawer__title', drawer).textContent = d.t;
  $('.drawer__desc', drawer).textContent = d.d;
  $('.drawer__list', drawer).innerHTML = d.l.map(x => `<li>${x}</li>`).join('');
  $('.drawer__proto', drawer).textContent = d.p;
  $('.drawer__cta', drawer).href = waLink(STR[lang].waTreat(d.t));
}
function openDrawer(key) {
  drawerKey = key; lastFocus = document.activeElement;
  fillDrawer(key);
  drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
  $('.drawer__panel', drawer).scrollTop = 0;
  if (lenis) lenis.stop();
  setTimeout(() => $('.drawer__close', drawer).focus({ preventScroll: true }), 400);
}
function closeDrawer() {
  if (!drawerKey) return;
  drawerKey = null;
  drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true');
  if (lenis && !document.body.classList.contains('menu-open')) lenis.start();
  if (lastFocus) lastFocus.focus({ preventScroll: true });
}
$$('[data-close]', drawer).forEach(el => el.addEventListener('click', closeDrawer));

/* ----------------------------------------------------------
   CONFIGURADOR DE PLAN
   ---------------------------------------------------------- */
const zones = new Set(), goals = new Set();
const planOut = $('#planOut'), planCta = $('#planCta'), planCount = $('#planCount');

function toggleZone(z) { zones.has(z) ? zones.delete(z) : zones.add(z); renderPlan(true); }
$$('.zone').forEach(el => {
  el.addEventListener('click', () => toggleZone(el.dataset.zone));
  el.addEventListener('mouseenter', () => $$(`.zones [data-zone="${el.dataset.zone}"]`).forEach(b => b.classList.add('is-hover')));
  el.addEventListener('mouseleave', () => $$('.zones button').forEach(b => b.classList.remove('is-hover')));
});
$$('.zones button').forEach(b => {
  b.addEventListener('click', () => toggleZone(b.dataset.zone));
  b.addEventListener('mouseenter', () => $$(`.zone[data-zone="${b.dataset.zone}"]`).forEach(z => z.classList.add('is-hover')));
  b.addEventListener('mouseleave', () => $$('.zone').forEach(z => z.classList.remove('is-hover')));
});
$$('.goal').forEach(b => b.addEventListener('click', () => {
  const g = b.dataset.goal; goals.has(g) ? goals.delete(g) : goals.add(g); renderPlan(true);
}));

function recommend() {
  const recs = [];
  const add = k => { if (!recs.includes(k)) recs.push(k); };
  const body = [...zones].some(z => z !== 'rostro');
  const face = zones.has('rostro');
  if (goals.has('celulitis')) add('body');
  if (goals.has('reafirmar')) { if (body || !face) add('body'); if (face) add('face'); }
  if (goals.has('drenar')) { add('preso'); add('body'); }
  if (goals.has('rejuvenecer')) { add('face'); add('facial'); }
  if (goals.has('depilar')) add('laser');
  if (goals.has('mirada')) add('lashes');
  if (!goals.size) { if (face) add('face'); if (body) add('body'); }
  return recs;
}
const labelOf = sel => { const el = $(sel); return el ? el.textContent.trim() : ''; };

function renderPlan(animate) {
  if (!planOut) return;
  $$('.zone').forEach(el => el.classList.toggle('is-on', zones.has(el.dataset.zone)));
  $$('.zones button').forEach(b => b.classList.toggle('is-on', zones.has(b.dataset.zone)));
  $$('.goal').forEach(b => b.classList.toggle('is-on', goals.has(b.dataset.goal)));
  const recs = recommend();
  planCount.textContent = String(recs.length).padStart(2, '0');
  if (!recs.length) {
    const [t, d] = STR[lang].planEmpty;
    planOut.innerHTML = `<p class="plan__empty">${t}<small>${d}</small></p>`;
    planCta.classList.add('is-disabled'); planCta.href = '#';
    return;
  }
  const zl = [...zones].map(z => labelOf(`.zones [data-zone="${z}"] span`));
  const gl = [...goals].map(g => labelOf(`.goal[data-goal="${g}"]`));
  planOut.innerHTML = recs.map((k, i) => {
    const d = TREATS[k][lang];
    return `<div class="rec" style="${animate ? '' : 'animation:none'}"><span class="rec__n">${String(i + 1).padStart(2, '0')}</span><span class="rec__t">${d.t}</span><button type="button" class="rec__more" data-open="${k}">${STR[lang].more}</button><span class="rec__p">${d.p || d.l[0]}</span></div>`;
  }).join('') + `<div class="plan__chips">${zl.concat(gl).map(x => `<span>${x}</span>`).join('')}</div>`;
  $$('.rec__more', planOut).forEach(b => b.addEventListener('click', () => openDrawer(b.dataset.open)));
  planCta.classList.remove('is-disabled');
  planCta.href = waLink(STR[lang].waPlan(recs.map(k => TREATS[k][lang].t), zl.join(', '), gl.join(', ')));
}

/* ----------------------------------------------------------
   CITAS SOBRE OKSANA
   ---------------------------------------------------------- */
const quotes = $$('.quote'), qBars = $$('.quotes__bars button');
let qIdx = 0, qTimer = null;
function showQuote(i) {
  qIdx = (i + quotes.length) % quotes.length;
  quotes.forEach((q, j) => q.classList.toggle('is-active', j === qIdx));
  qBars.forEach((b, j) => {
    b.classList.remove('is-active', 'is-done');
    if (j < qIdx) b.classList.add('is-done');
  });
  void qBars[qIdx].offsetWidth;
  qBars[qIdx].classList.add('is-active');
  clearTimeout(qTimer);
  qTimer = setTimeout(() => showQuote(qIdx + 1), 6000);
}
qBars.forEach((b, i) => b.addEventListener('click', () => showQuote(i)));

/* ----------------------------------------------------------
   CARRUSEL DE OPINIONES (arrastrable)
   ---------------------------------------------------------- */
const rail = $('.rail'), rTrack = $('.rail__track');
const railState = { x: 0, target: 0, drag: false, startX: 0, startT: 0, moved: 0, visible: false };
const railMin = () => {
  const cs = getComputedStyle(rail);
  const inner = rail.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  return Math.min(0, inner - rTrack.scrollWidth);
};
rail.addEventListener('pointerdown', e => {
  railState.drag = true; railState.startX = e.clientX; railState.startT = railState.target; railState.moved = 0;
  rail.classList.add('is-dragging'); rail.setPointerCapture(e.pointerId);
});
rail.addEventListener('pointermove', e => {
  if (!railState.drag) return;
  const dx = e.clientX - railState.startX; railState.moved = Math.abs(dx);
  const min = railMin(); let t = railState.startT + dx * 1.15;
  if (t > 0) t *= .35; if (t < min) t = min + (t - min) * .35;
  railState.target = t;
});
const railEnd = () => { railState.drag = false; rail.classList.remove('is-dragging'); railState.target = clamp(railState.target, railMin(), 0); };
rail.addEventListener('pointerup', railEnd);
rail.addEventListener('pointercancel', railEnd);
$$('.rail__btn').forEach(b => b.addEventListener('click', () => {
  const card = $('.rcard', rTrack); const step = card ? card.offsetWidth + 18 : 400;
  railState.target = clamp(railState.target - (+b.dataset.dir) * step, railMin(), 0);
}));
new IntersectionObserver(([en]) => { railState.visible = en.isIntersecting; }).observe(rail);
(function railLoop() {
  requestAnimationFrame(railLoop);
  if (!railState.visible) return;
  railState.x += (railState.target - railState.x) * (reduced ? 1 : .12);
  rTrack.style.transform = `translate3d(${railState.x.toFixed(2)}px,0,0)`;
})();

/* ----------------------------------------------------------
   MENÚ + NAVEGACIÓN
   ---------------------------------------------------------- */
const burger = $('.burger'), menu = $('.menu');
function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (lenis) open ? lenis.stop() : lenis.start();
}
burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
function scrollToTarget(hash) {
  const target = hash === '#top' ? 0 : document.querySelector(hash);
  if (target === null) return;
  if (lenis) lenis.scrollTo(target, { duration: 1.6 });
  else if (target === 0) scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const hash = a.getAttribute('href');
  e.preventDefault();
  if (hash === '#' || hash.length < 2) return;
  const wasOpen = document.body.classList.contains('menu-open');
  if (wasOpen) setMenu(false);
  setTimeout(() => scrollToTarget(hash), wasOpen ? 450 : 0);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); setMenu(false); } });

const nav = $('#nav'), fab = $('.wa-fab'), heroEl = $('.hero');
let lastY = 0, ticking = false;
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 30);
  if (!document.body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY && y > innerHeight * .8);
  lastY = y;
  fab.classList.toggle('is-on', y > innerHeight * 1.1 && y < document.documentElement.scrollHeight - innerHeight * 1.9);
  heroFX.scroll = clamp(y / heroEl.offsetHeight);
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

/* ----------------------------------------------------------
   CURSOR + MAGNÉTICOS
   ---------------------------------------------------------- */
if (finePointer && !reduced) {
  const cur = $('.cursor'), dot = $('.cursor-dot'), lab = $('.cursor__label');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; cur.classList.add('is-visible'); dot.classList.add('is-visible'); }, { passive: true });
  document.addEventListener('mouseleave', () => { cur.classList.remove('is-visible'); dot.classList.remove('is-visible'); });
  (function loop() {
    cx += (x - cx) * .16; cy += (y - cy) * .16;
    cur.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => {
    const drag = e.target.closest('.rail, .endo__stage');
    const ctl = e.target.closest('.endo__hud');
    const t = e.target.closest('[data-cursor],a,button,label,input[type="range"],.zone');
    const lbl = t && t.dataset ? t.dataset.cursor : '';
    const isDrag = !!drag && !ctl && !t;
    cur.classList.toggle('is-drag', isDrag);
    cur.classList.toggle('is-label', !!lbl && !isDrag);
    cur.classList.toggle('is-link', !!t && !lbl);
    lab.textContent = isDrag ? STR[lang].drag : (lbl || '');
  });
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${(dx * .18).toFixed(1)}px,${(dy * .3).toFixed(1)}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ----------------------------------------------------------
   ANIMACIONES GSAP
   ---------------------------------------------------------- */
function setupScrollAnimations() {
  if (!hasGSAP || reduced) return;

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%', once: true,
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: .09, overwrite: true })
  });

  // hero: el contenido se aleja
  gsap.to('.hero__content, .hero__top, .hero__bar', {
    yPercent: -30, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // contadores de especificaciones
  $$('.spec__num b[data-count]').forEach(b => {
    const o = { v: 0 };
    ScrollTrigger.create({ trigger: b, start: 'top 85%', once: true, onEnter: () => gsap.to(o, { v: +b.dataset.count, duration: 2, ease: 'power3.out', onUpdate: () => { b.textContent = Math.round(o.v); } }) });
  });

  // pasos de la sesión
  const stepsLis = $$('.steps__list li');
  gsap.fromTo('.steps__line span', { scaleX: 0 }, {
    scaleX: 1, ease: 'none',
    scrollTrigger: {
      trigger: '.steps', start: 'top 70%', end: 'bottom 70%', scrub: true,
      onUpdate: self => stepsLis.forEach((li, i) => li.classList.toggle('is-on', self.progress >= i / stepsLis.length + .02))
    }
  });
  ScrollTrigger.create({ trigger: '.steps', start: 'top 80%', once: true, onEnter: () => gsap.from(stepsLis, { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: .1 }) });

  // statement: la imagen se abre
  gsap.fromTo('.statement__media', { clipPath: 'inset(18% 22% 18% 22% round 32px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
    scrollTrigger: { trigger: '.statement', start: 'top 80%', end: 'center center', scrub: true }
  });
  gsap.fromTo('.statement__media img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.statement__text', { scale: .86, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'center center', scrub: true } });

  // bento
  ScrollTrigger.batch('.tile', {
    start: 'top 92%', once: true,
    onEnter: els => gsap.from(els, { y: 70, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: .08 })
  });

  // Oksana
  gsap.fromTo('.oks__media img', { yPercent: -14 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.oks__media', start: 'top bottom', end: 'bottom top', scrub: true } });
  ScrollTrigger.create({ trigger: '.oks', start: 'top 70%', once: true, onEnter: () => showQuote(0) });

  // nota de reseñas
  const num = $('.rev__num');
  ScrollTrigger.create({
    trigger: '.rev', start: 'top 70%', once: true,
    onEnter: () => {
      $('.rev').classList.add('is-in');
      const o = { v: 0 };
      gsap.to(o, { v: +num.dataset.count, duration: 2.2, ease: 'power3.out', onUpdate: () => { num.textContent = fmtNum(o.v.toFixed(1)); } });
    }
  });

  // pie
  gsap.fromTo('.footer__mark span', { '--fx': '0%' }, { '--fx': '100%', ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.from('.footer__mark span', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'power4.out', scrollTrigger: { trigger: '.footer__mark', start: 'top 95%', once: true } });

  // menú activo
  ['endospheres', 'tratamientos', 'plan', 'oksana', 'opiniones', 'contacto'].forEach(id => {
    const link = $(`.nav__links a[href="#${id}"]`), sec = document.getElementById(id);
    if (!link || !sec) return;
    ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: self => link.classList.toggle('is-active', self.isActive) });
  });
}

function staticFallback() {
  const num = $('.rev__num'); num.textContent = fmtNum(num.dataset.count);
  $$('.spec__num b[data-count]').forEach(b => { b.textContent = b.dataset.count; });
  $('.rev').classList.add('is-in');
  $$('.steps__list li').forEach(li => li.classList.add('is-on'));
  showQuote(0);
}

/* ----------------------------------------------------------
   PRELOADER + INTRO
   ---------------------------------------------------------- */
function heroIntro() {
  document.body.classList.remove('is-loading');
  if (lenis) lenis.start();
  if (!hasGSAP || reduced) { heroFX.intro = 1; return; }
  gsap.to(heroFX, { intro: 1, duration: 2.6, ease: 'power2.inOut' });
  gsap.to('.hero .mask > *', { y: 0, duration: 1.5, ease: 'power4.out', stagger: .14, delay: .5 });
  gsap.from('.hero__top > *', { opacity: 0, y: -10, duration: 1.2, ease: 'power3.out', stagger: .06, delay: .4 });
  gsap.from('.hero__aside > *', { opacity: 0, y: 24, duration: 1.2, ease: 'power3.out', stagger: .1, delay: .9 });
  gsap.from('.hero__bar > *', { opacity: 0, y: 12, duration: 1.2, ease: 'power3.out', stagger: .08, delay: 1.1 });
  gsap.from('.nav > *', { opacity: 0, y: -16, duration: 1, ease: 'power3.out', stagger: .08, delay: .5 });
}

function runLoader() {
  const loader = $('.loader');
  if (!hasGSAP || reduced) { loader.remove(); heroIntro(); return; }
  const path = $('.loader__inf path');
  const L = path.getTotalLength();
  path.style.strokeDasharray = L; path.style.strokeDashoffset = L;
  const cnt = $('.loader__count span'); const o = { v: 0 };
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const ready = Promise.race([fontsReady, new Promise(r => setTimeout(r, 3500))]);

  const intro = gsap.timeline();
  intro.to(path, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' })
    .to(o, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => { cnt.textContent = Math.round(o.v); } }, 0)
    .to('.loader__word span', { opacity: 1, y: 0, duration: .7, ease: 'power3.out', stagger: .05 }, .6)
    .to(path, { fill: 'rgba(201,166,107,.08)', duration: .6 }, 1.4);

  Promise.all([ready, new Promise(r => intro.eventCallback('onComplete', r))]).then(() => {
    gsap.timeline({ onComplete: () => loader.remove() })
      .to('.loader__word, .loader__count', { opacity: 0, y: -14, duration: .5, ease: 'power2.in' })
      .to('.loader__inf', { scale: 3.2, opacity: 0, duration: 1.2, ease: 'power3.in' }, '-=.2')
      .to(loader, { opacity: 0, duration: .8, ease: 'power2.out' }, '-=.55')
      .add(heroIntro, '-=.9');
  });
}

/* ----------------------------------------------------------
   INICIO
   ---------------------------------------------------------- */
scrollTo(0, 0);
applyLang(lang, true);
measureBand();

if (hasGSAP && !reduced && typeof window.Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

setupScrollAnimations();
if (!hasGSAP || reduced) staticFallback();
runLoader();

if (document.fonts) document.fonts.ready.then(() => { measureBand(); if (hasGSAP) ScrollTrigger.refresh(); });
addEventListener('load', () => { measureBand(); if (hasGSAP) ScrollTrigger.refresh(); });
addEventListener('resize', measureBand);
})();
