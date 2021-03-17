module.exports = `
SELECT
  *
FROM
  tasks
WHERE
  title like '%' || coalesce(?, '') || '%'
`