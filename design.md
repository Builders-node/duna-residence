# Style Guide — «Kononenko» стиль

Полная деконструкция стилистики сайта **kononenkogroup.com** (Kononenko Architectural Bureau) на основе анализа его реального CSS/JS. Документ — спецификация для точного воспроизведения: токены, типографика, сетка, и **все анимации** с конкретными значениями.

Стек оригинала: **Nuxt 3 (Vue) + Prismic CMS**, анимации — **Lenis (smooth scroll) + GSAP + IntersectionObserver**.

---

## 1. Философия стиля

Швейцарский минимализм для архитектурного бюро:
- **Чистый монохром** — белый фон, чёрный текст. Цвета почти нет.
- **Огромная serif-типографика** как главный визуальный элемент (заголовки до 400px).
- **Много воздуха**, строгая **15-колоночная сетка**, выравнивание по сетке.
- **Медленные, «тяжёлые» анимации** с одной фирменной кривой плавности.
- Изображения — сдержанно, с деликатным zoom-hover и reveal по маске.
- Ощущение «дорогого» достигается не декором, а **точностью, ритмом и таймингом**.

---

## 2. Цвета

Палитра предельно узкая — это принципиально.

| Токен | HEX | Назначение |
|---|---|---|
| `--black` | `#000000` | Текст, фон инверсных блоков, кнопки |
| `--white` | `#ffffff` | Основной фон, текст на чёрном |
| `--gray-3` | `#929292` | Вторичный текст, подписи, «приглушённые» заголовки |
| `--gray-eee` | `#eeeeee` | Тонкие разделители, hover-подложки |
| `--gray-ccc` | `#cccccc` | Границы, disabled |
| `--gray-f0` | `#f0f0f0` | Плейсхолдеры изображений, светлые блоки |
| `--gray-e2` | `#e2e2e2` | Разделительные линии |
| `--accent-red` | `#ff0000` | Акцент, **крайне редко** (используется как `#ff000026` ≈ 15% — подсветка/highlight) |

Правила:
- 95% интерфейса — только `#000` и `#fff`.
- Серый `#929292` — единственный «полутон» для иерархии текста.
- Красный — не для кнопок, а как точечный highlight (полупрозрачный фон выделения).

```css
:root{
  --black:#000; --white:#fff;
  --gray-3:#929292; --gray-eee:#eee; --gray-ccc:#ccc;
  --gray-f0:#f0f0f0; --gray-e2:#e2e2e2;
  --accent-red:#ff0000;
}
```

---

## 3. Типографика

Два кастомных шрифта (в оригинале обфусцированы как `h` и `n`):

| Роль | Семейство | Класс/стиль | Характер |
|---|---|---|---|
| **Заголовки** | `h` → **serif** | `h1–h6`, `.fn-h*` | Контрастная антиква, вес 400, очень плотный трекинг |
| **Текст/UI** | `n` → **sans-serif** | `body` | Гротеск, вес 400 |

> Подбор аналогов для копии: заголовочный serif — **PP Editorial New / Reckless / Ogg / Canela / Noto Serif Display** (тонкая высококонтрастная антиква). Текст sans — **Neue Haas Grotesk / Suisse Int'l / Inter / Söhne**.

### 3.1 Шкала заголовков (serif, weight 400, `letter-spacing:-.03em`)

Значения `rem` = **px при ширине экрана 1920px** (см. §3.3 fluid-rem).

| Класс | Desktop | Mobile | line-height |
|---|---|---|---|
| `.fn-h1` | `400rem` (≈400px) | `200rem` | `normal` |
| `.fn-h2` | `175rem` | — | `.7` |
| `.fn-h3` | `118rem` | — | `.9` |
| `.fn-h4` | `80rem` | — | `.8` |
| доп. крупные | `40 / 36 / 30 / 26rem` | — | `.8–1.1` |

Ключевая деталь: **сверхплотные line-height (0.7–0.9)** — строки почти «слипаются», это создаёт монолитные текстовые блоки. Трекинг отрицательный `-.03em`.

### 3.2 Текст (sans)

```css
body{
  font-family:n, sans-serif;
  font-size:16rem;         /* 14rem на мобильном */
  font-weight:400;
  letter-spacing:-.02em;
  line-height:1.2;
  color:#000; background:#fff;
}
```
UI-размеры: `18rem` (кнопки), `16rem` (тело), `14rem / 12rem` (подписи, sup).

### 3.3 Fluid-rem система (важно!)

