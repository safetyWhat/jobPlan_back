const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new customer
const createCustomer = async (req, res) => {
    try {
        const { name, address, phone, email } = req.body;
        const newCustomer = await prisma.customer.create({
            data: {
                name,
                address,
                phone,
                email,
            },
        });
        res.status(201).json({ success: true, data: newCustomer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create customer', error: error.message });
    }
};
// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await prisma.customer.findMany();
        res.status(200).json({ success: true, data: customers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
    }
};
// Get a single customer by ID
const getCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(id) },
        });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch customer', error: error.message });
    }
};
// Update a customer by ID
const updateCustomer = async (req, res) => {
    const { id } = req.params;

    // Confirm the customer exists
    const existingCustomer = await prisma.customer.findUnique({
        where: { id: parseInt(id) },
    });
    if (!existingCustomer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    // Filter undefined fields from req.body
    const updatedData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== undefined)
    );
    try {
        const updatedCustomer = await prisma.customer.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });
        res.status(200).json({ success: true, data: updatedCustomer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update customer', error: error.message });
    }
};
// Delete a customer by ID
const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCustomer = await prisma.customer.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true, data: deletedCustomer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete customer', error: error.message });
    }
};
// Search for customers by name
const searchCustomers = async (req, res) => {
    try {
        const { query } = req.query;
        const customers = await prisma.customer.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                ]
            }
        });
        res.status(200).json({ success: true, data: customers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to search customers', error: error.message });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
	searchCustomers,
};