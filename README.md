# Lost-Found

## General Overview

This project seeks to improve the recovery and reporting of lost and found items and to instill students with hope that they may yet recover their lost items. People may report items they have found and describe them to a friend, who can then claim the item by providing campus administrators or campus police with a description of it. In addition, students have no way of knowing if their lost item was recovered and may wonder if they left their headphones on the bus or on campus; the proposed system enables students to search for and locate their lost items.

Suppose a student, Sebastian for example, discovers someone else's airpods at Gateway North. The individual then delivers the item to lost and found, possibly at Howe Centre or to Campus Police. The relevant authority (who has the ability to create a posting) can take the details of the student who found the item, as well as photographs of the item, and create an entry for the item. This item is then listed on the homepage for Lost and Found. Students can now view this item, its current location, and a brief description of it, and proceed to the appropriate location. Note that the student will be unable to view the location where this item was discovered. The authority at the help desk can then look up the item and its associated information, as well as verify the student's identity by asking them questions such as where they lost the item and by requiring them to unlock or connect devices such as smartphones and wireless earbuds to demonstrate ownership. In addition, they can request the student's ID, take a picture of the student with their ID, and enter the student's ID to keep track of who claimed the device. This information can be used to resolve any conflict and identify the rightful owner if another student claims the item. In addition, this application can track items that have been in inventory for an extended period of time, say a year or more, and allow administrators to update the status to destroyed, donated, or discarded.

## Course Technologies:

### ReactJs

This will be used as a JavaScript framework to build the UI of the application

### Redis

This will be used to cache the application data to serve it faster and effectively

### Firebase

This will be used to do the authentication of the user

### SASS

This will be used to design the UI of the application

## Independent Technologies:

### Docker

It’s an open platform for developing, shipping, and running applications. Docker enables you to separate your applications from your infrastructure so you can deliver software quickly. With Docker, you can manage your infrastructure in the same ways you manage your applications. We will create a docker image, which will contain all the required technologies to serve the application.

### Azure App Service

Azure Web Apps is a cloud computing based platform for hosting websites, created and operated by Microsoft. It is a platform as a service which allows publishing Web apps running on multiple frameworks and written in different programming languages. This technology will be used to deploy the application.

## App Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop)

### Installation

1. Clone the repository

```bash
git clone https://github.com/cs554-NoGroupName/Lost-Found.git
```

2. Open two terminals and navigate to the root directory of the project in both terminals

```bash
cd Lost-Found
```

3. Add the environment variables to the .env file as shown in the .env.example file

4. In the first terminal, run the following command to start the docker containers for the application

```bash
docker compose up
```

5. In the second terminal, run the following command to install the dependencies and start the application

```bash
cd client && npm install
npm start

```

6. Open a browser window and navigate to the url.

## Deployment

The application is deployed on Azure App Service and the docker image is hosted on Docker Hub.

There are two environments for the application - dev and prod. The dev environment is used for development and testing purposes and the prod environment is used for production.

CI/CD is setup for the application using GitHub Actions. Whenever a pull request is merged into the `dev` branch, the application is deployed to the dev environment and whenever a pull request is merged into the `main` branch, the application is deployed to the prod environment.

### Backend endpoints

Dev - https://lostandfounddev.azurewebsites.net

Prod - https://lostandfoundprod.azurewebsites.net

### Frontend

Dev - https://lostandfounddev.netlify.app

Prod - https://lostandfoundprod.netlify.app

## Contribution Guidelines

### Git Workflow

1. Create a new branch from the `dev` branch

```bash
git checkout dev
git pull
git checkout -b <branch-name>
```

2. Make changes to the code and commit them

```bash
git add .
git commit -m "commit message"
```

3. Once you're happy with your changes, pull latest changes from the `dev` branch and merge them into your branch

```bash
git pull origin dev
# resolve any merge conflicts
```

- Then push your changes to the remote branch

```bash
git push origin <branch-name>
```

4. Create a pull request from your branch to the `dev` branch. Atleast one other person should review your code and approve the pull request. (Note: Do not merge your own pull request)

- Should pass all the tests and linting checks.

5. Once the pull request is approved, merge it into the `dev` branch and delete the branch

6. After a feature is complete and tested properly, create a pull request from the `dev` branch to the `main` branch. Atleast one other person should review your code and approve the pull request before it can be merged into the `main` branch.
