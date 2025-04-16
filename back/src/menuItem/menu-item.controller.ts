import { Controller, Get, Param, } from '@nestjs/common';
import { MenuService } from './menu-item.service';




@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @Get(':userId')
    async getMenuByUserId(@Param('userId') userId: number) {
        const menu = await this.menuService.getMenuByUserId(userId);
        return menu;
    }
}