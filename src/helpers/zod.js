async function validationZod(schema, body) {
  return await schema.parseAsync(body, schema)
}

module.exports = {
  validationZod,
}
