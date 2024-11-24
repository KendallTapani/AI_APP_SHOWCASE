This is a showcase project I created: a basic book finder using the OpenAI API.

It’s built with Next.js, TypeScript, and Prisma, using the WASP framework, which should explain some of the import statements.
Check out the Bookfinder AI Showcase File and the DemoAppPage for details on the app's formatting and logistics. The operations.ts file contains most of the AI API-related code.

The app works by allowing users to type in the name of an author. It then prompts the OpenAI API, which returns a list of every book, article, comic, etc., written by that author in a format called "task."
While it’s not terribly sophisticated, the goal is to demonstrate a basic understanding of integrating software with an API, formatting the response, and utilizing it with TypeScript, HTML, and Tailwind.

This showcase is part of a larger project that uses Prisma to add, delete, and update author lists. The prisma stuff was too many files, so I just added the important files, which shows 90% of the material.