Весь сайт масштабируется пропорционально ширине экрана через переопределение корневого `font-size`:

```css
:root{ font-size:.0520833333vw; }          /* 1rem = 1px при 1920px */
@media (max-width:767.98px){
  :root{ font-size:.2666666667vw; }         /* 1rem = 1px при 375px  */
}
```

Следствие: **все размеры задаются в `rem`, где 1rem = 1px макета**, и весь дизайн плавно ужимается/растягивается без брейкпоинтов. `400rem` = 400px на 1920, пропорционально меньше на других ширинах.

### 3.4 Рендеринг шрифта

```css
html{
  font-feature-settings:"kern" off; font-kerning:none;
  text-rendering:optimizeSpeed;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-size-adjust:none;
}
```

---

## 4. Сетка и отступы

- **Основная сетка: 15 колонок** — `grid-template-columns:repeat(15,1fr)`.
- Элементы позиционируются спанами: `grid-column:4/8`, `6/8` и т.д.
- Встречается и `1fr 1fr` для парных блоков.
- Гэпы: `10–20rem` внутри блоков; крупные секционные отступы — сотни `rem` (`margin-top:300rem`).

Токены отступов из оригинала:
```css
:root{
  --space-general:2em;   /* базовый ритм */
  --space-heading:1em;   /* отбивка заголовков */
  --off:.5em;            /* мелкие сдвиги/гэпы меню */
}
```

**Единственный брейкпоинт:** `767.98 / 767.99px` (десктоп ≥768, мобайл <768). Плюс редкий `max-width:400px`. Всё остальное — за счёт fluid-rem.

---

## 5. Сигнатурный easing и тайминги ⭐

Это «подпись» стиля — **одна кривая на весь сайт**:

```css
--ease: cubic-bezier(.17, .84, .44, 1);
```

Характер: резкий старт, долгий мягкий доводчик — «дорогое», инерционное ощущение.

**Библиотека длительностей** (используются повсеместно):

| Длительность | Где |
|---|---|
| **`1.109s`** ⭐ | Фирменная — reveal текста, zoom картинок, подчёркивание ссылок |
| `.6s` | Скрытие/показ хедера, blend-переходы |
| `.5s` | Трансформации элементов |
| `.4s` | Ширина/opacity (drag-scrollbar) |
| `.3s` | Быстрые: цвет, opacity кроссфейда |

> В JS (GSAP/Lenis) те же числа: `duration:1.109`, `duration:.5`, `duration:.3`, и `0.17` (совпадает с первой точкой кривой).

---

## 6. Анимации — детально

### 6.1 Smooth scroll (Lenis)
Инерционный скролл на всю страницу. Конфиг близок к `lerp ≈ 0.1` (плавное «догоняние»), `wheelMultiplier:1`. Нативный скроллбар скрыт:
```css
html{scrollbar-width:none;}
body::-webkit-scrollbar{width:0!important;height:0!important;}
```
Реализация для копии: **Lenis** + `requestAnimationFrame`, синхронизировать с GSAP ScrollTrigger.

### 6.2 Индикатор прогресса чтения (`.yap`)
Тонкая полоса вверху страницы, растёт по мере скролла:
```css
.progress{
  position:fixed; top:0; left:0; z-index:10000;
  width:100%; height:4px; background:#000;
  transform:scaleX(0); transform-origin:left;
  will-change:transform;               /* scaleX = процент скролла */
}
```

### 6.3 Хедер с `mix-blend-mode` (`.kbp`) ⭐
Фиксированный хедер белым цветом, инвертируется поверх любых секций через **difference**; прячется при скролле вниз, появляется при скролле вверх:
```css
.header{
  position:fixed; top:0; left:0; width:100%; z-index:9999;
  padding:20rem 0;                     /* 10rem на мобильном */
  color:#fff;
  mix-blend-mode:difference;           /* авто-инверсия над фото/чёрным */
  transition:transform .6s var(--ease), mix-blend-mode .6s var(--ease);
  will-change:transform;
  pointer-events:none;                 /* клики только на ссылках */
}
.header a,.header button{pointer-events:all;}
.header.is-hidden{transform:translateY(-100%);}   /* скролл вниз */
.header.solid{mix-blend-mode:normal;}             /* над белым/в меню */
```

