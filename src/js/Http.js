function loadData(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.addEventListener('load', () => {
      resolve(image.src);
    });
    image.addEventListener('error', () => {
      reject(new Error('Can not load image'));
    });
  });
}

async function getData(values, baseUrl) {
  const urls = [];
  let results = [];

  values.forEach((value) => {
    urls.push(`${baseUrl}${value}.jpg`);
  });

  const requests = urls.map((url) => loadData(url));
  try {
    results = await Promise.allSettled(requests);
  } catch (e) {
    throw new Error(e);
  }
  return results;
}

async function getResource(url) {
  const result = await loadData(url);
  return result;
}

export { getData, getResource };
