export default defineEventHandler((event) => {
  client.log('fff')
  return {
    test: 'test',
  }
})
