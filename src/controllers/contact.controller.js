import ContactRepository from "../repository/contacts.repository.js";



const getContacts = async (req, res) => {
  const data = await contactService.getContacts();
  res.json(data);
};

const createContact = async (req, res) => {
  const contact = req.body;
  const data = await contactService.createContact(contact);
  res.json(data);
};

const modifyContact = async (req, res) => {
  const id = req.params.id;
  const contact = req.body;
  const data = await contactService.modifyContact(id, contact);
  res.json(data);
};

const deleteContact = async (req, res) => {
  const id = req.params.id;
  const data = await contactService.deleteContact(id);
  res.json(data);
};

export default { getContacts, createContact, modifyContact, deleteContact };