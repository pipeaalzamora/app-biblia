#!/bin/bash

echo "🔍 ANALIZANDO ERRORES DE GRADLE..."
echo ""

cd android

echo "1️⃣ Limpiando proyecto..."
./gradlew clean --stacktrace 2>&1 | tee ../logs/gradle_clean.log

echo ""
echo "2️⃣ Compilando con stacktrace completo..."
./gradlew assembleDebug --stacktrace --info 2>&1 | tee ../logs/gradle_build.log

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Logs guardados en:"
echo "   - logs/gradle_clean.log"
echo "   - logs/gradle_build.log"
echo ""
echo "Para buscar el error específico:"
echo "   grep -i 'cast.*boolean' logs/gradle_build.log"
echo "   grep -i 'exception' logs/gradle_build.log"
