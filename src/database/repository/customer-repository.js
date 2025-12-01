const { CustomerModel, AddressModel } = require("../models");
const { APIError, BadRequestError, STATUS_CODES } = require("../../utils/app-errors");


//Dealing with data base operations
class CustomerRepository {

    async CreateCustomer({ email, password, phone, salt }) {
        try {
            const customer = new CustomerModel({
                email,
                password,
                salt,
                phone,
                address: []
            })
            const customerResult = await customer.save();
            return customerResult;
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to create customer');
        }
    }

    async CreateAddress({ _id, street, postalCode, city, country}){
        try {
            const profile = await CustomerModel.findById(_id);
            if(profile) {
                const newAddress = new AddressModel({
                    street,
                    postalCode,
                    city,
                    country
                });
                await newAddress.save();
                profile.address.push(newAddress)
            }
        } catch (error) {
            
        }
    }
}