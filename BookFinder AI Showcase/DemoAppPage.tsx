import { type Task } from 'wasp/entities';
import {
  generateGptResponse,
  deleteTask,
  createTask,
} from 'wasp/client/operations';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import type { GeneratedSchedule, Author, Book } from './schedule';
import { cn } from '../client/cn';

export default function DemoAppPage() {
  const [isAuthor, setIsAuthor] = useState(true); // true for author, false for subject
  const [isPopularity, setIsPopularity] = useState(true); // true for popularity, false for chronologic

  return (
    <div className='py-10 lg:mt-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
            <span className='text-purple-500'>Book</span> Finder
          </h2>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-white'>
          Toggle book or audiobook, Author or subject, Sorted by popularity or chronologic.
        </p>

        {/* Toggle Options */}
        <div className='flex justify-center space-x-6 mt-4'>
          {/* Author or Subject Toggle */}
          <button
            onClick={() => setIsAuthor(!isAuthor)}
            className={`flex items-center px-4 py-2 rounded-full ${
              isAuthor ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            <span className='mr-2'>{isAuthor ? '✍️' : '📚'}</span>
            {isAuthor ? 'Author' : 'Subject'}
          </button>

          {/* Popularity or Chronologic Toggle */}
          <button
            onClick={() => setIsPopularity(!isPopularity)}
            className={`flex items-center px-4 py-2 rounded-full ${
              isPopularity ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            <span className='mr-2'>{isPopularity ? '🔥' : '🕒'}</span>
            {isPopularity ? 'Popularity' : 'Chronologic'}
          </button>
        </div>

        {/* begin AI-powered Todo List */}
        <div className='my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10'>
          <div className='sm:w-[90%] md:w-[70%] lg:w-[50%] py-10 px-6 mx-auto my-8 space-y-10'>
            <NewTaskForm handleCreateTask={createTask} />
          </div>
        </div>
        {/* end AI-powered Todo List */}
      </div>
    </div>
  );
}

function NewTaskForm({ handleCreateTask }: { handleCreateTask: typeof createTask }) {
  const [description, setDescription] = useState<string>('');
  const [response, setResponse] = useState<GeneratedSchedule | null>(null);
  const [isPlanGenerating, setIsPlanGenerating] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      const task = await handleCreateTask({ description });
      setDescription('');
      return task;
    } catch (err: any) {
      window.alert('Error: ' + (err.message || 'Something went wrong'));
    }
  };

  const handleGeneratePlan = async (taskId: string) => {
    try {
      setIsPlanGenerating(true);
      const response = await generateGptResponse({});
      if (response) {
        setResponse(response);
      }
      // Automatically delete the task after generating the booklist
      await deleteTask({ id: taskId });
    } catch (err: any) {
      window.alert('Error: ' + (err.message || 'Something went wrong'));
    } finally {
      setIsPlanGenerating(false);
    }
  };

  return (
    <div className='flex flex-col justify-center gap-10'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between gap-3'>
          <input
            type='text'
            id='description'
            className='text-sm text-gray-600 w-full rounded-md border border-gray-200 bg-[#f5f0ff] shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
            placeholder='Enter author name'
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
        </div>
      </div>

      <button
        type='button'
        disabled={isPlanGenerating}
        onClick={async () => {
          try {
            // Create the task and get the task ID
            const task = await handleSubmit();
            if (task) {
              // Wait for a short delay to ensure the task is created
              await new Promise((resolve) => setTimeout(resolve, 500));

              // Generate the plan and delete the task
              await handleGeneratePlan(task.id);
            }
          } catch (err: any) {
            window.alert('Error: ' + (err.message || 'Something went wrong'));
          }
        }}
        className='flex items-center justify-center min-w-[7rem] font-medium text-gray-800/90 bg-yellow-50 shadow-md ring-1 ring-inset ring-slate-200 py-2 px-4 rounded-md hover:bg-yellow-100 duration-200 ease-in-out focus:outline-none focus:shadow-none hover:shadow-none disabled:opacity-70 disabled:cursor-not-allowed'
      >
        {isPlanGenerating ? (
          <>
            <CgSpinner className='inline-block mr-2 animate-spin' />
            Generating...
          </>
        ) : (
          'Generate Booklist'
        )}
      </button>

      {!!response && (
        <div className='flex flex-col'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Result</h3>
          <TaskTable schedule={response} />
        </div>
      )}
    </div>
  );
}

function TaskTable({ schedule }: { schedule: GeneratedSchedule }) {
  return (
    <div className='flex flex-col gap-6 py-6'>
      <table className='table-auto w-full border-separate border border-spacing-2 rounded-md border-slate-200 shadow-sm'>
        {!!schedule.authors ? (
          schedule.authors.map((author) => (
            <tr key={author.name}>
              <td className='text-center'>{author.name}</td>
            </tr>
          ))
        ) : (
          <div className='text-slate-600 text-center'>No authors found. Try again.</div>
        )}
        {!!schedule.books ? (
          schedule.books.map((book, index) => (
            <tr key={book.description + index}>
              <td className='text-center'>
                <strong>{book.description}</strong>
                <br />
                <span className='text-sm text-gray-500'>{book.summary}</span>
              </td>
            </tr>
          ))
        ) : (
          <div className='text-slate-600 text-center'>No books found. Try again.</div>
        )}
      </table>
    </div>
  );
}

function MainTaskTable({ authors, books }: { authors: Author[]; books: Book[] }) {
  return (
    <>
      <thead>
        <tr>
          <th
            className={cn(
              'flex items-center justify-between gap-5 py-4 px-3 text-white-800 border rounded-md border-slate-200 bg-opacity-70',
            )}
          >
            <span>Authors</span>
          </th>
        </tr>
      </thead>
      {!!authors ? (
        authors.map((author, index) => (
          <tbody key={author.name + index}>
            <tr>
              <td
                className={cn(
                  'flex items-center justify-between gap-4 py-2 px-3 text-white-800 border rounded-md border-purple-100 bg-opacity-60',
                )}
              >
                <span>{author.name}</span>
              </td>
            </tr>
          </tbody>
        ))
      ) : (
        <div className='text-slate-600 text-center'>No authors found. Try again.</div>
      )}
      <thead>
        <tr>
          <th
            className={cn(
              'flex items-center justify-between gap-5 py-4 px-3 text-white-800 border rounded-md border-slate-200 bg-opacity-70',
            )}
          >
            <span>Books</span>
          </th>
        </tr>
      </thead>
      {!!books ? (
        books.map((book, index) => (
          <tbody key={book.description + index}>
            <tr>
              <td
                className={cn(
                  'flex items-center justify-between gap-4 py-2 px-3 text-white-800 border rounded-md border-purple-100 bg-opacity-60',
                )}
              >
                <span>{book.description}</span>
                <br />
                <span className='text-sm text-gray-500'>{book.summary}</span>
              </td>
            </tr>
          </tbody>
        ))
      ) : (
        <div className='text-slate-600 text-center'>No books found. Try again.</div>
      )}
    </>
  );
}

function SubtaskTable({ description }: { description: string }) {
  return (
    <span className={cn('leading-tight justify-self-start w-full text-slate-600')}>
      {description}
    </span>
  );
}