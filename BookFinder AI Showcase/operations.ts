import type { Task, GptResponse } from 'wasp/entities';
import type {
  GenerateGptResponse,
  CreateTask,
  DeleteTask,
  UpdateTask,
  GetGptResponses,
  GetAllTasksByUser,
} from 'wasp/server/operations';
import { HttpError } from 'wasp/server';
import { GeneratedSchedule } from './schedule';
import OpenAI from 'openai';

//SetupOpenAI is just making sure there is an API Key in the .env.server
const openai = setupOpenAI();
function setupOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    return new HttpError(500, 'OpenAI API key is not set');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
console.log("BeforeAPICall")
//#region Actions
type GptPayload = {};

export const generateGptResponse: GenerateGptResponse<GptPayload, GeneratedSchedule> = async (_payload, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const tasks = await context.entities.Task.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
  });

  const parsedTasks = tasks.map(({ description }) => ({
    description,
  }));

  try {
    // check if openai is initialized correctly with the API key
    if (openai instanceof Error) {
      throw openai;
    }


///This is commented out because subscription isn't set up yet.
    // const hasCredits = context.user.credits > 0;
    // const hasValidSubscription =
    //   !!context.user.subscriptionStatus &&
    //   context.user.subscriptionStatus !== 'deleted' &&
    //   context.user.subscriptionStatus !== 'past_due';
    // const canUserContinue = hasCredits || hasValidSubscription;

    // if (!canUserContinue) {
    //   throw new HttpError(402, 'User has not paid or is out of credits');
    // } else {
    //   console.log('decrementing credits');
    //   await context.entities.User.update({
    //     where: { id: context.user.id },
    //     data: {
    //       credits: {
    //         decrement: 1,
    //       },
    //     },
    //   });
    // }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a book expert. Your task is to list up to 30 books written by a given author without numbering them.'
        },
        {
          role: 'user',
          content: `List up to 50 books written by ${parsedTasks.map(task => task.description).join(', ')}. Please provide the list without any numbering or bullet points.`
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'parseBooks',
            description: 'Parses the author\'s name and returns up to 50 books written by the author, including a summary for each book.',
            parameters: {
              type: 'object',
              properties: {
                authorName: {
                  type: 'string',
                  description: 'Name of the author provided by user.',
                },
                booksList: {
                  type: 'array',
                  description: 'An array of objects, each containing a book name and its summary.',
                  items: {
                    type: 'object',
                    properties: {
                      bookName: {
                        type: 'string',
                        description: 'Name of the book.',
                      },
                      bookSummary: {
                        type: 'string',
                        description: 'Summary of the book.',
                      },
                    },
                    required: ['bookName', 'bookSummary'],
                  },
                },
              },
              required: ['authorName', 'booksList'],
            },
          },
        },
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'parseBooks',
        },
      },
      temperature: 0.2,
    });



    console.log('Raw completion response:', completion);
    console.log('Full message object:', JSON.stringify(completion.choices[0]?.message, null, 2));
    const gptArgs = completion?.choices[0]?.message?.tool_calls?.[0]?.function.arguments;

    if (!gptArgs) {
      throw new HttpError(500, 'Bad response from OpenAI');
    }
  
    console.log('gpt function call arguments: ', gptArgs);
  
    const { authorName, booksList } = JSON.parse(gptArgs);
  
    console.log('Author Name:', authorName);
    console.log('Books List:', booksList);
  
    const bookArray = booksList.map((book: { bookName: string, bookSummary: string }) => ({
      description: book.bookName,
      summary: book.bookSummary,
    }));
  
    const generatedSchedule: GeneratedSchedule = {
      authors: [{ name: authorName }],
      books: bookArray,
    };
  
    await context.entities.GptResponse.create({
      data: {
        user: { connect: { id: context.user.id } },
        content: JSON.stringify(generatedSchedule),
      },
    });
  
    return generatedSchedule;
    // await context.entities.GptResponse.create({
    //   data: {
    //     user: { connect: { id: context.user.id } },
    //     content: JSON.stringify(gptArgs),
    //   },
    // });

  //   return JSON.parse(gptArgs);
  } catch (error: any) {
    if (!context.user.subscriptionStatus && error?.statusCode != 402) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            increment: 1,
          },
        },
      });
    }
    console.error(error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Internal server error';
    throw new HttpError(statusCode, errorMessage);
  }
};

export const createTask: CreateTask<Pick<Task, 'description'>, Task> = async ({ description }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const task = await context.entities.Task.create({
    data: {
      description,
      user: { connect: { id: context.user.id } },
    },
  });

  return task;
};

export const updateTask: UpdateTask<Partial<Task>, Task> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const task = await context.entities.Task.update({
    where: {
      id,
    },
    data: {
      // isDone,
    },
  });

  return task;
};

export const deleteTask: DeleteTask<Pick<Task, 'id'>, Task> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const task = await context.entities.Task.delete({
    where: {
      id,
    },
  });

  return task;
};
//#endregion

//#region Queries
export const getGptResponses: GetGptResponses<void, GptResponse[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.GptResponse.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
  });
};

export const getAllTasksByUser: GetAllTasksByUser<void, Task[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Task.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
//#endregion
