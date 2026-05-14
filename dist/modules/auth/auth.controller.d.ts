import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: import("./entities/user.entity").TUserRole;
        storeId: number;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            role: import("./entities/user.entity").TUserRole;
            storeId: number;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    logout(res: Response): {
        message: string;
    };
}
