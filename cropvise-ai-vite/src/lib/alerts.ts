import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// Custom emerald/primary theme for SweetAlert2
const commonOptions = {
  customClass: {
    popup: 'rounded-3xl border border-border bg-card text-foreground shadow-2xl',
    title: 'text-2xl font-bold font-display text-foreground',
    htmlContainer: 'text-muted-foreground font-sans',
    confirmButton: 'bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2',
    cancelButton: 'bg-muted text-muted-foreground px-8 py-3 rounded-xl font-bold hover:bg-muted/80 transition-all',
    footer: 'text-xs text-muted-foreground'
  },
  buttonsStyling: false,
  showClass: {
    popup: 'animate-in fade-in zoom-in duration-300'
  },
  hideClass: {
    popup: 'animate-out fade-out zoom-out duration-200'
  }
}

export const showAlert = {
  success: (title: string, text: string) => {
    return MySwal.fire({
      ...commonOptions,
      title,
      text,
      icon: 'success',
      iconColor: 'oklch(0.45 0.15 160)', // Primary emerald color
    })
  },
  error: (title: string, text: string) => {
    return MySwal.fire({
      ...commonOptions,
      title,
      text,
      icon: 'error',
      iconColor: 'oklch(0.577 0.245 27.325)', // Destructive color
    })
  },
  warning: (title: string, text: string) => {
    return MySwal.fire({
      ...commonOptions,
      title,
      text,
      icon: 'warning',
      iconColor: '#f59e0b', // Amber/Warning color
    })
  },
  confirm: (title: string, text: string, confirmText = 'Confirm', cancelText = 'Cancel') => {
    return MySwal.fire({
      ...commonOptions,
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      iconColor: 'oklch(0.45 0.15 160)',
    })
  },
  toast: (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
      customClass: {
        popup: 'rounded-xl border border-border bg-card/80 backdrop-blur-md text-foreground shadow-xl',
        title: 'text-sm font-semibold ml-2'
      }
    })
    return Toast.fire({
      icon,
      title,
      iconColor: icon === 'success' ? 'oklch(0.45 0.15 160)' : undefined
    })
  }
}
