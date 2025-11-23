import toast from 'react-hot-toast';

export const NotifyUser = (name = 'lorem notification',
  status = '',
  position = 'bottom-right',
  duration = 3000,) => {
  if (status == true) {
    toast.success(name,
      {
        duration: duration,
        position: position,
        // removeDelay: 500
      }
    )
  } else if (status == false) {
    toast.error(name,
      {
        duration: duration,
        position: position,
        // removeDelay: 500
      }
    )
  } else {
    toast(name,
      {
        duration: duration,
        position: position,
        removeDelay: 1500
      }
    )
  }
}
