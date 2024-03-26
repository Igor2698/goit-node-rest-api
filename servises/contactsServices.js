import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





const contactsPath = path.resolve(__dirname, "../db/contacts.json");


const getAll = async () => {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
}

const getContactById = async (id) => {
    const contacts = await getAll();
    const result = contacts.find(contact => contact.id === id);
    return result || null
}

const addContact = async (data) => {
    const contacts = await getAll();
    const newContact = {
        id: nanoid(),
        ...data
    }
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return newContact;
}


const deleteOneContact = async (id) => {
    const contacts = await getAll();
    const index = contacts.findIndex(contact => contact.id === id);

    if (index === -1) {
        return null
    }

    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return result

}

const updateContact = async (id, newData) => {
    const contacts = await getAll();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
        return null
    }

    contacts[index] = { ...contacts[index], ...newData };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
}


export {
    getAll,
    getContactById,
    addContact,
    deleteOneContact,
    updateContact
}