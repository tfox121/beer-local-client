let currentMessages = {};

export function setI18nMessages(messages = {}) {
  currentMessages = messages;
}

export function tr(id, fallback = '') {
  if (!id) return fallback;
  const translated = currentMessages[id];
  if (translated == null || translated === '') {
    return fallback || id;
  }
  return translated;
}
