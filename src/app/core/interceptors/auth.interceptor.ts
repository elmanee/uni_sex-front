import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 🔍 Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // 📝 Log para debugging
  console.log('🔐 Interceptor ejecutado para:', req.url);
  console.log('🔑 Token encontrado:', token ? '✅ Sí' : '❌ No');

  // Si hay token, clonamos la request y agregamos el header Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Token agregado a la petición');
    return next(authReq);
  }

  // Si no hay token, enviar la request original
  console.log('⚠️ No se agregó token a la petición');
  return next(req);
};
