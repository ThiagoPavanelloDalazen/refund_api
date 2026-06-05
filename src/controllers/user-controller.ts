import { Request, Response } from 'express';
import { z } from 'zod';
import { UserRole } from '@prisma/client'
import { prisma } from "@/database/prisma"
import { hash } from 'bcrypt';

class UsersController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
            email: z.string().trim().min(2, { message: "Email é obrigatório" }).toLowerCase(),
            password: z.string().min(6, { message: "A senha deve conter no mínimo 6 caracteres" }),
            role: z.enum([UserRole.employee, UserRole.manager]).default(UserRole.employee),
        })

        const { name, email, password, role } = bodySchema.parse(request.body);

        const userWithSameEmail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (userWithSameEmail) {
            return response.status(400).json({ message: "Email já cadastrado" })
        }

        const hashedPassword = await hash(password, 8);

        await prisma.user.create({
            data: {
                name, email, password: hashedPassword, role
            }
        })

        response.status(201).json({ message: "Usuário criado com sucesso" })
    }

}

export { UsersController };