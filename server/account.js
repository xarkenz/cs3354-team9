// Created by Isaac Philo
// April 4th, 2025

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function registerAccount(email, username, password, confirmationPassword){
    if(password !== confirmationPassword){
        return "Passwords do not match";
    }
    else{
        userSearchResult = await prisma.user.findUnique({
            where: {
                email: email
            },
        })
        if(userSearchResult === null){
            const createdUser = prisma.user.upsert({
                where: {
                    email: email
                },
                update: {
                    email: email,
                    username: username,
                    password: password,
                },
                create: {
                    email: email,
                    username: username,
                    password: password,
                },
            })
            return "User created";
        }
        else{
            return "Account already exists!";
        }
    }
}