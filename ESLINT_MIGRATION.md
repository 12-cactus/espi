# ESLint Migration Guide - Espi Bot

## 📋 Cambios Realizados

### 1. **package.json** - Actualización de dependencies

**Actualizadas:**

- `eslint`: `^8.56.0` → `^9.0.0`
- `@typescript-eslint/eslint-plugin`: `^6.17.0` → `^7.0.0`
- `@typescript-eslint/parser`: `^6.17.0` → `^7.0.0`
- `eslint-config-prettier`: `9.1.0` → `^9.1.0`

**Removida:**

- `eslint-config-airbnb-typescript` (ya no necesaria con flat config)

**Script actualizado:**

```diff
- "lint": "eslint --ext .ts ./"
+ "lint": "eslint ."
```

### 2. **eslint.config.mjs** - Nuevo archivo (Flat Config)

Reemplaza la configuración antigua `.eslintrc.json`.

**Por qué `.mjs` y no `.js`:**

- El proyecto compila TypeScript a **CommonJS** (`tsconfig.json`: `"module": "CommonJS"`)
- NO agregamos `"type": "module"` en package.json (hubiera roto todo)
- ESLint 9 requiere módulos ES para la configuración
- Solución: usar extensión `.mjs` para que Node lo interprete como ES module

**Cambios principales en la config:**

- ✅ ES Modules import syntax
- ✅ Flat config format (ESLint 9+)
- ✅ TypeScript parser configurado con type checking
- ✅ Import plugin con resolver
- ✅ Prettier como override final
- ✅ Ignores mejorados (incluye `jest.config.js`, `**/*.d.ts`)
- ✅ Jest globals configurados (`describe`, `it`, `expect`)
- ✅ Node.js globals configurados (`process`, etc)
- ✅ TypeScript ESLint `no-unused-vars` activo (desactiva el base rule de ESLint)

### 3. **.eslintrc.json** → **.eslintrc.json.bak**

Archivo viejo respaldado. Ya no se usa.

### 4. **.eslintignore**

Ya no es necesario. Los ignores están en `eslint.config.mjs`:

```javascript
ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.git/**', 'logs/**', 'jest.config.js', '**/*.d.ts'];
```

## 🚀 Lo Que Funciona Ahora

### Configuración de Globals

```javascript
// Node.js globals (process, __dirname, etc)
languageOptions: {
  globals: globals.node,
}

// Jest globals en archivos de test
{
  files: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.js'],
  languageOptions: {
    globals: globals.jest,
  },
}
```

### Reglas Importantes

1. **No-unused-vars:**

   - Desactivada la regla base de ESLint
   - Usamos `@typescript-eslint/no-unused-vars`
   - Comentarios `// eslint-disable-next-line @typescript-eslint/no-unused-vars` funcionan correctamente

2. **Import Order:**

   - Grupos: builtin → external → internal → parent → sibling → index
   - Alfabético dentro de cada grupo

3. **TypeScript:**
   - `no-explicit-any`: OFF (permitido en el proyecto)
   - `lines-between-class-members`: ON (con excepciones)

## 🔄 Migración Paso a Paso

### 1. Instalación Local

```bash
cd ~/dev/12-cactus/espi
yarn install
```

### 2. Verificar que lint pasa

```bash
yarn lint
```

Si hay errores, pueden ser legítimos o necesitar ajustes. Auto-fix:

```bash
yarn lint --fix
```

### 3. Commitear cambios

```bash
git add package.json yarn.lock eslint.config.mjs .eslintrc.json.bak
git commit -m "refactor: upgrade eslint to v9 with flat config

- Migrate from .eslintrc.json to eslint.config.mjs
- Update @typescript-eslint from v6 to v7
- Update eslint from v8 to v9
- Remove eslint-config-airbnb-typescript dependency
- Add proper Node.js and Jest globals configuration
- Use @typescript-eslint/no-unused-vars rule instead of base ESLint
- Simplify lint script to 'eslint .'"
```

## ⚠️ Notas Importantes

### Por qué `.mjs` y no module: true?

```
❌ NO: "type": "module" en package.json
   → Hubiera roto: Jest (CommonJS), TypeScript compilation, todo

✅ SÍ: eslint.config.mjs
   → ESLint 9 espera ES modules
   → .mjs extension sin cambiar todo el proyecto
```

### Reglas Preservadas

Todas tus reglas custom se mantienen:

- ✅ No explicit `any`
- ✅ Import order (builtin → external → internal)
- ✅ Sort imports
- ✅ Lines between class members
- ✅ Prettier integration

### Cambios en Comportamiento

**Nuevo:**

- ✅ Detecta `process`, `__dirname` (Node globals)
- ✅ Detecta `describe`, `it`, `expect` en archivos test
- ✅ `@typescript-eslint/no-unused-vars` respeta `// eslint-disable-next-line` correctamente

**Mismo:**

- ✅ Todas las otras reglas funcionan igual

## 📚 Archivos de Referencia

- **eslint.config.mjs**: Nueva configuración (ESLint 9 flat config)
- **.eslintrc.json.bak**: Backup de vieja configuración
- **package.json**: Dependencies actualizadas
- **.eslintignore**: Ya no se usa (migrado a ignores en config)

## 🐛 Troubleshooting

**Error: "Cannot find package 'typescript-eslint'"**

- Solución: Usar `@typescript-eslint/eslint-plugin` e `@typescript-eslint/parser` por separado

**Error: "process is not defined"**

- Solución: ✅ Ya arreglado (globals.node configurado)

**Error: "@typescript-eslint/no-unused-vars" no funciona con disable comment**

- Solución: ✅ Ya arreglado (disabled base rule, usamos TS version)

**Jest globals no reconocidos**

- Solución: ✅ Ya arreglado (config específico para `__tests__/**/*.test.ts`)

---

**¿Dudas o necesitas cambios adicionales?**
