# Simple Book Dashboard

## Running the program locally

On the root, run the following command:

```bash
npm i
# or
yarn
```

This should get all dependencies setup for the project to be one step ready to run.

After installation of the modules, run the command

```bash
yarn prisma migrate dev
# or
npx prisma migrate dev
```

This command should get all the schema set on `prisma/schema.prisma` and have it ready on the `PrismaClient()`. I used `prisma` as the DB of website.

To verify if prisma is working properly, run:

```bash
yarn prisma studio
# or
npx prisma studio
```

This will open up a new tab on your browser and show the prisma studio with the data on the prisma database. If you can see the page, then it is time to run the next command on a different terminal.

```bash
yarn dev
# or
npm run dev
```

The last command is all you need to get the website running. You may notice you are redirected to `login` page. Simply use this account

```bash
Role ADMIN
Username and Password: admin

Role USER
Username and Password: test
```

The reasoning for the two users will be explained down below after `Project`.

## Project

### Core Modules

The project uses the latest version of `React` with `NextJS`. For the styling, it uses `tailwindCSS`. For form validation, the project use `yup`, `react-hook-form` and `@hookform/resolvers/yup` to as the resolvers for `yup`. In case you are not familiar with `yup`, it is a schema object validation that is very straight forward and easy to use that speeds up the development of form validation.

### API

The website uses simple `fetch` to communicate with BE as this is also the default api for NextJS to use to retrieve and and manipulate data across the network.

All api files can be found under `/src/pages/api` where it integrates or uses the file-system based router. This means that any file added in the `pages` folder, it automatically becomes available as a `route`. However, adding a folder named `api` under `pages` holds a special functionality that will turn all files inside it as api routes.

### Structure

The project is composed of `components`, `sections`, `services` and `styles` folder.

#### Components

All re-usable elements are defined in this folder. Such elements or components are Modals, Buttons, Forms and many more that can be used over and over again on different parts of the page.

#### Sections

As the website only uses one page, this folder holds all sections of that particular page. This allows better maintenance and separation of logic for better code tracing when there are bugs or to add new features.

#### Services

This includes all files that is responsible on assisting the website in terms of re-usable functions, constants, resolvers, wrapped clients and so on. The folder, I believe, can be added inside of `components` but I decided to separate it outside as it's purpose is entirely different from how `components` folder works.

#### Pages

You may be wondering why I have not included this. The reason is because this is a default folder added by `NextJS`. As mentioned above, all routes are defined on the said folder.

## Why Use NextJS?

Honestly speaking, NextJS seems to be a bit overkill for the project as it only contains one single page. The only benefit that I find about this is the ability to build the API on the same project which is awesome and could have the ability to mock API response. However, I have thought of doing something crazy and decided to integrate `Prisma` as it serves as a database. Combining this with NextJS works like a charm but had to do a bit of research as it's my first time using `Prisma`. Turns out great in the end and a good learning experience to me as I've been wanting to try `Prisma` out.

## How does the website works?

The website automatically redirects you to the `login` page if no session is found.

How do we define a session? In the perfect world, it uses accessToken with expiration and refresh token. This allows secured login functionality for the users. Unfortunately, I did not implement it that way. Instead, I just use the `cuid` or `Collision Resistant Unique Identifier` of the database record id. I could have used `uuid` or `Universally Unique Identifier` but found it late that it's available on prisma schema. This is the simplest approach that I have to get this moving. The login route connects to the DB using the `PrismaClient` and once verified, the API will store a cookie using the said id. The cookie expires after an hour.

I have setup two roles for the user which is `ADMIN` and `USER`.

`ADMIN` basically can view, edit, delete and create anything on all of the sections of the website. The said role can view the `Dashboard` as well for reporting matter. On creating `USER`, the admin can assign categories to the user. What happens is that that categories will define how the users can work with the `Books` section.

`USER`, on the other hand, is created by the `ADMIN`. S/he cannot view the `Users`, `Dashboard` and `Categories` sections. The only section this role can access is the `Books`. However, there's a catch. The user cannot view all the books, add, update or delete any books. As mentioned above, the said account can only manage those books which falls under the `Categories` assigned to the user.

On every mutation that is completed, normally we refetch data. Here, the website plays with the state value which would act like the cache of the sections avoiding unnecessary refetch needed on the networks tab. The data is well verified from the API before it gets returned to the FE (Frontend) to be added manually to the cache or state.

For the dashboard, I added a little note so users won't forget about what it does. It shows three cards where it displays the total books (not soft deleted), total deleted books (soft deleted) and books owned per author (not soft deleted).

## What could be improved?

A lot.

There are still areas that can be improved such as using a state management to handle things globally and neatly. Honestly, I'm not a fan of `redux` but my go to state management is `zustand` as it's very simple and achieves what you want to get. If you are familiar with `graphQL`, it has `apollo vars` which basically is a global state that allows manipulation on different pages without the need of complex code.

Masking. I have not implemented masking as I did mention I will pass this early this week. I have not tried masking before because from my experience, we restrict users immediately from accessing something based from his/her role. I will need a bit of time to do some research and think of how it will fit well with the components created so I decided to skip this one.

Function re-usability. On the sections, there are a lot of code that can be re-used in the form of hooks. I was hesitant to do it this way as I will need more time on testing everything. I believe it can be achieved but with a couple of conditions to make it working.

Test cases. From my experience, I have only used Jest. I am not a master of it but I am knowledgeable on how to use it. I plan of using this on the components to ensure UI styling is not changed from other changes via snapshots. Consistent output by using mocks and spy on the functionalities inside of it. This can also be applied on the api folders under `services`.

User Restriction. Right now, users can perform CRUD on books as long as it's category falls under the categories set to role `USER`. Having a set of access rights would perfectly make it's restriction tighter and not allowing the said user to freely do anything with the categories assigned to him/her. My idea would be something like this:

```bash
Category: Sports
          Read    Write    Update     Delete
```

Where the CRUD operations are checkboxes.

## Timeline

The said project could be the MVP or let's say version 1. On the following days, masking can be implemented with proper improvements on the code. Following week should be well tested with Jest.

## How long did I work on this?

I started on it last Saturday. If I were to total my working hours deducting my time to pause because it's weekend, I believe it's 2 days.
