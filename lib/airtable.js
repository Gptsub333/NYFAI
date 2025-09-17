import Airtable from 'airtable';

const base = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY, // Make sure to set the AIRTABLE_API_KEY in .env
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID); // Set the base ID in your .env

export default base;
