# Sitio de Productos de Clientes (demo)

Pequeño sitio estático para mostrar productos de clientes. Puedes desplegarlo gratis con GitHub Pages o Netlify.

Pasos rápidos (GitHub Pages):

1. Crea un repositorio en GitHub y sube la carpeta `client-products-site` como la rama `main` o `gh-pages`.
2. En la configuración del repo -> Pages, selecciona la rama `main` y la carpeta `/ (root)`.
3. Guarda y espera unos minutos; tu sitio estará en `https://<tu_usuario>.github.io/<tu_repo>/`.

Pasos rápidos (Netlify):

1. Ve a https://app.netlify.com/sites/new -> "Deploy manually" -> arrastra la carpeta `client-products-site`.
2. Netlify desplegará y te dará una URL gratuita.

Conectar a tu API y tokens:

- Edita `config.js` y actualiza `API_URL` con la URL de tu endpoint.
- Usa el esquema de autorización `m+` colocando el token en `TOKEN`. Ejemplo:

```js
window.APP_CONFIG = { API_URL: 'https://miapi.example.com/products', AUTH_SCHEME: 'm+', TOKEN: 'TU_TOKEN', USE_IMAGES: true }
```

- Si no pones `TOKEN`, la app mostrará datos de ejemplo y podrás probar antes de desplegar.
- Si tu API no permite CORS, habilita CORS en el servidor o usa un proxy.


Personalización rápida:
- Reemplaza el array `products` en `products.js` por datos reales (o carga desde tu API).
- Mejora la `thumb` para usar imágenes reales (añade la propiedad `img`).
