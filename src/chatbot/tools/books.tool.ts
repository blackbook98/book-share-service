import { FunctionTool } from '@google/adk';
import { z } from 'zod';

export const searchBooksTool = new FunctionTool({
  name: 'search_books',
  description:
    'Search for books by title, author, or topic using Google Books API',
  parameters: z.object({
    query: z
      .string()
      .describe('Search query — book title, author name, or topic'),
  }),
  execute: async ({ query }) => {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&langRestrict=en${apiKey ? `&key=${apiKey}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    const books = (data.items || []).map((item: any) => ({
      googleBooksId: item.id,
      title: item.volumeInfo?.title,
      description: item.volumeInfo?.description || '',
      volume_info: item.volumeInfo,
    }));

    return { books };
  },
});
