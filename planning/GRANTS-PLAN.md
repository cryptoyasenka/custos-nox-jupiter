# Custos Nox — Grant Submission Plan

## Приоритет подачи

### 1. SF Ukraine Grants — СДЕЛАТЬ СЕГОДНЯ
**$1K–$10K USDG | Rolling (~7 дней на решение) | Только Украина**

- URL: https://earn.superteam.fun/grants/solana-foundation-ukraine-grants
- Категория: Developer Tooling + DAO Tooling
- Контакт: andrew@kumeka.team
- Статус: [ ] не подано

**Что нужно:**
- [ ] Описание проекта (см. шаблон ниже)
- [ ] GitHub ссылка: https://github.com/cryptoyasenka/custos-nox
- [ ] Milestone план с бюджетом
- [ ] Объяснение "зачем деньги если open-source" (см. ниже)

---

### 2. Agentic Engineering Grant — ДЕДЛАЙН 4 МАЯ
**$200 USDG | ~10 минут на заявку**

- URL: https://earn.superteam.fun/grants/agentic-engineering
- Требует: описание + Colosseum submission link
- Статус: [ ] не подано

---

### 3. Colosseum Public Goods Award — ДЕДЛАЙН 11 МАЯ
**$10,000 | В рамках основного хакатона**

- URL: arena.colosseum.org (уже зарегистрированы)
- Действие: явно написать "open-source public good, MIT license" в описании проекта
- Статус: [ ] текст не добавлен

---

### 4. Ukrainian Track — ДЕДЛАЙН 11 МАЯ
**$10,000 USDG (1-е 5K / 2-е 3K / 3-е 2K)**

- URL: https://earn.superteam.fun/listing/frontier-hackathon-ukrainian-track
- Подаётся автоматически если в Colosseum профиле страна = Украина
- [ ] Проверить что country = Ukraine в профиле
- [ ] Зарегистрироваться на Online Demo Day

---

### 5. Solana Foundation Direct — ПОСЛЕ ХАКАТОНА
**Сумму указываешь сама | ~4 недели на решение**

- URL: https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw
- Категория в форме: Developer Tooling
- Статус: [ ] не подано

---

## Почему open-source проекту нужны деньги

Это стандартный вопрос для всех грантовых программ. Грантодатели прекрасно понимают open-source модель — именно для таких проектов гранты и существуют. Логика простая:

**Open-source ≠ бесплатная разработка.**
Разработчик тратит время. Время = деньги. Грант компенсирует это время чтобы проект развивался, а не умер через месяц.

### Конкретные статьи бюджета для Custos Nox

| Статья | Обоснование |
|---|---|
| Разработка (developer time) | Основная статья. Детекторы, тесты, infrastructure — это месяцы работы |
| Helius RPC (mainnet hosting) | Free tier ограничен. Для production мониторинга нужен платный план ~$50-100/мес |
| Render/Fly.io daemon hosting | Продакшн daemon 24/7 на платном тире ~$20/мес |
| Security audit | Сторонний аудит кода — доверие пользователей |
| Documentation | Написать нормальный onboarding чтобы другие DAO могли задеплоить |
| Outreach | Связаться с реальными DAO командами (Realms, Squads users) чтобы они попробовали |

### Шаблон ответа на "зачем деньги"

> Custos Nox — public good для всего Solana ecosystem. Код MIT, инструмент бесплатный навсегда. Но разработка требует времени разработчика, а production-grade мониторинг требует надёжного RPC и хостинга. Грант покрывает:
> (1) developer time на следующие N детекторов и web dashboard,
> (2) infrastructure costs для managed demo instance который любая DAO может попробовать без setup,
> (3) outreach чтобы реальные multisig команды узнали что инструмент существует.
> Цель: к концу гранта — 10+ реальных DAO которые используют Custos Nox для защиты своих treasury.

---

## Checklist перед каждой подачей

- [ ] GitHub repo public, CI зелений, README актуальний
- [ ] Live demo сайт: https://custos-nox.up.railway.app
- [ ] Colosseum submission link (потрібен для деяких програм)
- [ ] Milestone план готовий (конкретні суми і терміни)
- [ ] Email відправника: cryptoyasenka@gmail.com
