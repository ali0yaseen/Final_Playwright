export function uniqueEmail(prefix = 'student', domain = 'example.com'): string {
  const now = new Date();
  const stamp = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
    String(now.getUTCHours()).padStart(2, '0'),
    String(now.getUTCMinutes()).padStart(2, '0'),
    String(now.getUTCSeconds()).padStart(2, '0'),
    Math.floor(Math.random() * 1000)
  ].join('');
  return `${prefix}.${stamp}@${domain}`;
}
