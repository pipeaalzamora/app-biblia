#!/bin/bash

echo "📝 Capturando log completo de Android..."
echo ""

# Crear carpeta de logs si no existe
mkdir -p logs

# Nombre del archivo con timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOGFILE="logs/android_log_${TIMESTAMP}.txt"

echo "Guardando en: $LOGFILE"
echo "Presiona Ctrl+C cuando termines de reproducir el error"
echo ""

# Limpiar logs anteriores
adb logcat -c

# Capturar todo
adb logcat > "$LOGFILE" 2>&1 &
LOGCAT_PID=$!

echo "✅ Capturando logs (PID: $LOGCAT_PID)"
echo ""
echo "Ahora:"
echo "1. Abre la app en tu dispositivo"
echo "2. Reproduce el error"
echo "3. Presiona Ctrl+C aquí"
echo ""

# Esperar a que el usuario presione Ctrl+C
trap "kill $LOGCAT_PID 2>/dev/null; echo ''; echo '✅ Log guardado en: $LOGFILE'; echo ''; echo 'Para ver el error ejecuta:'; echo \"grep -i 'cast\\|exception' $LOGFILE\"; exit" INT

wait $LOGCAT_PID
