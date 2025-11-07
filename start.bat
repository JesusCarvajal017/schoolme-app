@echo off
echo Construyendo la imagen Docker...
docker-compose build

echo Iniciando el contenedor...
docker-compose up -d

echo El proyecto está ejecutándose en el puerto 6000.
echo Para detener: docker-compose down
echo Para ver logs: docker-compose logs -f
pause