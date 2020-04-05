const app = require('./app')
const models = require('./models')
const PORT = process.env.PORT || 3000

models.sequelize.sync({
  force: false
}).then(async _=> {
  console.log('디비설정정상으로 되고 있습니다.');
  
}).then(_=> {
  app.listen(PORT, () => console.log(`server is running localhost:${PORT}`))
})