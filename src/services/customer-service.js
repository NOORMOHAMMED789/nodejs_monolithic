const { CustomerRespository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require("../utils");
const { APIError, BadRequestError } = require('../utils/app-errors');


//All Business logic will be here
class CustomerService {
    
    constructor() {
        this.repository = new CustomerRespository();
    }

    async SignIn(userInputs) {
        
        const { email, password } = userInputs;
        try {
            const existingCustomer = await this.repository.FindCustomer({ email });
            if (existingCustomer) {
                const validPassword = await ValidatePassword(password, existingCustomer.password);
                if(validPassword) {
                    const token = await GenerateSignature({ email: existingCustomer.email });
                    return FormateData({ id: existingCustomer._id, token })
                }
            }
            return FormateData(null);
        } catch (err) {
            throw new APIError('Data not found',err)
        }
    }

    async SignUp(userInputs) {
        const { email, password, phone } = userInputs;
        try {
            //create salt
            let salt = await GenerateSalt();
            let userPassword = await GeneratePassword(password, salt);
            const existingCustomer = await this.repository.CreateCustomer({ email, password });
            const token = await GenerateSignature({ email: email, _id: existingCustomer._id });
            return FormateData({ id: existingCustomer.id, token });
        } catch (err) {
            throw new Error('Data not found',err)
        }
    }

    async AddNewAddress(_id, userInputs) {
        const { street, city, country } = userInputs;
        try {
            const addressResults = await this.repository.CreateAddress({ _id, street, city, country })
            return FormateData(addressResults)
        } catch (error) {
            throw new APIError('Data not found',err)
        }
    }
}