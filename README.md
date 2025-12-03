# 🎰 Apostemos - Juego de Ruleta Multijugador

## 🎮 Características

### ✨ Sistema Multijugador Simulado
- **Lobby de Entrada**: Elige tu nombre y selecciona entre Mesa Estándar o Sala VIP
- **Jugadores Bot**: Compite contra 3-5 jugadores AI con diferentes estrategias
- **Chat en Vivo**: Interactúa con los bots que comentan durante el juego
- **Lista de Jugadores**: Ve los balances de todos en tiempo real

### 🎲 Mecánicas de Juego
- **Ruleta Americana**: 38 números (0, 00, 1-36)
- **Múltiples Tipos de Apuesta**:
  - Números individuales (35:1)
  - Rojo/Negro (1:1)
  - Par/Impar (1:1)
  - 1-18 / 19-36 (1:1)
  - Docenas (2:1)
  - Columnas (2:1)
- **Temporizador de Ronda**: 20 segundos para apostar
- **Botón "GIRAR"**: Fuerza el giro inmediato
- **Jackpot Mega**: Acumula con cada apuesta

### 🎨 Diseño Premium
- **Tema Oscuro Futurista**: Colores azul medianoche y dorado
- **Mesa 3D**: Tablero de apuestas con perspectiva realista
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Interfaz Responsiva**: Adaptable a diferentes pantallas

## 🚀 Cómo Jugar

### 1. Iniciar el Juego
1. Abre `index.html` en tu navegador
2. Ingresa tu nombre (o deja "Guest")
3. Selecciona una sala:
   - **Mesa Estándar**: Min $1 - Max $500
   - **Sala VIP**: Min $50 - Max $5000
4. Haz clic en "ENTRAR A LA MESA"

### 2. Realizar Apuestas
1. Selecciona el valor de tu ficha (1, 5, 10, 25, 50, 100)
2. Haz clic en cualquier casilla del tablero para apostar
3. Tus fichas son **doradas**, las de los bots son **azules**
4. Puedes hacer múltiples apuestas antes de que termine el tiempo

### 3. Durante la Ronda
- El temporizador cuenta regresiva desde 20 segundos
- Los bots colocan apuestas automáticamente
- Puedes chatear con los bots en el panel derecho
- Haz clic en "GIRAR" para forzar el giro inmediato

### 4. Resultados
- La ruleta gira y se detiene en un número
- Si ganas, tu balance aumenta automáticamente
- El historial de números aparece en el panel derecho
- Los bots comentan en el chat sobre sus resultados

## 📁 Estructura del Proyecto

```
ruleta spin to win/
├── index.html          # Página principal
├── styles.css          # Estilos del juego
├── app.js             # Lógica principal de la aplicación
└── modules/
    ├── user.js        # Sistema de usuarios
    ├── roulette.js    # Mecánicas de la ruleta
    ├── bets.js        # Sistema de apuestas
    ├── jackpots.js    # Sistema de jackpots
    ├── utils.js       # Utilidades
    ├── bots.js        # IA de jugadores bot
    └── chat.js        # Sistema de chat
```

## 🎯 Estrategias de los Bots

- **Safe (Seguro)**: Apuesta principalmente en rojo/negro y par/impar
- **Aggressive (Agresivo)**: Apuesta en números individuales
- **Random (Aleatorio)**: Mezcla de diferentes tipos de apuestas

## 💰 Sistema de Balance

- **Balance Inicial**: $1000 para nuevos jugadores
- **Persistencia**: Tu balance se guarda en localStorage
- **Jackpot**: Crece con cada apuesta realizada

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con gradientes y animaciones
- **JavaScript ES6+**: Módulos, clases, y programación funcional
- **LocalStorage**: Persistencia de datos del usuario

## 🎨 Paleta de Colores

- **Fondo**: #050510 (Azul muy oscuro)
- **Paneles**: rgba(20, 20, 35, 0.9) (Azul oscuro translúcido)
- **Dorado**: #ffd700
- **Azul Acento**: #00d4ff
- **Rojo**: #ff3333
- **Verde Fieltro**: #0d2b1d

## 📱 Características Técnicas

- **Módulos ES6**: Código organizado y mantenible
- **Sin Frameworks**: Vanilla JavaScript puro
- **Responsive**: Adaptable a móviles y tablets
- **Optimizado**: Animaciones con CSS transforms
- **Accesible**: Estructura HTML semántica

## 🐛 Solución de Problemas

### El juego no carga
- Asegúrate de abrir `index.html` en un navegador moderno (Chrome, Firefox, Edge)
- Verifica que todos los archivos estén en la carpeta correcta

### Los bots no aparecen
- Refresca la página (F5)
- Verifica la consola del navegador (F12) para errores

### El balance no se guarda
- Verifica que tu navegador permita localStorage
- No uses modo incógnito

## 🎉 ¡Disfruta el Juego!

Buena suerte en las mesas. ¡Que la fortuna esté de tu lado! 🍀
