# US-26 — Guía de Publicación en Google Play Store (Sabory)

Estado técnico actual:
- **Package ID**: `food.sabory.app`
- **Binario Play Store**: `twa/app-release-bundle.aab` (generado con Bubblewrap, `minSdkVersion 24`, `playBilling` habilitado)
- **APK de prueba**: `twa/app-release-signed.apk` (verificado en dispositivo físico con `sabory.food: verified`)
- **Digital Asset Links**: `https://sabory.food/.well-known/assetlinks.json` activo

---

## 1. Crear cuenta en Google Play Console

1. Entra en [Google Play Console](https://play.google.com/console) con la cuenta de Google que quieras usar como desarrollador (recomendado usar la cuenta asociada a `saboryfood@gmail.com` o una cuenta personal dedicada).
2. Selecciona **Cuenta personal** (25 USD de pago único) y completa la verificación de identidad (DNI/pasaporte, dirección y teléfono).
3. **Nota importante sobre cuentas personales nuevas**:
   - **Pruebas internas** funciona **al instante** (hasta 100 testers por email) y ya te permite probar Google Play Billing (**US-79e**).
   - Para pasar a **Producción**, Google exige actualmente en cuentas personales nuevas una fase de **Pruebas cerradas** con al menos **12 testers activos durante 14 días seguidos**.

---

## 2. Configuración inicial de la app en Play Console

- **Nombre de la app**: `Sabory: Menú Semanal y Recetas` (30 caracteres máx.)
- **Idioma predeterminado**: Español (España) `es-ES` *(y añadir traducción `en-US`)*
- **Tipo**: Aplicación · **Gratis** (con compras integradas en `US-79e`)
- **Categoría**: Comida y bebida (*Food & Drink*)
- **Correo de contacto**: `saboryfood@gmail.com`
- **Sitio web**: `https://sabory.food`
- **Política de privacidad**: `https://sabory.food/privacy.html`
- **URL de eliminación de cuenta**: `https://sabory.food/privacy.html#account-deletion`

---

## 3. Textos ASO (listos para copiar y pegar)

### Español (`es-ES`)
* **Título** *(29/30 caracteres)*:
  `Sabory: Menú Semanal y Recetas`
* **Descripción corta** *(78/80 caracteres)*:
  `Organiza recetas, planifica tu menú semanal y haz la compra por pasillos.`
* **Descripción completa**:
```text
Sabory es tu planificador culinario inteligente para organizar tus recetas, planificar el menú de toda la semana y hacer la compra sin estrés.

¿QUÉ PUEDES HACER CON SABORY?

• Tu recetario siempre contigo
Guarda tus recetas favoritas, importa recetas desde webs de cocina, redes sociales o fotos de libros/apuntes, y organízalas en colecciones personalizadas.

• Planificador semanal claro y flexible
Organiza desayunos, comidas, meriendas y cenas de lunes a domingo. Consulta qué toca hoy de un vistazo y ajusta las raciones fácilmente.

• Lista de la compra automática por pasillos
Genera la lista de la compra directamente desde tu menú semanal. Sabory agrupa los ingredientes por pasillos del supermercado, normaliza cantidades (g, kg, ml, l) y separa lo pendiente de lo completado.

• Asistente Sous Chef con IA
Planifica tu menú semanal con inteligencia artificial según tus preferencias dietéticas y objetivos nutricionales, aprovecha lo que tienes en la nevera o importa recetas a partir de una foto o texto.

• Modo Cocina sin distracciones
Sigue cada paso con la pantalla siempre encendida y texto claro mientras cocinas.

• Modo Familia y sincronización en la nube
Comparte tu recetario, menú semanal y lista de la compra en tiempo real con tu hogar.

• Privacidad y control total
Funciona sin conexión (offline-first), con soporte en español e inglés, y te permite exportar o eliminar tu cuenta y todos tus datos en cualquier momento.
```

### Inglés (`en-US`)
* **Title** *(29/30 chars)*:
  `Sabory: Meal Planner & Recipes`
* **Short description** *(76/80 chars)*:
  `Organize recipes, plan your weekly meals, and shop effortlessly by aisle.`
* **Full description**:
```text
Sabory is your smart culinary planner to organize your recipes, plan your weekly meals, and breeze through grocery shopping.

WHAT CAN YOU DO WITH SABORY?

• Your personal cookbook everywhere
Save your favorite recipes, import from cooking websites, social media, or photos of cookbooks/notes, and organize them into custom collections.

• Clear and flexible weekly meal planner
Plan breakfast, lunch, snacks, and dinner from Monday to Sunday. See today’s menu at a glance and adjust servings effortlessly.

• Automatic grocery list sorted by aisle
Generate your shopping list straight from your weekly meal plan. Sabory groups ingredients by supermarket aisle, normalizes units (g, kg, ml, l), and keeps completed items tidy.

• AI Sous Chef Assistant
Auto-plan your week tailored to your dietary preferences and nutrition goals, cook with what’s in your fridge, or extract recipes from photos and text.

• Distraction-free Cooking Mode
Follow step-by-step instructions with keep-screen-awake support while you cook.

• Family Mode & Cloud Sync
Share your cookbook, weekly menu, and shopping list in real time with your household.

• Privacy & full control
Works offline-first, supports English and Spanish, and lets you export or delete your account and all your data anytime.
```

---

## 4. Guía rápida para *Seguridad de datos* (Data Safety)

Al rellenar el cuestionario de **Seguridad de datos** en Play Console:
1. **¿Tu app recopila o comparte datos de usuario obligatorios?**: **Sí**.
2. **¿Los datos se cifran en tránsito?**: **Sí** (HTTPS/TLS con Supabase y `sabory.food`).
3. **¿Ofreces un método para que los usuarios soliciten la eliminación de sus datos?**: **Sí** → URL: `https://sabory.food/privacy.html#account-deletion` (y dentro de la app en *Ajustes → Eliminar cuenta*).
4. **Tipos de datos recopilados** (marca únicamente lo que aplica):
   * **Información personal → Dirección de correo electrónico** *(para autenticación con Supabase Auth / Google Sign-In; opcional si se usa en modo local sin cuenta)*: Funcionalidad de la app, Gestión de cuentas.
   * **Información personal → IDs de usuario** *(UUID interno de Supabase)*: Funcionalidad de la app, Gestión de cuentas.
   * **Fotos y vídeos / Audio** *(solo si el usuario elige subir foto de receta o usar el micrófono para dictar al Sous Chef; se procesan de forma efímera y no se comparten con terceros publicitarios)*.
   * **Historial de compras** *(cuando se active US-79e / Google Play Billing)*: Funcionalidad de la app, Prevención de fraude y cumplimiento.
5. **¿Se comparten datos con terceros para publicidad o seguimiento?**: **No**.

---

## 5. Paso CRÍTICO tras subir el primer `.aab` a Pruebas Internas

Cuando subas `twa/app-release-bundle.aab` en Play Console:
1. Ve a **Configuración → Integridad de la aplicación → Firma de aplicaciones de Google Play** (*Play App Signing*).
2. Copia la huella **SHA-256 del certificado de firma de aplicaciones** (es distinta a la de tu `android.keystore`, porque Google vuelve a firmar el `.aab` para distribuirlo).
3. Añade esa segunda huella SHA-256 al array `sha256_cert_fingerprints` de `.well-known/assetlinks.json` y haz push a `main`.
   *(Sin este paso, la app descargada desde Google Play mostraría la barra de direcciones de Chrome arriba).*
