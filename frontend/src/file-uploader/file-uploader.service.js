const API_ROOT_URL = process.env.API_ROOT_URL || "http://localhost:3002";

export async function uploadImage(file, filename) {
  const formData = new FormData();
  formData.append('photo', file, filename);
  formData.append('name', filename);
  
  const promise = new Promise((resolve, reject) => {
    fetch(API_ROOT_URL + '/images', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        return resolve();
      } else {
        return reject(data.message);
      }
    });
  });

  return promise;
}