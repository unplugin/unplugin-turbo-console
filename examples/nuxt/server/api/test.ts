export default defineEventHandler((event) => {
  Client.log('fff')
  return {
    test: 'test',
  }
})
