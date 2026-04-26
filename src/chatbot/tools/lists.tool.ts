import { FunctionTool } from '@google/adk';
import { z } from 'zod';
import { UserService } from '../../user/user.service';

const listNameSchema = z.enum(['toRead', 'reading', 'finished']);

export const createListsTools = (userId: string, userService: UserService) => {
  const addToListTool = new FunctionTool({
    name: 'add_book_to_list',
    description: 'Add a book to the user reading list',
    parameters: z.object({
      googleBooksId: z.string().describe('The Google Books ID of the book'),
      title: z.string().describe('Title of the book'),
      listName: listNameSchema.describe('Which list to add the book to'),
      volumeInfo: z
        .record(z.string(), z.unknown())
        .describe(
          'volume_info from Google Books. Should contain title, description, authors, category, imageLinks, thumbnails, etc. whatever comes in the volume_info/volumeInfo field from the Google API search results.',
        ),
    }),
    execute: async ({ googleBooksId, title, listName, volumeInfo }) => {
      try {
        await userService.saveLists({
          book: {
            id: googleBooksId,
            volumeInfo: { title, ...(volumeInfo || {}) },
          },
          listName,
          user_id: userId,
        });
        return {
          success: true,
          message: `Added "${title}" to your ${listName.replace('_', ' ')} list`,
        };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
  });

  const getListsTool = new FunctionTool({
    name: 'get_reading_lists',
    description: 'Get the user current reading lists',
    parameters: z.object({
      listName: listNameSchema
        .optional()
        .describe('Which list to fetch — omit to get all lists'),
    }),
    execute: async ({ listName }) => {
      const lists = await userService.getLists(userId);
      const filtered = listName
        ? lists.filter((l) => l.list === listName)
        : lists;
      return { lists: filtered };
    },
  });

  const moveBookTool = new FunctionTool({
    name: 'move_book',
    description: 'Move a book from one list to another',
    parameters: z.object({
      googleBooksId: z.string().describe('Google Books ID of the book to move'),
      newList: listNameSchema.describe('The list to move the book to'),
    }),
    execute: async ({ googleBooksId, newList }) => {
      try {
        const lists = await userService.getLists(userId);
        const existing = lists.find((l) => l.book?.book_id === googleBooksId);
        if (!existing) {
          return { success: false, message: 'Book not found in your lists' };
        }
        await userService.saveLists({
          book: { id: googleBooksId, volumeInfo: existing.book.volume_info },
          listName: newList,
          user_id: userId,
        });
        return { success: true, message: `Book moved to ${newList}` };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
  });

  const removeBookTool = new FunctionTool({
    name: 'remove_book',
    description: 'Remove a book from the user lists',
    parameters: z.object({
      googleBooksId: z
        .string()
        .describe('Google Books ID of the book to remove'),
    }),
    execute: async ({ googleBooksId }) => {
      try {
        await userService.deleteList(googleBooksId, userId);
        return { success: true, message: 'Book removed from your lists' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
  });

  return [addToListTool, getListsTool, moveBookTool, removeBookTool];
};
