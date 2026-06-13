#!/bin/bash

echo "🔍 INICIANDO DEBUG DE ANDROID..."
echo ""
echo "1️⃣ Verificando dispositivos conectados:"
adb devices
echo ""

echo "2️⃣ Limpiando logs anteriores..."
adb logcat -c
echo ""

echo "3️⃣ Capturando logs en tiempo real..."
echo "   Presiona Ctrl+C para detener"
echo "   Busca líneas con 'ClassCastException' o 'Boolean'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Capturar logs filtrados
adb logcat | grep -E "ClassCastException|Boolean|String cannot be cast|ReactNative|Expo|bibliahelp" --color=always
