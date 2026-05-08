const slugify = require("slugify");
const db = require("../model/db");

function toSlug(value) {
  return slugify(value || "", { lower: true, strict: true, trim: true });
}

async function generateUniqueSlug(tableName, title, excludeId = null) {
  const base = toSlug(title) || `icerik-${Date.now()}`;
  let candidate = base;
  let counter = 2;

  while (true) {
    const sql =
      excludeId != null
        ? `SELECT id FROM ${tableName} WHERE slug = ? AND id != ? LIMIT 1`
        : `SELECT id FROM ${tableName} WHERE slug = ? LIMIT 1`;
    const params = excludeId != null ? [candidate, excludeId] : [candidate];
    const [rows] = await db.execute(sql, params);

    if (!rows.length) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

module.exports = { toSlug, generateUniqueSlug };
