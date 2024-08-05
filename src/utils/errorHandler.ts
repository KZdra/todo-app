// src/utils/errorHandler.ts

import Swal from 'sweetalert2';

export const handleError = (error: any): void => {
  let errorMessage = 'Something went wrong';

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    switch (error.response.status) {
      case 400:
        errorMessage = error.response.message || 'Bad Request';
        break;
      case 401:
        errorMessage = error.response.message || 'Unauthorized: Incorrect email or password';
        break;
      case 403:
        errorMessage = error.response.message || 'Forbidden: You do not have permission to perform this action';
        break;
      case 404:
        errorMessage = error.response.message || 'Not Found: The requested resource could not be found';
        break;
      case 500:
        errorMessage = error.response.message || 'Internal Server Error';
        break;
      default:
        errorMessage = error.response.message || 'An error occurred';
    }
  } else  {
    // The request was made but no response was received
    errorMessage = 'No response received from server';
  }
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: errorMessage,
  });
};
