module.exports = `
INSERT INTO tasks
(
  title,
  description,
  status,
  userName,
  userEmail,
  dateCreate
)
VALUES
(
  ?, --title
  ?, --description
  "0", --status
  ?, --userName
  ?, --userEmail
  SYSDATE() --dateCreate
);
`