### 6.4 Reveal текста по маске (`.ln-mask`) ⭐
Текст разбивается на **строки/слова/буквы**, каждая строка в контейнере `overflow:hidden`, внутренний слой уезжает из-под маски снизу вверх при появлении в вьюпорте (IntersectionObserver + GSAP):
```css
.ln-mask{display:block; overflow:hidden;}
.ln-mask .ln,.ln-mask .wd,.ln-mask .ch{
  display:block; will-change:transform;
  transform:translateY(105%);          /* стартовое состояние — спрятан под маской */
}
/* при .is-inview: */
.is-inview .ln{ transform:translateY(0);
  transition:transform 1.109s var(--ease); }
```
Строки анимируются с **каскадной задержкой** (stagger ~0.05–0.1s между строками).

### 6.5 Подчёркивание ссылок sweep (`.link`) ⭐
Линия под ссылкой «прочерчивается» слева-направо на hover и «стирается» при уходе (origin меняется):
```css
.link{position:relative; text-decoration:none; width:fit-content; color:currentColor;}
.link::before{
  content:""; position:absolute; left:0; bottom:0;
  width:100%; height:max(1px,.05em); background:currentColor;
  transform:scaleX(0); transform-origin:right;
  transition:transform 1.109s var(--ease); pointer-events:none;
}
.link:hover::before{ transform:scaleX(1); transform-origin:left; }
/* активный пункт — линия уже прочерчена, при hover стирается */
.link.is-active::before{ transform:scaleX(1); transform-origin:0 50%; }
.link.is-active:hover::before{ transform:scaleX(0); transform-origin:100% 100%; }
```

### 6.6 Карточки работ — hover (`.frl .qct`) ⭐
Grid проектов. При наведении: картинка деликатно приближается, подпись «прокручивается» (старая уезжает вверх, новая приезжает снизу):
```css
.work-item .media{width:100%; height:540rem; overflow:hidden;}
.work-item img{
  transition:transform 1.109s var(--ease), opacity .3s var(--ease);
}
.work-item:hover img{ transform:scale(1.035); }   /* лёгкий zoom */

/* «roll» подписи */
.work-item .caption{overflow:hidden; position:relative; text-align:right;
  font-family:h,serif;}
.work-item .caption .out{ transition:transform 1.109s var(--ease); }
.work-item .caption .in{ position:absolute; top:0; right:0;
  transform:translateY(101%); transition:transform 1.109s var(--ease); }
.work-item:hover .caption .out{ transform:translateY(-101%); }
.work-item:hover .caption .in{ transform:translateY(0); }
```

### 6.7 Ленивое появление изображений
Картинки стартуют с `opacity:0` и проявляются после загрузки/входа в вьюпорт:
```css
.media.is-lazy img{opacity:0;}
.media.is-loaded img{opacity:1; transition:opacity .3s var(--ease);}
```
(Часто сочетается с reveal-маской `clip-path:inset(...)` сверху вниз.)

### 6.8 Кнопки (`.izx`)
Аутлайн-кнопка с тонкой рамкой; вариант-заливка чёрным. Внутри — hover-заливка снизу + инверсия цвета:
```css
.btn{
  display:inline-flex; align-items:center; justify-content:center;
  gap:12rem; padding:8rem 32rem;              /* 16rem 33rem на мобильном */
  font-size:18rem; color:#000;
  border:1px solid currentColor; overflow:hidden; position:relative;
  transition:color .3s var(--ease); cursor:pointer;
}
.btn::before{                                  /* шторка-заливка */
  content:""; position:absolute; inset:0; background:#000;
  transform:translateY(101%); transition:transform .5s var(--ease); z-index:-1;
}
.btn:hover{ color:#fff; }
.btn:hover::before{ transform:translateY(0); }
.btn--filled{ background:#000; color:#fff; border:none; }  /* .axd */
.btn svg{ max-height:19rem; }
```

### 6.9 Переход между страницами (`.dyh`)
Полноэкранный чёрный оверлей делает wipe (opacity + clip-path) при навигации:
```css
.page-overlay{
  position:fixed; inset:0; width:100%; height:100%; z-index:98;
  background:#000; opacity:0; pointer-events:none;
  will-change:opacity, clip-path;      /* анимируется через GSAP timeline */
}
/* + Vue fade-transition для контента */
.fade-enter-from,.fade-leave-to{opacity:0;}
```

