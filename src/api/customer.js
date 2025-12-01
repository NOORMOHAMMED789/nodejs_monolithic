const CustomerService = require("../services/customer-service");
const UserAuth = require('./middlewares/auth');


module.exports = (app) => {

    const Service = new CustomerService()

    app.pst('/customer/signup', async(req, res, next) => {
        try {
            const { email, password, phone } = req.body;
            const { data } = await Service.SignUp({ email, password, phone });
            return res.json(data)
        } catch (err) {
            next(err)
        }
    })
}