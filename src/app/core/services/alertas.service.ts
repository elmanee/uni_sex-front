import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  private baseToast = Swal.mixin({
    toast: true,
    position: 'top-end', // Esquina superior derecha (mejor que top-start)
    showConfirmButton: false,
    showCloseButton: true,
    timer: 3500,
    timerProgressBar: true,
    width: '380px', // Ancho fijo para mejor control
    padding: '1rem',
    background: '#ffffff',
    color: '#1f2937',
    customClass: {
      popup: `
        !mt-4 !mr-4
        shadow-2xl rounded-xl border border-gray-100
        backdrop-blur-sm
        animate__animated animate__fadeInRight animate__faster
      `,
      title: `
        !text-sm !font-semibold !m-0
        leading-relaxed tracking-tight
        flex items-center gap-3
      `,
      icon: `
        !w-5 !h-5 !border-0
        !mt-0 !mx-0
      `,
      timerProgressBar: '!h-1 !rounded-full',
      closeButton: `
        !text-gray-400 hover:!text-gray-600
        !text-2xl !leading-none
        transition-colors duration-200
        !absolute !top-3 !right-3
      `,
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  // ✅ Éxito
  success(message: string): void {
    this.baseToast.fire({
      icon: 'success',
      title: message,
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      color: '#065f46',
      iconColor: '#10b981',
      customClass: {
        popup: `
          !mt-4 !mr-4
          shadow-2xl rounded-xl border-2 border-emerald-200
          backdrop-blur-sm
          animate__animated animate__fadeInRight animate__faster
        `,
        timerProgressBar: '!bg-emerald-500',
      },
    });
  }

  // ⚠️ Advertencia
  warning(message: string): void {
    this.baseToast.fire({
      icon: 'warning',
      title: message,
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      color: '#92400e',
      iconColor: '#f59e0b',
      customClass: {
        popup: `
          !mt-4 !mr-4
          shadow-2xl rounded-xl border-2 border-amber-200
          backdrop-blur-sm
          animate__animated animate__fadeInRight animate__faster
        `,
        timerProgressBar: '!bg-amber-500',
      },
    });
  }

  // ❌ Error
  error(message: string): void {
    this.baseToast.fire({
      icon: 'error',
      title: message,
      background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
      color: '#991b1b',
      iconColor: '#ef4444',
      customClass: {
        popup: `
          !mt-4 !mr-4
          shadow-2xl rounded-xl border-2 border-red-200
          backdrop-blur-sm
          animate__animated animate__fadeInRight animate__faster
        `,
        timerProgressBar: '!bg-red-500',
      },
    });
  }

  // 🔍 Info
  info(message: string): void {
    this.baseToast.fire({
      icon: 'info',
      title: message,
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      color: '#1e40af',
      iconColor: '#3b82f6',
      customClass: {
        popup: `
          !mt-4 !mr-4
          shadow-2xl rounded-xl border-2 border-blue-200
          backdrop-blur-sm
          animate__animated animate__fadeInRight animate__faster
        `,
        timerProgressBar: '!bg-blue-500',
      },
    });
  }

  // 🗑 Confirmación modal
  confirm(
    message: string,
    title: string = '¿Estás seguro?',
    confirmText: string = 'Sí, continuar',
    cancelText: string = 'Cancelar'
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      background: '#ffffff',
      color: '#1f2937',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      focusCancel: false,
      customClass: {
        popup: `
          rounded-2xl shadow-2xl
          border border-gray-200
          !p-8
          animate__animated animate__zoomIn animate__faster
        `,
        title: '!text-xl !font-bold !text-gray-900 !mb-2',
        htmlContainer: '!text-gray-600 !text-base !mt-2 !mb-6',
        confirmButton: `
          !rounded-lg !px-6 !py-3 !font-semibold
          !shadow-md hover:!shadow-lg
          transition-all duration-200
        `,
        cancelButton: `
          !rounded-lg !px-6 !py-3 !font-semibold
          !shadow-sm hover:!shadow-md
          transition-all duration-200
        `,
      },
    });
  }
}
