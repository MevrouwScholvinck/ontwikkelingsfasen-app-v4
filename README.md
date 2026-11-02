# Ontwikkelingsfasen app - Vercel-safe versie

Dit is bewust een **eenvoudigere versie** van de app, zodat hij **zonder Next.js build-fouten** op Vercel kan draaien.

## Wat zit erin

- `index.html` - de app
- `styles.css` - opmaak
- `app.js` - logica
- `config.js` - hier vul je jouw Supabase URL en publishable key in
- `supabase_schema.sql` - database-tabellen en rechten
- `vercel.json` - zorgt dat Vercel dit als simpele website uitserveert

## Heel simpele route

### 1. Supabase
- open jouw Supabase-project
- zet **Anonymous Sign-Ins** aan
- open **SQL Editor**
- plak daar de inhoud van `supabase_schema.sql`
- klik **Run**

### 2. Config invullen
Open `config.js` en vervang:

- `PLAK_HIER_JE_SUPABASE_URL`
- `PLAK_HIER_JE_SUPABASE_PUBLISHABLE_KEY`

### 3. GitHub
Maak een nieuwe repository en upload **de inhoud van deze map**.
Upload **niet** het zip-bestand zelf.

### 4. Vercel
- ga naar Vercel
- importeer de repository
- Vercel hoort dit automatisch als simpele static site te behandelen
- klik deploy

## Als je config.js liever in GitHub wijzigt
Dat mag ook:

- open `config.js`
- klik op het potloodje **Edit this file**
- plak jouw Supabase URL en publishable key
- klik **Commit changes**

## Waarom deze versie?
De eerdere versie gaf telkens build-fouten in Vercel. Deze versie vermijdt dat probleem.
