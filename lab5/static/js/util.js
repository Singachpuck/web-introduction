function formDataToJson(formData) {
    const object = {};
    formData.forEach((value, key) => object[key] = value);
    return JSON.stringify(object);
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = `${name}=;expires=${new Date(0)};path=/`;
}

function updateCookie(cookieName, newValue) {
  document.cookie = `${cookieName}=${newValue}`;
}