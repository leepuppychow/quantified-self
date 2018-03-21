export default Handler => {
  const handler = new Handler(document)
  handler.populate()
  handler.listen()
}
