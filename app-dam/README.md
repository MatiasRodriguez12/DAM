Web App Full Stack Base - Ionic frontend
========================================

Proyecto basado en [Web App Full Stack Base](https://github.com/gotoiot/app-fullstack-base).

Este repositorio contiene el **Trabajo Práctico Final** de la asignatura _Desarrollo de Aplicaciones Multiplataforma_, correspondiente a la **Maestría en Internet de las Cosas**.

La aplicación permite **monitorear sensores** y **controlar válvulas de riego** para cultivos. El entorno está **dockerizado** para simplificar la instalación, ejecución y despliegue.

---

## 🚀 Tecnologías utilizadas

- **Ionic** — framework principal para el frontend.  
- **TypeScript, HTML, CSS** — construcción de la UI.  
- **Node.js (JavaScript)** — backend y API REST.  
- **MySQL** — base de datos relacional.  
- **phpMyAdmin** — administración de MySQL vía web.  
- **Docker & Docker Compose** — orquestación de servicios.

---

### Instalar las dependencias

Para correr este proyecto es necesario que instales `Docker` y `Docker Compose`. 

### Ejecutar la aplicación

Para ejecutar la aplicación tenes que correr el comando `docker compose up` desde la raíz del proyecto (anteponer el prefijo `sudo` en caso de ser necesario). Este comando va a descargar las imágenes de Docker de node, de typescript, de la base datos y del admin de la DB, y luego ponerlas en funcionamiento.

También, en caso de detectarse errores, se deberá correr el comando `npm install` en las carpetas raiz de frontend y backend.

Una vez que el contenedor se encuentre corriendo, puede ingresar a la aplicación a través de [http://localhost:8100/](http://localhost:8100/). Por otra parte, la administración web de la base de datos se accede por [http://localhost:8001/](http://localhost:8001/).



