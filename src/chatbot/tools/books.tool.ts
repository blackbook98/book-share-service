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

    const books = (data.items || []).map((item) => ({
      googleBooksId: item.id,
      title: item.volumeInfo?.title,
      authors: item.volumeInfo?.authors || [],
      categories: item.volumeInfo?.categories || [],
      description: (item.volumeInfo?.description || '').slice(0, 200),
      coverImage: item.volumeInfo?.imageLinks?.thumbnail,
      averageRating: item.volumeInfo?.averageRating,
    }));

    return { books };
  },
});
