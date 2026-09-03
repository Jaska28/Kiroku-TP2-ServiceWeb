# Kiroku

## Tech stack

- [Next.js](https://nextjs.org/) with the App Router
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [daisyUI](https://daisyui.com/) for accessible UI components
- [Clerk](https://clerk.com/) for authentication and user management

## Requirements

Before starting, make sure you have the following installed:

- Node.js 20 or later
- npm
- A Clerk application with a publishable key and secret key

## Environment variables

Create a `.env` file at the root of the project and add your Clerk credentials:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

DATABASE_URL="DB_URL"
```

The `.env` file contains sensitive information and must not be committed to Git.

## Run the application locally

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available commands

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Start the production server
npm run lint   # Run ESLint
```

### ERD Diagram of DB

```mermaid
erDiagram
    User ||--o{ MediaList: "Owns"
    MediaList ||--o{ MediaListItem: "Has"
    Media ||--o{ MediaListItem: "is"
    User ||--o{ Review: "Writes"
    Media || --o{ Review: "Has"

    User {
        string userId
        string clerkId
        string username
        string? firstName
        string? lastName
        Role role

        dateTime createdAt
        dateTime updatedAt
    }

    Media {
        string mediaId
        int anilistId
        int? idMal
        string title
        float? avgScore

        dateTime createdAt
        dateTime updatedAt
    }

    MediaList {
        string mediaListId
        string userId
        string name
        string? desc
        boolean? isPublic

        dateTime createdAt
        dateTime updatedAt
    }

    MediaListItem {
        string mediaListItemId
        string mediaListId
        string mediaId

        dateTime createdAt
        dateTime updatedAt
    }

    Review {
        string reviewId
        string userId
        string mediaId
        float rating
        string? comments

        dateTime createdAt
        dateTime updatedAt
    }
```