### 6.10 Кастомный drag-scrollbar (`.eun`)
Тонкая «пилюля» справа, расширяется при наведении; курсор `grab`:
```css
.scrollbar-thumb{
  position:absolute; right:4px; width:8px; min-height:80px;
  background:#000; border:1px solid #000; border-radius:50px;
  opacity:.5; cursor:grab;
  transition:width .4s ease, opacity .4s ease;
}
.scrollbar-thumb:hover{ width:14px; opacity:1; }
```

---

## 7. Компоненты и паттерны

- **Hero** — гигантский serif-заголовок (`.fn-h1`, 400px) с line-reveal по строкам; часто на весь экран, текст выровнен по 15-сетке.
- **Grid работ** — крупные изображения (`height:540rem`) с подписью справа (`text-align:right`, serif), hover-zoom + roll подписи.
- **Info-секции** — двухколоночные (`grid-column:4/8` и т.п.), приглушённый serif `#929292`, большие верхние отступы (`margin-top:300rem`).
- **Footer** — тёмный/крупная типографика, ссылки с sweep-подчёркиванием.
- **Меню** — оверлей; хедер переключает `mix-blend-mode:difference → normal`.
- **Разделители** — тонкие линии `#e2e2e2 / #eee`, высота `max(1px, .05em)`.

---

## 8. Готовый блок токенов (для внедрения)

```css
:root{
  /* fluid rem: 1rem = 1px @1920 */
  font-size:.0520833333vw;

  /* color */
  --black:#000; --white:#fff; --gray-3:#929292;
  --gray-e2:#e2e2e2; --gray-ee:#eee; --gray-f0:#f0f0f0;
  --accent:#ff0000;

  /* motion */
  --ease:cubic-bezier(.17,.84,.44,1);
  --dur-signature:1.109s;
  --dur-slow:.6s; --dur-mid:.5s; --dur-fast:.3s;

  /* space */
  --space-general:2em; --space-heading:1em; --off:.5em;
}
@media (max-width:767.98px){ :root{ font-size:.2666666667vw; } }

h1,h2,h3,h4,h5,h6{ font-family:"Serif Display",serif; font-weight:400;
  letter-spacing:-.03em; }
body{ font-family:"Grotesk",sans-serif; font-weight:400;
  letter-spacing:-.02em; line-height:1.2; color:var(--black);
  background:var(--white); font-size:16rem; }

.fn-h1{ font-size:400rem; line-height:normal; }
.fn-h2{ font-size:175rem; line-height:.7; }
.fn-h3{ font-size:118rem; line-height:.9; }
.fn-h4{ font-size:80rem;  line-height:.8; }
@media (max-width:767.98px){ .fn-h1{ font-size:200rem; } body{ font-size:14rem; } }

.grid-15{ display:grid; grid-template-columns:repeat(15,1fr); gap:15rem; }
```

---

## 9. Чек-лист для «почти точной копии»

- [ ] Fluid-rem корень (`font-size:.052vw` десктоп / `.267vw` мобайл), всё в `rem`.
- [ ] Только `#000` / `#fff`, серый `#929292` для иерархии, красный — точечно.
- [ ] Serif-антиква для заголовков (вес 400, `-.03em`, line-height 0.7–0.9); sans для текста (`-.02em`, 1.2).
- [ ] Заголовки-гиганты (до 400px), плотные строки, монолитные блоки.
- [ ] Сетка 15 колонок, позиционирование спанами, крупные вертикальные отступы.
- [ ] **Единый easing** `cubic-bezier(.17,.84,.44,1)` на всё.
- [ ] Сигнатурная длительность **1.109s** для reveal/zoom/underline.
- [ ] Lenis smooth-scroll (lerp ~0.1) + скрытый нативный скроллбар.
- [ ] Хедер `mix-blend-mode:difference`, hide-on-scroll-down.
- [ ] Line-mask reveal текста (translateY 105% → 0, stagger по строкам).
- [ ] Underline sweep у ссылок (scaleX, origin right→left).
- [ ] Work-hover: image `scale(1.035)` + roll подписи (±101%).
- [ ] Кнопки: 1px бордер + шторка-заливка снизу с инверсией цвета.
- [ ] Page-transition оверлей (opacity/clip-path) + fade контента.
- [ ] Индикатор прогресса скролла (scaleX сверху).
- [ ] Тонкие разделители `max(1px,.05em)`, цвет `#e2e2e2`.

---

*Составлено на основе анализа реального CSS/JS сайта kononenkogroup.com. Значения (цвета, кривые, тайминги, размеры) извлечены из исходников; названия шрифтов у оригинала обфусцированы — подберите визуально близкие антикву и гротеск.*
