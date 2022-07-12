export const setCookie = (c_name, value, expiredays) => {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    c_name +
    "=" +
    value +
    ";path=/" +
    (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
};
export const getCookie = (name) => {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
  }
  var end = document.cookie.indexOf(";", begin);
  if (end == -1) {
    end = dc.length;
  }
  return unescape(dc.substring(begin + prefix.length, end));
};
